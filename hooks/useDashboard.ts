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
export function useDashboard() {
  const api = useApi();
  const { selectedCompanyId } = useCompanyStore();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["dashboard", selectedCompanyId],
    queryFn: async () => {
      const response = await api.dashboard.metricsList();
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
