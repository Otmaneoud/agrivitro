import { useState } from "react";
import { Sun, Thermometer, Droplets, Wind, Fan, Activity, Layers, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GreenhouseTelemetry } from "@/lib/iot-types";

interface GreenhousePhysicalViewProps {
  telemetry: GreenhouseTelemetry;
}

export function GreenhousePhysicalView({ telemetry }: GreenhousePhysicalViewProps) {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const zones = [
    {
      id: "apex-lux",
      title: "Plafond Serre · Capteur Lumineux",
      description: "Mesure le rayonnement direct & photosynthétique (PAR).",
      value: `${telemetry.lux} lux`,
      icon: Sun,
      color: "text-amber-500",
      top: "14%",
      left: "48%",
    },
    {
      id: "canopy-climate",
      title: "Micro-climat Canopée · Température & Humidité",
      description: "Surveillance de la zone foliaire et transpiration des plants.",
      value: `${telemetry.temperature} °C · ${telemetry.humidity} % HR`,
      icon: Thermometer,
      color: "text-emerald-500",
      top: "42%",
      left: "32%",
    },
    {
      id: "fan-wall",
      title: "Paroi Latérale · Ventilateur d'Extraction",
      description:
        telemetry.fanStatus === 1 ? "Ventilateur actif en extraction" : "Ventilateur à l'arrêt",
      value: telemetry.fanStatus === 1 ? "En rotation (MARCHE)" : "Arrêté (OFF)",
      icon: Fan,
      color: telemetry.fanStatus === 1 ? "text-emerald-600 animate-spin" : "text-slate-400",
      top: "35%",
      left: "86%",
    },
    {
      id: "air-sensor",
      title: "Zone Aération · Sonde Qualité de l'Air",
      description: "Détection CO2 et composés volatils dans le volume de serre.",
      value: `${telemetry.airPpm} ppm`,
      icon: Wind,
      color: "text-sky-500",
      top: "56%",
      left: "70%",
    },
    {
      id: "root-substrate",
      title: "Banc de Culture · Sonde Humidité Substrat",
      description: "Teneur en eau volumétrique dans le substrat racinaire.",
      value: `${telemetry.soilMoisture} %`,
      icon: Layers,
      color: "text-emerald-600",
      top: "76%",
      left: "38%",
    },
    {
      id: "irrigation-pump",
      title: "Réseau Fertigation · Pompe Goutte-à-Goutte",
      description: telemetry.pumpStatus === 1 ? "Injection d'eau en cours" : "Pompe en veille",
      value: telemetry.pumpStatus === 1 ? "Irrigation active" : "Veille",
      icon: Droplets,
      color: telemetry.pumpStatus === 1 ? "text-blue-500 animate-pulse" : "text-slate-400",
      top: "84%",
      left: "14%",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">
            Vue Schématique du Bancale (Serre Fès)
          </h2>
          <p className="text-xs text-muted-foreground">
            Cartographie physique des capteurs et actionneurs installés sur la structure
            expérimentale.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-xs font-medium border-primary/20 bg-primary/5 text-primary-dark"
          >
            <Activity className="mr-1.5 size-3 text-primary animate-pulse" />6 Points de Contrôle
            Connectés
          </Badge>
        </div>
      </div>

      {/* Schematic Diagram Container */}
      <Card className="relative overflow-hidden border border-border bg-gradient-to-b from-card via-surface/40 to-muted/30 shadow-card">
        <CardContent className="p-6">
          {/* SVG Greenhouse & Bench wireframe */}
          <div className="relative mx-auto aspect-[16/9] w-full max-w-4xl select-none rounded-2xl border border-border/80 bg-background/60 p-4 backdrop-blur-xs">
            <svg
              viewBox="0 0 800 450"
              className="size-full overflow-visible"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.03" />
                </linearGradient>
                <linearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.5502 0.1454 152.6)" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="oklch(0.5502 0.1454 152.6)" stopOpacity="0.05" />
                </linearGradient>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.5"
                    className="text-border/40"
                  />
                </pattern>
              </defs>

              {/* Background architectural grid */}
              <rect width="800" height="450" fill="url(#grid)" />

              {/* Greenhouse Structural Frame */}
              {/* Apex Roof */}
              <polygon
                points="400,30 720,130 720,380 80,380 80,130"
                fill="url(#roofGrad)"
                stroke="var(--border)"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              {/* Center Ridge Pole */}
              <line
                x1="400"
                y1="30"
                x2="400"
                y2="380"
                stroke="var(--border)"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />
              <line
                x1="80"
                y1="130"
                x2="720"
                y2="130"
                stroke="var(--border)"
                strokeWidth="1.5"
                strokeOpacity="0.6"
              />

              {/* Culture Table / Bench ("Bancale") */}
              <polygon
                points="140,290 660,290 620,350 180,350"
                fill="url(#benchGrad)"
                stroke="oklch(0.5502 0.1454 152.6)"
                strokeWidth="2"
              />
              {/* Bench Table Legs */}
              <line
                x1="180"
                y1="350"
                x2="180"
                y2="400"
                stroke="var(--ink)"
                strokeWidth="3"
                strokeOpacity="0.5"
              />
              <line
                x1="620"
                y1="350"
                x2="620"
                y2="400"
                stroke="var(--ink)"
                strokeWidth="3"
                strokeOpacity="0.5"
              />
              <line
                x1="280"
                y1="350"
                x2="280"
                y2="400"
                stroke="var(--ink)"
                strokeWidth="2"
                strokeOpacity="0.3"
              />
              <line
                x1="520"
                y1="350"
                x2="520"
                y2="400"
                stroke="var(--ink)"
                strokeWidth="2"
                strokeOpacity="0.3"
              />

              {/* Substrate bed on table */}
              <rect
                x="200"
                y="278"
                width="400"
                height="12"
                rx="4"
                fill="oklch(0.4 0.08 140 / 0.4)"
                stroke="oklch(0.4 0.08 140)"
                strokeWidth="1"
              />

              {/* Seedlings / Foliage on Bench */}
              {[230, 270, 310, 350, 390, 430, 470, 510, 550].map((cx, i) => (
                <g key={i}>
                  {/* Stem */}
                  <line
                    x1={cx}
                    y1="278"
                    x2={cx}
                    y2="245"
                    stroke="oklch(0.55 0.14 152)"
                    strokeWidth="2"
                  />
                  {/* Leaves */}
                  <ellipse
                    cx={cx - 6}
                    cy="245"
                    rx="7"
                    ry="4"
                    fill="oklch(0.55 0.14 152)"
                    transform={`rotate(-25 ${cx - 6} 245)`}
                  />
                  <ellipse
                    cx={cx + 6}
                    cy="245"
                    rx="7"
                    ry="4"
                    fill="oklch(0.55 0.14 152)"
                    transform={`rotate(25 ${cx + 6} 245)`}
                  />
                  <circle cx={cx} cy="238" r="4" fill="oklch(0.65 0.16 150)" />
                </g>
              ))}

              {/* Irrigation line */}
              <path
                d="M 110,380 L 110,330 L 200,330 L 200,285 L 600,285"
                fill="none"
                stroke="oklch(0.6 0.14 240)"
                strokeWidth="2"
                strokeDasharray="6 3"
              />

              {/* Air flow arrows from Fan when active */}
              {telemetry.fanStatus === 1 && (
                <g className="text-emerald-500 animate-pulse">
                  <path
                    d="M 620,180 Q 670,170 710,160"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="5 5"
                  />
                  <path
                    d="M 630,200 Q 680,190 715,185"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="5 5"
                  />
                  <path
                    d="M 620,220 Q 670,210 710,210"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeDasharray="5 5"
                  />
                </g>
              )}
            </svg>

            {/* Interactive Marker Hotspots */}
            {zones.map((zone) => {
              const Icon = zone.icon;
              const isSelected = activeZone === zone.id;
              return (
                <div
                  key={zone.id}
                  style={{ top: zone.top, left: zone.left }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
                  onClick={() => setActiveZone(isSelected ? null : zone.id)}
                  onMouseEnter={() => setActiveZone(zone.id)}
                >
                  <div
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-md backdrop-blur-md transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground scale-105"
                        : "border-border/80 bg-background/90 text-ink hover:border-primary/50"
                    }`}
                  >
                    <Icon
                      className={`size-3.5 ${isSelected ? "text-primary-foreground" : zone.color}`}
                    />
                    <span className="text-[11px] font-bold tracking-tight whitespace-nowrap">
                      {zone.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Zone Detail Card */}
          {activeZone && (
            <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 transition-all">
              {(() => {
                const current = zones.find((z) => z.id === activeZone);
                if (!current) return null;
                const Icon = current.icon;
                return (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div>
                        <h4 className="font-display text-sm font-bold text-ink">{current.title}</h4>
                        <p className="text-xs text-muted-foreground">{current.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Valeur actuelle</p>
                      <p className="font-display text-lg font-extrabold text-primary-dark">
                        {current.value}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
