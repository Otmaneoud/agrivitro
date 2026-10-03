import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { EventCard } from "@/components/content/EventCard";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { Input } from "@/components/ui/input";
import { listEvents } from "@/lib/content.functions";
import { cn } from "@/lib/utils";

const eventsQuery = queryOptions({ queryKey: ["events"], queryFn: () => listEvents() });

const FILTERS = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "happening_soon", label: "Happening Soon" },
  { value: "completed", label: "Past events" },
] as const;

export const Route = createFileRoute("/events/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(eventsQuery),
  head: () => ({
    meta: [
      { title: "Events — AgriVitro Workshops, Field Days and Talks" },
      {
        name: "description",
        content:
          "Upcoming and past AgriVitro events: greenhouse field days, farmer workshops, AgTech forums and demonstrations across Morocco.",
      },
      { property: "og:title", content: "AgriVitro Events" },
      {
        property: "og:description",
        content: "Field days, workshops and AgTech forums with the AgriVitro team in Morocco.",
      },
      { property: "og:url", content: "/events" },
    ],
    links: [{ rel: "canonical", href: "/events" }],
  }),
  component: EventsIndex,
});

function EventsIndex() {
  const { data: events } = useSuspenseQuery(eventsQuery);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((event) => {
      if (filter !== "all" && event.event_status !== filter) return false;
      if (!term) return true;
      return (
        event.title.toLowerCase().includes(term) ||
        event.description.toLowerCase().includes(term) ||
        event.city.toLowerCase().includes(term) ||
        event.location.toLowerCase().includes(term)
      );
    });
  }, [events, filter, search]);

  return (
    <SiteShell>
      <PageHero
        eyebrow="Events"
        title={
          <>
            Meet AgriVitro <span className="text-gradient">in the field</span>
          </>
        }
        description="Field days, grower workshops, demonstrations and AgTech forums across Morocco — come see the smart greenhouse platform in action."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  filter === item.value
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:text-primary-dark",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="relative lg:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              maxLength={80}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events"
              aria-label="Search events"
              className="pl-9"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-muted-foreground">
            No events match this filter yet.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event, index) => (
              <Reveal key={event.id} delay={(index % 3) * 80}>
                <EventCard event={event} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      <CTASection
        title="Can't make it to an event?"
        description="Book a private walkthrough of the AgriVitro platform instead."
      />
    </SiteShell>
  );
}
