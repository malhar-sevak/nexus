export default function CategoryFilter({ categories, sources, selectedCategory, selectedSource, onCategorySelect, onSourceSelect, counts = {} }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {categories.map((cat) => (
                    <button key={cat} onClick={() => onCategorySelect(cat)} style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontFamily: "'Space Mono', monospace",
                        fontWeight: "700",
                        letterSpacing: "0.05em",
                        border: selectedCategory === cat ? "1px solid #00d4ff" : "1px solid #1c2333",
                        background: selectedCategory === cat ? "rgba(0,212,255,0.08)" : "#0d1117",
                        color: selectedCategory === cat ? "#00d4ff" : "#444c56",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                    }}>
                        {cat}
                        {counts[cat] !== undefined && (
                            <span style={{
                                fontSize: "10px",
                                background: selectedCategory === cat ? "rgba(0,212,255,0.15)" : "#1c2333",
                                color: selectedCategory === cat ? "#00d4ff" : "#444c56",
                                padding: "1px 6px",
                                borderRadius: "4px",
                                fontFamily: "'Space Mono', monospace",
                            }}>
                                {counts[cat]}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div style={{ width: "1px", height: "24px", background: "#1c2333" }} />

            <select
                value={selectedSource}
                onChange={(e) => onSourceSelect(e.target.value)}
                style={{
                    background: "#0d1117", border: "1px solid #1c2333",
                    borderRadius: "8px", padding: "6px 14px",
                    color: selectedSource !== "All Sources" ? "#00d4ff" : "#444c56",
                    fontSize: "12px", fontFamily: "'Space Mono', monospace",
                    cursor: "pointer", outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#00d4ff"}
                onBlur={e => e.target.style.borderColor = "#1c2333"}
            >
                <option value="All Sources">ALL SOURCES</option>
                {sources.map((source) => (
                    <option key={source} value={source}>{source}</option>
                ))}
            </select>
        </div>
    );
}