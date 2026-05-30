"use client";

const TABS = [
    { id: "overview", label: "Overview",  icon: "◈" },
    { id: "pipeline", label: "Pipeline",  icon: "⟳" },
    { id: "sources",  label: "Sources",   icon: "⊞" },
];

export default function AdminSidebar({ active, onSelect, onLogout }) {
    return (
        <aside style={{
            width: "220px",
            minHeight: "100vh",
            background: "#0a0e18",
            borderRight: "1px solid #1c2333",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            position: "sticky",
            top: 0,
        }}>
            {/* Brand */}
            <div style={{
                padding: "28px 20px 20px",
                borderBottom: "1px solid #1c2333",
            }}>
                <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: "800", fontSize: "17px",
                    color: "#cdd9e5", letterSpacing: "-0.01em",
                }}>
                    Nexus <span style={{ color: "#00d4ff" }}>Admin</span>
                </div>
                <div style={{
                    fontSize: "10px", color: "#2a3444",
                    fontFamily: "'Space Mono', monospace",
                    marginTop: "4px", letterSpacing: "0.05em",
                }}>
                    CONTROL CENTER
                </div>
            </div>

            {/* Nav tabs */}
            <nav style={{ padding: "16px 12px", flex: 1 }}>
                {TABS.map(tab => {
                    const isActive = active === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onSelect(tab.id)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                width: "100%",
                                padding: "10px 12px",
                                borderRadius: "10px",
                                background: isActive ? "rgba(0,212,255,0.08)" : "transparent",
                                border: isActive ? "1px solid rgba(0,212,255,0.15)" : "1px solid transparent",
                                color: isActive ? "#00d4ff" : "#444c56",
                                cursor: "pointer",
                                marginBottom: "4px",
                                textAlign: "left",
                                transition: "all 0.2s ease",
                                fontFamily: "'DM Sans', sans-serif",
                                fontSize: "13px",
                                fontWeight: isActive ? "500" : "400",
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                    e.currentTarget.style.color = "#cdd9e5";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "#444c56";
                                }
                            }}
                        >
                            <span style={{ fontSize: "16px", lineHeight: 1 }}>{tab.icon}</span>
                            {tab.label}
                        </button>
                    );
                })}
            </nav>

            {/* Logout */}
            <div style={{ padding: "16px 12px", borderTop: "1px solid #1c2333" }}>
                <button
                    onClick={onLogout}
                    style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        width: "100%", padding: "10px 12px",
                        borderRadius: "10px", background: "transparent",
                        border: "1px solid transparent",
                        color: "#444c56", cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif", fontSize: "13px",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(248,113,113,0.06)";
                        e.currentTarget.style.color = "#f87171";
                        e.currentTarget.style.borderColor = "rgba(248,113,113,0.2)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#444c56";
                        e.currentTarget.style.borderColor = "transparent";
                    }}
                >
                    <span style={{ fontSize: "14px" }}>⎋</span>
                    Lock Dashboard
                </button>
            </div>
        </aside>
    );
}
