import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { PostCard } from "@/components/content/PostCard";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { Input } from "@/components/ui/input";
import { listPosts } from "@/lib/content.functions";
import { cn } from "@/lib/utils";

const postsQuery = queryOptions({ queryKey: ["posts"], queryFn: () => listPosts() });

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  head: () => ({
    meta: [
      { title: "Blog — Smart Agriculture Insights | AgriVitro" },
      {
        name: "description",
        content:
          "Articles, field updates and agricultural insights from AgriVitro on smart greenhouses, AI, irrigation and sustainable farming in Morocco.",
      },
      { property: "og:title", content: "AgriVitro Blog — Smart Agriculture Insights" },
      {
        property: "og:description",
        content: "Insights on smart greenhouses, AI, water management and Moroccan agriculture.",
      },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { data: posts } = useSuspenseQuery(postsQuery);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts],
  );

  const featured = posts.find((p) => p.featured) ?? posts[0];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return posts.filter((post) => {
      if (category !== "All" && post.category !== category) return false;
      if (!term) return true;
      return (
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.tags.some((tag) => tag.toLowerCase().includes(term))
      );
    });
  }, [posts, category, search]);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Blog"
        title={
          <>
            Insights from the <span className="text-gradient">field</span>
          </>
        }
        description="Agricultural insights, technology deep-dives, field updates and company news from the AgriVitro team."
      />

      {featured ? (
        <section className="mx-auto w-full max-w-7xl px-4 pt-12 sm:px-6 lg:px-8 lg:pt-16">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              Featured article
            </p>
            <div className="mt-4">
              <PostCard post={featured} featured />
            </div>
          </Reveal>
        </section>
      ) : null}

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  category === item
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-primary-dark",
                )}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="relative lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              maxLength={80}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles"
              aria-label="Search articles"
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            No articles match your search yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, index) => (
              <Reveal key={post.id} delay={(index % 3) * 80}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <CTASection title="Want AgriVitro insights applied to your greenhouse?" />
    </SiteShell>
  );
}
