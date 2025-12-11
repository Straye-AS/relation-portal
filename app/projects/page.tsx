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

import { ProjectListTable } from "@/components/projects/project-list-table";
import { PaginationControls } from "@/components/pagination-controls";

export default function ProjectsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading } = useProjects({
    page,
    pageSize,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any,
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
