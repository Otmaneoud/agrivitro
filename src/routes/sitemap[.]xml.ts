import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const STATIC_PATHS = [
  "/",
  "/technology",
  "/impact",
  "/field-study",
  "/about",
  "/contact",
  "/blog",
  "/events",
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
        const supabase = createClient(process.env["SUPABASE_URL"]!, key, {
          auth: { persistSession: false },
          global: {
            fetch: (input: RequestInfo | URL, init?: RequestInit) => {
              const headers = new Headers(init?.headers);
              if (key.startsWith("sb_")) headers.delete("Authorization");
              headers.set("apikey", key);
              return fetch(input, { ...init, headers });
            },
          },
        });

        const [posts, events] = await Promise.all([
          supabase.from("blog_posts").select("slug,updated_at").eq("status", "published"),
          supabase.from("events").select("slug,updated_at").eq("status", "published"),
        ]);

        const urls = [
          ...STATIC_PATHS.map((path) => ({
            loc: `${origin}${path}`,
            lastmod: null as string | null,
          })),
          ...(posts.data ?? []).map((row) => ({
            loc: `${origin}/blog/${row.slug}`,
            lastmod: row.updated_at as string,
          })),
          ...(events.data ?? []).map((row) => ({
            loc: `${origin}/events/${row.slug}`,
            lastmod: row.updated_at as string,
          })),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) =>
      `  <url><loc>${url.loc}</loc>${url.lastmod ? `<lastmod>${new Date(url.lastmod).toISOString()}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>`;

        return new Response(body, {
          headers: { "content-type": "application/xml", "cache-control": "public, max-age=3600" },
        });
      },
    },
  },
});
