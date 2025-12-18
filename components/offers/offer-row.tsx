"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { OfferStatusBadge } from "@/components/offers/offer-status-badge";
import { formatDistanceToNow, format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NewBadge } from "@/components/ui/new-badge";
import { CompanyBadge } from "@/components/ui/company-badge";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";
import { useRouter } from "next/navigation";
import { cn, getDueDateColor, formatOfferNumber } from "@/lib/utils";

interface OfferRowProps {
  offer: DomainOfferDTO;
}

export function OfferRow({ offer }: OfferRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/offers/${offer.id}`);
  };

  const value = offer.value ?? 0;
  const cost = offer.cost ?? 0;
  const margin = value - cost;
  const marginRatio = value > 0 ? margin / value : 0;

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={handleRowClick}
    >
      <TableCell className="whitespace-nowrap font-mono text-sm text-muted-foreground">
        {formatOfferNumber(offer.offerNumber, offer.phase)}
      </TableCell>
      <TableCell className="font-medium">
        <div className="flex items-center gap-2">
          <span className="truncate">{offer.title}</span>
          <NewBadge createdAt={offer.createdAt} />
        </div>
      </TableCell>
      <TableCell className="max-w-[150px]">
        <span className="block truncate" title={offer.customerName ?? ""}>
          {offer.customerName}
        </span>
      </TableCell>
      <TableCell>
        <CompanyBadge companyId={offer.companyId} />
      </TableCell>
      <TableCell>
        <OfferStatusBadge phase={offer.phase || "draft"} />
      </TableCell>

      <TableCell className={cn("text-sm", getDueDateColor(offer.dueDate))}>
        {offer.dueDate
          ? new Date(offer.dueDate).toLocaleDateString("nb-NO")
          : "-"}
      </TableCell>
      <TableCell className="text-sm">
        {offer.sentDate
          ? new Date(offer.sentDate).toLocaleDateString("nb-NO")
          : "-"}
      </TableCell>
      <TableCell>
        {new Intl.NumberFormat("nb-NO", {
          style: "currency",
          currency: "NOK",
          maximumFractionDigits: 0,
        }).format(offer.value ?? 0)}
      </TableCell>
      <TableCell>
        <span
          className={cn(
            "font-medium",
            marginRatio < 0 ? "text-destructive" : "text-green-600"
          )}
        >
          {new Intl.NumberFormat("nb-NO", {
            style: "percent",
            maximumFractionDigits: 1,
          }).format(marginRatio)}
        </span>
      </TableCell>
      <TableCell>
        {offer.updatedAt ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help underline decoration-muted-foreground/30 decoration-dotted underline-offset-4">
                {formatDistanceToNow(new Date(offer.updatedAt), {
                  addSuffix: true,
                  locale: nb,
                })}
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {format(new Date(offer.updatedAt), "d. MMMM yyyy HH:mm", {
                locale: nb,
              })}
            </TooltipContent>
          </Tooltip>
        ) : (
          "-"
        )}
      </TableCell>
    </TableRow>
  );
}
