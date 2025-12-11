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
  DomainCreateProjectRequest,
  DomainUpdateProjectRequest,
  ProjectsListParams,
} from "@/lib/.generated/data-contracts";

/**
 * Fetch paginated list of projects
 */
export function useProjects(params?: Partial<ProjectsListParams>) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["projects", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.projects.projectsList(params ?? {});

      return response.data;
    },
    enabled: isAuthenticated,
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

/**
 * Fetch project budget summary
 */
export function useProjectBudget(projectId: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["projects", projectId, "budget", selectedCompanyId],
    queryFn: async () => {
      const response = await api.projects.budgetList({ id: projectId });
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
export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.projects.statusUpdate(
        { id },
        {
          status: status as Parameters<
            typeof api.projects.statusUpdate
          >[1]["status"],
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
      toast.success("Prosjektstatus oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update project status:", error);
      toast.error("Kunne ikke oppdatere prosjektstatus");
    },
  });
}

/**
 * Inherit budget from linked offer
 */
export function useInheritProjectBudget() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, offerId }: { id: string; offerId: string }) => {
      const response = await api.projects.inheritBudgetCreate(
        { id },
        { offerId }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["projects", variables.id, "budget"],
      });
      toast.success("Budsjett arvet fra tilbud");
    },
    onError: (error: Error) => {
      console.error("Failed to inherit budget:", error);
      toast.error("Kunne ikke arve budsjett");
    },
  });
}
