"use client";
import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getDigest } from "../../lib/api";
import { format } from "date-fns";

const CATEGORY_STYLES = {
    LLMs: { color: "#00d4ff" },
    Vision: { color: "#60a5fa" },
    Robotics: { color: "#fb923c" },
    Research: { color: "#4ade80" },
    Tools: { color: "#fbbf24" },
    Industry: { color: "#f87171" },
    Community: { color: "#c084fc" },
    Newsletter: { color: "#818cf8" },
};

export default function BriefPage() {
    const [digest, setDigest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        getDigest()
            .then(setDigest)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const leadArticle = digest?.top_articles?.[0];
    const threadItems = digest?.top_articles?.slice(1) || [];
    const editionNum = digest?.id || 1;

    return (
        <div style={{ minHeight: "100vh", background: "#07090f" }}>
            <Navbar search={search} setSearch={setSearch} onSearch={() => { }} />

            <main style={{ maxWidth: "860px", margin: "0 auto", padding: "48px 24px" }}>

                {loading ? (
                    <div style={{
                        background: "#0d1117", border: "1px solid #1c2333",
                        borderRadius: "16px", height: "400px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <span style={{ color: "#444c56", fontFamily: "'Space Mono', monospace", fontSize: "12px" }}>
                            Loading The Brief...
                        </span>
                    </div>

                ) : !digest || digest.message ? (
                    <div style={{
                        background: "#0d1117", border: "1px solid #1c2333",
                        borderRadius: "16px", padding: "64px",
                        textAlign: "center",
                    }}>
                        <div style={{ fontSize: "40px", marginBottom: "16px", color: "#1c2333" }}>◎</div>
                        <p style={{ color: "#444c56", fontFamily: "'Space Mono', monospace", fontSize: "13px" }}>
                            NO BRIEF YET — CHECK BACK SOON
                        </p>
                        <p style={{ color: "#1c2333", fontSize: "12px", marginTop: "8px" }}>
                            The Brief is generated daily at midnight
                        </p>
                    </div>

                ) : (
                    <>
                        {/* ── Newspaper Header ── */}
                        <div style={{
                            textAlign: "center",
                            borderTop: "2px solid #cdd9e5",
                            borderBottom: "2px solid #cdd9e5",
                            padding: "12px 0",
                            marginBottom: "32px",
                        }} className="fade-up">
                            <div style={{
                                display: "flex", alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "8px",
                            }}>
                                <span style={{ fontSize: "10px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                                    {format(new Date(digest.date), "EEEE, MMMM d, yyyy").toUpperCase()}
                                </span>
                                <span style={{ fontSize: "10px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                                    EDITION #{String(editionNum).padStart(3, "0")}
                                </span>
                            </div>
                            <h1 style={{
                                fontFamily: "'Syne', sans-serif", fontWeight: "800",
                                fontSize: "clamp(28px, 5vw, 48px)",
                                color: "#cdd9e5", letterSpacing: "0.04em",
                                lineHeight: 1,
                            }}>
                                THE NEXUS BRIEF
                            </h1>
                            <div style={{
                                fontSize: "10px", color: "#444c56",
                                fontFamily: "'Space Mono', monospace",
                                marginTop: "8px", letterSpacing: "0.1em",
                            }}>
                                AI · ML · TECH · CURATED BY AI · DELIVERED DAILY
                            </div>
                        </div>

                        {/* ── Lead Story ── */}
                        {leadArticle && (
                            <div style={{
                                background: "#0d1117",
                                border: "1px solid #1c2333",
                                borderRadius: "16px",
                                overflow: "hidden",
                                marginBottom: "32px",
                            }} className="fade-up-delay-1">

                                {/* Lead image */}
                                <div style={{ position: "relative", width: "100%", height: "280px", background: "#111827", overflow: "hidden" }}>
                                    <img
                                        src={leadArticle.image_url || "https://placehold.co/860x280/0d1117/00d4ff?text=NEXUS"}
                                        alt={leadArticle.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }}
                                        onError={e => { e.target.src = "https://placehold.co/860x280/0d1117/00d4ff?text=NEXUS"; }}
                                    />
                                    {/* Overlay */}
                                    <div style={{
                                        position: "absolute", inset: 0,
                                        background: "linear-gradient(to top, #0d1117 0%, transparent 60%)",
                                    }} />
                                    {/* Lead badge */}
                                    <div style={{
                                        position: "absolute", top: "16px", left: "16px",
                                        background: "#00d4ff", color: "#07090f",
                                        fontSize: "10px", fontFamily: "'Space Mono', monospace",
                                        fontWeight: "700", padding: "4px 12px", borderRadius: "6px",
                                        letterSpacing: "0.08em",
                                    }}>
                                        LEAD STORY
                                    </div>
                                </div>

                                {/* Lead content */}
                                <div style={{ padding: "24px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                                        <span style={{
                                            fontSize: "10px", fontFamily: "'Space Mono', monospace",
                                            color: CATEGORY_STYLES[leadArticle.category]?.color || "#00d4ff",
                                            fontWeight: "700",
                                        }}>
                                            {leadArticle.category || "GENERAL"}
                                        </span>
                                        <span style={{ color: "#1c2333", fontSize: "10px" }}>·</span>
                                        <span style={{ fontSize: "10px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                                            {leadArticle.source_name}
                                        </span>
                                    </div>

                                    <h2 style={{
                                        fontFamily: "'Syne', sans-serif", fontWeight: "800",
                                        fontSize: "22px", color: "#cdd9e5",
                                        lineHeight: "1.3", marginBottom: "12px",
                                    }}>
                                        {leadArticle.title}
                                    </h2>

                                    <p style={{
                                        color: "#8b95a3", fontSize: "14px",
                                        lineHeight: "1.8", marginBottom: "20px",
                                        fontFamily: "'DM Sans', sans-serif",
                                    }}>
                                        {leadArticle.summary || "Read the full story for details."}
                                    </p>

                                    <a href={leadArticle.url} target="_blank" rel="noopener noreferrer" style={{
                                        display: "inline-flex", alignItems: "center", gap: "8px",
                                        background: "#00d4ff", color: "#07090f",
                                        padding: "10px 20px", borderRadius: "10px",
                                        fontSize: "12px", fontFamily: "'Space Mono', monospace",
                                        fontWeight: "700", textDecoration: "none",
                                        transition: "opacity 0.2s",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                    >
                                        READ FULL STORY →
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* ── Thread Section ── */}
                        {threadItems.length > 0 && (
                            <div className="fade-up-delay-2">

                                {/* Thread header */}
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "12px",
                                    marginBottom: "20px",
                                }}>
                                    <div style={{
                                        width: "32px", height: "32px",
                                        background: "linear-gradient(135deg, #00d4ff, #4f46e5)",
                                        borderRadius: "50%",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontFamily: "'Syne', sans-serif", fontWeight: "800",
                                        fontSize: "13px", color: "#07090f", flexShrink: 0,
                                    }}>N</div>
                                    <div>
                                        <div style={{ fontSize: "13px", fontWeight: "600", color: "#cdd9e5", fontFamily: "'Syne', sans-serif" }}>
                                            Nexus AI
                                        </div>
                                        <div style={{ fontSize: "10px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                                            Also today — a thread
                                        </div>
                                    </div>
                                </div>

                                {/* Thread items */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                                    {threadItems.map((article, i) => {
                                        const isLast = i === threadItems.length - 1;
                                        const isExpanded = expanded === i;
                                        const catColor = CATEGORY_STYLES[article.category]?.color || "#00d4ff";

                                        return (
                                            <div key={article.id} style={{ display: "flex", gap: "16px" }}>

                                                {/* Thread line */}
                                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                                                    <div style={{
                                                        width: "32px", height: "32px",
                                                        background: "#0d1117",
                                                        border: `1px solid ${catColor}44`,
                                                        borderRadius: "50%",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                        fontSize: "11px", fontFamily: "'Space Mono', monospace",
                                                        color: catColor, fontWeight: "700", flexShrink: 0,
                                                    }}>
                                                        {i + 2}
                                                    </div>
                                                    {!isLast && (
                                                        <div style={{ width: "1px", flex: 1, background: "#1c2333", minHeight: "24px" }} />
                                                    )}
                                                </div>

                                                {/* Thread content */}
                                                <div style={{
                                                    flex: 1, paddingBottom: isLast ? "0" : "20px",
                                                    background: "#0d1117",
                                                    border: "1px solid #1c2333",
                                                    borderRadius: "12px",
                                                    padding: "16px",
                                                    marginBottom: isLast ? "0" : "12px",
                                                }}>

                                                    {/* Meta */}
                                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                            <span style={{
                                                                fontSize: "10px", fontFamily: "'Space Mono', monospace",
                                                                color: catColor, fontWeight: "700",
                                                            }}>
                                                                {article.category || "GENERAL"}
                                                            </span>
                                                            <span style={{ fontSize: "10px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                                                                · {article.source_name}
                                                            </span>
                                                        </div>
                                                        <span style={{ fontSize: "10px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                                                            {i + 2}/{threadItems.length + 1}
                                                        </span>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 style={{
                                                        fontFamily: "'Syne', sans-serif", fontWeight: "700",
                                                        fontSize: "14px", color: "#cdd9e5",
                                                        lineHeight: "1.4", marginBottom: "8px",
                                                    }}>
                                                        {article.title}
                                                    </h3>

                                                    {/* Summary */}
                                                    <p style={{
                                                        color: "#444c56", fontSize: "13px",
                                                        lineHeight: "1.7", fontFamily: "'DM Sans', sans-serif",
                                                        display: isExpanded ? "block" : "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                        overflow: isExpanded ? "visible" : "hidden",
                                                    }}>
                                                        {article.summary || "Check the full article for details."}
                                                    </p>

                                                    {/* Footer */}
                                                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "12px" }}>
                                                        {article.summary && article.summary.length > 100 && (
                                                            <button onClick={() => setExpanded(isExpanded ? null : i)} style={{
                                                                background: "none", border: "none",
                                                                color: "#444c56", fontSize: "11px",
                                                                fontFamily: "'Space Mono', monospace",
                                                                cursor: "pointer", padding: "0",
                                                            }}>
                                                                {isExpanded ? "▲ less" : "▼ more"}
                                                            </button>
                                                        )}
                                                        <a href={article.url} target="_blank" rel="noopener noreferrer" style={{
                                                            color: "#00d4ff", fontSize: "11px",
                                                            fontFamily: "'Space Mono', monospace",
                                                            textDecoration: "none",
                                                        }}
                                                            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
                                                            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                                                        >
                                                            Read more →
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Thread end */}
                                <div style={{
                                    marginTop: "24px", textAlign: "center",
                                    padding: "16px",
                                    border: "1px solid #1c2333",
                                    borderRadius: "12px",
                                    background: "#0d1117",
                                }}>
                                    <p style={{ color: "#444c56", fontSize: "12px", fontFamily: "'Space Mono', monospace" }}>
                                        That's your brief for today. Check back tomorrow for the next edition.
                                    </p>
                                    <p style={{ color: "#1c2333", fontSize: "11px", marginTop: "4px", fontFamily: "'Space Mono', monospace" }}>
                                        — Nexus AI Editor
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
}