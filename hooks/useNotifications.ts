"use client";

/**
 * Notifications Hooks
 *
 * React Query hooks for notification operations.
 * Uses the generated API client for backend communication.
 */

import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useEffect } from "react";
import type { DomainNotificationDTO } from "@/lib/.generated/data-contracts";
import { useAuth } from "@/hooks/useAuth";

/**
 * Fetch all notifications with polling
 */
export function useNotifications() {
  const api = useApi();
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications
  );
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.notifications.notificationsList({});

      return response.data?.data || response.data || [];
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Poll every 30 seconds
  });

  // Sync with store
  useEffect(() => {
    if (query.data && Array.isArray(query.data)) {
      // Adapt the data structure for the store
      const notifications = query.data.map((n: DomainNotificationDTO) => ({
        id: n.id ?? "",
        type: (n.type ?? "system") as
          | "offer"
          | "project"
          | "customer"
          | "system",
        title: n.title ?? "",
        message: n.message ?? "",
        read: n.read ?? false,
        createdAt: n.createdAt ?? "",
        entityId: n.entityId,
        entityType: n.entityType as
          | "offer"
          | "project"
          | "customer"
          | undefined,
      }));
      setNotifications(notifications);
    }
  }, [query.data, setNotifications]);

  return query;
}

/**
 * Get unread notification count
 */
export function useNotificationCount() {
  const api = useApi();
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ["notifications", "count"],
    queryFn: async () => {
      const response = await api.notifications.countList();
      return response.data;
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Poll every 30 seconds
  });
}
