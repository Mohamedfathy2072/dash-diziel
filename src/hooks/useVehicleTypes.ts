import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveVehicleTypes } from "../store/vehicleTypesSlice";
import type { RootState } from "../store/store";
import type { VehicleType } from "../types/domain";

/**
 * Hook to fetch and access vehicle types
 * Automatically fetches active vehicle types on first use
 */
const useVehicleTypes = () => {
  const dispatch = useDispatch();
  const { activeVehicleTypes, vehicleTypes, loading, loadingActive, error } = useSelector(
    (state: RootState) => state.vehicleTypes || { 
      activeVehicleTypes: [], 
      vehicleTypes: [], 
      loading: false, 
      loadingActive: false,
      error: null 
    }
  );
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Fetch active vehicle types only once if not already loaded and not currently loading
    if (activeVehicleTypes.length === 0 && !loadingActive && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      dispatch(fetchActiveVehicleTypes() as any);
    }
  }, [dispatch, activeVehicleTypes.length, loadingActive]);

  return {
    activeVehicleTypes: activeVehicleTypes as VehicleType[],
    vehicleTypes: vehicleTypes as VehicleType[],
    loading,
    loadingActive,
    error,
    refetch: () => {
      hasFetchedRef.current = false;
      dispatch(fetchActiveVehicleTypes() as any);
    },
  };
};

export default useVehicleTypes;
