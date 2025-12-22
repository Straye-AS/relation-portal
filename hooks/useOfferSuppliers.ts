"use client";

/**
 * Offer Supplier Hooks
 *
 * React Query hooks for managing offer-supplier relationships.
 *
 * Endpoints:
 * - GET /offers/{id}/suppliers
 * - POST /offers/{id}/suppliers
 * - PUT /offers/{id}/suppliers/{supplierId}
 * - DELETE /offers/{id}/suppliers/{supplierId}
 * - PUT /offers/{id}/suppliers/{supplierId}/status
 * - PUT /offers/{id}/suppliers/{supplierId}/notes
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { createLogger } from "@/lib/logging";
import type {
  DomainOfferSupplierWithDetailsDTO,
  DomainAddOfferSupplierRequest,
  DomainUpdateOfferSupplierRequest,
} from "@/lib/.generated/data-contracts";

const log = createLogger("useOfferSuppliers");

/**
 * Fetch suppliers linked to an offer with full details
 */
export function useOfferSuppliers(offerId: string) {
  const { isAuthenticated } = useAuth();
  const api = useApi();

  return useQuery({
    queryKey: ["offers", offerId, "suppliers"],
    queryFn: async (): Promise<DomainOfferSupplierWithDetailsDTO[]> => {
      const response = await api.offers.suppliersList({ id: offerId });
      return response.data;
    },
    enabled: !!offerId && isAuthenticated,
  });
}

/**
 * Add a supplier to an offer
 */
export function useAddOfferSupplier() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      offerId,
      data,
    }: {
      offerId: string;
      data: DomainAddOfferSupplierRequest;
    }): Promise<DomainOfferSupplierWithDetailsDTO> => {
      const response = await api.offers.suppliersCreate({ id: offerId }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.offerId, "suppliers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.offerId],
      });
      toast.success("Leverandør lagt til");
    },
    onError: (error: Error) => {
      log.error("Failed to add supplier to offer", error);
      toast.error("Kunne ikke legge til leverandør");
    },
  });
}

/**
 * Update an offer-supplier relationship (status, notes)
 */
export function useUpdateOfferSupplier() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      offerId,
      supplierId,
      data,
    }: {
      offerId: string;
      supplierId: string;
      data: DomainUpdateOfferSupplierRequest;
    }): Promise<DomainOfferSupplierWithDetailsDTO> => {
      const response = await api.offers.suppliersUpdate(
        { id: offerId, supplierId },
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.offerId, "suppliers"],
      });
      toast.success("Leverandør oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update offer supplier", error);
      toast.error("Kunne ikke oppdatere leverandør");
    },
  });
}

/**
 * Remove a supplier from an offer
 */
export function useRemoveOfferSupplier() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      offerId,
      supplierId,
    }: {
      offerId: string;
      supplierId: string;
    }): Promise<void> => {
      await api.offers.suppliersDelete({ id: offerId, supplierId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.offerId, "suppliers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.offerId],
      });
      toast.success("Leverandør fjernet");
    },
    onError: (error: Error) => {
      log.error("Failed to remove supplier from offer", error);
      toast.error("Kunne ikke fjerne leverandør");
    },
  });
}

/**
 * Update contact person for an offer-supplier relationship
 */
export function useUpdateOfferSupplierContact() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      offerId,
      supplierId,
      contactId,
    }: {
      offerId: string;
      supplierId: string;
      contactId: string | null;
    }): Promise<DomainOfferSupplierWithDetailsDTO> => {
      const response = await api.offers.suppliersContactUpdate(
        { id: offerId, supplierId },
        { contactId: contactId ?? undefined }
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.offerId, "suppliers"],
      });
      toast.success("Kontaktperson oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update offer supplier contact", error);
      toast.error("Kunne ikke oppdatere kontaktperson");
    },
  });
}
