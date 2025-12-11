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
import { NewBadge } from "@/components/ui/new-badge";

interface OfferListModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  offers: DomainOfferDTO[];
}

export function OfferListModal({
  isOpen,
  onClose,
  title,
  offers,
}: OfferListModalProps) {
  const router = useRouter();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] max-w-7xl flex-col">
        <DialogHeader>
          <DialogTitle>Tilbud - {title}</DialogTitle>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nr.</TableHead>
                <TableHead>Tittel</TableHead>
                <TableHead>Kunde</TableHead>
                <TableHead>Fase</TableHead>
                <TableHead>Verdi</TableHead>
                <TableHead>Sannsynlighet</TableHead>
                <TableHead>Ansvarlig</TableHead>
                <TableHead>Oppdatert</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Ingen tilbud i denne fasen
                  </TableCell>
                </TableRow>
              ) : (
                offers.map((offer) => (
                  <TableRow
                    key={offer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      router.push(`/offers/${offer.id}`);
                      onClose();
                    }}
                  >
                    <TableCell className="whitespace-nowrap font-mono text-sm text-muted-foreground">
                      {offer.offerNumber || "-"}
                    </TableCell>
                    <TableCell className="font-medium">
                      {offer.title}
                      <NewBadge createdAt={offer.createdAt} />
                    </TableCell>
                    <TableCell>{offer.customerName}</TableCell>
                    <TableCell>
                      <OfferStatusBadge phase={offer.phase || "draft"} />
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
                        <span className="text-sm">
                          {offer.probability ?? 0}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{offer.responsibleUserName ?? "-"}</TableCell>
                    <TableCell>
                      {offer.updatedAt
                        ? formatDistanceToNow(new Date(offer.updatedAt), {
                            addSuffix: true,
                            locale: nb,
                          })
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
