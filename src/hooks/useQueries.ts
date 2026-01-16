import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

const useQueries = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Memoize handleGetQueries to prevent unnecessary re-renders
  const handleGetQueries = useCallback(() => {
    const allParams: { [key: string]: string } = {};
    for (const [key, value] of searchParams.entries()) {
      allParams[key] = value;
    }
    return allParams;
  }, [searchParams]);

  const handleSetQueries = (
    ...queries: { [key: string]: string | number }[]
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    queries.forEach((query) => {
      Object.entries(query).forEach(([key, value]) => {
        if (value) {
          params.set(key, `${value}`);
        } else {
          params.delete(key);
        }
      });
    });
    setSearchParams(params);
  };

  const handleGetQuery = (key: string): string | null => {
    return searchParams.get(key);
  };

  const handleRemoveQueries = (...keys: string[]): void => {
    const params = new URLSearchParams(searchParams.toString());
    keys.forEach((key) => {
      params.delete(key);
    });
    setSearchParams(params);
  };

  const handleResetQueries = (): void => {
    setSearchParams({});
  };

  return {
    handleGetQueries,
    handleSetQueries,
    handleGetQuery,
    handleRemoveQueries,
    handleResetQueries,
  };
};

export default useQueries;
