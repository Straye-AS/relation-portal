"use client";

/**
 * usePermissions Hook
 *
 * Fetches and caches user permissions from the backend.
 * Provides helper functions for permission checking.
 */

import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { useApi } from "@/lib/api/api-provider";
import { useAuth } from "./useAuth";
import type { DomainPermissionDTO } from "@/lib/.generated/data-contracts";

export interface PermissionCheck {
  resource: string;
  action: string;
}

export interface UsePermissionsReturn {
  /**
   * List of all user permissions
   */
  permissions: DomainPermissionDTO[];

  /**
   * User's assigned roles
   */
  roles: string[];

  /**
   * Whether the user is a super admin (has all permissions)
   */
  isSuperAdmin: boolean;

  // Note: isCompanyAdmin is available via useCurrentUser hook, not here

  /**
   * Check if user has a specific permission
   */
  can: (resource: string, action: string) => boolean;

  /**
   * Check if user has any of the specified permissions
   */
  canAny: (checks: PermissionCheck[]) => boolean;

  /**
   * Check if user has all of the specified permissions
   */
  canAll: (checks: PermissionCheck[]) => boolean;

  /**
   * Whether permissions are still loading
   */
  isLoading: boolean;

  /**
   * Error if permissions failed to load
   */
  error: Error | null;
}

/**
 * Hook to fetch and check user permissions
 */
export function usePermissions(): UsePermissionsReturn {
  const { isAuthenticated } = useAuth();
  const api = useApi();

  const { data, isLoading, error } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await api.auth.permissionsList();
      return response.data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });

  const permissions = useMemo(() => data?.permissions ?? [], [data]);
  const roles = useMemo(() => data?.roles ?? [], [data]);
  const isSuperAdmin = data?.isSuperAdmin ?? false;
  // Note: isCompanyAdmin comes from the user profile, not permissions endpoint
  // Use useCurrentUser hook for company admin status

  /**
   * Check if user has a specific permission
   */
  const can = useCallback(
    (resource: string, action: string): boolean => {
      // Super admins can do everything
      if (isSuperAdmin) return true;

      // Check explicit permissions
      return permissions.some(
        (p) =>
          p.resource === resource && p.action === action && p.allowed === true
      );
    },
    [permissions, isSuperAdmin]
  );

  /**
   * Check if user has any of the specified permissions
   */
  const canAny = useCallback(
    (checks: PermissionCheck[]): boolean => {
      if (isSuperAdmin) return true;
      return checks.some((check) => can(check.resource, check.action));
    },
    [can, isSuperAdmin]
  );

  /**
   * Check if user has all of the specified permissions
   */
  const canAll = useCallback(
    (checks: PermissionCheck[]): boolean => {
      if (isSuperAdmin) return true;
      return checks.every((check) => can(check.resource, check.action));
    },
    [can, isSuperAdmin]
  );

  return {
    permissions,
    roles,
    isSuperAdmin,
    can,
    canAny,
    canAll,
    isLoading,
    error: error as Error | null,
  };
}

/**
 * Common permission checks
 */
export const PERMISSIONS = {
  // Deals
  DEALS_CREATE: { resource: "deals", action: "create" },
  DEALS_READ: { resource: "deals", action: "read" },
  DEALS_UPDATE: { resource: "deals", action: "update" },
  DEALS_DELETE: { resource: "deals", action: "delete" },

  // Offers
  OFFERS_CREATE: { resource: "offers", action: "create" },
  OFFERS_READ: { resource: "offers", action: "read" },
  OFFERS_UPDATE: { resource: "offers", action: "update" },
  OFFERS_DELETE: { resource: "offers", action: "delete" },

  // Customers
  CUSTOMERS_CREATE: { resource: "customers", action: "create" },
  CUSTOMERS_READ: { resource: "customers", action: "read" },
  CUSTOMERS_UPDATE: { resource: "customers", action: "update" },
  CUSTOMERS_DELETE: { resource: "customers", action: "delete" },

  // Projects
  PROJECTS_CREATE: { resource: "projects", action: "create" },
  PROJECTS_READ: { resource: "projects", action: "read" },
  PROJECTS_UPDATE: { resource: "projects", action: "update" },
  PROJECTS_DELETE: { resource: "projects", action: "delete" },

  // Admin
  ADMIN_USERS: { resource: "admin", action: "manage_users" },
  ADMIN_ROLES: { resource: "admin", action: "manage_roles" },
  ADMIN_AUDIT: { resource: "admin", action: "view_audit" },
} as const;
