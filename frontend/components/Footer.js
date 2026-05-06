import Link from "next/link";

export default function Footer() {
    return (
        <footer style={{
            borderTop: "1px solid #1c2333",
            marginTop: "80px",
            padding: "24px",
            background: "#07090f",
        }}>
            <div style={{
                maxWidth: "1280px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "16px",
            }}>

                {/* Left — Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "28px", height: "28px",
                        background: "linear-gradient(135deg, #00d4ff, #4f46e5)",
                        borderRadius: "8px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Syne', sans-serif", fontWeight: "800",
                        fontSize: "13px", color: "#07090f",
                    }}>N</div>
                    <span style={{
                        fontFamily: "'Syne', sans-serif", fontWeight: "800",
                        color: "#cdd9e5", fontSize: "16px",
                    }}>NEXUS</span>
                </div>

                {/* Center — Links */}
                <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
                    {[
                        { label: "Sources", href: "/sources" },
                    ].map(({ label, href }) => (
                        <Link key={label} href={href} style={{
                            color: "#444c56", fontSize: "12px",
                            textDecoration: "none",
                            fontFamily: "'DM Sans', sans-serif",
                            transition: "color 0.2s",
                        }}
                            onMouseEnter={e => e.target.style.color = "#00d4ff"}
                            onMouseLeave={e => e.target.style.color = "#444c56"}
                        >{label}</Link>
                    ))}
                </div>

                {/* Right — Credit + Copyright */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <p style={{
                        color: "#1c2333", fontSize: "11px",
                        fontFamily: "'Space Mono', monospace",
                    }}>© 2026 NEXUS</p>
                    <p style={{
                        fontSize: "11px",
                        fontFamily: "'Space Mono', monospace",
                        color: "#444c56",
                    }}>
                        DEVELOPED BY{" "}
                        <span style={{ color: "#00d4ff", fontWeight: "700" }}>
                            MALHAR SEVAK
                        </span>
                    </p>
                </div>

            </div>
        </footer>
    );
}