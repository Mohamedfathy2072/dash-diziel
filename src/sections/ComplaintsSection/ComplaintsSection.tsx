import { useCallback } from "react";
import { useSelector } from "react-redux";
import GenericListSection from "../../components/sections/GenericListSection";
import { fetchComplaints } from "../../store/complaintsSlice";
import type { RootState } from "../../store/store";
import ComplaintsTable from "../../Tables/ComplaintsTable/ComplaintsTable";
import useAuth from "../../hooks/useAuth";

const ComplaintsSection = () => {
  const { complaints, totalCount, loading } = useSelector(
    (state: RootState) => state.complaints
  );
  const { isSuperAdmin } = useAuth();

  const fetchAction = useCallback((queries: { [key: string]: string | number }) => {
    return fetchComplaints(queries);
  }, []);

  return (
    <GenericListSection
      title=""
      titleKey="labels.complaints"
      translationNamespace="sections/complaints_section"
      addUrl={import.meta.env.VITE_COMPLAINTS_ROUTE ? `${import.meta.env.VITE_COMPLAINTS_ROUTE}/add` : "/complaints/add"}
      addLabel=""
      addLabelKey="labels.addComplaint"
      filterFormType={isSuperAdmin() ? "filterComplaints" : undefined}
      tableComponent={
        <ComplaintsTable
          data={complaints}
          loading={loading}
          count={totalCount}
        />
      }
      fetchAction={fetchAction}
      defaultLimit="10"
    />
  );
};

export default ComplaintsSection;

