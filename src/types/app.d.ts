import type { ReactNode } from "react";
import type { Renderable, ToastPosition } from "react-hot-toast";

interface UserTypes {
  id: number;
  name: string;
  email: string;
  type: "user" | "driver" | "superAdmin";
  phone: string | null;
  photo_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

type superAdminStatusTypes = "Completed" | "Skipped" | "Undefined";
interface superAdminTypes {
  account_manager_email: string;
  account_manager_name: string;
  account_manager_phone: string;
  address: string;
  all_members_count: number;
  available_balance: number;
  certificate: string;
  commercial_register_number: string;
  commercial_register_number_file: string;
  consumed_balance: number;
  coverage_document: string;
  covered_employees_count: number;
  covered_members_count: number;
  creation: string;
  docstatus: number;
  doctype: "TB superAdmin";
  assigned_to?: string;
  email: string;
  employees_count: number;
  holded_balance: number;
  iban: string;
  idx: number;
  logo: string;
  modified: string;
  modified_by: string;
  name: string;
  name1: string;
  owner: string;
  percentage_change_of_employees: number;
  phone: string;
  required_balance: number;
  size: "Small" | "Medium" | "Large" | string;
  status: string;
  subscription: string;
  tohold_balance: number;
  tour_status: superAdminStatusTypes;
  uncovered_employees_count: number;
  uncovered_members_count: number;
  vat_number: string;
  vat_number_file: string;
}



interface ImportMetaEnv {
  VITE_SERVER_URL: string;
  VITE_BACKEND_URL: string;
  VITE_TOKEN_COOKIE: string;
  VITE_USER_ID_COOKIE: string;
  VITE_LOGIN_ROUTE: string;
  VITE_OTP_ROUTE: string;
  VITE_RESET_PASSWORD_ROUTE: string;
  VITE_DASHBOARD_ROUTE: string;
}

interface DeleteDataTypes {
  driverId?: string;
  userId?: string;
  vehicleId?: string;
  tripId?: string;
  vehicleTypeId?: string | number;
  couponId?: string | number;
  complaintId?: string | number;
}

interface AlertFunTypes {
  msg: string;
  status?: string;
  pos?: ToastPosition;
  icon?: Renderable;
  dur?: number;
}

interface CustomModalTypes {
  children: ReactNode;
  open: boolean;
  handleClose: () => void;
  className?: string;
  id?: string;
}

interface RouteTypes {
  authorized: boolean;
}

type EntityTypes = "users" | "drivers" | "vehicles" | "trips" | "vehicleTypes" | "coupons" | "ads" | "complaints" | "notifications" | "permissions" | "roles";

type HeadsType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "subtitle1"
  | "subtitle2"
  | "body1"
  | "body2";

export type {
  AlertFunTypes,
  superAdminStatusTypes,
  superAdminTypes,
  CustomModalTypes,
  DeleteDataTypes,
  UserTypes,
  EntityTypes,
  HeadsType,
  ImportMetaEnv,
  RouteTypes
  
};
