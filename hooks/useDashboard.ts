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
import {
  TimeRangeEnum,
  type MetricsListParams,
} from "@/lib/.generated/data-contracts";

/**
 * Fetch dashboard metrics
 */
export interface DashboardParams {
  timeRange?: "rolling12months" | "allTime";
  fromDate?: string;
  toDate?: string;
  enabled?: boolean;
}

/**
 * Fetch dashboard metrics
 */
export function useDashboard(params: DashboardParams = {}) {
  const api = useApi();
  const { selectedCompanyId } = useCompanyStore();
  const { isAuthenticated } = useAuth();
  const { timeRange, fromDate, toDate, enabled = true } = params;

  // Determine effective time range logic for query key
  // If dates are present, they override the preset
  const effectiveTimeRange =
    fromDate || toDate ? "custom" : (timeRange ?? "rolling12months");

  return useQuery({
    queryKey: [
      "dashboard",
      selectedCompanyId,
      effectiveTimeRange,
      fromDate,
      toDate,
    ],
    queryFn: async () => {
      // If we have custom dates, we don't send timeRange
      // If we don't have custom dates, we send timeRange (defaulting to rolling12months if undefined)
      const queryParams: MetricsListParams = {};

      if (fromDate) queryParams.fromDate = fromDate;
      if (toDate) queryParams.toDate = toDate;

      if (!fromDate && !toDate) {
        queryParams.timeRange =
          timeRange === "allTime"
            ? TimeRangeEnum.AllTime
            : TimeRangeEnum.Rolling12Months;
      }

      const response = await api.dashboard.metricsList(queryParams);
      return response.data;
    },
    enabled: isAuthenticated && enabled,
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
