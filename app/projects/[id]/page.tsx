"use client";

import dynamic from "next/dynamic";
import { AppLayout } from "@/components/layout/app-layout";
import {
  useProject,
  useUpdateProjectName,
  useProjectOffers,
} from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CardSkeleton } from "@/components/ui/card-skeleton";

// Lazy load modal to reduce initial bundle size
const AddOfferModal = dynamic(
  () =>
    import("@/components/offers/add-offer-modal").then(
      (mod) => mod.AddOfferModal
    ),
  { ssr: false }
);

import Link from "next/link";
import { ArrowLeft, CalendarDays, Plus } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { use, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Added table imports
import { OfferRow } from "@/components/offers/offer-row";
import { ProjectPhaseBadge } from "@/components/projects/project-phase-badge";
import { useUsers } from "@/hooks/useUsers";

import { Badge } from "@/components/ui/badge";
import { InlineEdit } from "@/components/ui/inline-edit";
import { ProjectDescription } from "@/components/projects/project-description";

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: project, isLoading } = useProject(resolvedParams.id);
  const { data: connectedOffers = [] } = useProjectOffers(resolvedParams.id);

  useUsers();
  const updateProjectName = useUpdateProjectName();
  const [isCreateOfferModalOpen, setIsCreateOfferModalOpen] = useState(false);

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

  // Note: Finance tracking has moved to offers
  // Projects now focus on structure and offer management

  return (
    <AppLayout disableScroll>
      <div className="flex h-full flex-col">
        <div className="flex-none border-b bg-background px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/projects">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <span className="mb-1 hidden font-mono text-sm uppercase tracking-wider text-muted-foreground md:block">
                  Prosjekt: {project.projectNumber ?? ""}
                </span>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">
                    <InlineEdit
                      value={project.name || ""}
                      onSave={async (val) => {
                        await updateProjectName.mutateAsync({
                          id: project.id!,
                          data: { name: String(val) },
                        });
                      }}
                      className="-ml-1 border-transparent p-0 text-3xl font-bold hover:border-transparent hover:bg-transparent"
                    />
                  </h1>
                  <ProjectPhaseBadge
                    phase={project.phase || "tilbud"}
                    className="px-3 py-1 text-base"
                  />
                </div>
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
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1">
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
                      {project.customerName ?? (
                        <span className="text-muted-foreground">
                          {project.offerCount && project.offerCount > 1
                            ? "Flere"
                            : "Ikke satt"}
                        </span>
                      )}
                    </Link>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Fase</p>
                    <ProjectPhaseBadge
                      phase={project.phase || "tilbud"}
                      className="mt-1"
                    />
                  </div>
                  {/* Note: Manager field removed - not in current API schema */}

                  <div>
                    <p className="text-sm text-muted-foreground">Periode</p>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <p className="font-medium">
                        {format(
                          new Date(
                            project.startDate ?? new Date().toISOString()
                          ),
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
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-2 border-t bg-muted/30 px-6 py-4 text-xs text-muted-foreground">
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-28 shrink-0">Opprettet av</span>
                      {project.createdByName ?? (
                        <Badge
                          variant="secondary"
                          className="h-4 px-1 text-[10px]"
                        >
                          System
                        </Badge>
                      )}
                    </div>
                    <span>
                      {project.createdAt
                        ? format(
                            new Date(project.createdAt),
                            "dd.MM.yyyy HH:mm"
                          )
                        : "Ukjent"}
                    </span>
                  </div>
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-28 shrink-0">Sist oppdatert av</span>
                      {project.updatedByName ?? (
                        <Badge
                          variant="secondary"
                          className="h-4 px-1 text-[10px]"
                        >
                          System
                        </Badge>
                      )}
                    </div>
                    <span>
                      {project.updatedAt
                        ? format(
                            new Date(project.updatedAt),
                            "dd.MM.yyyy HH:mm"
                          )
                        : "Ukjent"}
                    </span>
                  </div>
                </CardFooter>
              </Card>

              {/* Finance card removed - finance tracking has moved to offers */}
            </div>

            <ProjectDescription
              projectId={project.id!}
              initialDescription={project.description || ""}
            />

            {/* List of Connected Offers */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  Tilknyttede tilbud ({connectedOffers.length})
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={() => setIsCreateOfferModalOpen(true)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Opprett tilbud
                </Button>
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
                          <TableHead>Sendt</TableHead>
                          <TableHead>Frist</TableHead>
                          <TableHead>Verdi</TableHead>
                          <TableHead>Margin (DG)</TableHead>
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
        </div>
      </div>

      <AddOfferModal
        open={isCreateOfferModalOpen}
        onOpenChange={setIsCreateOfferModalOpen}
        defaultProjectId={project.id}
        hideTrigger
      />
    </AppLayout>
  );
}
