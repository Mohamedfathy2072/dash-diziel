import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { notificationService } from "../../services/api";
import { useFormsStore } from "../../globals/formsStore";
import { handleToaster } from "../../functions/handleToaster";
import type { NotificationFormTypes } from "../../types/forms";

const useNotificationSubmit = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("forms/notification_form");
  const setLoading = useFormsStore((state) => state.setLoading);
  const isLoading = useFormsStore((state) => state.isLoading);

  const sendNotification = async (values: NotificationFormTypes) => {
    if (isLoading) {
      return;
    }
    
    setLoading(true);
    try {
      // Prepare data for API
      const data: any = {
        title: values.title,
        body: values.body,
        target_type: values.target_type,
      };

      // Add user_id or driver_id based on target_type
      if (values.target_type === "user" && values.user_id) {
        data.user_id = values.user_id;
      } else if (values.target_type === "driver" && values.driver_id) {
        data.driver_id = values.driver_id;
      }
      
      // Call the API
      const response = await notificationService.send(data);
      
      // Check if response is successful
      if (!response || !response.data) {
        throw new Error("Invalid response from server");
      }
      
      const sentCount = response.data.data?.sent_count || 0;
      handleToaster({
        msg: t("notification_sent_successfully", { 
          count: sentCount,
          defaultValue: `Notification sent successfully to ${sentCount} recipient(s)` 
        }),
        status: "success",
      });
      
      // Navigate back to notifications page or dashboard
      navigate(-1);
    } catch (error: any) {
      console.error("Error sending notification:", error);
      handleToaster({
        msg: error?.response?.data?.message || error?.message || t("failed_to_send_notification", { defaultValue: "Failed to send notification" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { sendNotification };
};

export default useNotificationSubmit;

