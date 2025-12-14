"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/types";
import { Briefcase, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActiveProjectsCardProps {
  projects: Project[];
}

const statusColors: Record<string, string> = {
  tilbud: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  working: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  active: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  completed:
    "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export function ActiveProjectsCard({ projects }: ActiveProjectsCardProps) {
  const router = useRouter();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("nb-NO", {
      style: "currency",
      currency: "NOK",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Aktive Prosjekter</CardTitle>
        <Briefcase className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects.length === 0 && (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Ingen aktive prosjekter
            </p>
          )}
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="group flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-sm font-semibold">
                    {project.name}
                  </h3>
                  <Badge
                    className={`text-xs ${statusColors[project.phase || "active"]}`}
                  >
                    {project.phase}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {project.customerName} • {project.managerName}
                </p>
                {project.teamsChannelUrl && (
                  <a
                    href={project.teamsChannelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Teams-kanal
                  </a>
                )}
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-bold">
                  {formatCurrency(project.budget)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(project.spent)} brukt
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
