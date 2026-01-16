import GenericFormPage from "../components/pages/GenericFormPage";

const AddComplaint = () => {
  return (
    <GenericFormPage
      formType="addComplaint"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/add_complaint"
      backRoute={`${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}`}
    />
  );
};

export default AddComplaint;

