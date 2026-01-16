import GenericFormPage from "../components/pages/GenericFormPage";

const EditPermission = () => {
  return (
    <GenericFormPage
      formType="editPermission"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/edit_permission"
      backRoute={`${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}`}
    />
  );
};

export default EditPermission;

