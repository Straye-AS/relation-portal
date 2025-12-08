"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useOffers } from "@/hooks/useOffers";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { OfferStatusBadge } from "@/components/offers/offer-status-badge";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { DomainOfferPhase } from "@/lib/.generated/data-contracts";
import { AddOfferModal } from "@/components/offers/add-offer-modal";
import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DomainOfferStatus } from "@/lib/.generated/data-contracts";
import { NewBadge } from "@/components/ui/new-badge";
import { useRouter } from "next/navigation";

type SortDirection = "asc" | "desc" | null;

interface SortConfig {
  key: keyof DomainOfferDTO | "customerName" | "responsibleUserName";
  direction: SortDirection;
}

export default function OffersPage() {
  const router = useRouter();
  const { data, isLoading } = useOffers();
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [phaseFilter, setPhaseFilter] = useState<string>("all");

  // Extract offers from paginated response
  const offers = useMemo<DomainOfferDTO[]>(
    () => data?.data ?? [],
    [data?.data]
  );

  const filteredOffers = useMemo(() => {
    return offers.filter((offer) => {
      // 1. Status Filter
      if (statusFilter !== "all" && offer.status !== statusFilter) return false;

      // 2. Phase Filter
      if (phaseFilter !== "all" && offer.phase !== phaseFilter) return false;

      // 3. Search Filter (Title or Customer Name)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = offer.title?.toLowerCase().includes(query);
        const customerMatch = offer.customerName?.toLowerCase().includes(query);
        if (!titleMatch && !customerMatch) return false;
      }

      return true;
    });
  }, [offers, statusFilter, phaseFilter, searchQuery]);

  const sortedOffers = useMemo(() => {
    // Sort the FILTERED list
    const sorted = [...filteredOffers];

    // Default Sort: Status (Active first) -> UpdatedAt (Desc)
    if (!sortConfig) {
      return sorted.sort((a, b) => {
        // Priority 1: Active status first
        const isActiveA = a.status === DomainOfferStatus.OfferStatusActive;
        const isActiveB = b.status === DomainOfferStatus.OfferStatusActive;
        if (isActiveA && !isActiveB) return -1;
        if (!isActiveA && isActiveB) return 1;

        // Priority 2: UpdatedAt Desc (Newest first)
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
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Søk etter tittel eller kunde..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle statuser</SelectItem>
              <SelectItem value={DomainOfferStatus.OfferStatusActive}>
                Aktiv
              </SelectItem>
              <SelectItem value={DomainOfferStatus.OfferStatusInactive}>
                Inaktiv
              </SelectItem>
              <SelectItem value={DomainOfferStatus.OfferStatusArchived}>
                Arkivert
              </SelectItem>
            </SelectContent>
          </Select>
          <Select value={phaseFilter} onValueChange={setPhaseFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Fase" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle faser</SelectItem>
              <SelectItem value={DomainOfferPhase.OfferPhaseDraft}>
                Utkast
              </SelectItem>
              <SelectItem value={DomainOfferPhase.OfferPhaseSent}>
                Sendt
              </SelectItem>
              <SelectItem value={DomainOfferPhase.OfferPhaseWon}>
                Vunnet
              </SelectItem>
              <SelectItem value={DomainOfferPhase.OfferPhaseLost}>
                Tapt
              </SelectItem>
              <SelectItem value={DomainOfferPhase.OfferPhaseExpired}>
                Utløpt
              </SelectItem>
            </SelectContent>
          </Select>
          {(searchQuery || statusFilter !== "all" || phaseFilter !== "all") && (
            <Button
              variant="ghost"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
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
          <TableSkeleton rows={10} columns={6} />
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
                  <TableHead>
                    <SortHeader label="Fase" sortKey="phase" />
                  </TableHead>
                  <TableHead>
                    <SortHeader label="Verdi" sortKey="value" />
                  </TableHead>
                  <TableHead>
                    <SortHeader label="Sannsynlighet" sortKey="probability" />
                  </TableHead>
                  <TableHead>
                    <SortHeader
                      label="Ansvarlig"
                      sortKey="responsibleUserName"
                    />
                  </TableHead>
                  <TableHead>
                    <SortHeader label="Oppdatert" sortKey="updatedAt" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedOffers.map((offer) => (
                  <TableRow
                    key={offer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/offers/${offer.id}`)}
                  >
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
