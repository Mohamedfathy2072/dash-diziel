import { useCallback } from "react";
import { useSelector } from "react-redux";
import GenericListSection from "../../components/sections/GenericListSection";
import useAuth from "../../hooks/useAuth";
import { getNotifications } from "../../store/notificationsSlice";
import type { RootState } from "../../store/store";
import NotificationsTable from "../../Tables/NotificationsTable/NotificationsTable";

const NotificationsSection = () => {
  const { isSuperAdmin } = useAuth();
  const { notifications, totalCount, loading } = useSelector(
    (state: RootState) => state.notifications
  );

  const fetchAction = useCallback((queries: { [key: string]: string | number }) => {
    return getNotifications(queries);
  }, []);

  if (!isSuperAdmin()) {
    return null;
  }

  return (
    <GenericListSection
      title=""
      titleKey="labels.notifications"
      translationNamespace="sections/notifications_section"
      addUrl={`${import.meta.env.VITE_NOTIFICATIONS_ROUTE || "/notifications"}/send`}
      addLabel=""
      addLabelKey="buttons.sendNotification"
      tableComponent={
        <NotificationsTable
          data={notifications}
          loading={loading}
          count={totalCount}
        />
      }
      fetchAction={fetchAction}
      defaultLimit="10"
    />
  );
};

export default NotificationsSection;

