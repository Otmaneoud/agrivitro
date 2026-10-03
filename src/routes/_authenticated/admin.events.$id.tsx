import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUpload, uploadContentImage } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { SiteEvent } from "@/lib/content-types";
import { EVENT_STATUSES, slugify } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin/events/$id")({
  head: () => ({
    meta: [
      { title: "Event editor — AgriVitro CMS" },
      { name: "description", content: "Create and edit AgriVitro events." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Event editor — AgriVitro CMS" },
      { property: "og:description", content: "Create and edit AgriVitro events." },
    ],
  }),
  component: EventEditor,
});

const schema = z.object({
  title: z.string().trim().min(3, "Title is required").max(180),
  slug: z.string().trim().min(3, "Slug is required").max(120),
  description: z.string().trim().max(600),
  category: z.string().trim().min(1).max(80),
  date: z.string().min(8, "Date is required"),
  location: z.string().trim().max(180),
  city: z.string().trim().max(120),
  country: z.string().trim().max(120),
  registration_url: z
    .string()
    .trim()
    .url("Registration URL must be a valid link")
    .max(500)
    .or(z.literal("")),
});

const blank = {
  title: "",
  slug: "",
  description: "",
  content: "",
  cover_image: null as string | null,
  category: "Field Activity",
  date: new Date().toISOString().slice(0, 10),
  start_time: "",
  end_time: "",
  location: "",
  city: "",
  country: "Morocco",
  event_status: "upcoming",
  status: "draft",
  registration_url: "",
  speakers: [] as { name: string; role?: string }[],
  gallery: [] as string[],
  seo_title: "",
  seo_description: "",
};

function EventEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(blank);
  const [slugTouched, setSlugTouched] = useState(false);
  const [speakerText, setSpeakerText] = useState("");
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "event", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").eq("id", id).maybeSingle();
      if (error) throw new Error(error.message);
      return (data as unknown as SiteEvent) ?? null;
    },
  });

  useEffect(() => {
    if (!data) return;
    setSlugTouched(true);
    setForm({
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      cover_image: data.cover_image,
      category: data.category,
      date: data.date,
      start_time: data.start_time ?? "",
      end_time: data.end_time ?? "",
      location: data.location,
      city: data.city,
      country: data.country,
      event_status: data.event_status,
      status: data.status,
      registration_url: data.registration_url ?? "",
      speakers: data.speakers ?? [],
      gallery: data.gallery ?? [],
      seo_title: data.seo_title ?? "",
      seo_description: data.seo_description ?? "",
    });
    setSpeakerText(
      (data.speakers ?? []).map((s) => `${s.name}${s.role ? ` — ${s.role}` : ""}`).join("\n"),
    );
  }, [data]);

  const setTitle = (title: string) =>
    setForm((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }));

  const addGalleryImage = async (file: File | undefined) => {
    if (!file) return;
    try {
      const url = await uploadContentImage(file);
      setForm((prev) => ({ ...prev, gallery: [...prev.gallery, url] }));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const save = async (status: string) => {
    const speakers = speakerText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [name, role] = line.split("—").map((part) => part.trim());
        return role ? { name: name ?? "", role } : { name: name ?? "" };
      });
    const payload = { ...form, speakers, status };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSaving(true);
    const record = {
      ...payload,
      start_time: payload.start_time || null,
      end_time: payload.end_time || null,
      registration_url: payload.registration_url || null,
      seo_title: payload.seo_title || null,
      seo_description: payload.seo_description || null,
    };
    const result = isNew
      ? await supabase.from("events").insert(record).select("id").maybeSingle()
      : await supabase.from("events").update(record).eq("id", id).select("id").maybeSingle();
    setSaving(false);
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin"] });
    queryClient.invalidateQueries({ queryKey: ["events"] });
    queryClient.invalidateQueries({ queryKey: ["latest-content"] });
    toast.success(status === "published" ? "Event published" : "Event saved");
    navigate({ to: "/admin" });
  };

  return (
    <AdminShell title={isNew ? "New event" : "Edit event"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link to="/admin">
            <ArrowLeft className="size-4" /> Back
          </Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => save("draft")} disabled={saving}>
            Save draft
          </Button>
          <Button variant="hero" onClick={() => save("published")} disabled={saving}>
            <Save className="size-4" /> Publish
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={form.title}
              maxLength={180}
              className="mt-2"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={form.slug}
              maxLength={120}
              className="mt-2"
              onChange={(e) => {
                setSlugTouched(true);
                setForm((prev) => ({ ...prev, slug: slugify(e.target.value) }));
              }}
            />
            <p className="mt-1 text-xs text-muted-foreground">/events/{form.slug || "…"}</p>
          </div>
          <div>
            <Label htmlFor="description">Short description</Label>
            <Textarea
              id="description"
              rows={3}
              maxLength={600}
              className="mt-2"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </div>
          <div>
            <Label>Full details</Label>
            <div className="mt-2">
              <RichTextEditor
                value={form.content}
                onChange={(content) => setForm((prev) => ({ ...prev, content }))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="speakers">Speakers (one per line: Name — Role)</Label>
            <Textarea
              id="speakers"
              rows={4}
              maxLength={2000}
              className="mt-2"
              value={speakerText}
              onChange={(e) => setSpeakerText(e.target.value)}
            />
          </div>
          <div>
            <Label>Gallery</Label>
            <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {form.gallery.map((image) => (
                <div
                  key={image}
                  className="relative overflow-hidden rounded-xl border border-border"
                >
                  <img src={image} alt="" className="h-24 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        gallery: prev.gallery.filter((g) => g !== image),
                      }))
                    }
                    className="absolute right-1 top-1 rounded-full bg-background/90 px-2 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <label className="flex h-24 cursor-pointer items-center justify-center rounded-xl border border-dashed border-border bg-muted text-xs text-muted-foreground hover:border-primary hover:text-primary">
                + Add photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => addGalleryImage(e.target.files?.[0])}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <ImageUpload
              value={form.cover_image}
              onChange={(cover_image) => setForm((prev) => ({ ...prev, cover_image }))}
            />
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={form.category}
                maxLength={80}
                className="mt-2"
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="event-status">Event status</Label>
              <select
                id="event-status"
                value={form.event_status}
                onChange={(e) => setForm((prev) => ({ ...prev, event_status: e.target.value }))}
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {EVENT_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                className="mt-2"
                value={form.date}
                onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="start">Start time</Label>
                <Input
                  id="start"
                  type="time"
                  className="mt-2"
                  value={form.start_time}
                  onChange={(e) => setForm((prev) => ({ ...prev, start_time: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end">End time</Label>
                <Input
                  id="end"
                  type="time"
                  className="mt-2"
                  value={form.end_time}
                  onChange={(e) => setForm((prev) => ({ ...prev, end_time: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Venue</Label>
              <Input
                id="location"
                value={form.location}
                maxLength={180}
                className="mt-2"
                onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  maxLength={120}
                  className="mt-2"
                  onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.country}
                  maxLength={120}
                  className="mt-2"
                  onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="registration">Registration URL (optional)</Label>
              <Input
                id="registration"
                value={form.registration_url}
                maxLength={500}
                className="mt-2"
                placeholder="https://…"
                onChange={(e) => setForm((prev) => ({ ...prev, registration_url: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display font-bold text-ink">SEO</h2>
            <div>
              <Label htmlFor="seo-title">SEO title</Label>
              <Input
                id="seo-title"
                value={form.seo_title}
                maxLength={180}
                className="mt-2"
                onChange={(e) => setForm((prev) => ({ ...prev, seo_title: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="seo-description">SEO description</Label>
              <Textarea
                id="seo-description"
                rows={3}
                maxLength={300}
                className="mt-2"
                value={form.seo_description}
                onChange={(e) => setForm((prev) => ({ ...prev, seo_description: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
