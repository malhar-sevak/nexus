"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getSourcesDetail } from "../../lib/api";

const CATEGORY_ORDER = [
    "Industry",
    "Research",
    "Community",
    "LLMs",
    "Tools",
    "Newsletter",
];

const CATEGORY_LABELS = {
    Industry: "Official Blogs & Tech Media",
    Research: "Research",
    Community: "Community",
    LLMs: "LLMs",
    Tools: "Tools",
    Newsletter: "Newsletters",
};

const CATEGORY_COLORS = {
    Industry: { color: "#f87171", bg: "#1a0a0a", border: "#f8717133" },
    Research: { color: "#4ade80", bg: "#0a1a0a", border: "#4ade8033" },
    Community: { color: "#c084fc", bg: "#160a1a", border: "#c084fc33" },
    LLMs: { color: "#00d4ff", bg: "#0a1929", border: "#00d4ff33" },
    Tools: { color: "#fbbf24", bg: "#1a1500", border: "#fbbf2433" },
    Newsletter: { color: "#818cf8", bg: "#0d0d1a", border: "#818cf833" },
};

const SOURCE_URLS = {
    "OpenAI": "https://openai.com/blog",
    "Google DeepMind": "https://deepmind.google/blog",
    "Hugging Face": "https://huggingface.co/blog",
    "Meta AI": "https://ai.meta.com/blog",
    "TechCrunch AI": "https://techcrunch.com/category/artificial-intelligence",
    "The Verge AI": "https://www.theverge.com/ai-artificial-intelligence",
    "VentureBeat AI": "https://venturebeat.com/category/ai",
    "Wired AI": "https://www.wired.com/tag/artificial-intelligence",
    "ArXiv AI": "https://arxiv.org/list/cs.AI/recent",
    "ArXiv ML": "https://arxiv.org/list/cs.LG/recent",
    "IEEE Spectrum AI": "https://spectrum.ieee.org/topic/artificial-intelligence",
    "Anthropic Community": "https://community.anthropic.com",
    "Reddit MachineLearning": "https://www.reddit.com/r/MachineLearning",
    "Reddit LocalLLaMA": "https://www.reddit.com/r/LocalLLaMA",
    "Reddit Artificial": "https://www.reddit.com/r/artificial",
    "Hacker News AI": "https://news.ycombinator.com",
    "Yannic Kilcher": "https://www.youtube.com/@YannicKilcher",
    "Two Minute Papers": "https://www.youtube.com/@TwoMinutePapers",
    "TLDR AI": "https://tldr.tech/ai",
};

export default function SourcesPage() {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(0);
    const [uniqueCount, setUniqueCount] = useState(0);

    useEffect(() => {
        getSourcesDetail()
            .then(data => {
                setSources(data.sources);
                // Total articles fetched
                setTotal(data.sources.reduce((sum, s) => sum + s.article_count, 0));
                // Unique source names only
                const unique = new Set(data.sources.map(s => s.name));
                setUniqueCount(unique.size);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Group sources by category
    const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
        const items = sources.filter(s => s.category === cat);
        if (items.length > 0) acc[cat] = items;
        return acc;
    }, {});

    return (
        <div style={{ minHeight: "100vh", background: "#07090f" }}>
            <Navbar search={search} setSearch={setSearch} onSearch={() => { }} />

            <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px" }}>

                {/* Header */}
                <div style={{ marginBottom: "48px" }} className="fade-up">
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        background: "rgba(0,212,255,0.08)",
                        border: "1px solid rgba(0,212,255,0.2)",
                        borderRadius: "100px", padding: "4px 14px", marginBottom: "20px",
                    }}>
                        <span className="live-dot" />
                        <span style={{ fontSize: "11px", color: "#00d4ff", fontFamily: "'Space Mono', monospace" }}>
                            {sources.length} SOURCES ACTIVE
                        </span>
                    </div>

                    <h1 style={{
                        fontFamily: "'Syne', sans-serif", fontWeight: "800",
                        fontSize: "clamp(28px, 4vw, 48px)", color: "#cdd9e5",
                        lineHeight: "1.15", marginBottom: "12px",
                    }}>
                        Where we get our <span style={{ color: "#00d4ff" }}>news from.</span>
                    </h1>
                    <p style={{
                        color: "#444c56", fontSize: "14px",
                        fontFamily: "'DM Sans', sans-serif", maxWidth: "480px",
                    }}>
                        Nexus pulls from {sources.length} trusted sources across AI, ML and tech —
                        fetched every hour, summarized by AI.
                    </p>
                </div>

                {/* Stats Bar */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: "12px", marginBottom: "48px",
                }} className="fade-up-delay-1">
                    {[
                        { label: "Total Sources", value: uniqueCount },
                        { label: "Articles Fetched", value: total.toLocaleString() },
                        { label: "Categories", value: Object.keys(grouped).length },
                        { label: "Update Frequency", value: "Every 1hr" },
                    ].map(({ label, value }) => (
                        <div key={label} style={{
                            background: "#0d1117", border: "1px solid #1c2333",
                            borderRadius: "12px", padding: "16px 20px",
                        }}>
                            <div style={{ fontSize: "10px", color: "#444c56", fontFamily: "'Space Mono', monospace", marginBottom: "8px" }}>
                                {label.toUpperCase()}
                            </div>
                            <div style={{ fontSize: "24px", fontWeight: "700", color: "#00d4ff", fontFamily: "'Syne', sans-serif" }}>
                                {value}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Sources grouped by category */}
                {loading ? (
                    <div style={{
                        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: "16px",
                    }}>
                        {[...Array(6)].map((_, i) => (
                            <div key={i} style={{
                                background: "#0d1117", border: "1px solid #1c2333",
                                borderRadius: "12px", height: "120px", opacity: 0.5,
                            }} />
                        ))}
                    </div>
                ) : (
                    Object.entries(grouped).map(([category, items]) => {
                        const style = CATEGORY_COLORS[category] || CATEGORY_COLORS.Industry;
                        return (
                            <div key={category} style={{ marginBottom: "40px" }}>

                                {/* Category heading */}
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "12px",
                                    marginBottom: "16px",
                                }}>
                                    <div style={{
                                        width: "8px", height: "8px", borderRadius: "50%",
                                        background: style.color, flexShrink: 0,
                                    }} />
                                    <span style={{
                                        fontSize: "11px", fontFamily: "'Space Mono', monospace",
                                        color: style.color, fontWeight: "700", letterSpacing: "0.1em",
                                    }}>
                                        {CATEGORY_LABELS[category] || category.toUpperCase()}
                                    </span>
                                    <div style={{ flex: 1, height: "1px", background: "#1c2333" }} />
                                    <span style={{ fontSize: "10px", color: "#1c2333", fontFamily: "'Space Mono', monospace" }}>
                                        {items.length} {items.length === 1 ? "SOURCE" : "SOURCES"}
                                    </span>
                                </div>

                                {/* Source cards grid */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                                    gap: "12px",
                                }}>
                                    {items.map((source) => (
                                        <a
                                            key={source.name}
                                            href={SOURCE_URLS[source.name] || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ textDecoration: "none" }}
                                        >
                                            <div style={{
                                                background: "#0d1117",
                                                border: "1px solid #1c2333",
                                                borderRadius: "12px", padding: "16px 18px",
                                                transition: "border-color 0.2s, transform 0.2s",
                                                cursor: "pointer",
                                            }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.borderColor = style.color;
                                                    e.currentTarget.style.transform = "translateY(-2px)";
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.borderColor = "#1c2333";
                                                    e.currentTarget.style.transform = "translateY(0)";
                                                }}
                                            >
                                                {/* Source name */}
                                                <div style={{
                                                    fontSize: "13px", fontWeight: "700",
                                                    color: "#cdd9e5", fontFamily: "'Syne', sans-serif",
                                                    marginBottom: "8px",
                                                }}>
                                                    {source.name}
                                                </div>

                                                {/* Article count */}
                                                <div style={{
                                                    fontSize: "11px", color: "#444c56",
                                                    fontFamily: "'Space Mono', monospace",
                                                    marginBottom: "12px",
                                                }}>
                                                    {source.article_count.toLocaleString()} articles fetched
                                                </div>

                                                {/* Visit link */}
                                                <div style={{
                                                    display: "flex", alignItems: "center", gap: "5px",
                                                    fontSize: "11px", color: style.color,
                                                    fontFamily: "'Space Mono', monospace",
                                                }}>
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                                        <polyline points="15 3 21 3 21 9" />
                                                        <line x1="10" y1="14" x2="21" y2="3" />
                                                    </svg>
                                                    Visit Source
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </main>

            <Footer />
        </div>
    );
}