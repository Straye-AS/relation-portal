"use client";

/**
 * PermissionGate Component
 *
 * Declarative component for conditionally rendering UI based on user permissions.
 * Provides a clean way to hide/show features based on authorization.
 */

import { type ReactNode } from "react";
import { usePermissions, type PermissionCheck } from "@/hooks/usePermissions";
import { Skeleton } from "@/components/ui/skeleton";

interface PermissionGateProps {
  /**
   * Permission resource (e.g., 'deals', 'offers', 'customers')
   */
  resource?: string;

  /**
   * Permission action (e.g., 'create', 'read', 'update', 'delete')
   */
  action?: string;

  /**
   * Alternative: array of permission checks (use with 'mode')
   */
  permissions?: PermissionCheck[];

  /**
   * How to evaluate multiple permissions:
   * - 'any': User needs at least one permission
   * - 'all': User needs all permissions
   */
  mode?: "any" | "all";

  /**
   * Content to render if user has permission
   */
  children: ReactNode;

  /**
   * Content to render if user lacks permission (defaults to null)
   */
  fallback?: ReactNode;

  /**
   * Content to render while loading permissions
   */
  loading?: ReactNode;

  /**
   * Whether to show loading state (default: false)
   * If false, renders nothing while loading
   */
  showLoading?: boolean;
}

/**
 * Conditionally renders children based on user permissions
 *
 * @example
 * // Single permission check
 * <PermissionGate resource="deals" action="delete">
 *   <DeleteButton />
 * </PermissionGate>
 *
 * @example
 * // Multiple permissions (any)
 * <PermissionGate
 *   permissions={[
 *     { resource: 'deals', action: 'update' },
 *     { resource: 'deals', action: 'delete' }
 *   ]}
 *   mode="any"
 * >
 *   <ManageButton />
 * </PermissionGate>
 *
 * @example
 * // With fallback
 * <PermissionGate
 *   resource="admin"
 *   action="manage_users"
 *   fallback={<span>Access denied</span>}
 * >
 *   <AdminPanel />
 * </PermissionGate>
 */
export function PermissionGate({
  resource,
  action,
  permissions,
  mode = "any",
  children,
  fallback = null,
  loading,
  showLoading = false,
}: PermissionGateProps) {
  const { can, canAny, canAll, isLoading } = usePermissions();

  // Handle loading state
  if (isLoading) {
    if (showLoading) {
      return loading ?? <Skeleton className="h-8 w-24" />;
    }
    return null;
  }

  // Determine if user has permission
  let hasPermission = false;

  if (permissions && permissions.length > 0) {
    // Multiple permission checks
    hasPermission = mode === "all" ? canAll(permissions) : canAny(permissions);
  } else if (resource && action) {
    // Single permission check
    hasPermission = can(resource, action);
  } else {
    // No permissions specified - allow access
    console.warn(
      "[PermissionGate] No permissions specified, defaulting to allow"
    );
    hasPermission = true;
  }

  return hasPermission ? <>{children}</> : <>{fallback}</>;
}

/**
 * Higher-order component version of PermissionGate
 */
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  resource: string,
  action: string,
  FallbackComponent?: React.ComponentType
) {
  return function PermissionWrappedComponent(props: P) {
    return (
      <PermissionGate
        resource={resource}
        action={action}
        fallback={FallbackComponent ? <FallbackComponent /> : null}
      >
        <WrappedComponent {...props} />
      </PermissionGate>
    );
  };
}

/**
 * Hook-based permission check for non-rendering logic
 *
 * @example
 * const canDelete = useHasPermission('deals', 'delete');
 * if (canDelete) {
 *   // perform delete action
 * }
 */
export function useHasPermission(resource: string, action: string): boolean {
  const { can, isLoading } = usePermissions();

  if (isLoading) return false;
  return can(resource, action);
}
