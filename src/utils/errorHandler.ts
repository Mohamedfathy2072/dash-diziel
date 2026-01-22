import { AxiosError } from "axios";
import { htmlToText } from "html-to-text";
import { handleToaster } from "../functions/handleToaster";
import logger from "./logger";
import i18n from "../i18n";

/**
 * Standardized error handling utility with localization support
 * Provides consistent error handling across the application
 */

export interface ErrorHandlerOptions {
  showToast?: boolean;
  logError?: boolean;
  defaultMessage?: string;
  namespace?: string;
}

/**
 * Get localized error message
 */
const getLocalizedMessage = (key: string, defaultValue: string, namespace?: string): string => {
  try {
    const ns = namespace || "errors";
    return i18n.t(key, { ns, defaultValue });
  } catch {
    return defaultValue;
  }
};

/**
 * Extract error message from various error formats with localization support
 */
const extractErrorMessage = (error: unknown, namespace?: string): string | null => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    const status = error.response?.status;
    
    // Laravel validation errors (422)
    if (status === 422 && data?.errors) {
      const errors = data.errors;
      
      // Get first error from any field
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey && Array.isArray(errors[firstErrorKey]) && errors[firstErrorKey].length > 0) {
        const errorMessage = htmlToText(errors[firstErrorKey][0] as string);
        // Try to translate common validation messages
        return translateValidationMessage(errorMessage, namespace) || errorMessage;
      }
      
      // Handle nested error structure
      const firstError = Object.values(errors)[0];
      if (Array.isArray(firstError) && firstError.length > 0) {
        const errorMessage = htmlToText(firstError[0] as string);
        return translateValidationMessage(errorMessage, namespace) || errorMessage;
      }
    }
    
    // Laravel error messages
    const possibleMessages = [
      data?.message,
      data?.error,
      data?.errors?.[0]?.message,
      data?.data?.message,
      data?.data?.error,
    ].filter(Boolean);
    
    if (possibleMessages.length > 0) {
      const message = htmlToText(possibleMessages[0] as string);
      return translateValidationMessage(message, namespace) || message;
    }
    
    // Network errors
    if (!error.response && error.request) {
      return getLocalizedMessage(
        "network_error",
        "Network error. Please check your connection.",
        namespace
      );
    }
    
    // Default error message
    return error.message || getLocalizedMessage("unknown_error", "An error occurred", namespace);
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return null;
};

/**
 * Translate common validation messages
 */
const translateValidationMessage = (message: string, namespace?: string): string | null => {
  const ns = namespace || "errors";
  
  // Common Laravel validation patterns
  const patterns: Record<string, string> = {
    "required": getLocalizedMessage("validation.required", "This field is required", ns),
    "email": getLocalizedMessage("validation.email", "Please enter a valid email address", ns),
    "min": getLocalizedMessage("validation.min", "The value is too short", ns),
    "max": getLocalizedMessage("validation.max", "The value is too long", ns),
    "numeric": getLocalizedMessage("validation.numeric", "This field must be a number", ns),
    "url": getLocalizedMessage("validation.url", "Please enter a valid URL", ns),
    "image": getLocalizedMessage("validation.image", "Please upload a valid image file", ns),
    "file": getLocalizedMessage("validation.file", "Please upload a valid file", ns),
    "size": getLocalizedMessage("validation.size", "The file size is invalid", ns),
    "mimes": getLocalizedMessage("validation.mimes", "The file type is not allowed", ns),
    "date": getLocalizedMessage("validation.date", "Please enter a valid date", ns),
    "after": getLocalizedMessage("validation.after", "The date must be after the specified date", ns),
    "before": getLocalizedMessage("validation.before", "The date must be before the specified date", ns),
  };
  
  // Try to match common patterns
  for (const [key, translation] of Object.entries(patterns)) {
    if (message.toLowerCase().includes(key)) {
      return translation;
    }
  }
  
  return null;
};

/**
 * Handle HTTP status codes with localization
 */
const handleHttpStatus = (status: number, namespace?: string): boolean => {
  const ns = namespace || "errors";
  
  switch (status) {
    case 401: {
      handleToaster({
        msg: getLocalizedMessage("unauthorized", "Unauthorized. Please login again.", ns),
        status: "error",
      });
      // Clear auth data and redirect
      const userDataStorageKey = import.meta.env.VITE_USER_DATA_STORAGE;
      if (userDataStorageKey) {
        localStorage.removeItem(userDataStorageKey);
      }
      window.location.href = `${import.meta.env.VITE_LOGIN_ROUTE || "/login"}`;
      return true; // Error handled
    }
      
    case 403:
      handleToaster({
        msg: getLocalizedMessage("forbidden", "You don't have permission to perform this action", ns),
        status: "error",
      });
      return true;
      
    case 404:
      handleToaster({
        msg: getLocalizedMessage("not_found", "Resource not found", ns),
        status: "error",
      });
      return true;
      
    case 422:
      // Validation errors - message already extracted
      return false; // Let caller handle the message
      
    case 500:
      handleToaster({
        msg: getLocalizedMessage("server_error", "Internal server error occurred", ns),
        status: "error",
      });
      return true;
      
    case 502:
    case 503:
    case 504:
      handleToaster({
        msg: getLocalizedMessage("service_unavailable", "Service temporarily unavailable. Please try again later.", ns),
        status: "error",
      });
      return true;
      
    default:
      return false;
  }
};

/**
 * Standardized error handler with localization
 */
export const handleError = (
  error: unknown,
  options: ErrorHandlerOptions = {}
): void => {
  const {
    showToast = true,
    logError = true,
    defaultMessage,
    namespace,
  } = options;

  const ns = namespace || "errors";
  const defaultMsg = defaultMessage || getLocalizedMessage("unknown_error", "An error occurred", ns);

  // Log error with full details
  if (logError) {
    logger.error("Error occurred", error);
    
    // Log detailed error information to console
    if (error instanceof AxiosError) {
      console.error('🔴 Backend Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        baseURL: error.config?.baseURL,
        fullURL: `${error.config?.baseURL}${error.config?.url}`,
        responseData: error.response?.data,
        requestData: error.config?.data,
        headers: error.config?.headers,
        message: error.message,
      });
      
      // Log response data if available
      if (error.response?.data) {
        console.error('🔴 Backend Response Data:', JSON.stringify(error.response.data, null, 2));
      }
    } else {
      console.error('🔴 Error Details:', error);
    }
  }

  // Handle Axios errors
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    
    // Handle specific status codes
    if (status && handleHttpStatus(status, namespace)) {
      return; // Error already handled
    }
    
    // Extract and show message
    const message = extractErrorMessage(error, namespace);
    if (showToast && message) {
      handleToaster({
        msg: message,
        status: "error",
      });
    }
    return;
  }

  // Handle generic errors
  const message = extractErrorMessage(error, namespace) || defaultMsg;
  if (showToast) {
    handleToaster({
      msg: message,
      status: "error",
    });
  }
};

/**
 * Handle network errors specifically
 */
export const handleNetworkError = (error: unknown, namespace?: string): void => {
  const ns = namespace || "errors";
  
  if (error instanceof AxiosError && error.request && !error.response) {
    handleToaster({
      msg: getLocalizedMessage("network_error", "Network error. Please check your connection.", ns),
      status: "error",
    });
    logger.error("Network error", error);
  } else {
    handleError(error, { namespace });
  }
};

/**
 * Handle validation errors specifically
 */
export const handleValidationError = (error: unknown, namespace?: string): void => {
  if (error instanceof AxiosError && error.response?.status === 422) {
    const message = extractErrorMessage(error, namespace);
    if (message) {
      handleToaster({
        msg: message,
        status: "error",
      });
    }
  } else {
    handleError(error, { namespace });
  }
};

/**
 * Handle API errors with full context
 */
export const handleApiError = (
  error: unknown,
  context?: {
    action?: string;
    entity?: string;
    namespace?: string;
    showToast?: boolean;
  }
): string => {
  const { action = "operation", entity = "item", namespace, showToast = true } = context || {};
  const ns = namespace || "errors";
  
  let errorMessage = extractErrorMessage(error, namespace);
  
  if (!errorMessage) {
    errorMessage = getLocalizedMessage(
      "operation_failed",
      `Failed to ${action} ${entity}`,
      ns
    );
  }
  
  if (showToast) {
    handleToaster({
      msg: errorMessage,
      status: "error",
    });
  }
  
  return errorMessage;
};

export default handleError;
