import { useCallback } from "react";
import { useSelector } from "react-redux";
import GenericListSection from "../../components/sections/GenericListSection";
import { getDrivers } from "../../store/driversSlice";
import type { RootState } from "../../store/store";
import DriversTable from "../../Tables/DriversTable/DriversTable";

const DriversSection = () => {
  const { drivers, totalCount, loading } = useSelector(
    (state: RootState) => state.drivers
  );

  const fetchAction = useCallback((queries: { [key: string]: string | number }) => {
    return getDrivers(queries);
  }, []);

  return (
    <GenericListSection
      title=""
      titleKey="labels.drivers"
      translationNamespace="sections/drivers_section"
      addUrl={`${import.meta.env.VITE_DRIVERS_ROUTE}/add`}
      addLabel=""
      addLabelKey="buttons.addNewDriver"
      filterFormType="filterDrivers"
      tableComponent={
        <DriversTable
          data={drivers}
          loading={loading}
          count={totalCount}
        />
      }
      fetchAction={fetchAction}
      defaultLimit="10"
    />
  );
};

export default DriversSection;
