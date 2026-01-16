import GenericFormPage from "../components/pages/GenericFormPage";

const AddUser = () => {
  return (
    <GenericFormPage
      formType="addUser"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/add_user"
      backRoute={`${import.meta.env.VITE_USERS_ROUTE}`}
      />
  );
};

export default AddUser;
