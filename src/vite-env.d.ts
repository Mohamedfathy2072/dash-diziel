/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly VITE_USER_DATA_STORAGE: string;
  readonly VITE_HOME_ROUTE: string;
  readonly VITE_LOGIN_ROUTE: string;
  readonly VITE_DASHBOARD_ROUTE: string;
  readonly VITE_PROFILE_ROUTE: string;
  readonly VITE_UPDATE_PASSWORD_ROUTE: string;
  readonly VITE_USERS_ROUTE: string;
  readonly VITE_DRIVERS_ROUTE: string;
  readonly VITE_VEHICLES_ROUTE: string;
  readonly VITE_TRIPS_ROUTE: string;
  readonly VITE_VEHICLE_TYPES_ROUTE: string;
  readonly VITE_COUPONS_ROUTE: string;


  readonly VITE_USER_PERSONAL_INFO_STORAGE: string;
  readonly VITE_USER_JOB_INFO_STORAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
