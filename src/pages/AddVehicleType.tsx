import GenericFormPage from "../components/pages/GenericFormPage";

const AddVehicleType = () => {
  return (
    <GenericFormPage
      formType="addVehicleType"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/add_vehicle_type"
      backRoute={`${import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types"}`}
    />
  );
};

export default AddVehicleType;

