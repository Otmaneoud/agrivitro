import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { EVENT_COLUMNS, POST_COLUMNS, type BlogPost, type SiteEvent } from "./content-types";

const DEFAULT_SUPABASE_URL = "https://ioinvtayrcmkelnyauac.supabase.co";
const DEFAULT_SUPABASE_KEY = "sb_publishable_KiU40PqyKYGJjGUgKvqLoA_7Jv-V1ye";

function publicClient() {
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ??
    process.env["SUPABASE_ANON_KEY"] ??
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
    DEFAULT_SUPABASE_KEY;
  const url =
    process.env["SUPABASE_URL"] ??
    process.env["VITE_SUPABASE_URL"] ??
    DEFAULT_SUPABASE_URL;

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
  try {
    const { data, error } = await publicClient()
      .from("blog_posts")
      .select(POST_COLUMNS)
      .eq("status", "published")
      .order("publication_date", { ascending: false });
    if (error) {
      console.error("Error fetching posts:", error.message);
      return [] as BlogPost[];
    }
    return (data ?? []) as unknown as BlogPost[];
  } catch (err) {
    console.error("Failed to list posts:", err);
    return [] as BlogPost[];
  }
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    try {
      const supabase = publicClient();
      const { data: post, error } = await supabase
        .from("blog_posts")
        .select(POST_COLUMNS)
        .eq("status", "published")
        .eq("slug", data.slug)
        .maybeSingle();
      if (error) {
        console.error("Error fetching post:", error.message);
        return { post: null, related: [] as BlogPost[] };
      }
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
    } catch (err) {
      console.error("Failed to get post:", err);
      return { post: null, related: [] as BlogPost[] };
    }
  });

export const listEvents = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const { data, error } = await publicClient()
      .from("events")
      .select(EVENT_COLUMNS)
      .eq("status", "published")
      .order("date", { ascending: false });
    if (error) {
      console.error("Error fetching events:", error.message);
      return [] as SiteEvent[];
    }
    return (data ?? []) as unknown as SiteEvent[];
  } catch (err) {
    console.error("Failed to list events:", err);
    return [] as SiteEvent[];
  }
});

export const getEvent = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }) => {
    try {
      const { data: event, error } = await publicClient()
        .from("events")
        .select(EVENT_COLUMNS)
        .eq("status", "published")
        .eq("slug", data.slug)
        .maybeSingle();
      if (error) {
        console.error("Error fetching event:", error.message);
        return { event: null };
      }
      return { event: (event as unknown as SiteEvent) ?? null };
    } catch (err) {
      console.error("Failed to get event:", err);
      return { event: null };
    }
  });

export const getLatestContent = createServerFn({ method: "GET" }).handler(async () => {
  try {
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
  } catch (err) {
    console.error("Failed to load latest content:", err);
    return {
      posts: [] as BlogPost[],
      events: [] as SiteEvent[],
    };
  }
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
    try {
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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "We could not send your request. Please try again.";
      throw new Error(msg);
    }
  });
