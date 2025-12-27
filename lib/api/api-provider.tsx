"use client";

/**
 * API Provider
 *
 * React context provider that creates and manages the authenticated API client.
 * Provides access to all generated API modules through a single context.
 */

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { createApiClient, type HttpClient } from "./api-client";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyStore } from "@/store/company-store";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "@/lib/auth/msalConfig";
import {
  isLocalAuthEnabled,
  getAuthModePreference,
} from "@/lib/auth/localAuthConfig";
import { logger } from "@/lib/logging";

// Import generated API modules
import { Activities } from "@/lib/.generated/Activities";
import { Audit } from "@/lib/.generated/Audit";
import { Auth } from "@/lib/.generated/Auth";
import { Companies } from "@/lib/.generated/Companies";
import { Contacts } from "@/lib/.generated/Contacts";
import { Customers } from "@/lib/.generated/Customers";
import { Dashboard } from "@/lib/.generated/Dashboard";
import { Deals } from "@/lib/.generated/Deals";
import { Files } from "@/lib/.generated/Files";
import { Notifications } from "@/lib/.generated/Notifications";

import { Offers } from "@/lib/.generated/Offers";
import { Projects } from "@/lib/.generated/Projects";
import { Search } from "@/lib/.generated/Search";
import { Suppliers } from "@/lib/.generated/Suppliers";
import { Users } from "@/lib/.generated/Users";

/**
 * API Client interface with all available modules
 */
export interface ApiClient {
  http: HttpClient;
  activities: Activities;
  audit: Audit;
  auth: Auth;
  companies: Companies;
  contacts: Contacts;
  customers: Customers;
  dashboard: Dashboard;
  deals: Deals;
  files: Files;
  notifications: Notifications;

  offers: Offers;
  projects: Projects;
  search: Search;
  suppliers: Suppliers;
  users: Users;
}

const ApiContext = createContext<ApiClient | null>(null);

interface ApiProviderProps {
  children: ReactNode;
}

/**
 * API Provider Component
 *
 * Wraps the application to provide authenticated API access to all components.
 * Must be used within an AuthProvider.
 */
export function ApiProvider({ children }: ApiProviderProps) {
  const { getAccessToken, logout } = useAuth();
  const { instance, accounts } = useMsal();

  // Use ref to access latest logout function without recreating the API client
  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  // Check if using local auth mode
  const isLocalAuth =
    isLocalAuthEnabled() &&
    (typeof window === "undefined" || getAuthModePreference() === "local");

  /**
   * Handler for 401 Unauthorized responses
   * Only triggers for authenticated users - attempts to force refresh the token from Microsoft,
   * and if that fails, logs out the user.
   *
   * Note: This should NOT be called for unauthenticated users (no account) -
   * those 401s are expected and handled by the normal auth flow.
   */
  const handleUnauthorized = useCallback(async (): Promise<boolean> => {
    const account = accounts[0];

    // If there's no account, user is not logged in - don't try to refresh or logout
    // Just let the normal 401 error propagate (the app will show login page)
    if (!account) {
      logger.info(
        "[API] No active account - user not logged in, skipping token refresh"
      );
      return false;
    }

    // In local auth mode with an active session, we can't refresh tokens - just logout
    if (isLocalAuth) {
      logger.warn("[API] Local auth mode - cannot refresh token, logging out");
      try {
        await logoutRef.current();
      } catch (e) {
        logger.error("[API] Logout failed:", e as Error);
        // Force redirect to home/login page
        if (typeof window !== "undefined") {
          window.location.href = "/";
        }
      }
      return false;
    }

    try {
      // Force refresh the token from Microsoft
      logger.info("[API] Attempting to force refresh token from Microsoft");
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
        forceRefresh: true, // Force a new token from the server
      });

      if (response.accessToken) {
        logger.info("[API] Token successfully refreshed");
        return true; // Token refreshed, retry the request
      }
    } catch (refreshError) {
      logger.error(
        "[API] Failed to refresh token from Microsoft:",
        refreshError as Error
      );
    }

    // Token refresh failed - session is expired, log out
    logger.warn("[API] Token refresh failed - logging out user");
    try {
      await logoutRef.current();
    } catch (e) {
      logger.error("[API] Logout failed:", e as Error);
      // Force redirect to home/login page even if logout fails
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
    return false;
  }, [instance, accounts, isLocalAuth]);

  const apiClient = useMemo<ApiClient>(() => {
    const tokenProvider = async () => {
      if (getAccessToken) {
        return getAccessToken();
      }
      return null;
    };

    const http = createApiClient({
      tokenProvider,
      headersProvider: async () => {
        const selectedCompanyId = useCompanyStore.getState().selectedCompanyId;
        return {
          "X-Company-ID": selectedCompanyId,
        };
      },
      onUnauthorized: handleUnauthorized,
    });

    // Create instances of all API modules
    return {
      http,
      activities: new Activities(http),
      audit: new Audit(http),
      auth: new Auth(http),
      companies: new Companies(http),
      contacts: new Contacts(http),
      customers: new Customers(http),
      dashboard: new Dashboard(http),
      deals: new Deals(http),
      files: new Files(http),
      notifications: new Notifications(http),

      offers: new Offers(http),
      projects: new Projects(http),
      search: new Search(http),
      suppliers: new Suppliers(http),
      users: new Users(http),
    };
  }, [getAccessToken, handleUnauthorized]);

  return (
    <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>
  );
}

/**
 * Hook to access the API client
 *
 * @throws Error if used outside of ApiProvider
 */
export function useApi(): ApiClient {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}

/**
 * Hook to check if API is available
 */
export function useApiAvailable(): boolean {
  const context = useContext(ApiContext);
  return context !== null;
}
