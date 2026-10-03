import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { EVENT_COLUMNS, POST_COLUMNS, type BlogPost, type SiteEvent } from "./content-types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
  const url = process.env["SUPABASE_URL"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input: RequestInfo | URL, init?: RequestInit) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("blog_posts")
    .select(POST_COLUMNS)
    .eq("status", "published")
    .order("publication_date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as BlogPost[];
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: post, error } = await supabase
      .from("blog_posts")
      .select(POST_COLUMNS)
      .eq("status", "published")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!post) return { post: null, related: [] as BlogPost[] };

    const typed = post as unknown as BlogPost;
    const { data: related } = await supabase
      .from("blog_posts")
      .select(POST_COLUMNS)
      .eq("status", "published")
      .neq("id", typed.id)
      .order("publication_date", { ascending: false })
      .limit(6);

    const pool = ((related ?? []) as unknown as BlogPost[]).sort((a, b) =>
      a.category === typed.category ? -1 : b.category === typed.category ? 1 : 0,
    );
    return { post: typed, related: pool.slice(0, 3) };
  });

export const listEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("events")
    .select(EVENT_COLUMNS)
    .eq("status", "published")
    .order("date", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as SiteEvent[];
});

export const getEvent = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    const { data: event, error } = await publicClient()
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("status", "published")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { event: (event as unknown as SiteEvent) ?? null };
  });

export const getLatestContent = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const [posts, events] = await Promise.all([
    supabase
      .from("blog_posts")
      .select(POST_COLUMNS)
      .eq("status", "published")
      .order("publication_date", { ascending: false })
      .limit(3),
    supabase
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("status", "published")
      .neq("event_status", "completed")
      .order("date", { ascending: true })
      .limit(3),
  ]);
  return {
    posts: (posts.data ?? []) as unknown as BlogPost[],
    events: (events.data ?? []) as unknown as SiteEvent[],
  };
});

const demoRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional().or(z.literal("")),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  region: z.string().trim().max(120).optional().or(z.literal("")),
  greenhouses: z.string().trim().max(50).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const submitDemoRequest = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => demoRequestSchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await publicClient()
      .from("demo_requests")
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        organization: data.organization || null,
        region: data.region || null,
        greenhouses: data.greenhouses || null,
        message: data.message || null,
      });
    if (error) throw new Error("We could not send your request. Please try again.");
    return { ok: true };
  });
