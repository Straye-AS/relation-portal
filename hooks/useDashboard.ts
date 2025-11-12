"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/client";
import { CompanyId } from "@/types";

export function useDashboard(companyId?: CompanyId) {
  return useQuery({
    queryKey: ["dashboard", companyId],
    queryFn: () => dashboardApi.getMetrics(companyId),
    refetchInterval: 60000, // Refetch every minute
  });
}
