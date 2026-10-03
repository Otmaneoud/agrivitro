import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SensorCardProps {
  title: string;
  value: number | string;
  unit: string;
  subtitle: string;
  icon: LucideIcon;
  idealRange: string;
  status: "optimal" | "warning" | "alert" | "neutral";
  statusText: string;
  progressPercent?: number;
  accentColor?: string;
}

export function SensorCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  idealRange,
  status,
  statusText,
  progressPercent,
  accentColor = "text-primary",
}: SensorCardProps) {
  const statusStyles = {
    optimal: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    warning: "border-amber-500/20 bg-amber-500/10 text-amber-700",
    alert: "border-rose-500/20 bg-rose-500/10 text-rose-700",
    neutral: "border-border bg-muted/60 text-muted-foreground",
  }[status];

  return (
    <Card className="overflow-hidden border border-border bg-card shadow-card transition-all hover:shadow-lift">
      <CardContent className="p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex size-10 items-center justify-center rounded-xl bg-muted ${accentColor}`}
            >
              <Icon className="size-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-ink">{title}</h3>
              <p className="text-[11px] text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <Badge variant="outline" className={`text-[11px] font-semibold ${statusStyles}`}>
            {statusText}
          </Badge>
        </div>

        <div className="mt-4 flex items-baseline gap-1.5">
          <span className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            {value}
          </span>
          <span className="text-sm font-semibold text-muted-foreground">{unit}</span>
        </div>

        {progressPercent !== undefined && (
          <div className="mt-3 space-y-1">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5 text-[11px] text-muted-foreground">
          <span>Plage optimale :</span>
          <span className="font-medium text-foreground">{idealRange}</span>
        </div>
      </CardContent>
    </Card>
  );
}
