import { RefreshCw, Lock, Unlock, Radio, MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  lastUpdated: string | null;
  isFetching: boolean;
  onRefresh: () => void;
  isUnlocked: boolean;
  onToggleAuthModal: () => void;
  onLock: () => void;
}

export function DashboardHeader({
  lastUpdated,
  isFetching,
  onRefresh,
  isUnlocked,
  onToggleAuthModal,
  onLock,
}: DashboardHeaderProps) {
  const formattedTime = lastUpdated
    ? new Date(lastUpdated).toLocaleString("fr-FR", {
        timeZone: "Africa/Casablanca",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "Synchronisation...";

  return (
    <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2.5">
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary-dark font-medium gap-1.5 px-2.5 py-1 text-xs"
          >
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
            </span>
            Station Active · Fès (GH-01)
          </Badge>
          <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5 text-primary" />
            Bancale Serre Expérimentale
          </span>
        </div>

        <h1 className="font-display text-2xl font-black tracking-tight text-ink sm:text-3xl">
          Tableau de Bord Télémétrique & Contrôle
        </h1>
        <p className="flex items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <Clock className="size-3.5 text-primary" />
          <span>Dernière mesure capteur :</span>
          <strong className="font-medium text-foreground">{formattedTime}</strong>
          <span className="text-[11px] text-muted-foreground">(GMT+1 Fès)</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pt-2 sm:pt-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isFetching}
          className="gap-2 rounded-xl border-border bg-background shadow-xs hover:bg-muted"
        >
          <RefreshCw
            className={`size-3.5 ${isFetching ? "animate-spin text-primary" : "text-muted-foreground"}`}
          />
          <span className="text-xs font-medium">
            {isFetching ? "Actualisation..." : "Rafraîchir"}
          </span>
        </Button>

        {isUnlocked ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onLock}
            className="gap-2 rounded-xl border-emerald-500/30 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 shadow-xs"
          >
            <Unlock className="size-3.5 text-emerald-600" />
            <span className="text-xs font-semibold">Commandes Déverrouillées</span>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleAuthModal}
            className="gap-2 rounded-xl border-amber-500/30 bg-amber-50/70 text-amber-900 hover:bg-amber-100/80 shadow-xs"
          >
            <Lock className="size-3.5 text-amber-600" />
            <span className="text-xs font-medium">Déverrouiller Actionneurs</span>
          </Button>
        )}
      </div>
    </div>
  );
}
