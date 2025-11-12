"use client";

import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";
import { ReactNode } from "react";
import { LocalAuthProvider } from "./LocalAuthContext";
import { isLocalAuthEnabled, getAuthModePreference } from "./localAuthConfig";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider wraps the application with appropriate authentication context
 * Uses LocalAuthProvider in local development mode, MsalProvider in production
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Check if we should use local auth
  const useLocalAuth = isLocalAuthEnabled() &&
    (typeof window === "undefined" || getAuthModePreference() === "local");

  if (useLocalAuth) {
    return <LocalAuthProvider>{children}</LocalAuthProvider>;
  }

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
