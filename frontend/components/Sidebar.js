"use client";

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
    selectedCategory, selectedSource,
    onCategorySelect, onSourceSelect,
    counts, sortBy, onSortChange,
    isCollapsed, setIsCollapsed,
}) {
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

                    {/* Category */}
                    <div>
                        <div style={{
                            fontSize: "10px", fontFamily: "'Space Mono', monospace",
                            color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "10px",
                        }}>CATEGORY</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            {categories.map((cat) => {
                                const isSelected = selectedCategory === cat;
                                const color = CATEGORY_COLORS[cat] || "var(--accent)";
                                return (
                                    <button key={cat} onClick={() => onCategorySelect(cat)} style={{
                                        display: "flex", alignItems: "center",
                                        justifyContent: "space-between",
                                        background: isSelected ? `${color}10` : "none",
                                        border: "none", borderRadius: "8px",
                                        padding: "7px 10px", cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "var(--card-hover-2)"; }}
                                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "none"; }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div style={{
                                                width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                                                background: isSelected ? color : "var(--border)",
                                                transition: "background 0.2s",
                                            }} />
                                            <span style={{
                                                fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                                                color: isSelected ? color : "var(--text-sub)",
                                                transition: "color 0.2s",
                                            }}>{cat}</span>
                                        </div>
                                        {counts[cat] !== undefined && (
                                            <span style={{
                                                fontSize: "10px", fontFamily: "'Space Mono', monospace",
                                                color: isSelected ? color : "var(--text-dim)",
                                            }}>{counts[cat]}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "var(--border)", margin: "0 -4px" }} />

                    {/* Sources */}
                    <div>
                        <div style={{
                            fontSize: "10px", fontFamily: "'Space Mono', monospace",
                            color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "10px",
                        }}>SOURCE</div>
                        <select
                            value={selectedSource}
                            onChange={(e) => onSourceSelect(e.target.value)}
                            style={{
                                width: "100%",
                                background: "var(--select-bg)", border: "1px solid var(--border)",
                                borderRadius: "8px", padding: "8px 12px",
                                color: selectedSource !== "All Sources" ? "var(--accent)" : "var(--text-sub)",
                                fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                                cursor: "pointer", outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={e => e.target.style.borderColor = "var(--accent)"}
                            onBlur={e => e.target.style.borderColor = "var(--border)"}
                        >
                            <option value="All Sources">All Sources</option>
                            {sources.map((source) => (
                                <option key={source} value={source}>{source}</option>
                            ))}
                        </select>
                    </div>

                    {/* Reset Filters */}
                    {(selectedCategory !== "All" || selectedSource !== "All Sources" || sortBy !== "latest") && (
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