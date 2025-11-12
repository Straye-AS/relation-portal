"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useProjects } from "@/hooks/useProjects";
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
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Eye } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

const statusColors: Record<string, string> = {
  Planning: "bg-yellow-500",
  Active: "bg-green-500",
  OnHold: "bg-orange-500",
  Completed: "bg-blue-500",
  Cancelled: "bg-red-500",
};

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects();

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
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">Ingen prosjekter funnet</p>
            <Link href="/projects/new">
              <Button className="mt-4">Opprett ditt første prosjekt</Button>
            </Link>
          </div>
        ) : (
          <div className="border rounded-lg">
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
                  <TableHead className="text-right">Handling</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => {
                  const spentPercentage =
                    (project.spent / project.budget) * 100;
                  return (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">
                        {project.name}
                      </TableCell>
                      <TableCell>{project.customerName}</TableCell>
                      <TableCell>
                        <Badge
                          className={statusColors[project.status]}
                          variant="secondary"
                        >
                          {project.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{project.managerName}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat("nb-NO", {
                          style: "currency",
                          currency: "NOK",
                          maximumFractionDigits: 0,
                        }).format(project.budget)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm">
                            {new Intl.NumberFormat("nb-NO", {
                              style: "currency",
                              currency: "NOK",
                              maximumFractionDigits: 0,
                            }).format(project.spent)}
                          </span>
                          <div className="w-full max-w-[100px] bg-muted rounded-full h-2">
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
                        {format(new Date(project.startDate), "dd.MM.yyyy", {
                          locale: nb,
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/projects/${project.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
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
