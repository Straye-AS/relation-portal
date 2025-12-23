"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Type definitions for URL parameter schemas
 */
type ParamType = "string" | "number" | "boolean";

interface ParamConfig<T> {
  type: ParamType;
  default: T;
}

type ParamSchema = Record<string, ParamConfig<string | number | boolean>>;

type InferParamType<T extends ParamConfig<unknown>> = T extends ParamConfig<
  infer U
>
  ? U
  : never;

type InferParams<T extends ParamSchema> = {
  [K in keyof T]: InferParamType<T[K]>;
};

/**
 * Parse a URL parameter value based on its type
 */
function parseValue<T extends ParamType>(
  value: string | null,
  type: T,
  defaultValue: string | number | boolean
): string | number | boolean {
  if (value === null) {
    return defaultValue;
  }

  switch (type) {
    case "number": {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? (defaultValue as number) : parsed;
    }
    case "boolean":
      return value === "true";
    case "string":
    default:
      return value;
  }
}

/**
 * Serialize a value to a URL string
 */
function serializeValue(value: string | number | boolean): string {
  return String(value);
}

/**
 * Hook for managing URL query parameters with type safety.
 * Syncs state with URL search params using Next.js useSearchParams and useRouter.
 *
 * @param schema - Object defining parameter names, types, and default values
 * @returns Object with current values and setter functions
 *
 * @example
 * ```tsx
 * const { params, setParam, setParams, resetParams } = useQueryParams({
 *   page: { type: "number", default: 1 },
 *   sortBy: { type: "string", default: "name" },
 *   sortOrder: { type: "string", default: "asc" },
 *   includeExpired: { type: "boolean", default: false },
 * });
 *
 * // Access values
 * console.log(params.page); // number
 *
 * // Set single value
 * setParam("page", 2);
 *
 * // Set multiple values
 * setParams({ page: 1, sortBy: "date" });
 *
 * // Reset all to defaults
 * resetParams();
 * ```
 */
export function useQueryParams<T extends ParamSchema>(schema: T) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse current URL params according to schema
  const params = useMemo(() => {
    const result = {} as InferParams<T>;

    for (const [key, config] of Object.entries(schema)) {
      const rawValue = searchParams?.get(key) ?? null;
      (result as Record<string, unknown>)[key] = parseValue(
        rawValue,
        config.type,
        config.default
      );
    }

    return result;
  }, [searchParams, schema]);

  // Update URL with new params using replace (no history entry)
  const updateUrl = useCallback(
    (newParams: Partial<InferParams<T>>) => {
      const currentParams = new URLSearchParams(searchParams?.toString() ?? "");

      for (const [key, value] of Object.entries(newParams)) {
        const config = schema[key];
        if (!config) continue;

        // Remove param if it equals default value (keep URL clean)
        if (value === config.default) {
          currentParams.delete(key);
        } else {
          currentParams.set(key, serializeValue(value as string | number | boolean));
        }
      }

      const queryString = currentParams.toString();
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(newUrl, { scroll: false });
    },
    [searchParams, pathname, router, schema]
  );

  // Set a single parameter
  const setParam = useCallback(
    <K extends keyof InferParams<T>>(key: K, value: InferParams<T>[K]) => {
      updateUrl({ [key]: value } as unknown as Partial<InferParams<T>>);
    },
    [updateUrl]
  );

  // Set multiple parameters at once
  const setParams = useCallback(
    (newParams: Partial<InferParams<T>>) => {
      updateUrl(newParams);
    },
    [updateUrl]
  );

  // Reset all parameters to defaults
  const resetParams = useCallback(() => {
    const defaults = {} as Partial<InferParams<T>>;
    for (const [key, config] of Object.entries(schema)) {
      (defaults as Record<string, unknown>)[key] = config.default;
    }
    updateUrl(defaults);
  }, [schema, updateUrl]);

  return {
    params,
    setParam,
    setParams,
    resetParams,
  };
}

/**
 * Convenience hook for common list page parameters.
 * Pre-configured with page, sortBy, sortOrder, and viewMode.
 */
export function useListPageParams<
  TExtra extends ParamSchema = Record<string, never>
>(extraSchema?: TExtra) {
  const baseSchema = {
    page: { type: "number" as const, default: 1 },
    sortBy: { type: "string" as const, default: "name" },
    sortOrder: { type: "string" as const, default: "asc" },
    viewMode: { type: "string" as const, default: "list" },
  };

  const schema = extraSchema
    ? { ...baseSchema, ...extraSchema }
    : baseSchema;

  return useQueryParams(schema);
}
