import GenericFormPage from "../components/pages/GenericFormPage";

const AddRole = () => {
  return (
    <GenericFormPage
      formType="addRole"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/add_role"
      backRoute={`${import.meta.env.VITE_ROLES_ROUTE || "/roles"}`}
    />
  );
};

export default AddRole;

