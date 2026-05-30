export function GET() {
    const robots = `User-agent: *
Allow: /
Disallow: /admin

Sitemap: https://nexus-ai.vercel.app/sitemap.xml
`;
    return new Response(robots, {
        headers: { "Content-Type": "text/plain" },
    });
}
