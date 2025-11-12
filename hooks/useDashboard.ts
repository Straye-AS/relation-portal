"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/client";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardApi.getMetrics,
    refetchInterval: 60000, // Refetch every minute
  });
}
