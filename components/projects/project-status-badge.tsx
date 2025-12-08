import { Badge } from "@/components/ui/badge";
import { ProjectStatus, PROJECT_STATUS_LABELS } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface ProjectStatusBadgeProps {
  status: ProjectStatus | string;
  className?: string;
}

export function ProjectStatusBadge({
  status,
  className,
}: ProjectStatusBadgeProps) {
  const safeStatus = status as ProjectStatus;

  const getVariantStyles = (s: string) => {
    switch (s) {
      case "active":
        return "border-transparent bg-green-500/15 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case "planning":
        return "border-transparent bg-blue-500/15 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "on_hold":
        return "border-transparent bg-amber-500/15 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
      case "completed":
        return "border-transparent bg-slate-500/15 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
      case "cancelled":
        return "border-transparent bg-red-500/15 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      default:
        return "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80";
    }
  };

  const label = PROJECT_STATUS_LABELS[safeStatus] || status;

  return (
    <Badge
      variant="outline"
      className={cn("border font-medium", getVariantStyles(status), className)}
    >
      {label}
    </Badge>
  );
}
