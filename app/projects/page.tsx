"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useProjects, useDeleteProject } from "@/hooks/useProjects";
import { useCompanyStore } from "@/store/company-store";
import { ProjectPhaseBadge } from "@/components/projects/project-phase-badge";

import type { Project } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import Link from "next/link";
import { Plus } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { useQueryParams } from "@/hooks/useQueryParams";

// Lazy load modal to reduce initial bundle size
const AddOfferModal = dynamic(
  () =>
    import("@/components/offers/add-offer-modal").then(
      (mod) => mod.AddOfferModal
    ),
  { ssr: false }
);
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

// URL parameter schema for projects page
const projectsParamsSchema = {
  page: { type: "number" as const, default: 1 },
  phase: { type: "string" as const, default: "all" },
  company: { type: "string" as const, default: "all" },
};

function ProjectsPageContent() {
  const router = useRouter();
  const { params, setParam, setParams, resetParams } =
    useQueryParams(projectsParamsSchema);

  const { page, phase: phaseFilter, company: companyFilter } = params;
  const { selectedCompanyId } = useCompanyStore();
  const showCompanyFilter =
    selectedCompanyId === "all" || selectedCompanyId === "gruppen";
  const pageSize = 20;

  const { data, isLoading } = useProjects({
    page,
    pageSize,
    sortBy: "updatedAt" as unknown as undefined,
    sortOrder: "desc" as unknown as undefined,
    phase:
      phaseFilter === "all" ? undefined : (phaseFilter as unknown as undefined),
  });

  const deleteProject = useDeleteProject();
  const projects = useMemo(() => {
    const list = [...((data?.data ?? []) as Project[])];
    return list.sort((a, b) => {
      const dateA = new Date(a.updatedAt ?? 0).getTime();
      const dateB = new Date(b.updatedAt ?? 0).getTime();
      if (dateA !== dateB) return dateB - dateA;
      return (b.projectNumber ?? "").localeCompare(
        a.projectNumber ?? "",
        undefined,
        { numeric: true }
      );
    });
  }, [data?.data]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Phase Filter
      // Note: We also send this to API, but filtering here ensures consistency if API ignores it
      if (phaseFilter !== "all" && project.phase !== phaseFilter) return false;

      return true;
    });
  }, [projects, phaseFilter]);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [selectedProjectForOffer, setSelectedProjectForOffer] =
    useState<Project | null>(null);

  const handleDeleteClick = (project: Project, e: React.MouseEvent) => {
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

  const handlePageChange = (newPage: number) => {
    setParam("page", newPage);
  };

  const handlePhaseChange = (value: string) => {
    setParams({ phase: value, page: 1 });
  };

  const handleCompanyChange = (value: string) => {
    setParams({ company: value, page: 1 });
  };

  const handleResetFilters = () => {
    resetParams();
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
            {showCompanyFilter && (
              <Select value={companyFilter} onValueChange={handleCompanyChange}>
                <SelectTrigger className="w-[200px] bg-card">
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
            )}

            {/* Phase Filter */}
            <Select value={phaseFilter} onValueChange={handlePhaseChange}>
              <SelectTrigger className="w-[180px] bg-card">
                <SelectValue placeholder="Fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle faser</SelectItem>
                {Object.keys(PROJECT_PHASE_LABELS).map((key) => (
                  <SelectItem key={key} value={key}>
                    <ProjectPhaseBadge phase={key} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(phaseFilter !== "all" || companyFilter !== "all") && (
              <Button
                variant="ghost"
                onClick={handleResetFilters}
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
                        Opprett ditt forste prosjekt
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
                  onPageChange={handlePageChange}
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
              description="Er du sikker pa at du vil slette dette prosjektet? Dette vil fjerne prosjektet, all data, og alle linker til tilknyttede tilbud permanent."
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

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <AppLayout disableScroll>
          <div className="flex h-full flex-col">
            <div className="flex-none space-y-4 border-b bg-background px-4 py-4 md:px-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">Prosjekter</h1>
                  <p className="text-muted-foreground">
                    Oversikt over alle prosjekter og deres status
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
              <TableSkeleton rows={10} columns={7} />
            </div>
          </div>
        </AppLayout>
      }
    >
      <ProjectsPageContent />
    </Suspense>
  );
}
