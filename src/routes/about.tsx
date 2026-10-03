import { createFileRoute } from "@tanstack/react-router";
import { Compass, HeartHandshake, Target } from "lucide-react";

import farmerImage from "@/assets/farmer-greenhouse.jpg";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AgriVitro — Smart Agriculture Built for Morocco" },
      {
        name: "description",
        content:
          "AgriVitro is a Moroccan AgTech team building AI-powered smart greenhouses that help farmers save water and energy while increasing yield.",
      },
      { property: "og:title", content: "About AgriVitro" },
      {
        property: "og:description",
        content: "A Moroccan AgTech team building AI-powered smart greenhouses.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            Technology built <span className="text-gradient">with</span> Moroccan farmers
          </>
        }
        description="AgriVitro brings together agronomy, engineering and data science to make advanced greenhouse control practical, affordable and locally relevant."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">Our story</h2>
            <p className="mt-5 text-muted-foreground">
              AgriVitro started from a simple observation: Moroccan greenhouse farmers were being
              asked to do more with less water, less predictable weather and rising energy costs —
              while most of the technology available to them was designed for other climates and
              other budgets.
            </p>
            <p className="mt-4 text-muted-foreground">
              We set out to build a system that fits the reality of the field: robust hardware,
              intelligent software and an interface a grower can act on in seconds. Today AgriVitro
              runs in deployed greenhouses and in an ongoing 60-greenhouse field study across Fez
              and Souss-Massa.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="overflow-hidden rounded-4xl border border-border shadow-card">
              <img
                src={farmerImage}
                alt="AgriVitro team member with a farmer inside a greenhouse"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-muted py-16 lg:py-24">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            {
              icon: Target,
              title: "Mission",
              body: "Make advanced, data-driven greenhouse farming accessible to every Moroccan grower.",
            },
            {
              icon: Compass,
              title: "Vision",
              body: "A generation of resilient farms that produce more food with far fewer resources.",
            },
            {
              icon: HeartHandshake,
              title: "Values",
              body: "Field-first design, honest measurement and long-term partnership with farmers.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <div className="h-full rounded-3xl border border-border bg-card p-8 shadow-soft">
                <span className="gradient-primary flex size-11 items-center justify-center rounded-2xl text-primary-foreground">
                  <item.icon className="size-5" />
                </span>
                <h2 className="mt-5 font-display text-xl font-bold text-ink">{item.title}</h2>
                <p className="mt-2 text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Reveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">How we work</h2>
          <p className="mt-4 text-muted-foreground">
            Every feature we ship is tested in a working greenhouse before it reaches other growers.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              step: "Listen",
              body: "Understand the grower's crop, constraints and current routine.",
            },
            {
              step: "Instrument",
              body: "Install sensors and establish an honest performance baseline.",
            },
            {
              step: "Automate",
              body: "Introduce AI-driven irrigation and climate control gradually.",
            },
            {
              step: "Review",
              body: "Compare results together and adjust for the next crop cycle.",
            },
          ].map((item, index) => (
            <Reveal key={item.step} delay={index * 80}>
              <div className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft">
                <p className="font-display text-3xl font-extrabold text-secondary-foreground/40">
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-ink">{item.step}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection title="Let's build the next smart greenhouse together" />
    </SiteShell>
  );
}
