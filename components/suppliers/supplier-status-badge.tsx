import { Badge } from "@/components/ui/badge";
import { SupplierStatus, SUPPLIER_STATUS_LABELS } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface SupplierStatusBadgeProps {
  status: SupplierStatus | string;
  className?: string;
}

export function SupplierStatusBadge({
  status,
  className,
}: SupplierStatusBadgeProps) {
  const safeStatus = status as SupplierStatus;

  const getVariantStyles = (s: string) => {
    switch (s) {
      case "active":
        return "border-transparent bg-green-500/15 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      case "inactive":
        return "border-transparent bg-slate-500/15 text-slate-700 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20";
      case "pending":
        return "border-transparent bg-yellow-500/15 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20";
      case "blacklisted":
        return "border-transparent bg-red-500/15 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      default:
        return "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80";
    }
  };

  const label = SUPPLIER_STATUS_LABELS[safeStatus] || status;

  return (
    <Badge
      variant="outline"
      className={cn("border font-medium", getVariantStyles(status), className)}
    >
      {label}
    </Badge>
  );
}
