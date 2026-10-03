import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/site/Reveal";
import { Button } from "@/components/ui/button";

export function CTASection({
  title = "Ready to grow more with less?",
  description = "Book a walkthrough of the AgriVitro platform and see how our smart greenhouses perform in Moroccan conditions.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <Reveal>
        <div className="gradient-primary relative overflow-hidden rounded-4xl px-6 py-14 text-center text-primary-foreground shadow-lift sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-16 -top-16 size-64 rounded-full bg-primary-foreground/10 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -right-10 size-72 rounded-full bg-primary-foreground/10 blur-2xl"
          />
          <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold sm:text-4xl">
            {title}
          </h2>
          <p className="relative mx-auto mt-4 max-w-2xl text-primary-foreground/85">
            {description}
          </p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
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
              <Link to="/field-study">Explore the field study</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
