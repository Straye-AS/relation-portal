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
import { Trash2, FileText } from "lucide-react";

import { ProjectPhaseBadge } from "@/components/projects/project-phase-badge";
import { NewBadge } from "@/components/ui/new-badge";
import { CompanyBadge } from "@/components/ui/company-badge";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import type { DomainProjectDTO } from "@/lib/.generated/data-contracts";

interface ProjectListTableProps {
  projects: DomainProjectDTO[];
  onProjectClick: (project: DomainProjectDTO) => void;
  onDeleteClick?: (project: DomainProjectDTO, e: React.MouseEvent) => void;
  onCreateOfferClick?: (project: DomainProjectDTO, e: React.MouseEvent) => void;
  showRelativeDate?: boolean;
}

export function ProjectListTable({
  projects,
  onProjectClick,
  onDeleteClick,
  onCreateOfferClick,
  compact = false,
  showRelativeDate = false,
}: ProjectListTableProps & { compact?: boolean; showRelativeDate?: boolean }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nr.</TableHead>
            <TableHead>Navn</TableHead>
            <TableHead>Kunde</TableHead>
            <TableHead>Selskap</TableHead>
            <TableHead>Fase</TableHead>
            {!compact && (
              <>
                <TableHead>Prosjektleder</TableHead>
                <TableHead>Verdi</TableHead>
                <TableHead>DG</TableHead>
              </>
            )}
            {showRelativeDate && <TableHead>Oppdatert</TableHead>}
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
            const value = project.value ?? 0;

            const marginPercentage = project.marginPercent ?? 0;

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
                  <ProjectPhaseBadge phase={project.phase ?? ""} />
                </TableCell>
                {!compact && (
                  <>
                    <TableCell className="whitespace-nowrap">
                      {project.managerName || (
                        <span className="italic text-muted-foreground">
                          Ikke satt
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {new Intl.NumberFormat("nb-NO", {
                        style: "currency",
                        currency: "NOK",
                        maximumFractionDigits: 0,
                      }).format(value)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-medium ${
                          marginPercentage < 0
                            ? "text-destructive"
                            : "text-green-600"
                        }`}
                      >
                        {new Intl.NumberFormat("nb-NO", {
                          style: "percent",
                          maximumFractionDigits: 1,
                        }).format(marginPercentage / 100)}
                      </span>
                    </TableCell>
                  </>
                )}
                {showRelativeDate && (
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {project.updatedAt
                      ? formatDistanceToNow(new Date(project.updatedAt), {
                          addSuffix: true,
                          locale: nb,
                        })
                      : "-"}
                  </TableCell>
                )}
                {/* Actions */}
                <TableCell
                  className="flex justify-end gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {onCreateOfferClick && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={(e) => onCreateOfferClick(project, e)}
                      title="Opprett tilbud"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                  {onDeleteClick && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => onDeleteClick(project, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
