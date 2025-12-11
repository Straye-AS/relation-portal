"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useOffers } from "@/hooks/useOffers";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { OfferRow } from "@/components/offers/offer-row";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { DomainOfferPhase } from "@/lib/.generated/data-contracts";
import { AddOfferModal } from "@/components/offers/add-offer-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useMemo } from "react";

import { COMPANIES } from "@/lib/api/types";
import { PaginationControls } from "@/components/pagination-controls";

export default function OffersPage() {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Sort State
  const [sortBy] = useState<string>("updated_at");
  const [sortOrder] = useState<"asc" | "desc">("desc");

  // Filters State
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [includeExpired, setIncludeExpired] = useState(false);

  const { data, isLoading } = useOffers({
    page,
    pageSize,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any,
  });

  // Extract offers from paginated response
  const offers = useMemo<DomainOfferDTO[]>(
    () => data?.data ?? [],
    [data?.data]
  );

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // 0. Exclude Drafts - REMOVED to show drafts
      // if (offer.phase === DomainOfferPhase.OfferPhaseDraft) return false;

      // 1. Status Filter - Relaxed to debug missing offers
      // if (offer.status !== DomainOfferStatus.OfferStatusActive) return false;

      // 2. Phase Filter
      if (phaseFilter !== "all" && offer.phase !== phaseFilter) return false;

      // 3. Company Filter
      if (companyFilter !== "all" && offer.companyId !== companyFilter)
        return false;

      // 4. Exclude Expired (unless toggled)
      if (!includeExpired) {
        // Check explicit "expired" phase (if backend sets it)
        if (offer.phase === "expired") return false;

        // Check based on due date
        if (offer.dueDate) {
          const isExpired = new Date(offer.dueDate) < new Date();
          // If it's expired and NOT won/lost, hide it
          if (
            isExpired &&
            offer.phase !== DomainOfferPhase.OfferPhaseWon &&
            offer.phase !== DomainOfferPhase.OfferPhaseLost
          ) {
            return false;
          }
        }
      }

      return true;
    });
  }, [offers, phaseFilter, companyFilter, includeExpired]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tilbud</h1>
            <p className="text-muted-foreground">
              Administrer alle tilbud og deres status
            </p>
          </div>
          <AddOfferModal />
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selskap" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(COMPANIES).map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex items-center gap-2">
                    {company.id !== "all" && (
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: company.color }}
                      />
                    )}
                    <span>{company.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={phaseFilter} onValueChange={setPhaseFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Fase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle faser</SelectItem>
              <SelectItem value={DomainOfferPhase.OfferPhaseSent}>
                Sendt
              </SelectItem>
              <SelectItem value={DomainOfferPhase.OfferPhaseWon}>
                Vunnet
              </SelectItem>
              <SelectItem value={DomainOfferPhase.OfferPhaseLost}>
                Tapt
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-expired"
              checked={includeExpired}
              onCheckedChange={(checked) => setIncludeExpired(!!checked)}
            />
            <label
              htmlFor="include-expired"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Inkluder utgåtte
            </label>
          </div>

          {(companyFilter !== "all" ||
            phaseFilter !== "all" ||
            includeExpired) && (
            <Button
              variant="ghost"
              onClick={() => {
                setCompanyFilter("all");
                setPhaseFilter("all");
                setIncludeExpired(false);
              }}
              className="px-2 lg:px-3"
            >
              Nullstill
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>

        {isLoading ? (
          <TableSkeleton rows={10} columns={8} />
        ) : filteredOffers.length === 0 ? ( // Check filtered length for "No results"
          <div className="rounded-lg border bg-muted/20 py-12 text-center">
            {offers.length === 0 ? (
              <>
                <p className="text-muted-foreground">Ingen tilbud funnet</p>
                <div className="mt-4">
                  <AddOfferModal />
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">
                Ingen tilbud passer filtrene
              </p>
            )}
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nr.</TableHead>
                  <TableHead>Tittel</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Selskap</TableHead>
                  <TableHead>Fase</TableHead>
                  <TableHead>Frist</TableHead>
                  <TableHead>Verdi</TableHead>
                  <TableHead>Sannsynlighet</TableHead>
                  <TableHead>Oppdatert</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOffers.map((offer) => (
                  <OfferRow key={offer.id} offer={offer} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination info - Update to show filtered count */}
        {data && (
          <PaginationControls
            currentPage={page}
            totalPages={Math.ceil((data.total ?? 0) / pageSize)}
            onPageChange={setPage}
            pageSize={pageSize}
            totalCount={data.total ?? 0}
            entityName="tilbud"
          />
        )}
      </div>
    </AppLayout>
  );
}
