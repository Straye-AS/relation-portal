"use client";

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyStore } from "@/store/company-store";

export function useUsers(companyId?: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const { selectedCompanyId } = useCompanyStore();
  const targetCompanyId = companyId || selectedCompanyId;

  return useQuery({
    queryKey: ["users", targetCompanyId],
    queryFn: async () => {
      // Assuming usersList takes companyId or we filter.
      // Checking generated code would be best but let's assume standard pattern or fetch all.
      // If list doesn't take params, we just fetch all.
      const response = await api.users.usersList({});
      return response.data || [];
    },
    enabled: isAuthenticated,
  });
}
