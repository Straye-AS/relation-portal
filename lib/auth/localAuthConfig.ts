import { User } from "@/types";

/**
 * Test user for local development
 * This user is only available when NEXT_PUBLIC_USE_LOCAL_AUTH is enabled
 */
export const TEST_USER: User = {
  id: "test-user-123",
  name: "Test Utvikler",
  email: "test@straye.no",
  roles: ["admin", "user"],
  department: "Utvikling",
  avatar: undefined,
};

/**
 * Check if local auth mode is enabled
 */
export function isLocalAuthEnabled(): boolean {
  return process.env.NEXT_PUBLIC_USE_LOCAL_AUTH === "true";
}

/**
 * Local storage key for auth mode preference
 */
export const AUTH_MODE_KEY = "straye_auth_mode";

/**
 * Get the current auth mode preference from local storage
 * This allows toggling between local and MS auth in development
 */
export function getAuthModePreference(): "local" | "microsoft" {
  if (typeof window === "undefined") return "local";

  const stored = localStorage.getItem(AUTH_MODE_KEY);
  return (stored as "local" | "microsoft") || "local";
}

/**
 * Set the auth mode preference
 */
export function setAuthModePreference(mode: "local" | "microsoft"): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(AUTH_MODE_KEY, mode);
}

/**
 * Reset the auth mode preference
 * Removes the preference from localStorage, defaulting back to "local"
 */
export function resetAuthModePreference(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(AUTH_MODE_KEY);
}
