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
import type {
  DomainCreateCustomerRequest,
  DomainUpdateCustomerRequest,
  CustomersListParams,
  OffersListParams,
  ProjectsListParams,
} from "@/lib/.generated/data-contracts";

/**
 * Fetch paginated list of customers
 */
export function useCustomers(params?: Partial<CustomersListParams>) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["customers", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.customers.customersList(params ?? {});
      return response.data;
    },
    enabled: isAuthenticated,
  });
}

/**
 * Fetch all customers (non-paginated, for dropdowns etc.)
 */
export function useAllCustomers() {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["customers", "all", selectedCompanyId],
    queryFn: async () => {
      // Fetch with large page size to get all
      const response = await api.customers.customersList({ pageSize: 1000 });
      return response.data?.data ?? [];
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
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
      console.error("Failed to create customer:", error);
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
      queryClient.invalidateQueries({ queryKey: ["customers", variables.id] });
      toast.success("Kunde oppdatert");
    },
    onError: (error: Error) => {
      console.error("Failed to update customer:", error);
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
      console.error("Failed to update contact info:", error);
      toast.error("Kunne ikke oppdatere kontaktinfo");
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
      console.error("Failed to update address:", error);
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
      console.error("Failed to update postal code:", error);
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
      console.error("Failed to update city:", error);
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
      console.error("Failed to delete customer:", error);
      toast.error("Kunne ikke slette kunde");
    },
  });
}
