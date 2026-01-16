/**
 * Logger utility for consistent logging across the application
 * Logs are only shown in development mode
 */

const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.DEV;

class Logger {
  private shouldLog(): boolean {
    // Only log in development mode
    return isDevelopment;
  }

  log(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.log(`[LOG] ${message}`, ...args);
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog()) {
      console.error(`[ERROR] ${message}`, error);
    }
    // In production, you might want to send errors to an error tracking service
    // e.g., Sentry, LogRocket, etc.
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  info(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.shouldLog()) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
}

export const logger = new Logger();
export default logger;

