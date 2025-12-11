"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { OfferStatusBadge } from "@/components/offers/offer-status-badge";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { NewBadge } from "@/components/ui/new-badge";
import { CompanyBadge } from "@/components/ui/company-badge";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";
import { useRouter } from "next/navigation";
import { cn, getDueDateColor } from "@/lib/utils";

interface OfferRowProps {
  offer: DomainOfferDTO;
}

export function OfferRow({ offer }: OfferRowProps) {
  const router = useRouter();

  const handleRowClick = () => {
    router.push(`/offers/${offer.id}`);
  };

  return (
    <TableRow
      className="cursor-pointer hover:bg-muted/50"
      onClick={handleRowClick}
    >
      <TableCell className="whitespace-nowrap font-mono text-sm text-muted-foreground">
        {offer.offerNumber || "-"}
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
      <TableCell>
        {new Intl.NumberFormat("nb-NO", {
          style: "currency",
          currency: "NOK",
          maximumFractionDigits: 0,
        }).format(offer.value ?? 0)}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="h-2 w-full max-w-[100px] rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${offer.probability ?? 0}%` }}
            />
          </div>
          <span className="w-[40px] text-right text-sm">
            {offer.probability ?? 0}%
          </span>
        </div>
      </TableCell>
      <TableCell>
        {offer.updatedAt
          ? formatDistanceToNow(new Date(offer.updatedAt), {
              addSuffix: true,
              locale: nb,
            })
          : "-"}
      </TableCell>
    </TableRow>
  );
}
