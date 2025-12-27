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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import { ProjectFileManager } from "@/components/files/entity-file-manager";
import { useQueryParams } from "@/hooks/useQueryParams";

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

  // URL-persisted tab state
  const { params: queryParams, setParam } = useQueryParams({
    tab: { type: "string", default: "overview" },
  });
  const activeTab = queryParams.tab;
  const handleTabChange = (value: string) => setParam("tab", value);

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
          <div className="flex items-start gap-4">
            <Link href="/projects" className="shrink-0">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="min-w-0 flex-1">
              <span className="mb-1 block font-mono text-sm uppercase tracking-wider text-muted-foreground">
                Prosjekt: {project.projectNumber ?? ""}
              </span>
              <h1 className="text-2xl font-bold md:text-3xl">
                <InlineEdit
                  value={project.name || ""}
                  onSave={async (val) => {
                    await updateProjectName.mutateAsync({
                      id: project.id!,
                      data: { name: String(val) },
                    });
                  }}
                  className="-ml-1 border-transparent p-0 text-2xl font-bold hover:border-transparent hover:bg-transparent md:text-3xl"
                />
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <ProjectPhaseBadge
                  phase={project.phase || "tilbud"}
                  className="px-3 py-1"
                />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
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

        <div className="flex-1 overflow-y-auto px-4 py-2 md:px-8">
          <Tabs
            value={activeTab}
            className="w-full space-y-4"
            onValueChange={handleTabChange}
          >
            <div className="sticky top-0 z-30 bg-background pb-2 before:absolute before:-top-96 before:left-0 before:right-0 before:h-96 before:bg-background">
              <TabsList>
                <TabsTrigger value="overview">Oversikt</TabsTrigger>
                <TabsTrigger value="documents">
                  Dokumenter ({project?.fileCount ?? 0})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dokumenter</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProjectFileManager projectId={project.id!} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
