import { configureStore } from "@reduxjs/toolkit";
import authReducers from "./authSlice.ts";
import profileReducer from "./profileSlice.ts";
import usersReducer from "./usersSlice.ts";
import driversReducer from "./driversSlice.ts";
import vehiclesReducer from "./vehiclesSlice.ts";
import tripsReducer from "./tripsSlice.ts";
import vehicleTypesReducer from "./vehicleTypesSlice.ts";
import couponsReducer from "./couponsSlice.ts";
import adsReducer from "./adsSlice.ts";
import complaintsReducer from "./complaintsSlice.ts";
import ratingsReducer from "./ratingsSlice.ts";
import notificationsReducer from "./notificationsSlice.ts";
import statisticsReducer from "./statisticsSlice.ts";
import rolesReducer from "./rolesSlice.ts";
import permissionsReducer from "./permissionsSlice.ts";
import companyProfitsReducer from "./companyProfitsSlice.ts";

export const store = configureStore({
  reducer: {
    auth: authReducers,
    profile: profileReducer,
    users: usersReducer,
    drivers: driversReducer,
    vehicles: vehiclesReducer,
    trips: tripsReducer,
    vehicleTypes: vehicleTypesReducer,
    coupons: couponsReducer,
    ads: adsReducer,
    complaints: complaintsReducer,
    ratings: ratingsReducer,
    notifications: notificationsReducer,
    statistics: statisticsReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
    companyProfits: companyProfitsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
