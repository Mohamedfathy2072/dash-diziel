import GenericFormPage from "../components/pages/GenericFormPage";

const EditRole = () => {
  return (
    <GenericFormPage
      formType="editRole"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/edit_role"
      backRoute={`${import.meta.env.VITE_ROLES_ROUTE || "/roles"}`}
    />
  );
};

export default EditRole;

