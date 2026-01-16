import EntityActionMenu from "../../components/tables/EntityActionMenu";
import type { Driver } from "../../types/domain";

const ActionMenus = ({ driver }: { driver: Driver }) => {
  return (
    <EntityActionMenu
      entity={driver}
      editRoute={(id) => `${import.meta.env.VITE_DRIVERS_ROUTE}/edit/${id}`}
      deleteType="deleteDriver"
      deleteIdKey="driverId"
      viewRoute={(id) => `${import.meta.env.VITE_DRIVERS_ROUTE}/${id}`}
      showView={true}
    />
  );
};

export default ActionMenus;

