import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

// Suspense Fallback
import Loading from "../pages/Loading";
import Login from "../pages/Login";
import PublicRoute from "./PublicRoute";
import SecureRoute from "./SecureRoute";

// Lazy Imports
const App = lazy(() => import("../App"));
// const Error = lazy(() => import("../pages/Error")); // Commented out - Error page removed
const Profile = lazy(() => import("../pages/Profile"));
const UpdatePassword = lazy(() => import("../pages/UpdatePassword"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Dashboard = lazy(() => import("../pages/Dashboard"));

// User Management
const Users = lazy(() => import("../pages/Users"));
const User = lazy(() => import("../pages/User"));
const AddUser = lazy(() => import("../pages/AddUser"));
const EditUser = lazy(() => import("../pages/EditUser"));

// Driver Management
const Drivers = lazy(() => import("../pages/Drivers"));
const Driver = lazy(() => import("../pages/Driver"));
const AddDriver = lazy(() => import("../pages/AddDriver"));
const EditDriver = lazy(() => import("../pages/EditDriver"));

// Vehicle Management
const Vehicles = lazy(() => import("../pages/Vehicles"));
const Vehicle = lazy(() => import("../pages/Vehicle"));
const AddVehicle = lazy(() => import("../pages/AddVehicle"));
const EditVehicle = lazy(() => import("../pages/EditVehicle"));

// Trip Management
const Trips = lazy(() => import("../pages/Trips"));
const Trip = lazy(() => import("../pages/Trip"));
const EditTrip = lazy(() => import("../pages/EditTrip"));

// Vehicle Type Management
const VehicleTypes = lazy(() => import("../pages/VehicleTypes"));
const VehicleType = lazy(() => import("../pages/VehicleType"));
const AddVehicleType = lazy(() => import("../pages/AddVehicleType"));
const EditVehicleType = lazy(() => import("../pages/EditVehicleType"));

// Coupon Management
const Coupons = lazy(() => import("../pages/Coupons"));
const Coupon = lazy(() => import("../pages/Coupon"));
const AddCoupon = lazy(() => import("../pages/AddCoupon"));
const EditCoupon = lazy(() => import("../pages/EditCoupon"));

// Ad Management
const Ads = lazy(() => import("../pages/Ads"));
const Ad = lazy(() => import("../pages/Ad"));
const AddAd = lazy(() => import("../pages/AddAd"));
const EditAd = lazy(() => import("../pages/EditAd"));

// Complaint Management
const Complaints = lazy(() => import("../pages/Complaints"));
const Complaint = lazy(() => import("../pages/Complaint"));
const AddComplaint = lazy(() => import("../pages/AddComplaint"));
const EditComplaint = lazy(() => import("../pages/EditComplaint"));

// Notification Management
const Notifications = lazy(() => import("../pages/Notifications"));
const Notification = lazy(() => import("../pages/Notification"));
const SendNotification = lazy(() => import("../pages/SendNotification"));

// Settings Management
const Settings = lazy(() => import("../pages/Settings"));

// Roles Management
const Roles = lazy(() => import("../pages/Roles"));
const Role = lazy(() => import("../pages/Role"));
const AddRole = lazy(() => import("../pages/AddRole"));
const EditRole = lazy(() => import("../pages/EditRole"));

// Permissions Management
const Permissions = lazy(() => import("../pages/Permissions"));
const Permission = lazy(() => import("../pages/Permission"));
const AddPermission = lazy(() => import("../pages/AddPermission"));
const EditPermission = lazy(() => import("../pages/EditPermission"));

// Company Profits
const CompanyProfits = lazy(() => import("../pages/CompanyProfits"));

export const router = createBrowserRouter([
  {
    path: `${import.meta.env.VITE_HOME_ROUTE}`,
    element: (
      <App />
    ),
    // Remove errorElement to prevent Error page from showing
    // This allows DetailPageWrapper to handle errors gracefully
    // errorElement: (
    //   <Error />
    // ),
    children: [
      {
        index: true,
        element: (
          <PublicRoute>
            <Loading />
          </PublicRoute>
        )
      },
      {
        path: `${import.meta.env.VITE_LOGIN_ROUTE}`,
        handle: { authorized: false },
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_UPDATE_PASSWORD_ROUTE}`,
        handle: { authorized: false },
        element: (
          <PublicRoute>
            <UpdatePassword />
          </PublicRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_DASHBOARD_ROUTE}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Dashboard />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_PROFILE_ROUTE}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Profile />
          </SecureRoute>
        ),
      },
      // User Management Routes
      {
        path: `${import.meta.env.VITE_USERS_ROUTE}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Users />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_USERS_ROUTE}/add`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <AddUser />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_USERS_ROUTE}/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <User />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_USERS_ROUTE}/edit/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <EditUser />
          </SecureRoute>
        ),
      },
      // Driver Management Routes
      {
        path: `${import.meta.env.VITE_DRIVERS_ROUTE}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Drivers />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_DRIVERS_ROUTE}/add`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <AddDriver />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_DRIVERS_ROUTE}/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Driver />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_DRIVERS_ROUTE}/edit/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <EditDriver />
          </SecureRoute>
        ),
      },
      // Vehicle Management Routes
      {
        path: `${import.meta.env.VITE_VEHICLES_ROUTE}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Vehicles />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_VEHICLES_ROUTE}/add`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <AddVehicle />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_VEHICLES_ROUTE}/edit/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <EditVehicle />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_VEHICLES_ROUTE}/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Vehicle />
          </SecureRoute>
        ),
      },
      // Trip Management Routes
      {
        path: `${import.meta.env.VITE_TRIPS_ROUTE}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Trips />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_TRIPS_ROUTE}/edit/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <EditTrip />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_TRIPS_ROUTE}/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Trip />
          </SecureRoute>
        ),
      },
      // Vehicle Type Management Routes
      {
        path: `${import.meta.env.VITE_VEHICLE_TYPES_ROUTE}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <VehicleTypes />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_VEHICLE_TYPES_ROUTE}/add`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <AddVehicleType />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_VEHICLE_TYPES_ROUTE}/edit/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <EditVehicleType />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_VEHICLE_TYPES_ROUTE}/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <VehicleType />
          </SecureRoute>
        ),
      },
      // Coupon Management Routes
      {
        path: `${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Coupons />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}/add`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <AddCoupon />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}/edit/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <EditCoupon />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Coupon />
          </SecureRoute>
        ),
      },
      // Ad Management Routes
      {
        path: `${import.meta.env.VITE_ADS_ROUTE || "/ads"}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Ads />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_ADS_ROUTE || "/ads"}/add`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <AddAd />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_ADS_ROUTE || "/ads"}/edit/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <EditAd />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_ADS_ROUTE || "/ads"}/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Ad />
          </SecureRoute>
        ),
      },
      // Complaint Management Routes
      {
        path: `${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Complaints />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}/add`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <AddComplaint />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}/edit/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <EditComplaint />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints"}/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Complaint />
          </SecureRoute>
        ),
      },
      // Notification Management Routes
      {
        path: `${import.meta.env.VITE_NOTIFICATIONS_ROUTE || "/notifications"}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Notifications />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_NOTIFICATIONS_ROUTE || "/notifications"}/send`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <SendNotification />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_NOTIFICATIONS_ROUTE || "/notifications"}/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Notification />
          </SecureRoute>
        ),
      },
      // Settings Management Routes
      {
        path: `${import.meta.env.VITE_SETTINGS_ROUTE || "/settings"}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Settings />
          </SecureRoute>
        ),
      },
      // Roles Management Routes
      {
        path: `${import.meta.env.VITE_ROLES_ROUTE || "/roles"}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Roles />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_ROLES_ROUTE || "/roles"}/add`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <AddRole />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_ROLES_ROUTE || "/roles"}/edit/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <EditRole />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_ROLES_ROUTE || "/roles"}/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Role />
          </SecureRoute>
        ),
      },
      // Permissions Management Routes
      {
        path: `${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Permissions />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}/add`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <AddPermission />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}/edit/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <EditPermission />
          </SecureRoute>
        ),
      },
      {
        path: `${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}/:id`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <Permission />
          </SecureRoute>
        ),
      },
      // Company Profits Route
      {
        path: `${import.meta.env.VITE_COMPANY_PROFITS_ROUTE || "/company-profits"}`,
        handle: { authorized: true },
        element: (
          <SecureRoute>
            <CompanyProfits />
          </SecureRoute>
        ),
      },
      {
        path: "*",
        element: (
          <NotFound />
        ),
      },
    ],
  },
]);
