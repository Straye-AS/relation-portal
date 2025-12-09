"use client";

/**
 * Activities Hooks
 *
 * React Query hooks for activity/task operations.
 * Activities represent meetings, calls, emails, tasks, and notes.
 * Uses the generated API client for backend communication.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyStore } from "@/store/company-store";
import type {
  DomainCreateActivityRequest,
  DomainUpdateActivityRequest,
  ActivitiesListParams,
  MyTasksListParams,
  UpcomingListParams,
} from "@/lib/.generated/data-contracts";

/**
 * Fetch paginated list of activities
 */
export function useActivities(params?: Partial<ActivitiesListParams>) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["activities", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.activities.activitiesList(params ?? {});
      return response.data;
    },
    enabled: isAuthenticated,
  });
}

/**
 * Fetch my tasks (activities assigned to current user)
 */
export function useMyTasks(params?: Partial<MyTasksListParams>) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["activities", "my-tasks", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.activities.myTasksList(params ?? {});
      return response.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Poll every 30 seconds
  });
}

/**
 * Fetch upcoming activities
 */
export function useUpcomingActivities(params?: Partial<UpcomingListParams>) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["activities", "upcoming", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.activities.upcomingList(params ?? {});
      return response.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 60000, // Poll every minute
  });
}

/**
 * Fetch activity stats summary
 */
export function useActivityStats() {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["activities", "stats", selectedCompanyId],
    queryFn: async () => {
      const response = await api.activities.statsList();
      return response.data;
    },
    enabled: isAuthenticated,
  });
}

/**
 * Fetch single activity by ID
 */
export function useActivity(id: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["activities", id, selectedCompanyId],
    queryFn: async () => {
      const response = await api.activities.activitiesDetail({ id });
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });
}

/**
 * Create a new activity
 */
export function useCreateActivity() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (data: DomainCreateActivityRequest) => {
      const response = await api.activities.activitiesCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Aktivitet opprettet");
    },
    onError: (error: Error) => {
      console.error("Failed to create activity:", error);
      toast.error("Kunne ikke opprette aktivitet");
    },
  });
}

/**
 * Update an existing activity
 */
export function useUpdateActivity() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateActivityRequest;
    }) => {
      const response = await api.activities.activitiesUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activities", variables.id] });
      toast.success("Aktivitet oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update activity:", error);
      toast.error("Kunne ikke oppdatere aktivitet");
    },
  });
}

/**
 * Delete an activity
 */
export function useDeleteActivity() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.activities.activitiesDelete({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Aktivitet slettet");
    },
    onError: (error: Error) => {
      console.error("Failed to delete activity:", error);
      toast.error("Kunne ikke slette aktivitet");
    },
  });
}

/**
 * Mark an activity as complete
 */
export function useCompleteActivity() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, outcome }: { id: string; outcome?: string }) => {
      const response = await api.activities.completeCreate({ id }, { outcome });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      queryClient.invalidateQueries({ queryKey: ["activities", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["activities", "my-tasks"] });
      toast.success("Aktivitet fullført");
    },
    onError: (error: Error) => {
      console.error("Failed to complete activity:", error);
      toast.error("Kunne ikke fullføre aktivitet");
    },
  });
}

/**
 * Create a follow-up activity
 */
export function useCreateFollowUp() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        title: string;
        scheduledAt?: string;
        activityType?: string;
      };
    }) => {
      const response = await api.activities.followUpCreate({ id }, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      toast.success("Oppfølging opprettet");
    },
    onError: (error: Error) => {
      console.error("Failed to create follow-up:", error);
      toast.error("Kunne ikke opprette oppfølging");
    },
  });
}

/**
 * Add attendee to an activity
 */
export function useAddAttendee() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      const response = await api.activities.attendeesCreate({ id }, { userId });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activities", variables.id] });
      toast.success("Deltaker lagt til");
    },
    onError: (error: Error) => {
      console.error("Failed to add attendee:", error);
      toast.error("Kunne ikke legge til deltaker");
    },
  });
}

/**
 * Remove attendee from an activity
 */
export function useRemoveAttendee() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, userId }: { id: string; userId: string }) => {
      await api.activities.attendeesDelete({ id, userId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["activities", variables.id] });
      toast.success("Deltaker fjernet");
    },
    onError: (error: Error) => {
      console.error("Failed to remove attendee:", error);
      toast.error("Kunne ikke fjerne deltaker");
    },
  });
}
