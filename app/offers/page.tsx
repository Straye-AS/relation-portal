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
import { X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  DomainOfferPhase,
  DomainOfferStatus,
} from "@/lib/.generated/data-contracts";
import { AddOfferModal } from "@/components/offers/add-offer-modal";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

import { COMPANIES } from "@/lib/api/types";

type SortDirection = "asc" | "desc" | null;

interface SortConfig {
  key: keyof DomainOfferDTO | "customerName" | "responsibleUserName";
  direction: SortDirection;
}

export default function OffersPage() {
  const { data, isLoading } = useOffers();
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Filter States
  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  // Extract offers from paginated response
  const offers = useMemo<DomainOfferDTO[]>(
    () => data?.data ?? [],
    [data?.data]
  );

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // 0. Exclude Drafts (Drafts are treated as requests/inquiries)
      if (offer.phase === DomainOfferPhase.OfferPhaseDraft) return false;

      // 1. Status Filter (Always show Active only)
      if (offer.status !== DomainOfferStatus.OfferStatusActive) return false;

      // 2. Phase Filter
      if (phaseFilter !== "all" && offer.phase !== phaseFilter) return false;

      // 3. Company Filter
      if (companyFilter !== "all" && offer.companyId !== companyFilter)
        return false;

      return true;
    });
  }, [offers, phaseFilter, companyFilter]);

  const sortedOffers = useMemo(() => {
    // Sort the FILTERED list
    const sorted = [...filteredOffers];

    // Default Sort: UpdatedAt (Desc)
    if (!sortConfig) {
      return sorted.sort((a, b) => {
        const dateA = new Date(a.updatedAt ?? 0).getTime();
        const dateB = new Date(b.updatedAt ?? 0).getTime();
        return dateB - dateA;
      });
    }

    // Active Sort
    return sorted.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      // Handle nulls always at bottom
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Compare
      let result = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        result = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        result = aValue - bValue;
      } else {
        // Fallback
        result = aValue < bValue ? -1 : 1;
      }

      return sortConfig.direction === "asc" ? result : -result;
    });
  }, [filteredOffers, sortConfig]);

  const handleSort = (key: SortConfig["key"]) => {
    setSortConfig((current) => {
      // If clicking same key: Cycle asc -> desc -> null
      if (current?.key === key) {
        if (current.direction === "asc") return { key, direction: "desc" };
        if (current.direction === "desc") return null;
      }
      // If clicking new key: Start asc
      return { key, direction: "asc" };
    });
  };

  const SortHeader = ({
    label,
    sortKey,
    align = "left",
  }: {
    label: string;
    sortKey: SortConfig["key"];
    align?: "left" | "right";
  }) => {
    const isSorted = sortConfig?.key === sortKey;
    const Icon = isSorted
      ? sortConfig.direction === "asc"
        ? ArrowUp
        : ArrowDown
      : ArrowUpDown;

    return (
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "-ml-3 h-8 data-[state=open]:bg-accent",
          align === "right" && "-mr-3 ml-auto"
        )}
        onClick={() => handleSort(sortKey)}
      >
        <span>{label}</span>
        <Icon className={cn("ml-2 h-4 w-4", !isSorted && "opacity-30")} />
      </Button>
    );
  };

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
          {(companyFilter !== "all" || phaseFilter !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setCompanyFilter("all");
                setPhaseFilter("all");
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
                  <TableHead>
                    <SortHeader label="Tittel" sortKey="title" />
                  </TableHead>
                  <TableHead>
                    <SortHeader label="Kunde" sortKey="customerName" />
                  </TableHead>
                  <TableHead>Selskap</TableHead>
                  <TableHead>
                    <SortHeader label="Fase" sortKey="phase" />
                  </TableHead>
                  <TableHead>
                    <SortHeader label="Frist" sortKey="dueDate" />
                  </TableHead>
                  <TableHead>
                    <SortHeader label="Verdi" sortKey="value" />
                  </TableHead>
                  <TableHead>
                    <SortHeader label="Sannsynlighet" sortKey="probability" />
                  </TableHead>
                  <TableHead>
                    <SortHeader label="Oppdatert" sortKey="updatedAt" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOffers.map((offer) => (
                  <OfferRow key={offer.id} offer={offer} />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination info - Update to show filtered count */}
        {data && (
          <div className="text-center text-sm text-muted-foreground">
            Viser {filteredOffers.length} av {data.total ?? offers.length}{" "}
            tilbud
          </div>
        )}
      </div>
    </AppLayout>
  );
}
