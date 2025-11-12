import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./msalConfig";

/**
 * Initialize MSAL instance
 * This should be created once and reused throughout the application
 */
export const msalInstance = new PublicClientApplication(msalConfig);

// Initialize MSAL
await msalInstance.initialize();
