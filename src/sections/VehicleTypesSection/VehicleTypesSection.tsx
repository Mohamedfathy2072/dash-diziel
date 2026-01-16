import { useCallback } from "react";
import { useSelector } from "react-redux";
import GenericListSection from "../../components/sections/GenericListSection";
import useAuth from "../../hooks/useAuth";
import { fetchVehicleTypes } from "../../store/vehicleTypesSlice";
import type { RootState } from "../../store/store";
import VehicleTypesTable from "../../Tables/VehicleTypesTable/VehicleTypesTable";

const VehicleTypesSection = () => {
  const { isSuperAdmin } = useAuth();
  const { vehicleTypes, totalCount, loading } = useSelector(
    (state: RootState) => state.vehicleTypes
  );

  const fetchAction = useCallback((queries: { [key: string]: string | number }) => {
    const page = +(queries.page || 1);
    const limit = +(queries.limit || 10);
    const status = queries.status as 'active' | 'inactive' | undefined;
    return fetchVehicleTypes({ page, limit, status });
  }, []);

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <GenericListSection
      title=""
      titleKey="labels.vehicleTypes"
      translationNamespace="sections/vehicle_types_section"
      addUrl={`${import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types"}/add`}
      addLabel=""
      addLabelKey="buttons.addNewVehicleType"
      tableComponent={
        <VehicleTypesTable
          data={vehicleTypes}
          loading={loading}
          count={totalCount}
        />
      }
      fetchAction={fetchAction}
      defaultLimit="10"
    />
  );
};

export default VehicleTypesSection;

