"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useInquiries, useDeleteInquiry } from "@/hooks/useInquiries";
import { useUsers } from "@/hooks/useUsers";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { NewBadge } from "@/components/ui/new-badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { CompanyBadge } from "@/components/ui/company-badge";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";

export default function RequestsPage() {
  const router = useRouter();
  // Fetch inquiries (draft offers) from /inquiries endpoint
  const { data, isLoading } = useInquiries();
  const { data: users } = useUsers();
  const deleteInquiry = useDeleteInquiry();

  const handleRowClick = (offerId: string) => {
    router.push(`/offers/${offerId}`);
  };

  const [selectedOffer, setSelectedOffer] = useState<DomainOfferDTO | null>(
    null
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const offers = useMemo<DomainOfferDTO[]>(
    () => data?.data ?? [],
    [data?.data]
  );

  // Helper to get user name by ID
  const getUserName = (userId?: string) => {
    if (!userId || !users) return "-";
    const user = users.find((u: { id?: string }) => u.id === userId);
    return (user as { name?: string })?.name || "-";
  };

  const handleDeleteClick = (offer: DomainOfferDTO, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOffer(offer);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedOffer?.id) {
      await deleteInquiry.mutateAsync(selectedOffer.id);
      setSelectedOffer(null);
    }
  };

  return (
    <AppLayout disableScroll>
      <div className="flex h-full flex-col">
        <div className="flex-none border-b bg-background px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Forespørsler</h1>
              <p className="text-muted-foreground">
                Oversikt over innkommende forespørsler som må behandles.
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="space-y-6">
            {isLoading ? (
              <TableSkeleton rows={5} columns={6} />
            ) : offers.length === 0 ? (
              <div className="rounded-lg border bg-muted/20 py-12 text-center">
                <p className="text-muted-foreground">
                  Ingen forespørsler funnet
                </p>
              </div>
            ) : (
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tittel</TableHead>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Ansvarlig</TableHead>
                      <TableHead>Selskap</TableHead>
                      <TableHead>Frist</TableHead>
                      <TableHead>Opprettet</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {offers.map((offer) => (
                      <TableRow
                        key={offer.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => offer.id && handleRowClick(offer.id)}
                      >
                        <TableCell className="font-medium">
                          {offer.title}
                          <NewBadge createdAt={offer.createdAt} />
                        </TableCell>
                        <TableCell>{offer.customerName || "-"}</TableCell>
                        <TableCell>
                          {getUserName(offer.responsibleUserId)}
                        </TableCell>
                        <TableCell>
                          <CompanyBadge companyId={offer.companyId} />
                        </TableCell>
                        <TableCell>
                          {offer.dueDate
                            ? format(new Date(offer.dueDate), "d. MMM yyyy", {
                                locale: nb,
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {offer.createdAt
                            ? formatDistanceToNow(new Date(offer.createdAt), {
                                addSuffix: true,
                                locale: nb,
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => handleDeleteClick(offer, e)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            title="Slett"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

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
              isLoading={deleteInquiry.isPending}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
