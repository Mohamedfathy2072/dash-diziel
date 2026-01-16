import GenericFormPage from "../components/pages/GenericFormPage";

const EditComplaint = () => {
  return (
    <GenericFormPage
      formType="editComplaint"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/edit_complaint"
      backRoute={import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}
    />
  );
};

export default EditComplaint;

