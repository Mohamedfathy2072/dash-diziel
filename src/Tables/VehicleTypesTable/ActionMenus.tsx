import EntityActionMenu from "../../components/tables/EntityActionMenu";
import type { VehicleType } from "../../types/domain";

const ActionMenus = ({ vehicleType }: { vehicleType: VehicleType }) => {
  return (
    <EntityActionMenu
      entity={vehicleType}
      editRoute={(id) => `${import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types"}/edit/${id}`}
      deleteType="deleteVehicleType"
      deleteIdKey="vehicleTypeId"
    />
  );
};

export default ActionMenus;

