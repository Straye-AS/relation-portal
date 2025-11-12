"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchApi } from "@/lib/api/client";
import { CompanyId } from "@/types";

export function useSearch(query: string, companyId?: CompanyId) {
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
        queryKey: ["search", debouncedQuery, companyId],
        queryFn: () =>
            isSearching
                ? searchApi.search(debouncedQuery, companyId)
                : searchApi.getRecentItems(companyId),
        staleTime: 30000, // Cache for 30 seconds
        enabled: true,
    });
}

