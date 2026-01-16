import GenericFormPage from "../components/pages/GenericFormPage";

const AddDriver = () => {
  return (
    <GenericFormPage
      formType="addDriver"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/add_driver"
      backRoute={`${import.meta.env.VITE_DRIVERS_ROUTE}`}
    />
  );
};

export default AddDriver;

