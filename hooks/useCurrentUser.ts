"use client";

/**
 * useCurrentUser Hook
 *
 * Fetches the authenticated user's profile from the backend.
 * Combines frontend auth state with backend user data.
 */

import { useQuery } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { useApi } from "@/lib/api/api-provider";
import { useAuth } from "./useAuth";
import { useCompanyStore, getCompanyById } from "@/store/company-store";
import type { DomainAuthUserDTO } from "@/lib/.generated/data-contracts";
import { useMsal } from "@azure/msal-react";
import { EventType } from "@azure/msal-browser";

export interface CurrentUser extends DomainAuthUserDTO {
  /**
   * Whether the user data is fully loaded from backend
   */
  isFullyLoaded: boolean;
}

export interface UseCurrentUserReturn {
  /**
   * The current user, or null if not authenticated
   */
  user: CurrentUser | null;

  /**
   * Whether the user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Whether user data is loading
   */
  isLoading: boolean;

  /**
   * Error if user fetch failed
   */
  error: Error | null;

  /**
   * Refetch user data
   */
  refetch: () => Promise<void>;
}

/**
 * Hook to get the current authenticated user with full backend data
 */
export function useCurrentUser(): UseCurrentUserReturn {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const api = useApi();
  const { setUserCompany, setCanViewAllCompanies } = useCompanyStore();
  const { instance } = useMsal();

  const {
    data: backendUser,
    isLoading: userLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await api.auth.getAuth();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });

  // Listen for MSAL token events to re-validate auth
  useEffect(() => {
    console.log("DEBUG: Setting up MSAL event listener");
    const callbackId = instance.addEventCallback((message) => {
      console.log("DEBUG: MSAL Event:", message.eventType);
      if (
        message.eventType === EventType.LOGIN_SUCCESS ||
        message.eventType === EventType.ACQUIRE_TOKEN_SUCCESS ||
        message.eventType === EventType.SSO_SILENT_SUCCESS
      ) {
        console.log("DEBUG: Triggering refetch from event:", message.eventType);
        refetch();
      }
    });

    return () => {
      if (callbackId) {
        console.log("DEBUG: Removing MSAL event listener");
        instance.removeEventCallback(callbackId);
      }
    };
  }, [instance, refetch]);

  // Update company store when user data loads
  useEffect(() => {
    if (backendUser) {
      // Set super admin status
      setCanViewAllCompanies(backendUser.isSuperAdmin ?? false);

      // Set user's company
      if (backendUser.company?.id) {
        const company = getCompanyById(
          backendUser.company.id as Parameters<typeof getCompanyById>[0]
        );
        if (company) {
          setUserCompany(company);
        }
      }
    }
  }, [backendUser, setCanViewAllCompanies, setUserCompany]);

  // Merge frontend and backend user data
  const user = useMemo<CurrentUser | null>(() => {
    if (!isAuthenticated) return null;

    // Return partial data from frontend auth while loading backend data
    if (!backendUser) {
      return null;
    }

    // Return full backend user data
    return {
      ...backendUser,
      isFullyLoaded: true,
    };
  }, [isAuthenticated, backendUser]);

  const isLoading = authLoading || (isAuthenticated && userLoading);

  return {
    user,
    isAuthenticated,
    isLoading,
    error: error as Error | null,
    refetch: async () => {
      await refetch();
    },
  };
}

/**
 * Hook to get just the user's company info
 */
export function useUserCompany() {
  const { user, isLoading } = useCurrentUser();

  return {
    company: user?.company ?? null,
    companyId: user?.company?.id ?? null,
    isLoading,
  };
}
