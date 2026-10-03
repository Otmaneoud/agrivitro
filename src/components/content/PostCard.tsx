import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

import type { BlogPost } from "@/lib/content-types";
import { formatDate } from "@/lib/site";

export function PostCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift ${
        featured ? "lg:flex-row" : ""
      }`}
    >
      <Link
        to="/blog/$slug"
        params={{ slug: post.slug }}
        className={`block overflow-hidden bg-muted ${featured ? "lg:w-1/2" : ""}`}
      >
        <img
          src={post.cover_image ?? "/images/content/greenhouse.jpg"}
          alt={post.title}
          loading="lazy"
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            featured ? "h-64 lg:h-full" : "h-48"
          }`}
        />
      </Link>
      <div
        className={`flex flex-1 flex-col p-5 sm:p-6 ${featured ? "lg:justify-center lg:p-10" : ""}`}
      >
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-secondary px-3 py-1 font-semibold text-primary-dark">
            {post.category}
          </span>
          <span className="text-muted-foreground">{formatDate(post.publication_date)}</span>
        </div>
        <h3
          className={`mt-3 font-display font-bold leading-snug text-ink ${
            featured ? "text-2xl sm:text-3xl" : "text-lg"
          }`}
        >
          <Link to="/blog/$slug" params={{ slug: post.slug }} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{post.excerpt}</p>
        <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span>{post.author}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" /> {post.reading_time} min read
          </span>
        </div>
      </div>
    </article>
  );
}
