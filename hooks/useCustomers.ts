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
import type {
  DomainCreateCustomerRequest,
  DomainUpdateCustomerRequest,
  CustomersListParams,
} from "@/lib/.generated/data-contracts";

/**
 * Fetch paginated list of customers
 */
export function useCustomers(params?: Partial<CustomersListParams>) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["customers", params],
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

  return useQuery({
    queryKey: ["customers", "all"],
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

  return useQuery({
    queryKey: ["customers", id],
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

  return useQuery({
    queryKey: ["customers", id, "details"],
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

  return useQuery({
    queryKey: ["customers", customerId, "contacts"],
    queryFn: async () => {
      const response = await api.customers.contactsList({ id: customerId });
      return response.data;
    },
    enabled: !!customerId && isAuthenticated,
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
    onError: (error: Error) => {
      console.error("Failed to create customer:", error);
      toast.error("Kunne ikke opprette kunde");
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
