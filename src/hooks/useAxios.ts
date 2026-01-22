import axios from "axios";
import axiosRetry from "axios-retry";
import { handleNetworkError, handleValidationError, handleError } from "../utils/errorHandler";
import logger from "../utils/logger";

const useAxios = (
  onLoading?: (loading: boolean) => void,
  onBackDrop?: (value: boolean) => void,
) => {
  // Use direct URL in production/build, proxy in development
  const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.MODE === 'production' ? 'https://newapi.diziel.com' : 'http://localhost:8000');
  const isDev = import.meta.env.DEV;
  const baseURL = isDev ? '/api/v1' : `${backendUrl}/api/v1`;
  
  const server = axios.create({
    baseURL: baseURL,
    withCredentials: true, // Enable cookies for session-based auth
    maxRedirects: 0, // Prevent automatic redirects
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

  // Add request interceptor to log URLs
  server.interceptors.request.use(
    (config) => {
      // Debug: Log the full URL being requested
      if (import.meta.env.DEV) {
        console.log('useAxios Request URL:', config.baseURL + (config.url || ''));
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  server.interceptors.response.use(
    (response) => {
      // Laravel success responses
      // Debug: Log response URL if redirected
      if (import.meta.env.DEV && response.request?.responseURL) {
        console.log('useAxios Response URL:', response.request.responseURL);
      }
      return response;
    },
    (error) => {
      onLoading?.(false);
      onBackDrop?.(false);
      
      // Log full error details for debugging
      console.error('🔴 useAxios Error Details:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        baseURL: error.config?.baseURL,
        fullURL: `${error.config?.baseURL}${error.config?.url}`,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        request: error.request ? 'Request sent but no response' : 'No request sent',
      });
      
      const method = error.config?.method?.toUpperCase?.();
      
      // For GET requests, don't show toasts (errors are handled by components)
      if (method === "GET") {
        return Promise.reject(error);
      }
      
      // Handle network errors
      if (error.request && !error.response) {
        console.error('🔴 Network Error - No response received:', {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase(),
        });
        handleNetworkError(error);
        return Promise.reject(error);
      }
      
      // Handle validation errors (422)
      if (error.response?.status === 422) {
        console.error('🔴 Validation Error (422):', error.response?.data);
        handleValidationError(error);
        return Promise.reject(error);
      }
      
      // Handle other HTTP errors (401, 403, 500, etc.)
      if (error.response) {
        console.error('🔴 HTTP Error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
        handleError(error, {
          showToast: true,
          logError: true,
        });
      } else {
        // Error setting up request
        console.error('🔴 Request Setup Error:', error.message);
        logger.error("Error setting up request", error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return { server };
};

export default useAxios;
