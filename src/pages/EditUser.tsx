import GenericFormPage from "../components/pages/GenericFormPage";

const EditUser = () => {
  return (
    <GenericFormPage
      formType="editUser"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/edit_user"
      backRoute={`${import.meta.env.VITE_USERS_ROUTE}`}
      />
  );
};

export default EditUser;
