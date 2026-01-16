import EntityActionMenu from "../../components/tables/EntityActionMenu";
import type { Trip } from "../../types/domain";
import useAuth from "../../hooks/useAuth";

const ActionMenus = ({ trip }: { trip: Trip }) => {
  const { isSuperAdmin } = useAuth();

  return (
    <EntityActionMenu
      entity={trip}
      editRoute={(id) => `${import.meta.env.VITE_TRIPS_ROUTE}/edit/${id}`}
      deleteType="deleteTrip"
      deleteIdKey="tripId"
      viewRoute={(id) => `${import.meta.env.VITE_TRIPS_ROUTE}/${id}`}
      showView={true}
      showEdit={isSuperAdmin()}
      showDelete={isSuperAdmin()}
    />
  );
};

export default ActionMenus;
