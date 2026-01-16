import handleError from "../utils/errorHandler";

/**
 * @deprecated Use handleError from utils/errorHandler instead
 * This function is kept for backward compatibility
 */
export const handleAxiosError = (error: unknown) => {
    handleError(error, {
        showToast: true,
        logError: true,
    });
};
