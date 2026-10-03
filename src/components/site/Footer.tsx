import { Link } from "@tanstack/react-router";
import { Leaf, Linkedin, Mail, MapPin, Twitter } from "lucide-react";

const footerLinks = [
  { label: "Technology", to: "/technology" },
  { label: "Impact", to: "/impact" },
  { label: "Field Study", to: "/field-study" },
  { label: "Blog", to: "/blog" },
  { label: "Events", to: "/events" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function Footer() {
  return (
    <footer className="bg-primary-dark text-primary-foreground">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/12 text-primary-foreground">
              <Leaf className="size-5" />
            </span>
            <span className="font-display text-lg font-extrabold">AgriVitro</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/75">
            Smart Greenhouses. Smarter Agriculture.
          </p>
          <p className="mt-6 flex items-center gap-2 text-sm text-primary-foreground/75">
            <MapPin className="size-4" /> Morocco — Fez | Souss-Massa
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/75">
            <Mail className="size-4" /> contact@agrivitro.ma
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
            Explore
          </h2>
          <ul className="mt-4 space-y-2">
            {footerLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-primary-foreground/80 transition-colors hover:text-primary-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-primary-foreground/60">
            Follow
          </h2>
          <div className="mt-4 flex gap-3">
            <a
              href="#"
              aria-label="LinkedIn (placeholder)"
              className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
            >
              <Linkedin className="size-4" />
            </a>
            <a
              href="#"
              aria-label="X (placeholder)"
              className="flex size-10 items-center justify-center rounded-xl bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20"
            >
              <Twitter className="size-4" />
            </a>
          </div>
          <p className="mt-4 text-xs text-primary-foreground/60">
            Social links are placeholders and can be replaced at any time.
          </p>
        </div>
      </div>

      <div className="border-t border-primary-foreground/12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-primary-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 AgriVitro. All rights reserved.</p>
          <Link to="/admin" className="transition-colors hover:text-primary-foreground">
            Content admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
