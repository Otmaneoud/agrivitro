import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, MapPin, Microscope, Users } from "lucide-react";

import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { Counter } from "@/components/site/Counter";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/field-study")({
  head: () => ({
    meta: [
      { title: "Field Study — 60 Greenhouses in Fez and Souss-Massa" },
      {
        name: "description",
        content:
          "AgriVitro's field study covers 60 greenhouses across Fez and Souss-Massa, validating water, energy and yield performance with real Moroccan growers.",
      },
      { property: "og:title", content: "Field Study — AgriVitro in Fez and Souss-Massa" },
      {
        property: "og:description",
        content: "A 60-greenhouse study with Moroccan growers across two contrasting regions.",
      },
      { property: "og:url", content: "/field-study" },
    ],
    links: [{ rel: "canonical", href: "/field-study" }],
  }),
  component: FieldStudyPage,
});

const phases = [
  {
    icon: ClipboardList,
    title: "Baseline",
    body: "Existing water, energy and yield practices are documented greenhouse by greenhouse.",
  },
  {
    icon: Microscope,
    title: "Instrumentation",
    body: "Sensor kits are installed and calibrated for each crop, structure and irrigation setup.",
  },
  {
    icon: Users,
    title: "Grower collaboration",
    body: "Farmers are trained on the dashboard and stay in control of every automated action.",
  },
  {
    icon: MapPin,
    title: "Comparative analysis",
    body: "Results are compared across regions to separate climate effects from platform effects.",
  },
];

function FieldStudyPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Field Study"
        title={
          <>
            <span className="text-gradient">60 greenhouses</span> across two Moroccan regions
          </>
        }
        description="Our field study runs with growers in Fez and Souss-Massa — two very different climates — to validate how AgriVitro performs outside laboratory conditions."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { value: 60, suffix: "", label: "Greenhouses in the study" },
            { value: 2, suffix: "", label: "Regions: Fez & Souss-Massa" },
            { value: 4, suffix: "", label: "Greenhouses already deployed" },
          ].map((stat, index) => (
            <Reveal key={stat.label} delay={index * 80}>
              <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
                <p className="font-display text-5xl font-extrabold text-gradient">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-muted py-16 lg:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-2xl">
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">How the study runs</h2>
            <p className="mt-4 text-muted-foreground">
              Each participating greenhouse follows the same four-phase protocol so results stay
              comparable between sites.
            </p>
          </Reveal>
          <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {phases.map((phase, index) => (
              <Reveal key={phase.title} delay={index * 80}>
                <li className="h-full list-none rounded-3xl border border-border bg-card p-6 shadow-soft">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary-dark">
                    <phase.icon className="size-5" />
                  </span>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-primary">
                    Phase {index + 1}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold text-ink">{phase.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{phase.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-2">
          {[
            {
              region: "Fez",
              body: "Continental conditions with cold nights and hot, dry summers. The study focuses on how automated climate control stabilises day-night swings and protects yield.",
            },
            {
              region: "Souss-Massa",
              body: "A coastal, intensively farmed region where water availability is the binding constraint. Here the priority is measuring irrigation savings without yield loss.",
            },
          ].map((item, index) => (
            <Reveal key={item.region} delay={index * 100}>
              <div className="h-full rounded-4xl border border-border bg-card p-8 shadow-card">
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary-dark">
                  <MapPin className="size-3.5" /> {item.region}
                </span>
                <p className="mt-5 text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection
        title="Interested in joining the study?"
        description="We work with growers, cooperatives and research partners across Morocco."
      />
    </SiteShell>
  );
}
