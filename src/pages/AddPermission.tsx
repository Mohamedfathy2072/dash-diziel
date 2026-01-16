import GenericFormPage from "../components/pages/GenericFormPage";

const AddPermission = () => {
  return (
    <GenericFormPage
      formType="addPermission"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/add_permission"
      backRoute={`${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}`}
    />
  );
};

export default AddPermission;

