import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { handleToaster } from "../../functions/handleToaster";
import { useFormsStore } from "../../globals/formsStore";
import type { AppDispatch } from "../../store/store";
import { updateTrip } from "../../store/tripsSlice";
import type { TripFormTypes } from "../../types/forms";

const useTripSubmit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { t } = useTranslation("forms/trip_form");
  const setLoading = useFormsStore((state) => state.setLoading);

  const editTrip = async (id: number, values: TripFormTypes) => {
    try {
      setLoading(true);

      // Convert datetime-local format to ISO string if needed
      const data: any = { ...values };

      // Convert datetime-local strings to ISO format if they exist
      if (data.pickup_date && !data.pickup_date.includes("T")) {
        data.pickup_date = new Date(data.pickup_date).toISOString();
      }
      if (data.destination_date && !data.destination_date.includes("T")) {
        data.destination_date = new Date(data.destination_date).toISOString();
      }
      if (data.scheduled_at && !data.scheduled_at.includes("T")) {
        data.scheduled_at = new Date(data.scheduled_at).toISOString();
      }

      await dispatch(updateTrip({ id, data })).unwrap();

      handleToaster({
        msg: t("trip_updated_successfully", {
          defaultValue: "Trip updated successfully",
        }),
        status: "success",
      });

      navigate(`${import.meta.env.VITE_TRIPS_ROUTE}/${id}`);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("trip_update_failed", { defaultValue: "Failed to update trip" }),
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    editTrip,
  };
};

export default useTripSubmit;
