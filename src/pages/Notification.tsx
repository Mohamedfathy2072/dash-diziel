import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/common/PageHeader/PageHeader";
import SectionHeader from "../components/common/SectionHeader/SectionHeader";
import InfoField from "../components/common/InfoField/InfoField";
import DetailPageWrapper from "../components/pages/DetailPageWrapper";
import useAuth from "../hooks/useAuth";
import useDetailPage from "../hooks/useDetailPage";
import { fetchNotificationById, clearSelectedNotification } from "../store/notificationsSlice";
import type { RootState } from "../store/store";
import { handleGetCreationTime } from "../functions/handleGetCreationTime";

const Notification = () => {
  const { t } = useTranslation("pages/notification");
  const { isSuperAdmin } = useAuth();

  const { selectedItem: selectedNotification, loading, error, handleBack } = useDetailPage({
    selector: (state: RootState) => ({
      selectedItem: state.notifications.selectedNotification,
      loading: state.notifications.loading,
      error: state.notifications.error,
    }),
    fetchAction: fetchNotificationById,
    clearAction: clearSelectedNotification,
    backRoute: `${import.meta.env.VITE_NOTIFICATIONS_ROUTE || "/notifications"}`,
  });

  if (!isSuperAdmin()) {
    return null;
  }

  if (!selectedNotification && !loading) {
    return null;
  }

  const getTargetTypeColor = (targetType: string) => {
    switch (targetType) {
      case "all_users":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "all_drivers":
        return "bg-green-100 text-green-700 border-green-200";
      case "user":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "driver":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case "all_users":
        return t("allUsers", { defaultValue: "All Users" });
      case "all_drivers":
        return t("allDrivers", { defaultValue: "All Drivers" });
      case "user":
        return t("specificUser", { defaultValue: "Specific User" });
      case "driver":
        return t("specificDriver", { defaultValue: "Specific Driver" });
      default:
        return targetType;
    }
  };

  return (
    <Box className="grid justify-stretch items-start gap-6">
      <PageHeader
        title={selectedNotification?.title || ""}
        subtitle={t("subtitle", { defaultValue: "Notification Details" })}
        backUrl={`${import.meta.env.VITE_NOTIFICATIONS_ROUTE || "/notifications"}`}
      />
      <DetailPageWrapper
        loading={loading}
        error={error}
        data={selectedNotification}
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
                label={t("title", { defaultValue: "Title" })}
                value={selectedNotification?.title || "-"}
              />
              <InfoField
                label={t("body", { defaultValue: "Body" })}
                value={
                  selectedNotification?.body ? (
                    <Typography variant="body2" className="whitespace-pre-wrap">
                      {selectedNotification.body}
                    </Typography>
                  ) : "-"
                }
              />
              <InfoField
                label={t("targetType", { defaultValue: "Target Type" })}
                value={
                  selectedNotification?.target_type ? (
                    <Chip
                      label={getTargetTypeLabel(selectedNotification.target_type)}
                      className={getTargetTypeColor(selectedNotification.target_type)}
                      size="small"
                    />
                  ) : "-"
                }
              />
              {selectedNotification?.user && (
                <InfoField
                  label={t("user", { defaultValue: "User" })}
                  value={selectedNotification.user.name || "-"}
                />
              )}
              {selectedNotification?.driver && (
                <InfoField
                  label={t("driver", { defaultValue: "Driver" })}
                  value={selectedNotification.driver.name || "-"}
                />
              )}
            </Box>
          </Box>
        </Paper>

        <Paper className="paper shadow-lg">
          <Box className="p-6">
            <SectionHeader
              title={t("statistics", { defaultValue: "Statistics" })}
              className="mb-4"
            />
            <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <InfoField
                label={t("sentCount", { defaultValue: "Sent Count" })}
                value={selectedNotification?.sent_count || 0}
              />
              <InfoField
                label={t("totalCount", { defaultValue: "Total Count" })}
                value={selectedNotification?.total_count || 0}
              />
            </Box>
          </Box>
        </Paper>

        <Paper className="paper shadow-lg">
          <Box className="p-6">
            <SectionHeader
              title={t("timestamps", { defaultValue: "Timestamps" })}
              className="mb-4"
            />
            <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <InfoField
                label={t("createdAt", { defaultValue: "Created At" })}
                value={selectedNotification?.created_at ? handleGetCreationTime(selectedNotification.created_at) : "-"}
              />
              <InfoField
                label={t("updatedAt", { defaultValue: "Updated At" })}
                value={selectedNotification?.updated_at ? handleGetCreationTime(selectedNotification.updated_at) : "-"}
              />
            </Box>
          </Box>
        </Paper>
      </DetailPageWrapper>
    </Box>
  );
};

export default Notification;

