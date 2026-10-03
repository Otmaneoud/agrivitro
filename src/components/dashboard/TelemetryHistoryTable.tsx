import { Download, Table as TableIcon, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { RecentReadingRecord } from "@/lib/iot-types";
import { toast } from "sonner";

interface TelemetryHistoryTableProps {
  readings: RecentReadingRecord[];
  isLoading: boolean;
}

export function TelemetryHistoryTable({ readings, isLoading }: TelemetryHistoryTableProps) {
  function exportCSV() {
    if (!readings || readings.length === 0) {
      toast.error("Aucune donnée disponible à exporter.");
      return;
    }

    // Semicolon-delimited CSV with UTF-8 BOM for French/European Excel compatibility
    const headers = [
      "Date & Heure",
      "Timestamp ISO",
      "Temperature (°C)",
      "Humidite (%)",
      "Humidite Sol (%)",
      "Luminosite (lux)",
      "Air PPM",
      "Ventilateur",
      "Pompe",
    ];

    const rows = readings.map((r) => [
      `"${r.timeFormatted}"`,
      `"${r.time}"`,
      r.temperature.toFixed(1).replace(".", ","),
      r.humidity.toFixed(1).replace(".", ","),
      r.soilMoisture.toFixed(1).replace(".", ","),
      r.lux.toFixed(1).replace(".", ","),
      r.airPpm.toString(),
      r.fanStatus === 1 ? "MARCHE" : "ARRET",
      r.pumpStatus === 1 ? "IRRIGATION" : "VEILLE",
    ]);

    const csvContent =
      "\uFEFF" + headers.join(";") + "\n" + rows.map((row) => row.join(";")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    link.setAttribute("href", url);
    link.setAttribute("download", `agrivitro-telemetrie-serre-fes-${today}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success("Fichier CSV généré et téléchargé avec succès.");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">Journal des Enregistrements</h2>
          <p className="text-xs text-muted-foreground">
            Dernières 40 mesures brutes collectées par la station météo et sol.
          </p>
        </div>

        <Button
          variant="hero"
          size="sm"
          onClick={exportCSV}
          disabled={isLoading || readings.length === 0}
          className="gap-2 rounded-xl text-xs font-semibold"
        >
          <Download className="size-3.5" />
          Exporter CSV (Excel)
        </Button>
      </div>

      <Card className="overflow-hidden border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/50 font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3.5">Horodatage (Casablanca)</th>
                <th className="px-3 py-3.5 text-right">Temp. (°C)</th>
                <th className="px-3 py-3.5 text-right">Humidité (%)</th>
                <th className="px-3 py-3.5 text-right">Sol (%)</th>
                <th className="px-3 py-3.5 text-right">Lumière (lux)</th>
                <th className="px-3 py-3.5 text-right">Air (ppm)</th>
                <th className="px-3 py-3.5 text-center">Ventilateur</th>
                <th className="px-4 py-3.5 text-center">Pompe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    Chargement des journaux de télémétrie...
                  </td>
                </tr>
              ) : readings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    Aucun enregistrement trouvé.
                  </td>
                </tr>
              ) : (
                readings.map((r, i) => (
                  <tr key={r.time + i} className="transition-colors hover:bg-muted/40 font-medium">
                    <td className="px-4 py-2.5 font-mono text-[11px] text-ink">
                      {r.timeFormatted}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-700">
                      {r.temperature.toFixed(1)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-sky-700">
                      {r.humidity.toFixed(1)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-teal-700">
                      {r.soilMoisture.toFixed(1)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-amber-700">
                      {r.lux.toFixed(1)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-ink">{r.airPpm}</td>
                    <td className="px-3 py-2.5 text-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0.5 font-bold ${
                          r.fanStatus === 1
                            ? "border-emerald-500/30 bg-emerald-50 text-emerald-700"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {r.fanStatus === 1 ? "ON" : "OFF"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0.5 font-bold ${
                          r.pumpStatus === 1
                            ? "border-blue-500/30 bg-blue-50 text-blue-700"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {r.pumpStatus === 1 ? "IRRIG" : "VEILLE"}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
