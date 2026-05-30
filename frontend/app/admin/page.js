"use client";
import { useState, useEffect } from "react";
import LockScreen    from "../../components/admin/LockScreen";
import AdminSidebar  from "../../components/admin/AdminSidebar";
import StatsGrid     from "../../components/admin/StatsGrid";
import LiveLogTerminal from "../../components/admin/LiveLogTerminal";
import SourcesTable  from "../../components/admin/SourcesTable";
import { getAdminLogsUrl } from "../../lib/api";

export default function AdminPage() {
    const [authed,  setAuthed]  = useState(false);
    const [checked, setChecked] = useState(false);
    const [tab, setTab]         = useState("overview");
    const [logsUrl, setLogsUrl] = useState("");

    // Check for stored token on mount
    useEffect(() => {
        const token = localStorage.getItem("nexus_admin_token");
        if (token) {
            // Optimistically trust stored token — backend will reject if invalid
            setAuthed(true);
            setLogsUrl(getAdminLogsUrl());
        }
        setChecked(true);
    }, []);

    const handleUnlock = () => {
        setAuthed(true);
        setLogsUrl(getAdminLogsUrl());
    };

    const handleLogout = () => {
        localStorage.removeItem("nexus_admin_token");
        setAuthed(false);
        setLogsUrl("");
    };

    if (!checked) return null;

    if (!authed) {
        return <LockScreen onUnlock={handleUnlock} />;
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "#07090f",
            display: "flex",
            fontFamily: "'DM Sans', sans-serif",
        }}>
            <AdminSidebar active={tab} onSelect={setTab} onLogout={handleLogout} />

            {/* Main content */}
            <main style={{
                flex: 1,
                padding: "36px 40px",
                overflowY: "auto",
                minWidth: 0,
            }}>
                {/* Page header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    marginBottom: "32px",
                }}>
                    <div>
                        <div style={{
                            fontSize: "10px", color: "#444c56",
                            fontFamily: "'Space Mono', monospace",
                            letterSpacing: "0.1em", marginBottom: "6px",
                        }}>
                            ADMIN / {tab.toUpperCase()}
                        </div>
                        <h1 style={{
                            fontFamily: "'Syne', sans-serif", fontWeight: "800",
                            fontSize: "24px", color: "#cdd9e5",
                        }}>
                            {tab === "overview" && "Platform Overview"}
                            {tab === "pipeline" && "Pipeline Control"}
                            {tab === "sources"  && "Source Monitor"}
                        </h1>
                    </div>

                    {/* Live indicator */}
                    <div style={{
                        display: "flex", alignItems: "center", gap: "8px",
                        background: "rgba(0,212,255,0.06)",
                        border: "1px solid rgba(0,212,255,0.15)",
                        borderRadius: "100px", padding: "6px 14px",
                    }}>
                        <span className="live-dot" />
                        <span style={{
                            fontSize: "10px", color: "#00d4ff",
                            fontFamily: "'Space Mono', monospace",
                        }}>
                            CONNECTED
                        </span>
                    </div>
                </div>

                {/* Tab content */}
                {tab === "overview" && <StatsGrid />}
                {tab === "pipeline" && <LiveLogTerminal logsUrl={logsUrl} />}
                {tab === "sources"  && <SourcesTable />}
            </main>
        </div>
    );
}
