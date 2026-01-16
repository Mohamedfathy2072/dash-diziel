import GenericFormPage from "../components/pages/GenericFormPage";

const EditDriver = () => {
  return (
    <GenericFormPage
      formType="editDriver"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/edit_driver"
      backRoute={`${import.meta.env.VITE_DRIVERS_ROUTE}`}
    />
  );
};

export default EditDriver;

