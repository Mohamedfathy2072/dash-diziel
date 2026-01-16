import { useParams } from "react-router-dom";
import useLoginSubmit from "../forms/LoginForm/useLoginSubmit";
import useUpdatePasswordSubmit from "../forms/UpdatePasswordForm/useUpdatePasswordSubmit";
import useUserSubmit from "../forms/UserForm/useUserSubmit";
import useDriverSubmit from "../forms/DriverForm/useDriverSubmit";
import useVehicleSubmit from "../forms/VehicleForm/useVehicleSubmit";
import useTripSubmit from "../forms/TripForm/useTripSubmit";
import useVehicleTypeSubmit from "../forms/VehicleTypeForm/useVehicleTypeSubmit";
import useCouponSubmit from "../forms/CouponForm/useCouponSubmit";
import useAdSubmit from "../forms/AdForm/useAdSubmit";
import useComplaintSubmit from "../forms/ComplaintForm/useComplaintSubmit";
import useNotificationSubmit from "../forms/NotificationForm/useNotificationSubmit";
import useRoleSubmit from "../forms/RoleForm/useRoleSubmit";
import usePermissionSubmit from "../forms/PermissionForm/usePermissionSubmit";
import useDepositSubmit from "../forms/DepositForm/useDepositSubmit";
// import useDeleteSubmit from "../forms/DeleteForms/useDeleteSubmit";
import useDocumentSubmit from "../forms/DocumentForm/useDocumentSubmit";
import type {
  AllFormsTypes,
  LoginFormTypes,
  UpdatePasswordFormTypes,
  UserFormTypes,
  DriverFormTypes,
  VehicleFormTypes,
  TripFormTypes,
  DocumentFormTypes,
  VehicleTypeFormTypes,
  CouponFormTypes,
  AdFormTypes,
  ComplaintFormTypes,
  NotificationFormTypes,
  RoleFormTypes,
  PermissionFormTypes,
  DepositFormTypes
} from "../types/forms";
import logger from "../utils/logger";

const useSubmitFunction = (type: string) => {
  const { id } = useParams();
  const { login } = useLoginSubmit();
  const { updatePassword } = useUpdatePasswordSubmit();
  const { addUser, editUser } = useUserSubmit();
  const { addDriver, editDriver } = useDriverSubmit();
  const { addVehicle, editVehicle } = useVehicleSubmit();
  const { editTrip } = useTripSubmit();
  const { addVehicleType, editVehicleType } = useVehicleTypeSubmit();
  const { addCoupon, editCoupon } = useCouponSubmit();
  const { addAd, editAd } = useAdSubmit();
  const { addComplaint, editComplaint } = useComplaintSubmit();
  const { sendNotification } = useNotificationSubmit();
  const { addRole, editRole } = useRoleSubmit();
  const { addPermission, editPermission } = usePermissionSubmit();
  const { addDeposit } = useDepositSubmit();
  // const { deleteUser } = useDeleteSubmit();
  const { updateDocument } = useDocumentSubmit();

  const handleSubmit = (values: AllFormsTypes) => {
    switch (type) {
      case "login":
        login(values as LoginFormTypes);
        break;
      case "updatePassword":
        updatePassword(values as UpdatePasswordFormTypes);
        break;
      case "addUser":
        addUser(values as UserFormTypes & { photoFile?: File | null });
        break;
      case "editUser":
        editUser(values as UserFormTypes & { photoFile?: File | null });
        break;
      case "addDriver":
        addDriver(values as DriverFormTypes & { photoFile?: File | null; documents?: { [key: string]: File | null } });
        break;
      case "editDriver":
        editDriver(values as DriverFormTypes & { photoFile?: File | null; documents?: { [key: string]: File | null } });
        break;
      case "updateDocument":
        updateDocument(values as DocumentFormTypes & { file?: File | null });
        break;
      case "addVehicle":
        addVehicle(values as VehicleFormTypes);
        break;
      case "editVehicle":
        editVehicle(values as VehicleFormTypes);
        break;
      case "editTrip":
        if (id && !isNaN(+id)) {
          editTrip(+id, values as TripFormTypes);
        }
        break;
      case "addVehicleType":
        addVehicleType(values as VehicleTypeFormTypes);
        break;
      case "editVehicleType":
        editVehicleType(values as VehicleTypeFormTypes);
        break;
      case "addCoupon":
        addCoupon(values as CouponFormTypes);
        break;
      case "editCoupon":
        editCoupon(values as CouponFormTypes);
        break;
      case "addAd":
        addAd(values as AdFormTypes);
        break;
      case "editAd":
        editAd(values as AdFormTypes);
        break;
      case "addComplaint":
        addComplaint(values as ComplaintFormTypes);
        break;
      case "editComplaint":
        editComplaint(values as ComplaintFormTypes);
        break;
      case "sendNotification":
        sendNotification(values as NotificationFormTypes).catch((error) => {
          logger.error("Error sending notification", error);
        });
        break;
      case "addRole":
        addRole(values as RoleFormTypes);
        break;
      case "editRole":
        editRole(values as RoleFormTypes);
        break;
      case "addPermission":
        addPermission(values as PermissionFormTypes);
        break;
      case "editPermission":
        editPermission(values as PermissionFormTypes);
        break;
      case "addDeposit":
        addDeposit(values as DepositFormTypes);
        break;
      case "deleteUser":
      case "deleteVehicle":
      case "deleteTrip":
      case "deleteVehicleType":
      case "deleteCoupon":
      case "deleteAd":
      case "deleteComplaint":
      default:
        logger.warn("Unknown form type submitted", type);
        break;
    }
  };

  return { handleSubmit };
};

export default useSubmitFunction;
