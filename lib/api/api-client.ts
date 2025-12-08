/**
 * Authenticated API Client Factory
 *
 * Creates an HTTP client that automatically attaches authentication tokens
 * to all requests. Works with both MSAL (Azure AD) and local auth modes.
 */

import { HttpClient, type RequestParams } from "@/lib/.generated/http-client";

export interface TokenProvider {
  (): Promise<string | null>;
}

export interface ApiClientConfig {
  baseUrl?: string;
  tokenProvider: TokenProvider;
  headersProvider?: () => Promise<Record<string, string>>;
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

  // Add response interceptor for common error handling
  const originalRequest = client.request.bind(client);

  client.request = async <T, E>(
    ...args: Parameters<typeof originalRequest>
  ) => {
    try {
      const response = await originalRequest<T, E>(...args);
      return response;
    } catch (error: unknown) {
      // Handle common error scenarios
      if (error && typeof error === "object" && "status" in error) {
        const status = (error as { status: number }).status;

        if (status === 401) {
          // Token expired or invalid - could trigger refresh here
          console.error("[API] Unauthorized - token may be expired");
        }

        if (status === 403) {
          console.error("[API] Forbidden - insufficient permissions");
        }

        if (status === 429) {
          console.error("[API] Rate limited");
        }
      }

      throw error;
    }
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
