"use client";

import { useMsal } from "@azure/msal-react";
import { AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "@/lib/auth/msalConfig";
import { User } from "@/types";
import { useCallback, useMemo } from "react";

/**
 * Custom hook for authentication operations
 * Provides user info, login, logout, and authentication state
 */
export function useAuth() {
  const { instance, accounts, inProgress } = useMsal();

  const account: AccountInfo | null = accounts[0] || null;

  const user: User | null = useMemo(() => {
    if (!account) return null;

    return {
      id: account.localAccountId,
      name: account.name || "",
      email: account.username,
      roles: [], // Will be populated from token claims in production
      avatar: undefined,
    };
  }, [account]);

  const login = useCallback(async () => {
    try {
      await instance.loginRedirect(loginRequest);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }, [instance]);

  const logout = useCallback(async () => {
    try {
      await instance.logoutRedirect({
        account: account,
      });
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }, [instance, account]);

  const isAuthenticated = accounts.length > 0;
  const isLoading = inProgress !== "none";

  return {
    user,
    account,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
