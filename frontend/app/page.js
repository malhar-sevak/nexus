"use client";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import NewsCard from "../components/NewsCard";
import CategoryFilter from "../components/CategoryFilter";
import Footer from "../components/Footer";
import { getArticles, getCategories, getSources } from "../lib/api";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [sources, setSources] = useState([]);
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((data) => setCategories(data.categories));
    getSources().then((data) => setSources(data.sources));
  }, []);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getArticles(selectedCat, selectedSource, query, page);
      setArticles(data.articles);
      setTotal(data.total);
    } catch (e) {
      console.error("Failed to fetch articles", e);
    } finally {
      setLoading(false);
    }
  }, [selectedCat, selectedSource, query, page]);

  useEffect(() => { fetchArticles(); }, [fetchArticles]);

  const handleCategorySelect = (cat) => { setSelectedCat(cat); setPage(1); };
  const handleSourceSelect = (src) => { setSelectedSource(src); setPage(1); };
  const handleSearch = () => { setQuery(search); setPage(1); };

  const totalPages = Math.ceil(total / 20);

  return (
    <div style={{ minHeight: "100vh", background: "#080810" }}>

      {/* Navbar with search */}
      <Navbar
        search={search}
        setSearch={setSearch}
        onSearch={handleSearch}
      />

      {/* Hero */}
      <div style={{
        borderBottom: "1px solid #1e1e2e",
        padding: "48px 24px 40px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: "-100px", left: "50%",
          transform: "translateX(-50%)",
          width: "600px", height: "300px",
          background: "radial-gradient(ellipse, rgba(0,255,136,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1280px", margin: "0 auto", position: "relative" }}>

          {/* Live indicator */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(0,255,136,0.08)",
            border: "1px solid rgba(0,255,136,0.2)",
            borderRadius: "100px", padding: "4px 14px", marginBottom: "20px",
          }}>
            <span className="live-dot" />
            <span style={{ fontSize: "11px", color: "#00ff88", fontFamily: "'Space Mono', monospace" }}>
              LIVE — {total} articles tracked
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: "800",
            fontSize: "clamp(28px, 4vw, 48px)", lineHeight: "1.15",
            color: "#e2e8f0", marginBottom: "12px",
          }} className="fade-up">
            Stay ahead of the{" "}
            <span style={{ color: "#00ff88" }}>AI revolution.</span>
          </h1>

          <p style={{
            color: "#475569", fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif", maxWidth: "440px",
          }} className="fade-up-delay-1">
            Every breakthrough, every model launch, every research paper —
            curated by AI, delivered in real time.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "36px 24px" }}>

        {/* Filters */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "16px", marginBottom: "28px",
        }}>
          <CategoryFilter
            categories={categories}
            sources={sources}
            selectedCategory={selectedCat}
            selectedSource={selectedSource}
            onCategorySelect={handleCategorySelect}
            onSourceSelect={handleSourceSelect}
          />
          <span style={{ fontSize: "11px", color: "#2a2a3e", fontFamily: "'Space Mono', monospace" }}>
            {total} RESULTS
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{
                background: "#0e0e1a", border: "1px solid #1e1e2e",
                borderRadius: "16px", height: "320px",
                opacity: 0.5,
              }} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#2a2a3e" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>◎</div>
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px" }}>
              NO ARTICLES FOUND
            </p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}>
            {articles.map((article, i) => (
              <NewsCard key={article.id} article={article} index={i} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: "flex", justifyContent: "center",
            alignItems: "center", gap: "12px", marginTop: "48px",
          }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: "10px 20px", borderRadius: "10px",
                background: "#0e0e1a", border: "1px solid #1e1e2e",
                color: page === 1 ? "#2a2a3e" : "#e2e8f0",
                fontSize: "12px", fontFamily: "'Space Mono', monospace",
                cursor: page === 1 ? "not-allowed" : "pointer",
              }}>← PREV</button>
            <span style={{ fontSize: "12px", color: "#475569", fontFamily: "'Space Mono', monospace" }}>
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: "10px 20px", borderRadius: "10px",
                background: "#0e0e1a", border: "1px solid #1e1e2e",
                color: page === totalPages ? "#2a2a3e" : "#e2e8f0",
                fontSize: "12px", fontFamily: "'Space Mono', monospace",
                cursor: page === totalPages ? "not-allowed" : "pointer",
              }}>NEXT →</button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}