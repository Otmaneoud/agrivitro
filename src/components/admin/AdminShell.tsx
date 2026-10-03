import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, LogOut, ShieldAlert } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export function useIsAdmin() {
  const [state, setState] = useState<{ loading: boolean; isAdmin: boolean; email: string | null }>({
    loading: true,
    isAdmin: false,
    email: null,
  });

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;
      if (!user) {
        if (active) setState({ loading: false, isAdmin: false, email: null });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (active) setState({ loading: false, isAdmin: Boolean(data), email: user.email ?? null });
    })();
    return () => {
      active = false;
    };
  }, []);

  return state;
}

export function AdminShell({ children, title }: { children: ReactNode; title: string }) {
  const { loading, isAdmin, email } = useIsAdmin();
  const navigate = useNavigate();

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="gradient-primary flex size-8 items-center justify-center rounded-lg text-primary-foreground">
                <Leaf className="size-4" />
              </span>
              <span className="font-display font-extrabold text-ink">AgriVitro CMS</span>
            </Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">/ {title}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">View site</Link>
            </Button>
            {email ? (
              <span className="hidden text-sm text-muted-foreground md:inline">{email}</span>
            ) : null}
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : isAdmin ? (
          children
        ) : (
          <div className="mx-auto max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-soft">
            <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary-dark">
              <ShieldAlert className="size-5" />
            </span>
            <h1 className="mt-5 font-display text-xl font-bold text-ink">Access pending</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your account is signed in but does not have content admin rights yet. Ask an AgriVitro
              administrator to grant you the admin role.
            </p>
            <Button variant="outline" className="mt-6" onClick={signOut}>
              Sign out
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
