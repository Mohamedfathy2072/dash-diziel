import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useAppStore } from "../../globals/appStore";
import { logout } from "../../store/authSlice";
import type { AppDispatch, RootState } from "../../store/store";
import NewSidebar from "../Sidebar/NewSidebar";
import useAuth from "../../hooks/useAuth";
import {
  Bell,
  Box,
  BusFront,
  DollarSign,
  Key,
  LayoutDashboard,
  Megaphone,
  Puzzle,
  RectangleGoggles,
  Settings,
  ShieldCheck,
  Tickets,
  UserRound,
  UserRoundPen,
  Van,
} from "lucide-react";
import { sidebarPermissionMap } from "../../utils/sidebarPermissions";

const DashboardSidebar = () => {
  const { t } = useTranslation("components/sidebar");
  const dispatch = useDispatch<AppDispatch>();
  const sidebar = useAppStore((state) => state.sidebar);
  const setSidebar = useAppStore((state) => state.setSidebar);
  const { userPermissions } = useAuth();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleToggleSidebar = () => {
    setSidebar(!sidebar);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // Use useMemo to recalculate items when permissions change
  const items = useMemo(() => {
    const isSuperAdmin = user?.type === "superAdmin";

    // Helper function to check if an item should be visible
    const checkItemVisibility = (itemKey: string): boolean => {
      const requiredPermission = sidebarPermissionMap[itemKey];

      // If no permission required, always visible
      if (requiredPermission === null) {
        return true;
      }

      // SuperAdmin always has access
      if (isSuperAdmin) {
        return true;
      }

      // Check permission(s) - use userPermissions directly
      if (Array.isArray(requiredPermission)) {
        return requiredPermission.some((slug) =>
          userPermissions.includes(slug),
        );
      }

      return userPermissions.includes(requiredPermission);
    };

    return [
      {
        key: "dashboard",
        icon: <LayoutDashboard key={Math.random()} />,
        title: t("dashboard"),
        link: import.meta.env.VITE_DASHBOARD_ROUTE,
        visible: checkItemVisibility("dashboard"),
      },
      {
        key: "companyProfits",
        icon: <DollarSign key={Math.random()} />,
        title: t("companyProfits", { defaultValue: "Company Profits" }),
        link: import.meta.env.VITE_COMPANY_PROFITS_ROUTE || "/company-profits",
        visible: checkItemVisibility("companyProfits"),
      },
      {
        key: "users",
        icon: <UserRound key={Math.random()} />,
        title: t("users"),
        link: import.meta.env.VITE_USERS_ROUTE,
        visible: checkItemVisibility("users"),
      },
      {
        key: "drivers",
        icon: <Van key={Math.random()} />,
        title: t("drivers"),
        link: import.meta.env.VITE_DRIVERS_ROUTE,
        visible: checkItemVisibility("drivers"),
      },
      {
        key: "vehicles",
        icon: <BusFront key={Math.random()} />,
        title: t("vehicles"),
        link: import.meta.env.VITE_VEHICLES_ROUTE,
        visible: checkItemVisibility("vehicles"),
        // subItems: [
        //   {
        //     key: "vehicles-list",
        //     icon: <BusFront key={Math.random()} />,
        //     title: t("vehiclesList", { defaultValue: "Vehicles List" }),
        //     link: import.meta.env.VITE_VEHICLES_ROUTE,
        //     visible: checkItemVisibility("vehicles"),
        //   },
        //   {
        //     key: "vehicleTypes",
        //     icon: <Box key={Math.random()} />,
        //     title: t("vehicleTypes", { defaultValue: "Vehicle Types" }),
        //     link: import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types",
        //     visible: checkItemVisibility("vehicleTypes"),
        //   },
        // ],
      },
      {
        key: "vehicleTypes",
        icon: <Box key={Math.random()} />,
        title: t("vehicleTypes", { defaultValue: "Vehicle Types" }),
        link: import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types",
        visible: checkItemVisibility("vehicleTypes"),
      },
      {
        key: "trips",
        icon: <Tickets key={Math.random()} />,
        title: t("trips"),
        link: import.meta.env.VITE_TRIPS_ROUTE,
        visible: checkItemVisibility("trips"),
      },
      {
        key: "coupons",
        icon: <Puzzle key={Math.random()} />,
        title: t("coupons", { defaultValue: "Coupons" }),
        link: import.meta.env.VITE_COUPONS_ROUTE || "/coupons",
        visible: checkItemVisibility("coupons"),
      },
      {
        key: "ads",
        icon: <RectangleGoggles key={Math.random()} />,
        title: t("ads", { defaultValue: "Ads" }),
        link: import.meta.env.VITE_ADS_ROUTE || "/ads",
        visible: checkItemVisibility("ads"),
      },
      {
        key: "complaints",
        icon: <Megaphone key={Math.random()} />,
        title: t("complaints", { defaultValue: "Complaints" }),
        link: import.meta.env.VITE_COMPLAINTS_ROUTE || "/complaints",
        visible: checkItemVisibility("complaints"),
      },
      {
        key: "notifications",
        icon: <Bell key={Math.random()} />,
        title: t("notifications", { defaultValue: "Notifications" }),
        link: import.meta.env.VITE_NOTIFICATIONS_ROUTE || "/notifications",
        visible: checkItemVisibility("notifications"),
      },
      {
        key: "settings",
        icon: <Settings key={Math.random()} />,
        title: t("settings", { defaultValue: "Settings" }),
        link: import.meta.env.VITE_SETTINGS_ROUTE || "/settings",
        visible: checkItemVisibility("settings"),
      },
      {
        key: "roles",
        icon: <Key key={Math.random()} />,
        title: t("roles", { defaultValue: "Roles" }),
        link: import.meta.env.VITE_ROLES_ROUTE || "/roles",
        visible: checkItemVisibility("roles"),
      },
      {
        key: "permissions",
        icon: <ShieldCheck key={Math.random()} />,
        title: t("permissions", { defaultValue: "Permissions" }),
        link: import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions",
        visible: checkItemVisibility("permissions"),
      },
      {
        key: "profile",
        icon: <UserRoundPen key={Math.random()} />,
        title: t("profile"),
        link: import.meta.env.VITE_PROFILE_ROUTE,
        visible: checkItemVisibility("profile"),
      },
    ];
  }, [t, user, userPermissions]);

  return (
    <NewSidebar
      open={sidebar}
      items={items}
      logoutItem={{
        key: "logout",
        title: t("logout"),
        // icon: <LogoutIcon />,
        handle: handleLogout,
      }}
      handleToggleSidebar={handleToggleSidebar}
    />
  );
};

export default DashboardSidebar;
