"use client";

/**
 * Customer Hooks
 *
 * React Query hooks for customer CRUD operations.
 * Uses the generated API client for backend communication.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyStore } from "@/store/company-store";
import { MAX_PAGE_SIZE, QUERY_STALE_TIME_DEFAULT } from "@/lib/constants";
import { createLogger } from "@/lib/logging";

const log = createLogger("useCustomers");
import type {
  DomainCreateCustomerRequest,
  DomainUpdateCustomerRequest,
  DomainCreateContactRequest,
  CustomersListParams,
  OffersListParams,
  ProjectsListParams,
} from "@/lib/.generated/data-contracts";

/**
 * Fetch paginated list of customers
 */
export function useCustomers(
  params?: Partial<CustomersListParams>,
  options?: { enabled?: boolean }
) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["customers", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.customers.customersList(params ?? {});
      return response.data;
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Fetch all customers (non-paginated, for dropdowns etc.)
 */
export function useAllCustomers(options?: { enabled?: boolean }) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["customers", "all", selectedCompanyId],
    queryFn: async () => {
      // Fetch with large page size to get all
      const response = await api.customers.customersList({
        pageSize: MAX_PAGE_SIZE,
      });
      return response.data?.data ?? [];
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
    staleTime: QUERY_STALE_TIME_DEFAULT,
  });
}

/**
 * Fetch single customer by ID
 */
export function useCustomer(id: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["customers", id, selectedCompanyId],
    queryFn: async () => {
      const response = await api.customers.customersDetail({ id });
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });
}

/**
 * Fetch customer with full details (contacts, related entities)
 */
export function useCustomerWithDetails(id: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["customers", id, "details", selectedCompanyId],
    queryFn: async () => {
      const response = await api.customers.customersDetail({ id });
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });
}

/**
 * Fetch contacts for a customer
 */
export function useCustomerContacts(customerId: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["customers", customerId, "contacts", selectedCompanyId],
    queryFn: async () => {
      const response = await api.customers.contactsList({ id: customerId });
      return response.data;
    },
    enabled: !!customerId && isAuthenticated,
  });
}

/**
 * Fetch offers for a customer
 */
export function useCustomerOffers(
  customerId: string,
  params?: Partial<OffersListParams>,
  options?: { enabled?: boolean }
) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["customers", customerId, "offers", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.customers.offersList({
        id: customerId,
        ...params,
      });
      return response.data;
    },
    enabled: !!customerId && isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Fetch projects for a customer
 */
export function useCustomerProjects(
  customerId: string,
  params?: Partial<ProjectsListParams>,
  options?: { enabled?: boolean }
) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["customers", customerId, "projects", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.customers.projectsList({
        id: customerId,
        ...params,
      });
      return response.data;
    },
    enabled: !!customerId && isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Create a new customer
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (data: DomainCreateCustomerRequest) => {
      const response = await api.customers.customersCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Kunde opprettet");
    },
    onError: (error) => {
      log.error("Failed to create customer", error as Error);
      const err = error as { status?: number; response?: { status?: number } };
      if (err.status === 409 || err.response?.status === 409) {
        toast.error("Kunden eksisterer allerede i dette selskapet");
      } else {
        toast.error("Kunne ikke opprette kunde");
      }
    },
  });
}

/**
 * Update an existing customer
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainUpdateCustomerRequest;
    }) => {
      const response = await api.customers.customersUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      queryClient.invalidateQueries({ queryKey: ["customers", variables.id] });
      toast.success("Kunde oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update customer", error as Error);
      toast.error("Kunne ikke oppdatere kunde");
    },
  });
}

/**
 * Update customer contact info
 */
export function useUpdateCustomerContactInfo() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        contactPerson?: string;
        contactEmail?: string;
        contactPhone?: string;
      };
    }) => {
      const response = await api.customers.contactInfoUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers", variables.id] });
      toast.success("Kontaktinfo oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update contact info", error as Error);
      toast.error("Kunne ikke oppdatere kontaktinfo");
    },
  });
}

/**
 * Create a new customer contact
 */
export function useCreateCustomerContact() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      customerId,
      data,
    }: {
      customerId: string;
      data: DomainCreateContactRequest;
    }) => {
      const response = await api.customers.contactsCreate(
        { id: customerId },
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customers", variables.customerId, "contacts"],
      });
      // Also invalidate details to update stats if necessary (though contacts are usually separate list)
      queryClient.invalidateQueries({
        queryKey: ["customers", variables.customerId, "details"],
      });
      toast.success("Kontaktperson opprettet");
    },
    onError: (error) => {
      log.error("Failed to create contact", error as Error);
      toast.error("Kunne ikke opprette kontaktperson");
    },
  });
}

/**
 * Update customer address
 */
export function useUpdateCustomerAddress() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        address?: string;
        postalCode?: string;
        city?: string;
        country?: string;
        municipality?: string;
        county?: string;
      };
    }) => {
      const response = await api.customers.addressUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers", variables.id] });
      toast.success("Adresse oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update address", error as Error);
      toast.error("Kunne ikke oppdatere adresse");
    },
  });
}

/**
 * Update customer postal code
 */
export function useUpdateCustomerPostalCode() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        postalCode?: string;
      };
    }) => {
      const response = await api.customers.postalCodeUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers", variables.id] });
      toast.success("Postnummer oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update postal code", error as Error);
      toast.error("Kunne ikke oppdatere postnummer");
    },
  });
}

/**
 * Update customer city
 */
export function useUpdateCustomerCity() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        city?: string;
      };
    }) => {
      const response = await api.customers.cityUpdate({ id }, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers", variables.id] });
      toast.success("Sted oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update city", error as Error);
      toast.error("Kunne ikke oppdatere sted");
    },
  });
}

/**
 * Delete a customer
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.customers.customersDelete({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Kunde slettet");
    },
    onError: (error: Error) => {
      log.error("Failed to delete customer", error as Error);
      toast.error("Kunne ikke slette kunde");
    },
  });
}

/**
 * Delete a customer contact
 */
export function useDeleteCustomerContact() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      customerId: _customerId,
      contactId,
    }: {
      customerId: string;
      contactId: string;
    }) => {
      await api.contacts.contactsDelete({ id: contactId });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["customers", variables.customerId, "contacts"],
      });
      queryClient.invalidateQueries({
        queryKey: ["customers", variables.customerId, "details"],
      });
      toast.success("Kontaktperson slettet");
    },
    onError: (error: Error) => {
      log.error("Failed to delete contact", error as Error);
      toast.error("Kunne ikke slette kontaktperson");
    },
  });
}
