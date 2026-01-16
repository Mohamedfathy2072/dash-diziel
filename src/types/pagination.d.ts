// Centralized pagination types for the application

/**
 * Pagination metadata matching Laravel's LengthAwarePaginator structure
 * This is the structure returned by Laravel Resource Collections
 */
export interface PaginationMeta {
  data: unknown[];
  current_page: number;
  limit: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

/**
 * Paginated response structure from backend API
 * Matches the structure returned by UserCollection and similar resource collections
 */
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  limit: number;
  total: number;
  last_page: number;
  from: number | null;
  to: number | null;
}

/**
 * Full Laravel pagination response with all metadata
 * Includes links, URLs, and path information
 */
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface FullPaginatedResponse<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  limit: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

/**
 * API response wrapper for paginated data
 * The backend wraps paginated responses in { success, message, data: PaginatedResponse<T> }
 */
export interface PaginatedApiResponse<T> {
  success: boolean;
  message: string;
  data: PaginatedResponse<T>;
}

/**
 * Pagination state for Redux store
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
}

