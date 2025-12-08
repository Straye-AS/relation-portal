"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useProject } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ArrowLeft, Edit, Users } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { use } from "react";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: project, isLoading } = useProject(resolvedParams.id);

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
                <Badge className="mt-1">{project.status}</Badge>
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
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Budsjett</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("nb-NO", {
                    style: "currency",
                    currency: "NOK",
                    maximumFractionDigits: 0,
                  }).format(budget)}
                </p>
              </div>
              <div>
                <p className="mb-2 text-sm text-muted-foreground">
                  Brukt ({spentPercentage.toFixed(1)}%)
                </p>
                <Progress value={spentPercentage} className="mb-2" />
                <p className="text-lg font-bold">
                  {new Intl.NumberFormat("nb-NO", {
                    style: "currency",
                    currency: "NOK",
                    maximumFractionDigits: 0,
                  }).format(spent)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gjenstående</p>
                <p
                  className={`text-xl font-bold ${
                    remaining < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {new Intl.NumberFormat("nb-NO", {
                    style: "currency",
                    currency: "NOK",
                    maximumFractionDigits: 0,
                  }).format(remaining)}
                </p>
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

        {project.offerId && (
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
        )}

        {/* {project.teamsChannelId && (
          <Card>
            <CardHeader>
              <CardTitle>Microsoft Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-sm text-muted-foreground">
                Dette prosjektet har en dedikert Teams-kanal for samarbeid
              </p>
              {project.teamsChannelUrl && (
                <Button variant="outline" asChild>
                  <a
                    href={project.teamsChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Åpne Teams-kanal
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        )} */}
      </div>
    </AppLayout>
  );
}
