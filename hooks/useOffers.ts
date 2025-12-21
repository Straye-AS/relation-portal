"use client";

/**
 * Offers Hooks
 *
 * React Query hooks for offer CRUD operations.
 * Uses the generated API client for backend communication.
 *
 * Query hooks are defined in useOfferQueries.ts and re-exported here.
 * Mutation hooks are defined below.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { toast } from "sonner";
import { createLogger } from "@/lib/logging";

const log = createLogger("useOffers");

// Re-export query hooks from useOfferQueries.ts
export {
  useOffers,
  useOffer,
  useOfferWithDetails,
  useOfferBudget,
  useOfferBudgetDimensions,
  useOfferNextNumber,
} from "./useOfferQueries";

import {
  DomainUpdateOfferHealthRequestHealthEnum,
  type DomainCreateOfferRequest,
  type DomainUpdateOfferRequest,
  type DomainUpdateOfferTitleRequest,
  type DomainUpdateOfferValueRequest,
  type DomainUpdateOfferProbabilityRequest,
  type DomainUpdateOfferResponsibleRequest,
  type DomainUpdateOfferProjectRequest,
  type DomainUpdateOfferDescriptionRequest,
  type DomainUpdateOfferDueDateRequest,
  type DomainUpdateOfferCustomerRequest,
} from "@/lib/.generated/data-contracts";
import { ContentType } from "@/lib/.generated/http-client";
import { getHttpErrorStatus } from "@/lib/api/types";

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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Tilbud opprettet");
    },
    onError: (error: Error) => {
      log.error("Failed to create offer", error as Error);
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Tilbud oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update offer", error as Error);
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Tilbud slettet");
    },
    onError: (error: Error) => {
      log.error("Failed to delete offer", error as Error);
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Tilbud avansert til neste fase");
    },
    onError: (error: Error) => {
      log.error("Failed to advance offer", error as Error);
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
    mutationFn: async ({
      id,
      sentDate,
      expirationDate,
    }: {
      id: string;
      sentDate?: string;
      expirationDate?: string;
    }) => {
      const response = await api.offers.sendCreate({ id }, {
        sentDate,
        expirationDate,
      } as any);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["offers", id] });
      toast.success("Tilbud markert som sendt");
    },
    onError: (error: Error) => {
      log.error("Failed to send offer", error as Error);
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
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Tilbud akseptert");
    },
    onError: (error: Error) => {
      log.error("Failed to accept offer", error as Error);
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.info("Tilbud avvist");
    },
    onError: (error: Error) => {
      log.error("Failed to reject offer", error as Error);
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Tilbud kopiert");
    },
    onError: (error: Error) => {
      log.error("Failed to clone offer", error as Error);
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
      // Only invalidate the specific offer and offers list - title change doesn't affect projects
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Tittel oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update title", error as Error);
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
      // Only invalidate the specific offer and offers list - value change affects list totals
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      // Dashboard metrics depend on offer values
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Verdi oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update value", error as Error);
      toast.error("Kunne ikke oppdatere verdi");
    },
  });
}

/**
 * Update offer cost
 */
export function useUpdateOfferCost() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, cost }: { id: string; cost: number }) => {
      // Manually calling the endpoint as it might be missing from the generated client
      const response = await api.offers.http.request({
        path: `/offers/${id}/cost`,
        method: "PUT",
        body: { cost },
        secure: true,
        type: ContentType.Json,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Only invalidate the specific offer - cost doesn't affect other entities
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Kostnad oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update cost", error as Error);
      toast.error("Kunne ikke oppdatere kostnad");
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
      // Only invalidate the specific offer - description doesn't affect other entities
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Beskrivelse oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update description", error as Error);
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
      // Due date only affects offer display, not project/customer totals
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Frist oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update due date", error as Error);
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
      // Probability affects weighted values - invalidate specific offer, list, and dashboard
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Sannsynlighet oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update probability", error as Error);
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
      // Responsible user change only affects offer display
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Ansvarlig oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update responsible user", error as Error);
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Prosjekt oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update project", error as Error);
      if (getHttpErrorStatus(error) === 400) {
        toast.error("Kan kun koble til prosjekter som er i tilbudsfasen.");
      } else {
        toast.error("Kunne ikke oppdatere prosjekt");
      }
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
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", id] });
      toast.success("Prosjektlink fjernet");
    },
    onError: (error: Error) => {
      log.error("Failed to remove project link", error as Error);
      toast.error("Kunne ikke fjerne prosjektlink");
    },
  });
}

/**
 * Update offer number
 */
export function useUpdateOfferNumber() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      offerNumber,
    }: {
      id: string;
      offerNumber: string;
    }) => {
      // Using generic update since specific endpoint might not exist
      // Casting to any to ensure we can pass offerNumber even if type definition is lagging
      const response = await api.offers.offersUpdate({ id }, {
        offerNumber,
      } as any);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Offer number only affects display
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Tilbudsnummer oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update offer number", error as Error);
      // Check for 409 Conflict
      if (getHttpErrorStatus(error) === 409) {
        toast.error(
          "Dette tilbudsnummeret er allerede i bruk. Vennligst velg et annet."
        );
      } else {
        toast.error("Kunne ikke oppdatere tilbudsnummer");
      }
    },
  });
}

/**
 * Update offer expiration date
 */
export function useUpdateOfferExpirationDate() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      expirationDate,
    }: {
      id: string;
      expirationDate?: string;
    }) => {
      const response = await api.offers.expirationDateUpdate(
        { id },
        { expirationDate }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Expiration date only affects offer display
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Vedståelsesfrist oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update expiration date", error as Error);
      toast.error("Kunne ikke oppdatere vedståelsesfrist");
    },
  });
}

/**
 * Update offer start date
 */
export function useUpdateOfferStartDate() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      startDate,
    }: {
      id: string;
      startDate?: string;
    }) => {
      const response = await api.offers.startDateUpdate({ id }, { startDate });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Start date only affects offer display
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.id, "details"],
      });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Startdato oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update start date", error as Error);
      toast.error("Kunne ikke oppdatere startdato");
    },
  });
}

/**
 * Update offer end date
 */
export function useUpdateOfferEndDate() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, endDate }: { id: string; endDate?: string }) => {
      const response = await api.offers.endDateUpdate({ id }, { endDate });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // End date only affects offer display
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.id, "details"],
      });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Sluttdato oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update end date", error as Error);
      toast.error("Kunne ikke oppdatere sluttdato");
    },
  });
}

/**
 * Update offer sent date
 */
export function useUpdateOfferSentDate() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, sentDate }: { id: string; sentDate?: string }) => {
      const response = await api.offers.sentDateUpdate({ id }, { sentDate });
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Sent date only affects offer display
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.id, "details"],
      });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Sendt dato oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update sent date", error as Error);
      toast.error("Kunne ikke oppdatere sendt dato");
    },
  });
}

/**
 * Update offer external reference
 */
export function useUpdateOfferExternalReference() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      externalReference,
    }: {
      id: string;
      externalReference: string;
    }) => {
      const response = await api.offers.externalReferenceUpdate(
        { id },
        { externalReference }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // External reference only affects offer display
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.id, "details"],
      });
      queryClient.invalidateQueries({
        queryKey: ["offers"],
        exact: false,
        refetchType: "active",
      });
      toast.success("Ekstern referanse oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update external reference", error as Error);
      if (getHttpErrorStatus(error) === 409) {
        toast.error("Denne referansen er allerede i bruk for denne bedriften.");
      } else {
        toast.error("Kunne ikke oppdatere ekstern referanse");
      }
    },
  });
}

/**
 * Update offer customer
 */
export function useUpdateOfferCustomer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateOfferCustomerRequest;
    }) => {
      const response = await api.offers.customerUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Kunde oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update customer", error as Error);
      toast.error("Kunne ikke oppdatere kunde");
    },
  });
}

/**
 * Update offer customer won status
 */
export function useUpdateCustomerHasWonOffer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      customerHasWonProject,
    }: {
      id: string;
      customerHasWonProject: boolean;
    }) => {
      const response = await api.offers.customerHasWonProjectUpdate(
        { id },
        { customerHasWonProject }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Kunde er merket som vinner for prosjektet");
    },
    onError: (error: Error) => {
      log.error("Failed to update customer won status", error as Error);
      toast.error("Kunne ikke oppdatere vinner-status");
    },
  });
}

/**
 * Accept offer as order (sent -> order phase transition)
 */
export function useAcceptOrder() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const response = await api.offers.acceptOrderCreate({ id }, { notes });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Tilbud akseptert som ordre");
    },
    onError: (error: Error) => {
      log.error("Failed to accept order", error as Error);
      toast.error("Kunne ikke akseptere som ordre");
    },
  });
}

/**
 * Complete an offer (order -> completed phase transition)
 */
export function useCompleteOffer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.offers.completeCreate({ id });
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["offers", id] });
      toast.success("Ordre markert som ferdig");
    },
    onError: (error: Error) => {
      log.error("Failed to complete offer", error as Error);
      toast.error("Kunne ikke markere som ferdig");
    },
  });
}

/**
 * Update offer health status and completion percentage
 */
export function useUpdateOfferHealth() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      health,
      completionPercent,
    }: {
      id: string;
      health: "on_track" | "at_risk" | "delayed" | "over_budget";
      completionPercent?: number;
    }) => {
      // Map string health to enum
      const healthEnumMap: Record<
        string,
        DomainUpdateOfferHealthRequestHealthEnum
      > = {
        on_track: DomainUpdateOfferHealthRequestHealthEnum.OnTrack,
        at_risk: DomainUpdateOfferHealthRequestHealthEnum.AtRisk,
        delayed: DomainUpdateOfferHealthRequestHealthEnum.Delayed,
        over_budget: DomainUpdateOfferHealthRequestHealthEnum.OverBudget,
      };
      const response = await api.offers.healthUpdate(
        { id },
        { health: healthEnumMap[health], completionPercent }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Helsestatus oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update health", error as Error);
      toast.error("Kunne ikke oppdatere helsestatus");
    },
  });
}

/**
 * Update offer spent amount
 */
export function useUpdateOfferSpent() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, spent }: { id: string; spent: number }) => {
      const response = await api.offers.spentUpdate({ id }, { spent });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Kostnader oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update spent", error as Error);
      toast.error("Kunne ikke oppdatere kostnader");
    },
  });
}

/**
 * Update offer invoiced amount
 */
export function useUpdateOfferInvoiced() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({ id, invoiced }: { id: string; invoiced: number }) => {
      const response = await api.offers.invoicedUpdate({ id }, { invoiced });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      toast.success("Fakturert beløp oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update invoiced", error as Error);
      toast.error("Kunne ikke oppdatere fakturert beløp");
    },
  });
}

/**
 * Reopen a completed offer (completed -> order phase transition)
 */
export function useReopenOffer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.offers.http.request({
        path: `/offers/${id}/reopen`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
      });
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["offers", id] });
      toast.success("Ordre gjenåpnet");
    },
    onError: (error: Error) => {
      log.error("Failed to reopen offer", error as Error);
      toast.error("Kunne ikke gjenåpne ordre");
    },
  });
}

/**
 * Revert offer from order phase back to sent phase
 */
export function useRevertToSent() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.offers.http.request({
        path: `/offers/${id}/revert-to-sent`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
      });
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["offers", id] });
      queryClient.invalidateQueries({ queryKey: ["offers", id, "details"] });
      toast.success("Tilbudet er satt tilbake til sendt");
    },
    onError: (error: Error) => {
      log.error("Failed to revert to sent", error as Error);
      toast.error("Kunne ikke sette tilbudet tilbake til sendt");
    },
  });
}
