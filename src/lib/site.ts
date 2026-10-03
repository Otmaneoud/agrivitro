export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Live Dashboard", to: "/dashboard" },
  { label: "Technology", to: "/technology" },
  { label: "Impact", to: "/impact" },
  { label: "Field Study", to: "/field-study" },
  { label: "Blog", to: "/blog" },
  { label: "Events", to: "/events" },
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export const BLOG_CATEGORIES = [
  "Smart Agriculture",
  "AI & IoT",
  "Water Management",
  "Sustainable Energy",
  "Greenhouses",
  "Field Updates",
  "AgriVitro News",
] as const;

export const EVENT_STATUSES = [
  { value: "upcoming", label: "Upcoming" },
  { value: "happening_soon", label: "Happening Soon" },
  { value: "completed", label: "Completed" },
] as const;

export const IMPACT_FIGURES = [
  { value: 30, suffix: "%", label: "Less water used" },
  { value: 25, suffix: "%", label: "Less energy consumed" },
  { value: 20, suffix: "%", label: "Higher crop yield" },
  { value: 60, suffix: "", label: "Greenhouses in field study" },
] as const;

export function formatDate(value: string | null | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Minimal allowlist sanitiser for admin-authored HTML. */
export function sanitizeHtml(html: string) {
  return html
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/<\s*(script|style|iframe|object|embed|link|meta)[^>]*\/?>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "")
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");
}
