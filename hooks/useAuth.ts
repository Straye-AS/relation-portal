"use client";

import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "@/lib/auth/msalConfig";
import { User } from "@/types";
import { useCallback, useMemo } from "react";
import { useLocalAuth } from "@/lib/auth/LocalAuthContext";
import { isLocalAuthEnabled, getAuthModePreference } from "@/lib/auth/localAuthConfig";

/**
 * Custom hook for authentication operations
 * Automatically uses local auth or MSAL based on environment configuration
 * Provides user info, login, logout, and authentication state
 */
export function useAuth() {
  const msalContext = useMsal();
  const localAuthContext = useLocalAuth();

  // Determine which auth mode to use
  const shouldUseLocalAuth = isLocalAuthEnabled() &&
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

  // Return appropriate auth context based on mode
  if (shouldUseLocalAuth) {
    return {
      user: localAuthContext.user,
      account: null,
      isAuthenticated: localAuthContext.isAuthenticated,
      isLoading: localAuthContext.isLoading,
      login: localAuthContext.login,
      logout: localAuthContext.logout,
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
  };
}
