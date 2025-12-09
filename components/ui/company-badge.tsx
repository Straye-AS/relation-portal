import { Badge } from "@/components/ui/badge";
import { COMPANIES, CompanyId } from "@/lib/api/types";
import { cn } from "@/lib/utils";

interface CompanyBadgeProps {
  companyId?: CompanyId | string;
  className?: string;
  variant?: "default" | "secondary" | "outline";
}

export function CompanyBadge({
  companyId,
  className,
  variant = "secondary",
}: CompanyBadgeProps) {
  if (!companyId) return null;

  // Handle string input safely by casting and checking
  const company = COMPANIES[companyId as CompanyId];

  if (!company) return null;

  // We can use the company specific color or just simple styling for now.
  // The user asked to show "what company its meant for".
  // Let's use a colored dot + name.

  return (
    <Badge
      variant={variant}
      className={cn("gap-1.5 font-normal", className)}
      style={{
        backgroundColor: `${company.color}15`, // 10% opacity background
        color: company.color,
        borderColor: `${company.color}40`, // 25% opacity border
      }}
    >
      <div
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: company.color }}
      />
      {company.shortName}
    </Badge>
  );
}
