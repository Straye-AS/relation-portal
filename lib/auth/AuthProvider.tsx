"use client";

import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";
import { ReactNode } from "react";
import { LocalAuthProvider } from "./LocalAuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider wraps the application with appropriate authentication context
 * Always includes both providers since useAuth hook unconditionally calls both
 * useMsal() and useLocalAuth() - it decides which to use based on config
 */
export function AuthProvider({ children }: AuthProviderProps) {
  // Always wrap with both providers so useAuth can safely call both hooks
  // The useAuth hook decides which auth mechanism to use based on config
  return (
    <MsalProvider instance={msalInstance}>
      <LocalAuthProvider>{children}</LocalAuthProvider>
    </MsalProvider>
  );
}
