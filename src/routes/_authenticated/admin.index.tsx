import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost, SiteEvent } from "@/lib/content-types";
import { formatDate } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({
    meta: [
      { title: "Content Dashboard — AgriVitro CMS" },
      { name: "description", content: "Manage AgriVitro articles and events." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Content Dashboard — AgriVitro CMS" },
      { property: "og:description", content: "Manage AgriVitro articles and events." },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const queryClient = useQueryClient();

  const posts = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("publication_date", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as BlogPost[];
    },
  });

  const events = useQuery({
    queryKey: ["admin", "events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as SiteEvent[];
    },
  });

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ["admin"] });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: ["latest-content"] });
  };

  const togglePublish = async (table: "blog_posts" | "events", id: string, status: string) => {
    const next = status === "published" ? "draft" : "published";
    const { error } = await supabase.from(table).update({ status: next }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(next === "published" ? "Published" : "Moved to drafts");
    refresh();
  };

  const remove = async (table: "blog_posts" | "events", id: string) => {
    if (!window.confirm("Delete this item permanently?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    refresh();
  };

  const postList = posts.data ?? [];
  const eventList = events.data ?? [];
  const today = new Date().toISOString().slice(0, 10);

  const stats = [
    { label: "Published articles", value: postList.filter((p) => p.status === "published").length },
    { label: "Draft articles", value: postList.filter((p) => p.status !== "published").length },
    { label: "Upcoming events", value: eventList.filter((e) => e.date >= today).length },
    { label: "Past events", value: eventList.filter((e) => e.date < today).length },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-extrabold text-ink">Content dashboard</h1>
        <div className="flex gap-2">
          <Button asChild variant="hero" size="sm">
            <Link to="/admin/posts/$id" params={{ id: "new" }}>
              <Plus className="size-4" /> New article
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link to="/admin/events/$id" params={{ id: "new" }}>
              <Plus className="size-4" /> New event
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <p className="font-display text-3xl font-extrabold text-ink">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <Section title="Articles" icon={FileText}>
        {postList.length === 0 ? (
          <EmptyRow label="No articles yet." />
        ) : (
          postList.map((post) => (
            <Row
              key={post.id}
              title={post.title}
              meta={`${post.category} · ${formatDate(post.publication_date)}${post.is_demo ? " · demo content" : ""}`}
              status={post.status}
              editTo={{ to: "/admin/posts/$id", params: { id: post.id } }}
              onToggle={() => togglePublish("blog_posts", post.id, post.status)}
              onDelete={() => remove("blog_posts", post.id)}
            />
          ))
        )}
      </Section>

      <Section title="Events" icon={CalendarDays}>
        {eventList.length === 0 ? (
          <EmptyRow label="No events yet." />
        ) : (
          eventList.map((event) => (
            <Row
              key={event.id}
              title={event.title}
              meta={`${event.category} · ${formatDate(event.date)} · ${event.city}${event.is_demo ? " · demo content" : ""}`}
              status={event.status}
              editTo={{ to: "/admin/events/$id", params: { id: event.id } }}
              onToggle={() => togglePublish("events", event.id, event.status)}
              onDelete={() => remove("events", event.id)}
            />
          ))
        )}
      </Section>
    </AdminShell>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof FileText;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-ink">
        <Icon className="size-5 text-primary" /> {title}
      </h2>
      <div className="mt-4 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        {children}
      </div>
    </section>
  );
}

function EmptyRow({ label }: { label: string }) {
  return <p className="p-6 text-sm text-muted-foreground">{label}</p>;
}

function Row({
  title,
  meta,
  status,
  editTo,
  onToggle,
  onDelete,
}: {
  title: string;
  meta: string;
  status: string;
  editTo: { to: "/admin/posts/$id" | "/admin/events/$id"; params: { id: string } };
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{meta}</p>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            status === "published"
              ? "bg-secondary text-primary-dark"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {status === "published" ? "Published" : "Draft"}
        </span>
        <Button asChild variant="ghost" size="sm">
          <Link to={editTo.to} params={editTo.params}>
            <Pencil className="size-4" /> Edit
          </Link>
        </Button>
        <Button variant="outline" size="sm" onClick={onToggle}>
          {status === "published" ? "Unpublish" : "Publish"}
        </Button>
        <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Delete">
          <Trash2 className="size-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
