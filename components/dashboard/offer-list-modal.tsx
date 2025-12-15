"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { DomainOfferDTO } from "@/lib/.generated/data-contracts";
import { OfferStatusBadge } from "@/components/offers/offer-status-badge";
import { PaginationControls } from "@/components/pagination-controls";
import { NewBadge } from "@/components/ui/new-badge";
import { CompanyBadge } from "@/components/ui/company-badge";
import { cn, getDueDateColor } from "@/lib/utils";

interface OfferListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  offers: DomainOfferDTO[];
  page: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  pageSize: number;
  phase?: string;
}

export function OfferListModal({
  isOpen,
  onClose,
  title,
  offers,
  page,
  onPageChange,
  totalCount,
  pageSize,
  phase,
}: OfferListModalProps) {
  const router = useRouter();

  const bestOffersByProject = new Map<string, number>();

  offers.forEach((offer) => {
    if (offer.projectId) {
      const currentBest = bestOffersByProject.get(offer.projectId) || 0;
      if ((offer.value || 0) > currentBest) {
        bestOffersByProject.set(offer.projectId, offer.value || 0);
      }
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] max-w-7xl flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Tilbud {phase ? <OfferStatusBadge phase={phase} /> : `- ${title}`}
          </DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nr.</TableHead>
                <TableHead>Tittel</TableHead>
                <TableHead>Prosjekt</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Selskap</TableHead>
                <TableHead>Fase</TableHead>
                <TableHead>Frist</TableHead>
                <TableHead>Verdi</TableHead>
                <TableHead>DG</TableHead>
                <TableHead>Oppdatert</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Ingen tilbud i denne fasen
                  </TableCell>
                </TableRow>
              ) : (
                offers.map((offer) => {
                  const isNotBest =
                    offer.projectId &&
                    (offer.value || 0) <
                      (bestOffersByProject.get(offer.projectId) || 0);

                  const value = offer.value ?? 0;
                  const cost = offer.cost ?? 0;
                  const margin = value - cost;
                  const marginRatio = value > 0 ? margin / value : 0;

                  return (
                    <TableRow
                      key={offer.id}
                      className={`cursor-pointer hover:bg-muted/50 ${
                        isNotBest ? "bg-orange-50 dark:bg-orange-950/20" : ""
                      }`}
                      onClick={() => {
                        router.push(`/offers/${offer.id}`);
                        onClose();
                      }}
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
                      <TableCell>{offer.projectName || "-"}</TableCell>
                      <TableCell className="max-w-[150px]">
                        <span
                          className="block truncate"
                          title={offer.customerName ?? ""}
                        >
                          {offer.customerName}
                        </span>
                      </TableCell>
                      <TableCell>
                        <CompanyBadge companyId={offer.companyId} />
                      </TableCell>
                      <TableCell>
                        <OfferStatusBadge phase={offer.phase || "draft"} />
                      </TableCell>
                      <TableCell
                        className={cn(
                          "text-sm",
                          getDueDateColor(offer.dueDate)
                        )}
                      >
                        {offer.dueDate
                          ? new Date(offer.dueDate).toLocaleDateString("nb-NO")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("nb-NO", {
                          style: "currency",
                          currency: "NOK",
                          maximumFractionDigits: 0,
                        }).format(value)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "font-medium",
                            marginRatio < 0
                              ? "text-destructive"
                              : "text-green-600"
                          )}
                        >
                          {new Intl.NumberFormat("nb-NO", {
                            style: "percent",
                            maximumFractionDigits: 1,
                          }).format(marginRatio)}
                        </span>
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
                })
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4">
          <PaginationControls
            currentPage={page}
            totalPages={Math.ceil(totalCount / pageSize)}
            onPageChange={onPageChange}
            pageSize={pageSize}
            totalCount={totalCount}
            entityName="tilbud"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
