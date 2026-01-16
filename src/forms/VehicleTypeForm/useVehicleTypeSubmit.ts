import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { createVehicleType, updateVehicleType } from "../../store/vehicleTypesSlice";
import { useFormsStore } from "../../globals/formsStore";
import { handleToaster } from "../../functions/handleToaster";
import type { VehicleTypeFormTypes } from "../../types/forms";
import type { AppDispatch } from "../../store/store";
import { useParams } from "react-router-dom";

const useVehicleTypeSubmit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("forms/vehicle_type_form");
  const { id } = useParams();
  const setLoading = useFormsStore((state) => state.setLoading);
  const isLoading = useFormsStore((state) => state.isLoading);

  const addVehicleType = async (values: VehicleTypeFormTypes) => {
    if (isLoading) return;
    
    setLoading(true);
    try {
      const data: any = { ...values };
      if (data.status === null) delete data.status;
      await dispatch(createVehicleType(data)).unwrap();
      handleToaster({
        msg: t("vehicle_type_created_successfully", { defaultValue: "Vehicle type created successfully" }),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types"}`);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("failed_to_create_vehicle_type", { defaultValue: "Failed to create vehicle type" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const editVehicleType = async (values: VehicleTypeFormTypes) => {
    if (isLoading || !id) return;
    
    setLoading(true);
    try {
      const data: any = { ...values };
      if (data.status === null) delete data.status;
      await dispatch(updateVehicleType({ id: +id, data })).unwrap();
      handleToaster({
        msg: t("vehicle_type_updated_successfully", { defaultValue: "Vehicle type updated successfully" }),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types"}/${id}`);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("failed_to_update_vehicle_type", { defaultValue: "Failed to update vehicle type" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return { addVehicleType, editVehicleType };
};

export default useVehicleTypeSubmit;

