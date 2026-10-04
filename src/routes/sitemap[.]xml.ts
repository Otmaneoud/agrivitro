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
        const DEFAULT_SUPABASE_URL = "https://ioinvtayrcmkelnyauac.supabase.co";
        const DEFAULT_SUPABASE_KEY = "sb_publishable_KiU40PqyKYGJjGUgKvqLoA_7Jv-V1ye";
        const key =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ??
          process.env["SUPABASE_ANON_KEY"] ??
          process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
          DEFAULT_SUPABASE_KEY;
        const url =
          process.env["SUPABASE_URL"] ??
          process.env["VITE_SUPABASE_URL"] ??
          DEFAULT_SUPABASE_URL;

        const supabase = createClient(url, key, {
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

        let posts: { data: { slug: string; updated_at: string }[] | null } = { data: [] };
        let events: { data: { slug: string; updated_at: string }[] | null } = { data: [] };
        try {
          const res = await Promise.all([
            supabase.from("blog_posts").select("slug,updated_at").eq("status", "published"),
            supabase.from("events").select("slug,updated_at").eq("status", "published"),
          ]);
          posts = res[0] as typeof posts;
          events = res[1] as typeof events;
        } catch (err) {
          console.error("Sitemap failed to fetch dynamic routes:", err);
        }

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
