"use client";

import { AppLayout } from "@/components/layout/app-layout";
import {
  useOffer,
  useDeleteOffer,
  useUpdateOfferTitle,
  useUpdateOfferDueDate,
  useUpdateOfferResponsible,
} from "@/hooks/useOffers";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { OfferDescription } from "@/components/offers/offer-description";
import { CompanyBadge } from "@/components/ui/company-badge";
import { NewBadge } from "@/components/ui/new-badge";
import { ConvertRequestModal } from "@/components/requests/convert-request-modal";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { InlineEdit } from "@/components/ui/inline-edit";
import { SmartDatePicker } from "@/components/ui/smart-date-picker";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  Calendar,
  User,
  Building,
  Clock,
  FileText,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { nb } from "date-fns/locale";
import { use, useState, useMemo } from "react";
import type { DomainOfferDTO } from "@/lib/.generated/data-contracts";

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: offer, isLoading } = useOffer(resolvedParams.id);
  const { data: users } = useUsers();
  const deleteOffer = useDeleteOffer();
  const updateTitle = useUpdateOfferTitle();
  const updateDueDate = useUpdateOfferDueDate();
  const updateResponsible = useUpdateOfferResponsible();

  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResponsibleModalOpen, setIsResponsibleModalOpen] = useState(false);

  // Find responsible user
  const responsibleUser = useMemo(() => {
    if (!users || !offer?.responsibleUserId) return null;
    return users.find((u: { id?: string }) => u.id === offer.responsibleUserId);
  }, [users, offer?.responsibleUserId]);

  const handleDeleteConfirm = async () => {
    if (offer?.id) {
      await deleteOffer.mutateAsync(offer.id);
      router.push("/requests");
    }
  };

  const handleDueDateChange = async (date: Date | undefined) => {
    if (!offer?.id) return;
    await updateDueDate.mutateAsync({
      id: offer.id,
      data: { dueDate: date?.toISOString() },
    });
  };

  const handleResponsibleChange = async (userId: string) => {
    if (!offer?.id) return;
    await updateResponsible.mutateAsync({
      id: offer.id,
      data: { responsibleUserId: userId },
    });
    setIsResponsibleModalOpen(false);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6 p-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (!offer) {
    return (
      <AppLayout>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Forespørsel ikke funnet</p>
          <Link href="/requests">
            <Button className="mt-4">Tilbake til forespørsler</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  // Cast to DomainOfferDTO for the modal
  const offerDto = offer as DomainOfferDTO;

  return (
    <AppLayout disableScroll>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex-none border-b bg-background px-4 py-4 md:px-8">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/requests">
                  <Button variant="ghost" size="icon">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <span className="mb-1 flex items-center gap-2 font-mono text-sm uppercase tracking-wider text-muted-foreground">
                    Forespørsel
                    <NewBadge createdAt={offer.createdAt} />
                  </span>
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-bold">
                      <InlineEdit
                        value={offer.title || ""}
                        onSave={async (val) => {
                          await updateTitle.mutateAsync({
                            id: offer.id!,
                            data: { title: String(val) },
                          });
                        }}
                        placeholder="Uten tittel"
                        className="-ml-2 border-transparent p-0 text-3xl font-bold hover:border-transparent hover:bg-transparent"
                      />
                    </h1>
                  </div>
                  <p className="text-muted-foreground">
                    Opprettet{" "}
                    {formatDistanceToNow(
                      new Date(offer.createdAt ?? new Date().toISOString()),
                      {
                        addSuffix: true,
                        locale: nb,
                      }
                    )}
                  </p>
                </div>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => setIsConvertModalOpen(true)}
                  className="gap-2"
                >
                  Konverter til tilbud
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="grid items-start gap-6 lg:grid-cols-3">
            {/* Main content - Description */}
            <div className="lg:col-span-2">
              <OfferDescription
                offerId={offer.id!}
                initialDescription={offer.description}
                readOnly={false}
              />
            </div>

            {/* Sidebar - Info card */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4" />
                    Detaljer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Company */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      Selskap
                    </span>
                    <CompanyBadge companyId={offer.companyId} />
                  </div>

                  {/* Customer */}
                  {offer.customerName && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4" />
                        Kunde
                      </span>
                      <span className="text-sm font-medium">
                        {offer.customerName}
                      </span>
                    </div>
                  )}

                  {/* Responsible - Editable */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      Ansvarlig
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto px-2 py-1 text-sm font-medium"
                      onClick={() => setIsResponsibleModalOpen(true)}
                    >
                      {responsibleUser
                        ? (responsibleUser as { name?: string }).name ||
                          "Ukjent"
                        : "Velg ansvarlig"}
                    </Button>
                  </div>

                  {/* Due date - Editable */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Frist
                    </span>
                    <SmartDatePicker
                      value={
                        offer.dueDate ? new Date(offer.dueDate) : undefined
                      }
                      onSelect={handleDueDateChange}
                      placeholder="Velg frist"
                    />
                  </div>

                  {/* Created at */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Opprettet
                    </span>
                    <span className="text-sm font-medium">
                      {offer.createdAt
                        ? format(new Date(offer.createdAt), "d. MMM yyyy", {
                            locale: nb,
                          })
                        : "-"}
                    </span>
                  </div>

                  {/* Updated at */}
                  {offer.updatedAt && offer.updatedAt !== offer.createdAt && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Sist oppdatert
                      </span>
                      <span className="text-sm font-medium">
                        {format(new Date(offer.updatedAt), "d. MMM yyyy", {
                          locale: nb,
                        })}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ConvertRequestModal
          offer={offerDto}
          isOpen={isConvertModalOpen}
          onClose={() => setIsConvertModalOpen(false)}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          title="Slett forespørsel"
          description="Er du sikker på at du vil slette denne forespørselen? Dette kan ikke angres."
          itemTitle={offer.title}
          isLoading={deleteOffer.isPending}
        />

        {/* Responsible user selection dialog */}
        <CommandDialog
          open={isResponsibleModalOpen}
          onOpenChange={setIsResponsibleModalOpen}
        >
          <CommandInput placeholder="Søk etter bruker..." />
          <CommandList>
            <CommandEmpty>Ingen brukere funnet.</CommandEmpty>
            <CommandGroup heading="Brukere">
              {users?.map((user: { id?: string; name?: string }) => (
                <CommandItem
                  key={user.id}
                  value={user.name || ""}
                  onSelect={() => user.id && handleResponsibleChange(user.id)}
                >
                  <User className="mr-2 h-4 w-4" />
                  {user.name || "Ukjent"}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </div>
    </AppLayout>
  );
}
