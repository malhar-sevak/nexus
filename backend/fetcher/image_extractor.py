import requests
from bs4 import BeautifulSoup

# Default images per category if no image found
DEFAULT_IMAGES = {
    "Industry":  "https://placehold.co/600x400?text=Industry+News",
    "Research":  "https://placehold.co/600x400?text=Research",
    "Tools":     "https://placehold.co/600x400?text=Tools",
    "LLMs":      "https://placehold.co/600x400?text=LLMs",
    "Community": "https://placehold.co/600x400?text=Community",
    "Newsletter":"https://placehold.co/600x400?text=Newsletter",
}

def get_image_from_url(url, category="Industry"):
    try:
        headers = {"User-Agent": "Mozilla/5.0"}
        response = requests.get(url, timeout=5, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        # Try og:image first
        og_image = soup.find("meta", property="og:image")
        if og_image and og_image.get("content"):
            return og_image["content"]

        # Try twitter:image as fallback
        twitter_image = soup.find("meta", attrs={"name": "twitter:image"})
        if twitter_image and twitter_image.get("content"):
            return twitter_image["content"]

    except Exception:
        pass

    # Return default image for category
    return DEFAULT_IMAGES.get(category, "https://placehold.co/600x400?text=Nexus")