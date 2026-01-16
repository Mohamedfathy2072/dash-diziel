import { useCallback } from "react";
import { useSelector } from "react-redux";
import GenericListSection from "../../components/sections/GenericListSection";
import { getUsers } from "../../store/usersSlice";
import type { RootState } from "../../store/store";
import UsersTable from "../../Tables/UsersTable/UsersTable";

const UsersSection = () => {
  const { users, totalCount, loading } = useSelector(
    (state: RootState) => state.users
  );

  const fetchAction = useCallback((queries: { [key: string]: string | number }) => {
    return getUsers(queries);
  }, []);

  return (
    <GenericListSection
      title=""
      titleKey="labels.users"
      translationNamespace="sections/users_section"
      addUrl={`${import.meta.env.VITE_USERS_ROUTE}/add`}
      addLabel=""
      addLabelKey="buttons.addNewUser"
      filterFormType="filterUsers"
      tableComponent={
        <UsersTable
          data={users}
          loading={loading}
          count={totalCount}
        />
      }
      fetchAction={fetchAction}
      defaultLimit="10"
    />
  );
};

export default UsersSection;
