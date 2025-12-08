"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useProjects } from "@/hooks/useProjects";
import type { DomainProjectDTO } from "@/lib/.generated/data-contracts";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { NewBadge } from "@/components/ui/new-badge";
import { useRouter } from "next/navigation";

export default function ProjectsPage() {
  const router = useRouter();
  const { data: rawProjects, isLoading } = useProjects();
  const projects = rawProjects as DomainProjectDTO[] | undefined;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Prosjekter</h1>
            <p className="text-muted-foreground">
              Oversikt over alle prosjekter og deres fremdrift
            </p>
          </div>
          <Link href="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nytt prosjekt
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <TableSkeleton rows={10} columns={7} />
        ) : !projects || projects.length === 0 ? (
          <div className="rounded-lg border bg-muted/20 py-12 text-center">
            <p className="text-muted-foreground">Ingen prosjekter funnet</p>
            <Link href="/projects/new">
              <Button className="mt-4">Opprett ditt første prosjekt</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Navn</TableHead>
                  <TableHead>Kunde</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prosjektleder</TableHead>
                  <TableHead>Budsjett</TableHead>
                  <TableHead>Brukt</TableHead>
                  <TableHead>Startdato</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects?.map((project) => {
                  const budget = project.budget ?? 0;
                  const spent = project.spent ?? 0;
                  const spentPercentage =
                    budget > 0 ? (spent / budget) * 100 : 0;
                  return (
                    <TableRow
                      key={project.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/projects/${project.id}`)}
                    >
                      <TableCell className="font-medium">
                        {project.name}
                        <NewBadge createdAt={project.createdAt} />
                      </TableCell>
                      <TableCell>{project.customerName}</TableCell>
                      <TableCell>
                        <ProjectStatusBadge status={project.status ?? ""} />
                      </TableCell>
                      <TableCell>{project.managerName}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("nb-NO", {
                          style: "currency",
                          currency: "NOK",
                          maximumFractionDigits: 0,
                        }).format(budget)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">
                            {new Intl.NumberFormat("nb-NO", {
                              style: "currency",
                              currency: "NOK",
                              maximumFractionDigits: 0,
                            }).format(spent)}
                          </span>
                          <div className="h-2 w-full max-w-[100px] rounded-full bg-muted">
                            <div
                              className={`h-2 rounded-full ${
                                spentPercentage > 90
                                  ? "bg-red-500"
                                  : spentPercentage > 75
                                    ? "bg-orange-500"
                                    : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(spentPercentage, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(
                          new Date(
                            project.startDate ?? new Date().toISOString()
                          ),
                          "dd.MM.yyyy",
                          {
                            locale: nb,
                          }
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
