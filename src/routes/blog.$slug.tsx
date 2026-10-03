import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, Link2, Linkedin, Twitter } from "lucide-react";
import { toast } from "sonner";

import { PostCard } from "@/components/content/PostCard";
import { CTASection } from "@/components/sections/CTASection";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { getPost } from "@/lib/content.functions";
import { formatDate, sanitizeHtml } from "@/lib/site";

const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["post", slug],
    queryFn: async () => {
      const result = await getPost({ data: { slug } });
      if (!result.post) throw notFound();
      return result;
    },
  });

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(postQuery(params.slug)),
  head: ({ params, loaderData }) => {
    if (!loaderData?.post) {
      return {
        meta: [
          { title: "Article unavailable — AgriVitro" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const post = loaderData.post;
    const title = post.seo_title || `${post.title} — AgriVitro`;
    const description = post.seo_description || post.excerpt;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description,
            datePublished: post.publication_date,
            dateModified: post.updated_at,
            author: { "@type": "Organization", name: post.author },
            publisher: { "@type": "Organization", name: "AgriVitro" },
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
  notFoundComponent: PostNotFound,
});

function PostNotFound() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="text-3xl font-extrabold text-ink">Article not found</h1>
        <p className="mt-3 text-muted-foreground">
          This article may have been moved or is not published yet.
        </p>
        <Button asChild variant="hero" className="mt-8">
          <Link to="/blog">Back to the blog</Link>
        </Button>
      </div>
    </SiteShell>
  );
}

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(postQuery(slug));
  const post = data.post!;

  const share = (network: "x" | "linkedin") => {
    const url = window.location.href;
    const target =
      network === "x"
        ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(target, "_blank", "noopener,noreferrer");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <SiteShell>
      <article>
        <header className="gradient-soft border-b border-border">
          <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6 lg:py-20">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="size-4" /> All articles
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-primary-dark">
                {post.category}
              </span>
              <span className="text-muted-foreground">{formatDate(post.publication_date)}</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock className="size-3.5" /> {post.reading_time} min read
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
            <p className="mt-6 text-sm font-medium text-ink">By {post.author}</p>
          </div>
        </header>

        {post.cover_image ? (
          <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
            <img
              src={post.cover_image}
              alt={post.title}
              className="-mt-8 w-full rounded-4xl border border-border object-cover shadow-card sm:h-[420px]"
            />
          </div>
        ) : null}

        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />

          {post.tags.length > 0 ? (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-border pt-8">
            <span className="text-sm font-medium text-ink">Share:</span>
            <Button variant="outline" size="sm" onClick={() => share("x")}>
              <Twitter className="size-4" /> X
            </Button>
            <Button variant="outline" size="sm" onClick={() => share("linkedin")}>
              <Linkedin className="size-4" /> LinkedIn
            </Button>
            <Button variant="outline" size="sm" onClick={copyLink}>
              <Link2 className="size-4" /> Copy link
            </Button>
          </div>
        </div>
      </article>

      {data.related.length > 0 ? (
        <section className="bg-muted py-16">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-extrabold text-ink">Related articles</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.related.map((related, index) => (
                <Reveal key={related.id} delay={index * 80}>
                  <PostCard post={related} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CTASection />
    </SiteShell>
  );
}
