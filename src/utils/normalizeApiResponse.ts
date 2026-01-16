import type { PaginatedResponse } from "../types/pagination";

/**
 * Normalizes API responses to ensure consistent paginated response structure
 * Handles both paginated responses and plain arrays (fallback)
 */
export const normalizeApiResponse = <T>(
  responseData: T[] | PaginatedResponse<T>,
  params?: { page?: number; limit?: number }
): PaginatedResponse<T> => {
  // If data is just an array, construct a paginated response
  if (Array.isArray(responseData)) {
    return {
      data: responseData,
      current_page: params?.page || 1,
      limit: params?.limit || 10,
      total: responseData.length,
      last_page: 1,
      from: responseData.length > 0 ? 1 : null,
      to: responseData.length > 0 ? responseData.length : null,
    } as PaginatedResponse<T>;
  }

  // Normal paginated response from backend
  return responseData as PaginatedResponse<T>;
};

/**
 * Extracts pagination parameters from query object
 */
export const extractPaginationParams = (queries: { [key: string]: string | number }) => {
  const page = +(queries.page || 1);
  const limit = +(queries.limit || 10);

  // Extract filter parameters (exclude page and limit)
  const { page: _, limit: __, ...filterParams } = queries;

  return {
    page,
    limit,
    filterParams,
  };
};

