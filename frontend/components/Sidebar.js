"use client";
import { useState, useRef, useEffect } from "react";

const CATEGORY_COLORS = {
    LLMs:       "#00d4ff",
    Vision:     "#60a5fa",
    Robotics:   "#fb923c",
    Research:   "#4ade80",
    Tools:      "#fbbf24",
    Industry:   "#f87171",
    Community:  "#c084fc",
    Newsletter: "#818cf8",
};

export default function Sidebar({
    categories, sources,
    selectedCategory = [], selectedSource = [],
    onCategorySelect, onSourceSelect,
    counts, sortBy, onSortChange,
    isCollapsed, setIsCollapsed,
}) {
    const [isCatOpen, setIsCatOpen] = useState(false);
    const [isSrcOpen, setIsSrcOpen] = useState(false);

    const catRef = useRef(null);
    const srcRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (catRef.current && !catRef.current.contains(event.target)) {
                setIsCatOpen(false);
            }
            if (srcRef.current && !srcRef.current.contains(event.target)) {
                setIsSrcOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedCatArray = Array.isArray(selectedCategory) ? selectedCategory : [];
    const selectedSrcArray = Array.isArray(selectedSource) ? selectedSource : [];

    // Trigger buttons text
    let catTriggerText = "All Categories";
    if (selectedCatArray.length === 1) {
        catTriggerText = selectedCatArray[0];
    } else if (selectedCatArray.length > 1) {
        catTriggerText = `${selectedCatArray[0]} (+${selectedCatArray.length - 1})`;
    }

    let srcTriggerText = "All Sources";
    if (selectedSrcArray.length === 1) {
        srcTriggerText = selectedSrcArray[0];
    } else if (selectedSrcArray.length > 1) {
        srcTriggerText = `${selectedSrcArray[0]} (+${selectedSrcArray.length - 1})`;
    }

    return (
        <div style={{
            width: isCollapsed ? "56px" : "240px",
            flexShrink: 0,
            background: "var(--card-2)",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            position: "sticky",
            top: "64px",
            height: "calc(100vh - 64px)",
            padding: isCollapsed ? "20px 8px" : "24px 20px",
            overflowY: "auto",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            boxSizing: "border-box",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            zIndex: 40,
        }}>

            {/* Toggle Button */}
            <div style={{
                display: "flex",
                justifyContent: isCollapsed ? "center" : "flex-end",
                width: "100%",
            }}>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{
                        background: "color-mix(in srgb, var(--border) 30%, transparent)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-sub)",
                        cursor: "pointer",
                        padding: isCollapsed ? "8px" : "6px 10px",
                        width: isCollapsed ? "38px" : "auto",
                        height: isCollapsed ? "38px" : "auto",
                        fontSize: isCollapsed ? "14px" : "10px",
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: "700",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "var(--accent)";
                        e.currentTarget.style.color = "var(--accent)";
                        e.currentTarget.style.background = "color-mix(in srgb, var(--accent) 8%, transparent)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "var(--border)";
                        e.currentTarget.style.color = "var(--text-sub)";
                        e.currentTarget.style.background = "color-mix(in srgb, var(--border) 30%, transparent)";
                    }}
                >
                    {isCollapsed ? "»" : "« COLLAPSE"}
                </button>
            </div>

            {/* If NOT collapsed, show all the controls */}
            {!isCollapsed && (
                <>
                    {/* Divider */}
                    <div style={{ height: "1px", background: "var(--border)", margin: "0 -4px" }} />

                    {/* Sort By */}
                    <div>
                        <div style={{
                            fontSize: "10px", fontFamily: "'Space Mono', monospace",
                            color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "10px",
                        }}>SORT BY</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            {[
                                { label: "Latest First", value: "latest" },
                                { label: "Oldest First", value: "oldest" },
                            ].map(({ label, value }) => (
                                <button key={value} onClick={() => onSortChange(value)} style={{
                                    display: "flex", alignItems: "center", gap: "8px",
                                    background: "none", border: "none",
                                    padding: "7px 10px", borderRadius: "8px",
                                    cursor: "pointer", textAlign: "left",
                                    color: sortBy === value ? "var(--accent)" : "var(--text-sub)",
                                    fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                                    transition: "all 0.2s",
                                    backgroundColor: sortBy === value ? "color-mix(in srgb, var(--accent) 6%, transparent)" : "transparent",
                                }}
                                    onMouseEnter={e => { if (sortBy !== value) e.currentTarget.style.backgroundColor = "var(--card-hover-2)"; }}
                                    onMouseLeave={e => { if (sortBy !== value) e.currentTarget.style.backgroundColor = "transparent"; }}
                                >
                                    <div style={{
                                        width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                                        border: `1.5px solid ${sortBy === value ? "var(--accent)" : "var(--text-dim)"}`,
                                        background: sortBy === value ? "var(--accent)" : "transparent",
                                        transition: "all 0.2s",
                                    }} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "var(--border)", margin: "0 -4px" }} />

                    {/* Category Dropdown */}
                    <div ref={catRef} style={{ position: "relative" }}>
                        <div style={{
                            fontSize: "10px", fontFamily: "'Space Mono', monospace",
                            color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "10px",
                        }}>CATEGORY</div>
                        
                        <button
                            onClick={() => { setIsCatOpen(!isCatOpen); setIsSrcOpen(false); }}
                            style={{
                                width: "100%",
                                background: "var(--select-bg)", border: "1px solid var(--border)",
                                borderRadius: "8px", padding: "10px 12px",
                                color: selectedCatArray.length > 0 ? "var(--accent)" : "var(--text-sub)",
                                fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                                cursor: "pointer", display: "flex", justifyContent: "space-between",
                                alignItems: "center", outline: "none", transition: "all 0.2s",
                                fontWeight: selectedCatArray.length > 0 ? "600" : "normal",
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                            onMouseLeave={e => { if (!isCatOpen) e.currentTarget.style.borderColor = "var(--border)"; }}
                        >
                            <span>{catTriggerText}</span>
                            <span style={{ fontSize: "9px", opacity: 0.7, transform: isCatOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
                        </button>

                        {isCatOpen && (
                            <div style={{
                                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                                background: "var(--card)", border: "1px solid var(--border)",
                                borderRadius: "8px", padding: "6px", zIndex: 100,
                                display: "flex", flexDirection: "column", gap: "2px",
                                maxHeight: "250px", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            }}>
                                {/* "All" Option */}
                                <button
                                    onClick={() => onCategorySelect("All")}
                                    style={{
                                        display: "flex", alignItems: "center", justifyItems: "center", gap: "8px",
                                        background: selectedCatArray.length === 0 ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "none",
                                        border: "none", borderRadius: "6px", padding: "6px 8px", cursor: "pointer",
                                        textAlign: "left", width: "100%", transition: "all 0.15s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "var(--card-hover-2)"}
                                    onMouseLeave={e => e.currentTarget.style.background = selectedCatArray.length === 0 ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "none"}
                                >
                                    <div style={{
                                        width: "12px", height: "12px", border: "1px solid var(--border)",
                                        borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center",
                                        background: selectedCatArray.length === 0 ? "var(--accent)" : "transparent",
                                        borderColor: selectedCatArray.length === 0 ? "var(--accent)" : "var(--border)",
                                    }}>
                                        {selectedCatArray.length === 0 && <span style={{ fontSize: "8px", color: "#fff", fontWeight: "bold" }}>✓</span>}
                                    </div>
                                    <span style={{ fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: selectedCatArray.length === 0 ? "var(--accent)" : "var(--text-sub)" }}>
                                        All Categories
                                    </span>
                                </button>

                                {/* List of Categories */}
                                {categories.filter(c => c !== "All").map((cat) => {
                                    const isSelected = selectedCatArray.includes(cat);
                                    const color = CATEGORY_COLORS[cat] || "var(--accent)";
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => onCategorySelect(cat)}
                                            style={{
                                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                                background: isSelected ? `${color}10` : "none",
                                                border: "none", borderRadius: "6px", padding: "6px 8px", cursor: "pointer",
                                                textAlign: "left", width: "100%", transition: "all 0.15s",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = "var(--card-hover-2)"}
                                            onMouseLeave={e => e.currentTarget.style.background = isSelected ? `${color}10` : "none"}
                                        >
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <div style={{
                                                    width: "12px", height: "12px", border: "1px solid var(--border)",
                                                    borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center",
                                                    background: isSelected ? color : "transparent",
                                                    borderColor: isSelected ? color : "var(--border)",
                                                }}>
                                                    {isSelected && <span style={{ fontSize: "8px", color: "#fff", fontWeight: "bold" }}>✓</span>}
                                                </div>
                                                <span style={{
                                                    fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                                                    color: isSelected ? "var(--text)" : "var(--text-sub)",
                                                    fontWeight: isSelected ? "600" : "normal",
                                                }}>{cat}</span>
                                            </div>
                                            {counts[cat] !== undefined && (
                                                <span style={{
                                                    fontSize: "10px", fontFamily: "'Space Mono', monospace",
                                                    color: isSelected ? "var(--accent)" : "var(--text-dim)",
                                                }}>{counts[cat]}</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "var(--border)", margin: "0 -4px" }} />

                    {/* Sources Dropdown */}
                    <div ref={srcRef} style={{ position: "relative" }}>
                        <div style={{
                            fontSize: "10px", fontFamily: "'Space Mono', monospace",
                            color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "10px",
                        }}>SOURCE</div>
                        
                        <button
                            onClick={() => { setIsSrcOpen(!isSrcOpen); setIsCatOpen(false); }}
                            style={{
                                width: "100%",
                                background: "var(--select-bg)", border: "1px solid var(--border)",
                                borderRadius: "8px", padding: "10px 12px",
                                color: selectedSrcArray.length > 0 ? "var(--accent)" : "var(--text-sub)",
                                fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                                cursor: "pointer", display: "flex", justifyContent: "space-between",
                                alignItems: "center", outline: "none", transition: "all 0.2s",
                                fontWeight: selectedSrcArray.length > 0 ? "600" : "normal",
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
                            onMouseLeave={e => { if (!isSrcOpen) e.currentTarget.style.borderColor = "var(--border)"; }}
                        >
                            <span>{srcTriggerText}</span>
                            <span style={{ fontSize: "9px", opacity: 0.7, transform: isSrcOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
                        </button>

                        {isSrcOpen && (
                            <div style={{
                                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                                background: "var(--card)", border: "1px solid var(--border)",
                                borderRadius: "8px", padding: "6px", zIndex: 100,
                                display: "flex", flexDirection: "column", gap: "2px",
                                maxHeight: "250px", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                            }}>
                                {/* "All Sources" Option */}
                                <button
                                    onClick={() => onSourceSelect("All Sources")}
                                    style={{
                                        display: "flex", alignItems: "center", gap: "8px",
                                        background: selectedSrcArray.length === 0 ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "none",
                                        border: "none", borderRadius: "6px", padding: "6px 8px", cursor: "pointer",
                                        textAlign: "left", width: "100%", transition: "all 0.15s",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "var(--card-hover-2)"}
                                    onMouseLeave={e => e.currentTarget.style.background = selectedSrcArray.length === 0 ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "none"}
                                >
                                    <div style={{
                                        width: "12px", height: "12px", border: "1px solid var(--border)",
                                        borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center",
                                        background: selectedSrcArray.length === 0 ? "var(--accent)" : "transparent",
                                        borderColor: selectedSrcArray.length === 0 ? "var(--accent)" : "var(--border)",
                                    }}>
                                        {selectedSrcArray.length === 0 && <span style={{ fontSize: "8px", color: "#fff", fontWeight: "bold" }}>✓</span>}
                                    </div>
                                    <span style={{ fontSize: "12px", fontFamily: "'DM Sans', sans-serif", color: selectedSrcArray.length === 0 ? "var(--accent)" : "var(--text-sub)" }}>
                                        All Sources
                                    </span>
                                </button>

                                {/* List of Sources */}
                                {sources.map((src) => {
                                    const isSelected = selectedSrcArray.includes(src);
                                    return (
                                        <button
                                            key={src}
                                            onClick={() => onSourceSelect(src)}
                                            style={{
                                                display: "flex", alignItems: "center", gap: "8px",
                                                background: isSelected ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "none",
                                                border: "none", borderRadius: "6px", padding: "6px 8px", cursor: "pointer",
                                                textAlign: "left", width: "100%", transition: "all 0.15s",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = "var(--card-hover-2)"}
                                            onMouseLeave={e => e.currentTarget.style.background = isSelected ? "color-mix(in srgb, var(--accent) 8%, transparent)" : "none"}
                                        >
                                            <div style={{
                                                width: "12px", height: "12px", border: "1px solid var(--border)",
                                                borderRadius: "3px", display: "flex", alignItems: "center", justifyContent: "center",
                                                background: isSelected ? "var(--accent)" : "transparent",
                                                borderColor: isSelected ? "var(--accent)" : "var(--border)",
                                            }}>
                                                {isSelected && <span style={{ fontSize: "8px", color: "#fff", fontWeight: "bold" }}>✓</span>}
                                            </div>
                                            <span style={{
                                                fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                                                color: isSelected ? "var(--accent)" : "var(--text-sub)",
                                                fontWeight: isSelected ? "600" : "normal",
                                            }}>{src}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Reset Filters */}
                    {(selectedCatArray.length > 0 || selectedSrcArray.length > 0 || sortBy !== "latest") && (
                        <button
                            onClick={() => {
                                onCategorySelect("All");
                                onSourceSelect("All Sources");
                                onSortChange("latest");
                            }}
                            style={{
                                marginTop: "12px", width: "100%",
                                background: "none", border: "1px solid var(--border)",
                                borderRadius: "8px", padding: "7px",
                                color: "var(--text-sub)", fontSize: "11px",
                                fontFamily: "'Space Mono', monospace",
                                cursor: "pointer", transition: "all 0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "#f87171"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-sub)"; }}
                        >
                            RESET FILTERS
                        </button>
                    )}
                </>
            )}
        </div>
    );
}