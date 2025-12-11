"use client";

/**
 * Dashboard Hooks
 *
 * React Query hooks for fetching dashboard metrics and analytics.
 * Uses the generated API client for backend communication.
 */

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { useCompanyStore } from "@/store/company-store";
import { useAuth } from "@/hooks/useAuth";

/**
 * Fetch dashboard metrics
 */
export interface DashboardParams {
  timeRange?: "rolling12months" | "allTime";
}

/**
 * Fetch dashboard metrics
 */
export function useDashboard(params: DashboardParams = {}) {
  const api = useApi();
  const { selectedCompanyId } = useCompanyStore();
  const { isAuthenticated } = useAuth();
  const { timeRange = "rolling12months" } = params;

  return useQuery({
    queryKey: ["dashboard", selectedCompanyId, timeRange],
    queryFn: async () => {
      // @ts-ignore - API client update pending
      const response = await api.dashboard.metricsList({
        query: { timeRange },
      } as any);
      return response.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000, // Consider fresh for 30 seconds
  });
}

/**
 * Fetch deals pipeline analytics
 */
export function usePipelineAnalytics() {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["deals", "analytics"],
    queryFn: async () => {
      const response = await api.deals.analyticsList({});
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
