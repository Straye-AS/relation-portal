"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OfferRow } from "@/components/offers/offer-row";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";

interface OfferListTableProps {
  offers: DomainOfferDTO[];
}

export function OfferListTable({ offers }: OfferListTableProps) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nr.</TableHead>
            <TableHead>Tittel</TableHead>
            <TableHead>Kunde</TableHead>
            <TableHead>Selskap</TableHead>
            <TableHead>Fase</TableHead>
            <TableHead>Frist</TableHead>
            <TableHead>Sendt</TableHead>
            <TableHead>Verdi</TableHead>
            <TableHead>DG</TableHead>
            <TableHead>Oppdatert</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => (
            <OfferRow key={offer.id} offer={offer} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
