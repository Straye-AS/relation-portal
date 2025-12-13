"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useProjects, useDeleteProject } from "@/hooks/useProjects";
import type { DomainProjectDTO } from "@/lib/.generated/data-contracts";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import Link from "next/link";
import { Plus } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { PROJECT_STATUS_LABELS } from "@/lib/api/types";

import { ProjectListTable } from "@/components/projects/project-list-table";
import { PaginationControls } from "@/components/pagination-controls";

export default function ProjectsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data, isLoading } = useProjects({
    page,
    pageSize,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any,
    status: statusFilter === "all" ? undefined : (statusFilter as any),
  });

  const deleteProject = useDeleteProject();
  const projects = (data?.data ?? []) as DomainProjectDTO[];

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] =
    useState<DomainProjectDTO | null>(null);

  const handleDeleteClick = (
    project: DomainProjectDTO,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("asc");
    }
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete?.id) {
      await deleteProject.mutateAsync(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={(val) => {
                setStatusFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle statuser</SelectItem>
                {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {statusFilter !== "all" && (
              <Button
                variant="ghost"
                onClick={() => {
                  setStatusFilter("all");
                  setPage(1);
                }}
                className="px-2 lg:px-3"
              >
                Nullstill
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
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
            {statusFilter !== "all" ? (
              <p className="text-muted-foreground">
                Ingen prosjekter med valgt status
              </p>
            ) : (
              <>
                <p className="text-muted-foreground">Ingen prosjekter funnet</p>
                <Link href="/projects/new">
                  <Button className="mt-4">Opprett ditt første prosjekt</Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <ProjectListTable
            projects={projects}
            onProjectClick={(project) => router.push(`/projects/${project.id}`)}
            onDeleteClick={handleDeleteClick}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        )}

        {
          /* Pagination */
          data && (
            <PaginationControls
              currentPage={page}
              totalPages={Math.ceil((data.total ?? 0) / pageSize)}
              onPageChange={setPage}
              pageSize={pageSize}
              totalCount={data.total ?? 0}
              entityName="prosjekter"
            />
          )
        }

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setProjectToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          title="Slett prosjekt"
          description="Er du sikker på at du vil slette dette prosjektet? Dette vil fjerne prosjektet, alle relaterte timer og data permanent."
          itemTitle={projectToDelete?.name}
          isLoading={deleteProject.isPending}
        />
      </div>
    </AppLayout>
  );
}
