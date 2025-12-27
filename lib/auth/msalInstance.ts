import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";
import { logger } from "@/lib/logging";

/**
 * Initialize MSAL instance
 * This should be created once and reused throughout the application
 */
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL (async initialization is handled in the provider)
if (typeof window !== "undefined") {
  msalInstance
    .initialize()
    .catch((error) => logger.error("MSAL initialization failed", error));
}
