"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useCustomer, useCustomerContacts } from "@/hooks/useCustomers";
import { useOffers } from "@/hooks/useOffers";
import { useProjects } from "@/hooks/useProjects";
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
} from "lucide-react";
import { use } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const resolvedParams = use(params);
  const { data: customer, isLoading: isLoadingCustomer } = useCustomer(
    resolvedParams.id
  );
  const { data: contactsData } = useCustomerContacts(resolvedParams.id);
  const { data: offers } = useOffers();
  const { data: projects } = useProjects();

  // Cast contactsData to local interface
  const contacts = (contactsData as unknown as CustomerContact[]) || [];

  const customerOffers = (offers?.data?.filter(
    (o: DomainOfferDTO) => o.customerId === resolvedParams.id
  ) || []) as DomainOfferDTO[];

  const customerProjects = (projects?.filter(
    (p: DomainProjectDTO) => p.customerId === resolvedParams.id
  ) || []) as DomainProjectDTO[];

  // Calculate economics
  const totalOfferValue = customerOffers.reduce(
    (acc: number, curr: DomainOfferDTO) => acc + (curr.value || 0),
    0
  );
  const activeProjectsValue = customerProjects.reduce(
    (acc: number, curr: DomainProjectDTO) => acc + (curr.budget || 0),
    0
  );
  const wonOffersCount = customerOffers.filter(
    (o: DomainOfferDTO) => o.phase === "won"
  ).length;
  const activeProjectsCount = customerProjects.filter(
    (p: DomainProjectDTO) => p.status === "active"
  ).length;

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
    <AppLayout>
      <div className="space-y-6">
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
                    Org.nr: {customer.orgNumber}
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

        {/* Info Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Info Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Nøkkeltall for økonomi</CardTitle>
              <CardDescription>
                Oversikt over prosjekt- og tilbudsverdier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                      Vunnet tilbud
                    </div>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-2 text-2xl font-bold">
                    {wonOffersCount}
                  </div>
                  <div className="flex items-center text-xs text-green-500">
                    <span className="flex items-center font-medium">
                      +2 nye
                    </span>
                    <span className="ml-1 text-muted-foreground">
                      siste mnd
                    </span>
                  </div>
                </div>
                <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Total tilbudsverdi
                    </div>
                    <div className="font-bold text-muted-foreground">NOK</div>
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
                    {customerOffers.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Totalt opprettet
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
                <div className="overflow-hidden">
                  <p className="text-sm font-medium leading-none">E-post</p>
                  <a
                    href={`mailto:${customer.email}`}
                    className="block truncate text-sm text-muted-foreground hover:underline"
                  >
                    {customer.email || "-"}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <Phone className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Telefon</p>
                  <a
                    href={`tel:${customer.phone}`}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    {customer.phone || "-"}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                  <MapPin className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">Adresse</p>
                  <div className="text-sm text-muted-foreground">
                    {customer.address ? (
                      <>
                        <p>{customer.address}</p>
                        <p>
                          {customer.postalCode} {customer.city}
                        </p>
                      </>
                    ) : (
                      "-"
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Oversikt</TabsTrigger>
            <TabsTrigger value="projects">
              Prosjekter ({customerProjects.length})
            </TabsTrigger>
            <TabsTrigger value="offers">
              Tilbud ({customerOffers.length})
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
                  <CardDescription>Nøkkelpersoner hos kunden</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {contacts.slice(0, 3).map((contact: CustomerContact) => (
                      <div
                        key={contact.id}
                        className="flex items-center justify-between"
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
                              {contact.role || "Ingen rolle"}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
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
                            .querySelector<HTMLElement>('[value="contacts"]')
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
              <CardHeader>
                <CardTitle>Prosjekter</CardTitle>
                <CardDescription>
                  Liste over alle prosjekter for denne kunden
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customerProjects.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    Ingen prosjekter registrert.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {customerProjects.map((project: DomainProjectDTO) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{project.name}</h3>
                            <Badge
                              variant={
                                project.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {project.status}
                            </Badge>
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
                            }).format(project.budget || 0)}
                          </div>
                          <Link href={`/projects/${project.id}`}>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                            >
                              Vis prosjekt
                            </Button>
                          </Link>
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
              <CardHeader>
                <CardTitle>Tilbud</CardTitle>
                <CardDescription>
                  Oversikt over alle tilbud gitt til kunden
                </CardDescription>
              </CardHeader>
              <CardContent>
                {customerOffers.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    Ingen tilbud registrert.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {customerOffers.map((offer: DomainOfferDTO) => (
                      <div
                        key={offer.id}
                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{offer.title}</h3>
                            <Badge variant="outline">{offer.phase}</Badge>
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
                          <Link href={`/offers/${offer.id}`}>
                            <Button
                              variant="link"
                              size="sm"
                              className="h-auto p-0 text-xs"
                            >
                              Vis tilbud
                            </Button>
                          </Link>
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
    </AppLayout>
  );
}
