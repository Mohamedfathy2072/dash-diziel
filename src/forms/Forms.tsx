import Box from "@mui/material/Box";
import type { FormikProps } from "formik";
import { useRef } from "react";
import useSubmitForm from "../hooks/useSubmitForm";
import useSubmitFunction from "../hooks/useSubmitFunction";
import type {
  FilterUsersFormTypes,
  FilterDriversFormTypes,
  FilterVehiclesFormTypes,
  FilterTripsFormTypes,
  FilterComplaintsFormTypes,
  TripFormTypes,
  FormikMap,
  FormsTypes,
  LoginFormTypes,
  UpdatePasswordFormTypes,
  UserFormTypes,
  DriverFormTypes,
  VehicleFormTypes,
  DocumentFormTypes,
  VehicleTypeFormTypes,
  CouponFormTypes,
  AdFormTypes,
  ComplaintFormTypes,
  NotificationFormTypes,
  RoleFormTypes,
  PermissionFormTypes,
  DepositFormTypes,
} from "../types/forms";
import FilterUsersForm from "./FilterUsersForm/FilterUsersForm";
import FilterDriversForm from "./FilterDriversForm/FilterDriversForm";
import FilterVehiclesForm from "./FilterVehiclesForm/FilterVehiclesForm";
import FilterTripsForm from "./FilterTripsForm/FilterTripsForm";
import FilterComplaintsForm from "./FilterComplaintsForm/FilterComplaintsForm";
import LoginForm from "./LoginForm/LoginForm";
import UpdatePasswordForm from "./UpdatePasswordForm/UpdatePasswordForm";
import UserForm from "./UserForm/UserForm";
import DriverForm from "./DriverForm/DriverForm";
import VehicleForm from "./VehicleForm/VehicleForm";
import DocumentForm from "./DocumentForm/DocumentForm";
import TripForm from "./TripForm/TripForm";
import VehicleTypeForm from "./VehicleTypeForm/VehicleTypeForm";
import CouponForm from "./CouponForm/CouponForm";
import AdForm from "./AdForm/AdForm";
import ComplaintForm from "./ComplaintForm/ComplaintForm";
import NotificationForm from "./NotificationForm/NotificationForm";
import RoleForm from "./RoleForm/RoleForm";
import PermissionForm from "./PermissionForm/PermissionForm";
import DepositForm from "./DepositForm/DepositForm";

const Forms = ({ type }: FormsTypes) => {
  const { formik } = useSubmitForm(type as keyof FormikMap);
  const { handleSubmit } = useSubmitFunction(type);
  const photoFileRef = useRef<File | null>(null);
  const documentsRef = useRef<{ [key: string]: File | null }>({});
  const fileRef = useRef<File | null>(null);
  const imageFileRef = useRef<File | null>(null);

  // Handle form submission for user/driver/ad forms with photo, documents, and image
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate form first
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        // Ensure photoFile is properly set from ref
        const photoFile = photoFileRef.current;

        // Get documents from ref if it's a driver form
        let documents: { [key: string]: File | null } | undefined;
        if (type === "addDriver" || type === "editDriver") {
          documents = documentsRef.current;
        }

        // Get imageFile from ref if it's an ad form
        let imageFile: File | null | undefined;
        if (type === "addAd" || type === "editAd") {
          imageFile = imageFileRef.current;
        }

        // Create values object with photoFile, documents, and imageFile included
        const valuesWithFiles = {
          ...formik.values,
          photoFile: photoFile,
          ...(documents && { documents }),
          ...(imageFile !== undefined && { imageFile }),
        } as (UserFormTypes | DriverFormTypes | AdFormTypes) & {
          photoFile?: File | null;
          documents?: { [key: string]: File | null };
          imageFile?: File | null;
        };

        // Call submit handler directly with values including photoFile, documents, and imageFile
        handleSubmit(valuesWithFiles);
      } else {
        formik.setTouched(
          Object.keys(errors).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {} as Record<string, boolean>)
        );
      }
    });
  };

  // Handle form submission for updateDocument with file ref
  const handleDocumentFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Validate form first
    formik.validateForm().then((errors) => {
      if (Object.keys(errors).length === 0) {
        // Get file from ref
        const file = fileRef.current;

        // Create values object with file included
        const valuesWithFile = {
          ...formik.values,
          file: file,
        } as DocumentFormTypes & { file?: File | null };

        // Call submit handler directly with values including file
        handleSubmit(valuesWithFile);
      } else {
        formik.setTouched(
          Object.keys(errors).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {} as Record<string, boolean>)
        );
      }
    });
  };

  return (
    <Box
      component={"form"}
      onSubmit={
        type === "addUser" ||
        type === "editUser" ||
        type === "addDriver" ||
        type === "editDriver" ||
        type === "addVehicle" ||
        type === "editVehicle" ||
        type === "editTrip" ||
        type === "addVehicleType" ||
        type === "editVehicleType" ||
        type === "addCoupon" ||
        type === "editCoupon" ||
        type === "addAd" ||
        type === "editAd" ||
        type === "addComplaint" ||
        type === "editComplaint" ||
        type === "addRole" ||
        type === "editRole" ||
        type === "addPermission" ||
        type === "editPermission" ||
        type === "addDeposit"
          ? handleFormSubmit
          : type === "updateDocument"
          ? handleDocumentFormSubmit
          : formik.handleSubmit
      }
    >
      {/* Authentication */}
      {type === "login" && (
        <LoginForm formik={formik as FormikProps<LoginFormTypes>} type={type} />
      )}
      {type === "updatePassword" && (
        <UpdatePasswordForm
          formik={formik as FormikProps<UpdatePasswordFormTypes>}
          type={type}
        />
      )}
      {/* Authentication */}

      {/* Users */}
      {(type === "addUser" || type === "editUser") && (
        <UserForm
          formik={formik as FormikProps<UserFormTypes>}
          type={type as "addUser" | "editUser"}
          photoFileRef={photoFileRef}
        />
      )}
      {type === "filterUsers" && (
        <FilterUsersForm formik={formik as FormikProps<FilterUsersFormTypes>} />
      )}
      {/* Users */}

      {/* Drivers */}
      {(type === "addDriver" || type === "editDriver") && (
        <DriverForm
          formik={formik as FormikProps<DriverFormTypes>}
          type={type as "addDriver" | "editDriver"}
          photoFileRef={photoFileRef}
          documentsRef={documentsRef}
        />
      )}
      {type === "filterDrivers" && (
        <FilterDriversForm
          formik={formik as FormikProps<FilterDriversFormTypes>}
        />
      )}
      {type === "updateDocument" && (
        <DocumentForm
          formik={formik as FormikProps<DocumentFormTypes>}
          fileRef={fileRef}
        />
      )}
      {/* Drivers */}

      {/* Vehicles */}
      {(type === "addVehicle" || type === "editVehicle") && (
        <VehicleForm
          formik={formik as FormikProps<VehicleFormTypes>}
          type={type as "addVehicle" | "editVehicle"}
        />
      )}
      {type === "filterVehicles" && (
        <FilterVehiclesForm
          formik={formik as FormikProps<FilterVehiclesFormTypes>}
        />
      )}
      {/* Vehicles */}

      {/* Trips */}
      {type === "editTrip" && (
        <TripForm
          formik={formik as FormikProps<TripFormTypes>}
          type={type as "editTrip"}
        />
      )}
      {type === "filterTrips" && (
        <FilterTripsForm formik={formik as FormikProps<FilterTripsFormTypes>} />
      )}
      {type === "filterComplaints" && (
        <FilterComplaintsForm formik={formik as FormikProps<FilterComplaintsFormTypes>} />
      )}
      {/* Trips */}

      {/* Vehicle Types */}
      {(type === "addVehicleType" || type === "editVehicleType") && (
        <VehicleTypeForm 
          formik={formik as FormikProps<VehicleTypeFormTypes>} 
          type={type as "addVehicleType" | "editVehicleType"}
        />
      )}
      {/* Vehicle Types */}

      {/* Coupons */}
      {(type === "addCoupon" || type === "editCoupon") && (
        <CouponForm 
          formik={formik as FormikProps<CouponFormTypes>} 
          type={type as "addCoupon" | "editCoupon"}
        />
      )}
      {/* Coupons */}

      {/* Ads */}
      {(type === "addAd" || type === "editAd") && (
        <AdForm 
          formik={formik as FormikProps<AdFormTypes>} 
          type={type as "addAd" | "editAd"}
          imageFileRef={imageFileRef}
        />
      )}
      {/* Ads */}

      {/* Complaints */}
      {(type === "addComplaint" || type === "editComplaint") && (
        <ComplaintForm 
          formik={formik as FormikProps<ComplaintFormTypes>} 
          type={type as "addComplaint" | "editComplaint"}
        />
      )}
      {/* Complaints */}

      {/* Notifications */}
      {type === "sendNotification" && (
        <NotificationForm 
          formik={formik as FormikProps<NotificationFormTypes>} 
        />
      )}
      {/* Notifications */}

      {/* Roles */}
      {(type === "addRole" || type === "editRole") && (
        <RoleForm 
          formik={formik as FormikProps<RoleFormTypes>} 
          type={type as "addRole" | "editRole"}
        />
      )}
      {/* Roles */}

      {/* Permissions */}
      {(type === "addPermission" || type === "editPermission") && (
        <PermissionForm 
          formik={formik as FormikProps<PermissionFormTypes>} 
          type={type as "addPermission" | "editPermission"}
        />
      )}
      {/* Permissions */}

      {/* Deposit */}
      {type === "addDeposit" && (
        <DepositForm 
          formik={formik as FormikProps<DepositFormTypes>}
        />
      )}
      {/* Deposit */}
    </Box>
  );
};

export default Forms;
