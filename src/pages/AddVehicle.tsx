import GenericFormPage from "../components/pages/GenericFormPage";

const AddVehicle = () => {
  return (
    <GenericFormPage
      formType="addVehicle"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/add_vehicle"
      backRoute={`${import.meta.env.VITE_VEHICLES_ROUTE}`}
    />
  );
};

export default AddVehicle;
