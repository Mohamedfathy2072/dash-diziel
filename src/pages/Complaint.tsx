import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader/PageHeader";
import SectionHeader from "../components/common/SectionHeader/SectionHeader";
import InfoField from "../components/common/InfoField/InfoField";
import DetailPageWrapper from "../components/pages/DetailPageWrapper";
import DetailPageActions from "../components/common/DetailPageActions/DetailPageActions";
import useAuth from "../hooks/useAuth";
import useDetailPage from "../hooks/useDetailPage";
import { fetchComplaintById, clearSelectedComplaint } from "../store/complaintsSlice";
import type { RootState } from "../store/store";
import { getComplaintStatusLabel, getComplaintStatusColor } from "../utils/enums";
import { useSelector } from "react-redux";
import { GradientButton } from "../mui/buttons/GradientButton";
import CheckCircleIcon from "../icons/CheckCircleIcon";
import { useModalsStore } from "../globals/modalsStore";
import { useAppStore } from "../globals/appStore";

const Complaint = () => {
  const { t } = useTranslation("pages/complaint");
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const setResolveModal = useModalsStore((state) => state.setResolveComplaintModal);
  const setResolveComplaintData = useAppStore((state) => state.setResolveComplaintData);

  const { id, selectedItem: selectedComplaint, loading, error, handleBack } = useDetailPage({
    selector: (state: RootState) => ({
      selectedItem: state.complaints.selectedComplaint,
      loading: state.complaints.loading,
      error: state.complaints.error,
    }),
    fetchAction: fetchComplaintById,
    clearAction: clearSelectedComplaint,
    backRoute: `${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}`,
  });

  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isOwner = currentUser?.id === selectedComplaint?.user_id;
  const isPending = selectedComplaint?.status === 'pending';
  const canEdit = isOwner && isPending;
  const canDelete = isOwner && isPending;
  const canResolve = isSuperAdmin() && isPending;

  const handleResolve = () => {
    if (!selectedComplaint) return;
    
    setResolveComplaintData({ complaintId: selectedComplaint.id });
    setResolveModal(true);
  };

  const getComplaintableInfo = () => {
    if (!selectedComplaint?.complaintable_type || !selectedComplaint?.complaintable) {
      return 'General Complaint';
    }

    const type = selectedComplaint.complaintable_type;
    const entity = selectedComplaint.complaintable;

    if (type === 'Trip' && 'trip_title' in entity) {
      return `Trip: ${entity.trip_title || `#${entity.id}`}`;
    } else if (type === 'Driver' && 'user' in entity) {
      return `Driver: ${entity.user?.name || `#${entity.id}`}`;
    } else if (type === 'User' && 'name' in entity) {
      return `User: ${entity.name}`;
    }

    return `${type} #${selectedComplaint.complaintable_id}`;
  };

  const actions = (
    <Box className="flex items-center gap-2">
      {canResolve && (
        <GradientButton
          onClick={handleResolve}
          className="!px-6 !py-2.5 hover:!shadow-lg transition-all !bg-green-600"
        >
          <CheckCircleIcon className="w-5 h-5 mr-2" />
          {t("resolve", { defaultValue: "Resolve" })}
        </GradientButton>
      )}
      <DetailPageActions
        entityId={id}
        editRoute={`${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}/edit/${id}`}
        deleteType="deleteComplaint"
        deleteIdKey="complaintId"
        editLabel={t("edit", { defaultValue: "Edit" })}
        deleteLabel={t("delete", { defaultValue: "Delete" })}
        showEdit={canEdit}
        showDelete={canDelete}
      />
    </Box>
  );

  return (
    <Box className="grid justify-stretch items-start gap-6">
      <PageHeader
        title={selectedComplaint?.subject || ""}
        subtitle={t("subtitle", { defaultValue: "Complaint Details" })}
        actions={actions}
        backUrl={`${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}`}
      />
      <DetailPageWrapper
        loading={loading}
        error={error}
        data={selectedComplaint}
        onBack={handleBack}
      >
        <Paper className="paper shadow-lg">
          <Box className="p-6">
            <SectionHeader
              title={t("basicInformation", { defaultValue: "Basic Information" })}
              className="mb-4"
            />
            <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <InfoField
                label={t("subject", { defaultValue: "Subject" })}
                value={selectedComplaint?.subject || "-"}
              />
              <InfoField
                label={t("description", { defaultValue: "Description" })}
                value={
                  <Typography variant="body2" className="whitespace-pre-wrap">
                    {selectedComplaint?.description || "-"}
                  </Typography>
                }
              />
              <InfoField
                label={t("status", { defaultValue: "Status" })}
                value={
                  selectedComplaint?.status ? (
                    <Chip
                      label={getComplaintStatusLabel(selectedComplaint.status)}
                      className={getComplaintStatusColor(selectedComplaint.status)}
                      size="small"
                    />
                  ) : "-"
                }
              />
              <InfoField
                label={t("user", { defaultValue: "User" })}
                value={
                  selectedComplaint?.user ? (
                    <span
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => navigate(`${import.meta.env.VITE_USERS_ROUTE || "/users"}/${selectedComplaint.user_id}`)}
                    >
                      {selectedComplaint.user.name}
                    </span>
                  ) : `User #${selectedComplaint?.user_id || "-"}`
                }
              />
              <InfoField
                label={t("complaintableType", { defaultValue: "Complaint About" })}
                value={getComplaintableInfo()}
              />
              <InfoField
                label={t("createdAt", { defaultValue: "Created At" })}
                value={selectedComplaint?.created_at ? new Date(selectedComplaint.created_at).toLocaleString() : "-"}
              />
            </Box>
          </Box>
        </Paper>

        {selectedComplaint?.status === 'resolved' && (
          <Paper className="paper shadow-lg mt-6">
            <Box className="p-6">
              <SectionHeader
                title={t("resolution", { defaultValue: "Resolution" })}
                className="mb-4"
              />
              <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <InfoField
                  label={t("resolvedAt", { defaultValue: "Resolved At" })}
                  value={selectedComplaint.resolved_at ? new Date(selectedComplaint.resolved_at).toLocaleString() : "-"}
                />
                <InfoField
                  label={t("resolvedBy", { defaultValue: "Resolved By" })}
                  value={
                    selectedComplaint.resolver ? (
                      <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => navigate(`${import.meta.env.VITE_USERS_ROUTE || "/users"}/${selectedComplaint.resolved_by}`)}
                      >
                        {selectedComplaint.resolver.name}
                      </span>
                    ) : `User #${selectedComplaint.resolved_by || "-"}`
                  }
                />
                <InfoField
                  label={t("resolutionNotes", { defaultValue: "Resolution Notes" })}
                  value={
                    <Typography variant="body2" className="whitespace-pre-wrap">
                      {selectedComplaint.resolution_notes || "-"}
                    </Typography>
                  }
                />
              </Box>
            </Box>
          </Paper>
        )}
      </DetailPageWrapper>
    </Box>
  );
};

export default Complaint;

