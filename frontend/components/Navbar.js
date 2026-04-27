"use client";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
    { label: "Feed", href: "/" },
    { label: "Digest", href: "/digest" },
    { label: "Sources", href: "/sources" },
];

export default function Navbar({ search, setSearch, onSearch }) {
    const [hovered, setHovered] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <nav style={{
            background: "rgba(8,8,16,0.95)",
            borderBottom: "1px solid #1e1e2e",
            backdropFilter: "blur(12px)",
            position: "sticky",
            top: 0,
            zIndex: 50,
            padding: "0 24px",
        }}>
            <div style={{
                maxWidth: "1280px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "64px",
                gap: "24px",
            }}>

                {/* Logo */}
                <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <div style={{
                        width: "36px", height: "36px",
                        background: "linear-gradient(135deg, #00ff88, #7c3aed)",
                        borderRadius: "10px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: "800", fontSize: "16px", color: "#080810",
                    }}>N</div>
                    <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: "800", fontSize: "20px", color: "#e2e8f0", lineHeight: 1 }}>
                            NEXUS
                        </div>
                        <div style={{ fontSize: "9px", color: "#00ff88", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
                            AI · ML · TECH
                        </div>
                    </div>
                </Link>

                {/* Search Bar — center */}
                <form onSubmit={handleSubmit} style={{
                    flex: 1, maxWidth: "480px",
                    display: "flex", gap: "8px",
                }}>
                    <input
                        type="text"
                        placeholder="Search AI news..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1,
                            background: "#0e0e1a",
                            border: "1px solid #1e1e2e",
                            borderRadius: "10px",
                            padding: "9px 16px",
                            color: "#e2e8f0",
                            fontSize: "13px",
                            fontFamily: "'DM Sans', sans-serif",
                            outline: "none",
                            transition: "border-color 0.2s",
                        }}
                        onFocus={e => e.target.style.borderColor = "#00ff88"}
                        onBlur={e => e.target.style.borderColor = "#1e1e2e"}
                    />
                    <button type="submit" style={{
                        background: "#00ff88", color: "#080810",
                        border: "none", borderRadius: "10px",
                        padding: "9px 18px", fontSize: "12px",
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: "700", cursor: "pointer",
                        transition: "opacity 0.2s", flexShrink: 0,
                    }}
                        onMouseEnter={e => e.target.style.opacity = "0.8"}
                        onMouseLeave={e => e.target.style.opacity = "1"}
                    >
                        SEARCH
                    </button>
                </form>

                {/* Nav Links */}
                <div style={{ display: "flex", alignItems: "center", gap: "28px", flexShrink: 0 }}>
                    {navLinks.map(({ label, href }) => (
                        <Link
                            key={label}
                            href={href}
                            style={{
                                color: hovered === label ? "#00ff88" : "#475569",
                                fontSize: "13px",
                                textDecoration: "none",
                                fontFamily: "'DM Sans', sans-serif",
                                fontWeight: "500",
                                transition: "color 0.2s",
                            }}
                            onMouseEnter={() => setHovered(label)}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}