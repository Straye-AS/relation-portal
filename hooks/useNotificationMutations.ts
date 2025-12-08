"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api/api-provider";
import { useNotificationStore } from "@/store/useNotificationStore";

/**
 * Mark a single notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const api = useApi();
  const markAsRead = useNotificationStore((state) => state.markAsRead);

  return useMutation({
    mutationFn: async (id: string) => {
      await api.notifications.readUpdate({ id });
    },
    onSuccess: (_, id) => {
      markAsRead(id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "count"] });
    },
    onError: (error: Error) => {
      console.error("Failed to mark notification as read:", error);
    },
  });
}

/**
 * Mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const api = useApi();
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  return useMutation({
    mutationFn: async () => {
      await api.notifications.readAllUpdate();
    },
    onSuccess: () => {
      markAllAsRead();
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "count"] });
    },
    onError: (error: Error) => {
      console.error("Failed to mark all notifications as read:", error);
    },
  });
}
