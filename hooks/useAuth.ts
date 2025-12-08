"use client";

import { useMsal } from "@azure/msal-react";
import { AccountInfo, InteractionRequiredAuthError } from "@azure/msal-browser";
import { loginRequest } from "@/lib/auth/msalConfig";
import { User } from "@/types";
import { useCallback, useMemo } from "react";
import { useLocalAuth } from "@/lib/auth/LocalAuthContext";
import {
  isLocalAuthEnabled,
  getAuthModePreference,
} from "@/lib/auth/localAuthConfig";

/**
 * Auth context return type
 */
export interface AuthContext {
  user: User | null;
  account: AccountInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
}

/**
 * Custom hook for authentication operations
 * Automatically uses local auth or MSAL based on environment configuration
 * Provides user info, login, logout, and authentication state
 */
export function useAuth(): AuthContext {
  const msalContext = useMsal();
  const localAuthContext = useLocalAuth();

  // Determine which auth mode to use
  const shouldUseLocalAuth =
    isLocalAuthEnabled() &&
    (typeof window === "undefined" || getAuthModePreference() === "local");

  // Always call hooks unconditionally
  const { instance, accounts, inProgress } = msalContext;
  const account: AccountInfo | null = accounts[0] || null;

  const msalUser: User | null = useMemo(() => {
    if (!account) return null;

    return {
      id: account.localAccountId,
      name: account.name || "",
      email: account.username,
      roles: [], // Will be populated from token claims in production
      avatar: undefined,
    };
  }, [account]);

  const msalLogin = useCallback(async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, [instance]);

  const msalLogout = useCallback(async () => {
    try {
      await instance.logoutRedirect({
        account: account,
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, [instance, account]);

  /**
   * Get access token for API calls (MSAL mode)
   */
  const getMsalAccessToken = useCallback(async (): Promise<string | null> => {
    if (!account) return null;

    try {
      // Try to get token silently first
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: account,
      });
      return response.accessToken;
    } catch (error) {
      // If silent acquisition fails, try interactive
      if (error instanceof InteractionRequiredAuthError) {
        try {
          const response = await instance.acquireTokenPopup(loginRequest);
          return response.accessToken;
        } catch (popupError) {
          console.error("Failed to acquire token via popup:", popupError);
          return null;
        }
      }
      console.error("Failed to acquire token silently:", error);
      return null;
    }
  }, [instance, account]);

  /**
   * Get access token for API calls (Local auth mode)
   * Returns a mock token for local development
   */
  const getLocalAccessToken = useCallback(async (): Promise<string | null> => {
    if (!localAuthContext.isAuthenticated) return null;
    // Return a mock token for local development
    // The backend should accept this in development mode
    return "local-dev-token";
  }, [localAuthContext.isAuthenticated]);

  // Return appropriate auth context based on mode
  if (shouldUseLocalAuth) {
    return {
      user: localAuthContext.user,
      account: null,
      isAuthenticated: localAuthContext.isAuthenticated,
      isLoading: localAuthContext.isLoading,
      login: localAuthContext.login,
      logout: localAuthContext.logout,
      getAccessToken: getLocalAccessToken,
    };
  }

  // Return MSAL auth context
  return {
    user: msalUser,
    account,
    isAuthenticated: accounts.length > 0,
    isLoading: inProgress !== "none",
    login: msalLogin,
    logout: msalLogout,
    getAccessToken: getMsalAccessToken,
  };
}
