import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Layers,
  LayoutDashboard,
  LineChart,
  FileSpreadsheet,
  Activity,
  AlertTriangle,
} from "lucide-react";

import { SiteShell } from "@/components/site/SiteShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { SensorCard } from "@/components/dashboard/SensorCard";
import { ActuatorControlCard } from "@/components/dashboard/ActuatorControlCard";
import { GreenhousePhysicalView } from "@/components/dashboard/GreenhousePhysicalView";
import { TelemetryCharts } from "@/components/dashboard/TelemetryCharts";
import { TelemetryHistoryTable } from "@/components/dashboard/TelemetryHistoryTable";
import { DashboardAuthModal } from "@/components/dashboard/DashboardAuthModal";

import { getLiveTelemetry, getTelemetryHistory, getRecentReadings } from "@/lib/iot.functions";
import type { GreenhouseTelemetry } from "@/lib/iot-types";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de Bord IoT & Télémesure — Serre Connectée Fès | AgriVitro" },
      {
        name: "description",
        content:
          "Surveillance en direct des capteurs agronomiques (température, humidité, sol, lux, CO2) et contrôle des actionneurs de la serre expérimentale AgriVitro à Fès.",
      },
      { property: "og:title", content: "Tableau de Bord IoT — AgriVitro Serre Connectée" },
      {
        property: "og:description",
        content:
          "Télémesure temps réel et pilotage des actionneurs (irrigation, ventilation) connectés à InfluxDB.",
      },
      { property: "og:url", content: "/dashboard" },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: DashboardPage,
});

const defaultTelemetry: GreenhouseTelemetry = {
  temperature: 24.5,
  humidity: 45.0,
  soilMoisture: 38.0,
  lux: 650,
  airPpm: 550,
  fanStatus: 0,
  fanManual: 0,
  pumpStatus: 0,
  pumpManual: 0,
  time: new Date().toISOString(),
  location: "fes",
};

function DashboardPage() {
  const queryClient = useQueryClient();
  const [activeViewTab, setActiveViewTab] = useState("overview");
  const [selectedRange, setSelectedRange] = useState<"24h" | "7d" | "30d">("24h");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [passkey, setPasskey] = useState<string | null>(null);

  // Initialize stored passkey from sessionStorage if exists
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("agrivitro_iot_auth");
      if (stored) setPasskey(stored);
    }
  }, []);

  // 1. Live Telemetry (15s polling)
  const {
    data: telemetry = defaultTelemetry,
    isFetching: isFetchingTelemetry,
    refetch: refetchTelemetry,
  } = useQuery({
    queryKey: ["iot", "live-telemetry"],
    queryFn: () => getLiveTelemetry(),
    refetchInterval: 15000,
  });

  // 2. Telemetry History (aggregated curves)
  const {
    data: history = [],
    isFetching: isFetchingHistory,
    refetch: refetchHistory,
  } = useQuery({
    queryKey: ["iot", "history", selectedRange],
    queryFn: () =>
      getTelemetryHistory({
        data: { range: selectedRange, location: "fes" },
      }),
    refetchInterval: 30000,
  });

  // 3. Recent raw logs
  const {
    data: rawReadings = [],
    isFetching: isFetchingLogs,
    refetch: refetchLogs,
  } = useQuery({
    queryKey: ["iot", "recent-readings"],
    queryFn: () => getRecentReadings(),
    refetchInterval: 20000,
  });

  function handleRefreshAll() {
    refetchTelemetry();
    refetchHistory();
    refetchLogs();
  }

  function handleLock() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("agrivitro_iot_auth");
    }
    setPasskey(null);
  }

  // Calculate sensor status tags
  const tempStatus =
    telemetry.temperature > 32
      ? { status: "alert" as const, text: "Alerte Chaleur" }
      : telemetry.temperature > 28
        ? { status: "warning" as const, text: "Chaud" }
        : telemetry.temperature < 16
          ? { status: "warning" as const, text: "Frais" }
          : { status: "optimal" as const, text: "Idéal" };

  const humStatus =
    telemetry.humidity < 30
      ? { status: "warning" as const, text: "Air Sec" }
      : telemetry.humidity > 80
        ? { status: "alert" as const, text: "Saturé (Risque Fongique)" }
        : { status: "optimal" as const, text: "Optimal" };

  const soilStatus =
    telemetry.soilMoisture < 20
      ? { status: "alert" as const, text: "Substrat Sec" }
      : telemetry.soilMoisture < 35
        ? { status: "warning" as const, text: "Irrigation Conseillée" }
        : { status: "optimal" as const, text: "Bien Hydraté" };

  const airStatus =
    telemetry.airPpm > 1200
      ? { status: "alert" as const, text: "Aération Requise" }
      : telemetry.airPpm > 800
        ? { status: "warning" as const, text: "Moyen" }
        : { status: "optimal" as const, text: "Air Sain" };

  return (
    <SiteShell>
      <main className="min-h-screen bg-background pb-16 pt-24 sm:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <DashboardHeader
            lastUpdated={telemetry.time}
            isFetching={isFetchingTelemetry}
            onRefresh={handleRefreshAll}
            isUnlocked={!!passkey}
            onToggleAuthModal={() => setAuthModalOpen(true)}
            onLock={handleLock}
          />

          {/* Top navigation tabs */}
          <Tabs value={activeViewTab} onValueChange={setActiveViewTab} className="w-full space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md bg-muted/80 p-1 rounded-2xl">
              <TabsTrigger
                value="overview"
                className="rounded-xl text-xs gap-1.5 font-semibold py-2.5"
              >
                <LayoutDashboard className="size-3.5" />
                Vue d'Ensemble
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="rounded-xl text-xs gap-1.5 font-semibold py-2.5"
              >
                <LineChart className="size-3.5" />
                Graphiques (24h)
              </TabsTrigger>
              <TabsTrigger value="logs" className="rounded-xl text-xs gap-1.5 font-semibold py-2.5">
                <FileSpreadsheet className="size-3.5" />
                Historique & Export
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: Overview & Bench View */}
            <TabsContent value="overview" className="space-y-8">
              {/* 5 Real-time Sensor Metric Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <SensorCard
                  title="Température"
                  value={telemetry.temperature.toFixed(1)}
                  unit="°C"
                  subtitle="Canopée végétale"
                  icon={Thermometer}
                  idealRange="20 - 28 °C"
                  status={tempStatus.status}
                  statusText={tempStatus.text}
                  progressPercent={((telemetry.temperature - 10) / 30) * 100}
                  accentColor="text-emerald-600"
                />

                <SensorCard
                  title="Humidité"
                  value={telemetry.humidity.toFixed(1)}
                  unit="%"
                  subtitle="Ambiance relative"
                  icon={Droplets}
                  idealRange="50 - 75 %"
                  status={humStatus.status}
                  statusText={humStatus.text}
                  progressPercent={telemetry.humidity}
                  accentColor="text-sky-600"
                />

                <SensorCard
                  title="Humidité Sol"
                  value={telemetry.soilMoisture.toFixed(1)}
                  unit="%"
                  subtitle="Sonde substrat racinaire"
                  icon={Layers}
                  idealRange="40 - 70 %"
                  status={soilStatus.status}
                  statusText={soilStatus.text}
                  progressPercent={telemetry.soilMoisture}
                  accentColor="text-teal-600"
                />

                <SensorCard
                  title="Luminosité"
                  value={telemetry.lux.toFixed(0)}
                  unit="lx"
                  subtitle="Rayonnement sous toit"
                  icon={Sun}
                  idealRange="300 - 1200 lx"
                  status={telemetry.lux > 100 ? "optimal" : "neutral"}
                  statusText={telemetry.lux > 100 ? "Ensoleillé" : "Obscurité"}
                  progressPercent={(telemetry.lux / 1200) * 100}
                  accentColor="text-amber-500"
                />

                <SensorCard
                  title="Qualité Air"
                  value={telemetry.airPpm}
                  unit="ppm"
                  subtitle="Indice gaz & CO₂"
                  icon={Wind}
                  idealRange="400 - 800 ppm"
                  status={airStatus.status}
                  statusText={airStatus.text}
                  progressPercent={(telemetry.airPpm / 1500) * 100}
                  accentColor="text-indigo-600"
                />
              </div>

              {/* Actuator Controllers (Fan & Pump) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-bold text-ink">
                    Pilotage des Actionneurs Connectés
                  </h2>
                  {!passkey && (
                    <span className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                      <AlertTriangle className="size-3.5 text-amber-600" />
                      Mode lecture seule · Déverrouillez pour agir
                    </span>
                  )}
                </div>
                <ActuatorControlCard
                  fanStatus={telemetry.fanStatus}
                  fanManual={telemetry.fanManual}
                  pumpStatus={telemetry.pumpStatus}
                  pumpManual={telemetry.pumpManual}
                  isUnlocked={!!passkey}
                  passkey={passkey}
                  onRequestAuth={() => setAuthModalOpen(true)}
                  onCommandSent={() => {
                    // Refetch telemetry slightly after command to capture updated state
                    setTimeout(() => refetchTelemetry(), 1500);
                  }}
                />
              </div>

              {/* Physical Greenhouse Schematic ("Bancale") */}
              <GreenhousePhysicalView telemetry={telemetry} />
            </TabsContent>

            {/* TAB 2: Analytics & Trends */}
            <TabsContent value="analytics">
              <TelemetryCharts
                history={history}
                selectedRange={selectedRange}
                onRangeChange={setSelectedRange}
                isLoading={isFetchingHistory}
              />
            </TabsContent>

            {/* TAB 3: Historic Logs & CSV Export */}
            <TabsContent value="logs">
              <TelemetryHistoryTable readings={rawReadings} isLoading={isFetchingLogs} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Auth Passkey Modal */}
      <DashboardAuthModal
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
        onAuthenticated={(key) => setPasskey(key)}
      />
    </SiteShell>
  );
}
