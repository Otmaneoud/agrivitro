import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  CalendarDays,
  Droplets,
  Gauge,
  LineChart,
  Radio,
  Sprout,
  Sun,
} from "lucide-react";

import heroImage from "@/assets/hero-greenhouse.jpg";
import farmerImage from "@/assets/farmer-greenhouse.jpg";
import { EventCard } from "@/components/content/EventCard";
import { PostCard } from "@/components/content/PostCard";
import { CTASection } from "@/components/sections/CTASection";
import { DashboardMock } from "@/components/sections/DashboardMock";
import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { getLatestContent } from "@/lib/content.functions";
import { IMPACT_FIGURES } from "@/lib/site";

const latestQuery = queryOptions({
  queryKey: ["latest-content"],
  queryFn: () => getLatestContent(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(latestQuery),
  head: () => ({
    meta: [
      { title: "AgriVitro — Smart Greenhouses. Smarter Agriculture." },
      {
        name: "description",
        content:
          "AI-powered smart greenhouses for Moroccan farmers. Save 30% water, 25% energy and grow 20% more with real-time climate intelligence.",
      },
      { property: "og:title", content: "AgriVitro — Smart Greenhouses. Smarter Agriculture." },
      {
        property: "og:description",
        content:
          "AI-powered smart greenhouses for Moroccan farmers. Save 30% water, 25% energy and grow 20% more.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

const pillars = [
  {
    icon: Radio,
    title: "IoT sensor network",
    description:
      "Temperature, humidity, soil moisture, light and CO₂ sensors stream greenhouse conditions continuously.",
  },
  {
    icon: BrainCircuit,
    title: "AI decision engine",
    description:
      "Models learn each greenhouse and crop cycle, then recommend the right action at the right moment.",
  },
  {
    icon: Droplets,
    title: "Precision irrigation",
    description:
      "Water is delivered only where and when the crop needs it, protecting scarce Moroccan water resources.",
  },
  {
    icon: Sun,
    title: "Solar-aware energy use",
    description:
      "Ventilation, heating and lighting follow the sun and forecast to keep energy consumption low.",
  },
  {
    icon: Gauge,
    title: "Real-time dashboard",
    description:
      "One screen for every greenhouse, with alerts that reach growers on mobile before problems escalate.",
  },
  {
    icon: LineChart,
    title: "Yield analytics",
    description:
      "Season-over-season analysis turns each harvest into measurable, repeatable agronomic knowledge.",
  },
];

function HomePage() {
  const { data } = useSuspenseQuery(latestQuery);

  return (
    <SiteShell>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Modern greenhouse in Morocco at sunrise"
          className="absolute inset-0 size-full object-cover"
        />
        <div aria-hidden className="gradient-hero absolute inset-0" />
        <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-28">
          <div>
            <p className="inline-flex rounded-full border border-primary-foreground/25 bg-primary-foreground/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground backdrop-blur">
              AI-powered agriculture · Morocco
            </p>
            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.05] text-primary-foreground sm:text-5xl lg:text-6xl">
              Smart Greenhouses. <br />
              Smarter Agriculture.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-primary-foreground/85">
              AgriVitro combines IoT sensors, artificial intelligence and precision irrigation so
              Moroccan farmers grow more while using dramatically less water and energy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="onDark" size="lg">
                <Link to="/contact">
                  Request a Demo <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                <Link to="/technology">See the technology</Link>
              </Button>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6">
              {IMPACT_FIGURES.slice(0, 3).map((figure) => (
                <div key={figure.label}>
                  <dt className="sr-only">{figure.label}</dt>
                  <dd className="font-display text-3xl font-extrabold text-primary-foreground sm:text-4xl">
                    <Counter value={figure.value} suffix={figure.suffix} />
                  </dd>
                  <p className="mt-1 text-xs text-primary-foreground/75">{figure.label}</p>
                </div>
              ))}
            </dl>
          </div>
          <Reveal delay={150}>
            <DashboardMock />
          </Reveal>
        </div>
      </section>

      {/* Problem */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              The challenge
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              Moroccan farming is under pressure from water scarcity and rising costs.
            </h2>
            <p className="mt-5 text-muted-foreground">
              Drought years, unpredictable heat waves and expensive energy make traditional
              greenhouse management increasingly difficult. Decisions are still often based on
              routine and intuition rather than live field data.
            </p>
            <ul className="mt-6 space-y-4">
              {[
                "Irrigation schedules that do not adapt to real soil and weather conditions",
                "Energy spent heating, cooling or lighting at the wrong time of day",
                "Crop stress detected too late, after yield has already been lost",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-ink">
                  <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary-dark">
                    <Sprout className="size-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-4xl border border-border shadow-card">
              <img
                src={farmerImage}
                alt="Moroccan farmer working inside a modern greenhouse"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Solution pillars */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              The AgriVitro system
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              Sensing, intelligence and action in one connected greenhouse platform.
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 70}>
                <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary-dark">
                    <pillar.icon className="size-5" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-ink">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Impact band */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <div className="rounded-4xl border border-border bg-card p-8 shadow-card sm:p-12">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {IMPACT_FIGURES.map((figure) => (
                <div key={figure.label} className="text-center">
                  <p className="font-display text-4xl font-extrabold text-gradient sm:text-5xl">
                    <Counter value={figure.value} suffix={figure.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{figure.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Figures observed across AgriVitro deployments and the ongoing 60-greenhouse field
              study in Fez and Souss-Massa.
            </p>
            <div className="mt-6 flex justify-center">
              <Button asChild variant="outline">
                <Link to="/impact">
                  See the full impact <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Latest content */}
      <section className="bg-muted py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Latest from AgriVitro
              </p>
              <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
                Insights, field updates and events
              </h2>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline" size="sm">
                <Link to="/blog">All articles</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/events">All events</Link>
              </Button>
            </div>
          </Reveal>

          {data?.posts && data.posts.length > 0 ? (
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {data.posts.map((post, index) => (
                <Reveal key={post.id} delay={index * 80}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          ) : null}

          {data?.events && data.events.length > 0 ? (
            <div className="mt-12">
              <h3 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
                <CalendarDays className="size-5 text-primary" /> Upcoming events
              </h3>
              <div className="mt-6 grid gap-6 lg:grid-cols-3">
                {data.events.map((event, index) => (
                  <Reveal key={event.id} delay={index * 80}>
                    <EventCard event={event} />
                  </Reveal>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <CTASection />
    </SiteShell>
  );
}
