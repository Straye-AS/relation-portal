"use client";

/**
 * Projects Hooks
 *
 * React Query hooks for project CRUD operations.
 * Uses the generated API client for backend communication.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyStore } from "@/store/company-store";
import type {
  DomainUpdateProjectNameRequest,
  DomainUpdateProjectDescriptionRequest,
  ProjectsListParams,
} from "@/lib/.generated/data-contracts";
import type {
  CreateProjectRequest as DomainCreateProjectRequest,
  UpdateProjectRequest as DomainUpdateProjectRequest,
} from "@/lib/api/types";

/**
 * Fetch paginated list of projects
 */
export function useProjects(
  params?: Partial<ProjectsListParams>,
  options?: { enabled?: boolean }
) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["projects", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.projects.projectsList((params as any) ?? {});

      return response.data;
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Fetch all projects (non-paginated, for dropdowns etc.)
 */
export function useAllProjects() {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["projects", "all", selectedCompanyId],
    queryFn: async () => {
      // Fetch with large page size to get all
      const response = await api.projects.projectsList({ pageSize: 1000 });
      return response.data?.data ?? [];
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Fetch single project by ID
 */
export function useProject(id: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["projects", id, selectedCompanyId],
    queryFn: async () => {
      const response = await api.projects.projectsDetail({ id });
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });
}

// Note: useProjectBudget removed - budget tracking has moved to offers

/**
 * Fetch offers linked to a project
 */
export function useProjectOffers(projectId: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["projects", projectId, "offers", selectedCompanyId],
    queryFn: async () => {
      const response = await api.projects.offersList({ id: projectId });
      return response.data;
    },
    enabled: !!projectId && isAuthenticated,
  });
}

/**
 * Create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (data: DomainCreateProjectRequest) => {
      const response = await api.projects.projectsCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Prosjekt opprettet");
    },
    onError: (error: Error) => {
      console.error("Failed to create project:", error);
      toast.error("Kunne ikke opprette prosjekt");
    },
  });
}

/**
 * Update an existing project
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateProjectRequest;
    }) => {
      const response = await api.projects.projectsUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
      toast.success("Prosjekt oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update project:", error);
      toast.error("Kunne ikke oppdatere prosjekt");
    },
  });
}

/**
 * Update project name
 */
export function useUpdateProjectName() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateProjectNameRequest;
    }) => {
      const response = await api.projects.nameUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
      toast.success("Prosjektnavn oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update project name:", error);
      toast.error("Kunne ikke oppdatere prosjektnavn");
    },
  });
}

/**
 * Update project description
 */
export function useUpdateProjectDescription() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateProjectDescriptionRequest;
    }) => {
      const response = await api.projects.descriptionUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
      toast.success("Beskrivelse oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update description:", error);
      toast.error("Kunne ikke oppdatere beskrivelse");
    },
  });
}

/**
 * Delete a project
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.projects.projectsDelete({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Prosjekt slettet");
    },
    onError: (error: Error) => {
      console.error("Failed to delete project:", error);
      toast.error("Kunne ikke slette prosjekt");
    },
  });
}

/**
 * Update project status
 */
/**
 * Update project phase
 */
export function useUpdateProjectPhase() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, phase }: { id: string; phase: string }) => {
      const response = await api.projects.phaseUpdate(
        { id },
        {
          phase: phase as Parameters<
            typeof api.projects.phaseUpdate
          >[1]["phase"],
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
      toast.success("Prosjektfase oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update project phase:", error);
      toast.error("Kunne ikke oppdatere prosjektfase");
    },
  });
}

// Note: useInheritProjectBudget and useResyncProjectFromOffer removed
// Budget and execution tracking has moved from projects to offers

// Note: useUpdateProjectManager removed - manager update not available in current API
