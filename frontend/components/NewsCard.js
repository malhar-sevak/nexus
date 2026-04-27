import { formatDistanceToNow, isAfter, subHours } from "date-fns";
import { useState } from "react";

const CATEGORY_STYLES = {
    LLMs: { bg: "#0d2e1f", color: "#00ff88", border: "#00ff8840" },
    Vision: { bg: "#0d1a2e", color: "#60a5fa", border: "#60a5fa40" },
    Robotics: { bg: "#2e1a0d", color: "#fb923c", border: "#fb923c40" },
    Research: { bg: "#1a2e0d", color: "#a3e635", border: "#a3e63540" },
    Tools: { bg: "#2e280d", color: "#fbbf24", border: "#fbbf2440" },
    Industry: { bg: "#2e0d0d", color: "#f87171", border: "#f8717140" },
    Community: { bg: "#2e0d2e", color: "#e879f9", border: "#e879f940" },
    Newsletter: { bg: "#0d1a2e", color: "#818cf8", border: "#818cf840" },
};

export default function NewsCard({ article, index = 0 }) {
    const [expanded, setExpanded] = useState(false);

    const timeAgo = article.published_at
        ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
        : "Recently";

    const isFresh = article.published_at
        ? isAfter(new Date(article.published_at), subHours(new Date(), 24))
        : false;

    const style = CATEGORY_STYLES[article.category] || CATEGORY_STYLES.Industry;

    return (
        <div
            className="card-hover"
            style={{
                background: "#0e0e1a",
                border: "1px solid #1e1e2e",
                borderRadius: "16px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                animation: `fadeUp 0.4s ease ${index * 0.05}s forwards`,
                opacity: 0,
            }}
        >
            {/* Image */}
            <div style={{ position: "relative", width: "100%", height: "180px", overflow: "hidden", background: "#131325" }}>
                <img
                    src={article.image_url || "https://placehold.co/600x400/0e0e1a/00ff88?text=NEXUS"}
                    alt={article.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85, transition: "opacity 0.3s, transform 0.4s" }}
                    onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.transform = "scale(1.04)"; }}
                    onMouseLeave={e => { e.target.style.opacity = 0.85; e.target.style.transform = "scale(1)"; }}
                    onError={e => { e.target.src = "https://placehold.co/600x400/0e0e1a/00ff88?text=NEXUS"; }}
                />

                {/* Top row — category + fresh badge */}
                <div style={{ position: "absolute", top: "12px", left: "12px", right: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {/* Category */}
                    <div style={{
                        background: style.bg, color: style.color,
                        border: `1px solid ${style.border}`,
                        borderRadius: "6px", padding: "3px 10px",
                        fontSize: "10px", fontFamily: "'Space Mono', monospace",
                        fontWeight: "700", letterSpacing: "0.05em",
                    }}>
                        {article.category || "GENERAL"}
                    </div>

                    {/* Fresh badge */}
                    {isFresh && (
                        <div style={{
                            background: "rgba(0,255,136,0.15)",
                            border: "1px solid rgba(0,255,136,0.4)",
                            borderRadius: "6px", padding: "3px 10px",
                            fontSize: "10px", fontFamily: "'Space Mono', monospace",
                            color: "#00ff88", fontWeight: "700",
                            display: "flex", alignItems: "center", gap: "5px",
                        }}>
                            <span style={{
                                width: "5px", height: "5px", borderRadius: "50%",
                                background: "#00ff88", display: "inline-block",
                                animation: "pulse-dot 1.2s ease infinite",
                            }} />
                            FRESHLY SERVED
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>

                {/* Time */}
                <div style={{ fontSize: "11px", color: "#475569", fontFamily: "'Space Mono', monospace" }}>
                    {timeAgo}
                </div>

                {/* Title */}
                <h2 style={{
                    color: "#e2e8f0", fontFamily: "'Syne', sans-serif",
                    fontWeight: "700", fontSize: "14px", lineHeight: "1.4",
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical", overflow: "hidden",
                }}>
                    {article.title}
                </h2>

                {/* Summary — expandable */}
                <div>
                    <p style={{
                        color: "#475569", fontSize: "12px", lineHeight: "1.7",
                        display: expanded ? "block" : "-webkit-box",
                        WebkitLineClamp: expanded ? "unset" : 2,
                        WebkitBoxOrient: "vertical",
                        overflow: expanded ? "visible" : "hidden",
                        transition: "all 0.3s ease",
                    }}>
                        {article.summary || "Summary coming soon..."}
                    </p>

                    {/* Show more / less toggle */}
                    {article.summary && article.summary.length > 120 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            style={{
                                background: "none", border: "none",
                                color: "#00ff88", fontSize: "11px",
                                fontFamily: "'Space Mono', monospace",
                                cursor: "pointer", padding: "4px 0",
                                marginTop: "4px",
                            }}
                        >
                            {expanded ? "▲ show less" : "▼ read more"}
                        </button>
                    )}
                </div>

                {/* Footer */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: "12px", borderTop: "1px solid #1e1e2e", marginTop: "auto",
                }}>
                    {/* Source */}
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: style.color }} />
                        <span style={{ fontSize: "11px", color: "#475569", fontFamily: "'DM Sans', sans-serif" }}>
                            {article.source_name}
                        </span>
                    </div>

                    {/* Read more */}

                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Read full article"
                        style={{
                            display: "flex", alignItems: "center", gap: "5px",
                            color: "#00ff88", fontSize: "11px",
                            fontFamily: "'Space Mono', monospace",
                            textDecoration: "none", transition: "opacity 0.2s",
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Read more
                    </a>
                </div>
            </div>
        </div >
    );
}