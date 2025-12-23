import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type OfferHealth = "on_track" | "at_risk" | "delayed" | "over_budget";

interface OfferHealthBadgeProps {
  health: OfferHealth | string;
  className?: string;
}

const HEALTH_LABELS: Record<OfferHealth, string> = {
  on_track: "På sporet",
  at_risk: "Underfakturert",
  delayed: "Forsinket",
  over_budget: "Over budsjett",
};

const HEALTH_COLORS: Record<OfferHealth, string> = {
  on_track:
    "border-transparent bg-green-500/15 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20",
  at_risk:
    "border-transparent bg-yellow-500/15 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20",
  delayed:
    "border-transparent bg-orange-500/15 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20",
  over_budget:
    "border-transparent bg-red-500/15 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
};

export function OfferHealthBadge({ health, className }: OfferHealthBadgeProps) {
  const safeHealth = health as OfferHealth;
  const label = HEALTH_LABELS[safeHealth] || health;
  const colorClass =
    HEALTH_COLORS[safeHealth] ||
    "border-transparent bg-secondary text-secondary-foreground";

  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap border font-medium",
        colorClass,
        className
      )}
    >
      {label}
    </Badge>
  );
}
