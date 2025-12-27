"use client";

import dynamic from "next/dynamic";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

// Lazy load modal to reduce initial bundle size
const AddProjectModal = dynamic(
  () =>
    import("@/components/projects/add-project-modal").then(
      (mod) => mod.AddProjectModal
    ),
  { ssr: false }
);
import { ProjectListTable } from "@/components/projects/project-list-table";
import { PaginationControls } from "@/components/pagination-controls";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import { PROJECT_PHASE_LABELS } from "@/lib/api/types";
import { useCustomerProjects } from "@/hooks/useCustomers";
import type { Project } from "@/lib/api/types";
import {
  SortByEnum3,
  SortOrderEnum2,
  PhaseEnum1,
} from "@/lib/.generated/data-contracts";

interface CustomerProjectsTabProps {
  customerId: string;
}

export function CustomerProjectsTab({ customerId }: CustomerProjectsTabProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [phaseFilter, setPhaseFilter] = useState<string>("all");

  const { data, isLoading } = useCustomerProjects(customerId, {
    page,
    pageSize,
    sortBy: SortByEnum3.UpdatedAt,
    sortOrder: SortOrderEnum2.Desc,
    phase: phaseFilter === "all" ? undefined : (phaseFilter as PhaseEnum1),
  });

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
      if (phaseFilter !== "all" && project.phase !== phaseFilter) return false;
      return true;
    });
  }, [projects, phaseFilter]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>Prosjekter</CardTitle>
          <CardDescription>
            Liste over alle prosjekter for denne kunden
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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

          {phaseFilter !== "all" && (
            <Button
              variant="ghost"
              onClick={() => {
                setPhaseFilter("all");
                setPage(1);
              }}
              className="px-2 lg:px-3"
            >
              Nullstill
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}

          <AddProjectModal
            defaultCustomerId={customerId}
            lockedCustomerId={customerId}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : filteredProjects.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            {phaseFilter !== "all"
              ? "Ingen prosjekter med valgt filter."
              : "Ingen prosjekter registrert."}
          </div>
        ) : (
          <div className="space-y-6">
            <ProjectListTable
              projects={filteredProjects}
              onProjectClick={(project) =>
                router.push(`/projects/${project.id}`)
              }
              showRelativeDate
            />
            {data && (
              <PaginationControls
                currentPage={page}
                totalPages={Math.ceil((data.total ?? 0) / pageSize)}
                onPageChange={setPage}
                pageSize={pageSize}
                totalCount={data.total ?? 0}
                entityName="prosjekter"
              />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
