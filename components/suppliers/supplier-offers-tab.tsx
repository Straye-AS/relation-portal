"use client";

import { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { OfferListTable } from "@/components/offers/offer-list-table";
import { PaginationControls } from "@/components/pagination-controls";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { useSupplierOffers } from "@/hooks/useSuppliers";
import { DomainOfferPhase } from "@/lib/.generated/data-contracts";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";

interface SupplierOffersTabProps {
  supplierId: string;
}

export function SupplierOffersTab({ supplierId }: SupplierOffersTabProps) {
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const [phaseFilter, setPhaseFilter] = useState<string>("all");

  const { data, isLoading } = useSupplierOffers(supplierId, {
    page,
    pageSize,
    sortBy: "updatedAt",
    sortOrder: "desc",
    phase: phaseFilter === "all" ? undefined : phaseFilter,
  });
  const offers = useMemo(() => {
    // Check if data is the array itself or if it's in a property named 'data'
    const rawData = Array.isArray(data) ? data : (data?.data ?? []);

    // Map raw API response (potentially snake_case) to DomainOfferDTO (camelCase)
    // to ensure compatibility with OfferListTable/OfferRow.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return rawData.map((item: any) => ({
      id: item.id,
      title: item.title,
      offerNumber: item.offerNumber ?? item.offer_number,
      customerName: item.customerName ?? item.customer_name,
      companyId: item.companyId ?? item.company_id,
      phase: item.phase,
      dueDate: item.dueDate ?? item.due_date,
      sentDate: item.sentDate ?? item.sent_date,
      value: item.value,
      cost: item.cost,
      updatedAt: item.updatedAt ?? item.updated_at,
      createdAt: item.createdAt ?? item.created_at,
      externalReference: item.externalReference ?? item.external_reference,
      status: item.status,
      // Include any other fields expected by OfferRow or DomainOfferDTO
      description: item.description,
      projectId: item.projectId ?? item.project_id,
      customerId: item.customerId ?? item.customer_id,
      margin: item.margin,
      marginPercent: item.marginPercent ?? item.margin_percent,
    })) as DomainOfferDTO[];
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Tilbud</CardTitle>
          <CardDescription>
            Tilbud hvor denne leverandøren er involvert
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
                I arbeid
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
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton rows={5} columns={8} />
        ) : offers.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {phaseFilter !== "all"
              ? "Ingen tilbud med valgt filter."
              : "Ingen tilbud registrert."}
          </div>
        ) : (
          <div className="space-y-6">
            <OfferListTable offers={offers} />
            {data && (
              <PaginationControls
                currentPage={page}
                totalPages={Math.ceil(
                  (Array.isArray(data) ? data.length : (data.total ?? 0)) /
                    pageSize
                )}
                onPageChange={setPage}
                pageSize={pageSize}
                totalCount={
                  Array.isArray(data) ? data.length : (data.total ?? 0)
                }
                entityName="tilbud"
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
