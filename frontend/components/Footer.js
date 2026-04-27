export default function Footer() {
    return (
        <footer style={{
            borderTop: "1px solid #1e1e2e",
            marginTop: "80px",
            padding: "40px 24px",
            background: "#080810",
        }}>
            <div style={{
                maxWidth: "1280px", margin: "0 auto",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "16px",
            }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "28px", height: "28px",
                        background: "linear-gradient(135deg, #00ff88, #7c3aed)",
                        borderRadius: "8px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Syne', sans-serif", fontWeight: "800",
                        fontSize: "13px", color: "#080810",
                    }}>N</div>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: "800", color: "#e2e8f0", fontSize: "16px" }}>
                        NEXUS
                    </span>
                </div>

                {/* Tagline */}
                <p style={{ color: "#475569", fontSize: "12px", fontFamily: "'Space Mono', monospace" }}>
                    An AI that connects you to the AI world
                </p>

                {/* Right */}
                <p style={{ color: "#2a2a3e", fontSize: "11px", fontFamily: "'Space Mono', monospace" }}>
                    © 2026 NEXUS
                </p>
            </div>
        </footer>
    );
}