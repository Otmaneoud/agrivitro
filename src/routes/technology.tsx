import { createFileRoute } from "@tanstack/react-router";
import {
  BrainCircuit,
  Cloud,
  Cpu,
  Database,
  Droplets,
  Smartphone,
  Sun,
  Thermometer,
} from "lucide-react";

import { CTASection } from "@/components/sections/CTASection";
import { DashboardMock } from "@/components/sections/DashboardMock";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/technology")({
  head: () => ({
    meta: [
      { title: "Technology — AgriVitro Smart Greenhouse Platform" },
      {
        name: "description",
        content:
          "How AgriVitro works: IoT sensors, AI models, precision irrigation, solar-aware climate control and a real-time greenhouse dashboard.",
      },
      { property: "og:title", content: "Technology — AgriVitro Smart Greenhouse Platform" },
      {
        property: "og:description",
        content:
          "IoT sensors, AI models and precision irrigation working together inside Moroccan greenhouses.",
      },
      { property: "og:url", content: "/technology" },
    ],
    links: [{ rel: "canonical", href: "/technology" }],
  }),
  component: TechnologyPage,
});

const layers = [
  {
    icon: Thermometer,
    title: "1. Sense",
    description:
      "Low-power sensors continuously measure air temperature, relative humidity, soil moisture, light intensity and CO₂ inside each greenhouse zone.",
  },
  {
    icon: Cloud,
    title: "2. Connect",
    description:
      "Readings travel over resilient wireless links to the AgriVitro cloud, designed to keep working through patchy rural connectivity.",
  },
  {
    icon: BrainCircuit,
    title: "3. Decide",
    description:
      "AI models combine live readings, weather forecasts and crop stage to determine the optimal climate and irrigation response.",
  },
  {
    icon: Droplets,
    title: "4. Act",
    description:
      "Irrigation valves, ventilation and shading respond automatically, while growers keep full manual override at all times.",
  },
];

const capabilities = [
  {
    icon: Cpu,
    title: "Edge-ready controllers",
    description:
      "Greenhouse controllers keep running the last safe plan even if connectivity drops.",
  },
  {
    icon: Sun,
    title: "Solar-aware scheduling",
    description: "Energy-hungry actions are shifted toward daylight hours and cooler periods.",
  },
  {
    icon: Database,
    title: "Crop cycle memory",
    description: "Every season is stored, compared and used to refine the next planting cycle.",
  },
  {
    icon: Smartphone,
    title: "Mobile alerts",
    description:
      "Growers get push notifications for heat spikes, irrigation faults and sensor issues.",
  },
];

function TechnologyPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Technology"
        title={
          <>
            A greenhouse that <span className="text-gradient">senses, thinks and acts</span>
          </>
        }
        description="AgriVitro is a full stack: field sensors, resilient connectivity, AI decisioning and automated climate and irrigation control — designed specifically for Moroccan growing conditions."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {layers.map((layer, index) => (
            <Reveal key={layer.title} delay={index * 80}>
              <div className="relative h-full rounded-3xl border border-border bg-card p-6 shadow-soft">
                <span className="gradient-primary flex size-11 items-center justify-center rounded-2xl text-primary-foreground">
                  <layer.icon className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-lg font-bold text-ink">{layer.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{layer.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-muted py-16 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              The dashboard
            </p>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-4xl">
              Every greenhouse, one clear picture.
            </h2>
            <p className="mt-5 text-muted-foreground">
              The AgriVitro dashboard turns thousands of daily readings into a simple operational
              view: what is happening now, what the system plans to do next and where a grower's
              attention is needed.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink">
              {[
                "Live climate readings per zone with historical trends",
                "Automated irrigation plans that adapt to forecast heat",
                "Anomaly alerts for sensors, valves and climate drift",
                "Season comparisons for yield, water and energy",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={120}>
            <DashboardMock />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
            Built for real field conditions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Dust, heat, intermittent networks and long distances between sites shaped every design
            decision in the platform.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {capabilities.map((capability, index) => (
            <Reveal key={capability.title} delay={index * 80}>
              <div className="flex h-full gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary-dark">
                  <capability.icon className="size-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{capability.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{capability.description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection title="See the platform running on a live greenhouse" />
    </SiteShell>
  );
}
