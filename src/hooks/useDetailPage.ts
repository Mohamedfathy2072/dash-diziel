import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";

interface UseDetailPageOptions<T> {
  selector: (state: RootState) => {
    selectedItem: T | null;
    loading: boolean;
    error: string | null;
  };
  fetchAction: (id: number) => any;
  clearAction: () => any;
  backRoute: string;
  idParamName?: string;
}

const useDetailPage = <T,>({
  selector,
  fetchAction,
  clearAction,
  backRoute,
  idParamName = "id",
}: UseDetailPageOptions<T>) => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const previousIdRef = useRef<string | undefined>(undefined);
  
  // Memoize the selector result to prevent unnecessary re-renders
  const selectorResult = useSelector(selector, shallowEqual);
  const { selectedItem, loading, error } = selectorResult;

  const id = params[idParamName];

  useEffect(() => {
    console.log('🔍 useDetailPage useEffect:', {
      id,
      previousId: previousIdRef.current,
      currentState: {
        selectedItem: selectedItem ? `exists (id: ${(selectedItem as any)?.id})` : 'null',
        loading,
        error
      },
      willClear: id !== previousIdRef.current && previousIdRef.current !== undefined,
      willFetch: id !== previousIdRef.current && id
    });
    
    // Only clear and fetch if the ID actually changed
    // This prevents clearing data when component re-renders for other reasons
    if (id !== previousIdRef.current) {
      // Clear previous item only if ID changed
      if (previousIdRef.current !== undefined) {
        console.log('🧹 Clearing previous item for ID:', previousIdRef.current);
        dispatch(clearAction());
      }
      previousIdRef.current = id;
      
      // Fetch new data
      if (id) {
        const numericId = +id;
        if (isNaN(numericId)) {
          console.error('❌ Invalid ID (not a number):', id);
        } else {
          console.log('📥 Dispatching fetchAction for ID:', numericId);
          const actionResult = dispatch(fetchAction(numericId));
          console.log('📦 fetchAction dispatched, result:', actionResult);
        }
      } else {
        console.warn('⚠️ No ID provided, cannot fetch');
      }
    } else {
      console.log('✅ ID unchanged, skipping fetch');
      // If ID is the same but we don't have data, something went wrong
      if (id && !selectedItem && !loading && !error) {
        console.warn('⚠️ ID is same but no data, loading, or error - might need to refetch');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Only depend on id, not on dispatch/actions (they're stable)

  const handleBack = () => {
    navigate(backRoute);
  };

  return {
    id,
    selectedItem,
    loading,
    error,
    handleBack,
  };
};

export default useDetailPage;

