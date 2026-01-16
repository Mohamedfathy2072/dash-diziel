import EntityActionMenu from "../../components/tables/EntityActionMenu";
import type { UserTypes } from "../../types/app";

const ActionMenus = ({ user }: { user: UserTypes }) => {
  return (
    <EntityActionMenu
      entity={user}
      editRoute={(id) => `${import.meta.env.VITE_USERS_ROUTE}/edit/${id}`}
      deleteType="deleteUser"
      deleteIdKey="userId"
    />
  );
};

export default ActionMenus;
