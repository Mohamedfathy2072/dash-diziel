import handleError from "../utils/errorHandler";

/**
 * Generic error handler for catch blocks
 * Uses standardized error handling
 */
export const handleCatchError = (error: unknown) => {
  handleError(error, {
    showToast: true,
    logError: true,
    defaultMessage: "An unexpected error occurred",
  });
};
