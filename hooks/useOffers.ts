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
import { useCompanyStore } from "@/store/company-store";
import type {
  DomainCreateOfferRequest,
  DomainUpdateOfferRequest,
  OffersListParams,
  DomainUpdateOfferTitleRequest,
  DomainUpdateOfferValueRequest,
  DomainUpdateOfferProbabilityRequest,
  DomainUpdateOfferResponsibleRequest,
  DomainUpdateOfferProjectRequest,
  DomainUpdateOfferDescriptionRequest,
  DomainUpdateOfferDueDateRequest,
  DomainOfferDTO,
} from "@/lib/.generated/data-contracts";

/**
 * Fetch paginated list of offers
 */
export function useOffers(
  params?: Partial<OffersListParams>,
  options?: { enabled?: boolean }
) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["offers", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.offers.offersList(params ?? {});
      return response.data;
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Fetch single offer by ID
 */
export function useOffer(id: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["offers", id, selectedCompanyId],
    queryFn: async () => {
      const response = await api.offers.offersDetail({ id });
      return response.data as unknown as DomainOfferDTO;
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
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["offers", id, "details", selectedCompanyId],
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
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["offers", offerId, "budget", selectedCompanyId],
    queryFn: async () => {
      const response = await api.offers.budgetList({ id: offerId });
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
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["offers", offerId, "budget", "dimensions", selectedCompanyId],
    queryFn: async () => {
      const response = await api.offers.budgetDimensionsList({
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

/**
 * Update offer title
 */
export function useUpdateOfferTitle() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateOfferTitleRequest;
    }) => {
      const response = await api.offers.titleUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Tittel oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update title:", error);
      toast.error("Kunne ikke oppdatere tittel");
    },
  });
}

/**
 * Update offer value
 */
export function useUpdateOfferValue() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateOfferValueRequest;
    }) => {
      const response = await api.offers.valueUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Verdi oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update value:", error);
      toast.error("Kunne ikke oppdatere verdi");
    },
  });
}

/**
 * Update offer description
 */
export function useUpdateOfferDescription() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateOfferDescriptionRequest;
    }) => {
      const response = await api.offers.descriptionUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Beskrivelse oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update description:", error);
      toast.error("Kunne ikke oppdatere beskrivelse");
    },
  });
}

/**
 * Update offer due date
 */
export function useUpdateOfferDueDate() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateOfferDueDateRequest;
    }) => {
      const response = await api.offers.dueDateUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Frist oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update due date:", error);
      toast.error("Kunne ikke oppdatere frist");
    },
  });
}

/**
 * Update offer probability
 */
export function useUpdateOfferProbability() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateOfferProbabilityRequest;
    }) => {
      const response = await api.offers.probabilityUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Sannsynlighet oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update probability:", error);
      toast.error("Kunne ikke oppdatere sannsynlighet");
    },
  });
}

/**
 * Update offer responsible user
 */
export function useUpdateOfferResponsible() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateOfferResponsibleRequest;
    }) => {
      const response = await api.offers.responsibleUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Ansvarlig oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update responsible user:", error);
      toast.error("Kunne ikke oppdatere ansvarlig");
    },
  });
}

/**
 * Update offer project link
 */
export function useUpdateOfferProject() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateOfferProjectRequest;
    }) => {
      const response = await api.offers.projectUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Prosjekt oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update project:", error);
      toast.error("Kunne ikke oppdatere prosjekt");
    },
  });
}

/**
 * Remove offer project link
 */
export function useDeleteOfferProject() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.offers.projectDelete({ id });
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", id] });
      toast.success("Prosjektlink fjernet");
    },
    onError: (error: Error) => {
      console.error("Failed to remove project link:", error);
      toast.error("Kunne ikke fjerne prosjektlink");
    },
  });
}
