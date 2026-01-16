import axios from "axios";
import axiosRetry from "axios-retry";
import { handleNetworkError, handleValidationError } from "../utils/errorHandler";
import logger from "../utils/logger";

const useAxios = (
  onLoading?: (loading: boolean) => void,
  onBackDrop?: (value: boolean) => void,
) => {
  const server = axios.create({
    baseURL: `/api/v1`,
    withCredentials: true, // Enable cookies for session-based auth
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  axiosRetry(server, {
    retries: 2,
    retryDelay: axiosRetry.exponentialDelay,
    retryCondition: (error) => {
      return [502, 503, 504].includes(error?.response?.status || 0);
    },
  });


  server.interceptors.response.use(
    (response) => {
      // Laravel success responses
      return response;
    },
    (error) => {
      onLoading?.(false);
      onBackDrop?.(false);
      
      const method = error.config?.method?.toUpperCase?.();
      
      // For GET requests, don't show toasts (errors are handled by components)
      if (method === "GET") {
        return Promise.reject(error);
      }
      
      // Handle network errors
      if (error.request && !error.response) {
        handleNetworkError(error);
        return Promise.reject(error);
      }
      
      // Handle validation errors (422)
      if (error.response?.status === 422) {
        handleValidationError(error);
        return Promise.reject(error);
      }
      
      // Handle other HTTP errors (401, 403, 500, etc.)
      if (error.response) {
        const { handleError } = require("../utils/errorHandler");
        handleError(error, {
          showToast: true,
          logError: true,
        });
      } else {
        // Error setting up request
        logger.error("Error setting up request", error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return { server };
};

export default useAxios;
