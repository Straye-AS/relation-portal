"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useProject, useProjectBudget } from "@/hooks/useProjects";
import { useOffers } from "@/hooks/useOffers"; // Added import
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";

import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowLeft, Edit, Users } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { use } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Added table imports
import { OfferRow } from "@/components/offers/offer-row";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: project, isLoading } = useProject(resolvedParams.id);
  const { data: offersData } = useOffers({ page: 1, pageSize: 1000 });
  const { data: budgetData } = useProjectBudget(resolvedParams.id);

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

  if (!project) {
    return (
      <AppLayout>
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Prosjekt ikke funnet</p>
          <Link href="/projects">
            <Button className="mt-4">Tilbake til prosjekter</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const budget = project.budget ?? 0;
  const spent = project.spent ?? 0;
  const spentPercentage = budget > 0 ? (spent / budget) * 100 : 0;
  const remaining = budget - spent;

  // Calculate advanced metrics
  // Check if budgetData has totalCost, otherwise default to 0
  const totalCost = (budgetData as any)?.totalCost ?? 0;
  const profit = budget - totalCost; // DB
  const margin = budget > 0 ? (profit / budget) * 100 : 0; // DG

  // Filter offers connected to this project
  const connectedOffers =
    offersData?.data?.filter((offer) => offer.projectId === project.id) || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/projects">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              {project.projectNumber && (
                <span className="mb-1 block font-mono text-sm uppercase tracking-wider text-muted-foreground">
                  Prosjekt: {project.projectNumber}
                </span>
              )}
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <p className="text-muted-foreground">
                Startet{" "}
                {format(
                  new Date(project.startDate ?? new Date().toISOString()),
                  "dd. MMMM yyyy",
                  {
                    locale: nb,
                  }
                )}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {/* {project.teamsChannelUrl && (
              <Button variant="outline" asChild>
                <a
                  href={project.teamsChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Åpne i Teams
                </a>
              </Button>
            )} */}
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Rediger
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Prosjektinformasjon</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Kunde</p>
                <Link
                  href={`/customers/${project.customerId}`}
                  className="font-medium hover:underline"
                >
                  {project.customerName}
                </Link>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <ProjectStatusBadge
                  status={project.status || "planning"}
                  className="mt-1"
                />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Prosjektleder</p>
                <p className="font-medium">{project.managerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Periode</p>
                <p className="font-medium">
                  {format(
                    new Date(project.startDate ?? new Date().toISOString()),
                    "dd.MM.yyyy",
                    {
                      locale: nb,
                    }
                  )}{" "}
                  -{" "}
                  {project.endDate
                    ? format(new Date(project.endDate), "dd.MM.yyyy", {
                        locale: nb,
                      })
                    : "Ikke fastsatt"}
                </p>
              </div>
              {project.teamMembers && project.teamMembers.length > 0 && (
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    <Users className="mr-1 inline h-4 w-4" />
                    Teammedlemmer
                  </p>
                  <p className="font-medium">
                    {project.teamMembers.length} personer
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Økonomi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">
                    Budsjett (Pris)
                  </p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                      maximumFractionDigits: 0,
                    }).format(budget)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Est. Kostnad</p>
                  <p className="text-2xl font-bold">
                    {new Intl.NumberFormat("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                      maximumFractionDigits: 0,
                    }).format(totalCost)}
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-lg bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-muted-foreground">
                    Margin (DG)
                  </p>
                  <p className="text-2xl font-bold">{margin.toFixed(1)} %</p>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <p className="text-sm text-muted-foreground">
                    Dekningsbidrag (DB)
                  </p>
                  <p className="font-mono font-medium text-green-600">
                    {new Intl.NumberFormat("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                      maximumFractionDigits: 0,
                    }).format(profit)}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Brukt av budsjett
                  </span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                      maximumFractionDigits: 0,
                    }).format(spent)}{" "}
                    ({spentPercentage.toFixed(1)}%)
                  </span>
                </div>
                <Progress
                  value={spentPercentage}
                  className="h-2"
                  indicatorClassName={
                    spentPercentage > 100
                      ? "bg-red-600"
                      : spentPercentage > 80
                        ? "bg-orange-500"
                        : "bg-green-600"
                  }
                />

                <div className="mt-4 flex justify-between border-t pt-2">
                  <span className="text-sm text-muted-foreground">
                    Gjenstående
                  </span>
                  <span
                    className={`font-mono text-lg font-bold ${
                      remaining < 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {new Intl.NumberFormat("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                      maximumFractionDigits: 0,
                    }).format(remaining)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {project.description && (
          <Card>
            <CardHeader>
              <CardTitle>Beskrivelse</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{project.description}</p>
            </CardContent>
          </Card>
        )}

        {/* List of Connected Offers */}
        <Card>
          <CardHeader>
            <CardTitle>Tilknyttede tilbud ({connectedOffers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {connectedOffers.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nr.</TableHead>
                      <TableHead>Tittel</TableHead>
                      <TableHead>Kunde</TableHead>
                      <TableHead>Selskap</TableHead>
                      <TableHead>Fase</TableHead>
                      <TableHead>Frist</TableHead>
                      <TableHead>Verdi</TableHead>
                      <TableHead>Sannsynlighet</TableHead>
                      <TableHead>Oppdatert</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {connectedOffers.map((offer) => (
                      <OfferRow key={offer.id} offer={offer} />
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-6 text-center text-muted-foreground">
                Ingen tilknyttede tilbud funnet for dette prosjektet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Keeping original "Relatert tilbud" if it exists and is distinct, 
            or logic to hide it if covered by list. 
            For now, I'll remove the redundant single card if it's confusing, 
            but the user might want to see the 'Origin' offer specifically.
            However, listing all offers is cleaner. 
            I will comment out the old single card section to avoid clutter 
            unless the user wants it specifically. 
        */}
        {/* {project.offerId && (
          <Card>
            <CardHeader>
              <CardTitle>Relatert tilbud</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/offers/${project.offerId}`}
                className="font-medium text-primary hover:underline"
              >
                Se tilbudet dette prosjektet er basert på →
              </Link>
            </CardContent>
          </Card>
        )} */}
      </div>
    </AppLayout>
  );
}
