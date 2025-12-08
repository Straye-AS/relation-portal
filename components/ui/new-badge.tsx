import { Badge } from "@/components/ui/badge";

interface NewBadgeProps {
  createdAt?: string;
  thresholdMinutes?: number;
}

/**
 * Displays a "Ny" badge for items created within the last N minutes.
 * @param createdAt - ISO 8601 timestamp
 * @param thresholdMinutes - Minutes threshold (default: 1)
 */
export function NewBadge({ createdAt, thresholdMinutes = 1 }: NewBadgeProps) {
  if (!createdAt) return null;

  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const thresholdMs = thresholdMinutes * 60 * 1000;

  if (diffMs >= thresholdMs) return null;

  return (
    <Badge variant="default" className="ml-2 bg-green-500 hover:bg-green-600">
      Ny
    </Badge>
  );
}
