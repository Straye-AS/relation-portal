"use client";

import { useState, use } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import {
  useCustomerWithDetails,
  useCustomerContacts,
  useCustomerOffers,
  useCustomerProjects,
  useUpdateCustomer,
  useUpdateCustomerAddress,
  useUpdateCustomerPostalCode,
  useUpdateCustomerCity,
} from "@/hooks/useCustomers";
import { InlineEdit } from "@/components/ui/inline-edit";
import { toast } from "sonner";
import { OfferStatusBadge } from "@/components/offers/offer-status-badge";
import { ProjectPhaseBadge } from "@/components/projects/project-phase-badge";
import type {
  DomainOfferDTO,
  DomainProjectDTO,
} from "@/lib/.generated/data-contracts";

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
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Building2,
  Users,
  Banknote,
} from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { AddOfferModal } from "@/components/offers/add-offer-modal";
import { AddProjectModal } from "@/components/projects/add-project-modal";

// Local interface for contact to satisfy TS and expected usage
interface CustomerContact {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const resolvedParams = use(params);
  /* State for active tab to control lazy fetching */
  const [activeTab, setActiveTab] = useState("overview");

  const { data: customer, isLoading: isLoadingCustomer } =
    useCustomerWithDetails(resolvedParams.id);
  const { data: contactsData } = useCustomerContacts(resolvedParams.id);

  // Lazy fetch projects and offers only when their tabs are active
  const { data: offersData, isLoading: isLoadingOffers } = useCustomerOffers(
    resolvedParams.id,
    {
      pageSize: 50,
      sortOrder: "desc" as any,
      sortBy: "updatedAt" as any,
    },
    { enabled: activeTab === "offers" }
  );

  const { data: projectsData, isLoading: isLoadingProjects } =
    useCustomerProjects(
      resolvedParams.id,
      {
        pageSize: 50,
        sortOrder: "desc" as any,
        sortBy: "updatedAt" as any,
      },
      { enabled: activeTab === "projects" }
    );

  const updateCustomer = useUpdateCustomer();
  const updateAddress = useUpdateCustomerAddress();
  const updatePostalCode = useUpdateCustomerPostalCode();
  const updateCity = useUpdateCustomerCity();

  // Cast contactsData to local interface
  const contacts = (contactsData as unknown as CustomerContact[]) || [];

  const tabOffers = (offersData?.data || []) as DomainOfferDTO[];
  const tabProjects = (projectsData?.data || []) as DomainProjectDTO[];

  // Calculate economics using data available on the customer object for the overview
  // We use customer.activeProjects for project stats as it's included in the detail view
  const activeProjectsList = customer?.activeProjects || [];

  const activeProjectsValue = activeProjectsList.reduce(
    (acc: number, curr: DomainProjectDTO) => acc + (curr.value || 0),
    0
  );

  const activeProjectsCount =
    customer?.stats?.activeProjects || activeProjectsList.length || 0;

  // For offers, we might not have the full list in 'overview', so we rely on stats or fallback
  // Note: 'wonOffersCount' and 'totalOfferValue' might be approximate if we rely only on stats
  const wonOffersCount = customer?.stats?.activeOffers || 0; // The stats might only show 'active', but closest we have

  // Note: totalValue in stats is usually won/invoiced value.
  // We'll use totalValue from stats as a proxy for specific pipeline values if needed,
  // or show 0/placeholder if we strictly don't fetch offers.
  const totalOfferValue = customer?.stats?.totalValue || 0;

  if (isLoadingCustomer) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </AppLayout>
    );
  }

  if (!customer) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold">Kunde ikke funnet</h2>
          <p className="text-muted-foreground">
            Kunden du ser etter eksisterer ikke eller har blitt slettet.
          </p>
          <Link href="/customers">
            <Button className="mt-4" variant="outline">
              Tilbake til kunder
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
          {/* Header Section */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Link href="/customers">
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${customer.name}`}
                  />
                  <AvatarFallback className="text-xl font-bold">
                    {customer.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    {customer.name}
                  </h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Badge variant="outline" className="font-normal">
                      {customer.orgNumber
                        ? `Org.nr: ${customer.orgNumber}`
                        : "Privatperson"}
                    </Badge>
                    {customer.city && (
                      <span className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        {customer.city}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Rediger kunde
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="space-y-6">
            {/* Info Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Main Info Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Nøkkeltall</CardTitle>
                  <CardDescription>
                    Oversikt over prosjekt- og tilbudsverdier
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          Aktive prosjekter
                        </div>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-2 text-2xl font-bold">
                        {activeProjectsCount}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Verdi:{" "}
                        {new Intl.NumberFormat("nb-NO", {
                          style: "currency",
                          currency: "NOK",
                          maximumFractionDigits: 0,
                        }).format(activeProjectsValue)}
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          Vunnede tilbud
                        </div>
                        <Users className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-2 text-2xl font-bold">
                        {wonOffersCount}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Totalt
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          Totalverdi
                        </div>
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-2 text-2xl font-bold">
                        {new Intl.NumberFormat("nb-NO", {
                          notation: "compact",
                          compactDisplay: "short",
                          maximumFractionDigits: 1,
                        }).format(totalOfferValue)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Totalt pipeline
                      </div>
                    </div>
                    <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="text-sm font-medium text-muted-foreground">
                          Antall tilbud
                        </div>
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="mt-2 text-2xl font-bold">
                        {customer.stats?.activeOffers || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Aktive tilbud
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Kontaktinfo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <Mail className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <p className="text-sm font-medium leading-none">E-post</p>
                      <InlineEdit
                        value={customer.email || ""}
                        className="-ml-1 h-auto p-0 px-1 text-sm text-muted-foreground hover:bg-transparent"
                        type="email"
                        placeholder="Legg til e-post"
                        onSave={async (value) => {
                          const email = String(value);
                          if (
                            email &&
                            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                          ) {
                            toast.error("Ugyldig e-postadresse");
                            throw new Error("Invalid email");
                          }
                          await updateCustomer.mutateAsync({
                            id: customer.id!,
                            data: {
                              email,
                              name: customer.name ?? "",
                              country: customer.country ?? "Norge",
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <Phone className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <p className="text-sm font-medium leading-none">
                        Telefon
                      </p>
                      <InlineEdit
                        value={customer.phone || ""}
                        className="-ml-1 h-auto p-0 px-1 text-sm text-muted-foreground hover:bg-transparent"
                        type="tel"
                        placeholder="Legg til telefon"
                        onSave={async (value) => {
                          const phone = String(value);
                          // Simple validation: allow numbers, spaces, +, -, (, )
                          if (phone && !/^[\d\s+\-()]+$/.test(phone)) {
                            toast.error("Ugyldig telefonnummer");
                            throw new Error("Invalid phone");
                          }
                          await updateCustomer.mutateAsync({
                            id: customer.id!,
                            data: {
                              phone,
                              name: customer.name ?? "",
                              country: customer.country ?? "Norge",
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <MapPin className="h-4 w-4 text-foreground" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <p className="text-sm font-medium leading-none">
                        Adresse
                      </p>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <InlineEdit
                          value={customer.address || ""}
                          className="-ml-1 h-auto p-0 px-1 hover:bg-transparent"
                          placeholder="Gateadresse"
                          onSave={async (value) => {
                            await updateAddress.mutateAsync({
                              id: customer.id!,
                              data: {
                                address: String(value),
                              },
                            });
                          }}
                        />
                        <div className="flex gap-2">
                          <InlineEdit
                            value={customer.postalCode || ""}
                            className="-ml-1 h-auto p-0 px-1 hover:bg-transparent"
                            editClassName="w-48"
                            placeholder="Postnr"
                            onSave={async (value) => {
                              await updatePostalCode.mutateAsync({
                                id: customer.id!,
                                data: {
                                  postalCode: String(value),
                                },
                              });
                            }}
                          />
                          <InlineEdit
                            value={customer.city || ""}
                            className="-ml-1 h-auto flex-1 p-0 px-1 hover:bg-transparent"
                            placeholder="Sted"
                            onSave={async (value) => {
                              await updateCity.mutateAsync({
                                id: customer.id!,
                                data: {
                                  city: String(value),
                                },
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        Opprettet av{" "}
                        {customer.createdByName ?? (
                          <Badge
                            variant="secondary"
                            className="h-4 px-1 text-[10px]"
                          >
                            System
                          </Badge>
                        )}
                      </div>
                      <span>
                        {customer.createdAt
                          ? format(
                              new Date(customer.createdAt),
                              "dd.MM.yyyy HH:mm"
                            )
                          : "Ukjent"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        Sist oppdatert av{" "}
                        {customer.updatedByName ?? (
                          <Badge
                            variant="secondary"
                            className="h-4 px-1 text-[10px]"
                          >
                            System
                          </Badge>
                        )}
                      </div>
                      <span>
                        {customer.updatedAt
                          ? format(
                              new Date(customer.updatedAt),
                              "dd.MM.yyyy HH:mm"
                            )
                          : "Ukjent"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs Section */}
            <Tabs
              defaultValue="overview"
              className="space-y-4"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="overview">Oversikt</TabsTrigger>
                <TabsTrigger value="projects">
                  Prosjekter ({customer.stats?.activeProjects ?? "?"})
                </TabsTrigger>
                <TabsTrigger value="offers">
                  Tilbud ({customer.stats?.activeOffers ?? "?"})
                </TabsTrigger>
                <TabsTrigger value="contacts">
                  Kontakter ({contacts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="col-span-4">
                    <CardHeader>
                      <CardTitle>Siste aktivitet</CardTitle>
                      <CardDescription>
                        Nylige aktiviteter knyttet til denne kunden
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="py-8 text-center text-sm text-muted-foreground">
                          Ingen nylige aktiviteter funnet.
                        </p>
                        {/* Placeholder for future activity feed integration */}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="col-span-3">
                    <CardHeader>
                      <CardTitle>Kontaktpersoner</CardTitle>
                      <CardDescription>
                        Nøkkelpersoner hos kunden
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {contacts
                          .slice(0, 3)
                          .map((contact: CustomerContact) => (
                            <div
                              key={contact.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                  <AvatarFallback>
                                    {contact.name
                                      ?.substring(0, 2)
                                      .toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium leading-none">
                                    {contact.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {contact.role || "Ingen rolle"}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        {contacts.length === 0 && (
                          <p className="py-4 text-center text-sm text-muted-foreground">
                            Ingen kontakter registrert
                          </p>
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
              </TabsContent>

              <TabsContent value="projects">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Prosjekter</CardTitle>
                      <CardDescription>
                        Liste over alle prosjekter for denne kunden
                      </CardDescription>
                    </div>
                    <AddProjectModal
                      defaultCustomerId={customer.id}
                      lockedCustomerId={customer.id}
                    />
                  </CardHeader>
                  <CardContent>
                    {isLoadingProjects ? (
                      <div className="py-8 text-center text-muted-foreground">
                        Laster prosjekter...
                      </div>
                    ) : tabProjects.length === 0 ? (
                      <p className="py-8 text-center text-muted-foreground">
                        Ingen prosjekter registrert.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {tabProjects.map((project: DomainProjectDTO) => (
                          <div
                            key={project.id}
                            className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                            onClick={() =>
                              router.push(`/projects/${project.id}`)
                            }
                          >
                            <div className="grid gap-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">
                                  {project.name}
                                </h3>
                                <ProjectPhaseBadge
                                  phase={project.phase ?? ""}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Leder: {project.managerName || "Ikke tildelt"}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {new Intl.NumberFormat("nb-NO", {
                                  style: "currency",
                                  currency: "NOK",
                                  maximumFractionDigits: 0,
                                }).format(project.value || 0)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="offers">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Tilbud</CardTitle>
                      <CardDescription>
                        Oversikt over alle tilbud gitt til kunden
                      </CardDescription>
                    </div>
                    <AddOfferModal
                      defaultCustomerId={customer.id}
                      lockedCustomerId={customer.id}
                      showCustomerWarning={false}
                    />
                  </CardHeader>
                  <CardContent>
                    {isLoadingOffers ? (
                      <div className="py-8 text-center text-muted-foreground">
                        Laster tilbud...
                      </div>
                    ) : tabOffers.length === 0 ? (
                      <p className="py-8 text-center text-muted-foreground">
                        Ingen tilbud registrert.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {tabOffers.map((offer: DomainOfferDTO) => (
                          <div
                            key={offer.id}
                            className="flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                            onClick={() => router.push(`/offers/${offer.id}`)}
                          >
                            <div className="grid gap-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold">{offer.title}</h3>
                                <OfferStatusBadge
                                  phase={offer.phase || "draft"}
                                />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Ansvarlig:{" "}
                                {offer.responsibleUserName || "Ikke tildelt"}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">
                                {new Intl.NumberFormat("nb-NO", {
                                  style: "currency",
                                  currency: "NOK",
                                  maximumFractionDigits: 0,
                                }).format(offer.value || 0)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contacts">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Kontakter</CardTitle>
                      <CardDescription>
                        Alle kontaktpersoner tilknyttet kunden
                      </CardDescription>
                    </div>
                    <Button size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      Ny kontakt
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {contacts.length === 0 ? (
                      <div className="py-8 text-center">
                        <p className="mb-4 text-muted-foreground">
                          Ingen kontakter registrert.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {contacts.map((contact: CustomerContact) => (
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
                                </CardTitle>
                                <CardDescription>
                                  {contact.role || "Ingen rolle"}
                                </CardDescription>
                              </div>
                            </CardHeader>
                            <CardContent className="grid gap-2 text-sm">
                              {contact.email && (
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-muted-foreground" />
                                  <a
                                    href={`mailto:${contact.email}`}
                                    className="truncate hover:underline"
                                  >
                                    {contact.email}
                                  </a>
                                </div>
                              )}
                              {contact.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-muted-foreground" />
                                  <a
                                    href={`tel:${contact.phone}`}
                                    className="hover:underline"
                                  >
                                    {contact.phone}
                                  </a>
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
    </AppLayout>
  );
}
