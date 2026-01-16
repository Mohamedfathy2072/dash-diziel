import GenericFormPage from "../components/pages/GenericFormPage";

const EditVehicleType = () => {
  return (
    <GenericFormPage
      formType="editVehicleType"
      titleKey="title"
      subtitleKey="subtitle"
      translationNamespace="pages/edit_vehicle_type"
      backRoute={`${import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types"}`}
    />
  );
};

export default EditVehicleType;

