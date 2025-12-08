/**
 * API Module Index
 *
 * Central export point for all API-related utilities and types.
 */

// API Provider and hooks
export {
  ApiProvider,
  useApi,
  useApiAvailable,
  type ApiClient,
} from "./api-provider";

// API Client factory
export {
  createApiClient,
  createServerApiClient,
  type TokenProvider,
  type ApiClientConfig,
} from "./api-client";

// Types and constants
export * from "./types";
