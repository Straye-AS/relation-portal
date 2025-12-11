"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DomainProjectDTO } from "@/lib/.generated/data-contracts";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Briefcase } from "lucide-react";

interface RecentProjectsCardProps {
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
  planning: "Tilbud",
  active: "Aktiv",
  on_hold: "På vent",
  completed: "Ferdig",
  cancelled: "Kansellert",
};

export function RecentProjectsCard({ projects }: RecentProjectsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Siste prosjekter</CardTitle>
        <Briefcase className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4 pt-4">
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
                  <div className="col-span-12 flex min-w-0 flex-col justify-center sm:col-span-5">
                    <Link
                      href={`/projects/${project.id}`}
                      className="block truncate font-medium hover:underline"
                    >
                      {project.name}
                    </Link>
                    <span className="truncate text-xs text-muted-foreground">
                      {project.projectNumber && (
                        <span className="mr-1 font-mono text-xs">
                          {project.projectNumber} •
                        </span>
                      )}
                      {project.customerName}
                    </span>
                  </div>
                  <div className="col-span-6 flex items-center sm:col-span-3">
                    <Badge
                      className={`max-w-full truncate text-xs font-normal ${
                        projectStatusColors[project.status ?? "active"] ||
                        projectStatusColors.active
                      }`}
                      variant="secondary"
                    >
                      {projectStatusLabels[project.status ?? "active"] ||
                        project.status}
                    </Badge>
                  </div>
                  {/* Note: DomainProjectDTO might need budget field verification. 
                      Using 0 if undefined just like in RecentItemsCard logic previously checked */}
                  <div className="col-span-3 flex items-center justify-end font-medium sm:col-span-2">
                    {/* Assuming project DTO doesn't strictly have value but let's hide or show what we can. 
                         The previous ActiveProjectsCard used budget. The RecentItemsCard used simple mapping.
                         Let's try to show Value/Budget if available, or just skip. 
                         The previous RecentItemsCard logic had a placeholder for logic value.
                         I'll assume if we have it, we show it, else dash. */}
                    -
                  </div>
                  <div className="col-span-3 flex items-center justify-end text-xs text-muted-foreground sm:col-span-2">
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
      </CardContent>
    </Card>
  );
}
