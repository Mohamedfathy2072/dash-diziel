import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCompanyProfits,
  fetchTemporalDistribution,
  fetchByPaymentMethod,
  fetchByCity,
  fetchTopDrivers,
  fetchGrowthIndicators,
  fetchMonthlyTrend,
  fetchDailyTrend,
} from '../store/companyProfitsSlice';
import type { RootState, AppDispatch } from '../store/store';
import StatCard from '../components/Statistics/StatCard';
import TransactionsIcon from '../icons/TransactionsIcon';
import PercentIcon from '../icons/PercentIcon';
import DownloadIcon from '../icons/DownloadIcon';
import LoadingIcon from '../icons/LoadingIcon';
import MultiLineChart from '../charts/MultiLineChart';

const CompanyProfits = () => {
  const { t } = useTranslation("pages/companyProfits");
  const dispatch = useDispatch<AppDispatch>();
  const { 
    profits, 
    temporalDistribution, 
    byPaymentMethod, 
    byCity, 
    topDrivers, 
    growthIndicators, 
    monthlyTrend, 
    dailyTrend, 
    loading 
  } = useSelector((state: RootState) => state.companyProfits);
  
  const [selectedPeriod, setSelectedPeriod] = useState<string>('this_month');

  useEffect(() => {
    const periodMap: Record<string, { period?: string }> = {
      'today': { period: 'today' },
      'yesterday': { period: 'yesterday' },
      'this_week': { period: 'this_week' },
      'this_month': { period: 'this_month' },
      'this_year': { period: 'this_year' },
    };

    const params = periodMap[selectedPeriod] || {};

    dispatch(fetchCompanyProfits(params));
    dispatch(fetchTemporalDistribution());
    dispatch(fetchByPaymentMethod(params));
    dispatch(fetchByCity(params));
    dispatch(fetchTopDrivers({ limit: 10, ...params }));
    dispatch(fetchGrowthIndicators(params));
    dispatch(fetchMonthlyTrend({ months: 12 }));
    dispatch(fetchDailyTrend({ days: 30 }));
  }, [dispatch, selectedPeriod]);

  const formatCurrency = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return 'IQD0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return 'IQD0.00';
    return `IQD${numValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercentage = (value: number | string | null | undefined): string => {
    if (value === null || value === undefined) return '0.00%';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '0.00%';
    return `${numValue.toFixed(2)}%`;
  };

  const handleExportReport = () => {
    // TODO: Implement export functionality
    console.log('Export report');
  };

  const handleRefresh = () => {
    const periodMap: Record<string, { period?: string }> = {
      'today': { period: 'today' },
      'yesterday': { period: 'yesterday' },
      'this_week': { period: 'this_week' },
      'this_month': { period: 'this_month' },
      'this_year': { period: 'this_year' },
    };
    const params = periodMap[selectedPeriod] || {};
    dispatch(fetchCompanyProfits(params));
    dispatch(fetchTemporalDistribution());
    dispatch(fetchByPaymentMethod(params));
    dispatch(fetchByCity(params));
    dispatch(fetchTopDrivers({ limit: 10, ...params }));
    dispatch(fetchGrowthIndicators(params));
    dispatch(fetchMonthlyTrend({ months: 12 }));
    dispatch(fetchDailyTrend({ days: 30 }));
  };

  if (loading) {
    return (
      <Box className="flex items-center justify-center min-h-[400px]">
        <Box className="text-center">
          <LoadingIcon className="animate-spin w-16 h-16 text-primary mx-auto mb-4" />
          <Typography variant="body1" className="!text-gray-600">
            {t("loading", { defaultValue: "Loading company profits..." })}
          </Typography>
        </Box>
      </Box>
    );
  }

  // Prepare monthly trend data
  const monthlyLabels = monthlyTrend?.labels || [];
  const monthlyDatasets = monthlyTrend ? [
    {
      label: t("commission", { defaultValue: "Commission" }),
      data: monthlyTrend.commission || [],
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      pointBackgroundColor: 'rgba(34, 197, 94, 1)',
      pointBorderColor: 'rgba(34, 197, 94, 1)',
    },
    {
      label: t("totalRevenues", { defaultValue: "Total Revenues" }),
      data: monthlyTrend.revenues || [],
      borderColor: 'rgba(59, 130, 246, 1)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      pointBackgroundColor: 'rgba(59, 130, 246, 1)',
      pointBorderColor: 'rgba(59, 130, 246, 1)',
    },
  ] : [];

  // Prepare daily trend data
  const dailyLabels = dailyTrend?.labels || [];
  const dailyDatasets = dailyTrend ? [
    {
      label: t("dailyCommission", { defaultValue: "Daily Commission" }),
      data: dailyTrend.commission || [],
      borderColor: 'rgba(34, 197, 94, 1)',
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      pointBackgroundColor: 'rgba(34, 197, 94, 1)',
      pointBorderColor: 'rgba(34, 197, 94, 1)',
    },
  ] : [];

  return (
    <Box className="flex flex-col gap-4 w-full">
      {/* Header */}
      <Box className="flex flex-col gap-2">
        <Typography variant="h4" className="!font-[700] !bg-gradient-to-r !from-primary !to-blue-600 !bg-clip-text !text-transparent">
          {t("title", { defaultValue: "Company Profits" })}
        </Typography>
        <Typography variant="body1" className="!text-gray-600">
          {t("subtitle", { defaultValue: "Comprehensive report on company profits from commission" })}
        </Typography>
      </Box>

      {/* Filter and Action Bar */}
      <Box className="flex flex-wrap items-center gap-3">
        <Select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="min-w-[150px]"
          size="small"
        >
          <MenuItem value="today">{t("today", { defaultValue: "Today" })}</MenuItem>
          <MenuItem value="yesterday">{t("yesterday", { defaultValue: "Yesterday" })}</MenuItem>
          <MenuItem value="this_week">{t("thisWeek", { defaultValue: "This Week" })}</MenuItem>
          <MenuItem value="this_month">{t("thisMonth", { defaultValue: "This Month" })}</MenuItem>
          <MenuItem value="this_year">{t("thisYear", { defaultValue: "This Year" })}</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="success"
          startIcon={<DownloadIcon className="w-5 h-5" />}
          onClick={handleExportReport}
          className="!bg-green-600 hover:!bg-green-700"
        >
          {t("exportReport", { defaultValue: "Export Report" })}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefresh}
          className="!bg-blue-600 hover:!bg-blue-700"
        >
          {t("refresh", { defaultValue: "Refresh" })}
        </Button>
      </Box>

      {/* KPI Cards - Horizontal Layout - Always 4 columns */}
      <Box className="grid grid-cols-4 gap-3">
        <StatCard
          title={t("totalRevenues", { defaultValue: "Total Revenues" })}
          value={formatCurrency(profits?.total_revenues)}
          icon={<TransactionsIcon className="w-7 h-7" />}
          gradient="from-blue-500/10 via-blue-400/10 to-blue-600/10"
          iconBg="bg-gradient-to-br from-blue-500 to-blue-600"
          iconColor="text-white"
        />
        <StatCard
          title={t("totalCommission", { defaultValue: "Total Commission" })}
          value={formatCurrency(profits?.total_commission)}
          icon={<TransactionsIcon className="w-7 h-7" />}
          gradient="from-green-500/10 via-green-400/10 to-green-600/10"
          iconBg="bg-gradient-to-br from-green-500 to-green-600"
          iconColor="text-white"
        />
        <StatCard
          title={t("netProfit", { defaultValue: "Net Profit" })}
          value={formatCurrency(profits?.net_profit)}
          icon={<TransactionsIcon className="w-7 h-7" />}
          gradient="from-purple-500/10 via-purple-400/10 to-purple-600/10"
          iconBg="bg-gradient-to-br from-purple-500 to-purple-600"
          iconColor="text-white"
        />
        <StatCard
          title={t("commissionRate", { defaultValue: "Commission Rate" })}
          value={formatPercentage(profits?.commission_rate)}
          icon={<PercentIcon className="w-7 h-7" />}
          gradient="from-orange-500/10 via-orange-400/10 to-orange-600/10"
          iconBg="bg-gradient-to-br from-orange-500 to-orange-600"
          iconColor="text-white"
        />
        <StatCard
          title={t("totalTrips", { defaultValue: "Total Trips" })}
          value={profits?.total_trips || 0}
          icon={<TransactionsIcon className="w-7 h-7" />}
          gradient="from-cyan-500/10 via-cyan-400/10 to-cyan-600/10"
          iconBg="bg-gradient-to-br from-cyan-500 to-cyan-600"
          iconColor="text-white"
        />
        <StatCard
          title={t("avgCommissionPerTrip", { defaultValue: "Average Commission per Trip" })}
          value={formatCurrency(profits?.avg_commission_per_trip)}
          icon={<TransactionsIcon className="w-7 h-7" />}
          gradient="from-teal-500/10 via-teal-400/10 to-teal-600/10"
          iconBg="bg-gradient-to-br from-teal-500 to-teal-600"
          iconColor="text-white"
        />
        <StatCard
          title={t("avgRevenuePerTrip", { defaultValue: "Average Revenue per Trip" })}
          value={formatCurrency(profits?.avg_revenue_per_trip)}
          icon={<TransactionsIcon className="w-7 h-7" />}
          gradient="from-indigo-500/10 via-indigo-400/10 to-indigo-600/10"
          iconBg="bg-gradient-to-br from-indigo-500 to-indigo-600"
          iconColor="text-white"
        />
        <StatCard
          title={t("driverProfits", { defaultValue: "Driver Profits" })}
          value={formatCurrency(profits?.driver_profits)}
          icon={<TransactionsIcon className="w-7 h-7" />}
          gradient="from-pink-500/10 via-pink-400/10 to-pink-600/10"
          iconBg="bg-gradient-to-br from-pink-500 to-pink-600"
          iconColor="text-white"
        />
      </Box>

      {/* Charts Row */}
      <Box className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Trend Chart */}
        <Paper className="p-4 rounded-3xl shadow-xl border border-gray-100 bg-gradient-to-br from-white to-blue-50/30 hover:shadow-2xl transition-all duration-300">
          <Typography variant="h6" className="!font-[700] !mb-4 !text-gray-800">
            {t("monthlyProfitTrend", { defaultValue: "Monthly Profit Trend" })}
          </Typography>
          <Box className="h-64">
            {monthlyLabels.length > 0 && monthlyDatasets.length > 0 ? (
              <MultiLineChart
                labels={monthlyLabels}
                datasets={monthlyDatasets}
              />
            ) : (
              <Box className="flex items-center justify-center h-full">
                <Typography variant="body2" className="!text-gray-500">
                  {t("noData", { defaultValue: "No data available" })}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Daily Trend Chart */}
        <Paper className="p-4 rounded-3xl shadow-xl border border-gray-100 bg-gradient-to-br from-white to-green-50/30 hover:shadow-2xl transition-all duration-300">
          <Typography variant="h6" className="!font-[700] !mb-4 !text-gray-800">
            {t("dailyTrend", { defaultValue: "Daily Trend (Last 30 Days)" })}
          </Typography>
          <Box className="h-64">
            {dailyLabels.length > 0 && dailyDatasets.length > 0 ? (
              <MultiLineChart
                labels={dailyLabels}
                datasets={dailyDatasets}
              />
            ) : (
              <Box className="flex items-center justify-center h-full">
                <Typography variant="body2" className="!text-gray-500">
                  {t("noData", { defaultValue: "No data available" })}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Temporal Distribution Table */}
      <Paper className="p-4 rounded-3xl shadow-xl border border-gray-100">
        <Typography variant="h6" className="!font-[700] !mb-4 !text-gray-800">
          {t("temporalDistribution", { defaultValue: "Temporal Distribution of Profits" })}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="!font-[700]">{t("period", { defaultValue: "Period" })}</TableCell>
                <TableCell className="!font-[700]">{t("totalRevenues", { defaultValue: "Total Revenue" })}</TableCell>
                <TableCell className="!font-[700]">{t("commission", { defaultValue: "Commission" })}</TableCell>
                <TableCell className="!font-[700]">{t("numberOfTrips", { defaultValue: "Number of Trips" })}</TableCell>
                <TableCell className="!font-[700]">{t("commissionPercentage", { defaultValue: "Commission Percentage" })}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(Array.isArray(temporalDistribution) ? temporalDistribution : []).map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{t(item.period || '', { defaultValue: item.period || '' })}</TableCell>
                  <TableCell>{formatCurrency(item.total_revenue)}</TableCell>
                  <TableCell>{formatCurrency(item.commission)}</TableCell>
                  <TableCell>{item.number_of_trips || 0}</TableCell>
                  <TableCell>{formatPercentage(item.commission_percentage)}</TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={5} className="!text-center !text-gray-500">
                    {t("noData", { defaultValue: "No data available" })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Top Drivers Section */}
      <Paper className="p-4 rounded-3xl shadow-xl border border-gray-100">
        <Typography variant="h6" className="!font-[700] !mb-4 !text-gray-800">
          {t("topDriversByCommission", { defaultValue: "Best drivers by commission earned" })}
        </Typography>
        {topDrivers && topDrivers.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="!font-[700]">#</TableCell>
                  <TableCell className="!font-[700]">{t("driverName", { defaultValue: "Driver Name" })}</TableCell>
                  <TableCell className="!font-[700]">{t("commission", { defaultValue: "Commission" })}</TableCell>
                  <TableCell className="!font-[700]">{t("numberOfTrips", { defaultValue: "Number of Trips" })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {topDrivers.map((driver: any, index: number) => (
                  <TableRow key={driver.id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{driver.name || driver.driver_name || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(driver.commission)}</TableCell>
                    <TableCell>{driver.number_of_trips || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography variant="body2" className="!text-gray-500 !text-center !py-8">
            {t("noData", { defaultValue: "No data available" })}
          </Typography>
        )}
      </Paper>

      {/* Earnings by Payment Method */}
      <Paper className="p-4 rounded-3xl shadow-xl border border-gray-100">
        <Typography variant="h6" className="!font-[700] !mb-4 !text-gray-800">
          {t("earningsByPaymentMethod", { defaultValue: "Earnings by payment method" })}
        </Typography>
        <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {byPaymentMethod?.map((method: any, index: number) => (
            <Box
              key={index}
              className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 hover:shadow-lg transition-all"
            >
              <Typography variant="h6" className="!font-[700] !mb-2 !text-gray-800">
                {method.payment_method || 'N/A'}
              </Typography>
              <Typography variant="h5" className="!font-[700] !mb-2 !text-gray-900">
                {formatCurrency(method.amount)}
              </Typography>
              <Typography variant="body2" className="!text-gray-600">
                {method.number_of_trips || 0} - {t("trip", { defaultValue: "trip" })}
              </Typography>
            </Box>
          )) || (
            <Typography variant="body2" className="!text-gray-500 !col-span-4 !text-center !py-8">
              {t("noData", { defaultValue: "No data available" })}
            </Typography>
          )}
        </Box>
      </Paper>

      {/* Growth Indicators */}
      <Paper className="p-4 rounded-3xl shadow-xl border border-gray-100">
        <Typography variant="h6" className="!font-[700] !mb-4 !text-gray-800">
          {t("growthIndicators", { defaultValue: "Growth indicators" })}
        </Typography>
        <Box className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {growthIndicators && (
            <>
              <Box className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 hover:shadow-lg transition-all">
                <Typography variant="h6" className="!font-[700] !mb-2 !text-blue-600">
                  {t("commissionGrowth", { defaultValue: "Commission Growth" })}
                </Typography>
                <Typography variant="h4" className="!font-[700] !mb-2 !text-green-600">
                  {growthIndicators.commission_growth >= 0 ? '+' : ''}{formatPercentage(growthIndicators.commission_growth)}
                </Typography>
                <Typography variant="body2" className="!text-gray-600">
                  {t("comparedToLastMonth", { defaultValue: "compared to last month" })}
                </Typography>
              </Box>
              <Box className="p-5 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 hover:shadow-lg transition-all">
                <Typography variant="h6" className="!font-[700] !mb-2 !text-green-600">
                  {t("revenueGrowth", { defaultValue: "Revenue Growth" })}
                </Typography>
                <Typography variant="h4" className="!font-[700] !mb-2 !text-green-600">
                  {growthIndicators.revenue_growth >= 0 ? '+' : ''}{formatPercentage(growthIndicators.revenue_growth)}
                </Typography>
                <Typography variant="body2" className="!text-gray-600">
                  {t("comparedToLastMonth", { defaultValue: "compared to last month" })}
                </Typography>
              </Box>
              <Box className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 hover:shadow-lg transition-all">
                <Typography variant="h6" className="!font-[700] !mb-2 !text-purple-600">
                  {t("numberOfTripsGrowth", { defaultValue: "Number of Trips Growth" })}
                </Typography>
                <Typography variant="h4" className="!font-[700] !mb-2 !text-green-600">
                  {growthIndicators.trips_growth >= 0 ? '+' : ''}{formatPercentage(growthIndicators.trips_growth)}
                </Typography>
                <Typography variant="body2" className="!text-gray-600">
                  {t("comparedToLastMonth", { defaultValue: "compared to last month" })}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Paper>

      {/* Profits by City Table */}
      <Paper className="p-4 rounded-3xl shadow-xl border border-gray-100">
        <Typography variant="h6" className="!font-[700] !mb-4 !text-gray-800">
          {t("profitsByCity", { defaultValue: "Profits by City" })}
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="!font-[700]">{t("city", { defaultValue: "City" })}</TableCell>
                <TableCell className="!font-[700]">{t("totalRevenues", { defaultValue: "Total Revenues" })}</TableCell>
                <TableCell className="!font-[700]">{t("commission", { defaultValue: "Commission" })}</TableCell>
                <TableCell className="!font-[700]">{t("numberOfTrips", { defaultValue: "Number of Trips" })}</TableCell>
                <TableCell className="!font-[700]">{t("numberOfDrivers", { defaultValue: "Number of Drivers" })}</TableCell>
                <TableCell className="!font-[700]">{t("commissionPercentage", { defaultValue: "Commission Percentage" })}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {byCity && byCity.length > 0 ? (
                byCity.map((city: any, index: number) => (
                  <TableRow key={city.city || index}>
                    <TableCell>{city.city || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(city.total_revenue)}</TableCell>
                    <TableCell>{formatCurrency(city.commission)}</TableCell>
                    <TableCell>{city.number_of_trips || 0}</TableCell>
                    <TableCell>{city.number_of_drivers || 0}</TableCell>
                    <TableCell>{formatPercentage(city.commission_percentage)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="!text-center !text-gray-500">
                    {t("noData", { defaultValue: "No data available" })}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CompanyProfits;
