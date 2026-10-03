import { Droplets, Gauge, Leaf, Sun, Thermometer, Wifi } from "lucide-react";

const metrics = [
  { icon: Thermometer, label: "Air temperature", value: "24.6 °C", tone: "text-primary" },
  { icon: Droplets, label: "Soil moisture", value: "41 %", tone: "text-primary" },
  { icon: Sun, label: "Light (PAR)", value: "680 µmol", tone: "text-primary" },
  { icon: Gauge, label: "CO₂", value: "540 ppm", tone: "text-primary" },
];

export function DashboardMock() {
  return (
    <div className="w-full rounded-3xl border border-border bg-card p-4 shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="gradient-primary flex size-8 items-center justify-center rounded-lg text-primary-foreground">
            <Leaf className="size-4" />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-ink">Greenhouse GH-02</p>
            <p className="text-xs text-muted-foreground">Souss-Massa · tomato cycle</p>
          </div>
        </div>
        <span className="relative inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary-dark">
          <span className="relative size-2 rounded-full bg-primary">
            <span className="animate-pulse-ring absolute inset-0 rounded-full" />
          </span>
          Live
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl bg-muted p-3">
            <metric.icon className={`size-4 ${metric.tone}`} />
            <p className="mt-2 text-xs text-muted-foreground">{metric.label}</p>
            <p className="font-display text-lg font-bold text-ink">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-border p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Irrigation plan · next 24 h
          </p>
          <Wifi className="size-4 text-primary" />
        </div>
        <svg
          viewBox="0 0 320 90"
          className="mt-3 h-24 w-full"
          role="img"
          aria-label="Irrigation schedule curve"
        >
          <defs>
            <linearGradient id="av-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 70 C 40 70, 50 30, 80 34 S 130 66, 165 48 S 225 18, 260 40 S 300 62, 320 52 L320 90 L0 90 Z"
            fill="url(#av-area)"
          />
          <path
            d="M0 70 C 40 70, 50 30, 80 34 S 130 66, 165 48 S 225 18, 260 40 S 300 62, 320 52"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M0 82 H320"
            stroke="var(--primary)"
            strokeOpacity="0.5"
            strokeWidth="2"
            className="animate-flow"
          />
        </svg>
        <p className="text-xs text-muted-foreground">
          AI model schedules watering around forecast heat peaks to cut waste.
        </p>
      </div>
    </div>
  );
}
