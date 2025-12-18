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
import { formatDistanceToNow, format } from "date-fns";
import { nb } from "date-fns/locale";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Project } from "@/lib/api/types";

interface ProjectListTableProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  onDeleteClick?: (project: Project, e: React.MouseEvent) => void;
  onCreateOfferClick?: (project: Project, e: React.MouseEvent) => void;
  showRelativeDate?: boolean;
}

export function ProjectListTable({
  projects,
  onProjectClick,
  onDeleteClick,
  onCreateOfferClick,
  showRelativeDate = false,
}: ProjectListTableProps & { compact?: boolean; showRelativeDate?: boolean }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nr.</TableHead>
            <TableHead>Navn</TableHead>
            <TableHead>Kunde</TableHead>
            <TableHead>Fase</TableHead>
            <TableHead className="text-center">Antall tilbud</TableHead>
            {showRelativeDate && <TableHead>Oppdatert</TableHead>}
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => {
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
                  {project.customerName ?? (
                    <span className="text-muted-foreground">
                      {project.offerCount && project.offerCount > 1
                        ? "Flere"
                        : "Ikke satt"}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <ProjectPhaseBadge phase={project.phase ?? ""} />
                </TableCell>
                <TableCell className="text-center">
                  {project.offerCount ?? 0}
                </TableCell>
                {showRelativeDate && (
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {project.updatedAt ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help underline decoration-muted-foreground/30 decoration-dotted underline-offset-4">
                            {formatDistanceToNow(new Date(project.updatedAt), {
                              addSuffix: true,
                              locale: nb,
                            })}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          {format(
                            new Date(project.updatedAt),
                            "d. MMMM yyyy HH:mm",
                            {
                              locale: nb,
                            }
                          )}
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      "-"
                    )}
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
