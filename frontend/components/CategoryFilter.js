export default function CategoryFilter({ categories, sources, selectedCategory, selectedSource, onCategorySelect, onSourceSelect }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>

            {/* Category pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => onCategorySelect(cat)}
                        style={{
                            padding: "6px 16px",
                            borderRadius: "8px",
                            fontSize: "12px",
                            fontFamily: "'Space Mono', monospace",
                            fontWeight: "700",
                            letterSpacing: "0.05em",
                            border: selectedCategory === cat ? "1px solid #00ff88" : "1px solid #1e1e2e",
                            background: selectedCategory === cat ? "rgba(0,255,136,0.1)" : "#0e0e1a",
                            color: selectedCategory === cat ? "#00ff88" : "#475569",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Divider */}
            <div style={{ width: "1px", height: "24px", background: "#1e1e2e" }} />

            {/* Source dropdown */}
            <select
                value={selectedSource}
                onChange={(e) => onSourceSelect(e.target.value)}
                style={{
                    background: "#0e0e1a",
                    border: "1px solid #1e1e2e",
                    borderRadius: "8px",
                    padding: "6px 14px",
                    color: selectedSource !== "All Sources" ? "#00ff88" : "#475569",
                    fontSize: "12px",
                    fontFamily: "'Space Mono', monospace",
                    cursor: "pointer",
                    outline: "none",
                    transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = "#00ff88"}
                onBlur={e => e.target.style.borderColor = "#1e1e2e"}
            >
                <option value="All Sources">ALL SOURCES</option>
                {sources.map((source) => (
                    <option key={source} value={source}>{source}</option>
                ))}
            </select>
        </div>
    );
}