export default function Footer() {
    return (
        <footer style={{
            borderTop: "1px solid #1c2333",
            marginTop: "80px", padding: "40px 24px",
            background: "#07090f",
        }}>
            <div style={{
                maxWidth: "1280px", margin: "0 auto",
                display: "flex", alignItems: "center",
                justifyContent: "space-between", flexWrap: "wrap", gap: "16px",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "28px", height: "28px",
                        background: "linear-gradient(135deg, #00d4ff, #4f46e5)",
                        borderRadius: "8px", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontFamily: "'Syne', sans-serif", fontWeight: "800",
                        fontSize: "13px", color: "#07090f",
                    }}>N</div>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: "800", color: "#cdd9e5", fontSize: "16px" }}>
                        NEXUS
                    </span>
                </div>

                <p style={{ color: "#444c56", fontSize: "12px", fontFamily: "'Space Mono', monospace" }}>
                    An AI that connects you to the AI world
                </p>

                <p style={{ color: "#1c2333", fontSize: "11px", fontFamily: "'Space Mono', monospace" }}>
                    © 2026 NEXUS
                </p>
            </div>
        </footer>
    );
}