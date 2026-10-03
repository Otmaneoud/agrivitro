import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { PageHero } from "@/components/sections/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SiteShell } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitDemoRequest } from "@/lib/content.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AgriVitro — Request a Smart Greenhouse Demo" },
      {
        name: "description",
        content:
          "Talk to the AgriVitro team about smart greenhouses in Morocco. Request a demo and see the platform running on a live site.",
      },
      { property: "og:title", content: "Contact AgriVitro" },
      {
        property: "og:description",
        content: "Request a demo of AgriVitro's AI-powered smart greenhouse platform.",
      },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email address").max(200),
  phone: z.string().trim().max(50),
  organization: z.string().trim().max(160),
  region: z.string().trim().max(120),
  greenhouses: z.string().trim().max(50),
  message: z.string().trim().max(2000),
});

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  region: "",
  greenhouses: "",
  message: "",
};

function ContactPage() {
  const send = useServerFn(submitDemoRequest);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);

  const update = (key: keyof typeof emptyForm) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      return;
    }
    setErrors({});
    setPending(true);
    try {
      await send({ data: parsed.data });
      toast.success("Thank you — we'll be in touch shortly.");
      setForm(emptyForm);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <SiteShell>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Request a <span className="text-gradient">demo</span>
          </>
        }
        description="Tell us about your greenhouses and we'll show you exactly how AgriVitro would work on your site."
      />

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <div className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <h2 className="font-display text-lg font-bold text-ink">Talk to our team</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  We work with individual growers, cooperatives, agri-businesses and research
                  partners across Morocco.
                </p>
                <ul className="mt-6 space-y-3 text-sm text-ink">
                  <li className="flex items-center gap-3">
                    <MapPin className="size-4 text-primary" /> Fez & Souss-Massa, Morocco
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail className="size-4 text-primary" /> contact@agrivitro.ma
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone className="size-4 text-primary" /> Available on request
                  </li>
                </ul>
                <p className="mt-4 text-xs text-muted-foreground">
                  Contact details are placeholders and can be updated at any time.
                </p>
              </div>
              <div className="gradient-primary rounded-3xl p-6 text-primary-foreground shadow-card">
                <h2 className="font-display text-lg font-bold">What happens next?</h2>
                <ol className="mt-4 space-y-3 text-sm text-primary-foreground/85">
                  <li>1. We review your greenhouse setup and goals.</li>
                  <li>2. We schedule a live dashboard walkthrough.</li>
                  <li>3. We propose a deployment or field-study fit.</li>
                </ol>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <form
              onSubmit={onSubmit}
              className="rounded-4xl border border-border bg-card p-6 shadow-card sm:p-8"
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name" id="name" error={errors["name"]}>
                  <Input
                    id="name"
                    value={form.name}
                    maxLength={120}
                    onChange={(e) => update("name")(e.target.value)}
                    placeholder="Youssef El Amrani"
                  />
                </Field>
                <Field label="Email" id="email" error={errors["email"]}>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    maxLength={200}
                    onChange={(e) => update("email")(e.target.value)}
                    placeholder="you@farm.ma"
                  />
                </Field>
                <Field label="Phone (optional)" id="phone" error={errors["phone"]}>
                  <Input
                    id="phone"
                    value={form.phone}
                    maxLength={50}
                    onChange={(e) => update("phone")(e.target.value)}
                  />
                </Field>
                <Field
                  label="Organization (optional)"
                  id="organization"
                  error={errors["organization"]}
                >
                  <Input
                    id="organization"
                    value={form.organization}
                    maxLength={160}
                    onChange={(e) => update("organization")(e.target.value)}
                  />
                </Field>
                <Field label="Region (optional)" id="region" error={errors["region"]}>
                  <Input
                    id="region"
                    value={form.region}
                    maxLength={120}
                    onChange={(e) => update("region")(e.target.value)}
                    placeholder="Souss-Massa"
                  />
                </Field>
                <Field
                  label="Number of greenhouses (optional)"
                  id="greenhouses"
                  error={errors["greenhouses"]}
                >
                  <Input
                    id="greenhouses"
                    value={form.greenhouses}
                    maxLength={50}
                    onChange={(e) => update("greenhouses")(e.target.value)}
                    placeholder="4"
                  />
                </Field>
              </div>
              <div className="mt-5">
                <Field label="How can we help? (optional)" id="message" error={errors["message"]}>
                  <Textarea
                    id="message"
                    rows={5}
                    maxLength={2000}
                    value={form.message}
                    onChange={(e) => update("message")(e.target.value)}
                    placeholder="Tell us about your crops, current irrigation setup and goals."
                  />
                </Field>
              </div>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="mt-6 w-full"
                disabled={pending}
              >
                {pending ? "Sending…" : "Request a Demo"} <Send className="size-4" />
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string;
  id: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
