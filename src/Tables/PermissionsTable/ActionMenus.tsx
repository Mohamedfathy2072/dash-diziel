import EntityActionMenu from "../../components/tables/EntityActionMenu";
import type { Permission } from "../../types/domain";

const ActionMenus = ({ permission }: { permission: Permission }) => {
  return (
    <EntityActionMenu
      entity={permission}
      editRoute={(id) => `${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}/edit/${id}`}
      deleteType="deletePermission"
      deleteIdKey="permissionId"
    />
  );
};

export default ActionMenus;

