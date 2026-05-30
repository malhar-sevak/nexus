"use client";
import { useState, useEffect } from "react";
import { adminGetSources } from "../../lib/api";

const CAT_COLORS = {
    LLMs:       "#00d4ff",
    Research:   "#4ade80",
    Industry:   "#f87171",
    Community:  "#c084fc",
    Tools:      "#fb923c",
    Vision:     "#38bdf8",
    Robotics:   "#a78bfa",
    Newsletter: "#facc15",
};

function StatusDot({ count }) {
    const color = count > 50 ? "#4ade80" : count > 10 ? "#fbbf24" : count > 0 ? "#fb923c" : "#f87171";
    return (
        <span style={{
            display: "inline-block",
            width: "8px", height: "8px",
            borderRadius: "50%",
            background: color,
            marginRight: "8px",
            boxShadow: `0 0 6px ${color}88`,
        }} />
    );
}

export default function SourcesTable() {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch]   = useState("");
    const [sortKey, setSortKey] = useState("article_count");

    const load = async () => {
        setLoading(true);
        try {
            const data = await adminGetSources();
            setSources(data.sources);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const formatDate = (iso) => {
        if (!iso) return "Never";
        const d = new Date(iso);
        const diff = Date.now() - d.getTime();
        const hrs  = Math.floor(diff / 3600000);
        if (hrs < 1)  return "< 1 hr ago";
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    const filtered = sources
        .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sortKey === "article_count") return (b.article_count || 0) - (a.article_count || 0);
            return a.name.localeCompare(b.name);
        });

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: "700", fontSize: "16px", color: "#cdd9e5" }}>
                    Source Health
                </h2>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search sources..."
                        style={{
                            background: "#0d1117", border: "1px solid #1c2333",
                            borderRadius: "8px", padding: "6px 12px",
                            color: "#cdd9e5", fontSize: "12px",
                            fontFamily: "'DM Sans', sans-serif", outline: "none",
                            width: "180px",
                        }}
                    />
                    <button onClick={load} style={{
                        fontSize: "10px", color: "#444c56", background: "transparent",
                        border: "1px solid #1c2333", borderRadius: "6px",
                        padding: "6px 10px", cursor: "pointer",
                        fontFamily: "'Space Mono', monospace",
                        transition: "all 0.2s",
                    }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c2333"; e.currentTarget.style.color = "#444c56"; }}>
                        ↻ REFRESH
                    </button>
                </div>
            </div>

            {/* Sort bar */}
            <div style={{
                display: "flex", gap: "6px", marginBottom: "12px",
            }}>
                {[["article_count", "By Article Count"], ["name", "By Name"]].map(([key, label]) => (
                    <button key={key} onClick={() => setSortKey(key)} style={{
                        fontSize: "9px", padding: "3px 10px",
                        borderRadius: "5px", cursor: "pointer",
                        fontFamily: "'Space Mono', monospace",
                        background: sortKey === key ? "rgba(0,212,255,0.08)" : "transparent",
                        border: `1px solid ${sortKey === key ? "#00d4ff44" : "#1c2333"}`,
                        color: sortKey === key ? "#00d4ff" : "#444c56",
                        transition: "all 0.2s",
                    }}>
                        {label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ color: "#444c56", fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>
                    Loading sources...
                </div>
            ) : (
                <div style={{
                    background: "#0d1117",
                    border: "1px solid #1c2333",
                    borderRadius: "14px",
                    overflow: "hidden",
                }}>
                    {/* Table header */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 100px 100px",
                        padding: "10px 18px",
                        borderBottom: "1px solid #1c2333",
                        background: "#0a0e18",
                        fontSize: "9px", color: "#444c56",
                        fontFamily: "'Space Mono', monospace",
                        letterSpacing: "0.08em",
                    }}>
                        <span>SOURCE</span>
                        <span>CATEGORY</span>
                        <span style={{ textAlign: "center" }}>ARTICLES</span>
                        <span style={{ textAlign: "right" }}>LAST FETCHED</span>
                    </div>

                    {/* Rows */}
                    {filtered.map((source, i) => {
                        const catColor = CAT_COLORS[source.category] || "#444c56";
                        return (
                            <div
                                key={source.name}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "2fr 1fr 100px 100px",
                                    padding: "12px 18px",
                                    borderBottom: i < filtered.length - 1 ? "1px solid #111827" : "none",
                                    alignItems: "center",
                                    transition: "background 0.15s",
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = "#111827"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                            >
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <StatusDot count={source.article_count} />
                                    <span style={{ fontSize: "13px", color: "#cdd9e5", fontFamily: "'DM Sans', sans-serif" }}>
                                        {source.name}
                                    </span>
                                </div>
                                <div>
                                    <span style={{
                                        fontSize: "9px", padding: "2px 8px",
                                        borderRadius: "4px",
                                        background: catColor + "18",
                                        border: `1px solid ${catColor}33`,
                                        color: catColor,
                                        fontFamily: "'Space Mono', monospace",
                                    }}>
                                        {source.category}
                                    </span>
                                </div>
                                <div style={{ textAlign: "center" }}>
                                    <span style={{
                                        fontFamily: "'Space Mono', monospace",
                                        fontSize: "12px",
                                        color: source.article_count > 0 ? "#cdd9e5" : "#444c56",
                                        fontWeight: "700",
                                    }}>
                                        {source.article_count?.toLocaleString() || 0}
                                    </span>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <span style={{ fontSize: "10px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                                        {formatDate(source.last_fetched)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {filtered.length === 0 && (
                        <div style={{ padding: "32px", textAlign: "center", color: "#2a3444", fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>
                            NO SOURCES FOUND
                        </div>
                    )}
                </div>
            )}

            {/* Legend */}
            <div style={{ marginTop: "12px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {[["#4ade80", "50+ articles"], ["#fbbf24", "10–50"], ["#fb923c", "1–9"], ["#f87171", "No articles"]].map(([color, label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "10px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: color, display: "inline-block" }} />
                        {label}
                    </div>
                ))}
            </div>
        </div>
    );
}
