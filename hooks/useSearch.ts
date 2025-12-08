"use client";

/**
 * Search Hooks
 *
 * React Query hooks for global search functionality.
 * Uses the generated API client for backend communication.
 */

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { useAuth } from "@/hooks/useAuth";

/**
 * Global search with debouncing
 */
export function useSearch(query: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const isSearching = debouncedQuery.trim().length > 0;

  return useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      if (!isSearching) {
        return { results: [], total: 0 };
      }
      const response = await api.search.searchList({
        q: debouncedQuery,
      });
      return response.data;
    },
    staleTime: 30000, // Cache for 30 seconds
    enabled: isSearching && isAuthenticated,
  });
}

/**
 * Quick search (no debouncing - for explicit search actions)
 */
export function useQuickSearch(query: string) {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["search", "quick", query],
    queryFn: async () => {
      const response = await api.search.searchList({ q: query });
      return response.data;
    },
    enabled: query.trim().length > 0 && isAuthenticated,
  });
}
