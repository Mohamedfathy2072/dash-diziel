import GenericFormPage from "../components/pages/GenericFormPage";

const EditVehicle = () => {
  return (
    <GenericFormPage
      formType="editVehicle"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/edit_vehicle"
      backRoute={`${import.meta.env.VITE_VEHICLES_ROUTE}`}
    />
  );
};

export default EditVehicle;
