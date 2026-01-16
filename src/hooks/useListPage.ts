import { useEffect, useRef, useMemo, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import useQueries from "./useQueries";
import type { AppDispatch } from "../store/store";

interface UseListPageOptions {
  fetchAction: (queries: { [key: string]: string | number }) => any;
  defaultLimit?: string;
}

/**
 * Optimized hook for list pages with pagination and filtering
 * Prevents duplicate fetches and memoizes queries
 */
const useListPage = ({ fetchAction, defaultLimit = "10" }: UseListPageOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { handleGetQueries } = useQueries();
  
  // Track last query string to prevent duplicate calls
  const lastQueryStringRef = useRef<string>("");
  const isInitialMountRef = useRef(true);
  const queryString = searchParams.toString();

  // Memoize queries to prevent unnecessary recalculations
  const queries = useMemo(() => handleGetQueries(), [handleGetQueries, queryString]);

  // Memoize fetch action to prevent unnecessary dispatches
  const memoizedFetchAction = useCallback(
    (finalQueries: { [key: string]: string | number }) => {
      dispatch(fetchAction(finalQueries));
    },
    [dispatch, fetchAction]
  );

  // Set default query parameters if they don't exist
  useEffect(() => {
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    const hasDefaults = page && limit;

    if (!hasDefaults) {
      const params = new URLSearchParams(searchParams.toString());
      if (!page) {
        params.set("page", "1");
      }
      if (!limit) {
        params.set("limit", defaultLimit);
      }
      setSearchParams(params, { replace: true });
      return; // Exit early, let the next effect handle the fetch
    }
  }, [searchParams, setSearchParams, defaultLimit]);

  useEffect(() => {
    const page = searchParams.get("page");
    const limit = searchParams.get("limit");
    
    // Skip if we don't have page and limit yet (wait for first effect to set them)
    if (!page || !limit) {
      return;
    }

    // Skip on initial mount if we just set defaults (to avoid double fetch)
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      // Always fetch on initial mount if we have valid params
      const finalQueries = {
        page: queries.page || "1",
        limit: queries.limit || defaultLimit,
        ...queries,
      };
      lastQueryStringRef.current = queryString;
      memoizedFetchAction(finalQueries);
      return;
    }

    // Only fetch if query string actually changed
    if (queryString !== lastQueryStringRef.current) {
      lastQueryStringRef.current = queryString;
      
      // Ensure page and limit are set with defaults
      const finalQueries = {
        page: queries.page || "1",
        limit: queries.limit || defaultLimit,
        ...queries,
      };
      
      memoizedFetchAction(finalQueries);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString, memoizedFetchAction, defaultLimit, searchParams]);
};

export default useListPage;

