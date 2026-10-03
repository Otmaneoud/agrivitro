import { Link } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";

import type { SiteEvent } from "@/lib/content-types";
import { formatDate } from "@/lib/site";

export function EventStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    upcoming: { label: "Upcoming", className: "bg-secondary text-primary-dark" },
    happening_soon: {
      label: "Happening Soon",
      className: "gradient-primary text-primary-foreground",
    },
    completed: { label: "Completed", className: "bg-muted text-muted-foreground" },
  };
  const entry = map[status] ?? map["upcoming"]!;
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${entry.className}`}>
      {entry.label}
    </span>
  );
}

export function EventCard({ event }: { event: SiteEvent }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link
        to="/events/$slug"
        params={{ slug: event.slug }}
        className="block overflow-hidden bg-muted"
      >
        <img
          src={event.cover_image ?? "/images/content/event-forum.jpg"}
          alt={event.title}
          loading="lazy"
          className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <EventStatusBadge status={event.event_status} />
          <span className="text-xs text-muted-foreground">{event.category}</span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold leading-snug text-ink">
          <Link to="/events/$slug" params={{ slug: event.slug }} className="hover:text-primary">
            {event.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
        <div className="mt-5 space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4 text-primary" />
            {formatDate(event.date)}
            {event.start_time ? ` · ${event.start_time}` : ""}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            {[event.location, event.city].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>
    </article>
  );
}
