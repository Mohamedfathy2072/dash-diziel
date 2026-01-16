import { useCallback } from "react";
import { useSelector } from "react-redux";
import GenericListSection from "../../components/sections/GenericListSection";
import { fetchVehicles } from "../../store/vehiclesSlice";
import type { RootState } from "../../store/store";
import VehiclesTable from "../../Tables/VehiclesTable/VehiclesTable";

const VehiclesSection = () => {
  const { vehicles, totalCount, loading } = useSelector(
    (state: RootState) => state.vehicles
  );

  const fetchAction = useCallback((queries: { [key: string]: string | number }) => {
    return fetchVehicles(queries);
  }, []);

  return (
    <GenericListSection
      title=""
      titleKey="labels.vehicles"
      translationNamespace="sections/vehicles_section"
      addUrl={`${import.meta.env.VITE_VEHICLES_ROUTE}/add`}
      addLabel=""
      addLabelKey="buttons.addNewVehicle"
      filterFormType="filterVehicles"
      tableComponent={
        <VehiclesTable
          data={vehicles}
          loading={loading}
          count={totalCount}
        />
      }
      fetchAction={fetchAction}
      defaultLimit="10"
    />
  );
};

export default VehiclesSection;
