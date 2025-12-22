"use client";

/**
 * API Provider
 *
 * React context provider that creates and manages the authenticated API client.
 * Provides access to all generated API modules through a single context.
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { createApiClient, type HttpClient } from "./api-client";
import { useAuth } from "@/hooks/useAuth";
import { useCompanyStore } from "@/store/company-store";

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
  const { getAccessToken } = useAuth();

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
  }, [getAccessToken]);

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
