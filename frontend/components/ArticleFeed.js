"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Navbar from "./Navbar";
import NewsCard from "./NewsCard";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import HeroCarousel from "./HeroCarousel";
import BackToTop from "./BackToTop";
import CountUp from "./CountUp";
import { getArticles, getCategories, getSources, getCategoryCounts } from "../lib/api";

export default function ArticleFeed({
    initialArticles = [],
    initialTotal    = 0,
    initialCategories = ["All"],
    initialSources  = [],
    initialCatCounts = {},
}) {
    const [articles, setArticles]       = useState(initialArticles);
    const [categories, setCategories]   = useState(initialCategories);
    const [sources, setSources]         = useState(initialSources);
    const [selectedCat, setSelectedCat] = useState("All");
    const [selectedSource, setSelectedSource] = useState("All Sources");
    const [sortBy, setSortBy]           = useState("latest");
    const [search, setSearch]           = useState("");
    const [query, setQuery]             = useState("");
    const [page, setPage]               = useState(1);
    const [total, setTotal]             = useState(initialTotal);
    // Start as false — we already have server-side articles
    const [loading, setLoading]         = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore]         = useState(initialArticles.length === 20);
    const [catCounts, setCatCounts]     = useState(initialCatCounts);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const observerRef   = useRef(null);
    const sentinelRef   = useRef(null);
    // Skip the very first fetch — we already have server-rendered data
    const skipFirstFetch = useRef(true);

    // If any filter/sort changes, re-enable fetching and reset
    useEffect(() => {
        skipFirstFetch.current = false;
        setArticles([]);
        setPage(1);
        setHasMore(true);
    }, [selectedCat, selectedSource, query, sortBy]);

    const fetchArticles = useCallback(async (pageNum) => {
        // Skip initial mount fetch — server already gave us the first page
        if (skipFirstFetch.current && pageNum === 1) {
            skipFirstFetch.current = false;
            return;
        }

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

    // Infinite scroll
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
        if (sentinelRef.current) observerRef.current.observe(sentinelRef.current);
        return () => observerRef.current?.disconnect();
    }, [hasMore, loadingMore, loading]);

    const handleCategorySelect = (cat) => setSelectedCat(cat);
    const handleSourceSelect   = (src) => setSelectedSource(src);
    const handleSortChange     = (s)   => setSortBy(s);
    const handleSearch         = ()    => setQuery(search);

    return (
        <div style={{ minHeight: "100vh", background: "#07090f", display: "flex", flexDirection: "column" }}>
            <Navbar search={search} setSearch={setSearch} onSearch={handleSearch} />

            <div style={{ display: "flex", flex: 1, position: "relative", alignItems: "stretch" }}>
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

                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
                    <main style={{ maxWidth: "1280px", width: "100%", margin: "0 auto", padding: "36px 24px", boxSizing: "border-box" }}>

                        <HeroCarousel total={total} />

                        <div style={{
                            fontSize: "11px", color: "#2a2a3e",
                            fontFamily: "'Space Mono', monospace",
                            marginBottom: "20px",
                        }}>
                            LIVE — <CountUp target={total} /> articles tracked
                        </div>

                        {loading ? (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
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
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
                                    {articles.map((article, i) => (
                                        <NewsCard key={`${article.id}-${i}`} article={article} index={i % 20} />
                                    ))}
                                </div>

                                <div ref={sentinelRef} style={{ height: "40px", marginTop: "20px" }} />

                                {loadingMore && (
                                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "20px 0" }}>
                                        <span className="live-dot" />
                                        <span style={{ fontSize: "11px", color: "#444c56", fontFamily: "'Space Mono', monospace" }}>
                                            LOADING MORE...
                                        </span>
                                    </div>
                                )}

                                {!hasMore && articles.length > 0 && (
                                    <div style={{ textAlign: "center", padding: "32px 0", color: "#1c2333", fontSize: "11px", fontFamily: "'Space Mono', monospace" }}>
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
