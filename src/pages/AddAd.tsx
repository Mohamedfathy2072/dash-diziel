import GenericFormPage from "../components/pages/GenericFormPage";

const AddAd = () => {
  return (
    <GenericFormPage
      formType="addAd"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/add_ad"
      backRoute={`${import.meta.env.VITE_ADS_ROUTE || "/ads"}`}
    />
  );
};

export default AddAd;

