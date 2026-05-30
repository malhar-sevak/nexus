import "./globals.css";
import PageTransition from "../components/PageTransition";

export const metadata = {
    metadataBase: new URL("https://nexus-ai.vercel.app"), // update with your real domain
    title: {
        default:  "Nexus — Live AI & ML News, Curated by AI",
        template: "%s | Nexus",
    },
    description:
        "Real-time artificial intelligence and machine learning news from OpenAI, DeepMind, arXiv, Hugging Face and 20+ sources — curated by AI, delivered every hour.",
    keywords: [
        "AI news", "machine learning", "LLM", "GPT", "artificial intelligence",
        "deep learning", "OpenAI", "DeepMind", "Hugging Face", "AI research",
        "neural networks", "generative AI", "AI tools", "machine learning news",
    ],
    authors: [{ name: "Nexus" }],
    creator: "Nexus",
    openGraph: {
        type:        "website",
        locale:      "en_US",
        title:       "Nexus — Live AI & ML News",
        description: "Real-time AI and ML news from 20+ sources, curated by AI. Updated every hour.",
        siteName:    "Nexus",
    },
    twitter: {
        card:        "summary_large_image",
        title:       "Nexus — Live AI & ML News",
        description: "Real-time AI and ML news from 20+ sources, curated by AI.",
        creator:     "@nexus_ai",
    },
    robots: {
        index:             true,
        follow:            true,
        googleBot: {
            index:             true,
            follow:            true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet":       -1,
        },
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                {/* Preconnect to Google Fonts for faster loading */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body>
                <PageTransition>
                    {children}
                </PageTransition>
            </body>
        </html>
    );
}