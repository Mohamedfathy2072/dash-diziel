import GenericFormPage from "../components/pages/GenericFormPage";

const SendNotification = () => {
  return (
    <GenericFormPage
      formType="sendNotification"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/send_notification"
      backRoute={`${import.meta.env.VITE_NOTIFICATIONS_ROUTE || "/notifications"}`}
    />
  );
};

export default SendNotification;

