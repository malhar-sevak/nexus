"use client";
import { useState } from "react";

// Splits digest content into meaningful bullet point takeaways
function extractTakeaways(content) {
    if (!content) return [];

    // Split on newlines or sentence-ending punctuation followed by capital letters
    const sentences = content
        .replace(/\n+/g, " ")
        .split(/(?<=[.!?])\s+(?=[A-Z])/)
        .map(s => s.trim())
        .filter(s => s.length > 40 && s.length < 300);

    // Take up to 5 most informative sentences (prefer ones with numbers, model names, or "announced")
    const scored = sentences.map(s => {
        let score = 0;
        if (/\d+/.test(s)) score += 2;
        if (/GPT|Claude|Gemini|LLaMA|announced|released|launched|introduced|achieves|surpasses|beats/i.test(s)) score += 3;
        if (/research|paper|study|model|benchmark/i.test(s)) score += 1;
        return { text: s, score };
    });

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(s => s.text);
}

export default function KeyTakeaways({ content }) {
    const [visible, setVisible] = useState(true);
    const takeaways = extractTakeaways(content);

    if (!takeaways.length) return null;

    return (
        <div style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "32px",
        }}>
            {/* Header */}
            <button
                onClick={() => setVisible(!visible)}
                style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    padding: "16px 20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    borderBottom: visible ? "1px solid var(--border)" : "none",
                    transition: "border-color 0.2s",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
                        background: "color-mix(in srgb, #4ade80 12%, transparent)",
                        border: "1px solid color-mix(in srgb, #4ade80 30%, transparent)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 11 12 14 22 4" />
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                        </svg>
                    </div>
                    <div style={{ textAlign: "left" }}>
                        <div style={{
                            fontSize: "10px", fontFamily: "'Space Mono', monospace",
                            color: "#4ade80", letterSpacing: "0.12em",
                        }}>
                            KEY TAKEAWAYS
                        </div>
                        <div style={{
                            fontSize: "11px", fontFamily: "'DM Sans', sans-serif",
                            color: "var(--text-dim)", marginTop: "1px",
                        }}>
                            {takeaways.length} highlights from today's brief
                        </div>
                    </div>
                </div>
                <span style={{
                    fontSize: "12px", color: "var(--text-dim)",
                    transform: visible ? "rotate(0deg)" : "rotate(180deg)",
                    transition: "transform 0.25s ease",
                    display: "inline-block",
                }}>▲</span>
            </button>

            {/* Takeaway list */}
            {visible && (
                <div style={{ padding: "4px 0 8px" }}>
                    {takeaways.map((point, i) => (
                        <div
                            key={i}
                            style={{
                                display: "flex", alignItems: "flex-start", gap: "12px",
                                padding: "10px 20px",
                                borderBottom: i < takeaways.length - 1 ? "1px solid color-mix(in srgb, var(--border) 50%, transparent)" : "none",
                                animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
                            }}
                        >
                            {/* Number chip */}
                            <div style={{
                                width: "20px", height: "20px", borderRadius: "6px",
                                background: "color-mix(in srgb, #4ade80 10%, transparent)",
                                border: "1px solid color-mix(in srgb, #4ade80 25%, transparent)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                flexShrink: 0, marginTop: "1px",
                            }}>
                                <span style={{
                                    fontSize: "9px", fontFamily: "'Space Mono', monospace",
                                    color: "#4ade80", fontWeight: "700",
                                }}>{i + 1}</span>
                            </div>

                            <p style={{
                                fontSize: "13px", color: "var(--text-sub)",
                                fontFamily: "'DM Sans', sans-serif",
                                lineHeight: "1.6", margin: 0,
                            }}>
                                {point}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
