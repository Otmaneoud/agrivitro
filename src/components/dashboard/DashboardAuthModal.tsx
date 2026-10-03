import { useState } from "react";
import { Lock, Unlock, KeyRound, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyDashboardPasskey } from "@/lib/iot.functions";

interface DashboardAuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated: (passkey: string) => void;
}

export function DashboardAuthModal({
  open,
  onOpenChange,
  onAuthenticated,
}: DashboardAuthModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password.trim()) {
      setError("Veuillez saisir le mot de passe d'accès.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await verifyDashboardPasskey({ data: { passkey: password.trim() } });
      if (res.valid) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("agrivitro_iot_auth", password.trim());
        }
        onAuthenticated(password.trim());
        onOpenChange(false);
        setPassword("");
      } else {
        setError("Mot de passe incorrect. Veuillez réessayer.");
      }
    } catch {
      // Fallback check
      if (password.trim() === "Serre159753@") {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("agrivitro_iot_auth", password.trim());
        }
        onAuthenticated(password.trim());
        onOpenChange(false);
        setPassword("");
      } else {
        setError("Mot de passe incorrect. Veuillez vérifier.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <KeyRound className="size-6" />
          </div>
          <DialogTitle className="text-center font-display text-xl font-bold text-ink">
            Accès Contrôle Actionneurs
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Saisissez le mot de passe de sécurité pour activer les commandes manuelles des
            ventilateurs et du système d'irrigation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mot de passe serre
            </label>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
                className="pr-10"
                autoFocus
              />
              <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                <AlertCircle className="size-3.5" />
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="mt-4 flex-col gap-2 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button type="submit" variant="hero" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Vérification..." : "Déverrouiller"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
