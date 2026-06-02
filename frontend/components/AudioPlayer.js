"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export default function AudioPlayer({ text, title }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused]   = useState(false);
    const [progress, setProgress]   = useState(0);
    const [speed, setSpeed]         = useState(1);
    const [supported, setSupported] = useState(true);
    const [currentWord, setCurrentWord] = useState("");
    const [elapsed, setElapsed]     = useState(0);
    const [duration, setDuration]   = useState(0);

    const utterRef      = useRef(null);
    const intervalRef   = useRef(null);
    const wordCountRef  = useRef(0);
    const totalWordsRef = useRef(0);

    // Estimate reading duration based on avg 160 words/min at speed 1
    useEffect(() => {
        if (text) {
            const words = text.trim().split(/\s+/).length;
            totalWordsRef.current = words;
            setDuration(Math.round((words / 160) * 60));
        }
    }, [text]);

    useEffect(() => {
        setSupported("speechSynthesis" in window);
        return () => {
            if (utterRef.current) window.speechSynthesis.cancel();
            clearInterval(intervalRef.current);
        };
    }, []);

    const stopProgress = () => {
        clearInterval(intervalRef.current);
    };

    const startProgress = useCallback(() => {
        stopProgress();
        intervalRef.current = setInterval(() => {
            const totalWords = totalWordsRef.current;
            const wordsRead  = wordCountRef.current;
            const pct = totalWords > 0 ? Math.min((wordsRead / totalWords) * 100, 100) : 0;
            const secs = Math.round((wordsRead / (160 * speed)) * 60);
            setProgress(pct);
            setElapsed(secs);
        }, 300);
    }, [speed]);

    const play = useCallback(() => {
        if (!supported) return;
        window.speechSynthesis.cancel();
        wordCountRef.current = 0;
        setProgress(0);
        setElapsed(0);
        setCurrentWord("");

        const utter = new SpeechSynthesisUtterance(text);
        utter.rate  = speed;
        utter.pitch = 1;
        utter.lang  = "en-US";

        // Pick a good voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v =>
            v.name.includes("Google") ||
            v.name.includes("Microsoft") ||
            v.name.includes("Daniel") ||
            v.name.includes("Samantha")
        );
        if (preferred) utter.voice = preferred;

        utter.onboundary = (e) => {
            if (e.name === "word") {
                wordCountRef.current += 1;
                const word = text.substr(e.charIndex, e.charLength);
                setCurrentWord(word);
            }
        };

        utter.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setProgress(100);
            setCurrentWord("");
            stopProgress();
        };

        utter.onerror = () => {
            setIsPlaying(false);
            setIsPaused(false);
            stopProgress();
        };

        utterRef.current = utter;
        window.speechSynthesis.speak(utter);
        setIsPlaying(true);
        setIsPaused(false);
        startProgress();
    }, [text, speed, supported, startProgress]);

    const pause = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
        setIsPlaying(false);
        stopProgress();
    };

    const resume = () => {
        window.speechSynthesis.resume();
        setIsPaused(false);
        setIsPlaying(true);
        startProgress();
    };

    const stop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
        setElapsed(0);
        setCurrentWord("");
        wordCountRef.current = 0;
        stopProgress();
    };

    const changeSpeed = (s) => {
        setSpeed(s);
        if (isPlaying || isPaused) {
            stop();
        }
    };

    const fmtTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${String(s).padStart(2, "0")}`;
    };

    const estimatedDuration = Math.round(duration / speed);
    const speeds = [0.75, 1, 1.25, 1.5, 2];

    if (!supported) {
        return (
            <div style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: "14px", padding: "16px 20px",
                color: "var(--text-dim)", fontSize: "12px",
                fontFamily: "'Space Mono', monospace",
            }}>
                AUDIO BRIEFING — NOT SUPPORTED IN THIS BROWSER
            </div>
        );
    }

    return (
        <div style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            position: "relative",
            overflow: "hidden",
        }}>

            {/* Subtle animated background glow when playing */}
            {isPlaying && (
                <div style={{
                    position: "absolute", inset: 0, pointerEvents: "none",
                    background: "radial-gradient(ellipse at 20% 50%, color-mix(in srgb, var(--accent) 4%, transparent) 0%, transparent 70%)",
                    animation: "pulse-glow 2s ease-in-out infinite alternate",
                }} />
            )}

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                    width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
                    background: isPlaying
                        ? "linear-gradient(135deg, var(--accent), #4f46e5)"
                        : "color-mix(in srgb, var(--accent) 12%, transparent)",
                    border: `1px solid ${isPlaying ? "transparent" : "var(--border)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.4s ease",
                }}>
                    {/* Sound wave icon */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke={isPlaying ? "#07090f" : "var(--accent)"} strokeWidth="2.5"
                        strokeLinecap="round">
                        <line x1="2" y1="12" x2="2" y2="12" />
                        <line x1="6" y1="8" x2="6" y2="16" />
                        <line x1="10" y1="4" x2="10" y2="20" />
                        <line x1="14" y1="8" x2="14" y2="16" />
                        <line x1="18" y1="10" x2="18" y2="14" />
                        <line x1="22" y1="12" x2="22" y2="12" />
                    </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontSize: "10px", fontFamily: "'Space Mono', monospace",
                        color: "var(--accent)", letterSpacing: "0.12em", marginBottom: "2px",
                    }}>
                        AUDIO BRIEFING
                    </div>
                    <div style={{
                        fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                        color: "var(--text-sub)", whiteSpace: "nowrap",
                        overflow: "hidden", textOverflow: "ellipsis",
                    }}>
                        {isPlaying && currentWord ? (
                            <span>Reading: <em style={{ color: "var(--text)", fontStyle: "normal", fontWeight: 600 }}>"{currentWord}"</em></span>
                        ) : (
                            title || "Today's Nexus Brief"
                        )}
                    </div>
                </div>
                <div style={{
                    fontSize: "10px", fontFamily: "'Space Mono', monospace",
                    color: "var(--text-dim)", flexShrink: 0,
                }}>
                    {fmtTime(elapsed)} / ~{fmtTime(estimatedDuration)}
                </div>
            </div>

            {/* Progress bar */}
            <div style={{
                height: "4px", borderRadius: "4px",
                background: "var(--border)", position: "relative", overflow: "hidden",
            }}>
                <div style={{
                    position: "absolute", left: 0, top: 0, bottom: 0,
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, var(--accent), #4f46e5)",
                    borderRadius: "4px",
                    transition: "width 0.3s ease",
                }} />
            </div>

            {/* Controls row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

                {/* Main controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>

                    {/* Stop */}
                    <button
                        onClick={stop}
                        disabled={!isPlaying && !isPaused}
                        title="Stop"
                        style={{
                            width: "32px", height: "32px", borderRadius: "8px",
                            background: "none", border: "1px solid var(--border)",
                            color: (isPlaying || isPaused) ? "var(--text-sub)" : "var(--text-dim)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: (isPlaying || isPaused) ? "pointer" : "default",
                            transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { if (isPlaying || isPaused) e.currentTarget.style.borderColor = "#f87171"; }}
                        onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
                    >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                        </svg>
                    </button>

                    {/* Play / Pause / Resume */}
                    <button
                        onClick={isPlaying ? pause : isPaused ? resume : play}
                        title={isPlaying ? "Pause" : isPaused ? "Resume" : "Play"}
                        style={{
                            width: "42px", height: "42px", borderRadius: "12px",
                            background: "linear-gradient(135deg, var(--accent), #4f46e5)",
                            border: "none",
                            color: "#07090f",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: isPlaying ? "0 4px 16px color-mix(in srgb, var(--accent) 30%, transparent)" : "none",
                        }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                        {isPlaying ? (
                            // Pause icon
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" rx="1" />
                                <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                        ) : (
                            // Play icon
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                                <polygon points="5,3 19,12 5,21" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Speed selector */}
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {speeds.map(s => (
                        <button
                            key={s}
                            onClick={() => changeSpeed(s)}
                            style={{
                                padding: "4px 8px", borderRadius: "6px",
                                fontSize: "10px", fontFamily: "'Space Mono', monospace",
                                border: "1px solid",
                                borderColor: speed === s ? "var(--accent)" : "var(--border)",
                                background: speed === s ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "none",
                                color: speed === s ? "var(--accent)" : "var(--text-dim)",
                                cursor: "pointer", transition: "all 0.15s",
                            }}
                        >
                            {s}×
                        </button>
                    ))}
                </div>
            </div>

            {/* Waveform bars (animated when playing) */}
            <div style={{ display: "flex", alignItems: "flex-end", gap: "3px", height: "20px" }}>
                {[3, 7, 5, 12, 8, 15, 6, 10, 4, 9, 14, 5, 11, 7, 3, 8, 12, 5, 9, 6].map((h, i) => (
                    <div
                        key={i}
                        style={{
                            flex: 1, borderRadius: "2px",
                            background: i < (progress / 100) * 20
                                ? "var(--accent)"
                                : "var(--border)",
                            height: isPlaying ? `${h}px` : "3px",
                            transition: isPlaying
                                ? `height ${0.2 + (i % 5) * 0.07}s ease-in-out ${(i % 7) * 0.04}s, background 0.3s`
                                : "height 0.4s ease, background 0.3s",
                            animation: isPlaying ? `wave-bar ${0.6 + (i % 4) * 0.15}s ease-in-out infinite alternate` : "none",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
