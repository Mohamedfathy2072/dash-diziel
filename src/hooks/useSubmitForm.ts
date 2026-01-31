import { useFormik } from "formik";
import { useEffect, useMemo, useRef } from "react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useFilterUsersSchema from "../forms/FilterUsersForm/useFilterUsersSchema";
import useFilterDriversSchema from "../forms/FilterDriversForm/useFilterDriversSchema";
import useFilterVehiclesSchema from "../forms/FilterVehiclesForm/useFilterVehiclesSchema";
import useFilterTripsSchema from "../forms/FilterTripsForm/useFilterTripsSchema";
import useFilterComplaintsSchema from "../forms/FilterComplaintsForm/useFilterComplaintsSchema";
import useLoginSchema from "../forms/LoginForm/useLoginSchema";
import useUpdatePasswordSchema from "../forms/UpdatePasswordForm/useUpdatePasswordSchema";
import useUserSchema from "../forms/UserForm/useUserSchema";
import useDriverSchema from "../forms/DriverForm/useDriverSchema";
import useVehicleSchema from "../forms/VehicleForm/useVehicleSchema";
import useTripSchema from "../forms/TripForm/useTripSchema";
import useDocumentSchema from "../forms/DocumentForm/useDocumentSchema";
import useVehicleTypeSchema from "../forms/VehicleTypeForm/useVehicleTypeSchema";
import useCouponSchema from "../forms/CouponForm/useCouponSchema";
import useAdSchema from "../forms/AdForm/useAdSchema";
import useComplaintSchema from "../forms/ComplaintForm/useComplaintSchema";
import useNotificationSchema from "../forms/NotificationForm/useNotificationSchema";
import useRoleSchema from "../forms/RoleForm/useRoleSchema";
import usePermissionSchema from "../forms/PermissionForm/usePermissionSchema";
import useDepositSchema from "../forms/DepositForm/useDepositSchema";
import type { AppDispatch, RootState } from "../store/store";
import { fetchUserById } from "../store/usersSlice";
import { fetchDriverById } from "../store/driversSlice";
import { fetchVehicleById } from "../store/vehiclesSlice";
import { fetchTripById } from "../store/tripsSlice";
import { fetchVehicleTypeById } from "../store/vehicleTypesSlice";
import { fetchCouponById } from "../store/couponsSlice";
import { fetchAdById } from "../store/adsSlice";
import { fetchComplaintById } from "../store/complaintsSlice";
import { fetchRoleById } from "../store/rolesSlice";
import { fetchPermissionById } from "../store/permissionsSlice";
import type { FormikMap } from "../types/forms";
import useSubmitFunction from "./useSubmitFunction";
import { useAppStore } from "../globals/appStore";

const useSubmitForm = <T extends keyof FormikMap>(
  type: T
): { formik: FormikMap[T] } => {
  const { handleSubmit } = useSubmitFunction(type);
  const { i18n } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedUser } = useSelector((state: RootState) => state.users);
  const { selectedDriver } = useSelector((state: RootState) => state.drivers);
  const { selectedVehicle } = useSelector((state: RootState) => state.vehicles);
  const { selectedTrip } = useSelector((state: RootState) => state.trips);
  const { selectedVehicleType } = useSelector((state: RootState) => state.vehicleTypes);
  const { selectedCoupon, loading: couponsLoading } = useSelector((state: RootState) => state.coupons);
  const { selectedAd, loading: adsLoading } = useSelector((state: RootState) => state.ads);
  const { selectedComplaint, loading: complaintsLoading } = useSelector((state: RootState) => state.complaints);
  const { selectedRole } = useSelector((state: RootState) => state.roles);
  const { selectedPermission } = useSelector((state: RootState) => state.permissions);
  const updateDocumentData = useAppStore((state) => state.updateDocumentData);
  
  // Track if we've already initiated a fetch to prevent infinite loops
  const hasFetchedCouponRef = useRef<number | null>(null);
  const hasFetchedComplaintRef = useRef<number | null>(null);
  const hasFetchedRoleRef = useRef<number | null>(null);
  const hasFetchedPermissionRef = useRef<number | null>(null);

  const { LoginInitialValues, LoginSchema } = useLoginSchema();
  const { UpdatePasswordInitialValues, UpdatePasswordSchema } =
    useUpdatePasswordSchema();
  const { UserInitialValues, UserSchema } = useUserSchema(
    type === "editUser",
    type === "editUser" ? selectedUser : undefined
  );
  const { DriverInitialValues, DriverSchema } = useDriverSchema(
    type === "editDriver",
    type === "editDriver" ? selectedDriver : undefined
  );
  const { VehicleInitialValues, VehicleSchema } = useVehicleSchema(
    type === "editVehicle",
    selectedVehicle // Always pass selectedVehicle, let useVehicleSchema handle the logic
  );
  
  // Remove debug elements
  if (typeof window !== 'undefined') {
    ['submit-form-debug', 'formik-debug'].forEach(id => {
      const elem = document.getElementById(id);
      if (elem) elem.remove();
    });
  }
  const { TripInitialValues, TripSchema } = useTripSchema(
    type === "editTrip",
    type === "editTrip" ? selectedTrip : undefined
  );
  const { FilterUsersInitialValues, FilterUsersSchema } =
    useFilterUsersSchema();
  const { FilterDriversInitialValues, FilterDriversSchema } =
    useFilterDriversSchema();
  const { FilterVehiclesInitialValues, FilterVehiclesSchema } =
    useFilterVehiclesSchema();
  const { FilterTripsInitialValues, FilterTripsSchema } =
    useFilterTripsSchema();
  const { FilterComplaintsInitialValues, FilterComplaintsSchema } =
    useFilterComplaintsSchema();
  const { VehicleTypeInitialValues, VehicleTypeSchema } = useVehicleTypeSchema(
    type === "editVehicleType",
    type === "editVehicleType" ? selectedVehicleType : undefined
  );
  const { CouponInitialValues, CouponSchema } = useCouponSchema(
    type === "editCoupon",
    type === "editCoupon" ? selectedCoupon : undefined
  );
  const { AdInitialValues, AdSchema } = useAdSchema(
    type === "editAd",
    type === "editAd" ? selectedAd : undefined
  );
  const { ComplaintInitialValues, ComplaintSchema } = useComplaintSchema(
    type === "editComplaint",
    type === "editComplaint" ? selectedComplaint : undefined
  );
  const { NotificationInitialValues, NotificationSchema } = useNotificationSchema();
  const { RoleInitialValues, RoleSchema } = useRoleSchema(
    type === "editRole",
    type === "editRole" ? selectedRole : undefined
  );
  const { PermissionInitialValues, PermissionSchema } = usePermissionSchema(
    type === "editPermission",
    type === "editPermission" ? selectedPermission : undefined
  );
  const { DepositInitialValues, DepositSchema } = useDepositSchema();

  // Get current document for updateDocument type
  const currentDocument = useMemo(() => {
    if (
      type === "updateDocument" &&
      updateDocumentData &&
      selectedDriver?.documents
    ) {
      return selectedDriver.documents.find(
        (doc) => doc.id === updateDocumentData.documentId
      );
    }
    return undefined;
  }, [type, updateDocumentData, selectedDriver]);

  const { DocumentInitialValues, DocumentSchema } =
    useDocumentSchema(currentDocument);

  // Track if we've already initiated a fetch to prevent infinite loops
  const hasFetchedAdRef = useRef<number | null>(null);

  // Reset fetch ref when ID changes
  useEffect(() => {
    if (type === "editCoupon" && id) {
      const couponId = +id;
      if (hasFetchedCouponRef.current !== couponId) {
        hasFetchedCouponRef.current = null;
      }
    }
    if (type === "editAd" && id) {
      const adId = +id;
      if (hasFetchedAdRef.current !== adId) {
        hasFetchedAdRef.current = null;
      }
    }
    if (type === "editComplaint" && id) {
      const complaintId = +id;
      if (hasFetchedComplaintRef.current !== complaintId) {
        hasFetchedComplaintRef.current = null;
      }
    }
    if (type === "editRole" && id) {
      const roleId = +id;
      if (hasFetchedRoleRef.current !== roleId) {
        hasFetchedRoleRef.current = null;
      }
    }
    if (type === "editPermission" && id) {
      const permissionId = +id;
      if (hasFetchedPermissionRef.current !== permissionId) {
        hasFetchedPermissionRef.current = null;
      }
    }
  }, [type, id]);

  // Fetch user/driver/vehicle data for edit mode
  useEffect(() => {
    if (type === "editUser" && id) {
      // Only fetch if we don't have the user or if the ID doesn't match
      if (!selectedUser || selectedUser.id !== +id) {
        dispatch(fetchUserById(+id));
      }
    } else if (type === "editDriver" && id) {
      // Only fetch if we don't have the driver or if the ID doesn't match
      if (!selectedDriver || selectedDriver.id !== +id) {
        dispatch(fetchDriverById(+id));
      }
    } else if (type === "editVehicle" && id) {
      // Only fetch if we don't have the vehicle or if the ID doesn't match
      if (!selectedVehicle || selectedVehicle.id !== +id) {
        dispatch(fetchVehicleById(+id));
      }
    } else if (type === "editTrip" && id) {
      // Only fetch if we don't have the trip or if the ID doesn't match
      if (!selectedTrip || selectedTrip.id !== +id) {
        dispatch(fetchTripById(+id));
      }
    } else if (type === "editVehicleType" && id) {
      // Only fetch if we don't have the vehicle type or if the ID doesn't match
      if (!selectedVehicleType || selectedVehicleType.id !== +id) {
        dispatch(fetchVehicleTypeById(+id));
      }
    } else if (type === "editCoupon" && id) {
      // Only fetch if we don't have the coupon, if the ID doesn't match, or if we haven't fetched this ID yet
      const couponId = +id;
      if ((!selectedCoupon || selectedCoupon.id !== couponId) && hasFetchedCouponRef.current !== couponId && !couponsLoading) {
        hasFetchedCouponRef.current = couponId;
        dispatch(fetchCouponById(couponId));
      }
    } else if (type === "editAd" && id) {
      // Only fetch if we don't have the ad, if the ID doesn't match, or if we haven't fetched this ID yet
      const adId = +id;
      if ((!selectedAd || selectedAd.id !== adId) && hasFetchedAdRef.current !== adId && !adsLoading) {
        hasFetchedAdRef.current = adId;
        dispatch(fetchAdById(adId));
      }
    } else if (type === "editComplaint" && id) {
      // Only fetch if we don't have the complaint, if the ID doesn't match, or if we haven't fetched this ID yet
      const complaintId = +id;
      if ((!selectedComplaint || selectedComplaint.id !== complaintId) && hasFetchedComplaintRef.current !== complaintId && !complaintsLoading) {
        hasFetchedComplaintRef.current = complaintId;
        dispatch(fetchComplaintById(complaintId));
      }
    } else if (type === "editRole" && id) {
      const roleId = +id;
      if ((!selectedRole || selectedRole.id !== roleId) && hasFetchedRoleRef.current !== roleId) {
        hasFetchedRoleRef.current = roleId;
        dispatch(fetchRoleById(roleId));
      }
    } else if (type === "editPermission" && id) {
      const permissionId = +id;
      if ((!selectedPermission || selectedPermission.id !== permissionId) && hasFetchedPermissionRef.current !== permissionId) {
        hasFetchedPermissionRef.current = permissionId;
        dispatch(fetchPermissionById(permissionId));
      }
    } else if (type === "updateDocument" && updateDocumentData) {
      // Fetch driver if we don't have it or if the ID doesn't match
      if (
        !selectedDriver ||
        selectedDriver.id !== updateDocumentData.driverId
      ) {
        dispatch(fetchDriverById(updateDocumentData.driverId));
      }
    }
  }, [
    type,
    id,
    selectedUser,
    selectedDriver,
    selectedVehicle,
    selectedTrip,
    selectedVehicleType,
    selectedCoupon,
    couponsLoading,
    selectedComplaint,
    complaintsLoading,
    selectedRole,
    selectedPermission,
    updateDocumentData,
    dispatch,
  ]);

  const formikConfig = useMemo(() => {
    switch (type) {
      case "login":
        return {
          initialValues: LoginInitialValues,
          validationSchema: LoginSchema,
        };
      case "updatePassword":
        return {
          initialValues: UpdatePasswordInitialValues,
          validationSchema: UpdatePasswordSchema,
        };
      case "addUser":
        return {
          initialValues: UserInitialValues,
          validationSchema: UserSchema,
        };
      case "editUser":
        return {
          initialValues: UserInitialValues,
          validationSchema: UserSchema,
        };
      case "filterUsers":
        return {
          initialValues: FilterUsersInitialValues,
          validationSchema: FilterUsersSchema,
        };
      case "addDriver":
        return {
          initialValues: DriverInitialValues,
          validationSchema: DriverSchema,
        };
      case "editDriver":
        return {
          initialValues: DriverInitialValues,
          validationSchema: DriverSchema,
        };
      case "filterDrivers":
        return {
          initialValues: FilterDriversInitialValues,
          validationSchema: FilterDriversSchema,
        };
      case "updateDocument":
        return {
          initialValues: DocumentInitialValues,
          validationSchema: DocumentSchema,
        };
      case "addVehicle":
        return {
          initialValues: VehicleInitialValues,
          validationSchema: VehicleSchema,
        };
      case "editVehicle":
        return {
          initialValues: VehicleInitialValues,
          validationSchema: VehicleSchema,
        };
      case "filterVehicles":
        return {
          initialValues: FilterVehiclesInitialValues,
          validationSchema: FilterVehiclesSchema,
        };
      case "editTrip":
        return {
          initialValues: TripInitialValues,
          validationSchema: TripSchema,
        };
      case "filterTrips":
        return {
          initialValues: FilterTripsInitialValues,
          validationSchema: FilterTripsSchema,
        };
      case "filterComplaints":
        return {
          initialValues: FilterComplaintsInitialValues,
          validationSchema: FilterComplaintsSchema,
        };
      case "addVehicleType":
        return {
          initialValues: VehicleTypeInitialValues,
          validationSchema: VehicleTypeSchema,
        };
      case "editVehicleType":
        return {
          initialValues: VehicleTypeInitialValues,
          validationSchema: VehicleTypeSchema,
        };
      case "addCoupon":
        return {
          initialValues: CouponInitialValues,
          validationSchema: CouponSchema,
        };
      case "editCoupon":
        return {
          initialValues: CouponInitialValues,
          validationSchema: CouponSchema,
        };
      case "addAd":
        return {
          initialValues: AdInitialValues,
          validationSchema: AdSchema,
        };
      case "editAd":
        return {
          initialValues: AdInitialValues,
          validationSchema: AdSchema,
        };
      case "addComplaint":
        return {
          initialValues: ComplaintInitialValues,
          validationSchema: ComplaintSchema,
        };
      case "editComplaint":
        return {
          initialValues: ComplaintInitialValues,
          validationSchema: ComplaintSchema,
        };
      case "sendNotification":
        return {
          initialValues: NotificationInitialValues,
          validationSchema: NotificationSchema,
        };
      case "addRole":
        return {
          initialValues: RoleInitialValues,
          validationSchema: RoleSchema,
        };
      case "editRole":
        return {
          initialValues: RoleInitialValues,
          validationSchema: RoleSchema,
        };
      case "addPermission":
        return {
          initialValues: PermissionInitialValues,
          validationSchema: PermissionSchema,
        };
      case "editPermission":
        return {
          initialValues: PermissionInitialValues,
          validationSchema: PermissionSchema,
        };
      case "addDeposit":
        return {
          initialValues: DepositInitialValues,
          validationSchema: DepositSchema,
        };
      case "deleteUser":
      case "deleteVehicle":
      case "deleteTrip":
      case "deleteVehicleType":
      case "deleteCoupon":
      case "deleteAd":
      case "deleteComplaint":
        return {
          initialValues: {},
          validationSchema: null,
        };
      default:
        throw new Error(`Unknown form type: ${type}`);
    }
  }, [
    type,
    i18n.language,
    UserInitialValues,
    UserSchema,
    DriverInitialValues,
    DriverSchema,
    VehicleInitialValues,
    VehicleSchema,
    TripInitialValues,
    TripSchema,
    LoginInitialValues,
    LoginSchema,
    UpdatePasswordInitialValues,
    UpdatePasswordSchema,
    FilterUsersInitialValues,
    FilterUsersSchema,
    FilterDriversInitialValues,
    FilterDriversSchema,
    FilterVehiclesInitialValues,
    FilterVehiclesSchema,
    FilterTripsInitialValues,
    FilterTripsSchema,
    FilterComplaintsInitialValues,
    FilterComplaintsSchema,
    DocumentInitialValues,
    DocumentSchema,
    VehicleTypeInitialValues,
    VehicleTypeSchema,
    CouponInitialValues,
    CouponSchema,
    AdInitialValues,
    AdSchema,
    ComplaintInitialValues,
    ComplaintSchema,
    NotificationInitialValues,
    NotificationSchema,
    RoleInitialValues,
    RoleSchema,
    PermissionInitialValues,
    PermissionSchema,
    DepositInitialValues,
    DepositSchema,
    // Add selectedVehicle to dependencies so initial values update when data arrives
    selectedVehicle?.id,
    selectedVehicle?.head?.license_plate,
    selectedVehicle?.trailer?.license_plate,
  ]);

  const formik = useFormik({
    ...formikConfig,
    validateOnChange: true,
    onSubmit: (values) => {
      handleSubmit(values);
    },
    enableReinitialize: true,
  });

  // Force reinitialize when vehicle data becomes available
  React.useEffect(() => {
    if (type === "editVehicle" && selectedVehicle && VehicleInitialValues && formik.resetForm) {
      // Use the fresh VehicleInitialValues that were just created
      // Check if values actually changed before resetting
      const currentHeadLicense = formik.values.head?.license_plate;
      const newHeadLicense = VehicleInitialValues.head?.license_plate;
      const currentTrailerLicense = formik.values.trailer?.license_plate;
      const newTrailerLicense = VehicleInitialValues.trailer?.license_plate;
      
      // Also check if head or trailer data exists
      const hasHeadData = selectedVehicle.head && (selectedVehicle.head.license_plate || selectedVehicle.head.model);
      const hasTrailerData = selectedVehicle.trailer && (selectedVehicle.trailer.license_plate || selectedVehicle.trailer.model);
      
      if ((hasHeadData || hasTrailerData) && (currentHeadLicense !== newHeadLicense || currentTrailerLicense !== newTrailerLicense || !currentHeadLicense || !currentTrailerLicense)) {
        formik.resetForm({ values: VehicleInitialValues });
      }
    }
  }, [type, selectedVehicle?.id, selectedVehicle?.head?.license_plate, selectedVehicle?.trailer?.license_plate, VehicleInitialValues, formik.resetForm, formik.values.head?.license_plate, formik.values.trailer?.license_plate]);
  
  // Log values for debugging (this will work)
  if (type === "editVehicle" && selectedVehicle) {
    try {
      window.vehicleDebugInfo = {
        selectedVehicle,
        initialValues: VehicleInitialValues,
        formikValues: formik.values
      };
    } catch (e) {}
  }

  return { formik } as { formik: FormikMap[T] };
};

export default useSubmitForm;
