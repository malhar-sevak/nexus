"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "../components/Navbar";
import NewsCard from "../components/NewsCard";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import HeroCarousel from "../components/HeroCarousel";
import BackToTop from "../components/BackToTop";
import CountUp from "../components/CountUp";
import { getArticles, getCategories, getSources, getCategoryCounts } from "../lib/api";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [sources, setSources] = useState([]);
  const [selectedCat, setSelectedCat] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All Sources");
  const [sortBy, setSortBy] = useState("latest");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [catCounts, setCatCounts] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(false);
  const observerRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    getCategories().then((data) => setCategories(data.categories));
    getSources().then((data) => setSources(data.sources));
    getCategoryCounts().then((data) => setCatCounts(data.counts));
  }, []);

  // Reset articles when filters change
  useEffect(() => {
    setArticles([]);
    setPage(1);
    setHasMore(true);
  }, [selectedCat, selectedSource, query, sortBy]);

  // Fetch articles
  const fetchArticles = useCallback(async (pageNum) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await getArticles(selectedCat, selectedSource, query, pageNum, sortBy);
      if (pageNum === 1) {
        setArticles(data.articles);
      } else {
        setArticles(prev => [...prev, ...data.articles]);
      }
      setTotal(data.total);
      setHasMore(data.articles.length === 20);
    } catch (e) {
      console.error("Failed to fetch articles", e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCat, selectedSource, query, sortBy]);

  useEffect(() => {
    fetchArticles(page);
  }, [page, fetchArticles]);

  // Infinite scroll observer
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [hasMore, loadingMore, loading]);

  const handleCategorySelect = (cat) => { setSelectedCat(cat); };
  const handleSourceSelect = (src) => { setSelectedSource(src); };
  const handleSortChange = (s) => { setSortBy(s); };
  const handleSearch = () => { setQuery(search); };

  return (
    <div style={{ minHeight: "100vh", background: "#07090f", display: "flex", flexDirection: "column" }}>
      <Navbar search={search} setSearch={setSearch} onSearch={handleSearch} />

      {/* Main layout container with full height flex */}
      <div style={{ display: "flex", flex: 1, position: "relative", alignItems: "stretch" }}>

        {/* Sticky Sidebar starting right below the navbar */}
        <Sidebar
          categories={categories}
          sources={sources}
          selectedCategory={selectedCat}
          selectedSource={selectedSource}
          onCategorySelect={handleCategorySelect}
          onSourceSelect={handleSourceSelect}
          counts={catCounts}
          sortBy={sortBy}
          onSortChange={handleSortChange}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Content Pane containing Hero, Trending and Feed */}
        <div style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}>



          {/* Feed Content Pane */}
          <main style={{ maxWidth: "1280px", width: "100%", margin: "0 auto", padding: "36px 24px", boxSizing: "border-box" }}>

            {/* Trending */}
            <HeroCarousel total={total} />

            {/* Results count */}
            <div style={{
              fontSize: "11px", color: "#2a2a3e",
              fontFamily: "'Space Mono', monospace",
              marginBottom: "20px",
            }}>
              <>LIVE — <CountUp target={total} /> articles tracked</>
            </div>

            {/* Grid */}
            {loading ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
              }}>
                {[...Array(8)].map((_, i) => (
                  <div key={i} style={{
                    background: "#0d1117", border: "1px solid #1c2333",
                    borderRadius: "16px", height: "320px", opacity: 0.5,
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
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "20px",
                }}>
                  {articles.map((article, i) => (
                    <NewsCard key={`${article.id}-${i}`} article={article} index={i % 20} />
                  ))}
                </div>

                {/* Infinite scroll sentinel */}
                <div ref={sentinelRef} style={{ height: "40px", marginTop: "20px" }} />

                {/* Loading more indicator */}
                {loadingMore && (
                  <div style={{
                    display: "flex", justifyContent: "center",
                    alignItems: "center", gap: "8px",
                    padding: "20px 0",
                  }}>
                    <span className="live-dot" />
                    <span style={{ fontSize: "11px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                      LOADING MORE...
                    </span>
                  </div>
                )}

                {/* End of feed */}
                {!hasMore && articles.length > 0 && (
                  <div style={{
                    textAlign: "center", padding: "32px 0",
                    color: "#1c2333", fontSize: "11px",
                    fontFamily: "'Space Mono', monospace",
                  }}>
                    — END OF FEED —
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <Footer />
      <BackToTop />
    </div>
  );
}