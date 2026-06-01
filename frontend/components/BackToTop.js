"use client";
import { useState, useEffect } from "react";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 400);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    if (!visible) return null;

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
                position: "fixed", bottom: "32px", right: "32px",
                width: "44px", height: "44px",
                background: "var(--card)",
                border: "1px solid var(--accent)",
                borderRadius: "12px",
                color: "var(--accent)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                zIndex: 99,
                transition: "all 0.2s ease",
                boxShadow: "0 0 20px var(--shadow-glow)",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = "var(--accent)";
                e.currentTarget.style.color = "#07090f";
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = "var(--card)";
                e.currentTarget.style.color = "var(--accent)";
            }}
        >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 15l-6-6-6 6" />
            </svg>
        </button>
    );
}