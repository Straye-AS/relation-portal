"use client";

/**
 * Offers Hooks
 *
 * React Query hooks for offer CRUD operations.
 * Uses the generated API client for backend communication.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import type {
  DomainCreateOfferRequest,
  DomainUpdateOfferRequest,
  OffersListParams,
} from "@/lib/.generated/data-contracts";

/**
 * Fetch paginated list of offers
 */
export function useOffers(params?: Partial<OffersListParams>) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["offers", params],
    queryFn: async () => {
      const response = await api.offers.offersList(params ?? {});
      return response.data;
    },
    enabled: isAuthenticated,
  });
}

/**
 * Fetch single offer by ID
 */
export function useOffer(id: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["offers", id],
    queryFn: async () => {
      const response = await api.offers.offersDetail({ id });
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });
}

/**
 * Fetch offer with full details including budget dimensions
 */
export function useOfferWithDetails(id: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["offers", id, "details"],
    queryFn: async () => {
      const response = await api.offers.detailList({ id });
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });
}

/**
 * Fetch offer budget summary
 */
export function useOfferBudget(offerId: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["offers", offerId, "budget"],
    queryFn: async () => {
      const response = await api.offerBudget.budgetList({ id: offerId });
      return response.data;
    },
    enabled: !!offerId && isAuthenticated,
  });
}

/**
 * Fetch offer budget dimensions
 */
export function useOfferBudgetDimensions(offerId: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["offers", offerId, "budget", "dimensions"],
    queryFn: async () => {
      const response = await api.offerBudget.budgetDimensionsList({
        id: offerId,
      });
      return response.data;
    },
    enabled: !!offerId && isAuthenticated,
  });
}

/**
 * Create a new offer
 */
export function useCreateOffer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (data: DomainCreateOfferRequest) => {
      const response = await api.offers.offersCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Tilbud opprettet");
    },
    onError: (error: Error) => {
      console.error("Failed to create offer:", error);
      toast.error("Kunne ikke opprette tilbud");
    },
  });
}

/**
 * Update an existing offer
 */
export function useUpdateOffer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateOfferRequest;
    }) => {
      const response = await api.offers.offersUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Tilbud oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update offer:", error);
      toast.error("Kunne ikke oppdatere tilbud");
    },
  });
}

/**
 * Delete an offer
 */
export function useDeleteOffer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.offers.offersDelete({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Tilbud slettet");
    },
    onError: (error: Error) => {
      console.error("Failed to delete offer:", error);
      toast.error("Kunne ikke slette tilbud");
    },
  });
}

/**
 * Advance offer to a specific phase
 */
export function useAdvanceOffer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, phase }: { id: string; phase: string }) => {
      const response = await api.offers.advanceCreate(
        { id },
        {
          phase: phase as Parameters<
            typeof api.offers.advanceCreate
          >[1]["phase"],
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Tilbud avansert til neste fase");
    },
    onError: (error: Error) => {
      console.error("Failed to advance offer:", error);
      toast.error("Kunne ikke avansere tilbud");
    },
  });
}

/**
 * Mark offer as sent
 */
export function useSendOffer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.offers.sendCreate({ id });
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", id] });
      toast.success("Tilbud markert som sendt");
    },
    onError: (error: Error) => {
      console.error("Failed to send offer:", error);
      toast.error("Kunne ikke sende tilbud");
    },
  });
}

/**
 * Accept offer (optionally create project)
 */
export function useAcceptOffer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      createProject = false,
      projectName,
      managerId,
    }: {
      id: string;
      createProject?: boolean;
      projectName?: string;
      managerId?: string;
    }) => {
      const response = await api.offers.acceptCreate(
        { id },
        {
          createProject,
          projectName,
          managerId,
        }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Tilbud akseptert");
    },
    onError: (error: Error) => {
      console.error("Failed to accept offer:", error);
      toast.error("Kunne ikke akseptere tilbud");
    },
  });
}

/**
 * Reject offer
 */
export function useRejectOffer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await api.offers.rejectCreate({ id }, { reason });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.info("Tilbud avvist");
    },
    onError: (error: Error) => {
      console.error("Failed to reject offer:", error);
      toast.error("Kunne ikke avvise tilbud");
    },
  });
}

/**
 * Clone an offer
 */
export function useCloneOffer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, newTitle }: { id: string; newTitle?: string }) => {
      const response = await api.offers.cloneCreate({ id }, { newTitle });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Tilbud kopiert");
    },
    onError: (error: Error) => {
      console.error("Failed to clone offer:", error);
      toast.error("Kunne ikke kopiere tilbud");
    },
  });
}
