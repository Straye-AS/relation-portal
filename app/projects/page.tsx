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
import { AddOfferModal } from "@/components/offers/add-offer-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { PROJECT_PHASE_LABELS, COMPANIES } from "@/lib/api/types";

import { ProjectListTable } from "@/components/projects/project-list-table";
import { PaginationControls } from "@/components/pagination-controls";
import { useMemo } from "react";

export default function ProjectsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [phaseFilter, setPhaseFilter] = useState<string>("all");
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  const { data, isLoading } = useProjects({
    page,
    pageSize,
    sortBy: "updatedAt" as any,
    sortOrder: "desc" as any,
    phase: phaseFilter === "all" ? undefined : (phaseFilter as any),
  });

  const deleteProject = useDeleteProject();
  const projects = useMemo(
    () => (data?.data ?? []) as DomainProjectDTO[],
    [data?.data]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // 1. Phase Filter
      // Note: We also send this to API, but filtering here ensures consistency if API ignores it
      if (phaseFilter !== "all" && project.phase !== phaseFilter) return false;

      // 2. Company Filter
      if (companyFilter !== "all" && project.companyId !== companyFilter)
        return false;

      return true;
    });
  }, [projects, phaseFilter, companyFilter]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] =
    useState<DomainProjectDTO | null>(null);

  const [selectedProjectForOffer, setSelectedProjectForOffer] =
    useState<DomainProjectDTO | null>(null);

  const handleDeleteClick = (
    project: DomainProjectDTO,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (projectToDelete?.id) {
      await deleteProject.mutateAsync(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <AppLayout disableScroll>
      <div className="flex h-full flex-col">
        <div className="flex-none space-y-4 border-b bg-background px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Prosjekter{" "}
                <span className="text-sm text-muted-foreground">
                  ({data?.total ?? 0})
                </span>
              </h1>
              <p className="text-muted-foreground">
                Oversikt over alle prosjekter og deres status
              </p>
            </div>
            <Link href="/projects/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nytt prosjekt
              </Button>
            </Link>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Company Filter */}
            <Select
              value={companyFilter}
              onValueChange={(val) => {
                setCompanyFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Selskap" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(COMPANIES).map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    <div className="flex items-center gap-2">
                      {company.id !== "all" && (
                        <div
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: company.color }}
                        />
                      )}
                      <span>{company.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Phase Filter */}
            <Select
              value={phaseFilter}
              onValueChange={(val) => {
                setPhaseFilter(val);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle faser</SelectItem>
                {Object.entries(PROJECT_PHASE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(phaseFilter !== "all" || companyFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={() => {
                  setPhaseFilter("all");
                  setCompanyFilter("all");
                  setPage(1);
                }}
                className="px-2 lg:px-3"
              >
                Nullstill
                <X className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="space-y-6">
            {isLoading ? (
              <TableSkeleton rows={10} columns={7} />
            ) : !filteredProjects || filteredProjects.length === 0 ? (
              <div className="rounded-lg border bg-muted/20 py-12 text-center">
                {phaseFilter !== "all" || companyFilter !== "all" ? (
                  <p className="text-muted-foreground">
                    Ingen prosjekter med valgte filtre
                  </p>
                ) : (
                  <>
                    <p className="text-muted-foreground">
                      Ingen prosjekter funnet
                    </p>
                    <Link href="/projects/new">
                      <Button className="mt-4">
                        Opprett ditt første prosjekt
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <ProjectListTable
                projects={filteredProjects}
                onProjectClick={(project) =>
                  router.push(`/projects/${project.id}`)
                }
                onDeleteClick={handleDeleteClick}
                onCreateOfferClick={(project, e) => {
                  e.stopPropagation();
                  setSelectedProjectForOffer(project);
                }}
                showRelativeDate
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

            <AddOfferModal
              open={!!selectedProjectForOffer}
              onOpenChange={(open) => {
                if (!open) setSelectedProjectForOffer(null);
              }}
              defaultProjectId={selectedProjectForOffer?.id}
              defaultCustomerId={selectedProjectForOffer?.customerId}
              showCustomerWarning={true}
              hideTrigger
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
