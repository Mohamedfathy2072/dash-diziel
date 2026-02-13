import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStatistics } from '../store/statisticsSlice';
import type { RootState, AppDispatch } from '../store/store';
import StatCard from '../components/Statistics/StatCard';
import UsersIcon from '../icons/UsersIcon';
import DashboardIcon from '../icons/DashboardIcon';
import NotificationIcon from '../icons/NotificationIcon';
import ClaimIcon from '../icons/ClaimIcon';
import TransactionsIcon from '../icons/TransactionsIcon';
import StarIcon from '../icons/StarIcon';
import LoadingIcon from '../icons/LoadingIcon';
import DoughnutChart from '../charts/DoughnutChart';
import BarChart from '../charts/BarChart';

const Dashboard = () => {
  const { t } = useTranslation("pages/dashboard");
  const dispatch = useDispatch<AppDispatch>();
  const { statistics, loading } = useSelector((state: RootState) => state.statistics);

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-[400px]">
        <Box className="text-center">
          <LoadingIcon className="animate-spin w-16 h-16 text-primary mx-auto mb-4" />
          <Typography variant="body1" className="!text-gray-600">
            {t("loading", { defaultValue: "Loading statistics..." })}
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!statistics) {
    return (
      <Box className="grid justify-stretch items-start gap-6">
        <Typography variant="h4" className="!font-[700]">
          {t("title", { defaultValue: "Dashboard" })}
        </Typography>
        <Typography variant="body1" className="!text-gray-600">
          {t("noData", { defaultValue: "No statistics available" })}
        </Typography>
      </Box>
    );
  }

  const stats = statistics;

  // Prepare data for charts
  const usersByTypeData = stats.users?.by_type ? [
    stats.users.by_type.users || 0,
    stats.users.by_type.drivers || 0,
    stats.users.by_type.super_admins || 0,
  ] : [];
  const usersByTypeLabels = stats.users?.by_type ? [
    t("regularUsers", { defaultValue: "Regular Users" }),
    t("drivers", { defaultValue: "Drivers" }),
    t("superAdmins", { defaultValue: "Super Admins" }),
  ] : [];

  const driversByStatusData = stats.drivers?.by_status ? [
    stats.drivers.by_status.pending || 0,
    stats.drivers.by_status.verified || 0,
    stats.drivers.by_status.rejected || 0,
    stats.drivers.by_status.suspended || 0,
  ] : [];
  const driversByStatusLabels = stats.drivers?.by_status ? [
    t("pending", { defaultValue: "Pending" }),
    t("verified", { defaultValue: "Verified" }),
    t("rejected", { defaultValue: "Rejected" }),
    t("suspended", { defaultValue: "Suspended" }),
  ] : [];

  const driverAvailabilityData = stats.drivers?.by_availability ? [
    stats.drivers.by_availability.available || 0,
    stats.drivers.by_availability.busy || 0,
    stats.drivers.by_availability.offline || 0,
  ] : [];
  const driverAvailabilityLabels = stats.drivers?.by_availability ? [
    t("available", { defaultValue: "Available" }),
    t("busy", { defaultValue: "Busy" }),
    t("offline", { defaultValue: "Offline" }),
  ] : [];

  const tripsData = stats.trips ? [
    stats.trips.completed || 0,
    stats.trips.cancelled || 0,
    stats.trips.pending || 0,
  ] : [];
  const tripsLabels = [
    t("completed", { defaultValue: "Completed" }),
    t("cancelled", { defaultValue: "Cancelled" }),
    t("pending", { defaultValue: "Pending" }),
  ];

  return (
      <div className="container">
      <Typography
        variant="h4"
        className="!font-[700] !bg-gradient-to-r !from-primary !to-blue-600 !bg-clip-text !text-transparent"
      >
        {t("title", { defaultValue: "Dashboard" })}
      </Typography>
      <div className="row my-4">
        <div className="col-md-6 col-lg-3">
          {/* Total Users */}
          <StatCard
            title={t("totalUsers", { defaultValue: "Total Users" })}
            value={stats.users?.total || 0}
            icon={<UsersIcon className="w-7 h-7" />}
            gradient="from-blue-500/10 via-blue-400/10 to-blue-600/10"
            iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
            iconColor="text-white"
            subtitle={
              stats.users?.new_today
                ? `+${stats.users.new_today} ${t("newToday", { defaultValue: "new today" })}`
                : undefined
            }
          />
        </div>
        <div className="col-md-6 col-lg-3">
          {/* Total Drivers */}
          <StatCard
            title={t("totalDrivers", { defaultValue: "Total Drivers" })}
            value={stats.drivers?.total || 0}
            icon={<DashboardIcon className="w-7 h-7" />}
            gradient="from-green-500/10 via-green-400/10 to-green-600/10"
            iconBg="bg-gradient-to-br from-green-500 to-green-600"
            iconColor="text-white"
            subtitle={
              stats.drivers?.online
                ? `${stats.drivers.online} ${t("online", { defaultValue: "online" })}`
                : undefined
            }
          />
        </div>
        <div className="col-md-6 col-lg-3">
          {/* Total Trips */}
          <StatCard
            title={t("totalTrips", { defaultValue: "Total Trips" })}
            value={stats.trips?.total || 0}
            icon={<TransactionsIcon className="w-7 h-7" />}
            gradient="from-purple-500/10 via-purple-400/10 to-purple-600/10"
            iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
            iconColor="text-white"
            subtitle={
              stats.trips?.completed
                ? `${stats.trips.completed} ${t("completed", { defaultValue: "completed" })}`
                : undefined
            }
          />
        </div>
        <div className="col-md-6 col-lg-3">
          {/* Total Revenue */}
          <StatCard
            title={t("totalRevenue", { defaultValue: "Total Revenue" })}
            value={
              stats.revenue?.total
                ? `$${parseFloat(stats.revenue.total).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : "$0.00"
            }
            icon={<TransactionsIcon className="w-7 h-7" />}
            gradient="from-orange-500/10 via-orange-400/10 to-orange-600/10"
            iconBg="bg-gradient-to-br from-orange-500 to-orange-600"
            iconColor="text-white"
            subtitle={
              stats.revenue?.this_month
                ? `${t("thisMonth", { defaultValue: "This month" })}: $${parseFloat(stats.revenue.this_month).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : undefined
            }
          />
        </div>
      </div>

      {/* Additional Statistics Cards */}
      <div className="row my-4">
        <div className="col-md-6 col-lg-3">
          {stats.notifications && (
            <StatCard
              title={t("notifications", { defaultValue: "Notifications" })}
              value={stats.notifications.total || 0}
              icon={<NotificationIcon className="w-6 h-6" />}
              gradient="from-indigo-500/10 via-indigo-400/10 to-indigo-600/10"
              iconBg="bg-gradient-to-br from-indigo-500 to-indigo-600"
              iconColor="text-white"
            />
          )}
        </div>
        <div className="col-md-6 col-lg-3">
          {stats.complaints && (
            <StatCard
              title={t("complaints", { defaultValue: "Complaints" })}
              value={stats.complaints.total || 0}
              icon={<ClaimIcon className="w-6 h-6" />}
              gradient="from-red-500/10 via-red-400/10 to-red-600/10"
              iconBg="bg-gradient-to-br from-red-500 to-red-600"
              iconColor="text-white"
              subtitle={
                stats.complaints.pending
                  ? `${stats.complaints.pending} ${t("pending", { defaultValue: "pending" })}`
                  : undefined
              }
            />
          )}
        </div>
        <div className="col-md-6 col-lg-3">
          {stats.coupons && (
            <StatCard
              title={t("coupons", { defaultValue: "Coupons" })}
              value={stats.coupons.total || 0}
              icon={<DashboardIcon className="w-6 h-6" />}
              gradient="from-teal-500/10 via-teal-400/10 to-teal-600/10"
              iconBg="bg-gradient-to-br from-teal-500 to-teal-600"
              iconColor="text-white"
              subtitle={
                stats.coupons.active
                  ? `${stats.coupons.active} ${t("active", { defaultValue: "active" })}`
                  : undefined
              }
            />
          )}
        </div>
        <div className="col-md-6 col-lg-3">
          {stats.vehicles && (
            <StatCard
              title={t("vehicles", { defaultValue: "Vehicles" })}
              value={stats.vehicles.total || 0}
              icon={<DashboardIcon className="w-6 h-6" />}
              gradient="from-cyan-500/10 via-cyan-400/10 to-cyan-600/10"
              iconBg="bg-gradient-to-br from-cyan-500 to-cyan-600"
              iconColor="text-white"
              subtitle={
                stats.vehicles.verified
                  ? `${stats.vehicles.verified} ${t("verified", { defaultValue: "verified" })}`
                  : undefined
              }
            />
          )}
        </div>
      </div>

      <Box className="my-4 grid grid-cols-2 lg:grid-cols-2 gap-6">
        {/* Users by Type Chart */}
        {stats.users?.by_type && (
          <Paper className="bg-white p-4 rounded-xl shadow-[0_0.125rem_0_rgba(10,10,10,0.04)]">
            <Typography
              variant="h6"
              className="!font-[700] !mb-6 !text-gray-800"
            >
              {t("usersByType", { defaultValue: "Users Distribution" })}
            </Typography>
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <Box className="flex justify-center">
                <Box className="w-48 h-48">
                  <DoughnutChart
                    dataSets={usersByTypeData}
                    labels={usersByTypeLabels}
                    className="!max-w-full !max-h-full"
                  />
                </Box>
              </Box>
              <Box className="grid gap-4 d-flex justify-center">
                <Box className="flex items-center gap-2">
                  <Box className="flex items-center gap-3">
                    <Box className="w-4 h-4 rounded-full bg-blue-500"></Box>
                    <Typography
                      variant="body2"
                      className="!font-[600] !text-gray-700"
                    >
                      {t("regularUsers", { defaultValue: "Regular Users" })}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    className="!font-[700] !text-blue-600"
                  >
                    {stats.users.by_type.users || 0}
                  </Typography>
                </Box>
                <Box className="flex items-center gap-2">
                  <Box className="flex items-center gap-3">
                    <Box className="w-4 h-4 rounded-full bg-green-500"></Box>
                    <Typography
                      variant="body2"
                      className="!font-[600] !text-gray-700"
                    >
                      {t("drivers", { defaultValue: "Drivers" })}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    className="!font-[700] !text-green-600"
                  >
                    {stats.users.by_type.drivers || 0}
                  </Typography>
                </Box>
               <Box className="flex items-center gap-2">
                  <Box className="flex items-center gap-3">
                    <Box className="w-4 h-4 rounded-full bg-purple-500"></Box>
                    <Typography
                      variant="body2"
                      className="!font-[600] !text-gray-700"
                    >
                      {t("superAdmins", { defaultValue: "Super Admins" })}
                    </Typography>
                  </Box>
                  <Typography
                    variant="h6"
                    className="!font-[700] !text-purple-600"
                  >
                    {stats.users.by_type.super_admins || 0}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        )}

        {stats.trips && (
          <Paper className="bg-white p-4 rounded-xl shadow-[0_0.125rem_0_rgba(10,10,10,0.04)] flex flex-col">
            <Typography
              variant="h6"
              className="!font-[700] !mb-6 !text-gray-800"
            >
              {t("tripsStatus", { defaultValue: "Trips Status" })}
            </Typography>
            <Box className="flex-1">
              <BarChart dataSets={tripsData} labels={tripsLabels} />
            </Box>
          </Paper>
        )}
      </Box>

      {/* Driver Performance Stats */}
      <div className="row my-4">
        <div className="col-12 mb-3">
          <Typography variant="h6" className="!font-[700] !text-gray-800">
            {t("driverPerformance", { defaultValue: "Driver Performance" })}
          </Typography>
        </div>

        <div className="col-md-6 col-lg-3">
          <StatCard
            title={t("totalRides", { defaultValue: "Total Rides" })}
            value={stats.drivers.total_rides?.toLocaleString() || 0}
            icon={<DashboardIcon className="w-6 h-6" />}
            gradient="from-blue-500/10 via-blue-400/10 to-blue-600/10"
            iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
            iconColor="text-white"
          />
        </div>

        <div className="col-md-6 col-lg-3">
          <StatCard
            title={t("completedRides", { defaultValue: "Completed Rides" })}
            value={stats.drivers.completed_rides?.toLocaleString() || 0}
            icon={<DashboardIcon className="w-6 h-6" />}
            gradient="from-green-500/10 via-green-400/10 to-green-600/10"
            iconBg="bg-gradient-to-br from-green-500 to-green-600"
            iconColor="text-white"
          />
        </div>

        <div className="col-md-6 col-lg-3">
          <StatCard
            title={t("averageRating", { defaultValue: "Average Rating" })}
            value={stats.drivers.average_rating?.toFixed(1) || "0.0"}
            icon={<StarIcon className="w-6 h-6" />}
            gradient="from-orange-500/10 via-orange-400/10 to-orange-600/10"
            iconBg="bg-gradient-to-br from-orange-500 to-orange-600"
            iconColor="text-white"
          />
        </div>

        <div className="col-md-6 col-lg-3">
          <StatCard
            title={t("totalEarnings", { defaultValue: "Total Earnings" })}
            value={
              stats.drivers.total_earnings
                ? `$${parseFloat(
                    stats.drivers.total_earnings.toString(),
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "$0.00"
            }
            icon={<DashboardIcon className="w-6 h-6" />}
            gradient="from-purple-500/10 via-purple-400/10 to-purple-600/10"
            iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
            iconColor="text-white"
          />
        </div>
      </div>
      <Box className="my-4 grid grid-cols-2 lg:grid-cols-2 gap-6">
        {stats.drivers && (
          <Box className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Driver Availability Chart */}
            {stats.drivers.by_availability && (
              <Paper className="bg-white p-4 rounded-xl shadow-[0_0.125rem_0_rgba(10,10,10,0.04)] flex flex-col">
                <Typography
                  variant="h6"
                  className="!font-[700] !mb-6 !text-gray-800"
                >
                  {t("driverAvailability", {
                    defaultValue: "Driver Availability",
                  })}
                </Typography>

                <Box className="flex-1">
                  <BarChart
                    dataSets={driverAvailabilityData}
                    labels={driverAvailabilityLabels}
                  />
                </Box>
              </Paper>
            )}
          </Box>
        )}
        {stats.drivers?.by_status && (
          <Paper className="bg-white p-4 rounded-xl shadow-[0_0.125rem_0_rgba(10,10,10,0.04)] flex flex-col">
            <Typography
              variant="h6"
              className="!font-[700] !mb-4 !text-gray-800"
            >
              {t("driversByStatus", { defaultValue: "Drivers by Status" })}
            </Typography>

            <Box className="flex-1">
              <BarChart
                dataSets={driversByStatusData}
                labels={driversByStatusLabels}
              />
            </Box>
          </Paper>
        )}
      </Box>
    </div>
  );
};

export default Dashboard;
