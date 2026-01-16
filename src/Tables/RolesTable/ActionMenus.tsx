import EntityActionMenu from "../../components/tables/EntityActionMenu";
import type { Role } from "../../types/domain";

const ActionMenus = ({ role }: { role: Role }) => {
  return (
    <EntityActionMenu
      entity={role}
      editRoute={(id) => `${import.meta.env.VITE_ROLES_ROUTE || "/roles"}/edit/${id}`}
      deleteType="deleteRole"
      deleteIdKey="roleId"
    />
  );
};

export default ActionMenus;

