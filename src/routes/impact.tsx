import { createFileRoute } from "@tanstack/react-router";
import { Droplets, Leaf, Sprout, Zap } from "lucide-react";

import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact — 30% Less Water, 25% Less Energy, 20% More Yield" },
      {
        name: "description",
        content:
          "AgriVitro smart greenhouses deliver 30% water savings, 25% energy savings and 20% higher crop yield across deployments in Morocco.",
      },
      { property: "og:title", content: "Impact — AgriVitro Smart Greenhouses" },
      {
        property: "og:description",
        content:
          "30% less water, 25% less energy and 20% higher crop yield in Moroccan greenhouses.",
      },
      { property: "og:url", content: "/impact" },
    ],
    links: [{ rel: "canonical", href: "/impact" }],
  }),
  component: ImpactPage,
});

const outcomes = [
  {
    icon: Droplets,
    value: 30,
    suffix: "%",
    title: "Less water used",
    description:
      "Irrigation is driven by live soil moisture and forecast conditions instead of fixed schedules.",
  },
  {
    icon: Zap,
    value: 25,
    suffix: "%",
    title: "Less energy consumed",
    description:
      "Ventilation, heating and lighting follow solar availability and actual greenhouse demand.",
  },
  {
    icon: Sprout,
    value: 20,
    suffix: "%",
    title: "Higher crop yield",
    description:
      "Stable climate and earlier stress detection protect plants during Morocco's hottest weeks.",
  },
  {
    icon: Leaf,
    value: 4,
    suffix: "",
    title: "Greenhouses deployed",
    description:
      "Live AgriVitro installations already operating with growers, feeding continuous improvement.",
  },
];

function ImpactPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Impact"
        title={
          <>
            Measurable results for <span className="text-gradient">farmers and for Morocco</span>
          </>
        }
        description="AgriVitro is built around outcomes growers can verify: less water, less energy and more crop from the same greenhouse footprint."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {outcomes.map((outcome, index) => (
            <Reveal key={outcome.title} delay={index * 80}>
              <div className="h-full rounded-3xl border border-border bg-card p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary-dark">
                  <outcome.icon className="size-5" />
                </span>
                <p className="mt-5 font-display text-4xl font-extrabold text-gradient">
                  <Counter value={outcome.value} suffix={outcome.suffix} />
                </p>
                <h2 className="mt-2 font-display text-base font-bold text-ink">{outcome.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{outcome.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-muted py-16 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
              Why water efficiency matters here
            </h2>
            <p className="mt-5 text-muted-foreground">
              Morocco's agricultural regions face recurring drought and increasing competition for
              irrigation water. Every cubic metre saved in a greenhouse is water that stays
              available for the wider farming community.
            </p>
            <p className="mt-4 text-muted-foreground">
              By moving from calendar-based irrigation to condition-based irrigation, AgriVitro
              greenhouses cut consumption by around 30% without asking growers to accept a smaller
              harvest.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="rounded-4xl border border-border bg-card p-8 shadow-card">
              <h3 className="font-display text-lg font-bold text-ink">
                Where the savings come from
              </h3>
              <div className="mt-6 space-y-5">
                {[
                  { label: "Condition-based irrigation", value: 55 },
                  { label: "Forecast-aware scheduling", value: 25 },
                  { label: "Leak and fault detection", value: 20 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink">{row.label}</span>
                      <span className="font-semibold text-primary">{row.value}%</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="gradient-primary h-full rounded-full transition-all duration-700"
                        style={{ width: `${row.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-xs text-muted-foreground">
                Share of observed water savings by contributing factor across AgriVitro deployments.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal>
          <div className="rounded-4xl border border-border bg-card p-8 shadow-card sm:p-12">
            <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
              Sustainability beyond the greenhouse
            </h2>
            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Resource stewardship",
                  body: "Lower water and energy use reduces pressure on shared local resources.",
                },
                {
                  title: "Farmer resilience",
                  body: "Predictable climate control protects income during extreme weather seasons.",
                },
                {
                  title: "Knowledge transfer",
                  body: "Data from every cycle is shared back with growers as practical guidance.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="font-display text-lg font-bold text-primary-dark">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <CTASection title="Want these numbers in your greenhouse?" />
    </SiteShell>
  );
}
