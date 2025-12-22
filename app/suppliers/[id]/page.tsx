"use client";

import { useState, use } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  useSupplier,
  useUpdateSupplier,
  useUpdateSupplierCategory,
  useUpdateSupplierEmail,
  useUpdateSupplierPhone,
  useUpdateSupplierWebsite,
  useUpdateSupplierAddress,
  useUpdateSupplierPostalCode,
  useUpdateSupplierCity,
  useDeleteSupplierContact,
} from "@/hooks/useSuppliers";
import { InlineEdit } from "@/components/ui/inline-edit";
import { AddSupplierContactModal } from "@/components/suppliers/add-supplier-contact-modal";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { SupplierOffersTab } from "@/components/suppliers/supplier-offers-tab";
import { SupplierNotes } from "@/components/suppliers/supplier-notes";
import { ContactInfoCard } from "@/components/shared/contact-info-card";
import { SyncWithBrregButton } from "@/components/shared/sync-with-brreg-button";
import type { BrregMappedData } from "@/lib/brreg";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Truck,
  FileText,
  Users,
  Banknote,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { DomainSupplierContactDTO } from "@/lib/.generated/data-contracts";

interface SupplierContact {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  title?: string;
  isPrimary?: boolean;
}

export default function SupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(
    searchParams.get("tab") || "overview"
  );

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("tab", value);
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] =
    useState<SupplierContact | null>(null);

  const { data: supplier, isLoading: isLoadingSupplier } = useSupplier(
    resolvedParams.id
  );

  const updateSupplier = useUpdateSupplier();
  const updateCategory = useUpdateSupplierCategory();
  const updateEmail = useUpdateSupplierEmail();
  const updatePhone = useUpdateSupplierPhone();
  const updateWebsite = useUpdateSupplierWebsite();
  const updateAddress = useUpdateSupplierAddress();
  const updatePostalCode = useUpdateSupplierPostalCode();
  const updateCity = useUpdateSupplierCity();
  const deleteContact = useDeleteSupplierContact();

  const contacts: SupplierContact[] =
    (supplier?.contacts as DomainSupplierContactDTO[] | undefined)?.map(
      (c) => ({
        id: c.id || "",
        name:
          c.fullName ||
          `${c.firstName || ""} ${c.lastName || ""}`.trim() ||
          "Ukjent navn",
        email: c.email,
        phone: c.phone,
        title: c.title,
        isPrimary: c.isPrimary,
      })
    ) ?? [];

  const stats = supplier?.stats;

  if (isLoadingSupplier) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (!supplier) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Truck className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold">Leverandør ikke funnet</h2>
          <p className="text-muted-foreground">
            Leverandøren du ser etter eksisterer ikke eller har blitt slettet.
          </p>
          <Link href="/suppliers">
            <Button className="mt-4" variant="outline">
              Tilbake til leverandører
            </Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout disableScroll>
      <div className="flex h-full flex-col">
        <div className="flex-none border-b bg-background px-4 py-4 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/suppliers">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${supplier.name}`}
                  />
                  <AvatarFallback className="text-xl font-bold">
                    {supplier.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {supplier.name}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge variant="outline" className="font-normal">
                      {supplier.orgNumber
                        ? `Org.nr: ${supplier.orgNumber}`
                        : "Uten org.nr"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <SyncWithBrregButton
              type="supplier"
              orgNumber={supplier.orgNumber}
              currentData={{
                name: supplier.name,
                website: supplier.website,
                address: supplier.address,
                postalCode: supplier.postalCode,
                city: supplier.city,
                country: supplier.country,
                category: supplier.category,
                phone: supplier.phone,
                email: supplier.email,
              }}
              onSync={async (data: BrregMappedData) => {
                await updateSupplier.mutateAsync({
                  id: supplier.id!,
                  data: {
                    name: data.name || supplier.name || "",
                    country: data.country || supplier.country || "Norge",
                    address: data.address,
                    postalCode: data.postalCode,
                    city: data.city,
                    website: data.website,
                  },
                });
              }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="hidden md:col-span-2">
                <CardHeader>
                  <CardTitle>Nøkkeltall</CardTitle>
                  <CardDescription>
                    Oversikt over leverandørens tilbudsaktivitet
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          Totalt tilbud
                        </div>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-2 text-2xl font-bold">
                        {stats?.totalOffers ?? 0}
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          Aktive tilbud
                        </div>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-2 text-2xl font-bold">
                        {stats?.activeOffers ?? 0}
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          Fullførte tilbud
                        </div>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-2 text-2xl font-bold">
                        {stats?.completedOffers ?? 0}
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          Prosjekter
                        </div>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-2 text-2xl font-bold">
                        {stats?.totalProjects ?? 0}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="col-span-3">
                <ContactInfoCard
                  email={supplier.email}
                  phone={supplier.phone}
                  website={supplier.website}
                  address={supplier.address}
                  postalCode={supplier.postalCode}
                  city={supplier.city}
                  country={supplier.country}
                  createdAt={supplier.createdAt}
                  createdByName={supplier.createdByName}
                  updatedAt={supplier.updatedAt}
                  updatedByName={supplier.updatedByName}
                  onUpdateEmail={async (email) => {
                    await updateEmail.mutateAsync({
                      id: supplier.id!,
                      data: { email },
                    });
                  }}
                  onUpdatePhone={async (phone) => {
                    await updatePhone.mutateAsync({
                      id: supplier.id!,
                      data: { phone },
                    });
                  }}
                  onUpdateWebsite={async (website) => {
                    await updateWebsite.mutateAsync({
                      id: supplier.id!,
                      data: { website },
                    });
                  }}
                  onUpdateAddress={async (address) => {
                    await updateAddress.mutateAsync({
                      id: supplier.id!,
                      data: { address },
                    });
                  }}
                  onUpdatePostalCode={async (postalCode) => {
                    await updatePostalCode.mutateAsync({
                      id: supplier.id!,
                      data: { postalCode },
                    });
                  }}
                  onUpdateCity={async (city) => {
                    await updateCity.mutateAsync({
                      id: supplier.id!,
                      data: { city },
                    });
                  }}
                />
              </div>
            </div>

            <Tabs
              value={activeTab}
              className="space-y-4"
              onValueChange={handleTabChange}
            >
              <TabsList>
                <TabsTrigger value="overview">Oversikt</TabsTrigger>
                <TabsTrigger value="offers">
                  Tilbud ({stats?.totalOffers ?? "?"})
                </TabsTrigger>
                <TabsTrigger value="contacts">
                  Kontakter ({contacts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-3 sm:col-span-4">
                    <CardHeader>
                      <CardTitle>Leverandørdetaljer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4">
                        <div>
                          <label className="text-sm font-medium">
                            Kategori
                          </label>
                          <InlineEdit
                            value={supplier.category || ""}
                            className="mt-1 w-full border px-3 py-2"
                            placeholder="f.eks. Taktekking, Elektro"
                            onSave={async (value) => {
                              await updateCategory.mutateAsync({
                                id: supplier.id!,
                                data: { category: String(value) },
                              });
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-4 sm:col-span-3">
                    <CardHeader>
                      <CardTitle>Kontaktpersoner</CardTitle>
                      <CardDescription>
                        Kontaktpersoner hos leverandøren
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {contacts.slice(0, 3).map((contact) => (
                          <div
                            key={contact.id}
                            className="flex cursor-pointer items-center justify-between rounded-md p-2 hover:bg-muted/50"
                            onClick={() => handleTabChange("contacts")}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarFallback>
                                  {contact.name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium leading-none">
                                  {contact.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {contact.title || "Ingen tittel"}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setContactToDelete(contact);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        {contacts.length === 0 && (
                          <div className="flex flex-col items-center justify-center gap-2 py-4 text-center">
                            <p className="text-sm text-muted-foreground">
                              Ingen kontakter registrert
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsContactModalOpen(true)}
                            >
                              Legg til kontakt
                            </Button>
                          </div>
                        )}
                        {contacts.length > 3 && (
                          <Button
                            variant="link"
                            className="w-full text-xs"
                            onClick={() =>
                              document
                                .querySelector<HTMLElement>(
                                  '[value="contacts"]'
                                )
                                ?.click()
                            }
                          >
                            Se alle kontakter
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <SupplierNotes
                  supplierId={supplier.id!}
                  initialNotes={supplier.notes || ""}
                />
              </TabsContent>

              <TabsContent value="offers">
                <SupplierOffersTab supplierId={supplier.id!} />
              </TabsContent>

              <TabsContent value="contacts">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Kontakter</CardTitle>
                      <CardDescription>
                        Alle kontaktpersoner hos leverandøren
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => setIsContactModalOpen(true)}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Ny kontakt
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {contacts.length === 0 ? (
                      <div className="py-8 text-center">
                        <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <p className="mt-4 text-muted-foreground">
                          Ingen kontakter registrert.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {contacts.map((contact) => (
                          <Card key={contact.id}>
                            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                              <Avatar>
                                <AvatarFallback>
                                  {contact.name?.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <CardTitle className="text-base">
                                  {contact.name}
                                  {contact.isPrimary && (
                                    <Badge
                                      variant="secondary"
                                      className="ml-2 text-xs"
                                    >
                                      Primær
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription>
                                  {contact.title || "Ingen tittel"}
                                </CardDescription>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => setContactToDelete(contact)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardHeader>
                            <CardContent className="grid gap-2 text-sm">
                              {contact.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <span className="truncate">
                                    {contact.email}
                                  </span>
                                </div>
                              )}
                              {contact.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <span>{contact.phone}</span>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <AddSupplierContactModal
        supplierId={resolvedParams.id}
        open={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />

      <DeleteConfirmationModal
        isOpen={!!contactToDelete}
        onClose={() => setContactToDelete(null)}
        onConfirm={async () => {
          if (contactToDelete) {
            await deleteContact.mutateAsync({
              supplierId: resolvedParams.id,
              contactId: contactToDelete.id,
            });
            setContactToDelete(null);
          }
        }}
        title="Slett kontaktperson?"
        description="Er du sikker på at du vil slette denne kontaktpersonen? Handlingen kan ikke angres."
        itemTitle={contactToDelete?.name}
        isLoading={deleteContact.isPending}
      />
    </AppLayout>
  );
}
