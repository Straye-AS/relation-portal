"use client";

import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./msalInstance";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider wraps the application with MSAL authentication context
 */
export function AuthProvider({ children }: AuthProviderProps) {
  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
}
