import GenericFormPage from "../components/pages/GenericFormPage";

const EditTrip = () => {
  return (
    <GenericFormPage
      formType="editTrip"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/edit_trip"
      backRoute={`${import.meta.env.VITE_TRIPS_ROUTE}`}
    />
  );
};

export default EditTrip;
