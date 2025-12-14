"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DomainProjectDTO } from "@/lib/.generated/data-contracts";
import { Briefcase } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatRelativeDate } from "@/lib/utils";
import { ProjectPhaseBadge } from "@/components/projects/project-phase-badge";

interface RecentProjectsCardProps {
  projects: DomainProjectDTO[];
}

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
                      {project.customerName}
                    </span>
                  </div>
                  <div className="col-span-6 flex items-center sm:col-span-3">
                    <ProjectPhaseBadge
                      phase={project.phase || "active"}
                      className="max-w-full truncate"
                    />
                  </div>
                  <div className="col-span-3 flex items-center justify-end font-medium sm:col-span-2">
                    {formatCurrency(project.value ?? 0)}
                  </div>
                  <div className="col-span-3 flex items-center justify-end text-xs text-muted-foreground sm:col-span-2">
                    {formatRelativeDate(project.updatedAt)}
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
