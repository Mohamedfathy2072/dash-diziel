import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleToaster } from "../../functions/handleToaster";
import { useAppStore } from "../../globals/appStore";
import { useModalsStore } from "../../globals/modalsStore";
import type { AppDispatch } from "../../store/store";
import { deleteUser as deleteUserAction, getUsers } from "../../store/usersSlice";
import { deleteVehicle, fetchVehicles } from "../../store/vehiclesSlice";
import { deleteTrip, fetchTrips } from "../../store/tripsSlice";
import { deleteVehicleType, fetchVehicleTypes } from "../../store/vehicleTypesSlice";
import { deleteCoupon, fetchCoupons } from "../../store/couponsSlice";
import { deleteComplaint, fetchComplaints } from "../../store/complaintsSlice";

const useDeleteSubmit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const deleted = useAppStore((state) => state.delete);
  const setDeleteModal = useModalsStore((state) => state.setDeleteModal);
  const { t } = useTranslation("forms/delete_form");
  const navigate = useNavigate();

  const deleteUser = async () => {
    const deleteType = useAppStore.getState().deleteType;
    
    if (deleteType === "deleteTrip") {
      if (!deleted?.tripId) {
        handleToaster({
          msg: t("trip_delete_error", { defaultValue: "Trip ID is required" }),
          status: "error"
        });
        return;
      }

      try {
        const tripId = typeof deleted.tripId === 'number' ? deleted.tripId : parseInt(deleted.tripId as string);
        if (isNaN(tripId)) {
          handleToaster({
            msg: t("trip_delete_error", { defaultValue: "Invalid trip ID" }),
            status: "error"
          });
          return;
        }

        await dispatch(deleteTrip(tripId)).unwrap();
        handleToaster({
          msg: t("trip_deleted", { defaultValue: "Trip deleted successfully" }),
          status: "success"
        });
        // Refresh trips list
        dispatch(fetchTrips({ page: 1, limit: 10 }));
        navigate(`${import.meta.env.VITE_TRIPS_ROUTE}`);
        setDeleteModal(false);
      } catch (error: any) {
        handleToaster({
          msg: error?.message || t("trip_delete_error", { defaultValue: "Failed to delete trip" }),
          status: "error"
        });
      }
      return;
    }
    
    if (deleteType === "deleteVehicleType") {
      if (!deleted?.vehicleTypeId) {
        handleToaster({
          msg: t("vehicle_type_delete_error", { defaultValue: "Vehicle type ID is required" }),
          status: "error"
        });
        return;
      }

      try {
        const vehicleTypeId = typeof deleted.vehicleTypeId === 'number' ? deleted.vehicleTypeId : parseInt(deleted.vehicleTypeId as string);
        if (isNaN(vehicleTypeId)) {
          handleToaster({
            msg: t("vehicle_type_delete_error", { defaultValue: "Invalid vehicle type ID" }),
            status: "error"
          });
          return;
        }

        await dispatch(deleteVehicleType(vehicleTypeId)).unwrap();
        handleToaster({
          msg: t("vehicle_type_deleted", { defaultValue: "Vehicle type deleted successfully" }),
          status: "success"
        });
        // Refresh vehicle types list
        dispatch(fetchVehicleTypes({ page: 1, limit: 10 }));
        navigate(`${import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types"}`);
        setDeleteModal(false);
      } catch (error: any) {
        handleToaster({
          msg: error?.message || t("vehicle_type_delete_error", { defaultValue: "Failed to delete vehicle type" }),
          status: "error"
        });
      }
      return;
    }
    
    if (deleteType === "deleteCoupon") {
      if (!deleted?.couponId) {
        handleToaster({
          msg: t("coupon_delete_error", { defaultValue: "Coupon ID is required" }),
          status: "error"
        });
        return;
      }

      try {
        const couponId = typeof deleted.couponId === 'number' ? deleted.couponId : parseInt(deleted.couponId as string);
        if (isNaN(couponId)) {
          handleToaster({
            msg: t("coupon_delete_error", { defaultValue: "Invalid coupon ID" }),
            status: "error"
          });
          return;
        }

        await dispatch(deleteCoupon(couponId)).unwrap();
        handleToaster({
          msg: t("coupon_deleted", { defaultValue: "Coupon deleted successfully" }),
          status: "success"
        });
        // Refresh coupons list
        dispatch(fetchCoupons({ page: 1, limit: 10 }));
        navigate(`${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}`);
        setDeleteModal(false);
      } catch (error: any) {
        handleToaster({
          msg: error?.message || t("coupon_delete_error", { defaultValue: "Failed to delete coupon" }),
          status: "error"
        });
      }
      return;
    }
    
    if (deleteType === "deleteComplaint") {
      if (!deleted?.complaintId) {
        handleToaster({
          msg: t("complaint_delete_error", { defaultValue: "Complaint ID is required" }),
          status: "error"
        });
        return;
      }

      try {
        const complaintId = typeof deleted.complaintId === 'number' ? deleted.complaintId : parseInt(deleted.complaintId as string);
        if (isNaN(complaintId)) {
          handleToaster({
            msg: t("complaint_delete_error", { defaultValue: "Invalid complaint ID" }),
            status: "error"
          });
          return;
        }

        await dispatch(deleteComplaint(complaintId)).unwrap();
        handleToaster({
          msg: t("complaint_deleted", { defaultValue: "Complaint deleted successfully" }),
          status: "success"
        });
        // Refresh complaints list
        dispatch(fetchComplaints({ page: 1, limit: 10 }));
        navigate(`${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}`);
        setDeleteModal(false);
      } catch (error: any) {
        handleToaster({
          msg: error?.message || t("complaint_delete_error", { defaultValue: "Failed to delete complaint" }),
          status: "error"
        });
      }
      return;
    }
    
    if (deleteType === "deleteVehicle") {
      if (!deleted?.vehicleId) {
        handleToaster({
          msg: t("vehicle_delete_error", { defaultValue: "Vehicle ID is required" }),
          status: "error"
        });
        return;
      }

      try {
        const vehicleId = typeof deleted.vehicleId === 'number' ? deleted.vehicleId : parseInt(deleted.vehicleId as string);
        if (isNaN(vehicleId)) {
          handleToaster({
            msg: t("vehicle_delete_error", { defaultValue: "Invalid vehicle ID" }),
            status: "error"
          });
          return;
        }

        await dispatch(deleteVehicle(vehicleId)).unwrap();
        handleToaster({
          msg: t("vehicle_deleted", { defaultValue: "Vehicle deleted successfully" }),
          status: "success"
        });
        // Refresh vehicles list
        dispatch(fetchVehicles({ page: 1, limit: 10 }));
        navigate(`${import.meta.env.VITE_VEHICLES_ROUTE}`);
        setDeleteModal(false);
      } catch (error: any) {
        handleToaster({
          msg: error?.message || t("vehicle_delete_error", { defaultValue: "Failed to delete vehicle" }),
          status: "error"
        });
      }
      return;
    }

    if (!deleted?.userId) {
      handleToaster({
        msg: t("user_delete_error", { defaultValue: "User ID is required" }),
        status: "error"
      });
      return;
    }

    try {
      const userId = typeof deleted.userId === 'number' ? deleted.userId : parseInt(deleted.userId as string);
      if (isNaN(userId)) {
        handleToaster({
          msg: t("user_delete_error", { defaultValue: "Invalid user ID" }),
          status: "error"
        });
        return;
      }

      await dispatch(deleteUserAction(userId)).unwrap();
      handleToaster({
        msg: t("user_deleted", { defaultValue: "User deleted successfully" }),
        status: "success"
      });
      // Refresh users list - use limit instead of per_page
      dispatch(getUsers({ page: 1, limit: 10 }));
      navigate(`${import.meta.env.VITE_USERS_ROUTE}`);
      setDeleteModal(false);
    } catch (error: any) {
      handleToaster({
        msg: error?.message || t("user_delete_error", { defaultValue: "Failed to delete user" }),
        status: "error"
      });
    }
  };

  return { deleteUser };
};

export default useDeleteSubmit;
