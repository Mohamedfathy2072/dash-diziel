import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { handleToaster } from "../../functions/handleToaster";
import type { AppDispatch } from "../../store/store";
import { createVehicle, updateVehicle, fetchVehicles } from "../../store/vehiclesSlice";
import type { VehicleFormTypes } from "../../types/forms";


const useVehicleSubmit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation("forms/vehicle_form");
  
  const addVehicle = async (values: VehicleFormTypes) => {
    try {
      // Prepare data, removing null values
      const data: any = {};
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          data[key] = value;
        }
      });

      await dispatch(createVehicle(data)).unwrap();
      handleToaster({ msg: t("add_submit_success", { defaultValue: "Vehicle created successfully" }), status: "success" });
      // Refresh vehicles list
      dispatch(fetchVehicles({ page: 1, limit: 10 }));
      navigate(`${import.meta.env.VITE_VEHICLES_ROUTE}`);
    } catch (error: any) {
      handleToaster({ 
        msg: error?.message || t("add_submit_error", { defaultValue: "Failed to create vehicle" }), 
        status: "error" 
      });
    }
  };

  const editVehicle = async (values: VehicleFormTypes) => {
    if (!id) {
      handleToaster({ msg: t("edit_submit_error", { defaultValue: "Vehicle ID is required" }), status: "error" });
      return;
    }
    
    try {
      // Prepare data, removing null values
      const data: any = {};
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          data[key] = value;
        }
      });

      await dispatch(updateVehicle({ id: +id, data })).unwrap();
      handleToaster({ msg: t("edit_submit_success", { defaultValue: "Vehicle updated successfully" }), status: "success" });
      // Refresh vehicles list
      dispatch(fetchVehicles({ page: 1, limit: 10 }));
      navigate(`${import.meta.env.VITE_VEHICLES_ROUTE}`);
    } catch (error: any) {
      handleToaster({ 
        msg: error?.message || t("edit_submit_error", { defaultValue: "Failed to update vehicle" }), 
        status: "error" 
      });
    }
  };

  return { addVehicle, editVehicle };
};

export default useVehicleSubmit;
