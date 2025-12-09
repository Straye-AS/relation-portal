"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ProjectStatusBadge } from "@/components/projects/project-status-badge";
import { NewBadge } from "@/components/ui/new-badge";
import { CompanyBadge } from "@/components/ui/company-badge";
import type { DomainProjectDTO } from "@/lib/.generated/data-contracts";

interface ProjectListTableProps {
  projects: DomainProjectDTO[];
  onProjectClick: (project: DomainProjectDTO) => void;
  onDeleteClick?: (project: DomainProjectDTO, e: React.MouseEvent) => void;
}

export function ProjectListTable({
  projects,
  onProjectClick,
  onDeleteClick,
  compact = false,
}: ProjectListTableProps & { compact?: boolean }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nr.</TableHead>
            <TableHead>Navn</TableHead>
            <TableHead>Kunde</TableHead>
            <TableHead>Selskap</TableHead>
            <TableHead>Status</TableHead>
            {!compact && (
              <>
                <TableHead>Prosjektleder</TableHead>
                <TableHead>Budsjett</TableHead>
                <TableHead>Brukt</TableHead>
                <TableHead>Startdato</TableHead>
              </>
            )}
            {onDeleteClick && <TableHead className="w-[50px]"></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const budget = project.budget ?? 0;
            const spent = project.spent ?? 0;
            const spentPercentage = budget > 0 ? (spent / budget) * 100 : 0;
            return (
              <TableRow
                key={project.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onProjectClick(project)}
              >
                <TableCell className="whitespace-nowrap font-mono text-sm text-muted-foreground">
                  {project.projectNumber || "-"}
                </TableCell>
                <TableCell className="whitespace-nowrap font-medium">
                  {project.name}
                  <NewBadge createdAt={project.createdAt} />
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {project.customerName}
                </TableCell>
                <TableCell>
                  <CompanyBadge companyId={project.companyId} />
                </TableCell>
                <TableCell>
                  <ProjectStatusBadge status={project.status ?? ""} />
                </TableCell>
                {!compact && (
                  <>
                    <TableCell className="whitespace-nowrap">
                      {project.managerName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
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
                            minimumFractionDigits: 0,
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
                        new Date(project.startDate ?? new Date().toISOString()),
                        "dd.MM.yyyy",
                        {
                          locale: nb,
                        }
                      )}
                    </TableCell>
                  </>
                )}
                {onDeleteClick && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => onDeleteClick(project, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
