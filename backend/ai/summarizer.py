import httpx
import os
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Fallback chain — tries each model one by one
MODELS = [
    "openrouter/auto",
    "mistralai/mistral-7b-instruct:free",
    "google/gemma-3-4b-it:free",
    "qwen/qwen2.5-7b-instruct:free",
    "openai/gpt-oss-20b:free",
]

async def tag_and_summarize(title: str, url: str) -> dict:
    prompt = f"""You are an AI news curator for a platform called Nexus.
Given the article title below, do two things:
1. Assign ONE category from this list only: LLMs, Vision, Robotics, Research, Tools, Industry, Community
2. Write a 2 line summary of what this article is likely about

Article Title: {title}

Respond in this exact format and nothing else:
CATEGORY: <category>
SUMMARY: <2 line summary>"""

    for model in MODELS:
        print(f"Trying model: {model}")
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "user", "content": prompt}
                    ],
                },
                timeout=30.0
            )

            data = response.json()

            if "error" in data:
                print(f"Model {model} failed: {data['error']['message']}")
                content = data["choices"][0]["message"]["content"].strip()

            # Parse response
            category = "Industry"
            summary  = "Summary unavailable — will retry later."

            for line in content.split("\n"):
                if line.startswith("CATEGORY:"):
                    category = line.replace("CATEGORY:", "").strip()
                elif line.startswith("SUMMARY:"):
                    summary = line.replace("SUMMARY:", "").strip()

            return {"category": category, "summary": summary}

        except Exception as e:
            print(f"Model {model} error: {e}")
            continue
    
    return {
        "category": "Industry",
        "summary": "Summary coming soon — our AI is taking a short break! Check the full article via the link."
    }