"use client";
import { useEffect, useState } from "react";
import { adminGetStats } from "../../lib/api";

function StatCard({ label, value, sub, accent = "#00d4ff", icon }) {
    return (
        <div style={{
            background: "#0d1117",
            border: "1px solid #1c2333",
            borderRadius: "14px",
            padding: "20px 22px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            transition: "border-color 0.2s",
            position: "relative",
            overflow: "hidden",
        }}
            onMouseEnter={e => e.currentTarget.style.borderColor = accent + "44"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#1c2333"}
        >
            {/* Subtle corner glow */}
            <div style={{
                position: "absolute", top: 0, right: 0,
                width: "80px", height: "80px",
                background: `radial-gradient(ellipse at top right, ${accent}08, transparent 70%)`,
                pointerEvents: "none",
            }} />
            <div style={{ fontSize: "22px" }}>{icon}</div>
            <div style={{
                fontFamily: "'Syne', sans-serif", fontWeight: "700",
                fontSize: "28px", color: accent, letterSpacing: "-0.02em",
            }}>
                {value ?? "—"}
            </div>
            <div style={{
                fontSize: "11px", color: "#cdd9e5",
                fontFamily: "'DM Sans', sans-serif", fontWeight: "500",
            }}>
                {label}
            </div>
            {sub && (
                <div style={{
                    fontSize: "10px", color: "#444c56",
                    fontFamily: "'Space Mono', monospace",
                }}>
                    {sub}
                </div>
            )}
        </div>
    );
}

function CatBar({ cats }) {
    if (!cats || Object.keys(cats).length === 0) return null;
    const total = Object.values(cats).reduce((a, b) => a + b, 0);
    const colors = { LLMs: "#00d4ff", Research: "#4ade80", Industry: "#f87171", Community: "#c084fc", Tools: "#fb923c", Vision: "#38bdf8", Robotics: "#a78bfa", Newsletter: "#facc15" };

    return (
        <div style={{
            background: "#0d1117", border: "1px solid #1c2333",
            borderRadius: "14px", padding: "20px 22px", gridColumn: "1 / -1",
        }}>
            <div style={{
                fontSize: "10px", color: "#444c56",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.08em", marginBottom: "16px",
            }}>
                ARTICLES BY CATEGORY
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Object.entries(cats)
                    .sort((a, b) => b[1] - a[1])
                    .map(([cat, count]) => {
                        const pct = Math.round((count / total) * 100);
                        const color = colors[cat] || "#444c56";
                        return (
                            <div key={cat}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                                    <span style={{ fontSize: "12px", color: "#cdd9e5", fontFamily: "'DM Sans', sans-serif" }}>{cat}</span>
                                    <span style={{ fontSize: "11px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>{count} ({pct}%)</span>
                                </div>
                                <div style={{ height: "4px", background: "#1c2333", borderRadius: "2px", overflow: "hidden" }}>
                                    <div style={{
                                        height: "100%", width: `${pct}%`,
                                        background: color, borderRadius: "2px",
                                        transition: "width 0.8s ease",
                                    }} />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export default function StatsGrid() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const data = await adminGetStats();
            setStats(data);
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
        return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: "700", fontSize: "16px", color: "#cdd9e5" }}>
                    Platform Overview
                </h2>
                <button onClick={load} style={{
                    fontSize: "10px", color: "#444c56", background: "transparent",
                    border: "1px solid #1c2333", borderRadius: "6px",
                    padding: "4px 10px", cursor: "pointer",
                    fontFamily: "'Space Mono', monospace",
                    transition: "all 0.2s",
                }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#00d4ff"; e.currentTarget.style.color = "#00d4ff"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c2333"; e.currentTarget.style.color = "#444c56"; }}>
                    ↻ REFRESH
                </button>
            </div>

            {loading ? (
                <div style={{ color: "#444c56", fontFamily: "'Space Mono', monospace", fontSize: "11px" }}>
                    Loading stats...
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
                    <StatCard icon="📰" label="Total Articles"  value={stats?.total_articles?.toLocaleString()} accent="#00d4ff" />
                    <StatCard icon="🤖" label="Untagged"        value={stats?.untagged?.toLocaleString()}       accent="#f87171" sub="Awaiting AI processing" />
                    <StatCard icon="📝" label="Digests Generated" value={stats?.total_digests?.toLocaleString()} accent="#4ade80" />
                    <StatCard icon="⊞"  label="Active Sources"  value={stats?.total_sources?.toLocaleString()} accent="#c084fc" />
                    <StatCard icon="🕐" label="Last Fetch"       value={formatDate(stats?.last_fetch)}          accent="#fb923c" />
                    <StatCard icon="📡" label="Feed Status"      value="LIVE"                                   accent="#4ade80" sub="Scheduler running" />
                    <CatBar cats={stats?.category_counts} />
                </div>
            )}
        </div>
    );
}
