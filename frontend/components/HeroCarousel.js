"use client";
import { useState, useEffect, useCallback } from "react";

const SLIDES = [
    {
        tag: "LLMs",
        tagBg: "#0a1929",
        tagColor: "#00d4ff",
        tagBorder: "#00d4ff33",
        headline: "Stay ahead of the",
        accent: "AI revolution.",
        accentColor: "#00d4ff",
        sub: "Every breakthrough, every model launch — curated by AI, delivered in real time.",
        stat: "LIVE FEED",
    },
    {
        tag: "Research",
        tagBg: "#0a1a0a",
        tagColor: "#4ade80",
        tagBorder: "#4ade8033",
        headline: "From arXiv to Reddit.",
        accent: "All in one feed.",
        accentColor: "#4ade80",
        sub: "Papers, blogs, community posts — every corner of the AI world, covered.",
        stat: "19 SOURCES",
    },
    {
        tag: "Community",
        tagBg: "#160a1a",
        tagColor: "#c084fc",
        tagBorder: "#c084fc33",
        headline: "Your daily",
        accent: "AI briefing.",
        accentColor: "#c084fc",
        sub: "Read The Brief — AI writes your morning digest so you don't have to.",
        stat: "DAILY DIGEST",
    },
    {
        tag: "Industry",
        tagBg: "#1a0a0a",
        tagColor: "#f87171",
        tagBorder: "#f8717133",
        headline: "An AI that connects you",
        accent: "to the AI world.",
        accentColor: "#f87171",
        sub: "No signup. No noise. Just the AI & ML news that actually matters.",
        stat: "100% FREE",
    },
];

export default function HeroCarousel({ total }) {
    const [cur, setCur] = useState(0);
    const [animKey, setAnimKey] = useState(0);

    const go = useCallback((dir) => {
        setCur(p => (p + dir + SLIDES.length) % SLIDES.length);
        setAnimKey(k => k + 1);
    }, []);

    const goTo = useCallback((i) => {
        setCur(i);
        setAnimKey(k => k + 1);
    }, []);

    useEffect(() => {
        const t = setInterval(() => go(1), 4000);
        return () => clearInterval(t);
    }, [go]);

    const slide = SLIDES[cur];

    return (
        <div style={{
            background: "#0d1117",
            border: "1px solid #1c2333",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "32px",
            position: "relative",
        }}>

            {/* Slide content */}
            <div
                key={animKey}
                style={{
                    padding: "32px 64px 24px", // Increased horizontal padding to prevent text overlap with floating side buttons
                    animation: "fadeUp 0.45s ease forwards",
                    minHeight: "200px",
                }}
            >
                {/* Live row */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                    <span className="live-dot" />
                    <span style={{ fontSize: "10px", color: "#00d4ff", fontFamily: "'Space Mono', monospace", letterSpacing: "0.1em" }}>
                        {slide.stat} — {total} ARTICLES TRACKED
                    </span>
                </div>

                {/* Tag */}
                <div style={{
                    display: "inline-block",
                    fontSize: "10px", fontFamily: "'Space Mono', monospace",
                    fontWeight: "700", padding: "3px 12px",
                    borderRadius: "6px", marginBottom: "16px",
                    letterSpacing: "0.05em",
                    background: slide.tagBg,
                    color: slide.tagColor,
                    border: `1px solid ${slide.tagBorder}`,
                }}>
                    {slide.tag}
                </div>

                {/* Headline */}
                <h2 style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: "800",
                    fontSize: "clamp(16px, 2vw, 24px)",
                    color: "#cdd9e5", lineHeight: "1.2",
                    marginBottom: "10px",
                }}>
                    {slide.headline}{" "}
                    <span style={{ color: slide.accentColor }}>{slide.accent}</span>
                </h2>

                {/* Sub */}
                <p style={{
                    fontSize: "13px", color: "#444c56",
                    fontFamily: "'DM Sans', sans-serif",
                    lineHeight: "1.7", maxWidth: "480px",
                }}>
                    {slide.sub}
                </p>
            </div>

            {/* Left and Right floating arrow buttons */}
            <button
                onClick={() => go(-1)}
                style={{
                    position: "absolute",
                    left: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(13, 17, 23, 0.8)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid #1c2333",
                    color: "#444c56",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    transition: "all 0.3s ease",
                }}
                onMouseEnter={e => { 
                    e.currentTarget.style.borderColor = slide.accentColor; 
                    e.currentTarget.style.color = slide.accentColor;
                    e.currentTarget.style.boxShadow = `0 0 12px ${slide.accentColor}33`;
                }}
                onMouseLeave={e => { 
                    e.currentTarget.style.borderColor = "#1c2333"; 
                    e.currentTarget.style.color = "#444c56";
                    e.currentTarget.style.boxShadow = "none";
                }}
                aria-label="Previous Slide"
            >
                ←
            </button>

            <button
                onClick={() => go(1)}
                style={{
                    position: "absolute",
                    right: "16px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(13, 17, 23, 0.8)",
                    backdropFilter: "blur(4px)",
                    border: "1px solid #1c2333",
                    color: "#444c56",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    transition: "all 0.3s ease",
                }}
                onMouseEnter={e => { 
                    e.currentTarget.style.borderColor = slide.accentColor; 
                    e.currentTarget.style.color = slide.accentColor;
                    e.currentTarget.style.boxShadow = `0 0 12px ${slide.accentColor}33`;
                }}
                onMouseLeave={e => { 
                    e.currentTarget.style.borderColor = "#1c2333"; 
                    e.currentTarget.style.color = "#444c56";
                    e.currentTarget.style.boxShadow = "none";
                }}
                aria-label="Next Slide"
            >
                →
            </button>

            {/* Bottom bar — centered dots */}
            <div style={{
                display: "flex", 
                alignItems: "center",
                justifyContent: "center",
                padding: "14px 32px",
                borderTop: "1px solid #1c2333",
                background: "#0a0e18",
            }}>

                {/* Connected dots */}
                <div style={{ display: "flex", alignItems: "center", gap: "0" }}>
                    {SLIDES.map((_, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center" }}>
                            {/* Dot */}
                            <button
                                onClick={() => goTo(i)}
                                style={{
                                    width: i === cur ? "10px" : "8px",
                                    height: i === cur ? "10px" : "8px",
                                    borderRadius: "50%",
                                    border: `1.5px solid ${i === cur ? slide.accentColor : i < cur ? "#00d4ff44" : "#1c2333"}`,
                                    background: i === cur ? slide.accentColor : i < cur ? "#00d4ff22" : "#07090f",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    flexShrink: 0,
                                    padding: 0,
                                }}
                            />
                            {/* Connector line between dots */}
                            {i < SLIDES.length - 1 && (
                                <div style={{
                                    width: "40px", height: "1.5px",
                                    background: i < cur ? slide.accentColor : "#1c2333",
                                    transition: "background 0.4s ease",
                                }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}