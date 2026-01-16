import { useCallback } from "react";
import { useSelector } from "react-redux";
import GenericListSection from "../../components/sections/GenericListSection";
import { fetchTrips } from "../../store/tripsSlice";
import type { RootState } from "../../store/store";
import TripsTable from "../../Tables/TripsTable/TripsTable";

const TripsSection = () => {
  const { trips, totalCount, loading } = useSelector(
    (state: RootState) => state.trips
  );

  const fetchAction = useCallback((queries: { [key: string]: string | number }) => {
    return fetchTrips(queries);
  }, []);

  return (
    <GenericListSection
      title=""
      titleKey="labels.trips"
      translationNamespace="sections/trips_section"
      addUrl={undefined}
      addLabel=""
      addLabelKey=""
      filterFormType="filterTrips"
      tableComponent={
        <TripsTable
          data={trips}
          loading={loading}
          count={totalCount}
        />
      }
      fetchAction={fetchAction}
      defaultLimit="10"
    />
  );
};

export default TripsSection;
