"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useOffers } from "@/hooks/useOffers";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";
import { DomainOfferPhase } from "@/lib/.generated/data-contracts";
import { useState, useMemo } from "react";
import { NewBadge } from "@/components/ui/new-badge";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowRight } from "lucide-react";
import { ConvertRequestModal } from "@/components/requests/convert-request-modal";
import { CompanyBadge } from "@/components/ui/company-badge";
import { useDeleteOffer } from "@/hooks/useOffers";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

export default function RequestsPage() {
  // Fetch ONLY drafts
  const { data, isLoading } = useOffers({
    phase: DomainOfferPhase.OfferPhaseDraft as any,
  });
  const deleteOffer = useDeleteOffer();

  const [selectedOffer, setSelectedOffer] = useState<DomainOfferDTO | null>(
    null
  );
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const offers = useMemo<DomainOfferDTO[]>(
    () => data?.data ?? [],
    [data?.data]
  );

  const handleConvertClick = (offer: DomainOfferDTO, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click? Though we might not have row click navigation
    setSelectedOffer(offer);
    setIsConvertModalOpen(true);
  };

  const handleDeleteClick = (offer: DomainOfferDTO, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOffer(offer);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedOffer?.id) {
      await deleteOffer.mutateAsync(selectedOffer.id);
      setSelectedOffer(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Forespørsler</h1>
            <p className="text-muted-foreground">
              Oversikt over innkommende forespørsler som må behandles.
            </p>
          </div>
          {/* No "Create" button here as per requirements */}
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} columns={4} />
        ) : offers.length === 0 ? (
          <div className="rounded-lg border bg-muted/20 py-12 text-center">
            <p className="text-muted-foreground">
              Ingen forespørsler funnet 👍
            </p>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tittel</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Selskap</TableHead>
                  <TableHead>Opprettet</TableHead>
                  <TableHead className="text-right">Handling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      {offer.title}
                      <NewBadge createdAt={offer.createdAt} />
                    </TableCell>
                    <TableCell>{offer.customerName}</TableCell>
                    <TableCell>
                      <CompanyBadge companyId={offer.companyId} />
                    </TableCell>
                    <TableCell>
                      {offer.createdAt
                        ? formatDistanceToNow(new Date(offer.createdAt), {
                            addSuffix: true,
                            locale: nb,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDeleteClick(offer, e)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => handleConvertClick(offer, e)}
                          className="gap-2"
                        >
                          Konverter
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination info could go here */}

        <ConvertRequestModal
          offer={selectedOffer}
          isOpen={isConvertModalOpen}
          onClose={() => {
            setIsConvertModalOpen(false);
            setSelectedOffer(null);
          }}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedOffer(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Slett forespørsel"
          description="Er du sikker på at du vil slette denne forespørselen? Dette kan ikke angres."
          itemTitle={selectedOffer?.title}
          isLoading={deleteOffer.isPending}
        />
      </div>
    </AppLayout>
  );
}
