import ArticleFeed from "../components/ArticleFeed";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// ── Metadata — fully rich Open Graph + Twitter cards ─────────────────────────
export const metadata = {
    title: "Nexus — Live AI & ML News, Curated by AI",
    description:
        "Real-time artificial intelligence and machine learning news from OpenAI, DeepMind, arXiv, Hugging Face and 20+ sources — curated by AI, delivered every hour.",
    keywords: [
        "AI news", "machine learning news", "LLM news", "artificial intelligence",
        "deep learning", "OpenAI", "DeepMind", "Hugging Face", "arXiv papers",
    ],
    openGraph: {
        type:        "website",
        title:       "Nexus — Live AI & ML News",
        description: "Real-time AI news from 20+ sources, curated by AI. Updated every hour.",
        siteName:    "Nexus",
    },
    twitter: {
        card:        "summary_large_image",
        title:       "Nexus — Live AI & ML News",
        description: "Real-time AI news from 20+ sources, curated by AI.",
    },
    alternates: {
        canonical: "/",
    },
};

// ── Server-side data fetchers ─────────────────────────────────────────────────

async function fetchArticles() {
    try {
        const res = await fetch(`${API_BASE}/api/articles?page=1&limit=20&sort_by=latest`, {
            next: { revalidate: 300 }, // re-fetch every 5 minutes on Vercel / prod
        });
        if (!res.ok) return { articles: [], total: 0 };
        return res.json();
    } catch {
        return { articles: [], total: 0 };
    }
}

async function fetchCategories() {
    try {
        const res = await fetch(`${API_BASE}/api/categories`, { next: { revalidate: 3600 } });
        if (!res.ok) return { categories: ["All"] };
        return res.json();
    } catch {
        return { categories: ["All"] };
    }
}

async function fetchSources() {
    try {
        const res = await fetch(`${API_BASE}/api/sources`, { next: { revalidate: 3600 } });
        if (!res.ok) return { sources: [] };
        return res.json();
    } catch {
        return { sources: [] };
    }
}

async function fetchCatCounts() {
    try {
        const res = await fetch(`${API_BASE}/api/categories/counts`, { next: { revalidate: 300 } });
        if (!res.ok) return { counts: {} };
        return res.json();
    } catch {
        return { counts: {} };
    }
}

// ── Page — Server Component ───────────────────────────────────────────────────
export default async function Home() {
    // All fetches run in parallel on the server before any HTML is sent
    const [articlesData, categoriesData, sourcesData, countsData] = await Promise.all([
        fetchArticles(),
        fetchCategories(),
        fetchSources(),
        fetchCatCounts(),
    ]);

    const initialArticles    = articlesData.articles    || [];
    const initialTotal       = articlesData.total       || 0;
    const initialCategories  = categoriesData.categories || ["All"];
    const initialSources     = sourcesData.sources      || [];
    const initialCatCounts   = countsData.counts        || {};

    return (
        <>
            {/*
              Hidden semantic article list — crawled by Google, invisible to users.
              This ensures every article title + summary is in the raw HTML that
              search engine bots receive, even before JS executes.
            */}
            <div style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", opacity: 0, pointerEvents: "none" }} aria-hidden="true">
                <h1>Nexus — Live AI &amp; ML News Feed</h1>
                <p>Real-time AI and machine learning news curated by artificial intelligence from OpenAI, DeepMind, arXiv, Hugging Face and 20+ leading sources. Updated every hour.</p>
                {initialArticles.map(a => (
                    <article key={a.id}>
                        <h2>{a.title}</h2>
                        {a.summary && <p>{a.summary}</p>}
                        <span>{a.source_name}</span>
                        {a.published_at && <time dateTime={a.published_at}>{a.published_at}</time>}
                    </article>
                ))}
            </div>

            {/* Interactive feed — hydrates client-side after initial SSR */}
            <ArticleFeed
                initialArticles={initialArticles}
                initialTotal={initialTotal}
                initialCategories={initialCategories}
                initialSources={initialSources}
                initialCatCounts={initialCatCounts}
            />
        </>
    );
}