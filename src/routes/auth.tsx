import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Team Sign In — AgriVitro" },
      {
        name: "description",
        content: "Sign in to the AgriVitro content workspace to publish articles and events.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Team Sign In — AgriVitro" },
      { property: "og:description", content: "AgriVitro content workspace sign in." },
      { property: "og:url", content: "/auth" },
    ],
    links: [{ rel: "canonical", href: "/auth" }],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email("Enter a valid email").max(200),
  password: z.string().min(6, "Password must be at least 6 characters").max(200),
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Invalid details");
      return;
    }
    setPending(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setPending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    navigate({ to: "/admin" });
  }

  return (
    <div className="gradient-soft flex min-h-screen items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-4xl border border-border bg-card p-8 shadow-card">
        <div className="flex items-center gap-2">
          <span className="gradient-primary flex size-9 items-center justify-center rounded-xl text-primary-foreground">
            <Leaf className="size-5" />
          </span>
          <span className="font-display text-lg font-extrabold text-ink">AgriVitro</span>
        </div>
        <h1 className="mt-6 text-2xl font-extrabold text-ink">Content workspace</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Access is invite-only. Sign in with the account provided by your AgriVitro administrator.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              maxLength={200}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              maxLength={200}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2"
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" variant="hero" className="w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
