import Box from "@mui/material/Box";
import { type ReactNode, useEffect } from "react";
import LoadingState from "../common/LoadingState/LoadingState";

interface DetailPageWrapperProps<T> {
  loading: boolean;
  error: string | null;
  data: T | null;
  notFoundMessage?: string;
  onBack: () => void;
  backLabel?: string;
  children: ReactNode;
}

const DetailPageWrapper = <T,>({
  loading,
  error,
  data,
  notFoundMessage: _notFoundMessage = "Item not found",
  onBack: _onBack,
  backLabel: _backLabel,
  children,
}: DetailPageWrapperProps<T>) => {
  useEffect(() => {
    // Log to console with force (in case console is filtered)
    if (window.console && window.console.log) {
      window.console.log('%cDetailPageWrapper useEffect:', 'color: blue; font-weight: bold;', {
        loading,
        hasData: !!data,
        dataType: data ? typeof data : 'null',
        dataId: (data as any)?.id,
        error
      });
    }
  }, [data, loading, error]);

  // If we have data, show it immediately (regardless of loading or error state)
  if (data) {
    console.log('✅ Rendering content with data:', {
      dataId: (data as any)?.id,
      dataType: typeof data,
      hasData: !!data
    });
    return <Box className="grid justify-stretch items-start gap-6">{children}</Box>;
  }

  // If no data, ALWAYS show loading state - NEVER show error page
  // This way the page will never show error, even if there's an error or data is delayed
  console.log('⏳ No data yet, showing loading (error page completely disabled)');
  return <LoadingState />;
};

export default DetailPageWrapper;

