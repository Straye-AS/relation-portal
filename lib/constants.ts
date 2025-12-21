/**
 * Application Constants
 *
 * Centralized constants to avoid magic numbers throughout the codebase.
 */

// =============================================================================
// Query Configuration
// =============================================================================

/**
 * Default stale time for React Query cache (5 minutes)
 * Data older than this will be refetched in the background on next access.
 */
export const QUERY_STALE_TIME_DEFAULT = 5 * 60 * 1000; // 5 minutes

/**
 * Short stale time for frequently changing data (1 minute)
 */
export const QUERY_STALE_TIME_SHORT = 1 * 60 * 1000; // 1 minute

/**
 * Long stale time for rarely changing data (30 minutes)
 */
export const QUERY_STALE_TIME_LONG = 30 * 60 * 1000; // 30 minutes

/**
 * Default page size for paginated API requests
 */
export const DEFAULT_PAGE_SIZE = 20;

/**
 * Maximum page size for "fetch all" operations
 * Used when we need to load all records for autocomplete/select
 */
export const MAX_PAGE_SIZE = 1000;

// =============================================================================
// Polling Intervals
// =============================================================================

/**
 * Default polling interval for real-time updates (30 seconds)
 */
export const POLLING_INTERVAL_DEFAULT = 30 * 1000; // 30 seconds

/**
 * Fast polling interval for active updates (10 seconds)
 */
export const POLLING_INTERVAL_FAST = 10 * 1000; // 10 seconds

/**
 * Slow polling interval for background updates (60 seconds)
 */
export const POLLING_INTERVAL_SLOW = 60 * 1000; // 60 seconds

// =============================================================================
// UI Constants
// =============================================================================

/**
 * Debounce delay for search inputs (ms)
 */
export const SEARCH_DEBOUNCE_MS = 300;

/**
 * Animation duration for transitions (ms)
 */
export const ANIMATION_DURATION_MS = 200;

/**
 * Toast auto-dismiss duration (ms)
 */
export const TOAST_DURATION_MS = 5000;

// =============================================================================
// Validation Constants
// =============================================================================

/**
 * Maximum file upload size (50MB)
 */
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

/**
 * Maximum text input length for titles/names
 */
export const MAX_TITLE_LENGTH = 255;

/**
 * Maximum text input length for descriptions
 */
export const MAX_DESCRIPTION_LENGTH = 10000;
