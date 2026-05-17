"use client";

const CATEGORY_COLORS = {
    LLMs: "#00d4ff",
    Vision: "#60a5fa",
    Robotics: "#fb923c",
    Research: "#4ade80",
    Tools: "#fbbf24",
    Industry: "#f87171",
    Community: "#c084fc",
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
            background: "#090d16",
            borderRight: "1px solid #1c2333",
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
                        background: "rgba(28, 35, 51, 0.3)",
                        border: "1px solid #1c2333",
                        borderRadius: "8px",
                        color: "#444c56",
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
                        e.currentTarget.style.borderColor = "#00d4ff";
                        e.currentTarget.style.color = "#00d4ff";
                        e.currentTarget.style.background = "rgba(0, 212, 255, 0.08)";
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "#1c2333";
                        e.currentTarget.style.color = "#444c56";
                        e.currentTarget.style.background = "rgba(28, 35, 51, 0.3)";
                    }}
                >
                    {isCollapsed ? "»" : "« COLLAPSE"}
                </button>
            </div>

            {/* If NOT collapsed, show all the controls */}
            {!isCollapsed && (
                <>
                    {/* Divider */}
                    <div style={{ height: "1px", background: "#1c2333", margin: "0 -4px" }} />

                    {/* Sort By */}
                    <div>
                        <div style={{
                            fontSize: "10px", fontFamily: "'Space Mono', monospace",
                            color: "#1c2333", letterSpacing: "0.1em", marginBottom: "10px",
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
                                    color: sortBy === value ? "#00d4ff" : "#444c56",
                                    fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                                    transition: "all 0.2s",
                                    backgroundColor: sortBy === value ? "rgba(0,212,255,0.06)" : "transparent",
                                }}
                                    onMouseEnter={e => { if (sortBy !== value) e.currentTarget.style.backgroundColor = "#0d1117"; }}
                                    onMouseLeave={e => { if (sortBy !== value) e.currentTarget.style.backgroundColor = "transparent"; }}
                                >
                                    <div style={{
                                        width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                                        border: `1.5px solid ${sortBy === value ? "#00d4ff" : "#444c56"}`,
                                        background: sortBy === value ? "#00d4ff" : "transparent",
                                        transition: "all 0.2s",
                                    }} />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "#1c2333", margin: "0 -4px" }} />

                    {/* Category */}
                    <div>
                        <div style={{
                            fontSize: "10px", fontFamily: "'Space Mono', monospace",
                            color: "#1c2333", letterSpacing: "0.1em", marginBottom: "10px",
                        }}>CATEGORY</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                            {categories.map((cat) => {
                                const isSelected = selectedCategory === cat;
                                const color = CATEGORY_COLORS[cat] || "#00d4ff";
                                return (
                                    <button key={cat} onClick={() => onCategorySelect(cat)} style={{
                                        display: "flex", alignItems: "center",
                                        justifyContent: "space-between",
                                        background: isSelected ? `${color}10` : "none",
                                        border: "none", borderRadius: "8px",
                                        padding: "7px 10px", cursor: "pointer",
                                        transition: "all 0.2s",
                                    }}
                                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = "#0d1117"; }}
                                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "none"; }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div style={{
                                                width: "6px", height: "6px", borderRadius: "50%", flexShrink: 0,
                                                background: isSelected ? color : "#1c2333",
                                                transition: "background 0.2s",
                                            }} />
                                            <span style={{
                                                fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                                                color: isSelected ? color : "#444c56",
                                                transition: "color 0.2s",
                                            }}>{cat}</span>
                                        </div>
                                        {counts[cat] !== undefined && (
                                            <span style={{
                                                fontSize: "10px", fontFamily: "'Space Mono', monospace",
                                                color: isSelected ? color : "#1c2333",
                                            }}>{counts[cat]}</span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Divider */}
                    <div style={{ height: "1px", background: "#1c2333", margin: "0 -4px" }} />

                    {/* Sources */}
                    <div>
                        <div style={{
                            fontSize: "10px", fontFamily: "'Space Mono', monospace",
                            color: "#1c2333", letterSpacing: "0.1em", marginBottom: "10px",
                        }}>SOURCE</div>
                        <select
                            value={selectedSource}
                            onChange={(e) => onSourceSelect(e.target.value)}
                            style={{
                                width: "100%",
                                background: "#0d1117", border: "1px solid #1c2333",
                                borderRadius: "8px", padding: "8px 12px",
                                color: selectedSource !== "All Sources" ? "#00d4ff" : "#444c56",
                                fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
                                cursor: "pointer", outline: "none",
                                transition: "border-color 0.2s",
                            }}
                            onFocus={e => e.target.style.borderColor = "#00d4ff"}
                            onBlur={e => e.target.style.borderColor = "#1c2333"}
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
                                background: "none", border: "1px solid #1c2333",
                                borderRadius: "8px", padding: "7px",
                                color: "#444c56", fontSize: "11px",
                                fontFamily: "'Space Mono', monospace",
                                cursor: "pointer", transition: "all 0.2s",
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = "#f87171"; e.currentTarget.style.color = "#f87171"; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1c2333"; e.currentTarget.style.color = "#444c56"; }}
                        >
                            RESET FILTERS
                        </button>
                    )}
                </>
            )}
        </div>
    );
}