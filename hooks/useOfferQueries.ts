"use client";

/**
 * Offer Query Hooks
 *
 * React Query hooks for fetching offer data.
 * Split from useOffers.ts for better maintainability.
 */

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyStore } from "@/store/company-store";
import { ContentType } from "@/lib/.generated/http-client";
import type { OffersListParams2 } from "@/lib/.generated/data-contracts";
import { Offer, OfferDetail } from "@/lib/api/types";

/**
 * Fetch paginated list of offers
 */
export function useOffers(
  params?: OffersListParams2,
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
      return response.data as Offer;
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
      return response.data as OfferDetail;
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
 * Fetch next offer number for a company
 */
export function useOfferNextNumber(companyId?: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["offers", "next-number", companyId],
    queryFn: async () => {
      if (!companyId) return null;

      const response = await api.offers.http.request({
        path: `/offers/next-number`,
        method: "GET",
        query: { companyId },
        secure: true,
        type: ContentType.Json,
      });
      return response.data as string;
    },
    enabled: !!companyId && isAuthenticated,
  });
}
