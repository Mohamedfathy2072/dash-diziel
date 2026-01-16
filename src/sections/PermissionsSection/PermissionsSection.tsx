import { useCallback } from "react";
import { useSelector } from "react-redux";
import GenericListSection from "../../components/sections/GenericListSection";
import useAuth from "../../hooks/useAuth";
import { fetchPermissions } from "../../store/permissionsSlice";
import type { RootState } from "../../store/store";
import PermissionsTable from "../../Tables/PermissionsTable/PermissionsTable";

const PermissionsSection = () => {
  const { isSuperAdmin } = useAuth();
  const { permissions, totalCount, loading } = useSelector(
    (state: RootState) => state.permissions
  );

  const fetchAction = useCallback((queries: { [key: string]: string | number }) => {
    const page = +(queries.page || 1);
    const per_page = +(queries.limit || 15);
    const group = queries.group as string | undefined;
    const search = queries.search as string | undefined;
    const group_by = queries.group_by !== undefined ? (typeof queries.group_by === "number" ? String(queries.group_by) : queries.group_by) as string | boolean | undefined : undefined;
    return fetchPermissions({ page, per_page, group, search, group_by });
  }, []);

  if (!isSuperAdmin()) {
    return null;
  }

  return (
    <GenericListSection
      title=""
      titleKey="labels.permissions"
      translationNamespace="sections/permissions_section"
      addUrl={`${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}/add`}
      addLabel=""
      addLabelKey="buttons.addNewPermission"
      tableComponent={
        <PermissionsTable
          data={permissions}
          loading={loading}
          count={totalCount}
        />
      }
      fetchAction={fetchAction}
      defaultLimit="15"
    />
  );
};

export default PermissionsSection;

