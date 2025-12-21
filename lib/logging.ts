/**
 * Centralized Logging Service
 *
 * Provides structured logging with different log levels.
 * In production, errors can be sent to external services.
 * In development, logs are output to console with formatting.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  /** Component or module name */
  component?: string;
  /** User ID if available */
  userId?: string;
  /** Additional metadata */
  [key: string]: unknown;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: Error;
}

/**
 * Check if we're in development environment
 */
function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Format log entry for console output
 */
function formatLogEntry(entry: LogEntry): string {
  const { level, message, context } = entry;
  const prefix = `[${level.toUpperCase()}]`;
  const contextStr = context?.component ? `[${context.component}]` : "";
  return `${prefix}${contextStr} ${message}`;
}

/**
 * Send log to external service (production only)
 * This is a placeholder for integration with services like Sentry, DataDog, etc.
 */
function sendToExternalService(_entry: LogEntry): void {
  // TODO: Integrate with external logging service
  // Example: Sentry.captureException(_entry.error)
  // Example: datadogLogs.logger.error(_entry.message, _entry.context)
}

/**
 * Core logging function
 */
function log(
  level: LogLevel,
  message: string,
  errorOrContext?: Error | LogContext,
  context?: LogContext
): void {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
  };

  // Handle overloaded parameters
  if (errorOrContext instanceof Error) {
    entry.error = errorOrContext;
    entry.context = context;
  } else if (errorOrContext) {
    entry.context = errorOrContext;
  }

  // Always output to console in development
  if (isDevelopment()) {
    const formattedMessage = formatLogEntry(entry);

    switch (level) {
      case "debug":
        // eslint-disable-next-line no-console
        console.debug(formattedMessage, entry.error || "", entry.context || "");
        break;
      case "info":
        // eslint-disable-next-line no-console
        console.info(formattedMessage, entry.context || "");
        break;
      case "warn":
        // eslint-disable-next-line no-console
        console.warn(formattedMessage, entry.error || "", entry.context || "");
        break;
      case "error":
        // eslint-disable-next-line no-console
        console.error(formattedMessage, entry.error || "", entry.context || "");
        break;
    }
  }

  // Send errors and warnings to external service in production
  if (!isDevelopment() && (level === "error" || level === "warn")) {
    sendToExternalService(entry);
  }
}

/**
 * Logger interface with methods for each log level
 */
export const logger = {
  /**
   * Debug level - verbose information for debugging
   * Only shown in development
   */
  debug: (message: string, context?: LogContext) => {
    if (isDevelopment()) {
      log("debug", message, context);
    }
  },

  /**
   * Info level - general information about application flow
   */
  info: (message: string, context?: LogContext) => {
    log("info", message, context);
  },

  /**
   * Warn level - potential issues that don't prevent operation
   */
  warn: (
    message: string,
    errorOrContext?: Error | LogContext,
    context?: LogContext
  ) => {
    log("warn", message, errorOrContext, context);
  },

  /**
   * Error level - errors that need attention
   */
  error: (
    message: string,
    errorOrContext?: Error | LogContext,
    context?: LogContext
  ) => {
    log("error", message, errorOrContext, context);
  },

  /**
   * Create a child logger with preset context
   * Useful for component-specific logging
   */
  child: (defaultContext: LogContext) => ({
    debug: (message: string, context?: LogContext) =>
      logger.debug(message, { ...defaultContext, ...context }),
    info: (message: string, context?: LogContext) =>
      logger.info(message, { ...defaultContext, ...context }),
    warn: (
      message: string,
      errorOrContext?: Error | LogContext,
      context?: LogContext
    ) =>
      logger.warn(message, errorOrContext, { ...defaultContext, ...context }),
    error: (
      message: string,
      errorOrContext?: Error | LogContext,
      context?: LogContext
    ) =>
      logger.error(message, errorOrContext, { ...defaultContext, ...context }),
  }),
};

/**
 * Create a component-specific logger
 * @example
 * const log = createLogger('useOffers');
 * log.error('Failed to fetch offers', error);
 */
export function createLogger(component: string) {
  return logger.child({ component });
}
