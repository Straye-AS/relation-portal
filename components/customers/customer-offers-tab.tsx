"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { AddOfferModal } from "@/components/offers/add-offer-modal";
import { OfferListTable } from "@/components/offers/offer-list-table";
import { PaginationControls } from "@/components/pagination-controls";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useCustomerOffers } from "@/hooks/useCustomers";
import { DomainOfferPhase } from "@/lib/.generated/data-contracts";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";

interface CustomerOffersTabProps {
  customerId: string;
}

export function CustomerOffersTab({ customerId }: CustomerOffersTabProps) {
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [phaseFilter, setPhaseFilter] = useState<string>("all");

  const { data, isLoading } = useCustomerOffers(customerId, {
    page,
    pageSize,
    sortBy: "updatedAt" as any,
    sortOrder: "desc" as any,
    phase: phaseFilter === "all" ? undefined : (phaseFilter as any),
  });

  const offers = useMemo(() => {
    const list = [...((data?.data ?? []) as DomainOfferDTO[])];
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
      if (phaseFilter !== "all" && offer.phase !== phaseFilter) return false;
      return true;
    });
  }, [offers, phaseFilter]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Tilbud</CardTitle>
          <CardDescription>
            Oversikt over alle tilbud gitt til kunden
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={phaseFilter}
            onValueChange={(val) => {
              setPhaseFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px]">
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

          {phaseFilter !== "all" && (
            <Button
              variant="ghost"
              onClick={() => {
                setPhaseFilter("all");
                setPage(1);
              }}
              className="px-2 lg:px-3"
            >
              Nullstill
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}

          <AddOfferModal
            defaultCustomerId={customerId}
            lockedCustomerId={customerId}
            showCustomerWarning={false}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton rows={5} columns={8} />
        ) : filteredOffers.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {phaseFilter !== "all"
              ? "Ingen tilbud med valgt filter."
              : "Ingen tilbud registrert."}
          </div>
        ) : (
          <div className="space-y-6">
            <OfferListTable offers={filteredOffers} />
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
        )}
      </CardContent>
    </Card>
  );
}
