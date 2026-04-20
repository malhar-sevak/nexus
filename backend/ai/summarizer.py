import httpx
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

MODELS = [
    "openrouter/auto",
    "mistralai/mistral-7b-instruct:free",
    "google/gemma-3-4b-it:free",
    "qwen/qwen2.5-7b-instruct:free",
]

FALLBACK_RESULT = {
    "category": "Industry",
    "summary": "Summary coming soon — our AI is taking a short break! Check the full article via the link."
}

async def tag_and_summarize_batch(articles: list) -> list:
    # Build numbered list of titles for the prompt
    numbered = "\n".join(
        [f"{i+1}. {a.title}" for i, a in enumerate(articles)]
    )

    prompt = f"""You are an AI news curator for a platform called Nexus.
For each article title below, do two things:
1. Assign ONE category from this list only: LLMs, Vision, Robotics, Research, Tools, Industry, Community, Newsletter
2. Write a 2 line summary of what this article is likely about

Articles:
{numbered}

Respond in this exact format for each article and nothing else:
1. CATEGORY: <category> | SUMMARY: <2 line summary>
2. CATEGORY: <category> | SUMMARY: <2 line summary>
and so on for all articles."""

    for model in MODELS:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": model,
                        "messages": [
                            {"role": "user", "content": prompt}
                        ],
                    },
                    timeout=60.0
                )

            data = response.json()

            if "error" in data:
                print(f"Model {model} failed: {data['error']['message']}")
                continue

            content = data["choices"][0]["message"]["content"].strip()
            results = parse_batch_response(content, len(articles))
            return results

        except Exception as e:
            print(f"Model {model} error: {e}")
            continue

    # All models failed — return fallback for all articles
    return [FALLBACK_RESULT for _ in articles]


def parse_batch_response(content: str, expected_count: int) -> list:
    results = []
    lines   = [l.strip() for l in content.split("\n") if l.strip()]

    for line in lines:
        # Match lines starting with a number like "1." or "1)"
        if not line or not line[0].isdigit():
            continue

        try:
            # Remove the number prefix
            line = line.split(".", 1)[-1].strip()
            line = line.split(")", 1)[-1].strip()

            category = "Industry"
            summary  = FALLBACK_RESULT["summary"]

            if "CATEGORY:" in line and "SUMMARY:" in line:
                parts    = line.split("|")
                category = parts[0].replace("CATEGORY:", "").strip()
                summary  = parts[1].replace("SUMMARY:", "").strip()

            results.append({
                "category": category,
                "summary":  summary
            })

        except Exception:
            results.append(FALLBACK_RESULT)

    # If parsing gave fewer results than expected, pad with fallback
    while len(results) < expected_count:
        results.append(FALLBACK_RESULT)

    return results[:expected_count]