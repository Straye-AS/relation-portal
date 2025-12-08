"use client";

/**
 * Deals Hooks
 *
 * React Query hooks for deal/sales pipeline operations.
 * This is a NEW feature added by the backend API.
 * Uses the generated API client for backend communication.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type {
  DomainCreateDealRequest,
  DomainUpdateDealRequest,
  DomainLoseDealRequest,
  DealsListParams,
} from "@/lib/.generated/data-contracts";

/**
 * Fetch paginated list of deals
 */
export function useDeals(params?: Partial<DealsListParams>) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["deals", params],
    queryFn: async () => {
      const response = await api.deals.dealsList(params ?? {});
      return response.data;
    },
    enabled: isAuthenticated,
  });
}

/**
 * Fetch single deal by ID
 */
export function useDeal(id: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["deals", id],
    queryFn: async () => {
      const response = await api.deals.dealsDetail({ id });
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });
}

/**
 * Fetch deals pipeline summary (for Kanban view)
 */
export function useDealPipeline() {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["deals", "pipeline"],
    queryFn: async () => {
      const response = await api.deals.pipelineList();
      return response.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 60000, // Refresh every minute
  });
}

/**
 * Fetch deals stats summary
 */
export function useDealStats() {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["deals", "stats"],
    queryFn: async () => {
      const response = await api.deals.statsList();
      return response.data;
    },
    enabled: isAuthenticated,
  });
}

/**
 * Fetch deals forecast
 */
export function useDealForecast(params?: { months?: number }) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["deals", "forecast", params],
    queryFn: async () => {
      const response = await api.deals.forecastList({ months: params?.months });
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

/**
 * Fetch deal stage history
 */
export function useDealHistory(id: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["deals", id, "history"],
    queryFn: async () => {
      const response = await api.deals.historyList({ id });
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });
}

/**
 * Create a new deal
 */
export function useCreateDeal() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (data: DomainCreateDealRequest) => {
      const response = await api.deals.dealsCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Salg opprettet");
    },
    onError: (error: Error) => {
      console.error("Failed to create deal:", error);
      toast.error("Kunne ikke opprette salg");
    },
  });
}

/**
 * Update an existing deal
 */
export function useUpdateDeal() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateDealRequest;
    }) => {
      const response = await api.deals.dealsUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals", variables.id] });
      toast.success("Salg oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update deal:", error);
      toast.error("Kunne ikke oppdatere salg");
    },
  });
}

/**
 * Delete a deal
 */
export function useDeleteDeal() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.deals.dealsDelete({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      toast.success("Salg slettet");
    },
    onError: (error: Error) => {
      console.error("Failed to delete deal:", error);
      toast.error("Kunne ikke slette salg");
    },
  });
}

/**
 * Advance deal to a specific stage
 */
export function useAdvanceDeal() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      const response = await api.deals.advanceCreate(
        { id },
        {
          stage: stage as Parameters<
            typeof api.deals.advanceCreate
          >[1]["stage"],
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["deals", "pipeline"] });
      toast.success("Salg avansert til neste fase");
    },
    onError: (error: Error) => {
      console.error("Failed to advance deal:", error);
      toast.error("Kunne ikke avansere salg");
    },
  });
}

/**
 * Mark deal as lost
 */
export function useLoseDeal() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainLoseDealRequest;
    }) => {
      const response = await api.deals.loseCreate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["deals", "pipeline"] });
      toast.info("Salg markert som tapt");
    },
    onError: (error: Error) => {
      console.error("Failed to mark deal as lost:", error);
      toast.error("Kunne ikke markere salg som tapt");
    },
  });
}

/**
 * Reopen a lost deal
 */
export function useReopenDeal() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.deals.reopenCreate({ id });
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals", id] });
      queryClient.invalidateQueries({ queryKey: ["deals", "pipeline"] });
      toast.success("Salg gjenåpnet");
    },
    onError: (error: Error) => {
      console.error("Failed to reopen deal:", error);
      toast.error("Kunne ikke gjenåpne salg");
    },
  });
}

/**
 * Create an offer from a deal
 */
export function useCreateOfferFromDeal() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, title }: { id: string; title?: string }) => {
      const response = await api.deals.createOfferCreate({ id }, { title });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["deals", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Tilbud opprettet fra salg");
    },
    onError: (error: Error) => {
      console.error("Failed to create offer from deal:", error);
      toast.error("Kunne ikke opprette tilbud fra salg");
    },
  });
}
