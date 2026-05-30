"use client";
import { useState, useEffect, useRef } from "react";
import { adminRunPipeline, adminFetchOnly, adminProcessOnly, adminGenerateDigest } from "../../lib/api";

const LEVEL_COLORS = {
    INFO:     "#00d4ff",
    WARNING:  "#fbbf24",
    ERROR:    "#f87171",
    CRITICAL: "#dc2626",
    DEBUG:    "#6b7280",
    message:  "#444c56",
};

const ACTIONS = [
    { id: "run",     label: "Run Full Pipeline", icon: "▶",  color: "#00d4ff", fn: adminRunPipeline,     desc: "Fetch + AI process" },
    { id: "fetch",   label: "Fetch Only",         icon: "📥", color: "#4ade80", fn: adminFetchOnly,      desc: "RSS crawl all sources" },
    { id: "process", label: "Process Only",       icon: "🤖", color: "#c084fc", fn: adminProcessOnly,   desc: "AI tag + summarize" },
    { id: "digest",  label: "Generate Digest",    icon: "📝", color: "#fb923c", fn: adminGenerateDigest, desc: "Create daily brief" },
];

function PipelineControls() {
    const [loading, setLoading] = useState({});
    const [toasts, setToasts]   = useState([]);

    const addToast = (msg, ok) => {
        const id = Date.now();
        setToasts(p => [...p, { id, msg, ok }]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
    };

    const trigger = async (action) => {
        setLoading(p => ({ ...p, [action.id]: true }));
        try {
            await action.fn();
            addToast(`${action.label} started`, true);
        } catch {
            addToast(`Failed to start ${action.label}`, false);
        } finally {
            setLoading(p => ({ ...p, [action.id]: false }));
        }
    };

    return (
        <div>
            <div style={{
                fontSize: "10px", color: "#444c56",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "0.08em", marginBottom: "14px",
            }}>
                MANUAL TRIGGERS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                {ACTIONS.map(action => (
                    <button
                        key={action.id}
                        onClick={() => trigger(action)}
                        disabled={loading[action.id]}
                        style={{
                            display: "flex", alignItems: "center", gap: "12px",
                            padding: "14px 16px",
                            background: "rgba(0,212,255,0.03)",
                            border: `1px solid ${loading[action.id] ? action.color + "66" : "#1c2333"}`,
                            borderRadius: "12px",
                            cursor: loading[action.id] ? "not-allowed" : "pointer",
                            textAlign: "left",
                            transition: "all 0.2s ease",
                            opacity: loading[action.id] ? 0.7 : 1,
                        }}
                        onMouseEnter={e => {
                            if (!loading[action.id]) {
                                e.currentTarget.style.borderColor = action.color + "44";
                                e.currentTarget.style.background = action.color + "08";
                            }
                        }}
                        onMouseLeave={e => {
                            if (!loading[action.id]) {
                                e.currentTarget.style.borderColor = "#1c2333";
                                e.currentTarget.style.background = "rgba(0,212,255,0.03)";
                            }
                        }}
                    >
                        <span style={{ fontSize: "20px" }}>
                            {loading[action.id] ? (
                                <span style={{
                                    display: "inline-block",
                                    width: "18px", height: "18px",
                                    border: `2px solid ${action.color}33`,
                                    borderTopColor: action.color,
                                    borderRadius: "50%",
                                    animation: "spin 0.8s linear infinite",
                                    verticalAlign: "middle",
                                }} />
                            ) : action.icon}
                        </span>
                        <div>
                            <div style={{
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "13px", fontWeight: "500",
                                color: "#cdd9e5",
                            }}>
                                {action.label}
                            </div>
                            <div style={{
                                fontSize: "10px", color: "#444c56",
                                fontFamily: "'Space Mono', monospace",
                            }}>
                                {action.desc}
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Toast notifications */}
            <div style={{ position: "fixed", bottom: "24px", right: "24px", display: "flex", flexDirection: "column", gap: "8px", zIndex: 999 }}>
                {toasts.map(t => (
                    <div key={t.id} style={{
                        padding: "10px 16px",
                        background: t.ok ? "rgba(74,222,128,0.1)" : "rgba(248,113,113,0.1)",
                        border: `1px solid ${t.ok ? "#4ade8044" : "#f8717144"}`,
                        borderRadius: "10px",
                        color: t.ok ? "#4ade80" : "#f87171",
                        fontSize: "12px",
                        fontFamily: "'Space Mono', monospace",
                        animation: "fadeUp 0.3s ease",
                    }}>
                        {t.ok ? "✓" : "✗"} {t.msg}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function LiveLogTerminal({ logsUrl }) {
    const [logs, setLogs]     = useState([]);
    const [paused, setPaused] = useState(false);
    const [filter, setFilter] = useState("ALL");
    const termRef   = useRef(null);
    const pausedRef = useRef(false);

    pausedRef.current = paused;

    useEffect(() => {
        if (!logsUrl) return;
        const es = new EventSource(logsUrl);

        const handleMsg = (e) => {
            if (pausedRef.current) return;
            const level = e.type === "message" ? "message" : e.type;
            setLogs(prev => {
                const next = [...prev, { text: e.data, level }];
                return next.slice(-500);
            });
        };

        ["INFO", "WARNING", "ERROR", "CRITICAL", "DEBUG", "message"].forEach(evt => {
            es.addEventListener(evt, handleMsg);
        });

        return () => es.close();
    }, [logsUrl]);

    // Auto-scroll
    useEffect(() => {
        if (!paused && termRef.current) {
            termRef.current.scrollTop = termRef.current.scrollHeight;
        }
    }, [logs, paused]);

    const filteredLogs = filter === "ALL" ? logs : logs.filter(l => l.level === filter);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <PipelineControls />

            <div style={{
                background: "#0d1117",
                border: "1px solid #1c2333",
                borderRadius: "14px",
                overflow: "hidden",
            }}>
                {/* Terminal toolbar */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "12px 16px",
                    borderBottom: "1px solid #1c2333",
                    background: "#0a0e18",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span className="live-dot" />
                        <span style={{ fontSize: "10px", color: "#00d4ff", fontFamily: "'Space Mono', monospace", letterSpacing: "0.08em" }}>
                            LIVE PIPELINE LOGS
                        </span>
                        <span style={{ fontSize: "10px", color: "#2a3444", fontFamily: "'Space Mono', monospace" }}>
                            — {filteredLogs.length} lines
                        </span>
                    </div>

                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {["ALL", "INFO", "WARNING", "ERROR"].map(lvl => (
                            <button key={lvl} onClick={() => setFilter(lvl)} style={{
                                fontSize: "9px", padding: "3px 8px",
                                borderRadius: "5px", cursor: "pointer",
                                fontFamily: "'Space Mono', monospace",
                                background: filter === lvl ? (LEVEL_COLORS[lvl] || "#00d4ff") + "22" : "transparent",
                                border: `1px solid ${filter === lvl ? (LEVEL_COLORS[lvl] || "#00d4ff") + "44" : "#1c2333"}`,
                                color: filter === lvl ? (LEVEL_COLORS[lvl] || "#00d4ff") : "#444c56",
                                transition: "all 0.2s",
                            }}>
                                {lvl}
                            </button>
                        ))}

                        <button onClick={() => setPaused(p => !p)} style={{
                            fontSize: "9px", padding: "3px 8px",
                            borderRadius: "5px", cursor: "pointer",
                            fontFamily: "'Space Mono', monospace",
                            background: paused ? "rgba(251,191,36,0.1)" : "transparent",
                            border: `1px solid ${paused ? "#fbbf2444" : "#1c2333"}`,
                            color: paused ? "#fbbf24" : "#444c56",
                            transition: "all 0.2s",
                        }}>
                            {paused ? "▶ RESUME" : "⏸ PAUSE"}
                        </button>

                        <button onClick={() => setLogs([])} style={{
                            fontSize: "9px", padding: "3px 8px",
                            borderRadius: "5px", cursor: "pointer",
                            fontFamily: "'Space Mono', monospace",
                            background: "transparent",
                            border: "1px solid #1c2333",
                            color: "#444c56",
                            transition: "all 0.2s",
                        }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#f8717144"; e.currentTarget.style.color = "#f87171"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c2333"; e.currentTarget.style.color = "#444c56"; }}>
                            ✕ CLEAR
                        </button>
                    </div>
                </div>

                {/* Log output */}
                <div
                    ref={termRef}
                    style={{
                        height: "400px",
                        overflowY: "auto",
                        padding: "14px 16px",
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "11px",
                        lineHeight: "1.9",
                        background: "#07090f",
                    }}
                >
                    {filteredLogs.length === 0 ? (
                        <span style={{ color: "#2a3444" }}>
                            Waiting for log output... trigger a pipeline action above or wait for the scheduler to fire.
                        </span>
                    ) : (
                        filteredLogs.map((log, i) => (
                            <div key={i} style={{ color: LEVEL_COLORS[log.level] || "#444c56" }}>
                                {log.text}
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
