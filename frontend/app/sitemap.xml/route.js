const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
const SITE_URL = "https://nexus-ai.vercel.app"; // Update to your real domain

export async function GET() {
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${SITE_URL}/</loc>
        <changefreq>hourly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${SITE_URL}/brief</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${SITE_URL}/sources</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
    </url>
</urlset>`;

    return new Response(sitemap, {
        headers: { "Content-Type": "application/xml" },
    });
}
