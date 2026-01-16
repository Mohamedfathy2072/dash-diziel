import { useCallback } from "react";
import { useSelector } from "react-redux";
import GenericListSection from "../../components/sections/GenericListSection";
import useAuth from "../../hooks/useAuth";
import { fetchRoles } from "../../store/rolesSlice";
import type { RootState } from "../../store/store";
import RolesTable from "../../Tables/RolesTable/RolesTable";

const RolesSection = () => {
  const { isSuperAdmin } = useAuth();
  const { roles, totalCount, loading } = useSelector(
    (state: RootState) => state.roles
  );

  const fetchAction = useCallback((queries: { [key: string]: string | number }) => {
    const page = +(queries.page || 1);
    const per_page = +(queries.limit || 15);
    const is_active = queries.is_active !== undefined ? (typeof queries.is_active === "number" ? String(queries.is_active) : queries.is_active) as string | boolean | undefined : undefined;
    const search = queries.search as string | undefined;
    return fetchRoles({ page, per_page, is_active, search });
  }, []);

  if (!isSuperAdmin()) {
    return null;
  }

  return (
    <GenericListSection
      title=""
      titleKey="labels.roles"
      translationNamespace="sections/roles_section"
      addUrl={`${import.meta.env.VITE_ROLES_ROUTE || "/roles"}/add`}
      addLabel=""
      addLabelKey="buttons.addNewRole"
      tableComponent={
        <RolesTable
          data={roles}
          loading={loading}
          count={totalCount}
        />
      }
      fetchAction={fetchAction}
      defaultLimit="15"
    />
  );
};

export default RolesSection;

