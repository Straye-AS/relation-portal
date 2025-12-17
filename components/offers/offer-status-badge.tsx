import { Badge } from "@/components/ui/badge";
import { OfferPhase, OFFER_PHASE_LABELS } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface OfferStatusBadgeProps {
  phase: OfferPhase | string; // Allow string to handle potential type mismatches from API
  className?: string;
}

export function OfferStatusBadge({ phase, className }: OfferStatusBadgeProps) {
  // Safe cast to OfferPhase if it matches, otherwise use as is or fallback
  const safePhase = phase as OfferPhase;

  const getVariantStyles = (p: string) => {
    switch (p) {
      case "order":
      case "won": // Legacy support: map "won" to "order" styling
        return "border-transparent bg-green-500/15 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case "completed":
        return "border-transparent bg-slate-500/15 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
      case "lost":
        return "border-transparent bg-red-500/15 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      case "sent":
        return "border-transparent bg-purple-500/15 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20";
      case "in_progress":
        return "border-transparent bg-blue-500/15 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "draft":
        return "border-transparent bg-zinc-500/15 text-zinc-700 border-zinc-200 dark:bg-zinc-500/10 dark:text-zinc-400 dark:border-zinc-500/20";
      case "expired":
        return "border-transparent bg-gray-500/15 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20";
      default:
        return "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80";
    }
  };

  const label = OFFER_PHASE_LABELS[safePhase] || phase;

  return (
    <Badge
      variant="outline"
      className={cn(
        "whitespace-nowrap border font-medium",
        getVariantStyles(phase),
        className
      )}
    >
      {label}
    </Badge>
  );
}
