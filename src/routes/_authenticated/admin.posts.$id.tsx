import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { BlogPost } from "@/lib/content-types";
import { BLOG_CATEGORIES, slugify } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin/posts/$id")({
  head: () => ({
    meta: [
      { title: "Article editor — AgriVitro CMS" },
      { name: "description", content: "Create and edit AgriVitro articles." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Article editor — AgriVitro CMS" },
      { property: "og:description", content: "Create and edit AgriVitro articles." },
    ],
  }),
  component: PostEditor,
});

const schema = z.object({
  title: z.string().trim().min(3, "Title is required").max(180),
  slug: z.string().trim().min(3, "Slug is required").max(120),
  excerpt: z.string().trim().max(400),
  content: z.string().max(120000),
  category: z.string().trim().min(1).max(80),
  author: z.string().trim().min(1).max(120),
  publication_date: z.string().min(8),
  reading_time: z.number().int().min(1).max(120),
  seo_title: z.string().trim().max(180),
  seo_description: z.string().trim().max(300),
});

const blank = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: null as string | null,
  category: BLOG_CATEGORIES[0] as string,
  tags: [] as string[],
  author: "AgriVitro Team",
  publication_date: new Date().toISOString().slice(0, 10),
  reading_time: 5,
  featured: false,
  status: "draft",
  seo_title: "",
  seo_description: "",
};

function PostEditor() {
  const { id } = Route.useParams();
  const isNew = id === "new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(blank);
  const [slugTouched, setSlugTouched] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "post", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return (data as unknown as BlogPost) ?? null;
    },
  });

  useEffect(() => {
    if (!data) return;
    setSlugTouched(true);
    setForm({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      cover_image: data.cover_image,
      category: data.category,
      tags: data.tags ?? [],
      author: data.author,
      publication_date: data.publication_date,
      reading_time: data.reading_time,
      featured: data.featured,
      status: data.status,
      seo_title: data.seo_title ?? "",
      seo_description: data.seo_description ?? "",
    });
    setTagInput((data.tags ?? []).join(", "));
  }, [data]);

  const setTitle = (title: string) =>
    setForm((prev) => ({ ...prev, title, slug: slugTouched ? prev.slug : slugify(title) }));

  const save = async (status: string) => {
    const tags = tagInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .slice(0, 12);
    const payload = { ...form, tags, status };
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSaving(true);
    const record = {
      ...payload,
      seo_title: payload.seo_title || null,
      seo_description: payload.seo_description || null,
    };
    const result = isNew
      ? await supabase.from("blog_posts").insert(record).select("id").maybeSingle()
      : await supabase.from("blog_posts").update(record).eq("id", id).select("id").maybeSingle();
    setSaving(false);
    if (result.error) {
      toast.error(result.error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin"] });
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.invalidateQueries({ queryKey: ["latest-content"] });
    toast.success(status === "published" ? "Article published" : "Article saved");
    navigate({ to: "/admin" });
  };

  return (
    <AdminShell title={isNew ? "New article" : "Edit article"}>
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
            <p className="mt-1 text-xs text-muted-foreground">/blog/{form.slug || "…"}</p>
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              rows={3}
              maxLength={400}
              className="mt-2"
              value={form.excerpt}
              onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            />
          </div>
          <div>
            <Label>Content</Label>
            <div className="mt-2">
              <RichTextEditor
                value={form.content}
                onChange={(content) => setForm((prev) => ({ ...prev, content }))}
              />
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
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {BLOG_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={tagInput}
                maxLength={300}
                className="mt-2"
                onChange={(e) => setTagInput(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date">Publication date</Label>
                <Input
                  id="date"
                  type="date"
                  className="mt-2"
                  value={form.publication_date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, publication_date: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="reading">Reading time (min)</Label>
                <Input
                  id="reading"
                  type="number"
                  min={1}
                  max={120}
                  className="mt-2"
                  value={form.reading_time}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, reading_time: Number(e.target.value) || 1 }))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={form.author}
                maxLength={120}
                className="mt-2"
                onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
              />
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-muted p-4">
              <div>
                <p className="text-sm font-medium text-ink">Featured article</p>
                <p className="text-xs text-muted-foreground">Highlighted at the top of the blog.</p>
              </div>
              <Switch
                checked={form.featured}
                onCheckedChange={(featured) => setForm((prev) => ({ ...prev, featured }))}
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
