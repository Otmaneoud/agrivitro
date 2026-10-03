import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Thermometer, Droplets, Sun, Wind, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import type { TelemetryPoint } from "@/lib/iot-types";

interface TelemetryChartsProps {
  history: TelemetryPoint[];
  selectedRange: "24h" | "7d" | "30d";
  onRangeChange: (range: "24h" | "7d" | "30d") => void;
  isLoading: boolean;
}

export function TelemetryCharts({
  history,
  selectedRange,
  onRangeChange,
  isLoading,
}: TelemetryChartsProps) {
  const [activeTab, setActiveTab] = useState("climate");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">
            Courbes d'Évolution & Analytique
          </h2>
          <p className="text-xs text-muted-foreground">
            Tendances temporelles agrégées depuis la base InfluxDB Cloud v2.
          </p>
        </div>

        {/* Time range buttons */}
        <div className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 p-1">
          {(["24h", "7d", "30d"] as const).map((r) => (
            <Button
              key={r}
              variant={selectedRange === r ? "hero" : "ghost"}
              size="sm"
              onClick={() => onRangeChange(r)}
              className="h-8 rounded-lg px-3 text-xs font-semibold"
            >
              {r === "24h" ? "24 Heures" : r === "7d" ? "7 Jours" : "30 Jours"}
            </Button>
          ))}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-4">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-muted/70 p-1 rounded-2xl">
          <TabsTrigger value="climate" className="rounded-xl text-xs gap-1.5 font-semibold py-2">
            <Thermometer className="size-3.5 text-primary" />
            Climat (T° & HR)
          </TabsTrigger>
          <TabsTrigger value="soil" className="rounded-xl text-xs gap-1.5 font-semibold py-2">
            <Droplets className="size-3.5 text-blue-500" />
            Humidité Sol
          </TabsTrigger>
          <TabsTrigger value="light" className="rounded-xl text-xs gap-1.5 font-semibold py-2">
            <Sun className="size-3.5 text-amber-500" />
            Luminosité
          </TabsTrigger>
          <TabsTrigger value="air" className="rounded-xl text-xs gap-1.5 font-semibold py-2">
            <Wind className="size-3.5 text-sky-500" />
            Qualité d'Air (PPM)
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Climate (Temperature & Humidity) */}
        <TabsContent value="climate">
          <Card className="border border-border bg-card shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base font-bold text-ink">
                Température (°C) et Humidité Relative (%)
              </CardTitle>
              <CardDescription className="text-xs">
                Dynamique micro-climatique de l'espace foliaire
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80 w-full">
                {isLoading ? (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    Chargement des courbes télémétriques...
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#168A45" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#168A45" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="oklch(0.9 0 0)"
                      />
                      <XAxis
                        dataKey="timeLabel"
                        stroke="#888888"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        yAxisId="left"
                        stroke="#168A45"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        unit="°C"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#0284c7"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        unit="%"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                          fontSize: "12px",
                        }}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="temperature"
                        name="Température (°C)"
                        stroke="#168A45"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#tempGrad)"
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="humidity"
                        name="Humidité (%)"
                        stroke="#0284c7"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#humGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Soil Moisture */}
        <TabsContent value="soil">
          <Card className="border border-border bg-card shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base font-bold text-ink">
                Humidité du Substrat Racinaire (%)
              </CardTitle>
              <CardDescription className="text-xs">
                Taux hydrique dans le bac de culture (déclenchement irrigation &lt; 35%)
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="soilGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0 0)" />
                    <XAxis
                      dataKey="timeLabel"
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#059669"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      domain={[0, 100]}
                      unit="%"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                      type="monotone"
                      dataKey="soilMoisture"
                      name="Humidité Sol (%)"
                      stroke="#059669"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#soilGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Light */}
        <TabsContent value="light">
          <Card className="border border-border bg-card shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base font-bold text-ink">
                Intensité Lumineuse (Lux)
              </CardTitle>
              <CardDescription className="text-xs">
                Photopériode et ensoleillement sous verrière
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="luxGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d97706" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0 0)" />
                    <XAxis
                      dataKey="timeLabel"
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#d97706"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      unit=" lx"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                      type="monotone"
                      dataKey="lux"
                      name="Luminosité (lux)"
                      stroke="#d97706"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#luxGrad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Air Quality */}
        <TabsContent value="air">
          <Card className="border border-border bg-card shadow-card">
            <CardHeader className="pb-2">
              <CardTitle className="font-display text-base font-bold text-ink">
                Concentration Gazeuse & CO2 (PPM)
              </CardTitle>
              <CardDescription className="text-xs">
                Qualité de l'air intérieur et taux de renouvellement
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.9 0 0)" />
                    <XAxis
                      dataKey="timeLabel"
                      stroke="#888888"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#0284c7"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      unit=" ppm"
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #e2e8f0",
                        fontSize: "12px",
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Line
                      type="monotone"
                      dataKey="airPpm"
                      name="Air / CO2 (ppm)"
                      stroke="#0284c7"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
