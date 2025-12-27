"use client";

/**
 * Inquiries Hooks
 *
 * React Query hooks for inquiry (draft offers) CRUD operations.
 * Uses the generated API client for backend communication.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyStore } from "@/store/company-store";
import { toast } from "sonner";
import { createLogger } from "@/lib/logging";
import type {
  InquiriesListParams,
  DomainCreateInquiryRequest,
  DomainConvertInquiryRequest,
} from "@/lib/.generated/data-contracts";
import { ContentType } from "@/lib/.generated/http-client";

const log = createLogger("useInquiries");

/**
 * Fetch paginated list of inquiries (draft offers)
 */
export function useInquiries(
  params?: InquiriesListParams,
  options?: { enabled?: boolean }
) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["inquiries", params, selectedCompanyId],
    queryFn: async () => {
      const response = await api.inquiries.inquiriesList(params ?? {});
      return response.data;
    },
    enabled: isAuthenticated && (options?.enabled ?? true),
  });
}

/**
 * Fetch single inquiry by ID
 */
export function useInquiry(id: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();

  return useQuery({
    queryKey: ["inquiries", id, selectedCompanyId],
    queryFn: async () => {
      const response = await api.inquiries.inquiriesDetail({ id });
      return response.data;
    },
    enabled: !!id && isAuthenticated,
  });
}

/**
 * Create a new inquiry
 */
export function useCreateInquiry() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (data: DomainCreateInquiryRequest) => {
      const response = await api.inquiries.inquiriesCreate(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Forespørsel opprettet");
    },
    onError: (error: Error) => {
      log.error("Failed to create inquiry", error);
      toast.error("Kunne ikke opprette forespørsel");
    },
  });
}

/**
 * Delete an inquiry
 */
export function useDeleteInquiry() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.inquiries.inquiriesDelete({ id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      toast.success("Forespørsel slettet");
    },
    onError: (error: Error) => {
      log.error("Failed to delete inquiry", error);
      toast.error("Kunne ikke slette forespørsel");
    },
  });
}

/**
 * Convert an inquiry to an offer
 */
export function useConvertInquiry() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: DomainConvertInquiryRequest;
    }) => {
      const response = await api.inquiries.convertCreate({ id }, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Forespørsel konvertert til tilbud");
    },
    onError: (error: Error) => {
      log.error("Failed to convert inquiry", error);
      toast.error("Kunne ikke konvertere forespørsel");
    },
  });
}

/**
 * Update the company for an inquiry (draft offer)
 */
export function useUpdateInquiryCompany() {
  const queryClient = useQueryClient();
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      id,
      companyId,
    }: {
      id: string;
      companyId: string;
    }) => {
      const response = await api.inquiries.http.request({
        path: `/inquiries/${id}/company`,
        method: "PUT",
        body: { companyId },
        secure: true,
        type: ContentType.Json,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["offers", variables.id] });
      queryClient.invalidateQueries({
        queryKey: ["offers", variables.id, "details"],
      });
      toast.success("Selskap oppdatert");
    },
    onError: (error: Error) => {
      log.error("Failed to update inquiry company", error);
      toast.error("Kunne ikke oppdatere selskap");
    },
  });
}
