"use client";

/**
 * Supplier Hooks
 *
 * React Query hooks for supplier CRUD operations.
 * Uses the generated API client for backend communication.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyStore } from "@/store/company-store";
import { MAX_PAGE_SIZE, QUERY_STALE_TIME_DEFAULT } from "@/lib/constants";
import { createLogger } from "@/lib/logging";

const log = createLogger("useSuppliers");

import type {
  DomainCreateSupplierRequest,
  DomainUpdateSupplierRequest,
  DomainUpdateSupplierStatusRequest,
  DomainUpdateSupplierCategoryRequest,
  DomainUpdateSupplierNotesRequest,
  DomainUpdateSupplierPaymentTermsRequest,
  DomainUpdateSupplierEmailRequest,
  DomainUpdateSupplierPhoneRequest,
  DomainUpdateSupplierWebsiteRequest,
  DomainUpdateSupplierAddressRequest,
  DomainUpdateSupplierPostalCodeRequest,
  DomainUpdateSupplierCityRequest,
  DomainCreateContactRequest,
  SuppliersListParams2,
} from "@/lib/.generated/data-contracts";
import { ContentType } from "@/lib/.generated/http-client";

/**
 * Fetch paginated list of suppliers
 */
export function useSuppliers(
  params?: Partial<SuppliersListParams2>,
  options?: { enabled?: boolean }
) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["suppliers", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.suppliers.suppliersList(params ?? {});
      return response.data;
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Fetch all suppliers (non-paginated, for dropdowns etc.)
 */
export function useAllSuppliers(options?: { enabled?: boolean }) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["suppliers", "all", selectedCompanyId],
    queryFn: async () => {
      const response = await api.suppliers.suppliersList({
        pageSize: MAX_PAGE_SIZE,
      });
      return response.data?.data ?? [];
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
    staleTime: QUERY_STALE_TIME_DEFAULT,
  });
}

/**
 * Fetch single supplier by ID with full details
 */
export function useSupplier(id: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["suppliers", id, selectedCompanyId],
    queryFn: async () => {
      const response = await api.suppliers.suppliersDetail({ id });
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });
}

/**
 * Create a new supplier
 */
export function useCreateSupplier() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (data: DomainCreateSupplierRequest) => {
      const response = await api.suppliers.suppliersCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Leverandør opprettet");
    },
    onError: (error) => {
      log.error("Failed to create supplier", error as Error);
      const err = error as { status?: number; response?: { status?: number } };
      if (err.status === 409 || err.response?.status === 409) {
        toast.error(
          "En leverandør med dette organisasjonsnummeret eksisterer allerede"
        );
      } else {
        toast.error("Kunne ikke opprette leverandør");
      }
    },
  });
}

/**
 * Update an existing supplier
 */
export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateSupplierRequest;
    }) => {
      const response = await api.suppliers.suppliersUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", variables.id] });
      toast.success("Leverandør oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update supplier", error);
      toast.error("Kunne ikke oppdatere leverandør");
    },
  });
}

/**
 * Delete a supplier
 */
export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.suppliers.suppliersDelete({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Leverandør slettet");
    },
    onError: (error) => {
      log.error("Failed to delete supplier", error as Error);
      const err = error as { status?: number; response?: { status?: number } };
      if (err.status === 409 || err.response?.status === 409) {
        toast.error(
          "Kan ikke slette leverandør med aktive tilbudsrelasjoner. Fjern relasjonene først eller merk leverandøren som inaktiv."
        );
      } else {
        toast.error("Kunne ikke slette leverandør");
      }
    },
  });
}

/**
 * Update supplier status
 */
export function useUpdateSupplierStatus() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateSupplierStatusRequest;
    }) => {
      const response = await api.suppliers.statusUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", variables.id] });
      toast.success("Status oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update supplier status", error);
      toast.error("Kunne ikke oppdatere status");
    },
  });
}

/**
 * Update supplier category
 */
export function useUpdateSupplierCategory() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateSupplierCategoryRequest;
    }) => {
      const response = await api.suppliers.categoryUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", variables.id] });
      toast.success("Kategori oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update supplier category", error);
      toast.error("Kunne ikke oppdatere kategori");
    },
  });
}

/**
 * Update supplier notes
 */
export function useUpdateSupplierNotes() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateSupplierNotesRequest;
    }) => {
      const response = await api.suppliers.notesUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", variables.id] });
      toast.success("Notater oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update supplier notes", error);
      toast.error("Kunne ikke oppdatere notater");
    },
  });
}

/**
 * Update supplier payment terms
 */
export function useUpdateSupplierPaymentTerms() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateSupplierPaymentTermsRequest;
    }) => {
      const response = await api.suppliers.paymentTermsUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", variables.id] });
      toast.success("Betalingsbetingelser oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update supplier payment terms", error);
      toast.error("Kunne ikke oppdatere betalingsbetingelser");
    },
  });
}

/**
 * Update supplier email
 */
export function useUpdateSupplierEmail() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateSupplierEmailRequest;
    }) => {
      const response = await api.suppliers.emailUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", variables.id] });
      toast.success("E-post oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update supplier email", error);
      toast.error("Kunne ikke oppdatere e-post");
    },
  });
}

/**
 * Update supplier phone
 */
export function useUpdateSupplierPhone() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateSupplierPhoneRequest;
    }) => {
      const response = await api.suppliers.phoneUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", variables.id] });
      toast.success("Telefon oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update supplier phone", error);
      toast.error("Kunne ikke oppdatere telefon");
    },
  });
}

/**
 * Update supplier website
 */
export function useUpdateSupplierWebsite() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateSupplierWebsiteRequest;
    }) => {
      const response = await api.suppliers.websiteUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", variables.id] });
      toast.success("Nettside oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update supplier website", error);
      toast.error("Kunne ikke oppdatere nettside");
    },
  });
}

/**
 * Update supplier address
 */
export function useUpdateSupplierAddress() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateSupplierAddressRequest;
    }) => {
      const response = await api.suppliers.addressUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", variables.id] });
      toast.success("Adresse oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update supplier address", error);
      toast.error("Kunne ikke oppdatere adresse");
    },
  });
}

/**
 * Update supplier postal code
 */
export function useUpdateSupplierPostalCode() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateSupplierPostalCodeRequest;
    }) => {
      const response = await api.suppliers.postalCodeUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", variables.id] });
      toast.success("Postnummer oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update supplier postal code", error);
      toast.error("Kunne ikke oppdatere postnummer");
    },
  });
}

/**
 * Update supplier city
 */
export function useUpdateSupplierCity() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateSupplierCityRequest;
    }) => {
      const response = await api.suppliers.cityUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["suppliers", variables.id] });
      toast.success("Sted oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update supplier city", error);
      toast.error("Kunne ikke oppdatere sted");
    },
  });
}

/**
 * Create a new supplier contact
 */
export function useCreateSupplierContact() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      supplierId,
      data,
    }: {
      supplierId: string;
      data: DomainCreateContactRequest;
    }) => {
      // Manually calling the endpoint since it might be missing from the generated client
      const response = await api.http.request({
        path: `/suppliers/${supplierId}/contacts`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        secure: true,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({
        queryKey: ["suppliers", variables.supplierId],
      });
      toast.success("Kontaktperson opprettet");
    },
    onError: (error) => {
      log.error("Failed to create supplier contact", error as Error);
      toast.error("Kunne ikke opprette kontaktperson");
    },
  });
}

/**
 * Delete a supplier contact
 */
export function useDeleteSupplierContact() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      supplierId,
      contactId,
    }: {
      supplierId: string;
      contactId: string;
    }) => {
      await api.http.request({
        path: `/suppliers/${supplierId}/contacts/${contactId}`,
        method: "DELETE",
        secure: true,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({
        queryKey: ["suppliers", variables.supplierId],
      });
      toast.success("Kontaktperson slettet");
    },
    onError: (error) => {
      log.error("Failed to delete supplier contact", error as Error);
      const err = error as { status?: number; response?: { status?: number } };
      if (err.status === 409 || err.response?.status === 409) {
        toast.error("Kan ikke slette kontaktperson som brukes i aktive tilbud");
      } else {
        toast.error("Kunne ikke slette kontaktperson");
      }
    },
  });
}

/**
 * Update a supplier contact
 */
export function useUpdateSupplierContact() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      supplierId,
      contactId,
      data,
    }: {
      supplierId: string;
      contactId: string;
      data: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        title?: string;
        isPrimary?: boolean;
      };
    }) => {
      const response = await api.http.request({
        path: `/suppliers/${supplierId}/contacts/${contactId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        secure: true,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({
        queryKey: ["suppliers", variables.supplierId],
      });
      toast.success("Kontaktperson oppdatert");
    },
    onError: (error) => {
      log.error("Failed to update supplier contact", error as Error);
      toast.error("Kunne ikke oppdatere kontaktperson");
    },
  });
}

/**
 * Fetch offers for a supplier
 */
export function useSupplierOffers(
  supplierId: string,
  params?: {
    page?: number;
    pageSize?: number;
    phase?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  },
  options?: { enabled?: boolean }
) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["suppliers", supplierId, "offers", params, selectedCompanyId],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.page) queryParams.append("page", params.page.toString());
      if (params?.pageSize)
        queryParams.append("pageSize", params.pageSize.toString());
      if (params?.phase) queryParams.append("phase", params.phase);
      if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
      if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

      const response = await api.http.request({
        path: `/suppliers/${supplierId}/offers?${queryParams.toString()}`,
        method: "GET",
        secure: true,
        format: "json",
      });
      return response.data;
    },
    enabled: !!supplierId && isAuthenticated && (options?.enabled ?? true),
  });
}
