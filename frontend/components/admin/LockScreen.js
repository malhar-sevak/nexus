"use client";
import { useState, useRef, useEffect } from "react";
import { adminAuth } from "../../lib/api";

const DIGITS = 6;

export default function LockScreen({ onUnlock }) {
    const [digits, setDigits] = useState(Array(DIGITS).fill(""));
    const [error, setError]   = useState(false);
    const [loading, setLoading] = useState(false);
    const [shake, setShake]   = useState(false);
    const inputs = useRef([]);

    useEffect(() => {
        inputs.current[0]?.focus();
    }, []);

    const handleChange = (val, idx) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...digits];
        next[idx] = val;
        setDigits(next);
        setError(false);

        if (val && idx < DIGITS - 1) {
            inputs.current[idx + 1]?.focus();
        }

        // Auto-submit when last digit is entered
        if (val && idx === DIGITS - 1) {
            const pin = [...next.slice(0, DIGITS - 1), val].join("");
            if (pin.length === DIGITS) submit(pin);
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !digits[idx] && idx > 0) {
            inputs.current[idx - 1]?.focus();
        }
    };

    const submit = async (pin) => {
        setLoading(true);
        try {
            const data = await adminAuth(pin);
            localStorage.setItem("nexus_admin_token", data.token);
            onUnlock();
        } catch {
            setError(true);
            setShake(true);
            setDigits(Array(DIGITS).fill(""));
            setTimeout(() => { setShake(false); inputs.current[0]?.focus(); }, 600);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#07090f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "40px",
            fontFamily: "'DM Sans', sans-serif",
        }}>
            {/* Ambient glow */}
            <div style={{
                position: "fixed", top: "30%", left: "50%",
                transform: "translateX(-50%)",
                width: "500px", height: "300px",
                background: "radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 70%)",
                pointerEvents: "none",
            }} />

            {/* Lock icon */}
            <div style={{ textAlign: "center" }}>
                <div style={{
                    width: "64px", height: "64px",
                    borderRadius: "18px",
                    background: "rgba(0,212,255,0.06)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 20px",
                    fontSize: "28px",
                }}>
                    🔐
                </div>
                <p style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: "700",
                    fontSize: "20px", color: "#cdd9e5", marginBottom: "6px",
                }}>
                    Nexus Admin
                </p>
                <p style={{ fontSize: "13px", color: "#444c56" }}>
                    Enter your 6-digit PIN to continue
                </p>
            </div>

            {/* PIN boxes */}
            <div style={{
                display: "flex", gap: "12px",
                animation: shake ? "shake 0.5s ease" : "none",
            }}>
                {digits.map((d, i) => (
                    <input
                        key={i}
                        ref={el => inputs.current[i] = el}
                        type="password"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={e => handleChange(e.target.value, i)}
                        onKeyDown={e => handleKeyDown(e, i)}
                        style={{
                            width: "52px", height: "64px",
                            textAlign: "center",
                            fontSize: "24px",
                            fontFamily: "'Space Mono', monospace",
                            background: error ? "rgba(248,113,113,0.06)" : "rgba(0,212,255,0.04)",
                            border: `2px solid ${error ? "#f87171" : d ? "#00d4ff" : "#1c2333"}`,
                            borderRadius: "12px",
                            color: "#cdd9e5",
                            outline: "none",
                            transition: "border-color 0.2s, background 0.2s",
                            caretColor: "#00d4ff",
                        }}
                        onFocus={e => {
                            if (!error) e.target.style.borderColor = "#00d4ff";
                        }}
                        onBlur={e => {
                            if (!d && !error) e.target.style.borderColor = "#1c2333";
                        }}
                    />
                ))}
            </div>

            {/* Error message */}
            {error && (
                <p style={{
                    fontSize: "12px", color: "#f87171",
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: "0.05em",
                    animation: "fadeUp 0.3s ease",
                }}>
                    INCORRECT PIN — TRY AGAIN
                </p>
            )}

            {loading && (
                <div style={{
                    width: "6px", height: "6px",
                    borderRadius: "50%",
                    background: "#00d4ff",
                    animation: "pulse-dot 1s ease infinite",
                }} />
            )}

            <style>{`
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20% { transform: translateX(-8px); }
                    40% { transform: translateX(8px); }
                    60% { transform: translateX(-6px); }
                    80% { transform: translateX(6px); }
                }
            `}</style>
        </div>
    );
}
