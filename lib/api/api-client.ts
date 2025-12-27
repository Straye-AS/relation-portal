/**
 * Authenticated API Client Factory
 *
 * Creates an HTTP client that automatically attaches authentication tokens
 * to all requests. Works with both MSAL (Azure AD) and local auth modes.
 */

import { HttpClient, type RequestParams } from "@/lib/.generated/http-client";
import { logger } from "@/lib/logging";

export interface TokenProvider {
  (): Promise<string | null>;
}

/**
 * Handler for 401 unauthorized responses
 * @returns true if token was refreshed and request should be retried, false otherwise
 */
export interface UnauthorizedHandler {
  (): Promise<boolean>;
}

export interface ApiClientConfig {
  baseUrl?: string;
  tokenProvider: TokenProvider;
  headersProvider?: () => Promise<Record<string, string>>;
  onUnauthorized?: UnauthorizedHandler;
}

/**
 * Retry configuration for rate limiting
 */
const RETRY_CONFIG = {
  maxRetries: 3,
  baseDelayMs: 1000, // 1 second
  maxDelayMs: 30000, // 30 seconds
};

/**
 * Sleep for a specified number of milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay with jitter
 */
function getBackoffDelay(attempt: number): number {
  const delay = Math.min(
    RETRY_CONFIG.baseDelayMs * Math.pow(2, attempt),
    RETRY_CONFIG.maxDelayMs
  );
  // Add jitter (±25%) to prevent thundering herd
  const jitter = delay * 0.25 * (Math.random() * 2 - 1);
  return Math.round(delay + jitter);
}

/**
 * Creates an authenticated HTTP client instance
 */
export function createApiClient(config: ApiClientConfig) {
  const baseUrl =
    config.baseUrl ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

  const client = new HttpClient({
    baseUrl,
    securityWorker: async (): Promise<RequestParams | void> => {
      const token = await config.tokenProvider();
      if (token) {
        const extraHeaders = config.headersProvider
          ? await config.headersProvider()
          : {};

        return {
          headers: {
            Authorization: `Bearer ${token}`,
            ...extraHeaders,
          },
        };
      }
    },
  });

  // Add response interceptor for common error handling with retry logic
  const originalRequest = client.request.bind(client);

  // Track if we're already handling a 401 to prevent infinite loops
  let handlingUnauthorized = false;

  client.request = async <T, E>(
    ...args: Parameters<typeof originalRequest>
  ) => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
      try {
        const response = await originalRequest<T, E>(...args);
        return response;
      } catch (error: unknown) {
        lastError = error;

        // Handle common error scenarios
        if (error && typeof error === "object" && "status" in error) {
          const status = (error as { status: number }).status;

          if (status === 401) {
            // Token expired or invalid - try to refresh
            logger.warn("[API] Unauthorized - attempting token refresh");

            // Prevent infinite loops if refresh also returns 401
            if (!handlingUnauthorized && config.onUnauthorized) {
              handlingUnauthorized = true;
              try {
                const tokenRefreshed = await config.onUnauthorized();
                if (tokenRefreshed) {
                  logger.info("[API] Token refreshed, retrying request");
                  handlingUnauthorized = false;
                  // Retry the original request with the new token
                  continue;
                }
              } catch (refreshError) {
                logger.error(
                  "[API] Token refresh failed:",
                  refreshError as Error
                );
              } finally {
                handlingUnauthorized = false;
              }
            }

            // If we get here, either refresh failed or wasn't available
            logger.error("[API] Unauthorized - session expired");
            throw error;
          }

          if (status === 403) {
            // Forbidden - don't retry
            logger.error("[API] Forbidden - insufficient permissions");
            throw error;
          }

          if (status === 429) {
            // Rate limited - retry with exponential backoff
            if (attempt < RETRY_CONFIG.maxRetries) {
              const delay = getBackoffDelay(attempt);
              logger.warn(
                `[API] Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})`
              );
              await sleep(delay);
              continue;
            }
            logger.error("[API] Rate limited - max retries exceeded");
          }

          if (status >= 500 && attempt < RETRY_CONFIG.maxRetries) {
            // Server error - retry with exponential backoff
            const delay = getBackoffDelay(attempt);
            logger.warn(
              `[API] Server error (${status}), retrying in ${delay}ms (attempt ${attempt + 1}/${RETRY_CONFIG.maxRetries})`
            );
            await sleep(delay);
            continue;
          }
        }

        throw error;
      }
    }

    throw lastError;
  };

  return client;
}

/**
 * Creates an API client for server-side rendering
 * Uses a provided token directly (e.g., from cookies)
 */
export function createServerApiClient(token?: string) {
  const baseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:8080";

  return new HttpClient({
    baseUrl,
    securityWorker: async (): Promise<RequestParams | void> => {
      if (token) {
        return {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      }
    },
  });
}

// Export HttpClient type for use elsewhere
export type { HttpClient };
