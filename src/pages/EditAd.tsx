import GenericFormPage from "../components/pages/GenericFormPage";

const EditAd = () => {
  return (
    <GenericFormPage
      formType="editAd"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/edit_ad"
      backRoute={import.meta.env.VITE_ADS_ROUTE || "/ads"}
    />
  );
};

export default EditAd;

