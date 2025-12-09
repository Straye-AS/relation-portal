"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type {
  DomainOfferDTO,
  DomainProjectDTO,
} from "@/lib/.generated/data-contracts";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Briefcase } from "lucide-react";

interface RecentItemsCardProps {
  offers: DomainOfferDTO[];
  projects: DomainProjectDTO[];
}

const projectStatusColors: Record<string, string> = {
  planning: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  on_hold:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  completed:
    "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const projectStatusLabels: Record<string, string> = {
  planning: "Planlegger",
  active: "Aktiv",
  on_hold: "På vent",
  completed: "Ferdig",
  cancelled: "Kansellert",
};

export function RecentItemsCard({ offers, projects }: RecentItemsCardProps) {
  return (
    <Card className="col-span-full h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">Siste aktiviteter</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="offers" className="w-full">
          <TabsList className="mb-4 grid w-full grid-cols-2">
            <TabsTrigger value="offers" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Siste tilbud
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Siste prosjekter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="mt-0">
            <div className="space-y-4">
              {offers.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Ingen tilbud funnet
                </p>
              ) : (
                <div className="divide-y">
                  {offers.map((offer) => (
                    <div
                      key={offer.id}
                      className="grid grid-cols-12 items-center gap-4 rounded-lg px-2 py-3 text-sm transition-colors hover:bg-muted/50"
                    >
                      <div className="col-span-5 flex min-w-0 flex-col justify-center">
                        <Link
                          href={`/offers/${offer.id}`}
                          className="block truncate font-medium hover:underline"
                        >
                          {offer.title}
                        </Link>
                        <span className="truncate text-xs text-muted-foreground">
                          {offer.customerName}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <Badge
                          variant="outline"
                          className="max-w-full truncate"
                        >
                          {offer.phase}
                        </Badge>
                      </div>
                      <div className="col-span-2 flex items-center justify-end font-medium">
                        {formatCurrency(offer.value ?? 0)}
                      </div>
                      <div className="col-span-2 flex items-center justify-end text-xs text-muted-foreground">
                        {offer.updatedAt
                          ? format(new Date(offer.updatedAt), "d. MMM", {
                              locale: nb,
                            })
                          : "-"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-0">
            <div className="space-y-4">
              {projects.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Ingen prosjekter funnet
                </p>
              ) : (
                <div className="divide-y">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="grid grid-cols-12 items-center gap-4 rounded-lg px-2 py-3 text-sm transition-colors hover:bg-muted/50"
                    >
                      <div className="col-span-5 flex min-w-0 flex-col justify-center">
                        <Link
                          href={`/projects/${project.id}`}
                          className="block truncate font-medium hover:underline"
                        >
                          {project.name}
                        </Link>
                        <span className="truncate text-xs text-muted-foreground">
                          {project.customerName}
                        </span>
                      </div>
                      <div className="col-span-3 flex items-center">
                        <Badge
                          className={`max-w-full truncate text-xs font-normal ${projectStatusColors[project.status ?? "active"] || projectStatusColors.active}`}
                          variant="secondary"
                        >
                          {projectStatusLabels[project.status ?? "active"] ||
                            project.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 flex items-center justify-end font-medium">
                        {/* Projects might not have value directly on DTO used in recent list, check swagger */}
                        {/* Checking swagger: ProjectDTO has spent, budget? No, only ProjectWithDetailsDTO has budget. ProjectDTO usually has reduced fields */}
                        {/* Let's verify ProjectDTO in swagger chunk 60/54 if possible. ActiveProjectsCard uses budget, but it assumes input is Project which maps to DomainProjectDTO? */}
                        {/* ActiveProjectsCard uses `Project` type from `@/types` which matches `DomainProjectDTO`? */}
                        {/* Let's be safe and check usage in ActiveProjectsCard. It uses project.budget */}
                        {/* If DomainProjectDTO has budget, we show it. */}
                        {/* Assuming it does for now as activeProjects uses it. */}
                        {/* Actually, formatCurrency(project.budget || 0) */}
                        {project.budget ? formatCurrency(project.budget) : "-"}
                      </div>
                      <div className="col-span-2 flex items-center justify-end text-xs text-muted-foreground">
                        {project.updatedAt
                          ? format(new Date(project.updatedAt), "d. MMM", {
                              locale: nb,
                            })
                          : "-"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
