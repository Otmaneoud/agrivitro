import { useState } from "react";
import { Fan, Droplets, Power, ShieldAlert, Cpu, CheckCircle2, RotateCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { sendActuatorCommand } from "@/lib/iot.functions";

interface ActuatorControlCardProps {
  fanStatus: number;
  fanManual: number;
  pumpStatus: number;
  pumpManual: number;
  isUnlocked: boolean;
  passkey: string | null;
  onRequestAuth: () => void;
  onCommandSent: () => void;
}

export function ActuatorControlCard({
  fanStatus,
  fanManual,
  pumpStatus,
  pumpManual,
  isUnlocked,
  passkey,
  onRequestAuth,
  onCommandSent,
}: ActuatorControlCardProps) {
  const [loadingActuator, setLoadingActuator] = useState<string | null>(null);
  const [pumpConfirmOpen, setPumpConfirmOpen] = useState(false);

  async function executeCommand(actuator: "fan" | "pump", action: "on" | "off" | "auto") {
    if (!isUnlocked) {
      toast.info(
        "Veuillez déverrouiller l'accès avec le mot de passe pour contrôler les actionneurs.",
      );
      onRequestAuth();
      return;
    }

    const key = `${actuator}-${action}`;
    setLoadingActuator(key);

    try {
      const res = await sendActuatorCommand({
        data: {
          actuator,
          action,
          passkey: passkey || undefined,
        },
      });

      if (res.ok) {
        toast.success(res.message);
        onCommandSent();
      } else {
        toast.error("Impossible d'exécuter la commande.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur de transmission réseau.";
      toast.error(msg);
    } finally {
      setLoadingActuator(null);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Fan Controller Card */}
        <Card className="relative overflow-hidden border border-border bg-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-11 items-center justify-center rounded-2xl transition-all ${
                  fanStatus === 1
                    ? "bg-emerald-500/15 text-emerald-600 shadow-xs"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Fan
                  className={`size-6 transition-transform ${
                    fanStatus === 1 ? "animate-spin [animation-duration:1s]" : ""
                  }`}
                />
              </div>
              <div>
                <CardTitle className="font-display text-base font-bold text-ink">
                  Ventilateur d'Extraction
                </CardTitle>
                <CardDescription className="text-xs">
                  Régulation thermique & renouvellement d'air
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <Badge
                variant="outline"
                className={`text-xs font-semibold ${
                  fanStatus === 1
                    ? "border-emerald-500/30 bg-emerald-50 text-emerald-700"
                    : "border-border bg-muted/60 text-muted-foreground"
                }`}
              >
                {fanStatus === 1 ? "EN ROTATION" : "ARRÊTÉ"}
              </Badge>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                {fanManual === 1 ? "Mode Manuel" : "Mode Auto (IA)"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              Le ventilateur permet d'évacuer l'excès de chaleur et d'humidité de la canopée vers
              l'extérieur.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                variant={fanStatus === 1 && fanManual === 1 ? "hero" : "outline"}
                size="sm"
                disabled={loadingActuator === "fan-on"}
                onClick={() => executeCommand("fan", "on")}
                className="w-full text-xs font-semibold"
              >
                <Power className="mr-1.5 size-3.5 text-emerald-500" />
                MARCHE
              </Button>

              <Button
                variant={fanStatus === 0 && fanManual === 1 ? "destructive" : "outline"}
                size="sm"
                disabled={loadingActuator === "fan-off"}
                onClick={() => executeCommand("fan", "off")}
                className="w-full text-xs font-semibold"
              >
                <Power className="mr-1.5 size-3.5 text-rose-500" />
                ARRÊT
              </Button>

              <Button
                variant={fanManual === 0 ? "secondary" : "outline"}
                size="sm"
                disabled={loadingActuator === "fan-auto"}
                onClick={() => executeCommand("fan", "auto")}
                className="w-full text-xs font-semibold"
              >
                <Cpu className="mr-1.5 size-3.5 text-primary" />
                AUTO
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pump Controller Card */}
        <Card className="relative overflow-hidden border border-border bg-card shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-3">
              <div
                className={`flex size-11 items-center justify-center rounded-2xl transition-all ${
                  pumpStatus === 1
                    ? "bg-blue-500/15 text-blue-600 shadow-xs"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <Droplets
                  className={`size-6 ${pumpStatus === 1 ? "animate-bounce text-blue-500" : ""}`}
                />
              </div>
              <div>
                <CardTitle className="font-display text-base font-bold text-ink">
                  Pompe d'Irrigation
                </CardTitle>
                <CardDescription className="text-xs">
                  Goutte-à-goutte & fertigation du substrat
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <Badge
                variant="outline"
                className={`text-xs font-semibold ${
                  pumpStatus === 1
                    ? "border-blue-500/30 bg-blue-50 text-blue-700"
                    : "border-border bg-muted/60 text-muted-foreground"
                }`}
              >
                {pumpStatus === 1 ? "EN IRRIGATION" : "EN VEILLE"}
              </Badge>
              <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider">
                {pumpManual === 1 ? "Mode Manuel" : "Mode Auto (Humidité)"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-2">
            <p className="text-xs text-muted-foreground">
              La pompe pilote l'apport en solution nutritive selon le seuil d'humidité racinaire
              configuré.
            </p>

            <div className="grid grid-cols-3 gap-2 pt-2">
              <Button
                variant={pumpStatus === 1 && pumpManual === 1 ? "hero" : "outline"}
                size="sm"
                disabled={loadingActuator === "pump-on"}
                onClick={() => {
                  if (!isUnlocked) {
                    executeCommand("pump", "on");
                  } else {
                    setPumpConfirmOpen(true);
                  }
                }}
                className="w-full text-xs font-semibold"
              >
                <Droplets className="mr-1.5 size-3.5 text-blue-500" />
                MARCHE
              </Button>

              <Button
                variant={pumpStatus === 0 && pumpManual === 1 ? "destructive" : "outline"}
                size="sm"
                disabled={loadingActuator === "pump-off"}
                onClick={() => executeCommand("pump", "off")}
                className="w-full text-xs font-semibold"
              >
                <Power className="mr-1.5 size-3.5 text-rose-500" />
                ARRÊT
              </Button>

              <Button
                variant={pumpManual === 0 ? "secondary" : "outline"}
                size="sm"
                disabled={loadingActuator === "pump-auto"}
                onClick={() => executeCommand("pump", "auto")}
                className="w-full text-xs font-semibold"
              >
                <Cpu className="mr-1.5 size-3.5 text-primary" />
                AUTO
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Confirmation Dialog for Manual Pump Irrigation */}
      <AlertDialog open={pumpConfirmOpen} onOpenChange={setPumpConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
              <ShieldAlert className="size-6" />
            </div>
            <AlertDialogTitle className="text-center font-display text-lg font-bold text-ink">
              Confirmer le Démarrage Manuel de l'Irrigation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm text-muted-foreground">
              Le démarrage forcé de la pompe d'irrigation injectera de l'eau dans le banc de
              culture. Assurez-vous que le drainage est dégagé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setPumpConfirmOpen(false);
                executeCommand("pump", "on");
              }}
              className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold"
            >
              Démarrer l'Irrigation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
