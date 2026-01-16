import type { Notification } from "../../types/domain";
import EntityActionMenu from "../../components/tables/EntityActionMenu";

const ActionMenus = ({ notification }: { notification: Notification }) => {
  return (
    <EntityActionMenu
      entity={notification}
      editRoute={() => ""} // Not used since showEdit is false
      deleteType="deleteUser" // Not used since showDelete is false
      deleteIdKey="userId" // Not used since showDelete is false
      viewRoute={(id) => `${import.meta.env.VITE_NOTIFICATIONS_ROUTE || "/notifications"}/${id}`}
      showView={true}
      showEdit={false}
      showDelete={false}
    />
  );
};

export default ActionMenus;

