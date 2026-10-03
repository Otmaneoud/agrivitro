import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CalendarPlus, Clock, MapPin, Users } from "lucide-react";

import { EventStatusBadge } from "@/components/content/EventCard";
import { CTASection } from "@/components/sections/CTASection";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { getEvent } from "@/lib/content.functions";
import type { SiteEvent } from "@/lib/content-types";
import { formatDate, sanitizeHtml } from "@/lib/site";

const eventQuery = (slug: string) =>
  queryOptions({
    queryKey: ["event", slug],
    queryFn: async () => {
      const result = await getEvent({ data: { slug } });
      if (!result.event) throw notFound();
      return result;
    },
  });

export const Route = createFileRoute("/events/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(eventQuery(params.slug)),
  head: ({ params, loaderData }) => {
    if (!loaderData?.event) {
      return {
        meta: [{ title: "Event unavailable — AgriVitro" }, { name: "robots", content: "noindex" }],
      };
    }
    const event = loaderData.event;
    const title = event.seo_title || `${event.title} — AgriVitro Events`;
    const description = event.seo_description || event.description;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/events/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/events/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            name: event.title,
            description,
            startDate: event.date,
            eventStatus: "https://schema.org/EventScheduled",
            location: {
              "@type": "Place",
              name: event.location,
              address: [event.city, event.country].filter(Boolean).join(", "),
            },
            organizer: { "@type": "Organization", name: "AgriVitro" },
          }),
        },
      ],
    };
  },
  component: EventDetailPage,
  notFoundComponent: EventNotFound,
});

function EventNotFound() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-3xl px-4 py-32 text-center">
        <h1 className="text-3xl font-extrabold text-ink">Event not found</h1>
        <p className="mt-3 text-muted-foreground">This event may have been moved or unpublished.</p>
        <Button asChild variant="hero" className="mt-8">
          <Link to="/events">Back to events</Link>
        </Button>
      </div>
    </SiteShell>
  );
}

function buildIcs(event: SiteEvent) {
  const day = event.date.replace(/-/g, "");
  const stamp = (time: string | null, fallback: string) =>
    `${day}T${(time ?? fallback).replace(":", "").padEnd(6, "0")}`;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AgriVitro//Events//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@agrivitro`,
    `DTSTART:${stamp(event.start_time, "09:00")}`,
    `DTEND:${stamp(event.end_time, "17:00")}`,
    `SUMMARY:${event.title}`,
    `LOCATION:${[event.location, event.city, event.country].filter(Boolean).join(", ")}`,
    `DESCRIPTION:${event.description.replace(/\n/g, " ")}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}

function EventDetailPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(eventQuery(slug));
  const event = data.event!;

  const downloadIcs = () => {
    const blob = new Blob([buildIcs(event)], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${event.slug}.ics`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <SiteShell>
      <header className="gradient-soft border-b border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            <ArrowLeft className="size-4" /> All events
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <EventStatusBadge status={event.event_status} />
            <span className="text-xs text-muted-foreground">{event.category}</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{event.description}</p>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8 lg:py-16">
        <div>
          {event.cover_image ? (
            <img
              src={event.cover_image}
              alt={event.title}
              className="mb-10 h-72 w-full rounded-4xl border border-border object-cover shadow-card sm:h-96"
            />
          ) : null}
          <div
            className="prose-article"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(event.content) }}
          />

          {event.speakers.length > 0 ? (
            <section className="mt-12">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
                <Users className="size-5 text-primary" /> Speakers
              </h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {event.speakers.map((speaker) => (
                  <div key={speaker.name} className="rounded-2xl border border-border bg-card p-4">
                    <p className="font-display font-bold text-ink">{speaker.name}</p>
                    {speaker.role ? (
                      <p className="text-sm text-muted-foreground">{speaker.role}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {event.gallery.length > 0 ? (
            <section className="mt-12">
              <h2 className="font-display text-xl font-bold text-ink">Gallery</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {event.gallery.map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt={`${event.title} photo`}
                    loading="lazy"
                    className="h-56 w-full rounded-2xl border border-border object-cover"
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-ink">Event details</h2>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-ink">
                  {formatDate(event.date)}
                  {event.start_time ? (
                    <span className="block text-muted-foreground">
                      {event.start_time}
                      {event.end_time ? ` – ${event.end_time}` : ""}
                    </span>
                  ) : null}
                </span>
              </li>
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span className="text-ink">
                  {event.location}
                  <span className="block text-muted-foreground">
                    {[event.city, event.country].filter(Boolean).join(", ")}
                  </span>
                </span>
              </li>
            </ul>

            <div className="mt-6 space-y-3">
              {event.registration_url && event.event_status !== "completed" ? (
                <Button asChild variant="hero" className="w-full">
                  <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
                    Register now
                  </a>
                </Button>
              ) : null}
              <Button variant="outline" className="w-full" onClick={downloadIcs}>
                <CalendarPlus className="size-4" /> Add to calendar
              </Button>
            </div>
          </div>
        </aside>
      </div>

      <CTASection />
    </SiteShell>
  );
}
