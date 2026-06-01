"use client";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "../lib/ThemeContext";

const navLinks = [
    { label: "Feed", href: "/" },
    { label: "The Brief", href: "/brief" },
];

export default function Navbar({ search, setSearch, onSearch }) {
    const [hovered, setHovered] = useState(null);
    const { theme, toggleTheme, mounted } = useTheme();

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch();
    };

    return (
        <nav style={{
            background: "var(--nav-bg)",
            borderBottom: "1px solid var(--border)",
            backdropFilter: "blur(12px)",
            position: "sticky", top: 0, zIndex: 50,
            padding: "0 24px",
        }}>
            <div style={{
                maxWidth: "1280px", margin: "0 auto",
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                height: "64px", gap: "24px",
            }}>

                {/* Logo */}
                <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                    <div style={{
                        width: "36px", height: "36px",
                        background: "linear-gradient(135deg, #00d4ff, #4f46e5)",
                        borderRadius: "10px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "'Syne', sans-serif",
                        fontWeight: "800", fontSize: "16px", color: "#07090f",
                        flexShrink: 0,
                    }}>N</div>
                    <div>
                        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: "800", fontSize: "20px", color: "var(--text)", lineHeight: 1 }}>
                            NEXUS
                        </div>
                        <div style={{ fontSize: "9px", color: "var(--accent)", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
                            AI · ML · TECH
                        </div>
                    </div>
                </Link>

                {/* Search */}
                <form onSubmit={handleSubmit} style={{ flex: 1, maxWidth: "480px", display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        placeholder="Search AI news..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            flex: 1, background: "var(--card)",
                            border: "1px solid var(--border)", borderRadius: "10px",
                            padding: "9px 16px", color: "var(--text)",
                            fontSize: "13px", fontFamily: "'DM Sans', sans-serif",
                            outline: "none", transition: "border-color 0.2s",
                        }}
                        onFocus={e => e.target.style.borderColor = "var(--accent)"}
                        onBlur={e => e.target.style.borderColor = "var(--border)"}
                    />
                    <button type="submit" style={{
                        background: "var(--accent)", color: "#07090f",
                        border: "none", borderRadius: "10px",
                        padding: "9px 18px", fontSize: "12px",
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: "700", cursor: "pointer",
                        transition: "opacity 0.2s", flexShrink: 0,
                    }}
                        onMouseEnter={e => e.target.style.opacity = "0.8"}
                        onMouseLeave={e => e.target.style.opacity = "1"}
                    >SEARCH</button>
                </form>

                {/* Nav links + Theme Toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: "24px", flexShrink: 0 }}>
                    {navLinks.map(({ label, href }) => (
                        <Link key={label} href={href} style={{
                            color: hovered === label ? "var(--accent)" : "var(--text-sub)",
                            fontSize: "13px", textDecoration: "none",
                            fontFamily: "'DM Sans', sans-serif", fontWeight: "500",
                            transition: "color 0.2s",
                        }}
                            onMouseEnter={() => setHovered(label)}
                            onMouseLeave={() => setHovered(null)}
                        >{label}</Link>
                    ))}

                    {/* Theme Toggle */}
                    {mounted && (
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                        >
                            {theme === "dark" ? (
                                /* Sun icon for dark mode (click → go light) */
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5"/>
                                    <line x1="12" y1="1" x2="12" y2="3"/>
                                    <line x1="12" y1="21" x2="12" y2="23"/>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                    <line x1="1" y1="12" x2="3" y2="12"/>
                                    <line x1="21" y1="12" x2="23" y2="12"/>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                                </svg>
                            ) : (
                                /* Moon icon for light mode (click → go dark) */
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                </svg>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}