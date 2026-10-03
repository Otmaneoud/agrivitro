# AgriVitro — Full Website + Content Platform

Build the complete AgriVitro marketing website and, on top of it, a Blog & Events content platform with an invite-only admin area so the team can publish without touching code.

## 1. Design system

Define the brand once in `src/styles.css` as semantic tokens (oklch):
primary green `#168A45`, dark green `#0B5D32`, light green `#DDF4E5`, very light green `#F3FAF5`, dark text `#163322`, muted text `#607568`, white surfaces.
Plus: soft green gradients, rounded-2xl card radii, subtle elevation shadows, fade-up + counter animations. Typography: Plus Jakarta Sans (headings) + Inter (body) loaded via a `<link>` in the root route. Icons: Lucide.

Shared components: sticky translucent navbar with mobile hamburger sheet, footer (dark green), section wrapper, animated counter, fade-in-on-scroll hook, CTA buttons as Button variants.

## 2. Marketing site (public routes)

- `/` — hero (generated image of a modern Moroccan greenhouse in a dry landscape) with badge, headline "Grow More. Waste Less. Farm Smarter.", both CTAs, trust line, and a live-looking greenhouse dashboard panel; climate challenge section (7+ years, -48%, +1.77°C); solution diagram (AgriVitro Box + IoT Sensors / AI Irrigation / Solar Power / Mobile Dashboard with animated connection lines); how it works (4 steps); impact counters (30 / 25 / 20 / 60) with a stylised Morocco map marking Fez and Souss-Massa; product dashboard showcase; AI section with Sensors → AI → Decision → Irrigation → Healthier Crops flow; sustainability cards; field study timeline; about with a generated farmer-in-greenhouse image; testimonials (clearly placeholder, no invented names); gradient final CTA; **Latest from AgriVitro** section with tabs (Latest Articles / Upcoming Events) pulling live content, plus "View All Insights →" and "View All Events →"; contact form.
- `/technology`, `/impact`, `/field-study`, `/about`, `/contact` — dedicated pages reusing those sections with their own copy and SEO metadata.

Only the verified figures are used: 30% less water, 25% less energy, 20% higher yield, 4 deployed greenhouses, 60-greenhouse field study, Fez, Souss-Massa.

## 3. Backend (Lovable Cloud)

Enable Lovable Cloud and create:

- `blog_posts`: id, title, slug (unique), excerpt, content (rich HTML), cover_image, category, tags[], author, publication_date, reading_time, featured, status (draft/published), seo_title, seo_description, timestamps.
- `events`: id, title, slug (unique), description, content, cover_image, date, start_time, end_time, location, city, country, status (draft/published) + lifecycle status (upcoming/happening_soon/completed), registration_url, speakers (jsonb), gallery (text[]), seo fields, timestamps.
- `user_roles` + `app_role` enum + `has_role()` security-definer function (roles never on a profile table).
- Public read policies limited to `status = 'published'`; full read/write for admins only. Storage bucket for cover/gallery image uploads (public read, admin write).
- Seed migration inserts the 6 demo articles and 4 demo events listed in the brief, each flagged and labelled as demo content.

Reads go through TanStack server functions (public ones for public pages, `requireSupabaseAuth` for admin).

## 4. Blog

- `/blog` — hero "AgriVitro Insights", search box ("Search AgriVitro Insights..."), category filter chips (All, Smart Agriculture, AI & IoT, Water Management, Sustainable Energy, Greenhouses, Field Updates, AgriVitro News), featured article block, responsive card grid, attractive empty state. Search matches title, excerpt, category and tags.
- `/blog/$slug` — editorial article layout: cover image, category, title, intro, author, date, reading time, long-form typography (headings, images with captions, quotes, lists, links, highlighted stats), share buttons, related articles, and the "Enjoyed this article? Explore more AgriVitro insights →" footer. SEO title/description/OG image come from the record; Article JSON-LD included.

## 5. Events

- `/events` — hero "Events & Field Activities", event cards with image, category, title, date, location, description, and colour-coded status badge (Upcoming / Happening Soon / Completed).
- `/events/$slug` — cover, title, date/time, location, description, AgriVitro participation, speakers, gallery, add-to-calendar (.ics download), and a Register / Learn More CTA that appears only when a registration URL is set in the CMS.

## 6. Admin (invite-only)

- `/auth` — email/password sign-in.
- `/_authenticated/admin` — dashboard: counts for published articles, drafts, upcoming and past events; quick actions "+ New Article" / "+ New Event"; management tables with title, status, category/type, date, author and actions (Edit | Preview | Publish/Unpublish | Delete).
- `/_authenticated/admin/posts/new` and `/posts/$id`, `/events/new` and `/events/$id` — full editors covering every field in the content model, image upload to Cloud storage, tag input, slug auto-generation with manual override, featured toggle, SEO fields, draft/publish controls.
- Rich text editing for article content with sanitised rendering on the public side.
- Non-admin signed-in users see an "access pending" screen; the first admin is granted by role assignment.

## 7. SEO & responsiveness

Per-route `head()` with unique title, description, OG/Twitter tags and self-referencing canonical; clean slugs `/blog/...` and `/events/...`; `robots.txt` plus a generated sitemap route covering static pages and all published posts/events. Fully responsive: 3-col → 2-col → single column, no horizontal scroll, mobile nav and accessible CTA.

## Technical notes

TanStack Start file-based routes; TanStack Query for reads; server functions in `*.functions.ts`; zod validation on the contact form and all admin mutations; DOMPurify-style sanitisation before rendering stored HTML; animations via CSS/IntersectionObserver (no heavy animation library).
