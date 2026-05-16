import { formatDistanceToNow } from "date-fns";

const CATEGORY_COLORS = {
    LLMs: "#00d4ff",
    Vision: "#60a5fa",
    Robotics: "#fb923c",
    Research: "#4ade80",
    Tools: "#fbbf24",
    Industry: "#f87171",
    Community: "#c084fc",
    Newsletter: "#818cf8",
};

export default function TrendingStrip({ articles }) {
    if (!articles || articles.length === 0) return null;

    return (
        <div style={{
            background: "#0d1117",
            border: "1px solid #1c2333",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "32px",
        }}>
            {/* Header */}
            <div style={{
                display: "flex", alignItems: "center", gap: "8px",
                marginBottom: "14px",
            }}>
                <span style={{
                    fontSize: "10px", fontFamily: "'Space Mono', monospace",
                    color: "#00d4ff", fontWeight: "700", letterSpacing: "0.1em",
                }}>🔥 TRENDING NOW</span>
                <div style={{ flex: 1, height: "1px", background: "#1c2333" }} />
            </div>

            {/* Articles */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {articles.map((article, i) => {
                    const color = CATEGORY_COLORS[article.category] || "#00d4ff";
                    const timeAgo = article.published_at
                        ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
                        : "Recently";

                    return (
                        <a
                            key={article.id}
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                        >
                            <div style={{
                                display: "flex", alignItems: "center", gap: "14px",
                                padding: "10px 12px", borderRadius: "8px",
                                border: "1px solid transparent",
                                transition: "border-color 0.2s, background 0.2s",
                                cursor: "pointer",
                            }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = "#1c2333";
                                    e.currentTarget.style.background = "#111827";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = "transparent";
                                    e.currentTarget.style.background = "transparent";
                                }}
                            >
                                {/* Number */}
                                <div style={{
                                    fontSize: "18px", fontWeight: "800",
                                    fontFamily: "'Syne', sans-serif",
                                    color: "#1c2333", flexShrink: 0, width: "24px",
                                }}>
                                    {String(i + 1).padStart(2, "0")}
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: "13px", fontWeight: "600",
                                        color: "#cdd9e5", fontFamily: "'Syne', sans-serif",
                                        lineHeight: "1.4", marginBottom: "4px",
                                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                                    }}>
                                        {article.title}
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <span style={{ fontSize: "10px", color: color, fontFamily: "'Space Mono', monospace" }}>
                                            {article.category}
                                        </span>
                                        <span style={{ fontSize: "10px", color: "#1c2333" }}>·</span>
                                        <span style={{ fontSize: "10px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                                            {article.source_name}
                                        </span>
                                        <span style={{ fontSize: "10px", color: "#1c2333" }}>·</span>
                                        <span style={{ fontSize: "10px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                                            {timeAgo}
                                        </span>
                                    </div>
                                </div>

                                {/* Arrow */}
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1c2333" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </div>
                        </a>
                    );
        })}
        </div>
    </div >
  );
}