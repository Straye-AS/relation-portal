"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useCustomer } from "@/hooks/useCustomers";
import { useOffers } from "@/hooks/useOffers";
import { useProjects } from "@/hooks/useProjects";
import type {
  DomainOfferDTO,
  DomainProjectDTO,
} from "@/lib/.generated/data-contracts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Edit, Mail, Phone, MapPin } from "lucide-react";
import { use } from "react";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: customer, isLoading } = useCustomer(resolvedParams.id);
  const { data: offers } = useOffers();
  const { data: projects } = useProjects();

  const customerOffers = offers?.data?.filter(
    (o: DomainOfferDTO) => o.customerId === resolvedParams.id
  );
  const customerProjects = projects?.filter(
    (p: DomainProjectDTO) => p.customerId === resolvedParams.id
  );

  if (isLoading) {
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
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Kunde ikke funnet</p>
          <Link href="/customers">
            <Button className="mt-4">Tilbake til kunder</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/customers">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">{customer.name}</h1>
              <p className="text-muted-foreground">
                Org.nr: {customer.orgNumber}
              </p>
            </div>
          </div>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Rediger
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Kontaktinformasjon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">E-post</p>
                  <a
                    href={`mailto:${customer.email}`}
                    className="font-medium hover:underline"
                  >
                    {customer.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Telefon</p>
                  <a
                    href={`tel:${customer.phone}`}
                    className="font-medium hover:underline"
                  >
                    {customer.phone}
                  </a>
                </div>
              </div>
              {customer.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">{customer.address}</p>
                    <p className="text-sm">
                      {customer.postalCode} {customer.city}
                    </p>
                    <p className="text-sm">{customer.country}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Kontaktperson</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customer.contactPerson ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground">Navn</p>
                    <p className="font-medium">{customer.contactPerson}</p>
                  </div>
                  {customer.contactEmail && (
                    <div>
                      <p className="text-sm text-muted-foreground">E-post</p>
                      <a
                        href={`mailto:${customer.contactEmail}`}
                        className="font-medium hover:underline"
                      >
                        {customer.contactEmail}
                      </a>
                    </div>
                  )}
                  {customer.contactPhone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Telefon</p>
                      <a
                        href={`tel:${customer.contactPhone}`}
                        className="font-medium hover:underline"
                      >
                        {customer.contactPhone}
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">
                  Ingen kontaktperson registrert
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tilbud</CardTitle>
          </CardHeader>
          <CardContent>
            {!customerOffers || customerOffers.length === 0 ? (
              <p className="text-muted-foreground">Ingen tilbud registrert</p>
            ) : (
              <div className="space-y-3">
                {customerOffers.map((offer: DomainOfferDTO) => (
                  <Link
                    key={offer.id}
                    href={`/offers/${offer.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <h3 className="font-semibold">{offer.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {offer.responsibleUserName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>{offer.phase}</Badge>
                      <p className="font-semibold">
                        {new Intl.NumberFormat("nb-NO", {
                          style: "currency",
                          currency: "NOK",
                          maximumFractionDigits: 0,
                        }).format(offer.value ?? 0)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prosjekter</CardTitle>
          </CardHeader>
          <CardContent>
            {!customerProjects || customerProjects.length === 0 ? (
              <p className="text-muted-foreground">
                Ingen prosjekter registrert
              </p>
            ) : (
              <div className="space-y-3">
                {customerProjects.map((project: DomainProjectDTO) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {project.managerName}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge>{project.status}</Badge>
                      <p className="font-semibold">
                        {new Intl.NumberFormat("nb-NO", {
                          style: "currency",
                          currency: "NOK",
                          maximumFractionDigits: 0,
                        }).format(project.budget ?? 0)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
