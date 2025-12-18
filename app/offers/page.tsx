"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useOffers } from "@/hooks/useOffers";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { OfferListTable } from "@/components/offers/offer-list-table";

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
  const [sortBy] = useState<string>("updatedAt");
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
    // Pass filters to API
    phase:
      phaseFilter === "all" || phaseFilter === "gruppen"
        ? undefined
        : (phaseFilter as any),
  });

  // Extract offers from paginated response
  const offers = useMemo<DomainOfferDTO[]>(() => {
    const list = [...(data?.data ?? [])];
    return list.sort((a, b) => {
      const dateA = new Date(a.updatedAt ?? 0).getTime();
      const dateB = new Date(b.updatedAt ?? 0).getTime();
      if (dateA !== dateB) return dateB - dateA;
      return (b.offerNumber ?? "").localeCompare(
        a.offerNumber ?? "",
        undefined,
        {
          numeric: true,
        }
      );
    });
  }, [data?.data]);

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // 0. Exclude Drafts - REMOVED to show drafts
      // if (offer.phase === DomainOfferPhase.OfferPhaseDraft) return false;

      // 1. Status Filter - Relaxed to debug missing offers
      // if (offer.status !== DomainOfferStatus.OfferStatusActive) return false;

      // 2. Phase Filter
      if (
        phaseFilter !== "all" &&
        phaseFilter !== "gruppen" &&
        offer.phase !== phaseFilter
      )
        return false;

      // 3. Company Filter
      if (
        companyFilter !== "all" &&
        companyFilter !== "gruppen" &&
        offer.companyId !== companyFilter
      )
        return false;

      // 4. Exclude Expired (unless toggled)
      if (!includeExpired) {
        // Check explicit "expired" phase (if backend sets it)
        if (offer.phase === "expired") return false;

        // NOTE: We previously filtered out offers past their due date here.
        // However, this caused "In Progress" offers to disappear if they were overdue,
        // which is confusing. We should show them (likely with red date) instead of hiding them.
      }

      return true;
    });
  }, [offers, phaseFilter, companyFilter, includeExpired]);

  return (
    <AppLayout disableScroll>
      <div className="flex h-full flex-col">
        {/* Fixed Header & Filters */}
        <div className="flex-none space-y-4 border-b bg-background px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Tilbud{" "}
                <span className="text-sm text-muted-foreground">
                  ({data?.total ?? 0})
                </span>
              </h1>
              <p className="text-muted-foreground">
                Oversikt over alle tilbud og deres status
              </p>
            </div>
            <AddOfferModal />
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Select
              value={companyFilter}
              onValueChange={(val) => {
                setCompanyFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[200px] bg-card">
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
            <Select
              value={phaseFilter}
              onValueChange={(val) => {
                setPhaseFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle faser</SelectItem>
                <SelectItem value={DomainOfferPhase.OfferPhaseInProgress}>
                  I gang
                </SelectItem>
                <SelectItem value={DomainOfferPhase.OfferPhaseSent}>
                  Sendt
                </SelectItem>
                <SelectItem value={DomainOfferPhase.OfferPhaseOrder}>
                  Ordre
                </SelectItem>
                <SelectItem value={DomainOfferPhase.OfferPhaseCompleted}>
                  Ferdig
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
                  setPage(1);
                }}
                className="px-2 lg:px-3"
              >
                Nullstill
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="space-y-6">
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
              <OfferListTable offers={filteredOffers} />
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
        </div>
      </div>
    </AppLayout>
  );
}
