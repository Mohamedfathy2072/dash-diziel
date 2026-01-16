import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/common/PageHeader/PageHeader";
import SectionHeader from "../components/common/SectionHeader/SectionHeader";
import InfoField from "../components/common/InfoField/InfoField";
import DetailPageWrapper from "../components/pages/DetailPageWrapper";
import DetailPageActions from "../components/common/DetailPageActions/DetailPageActions";
import useAuth from "../hooks/useAuth";
import useDetailPage from "../hooks/useDetailPage";
import { fetchCouponById, clearSelectedCoupon } from "../store/couponsSlice";
import type { RootState } from "../store/store";
import { getAvatarUrl } from "../utils/avatarUtils";
import { StyledTableCell } from "../Tables/StyledTableCell";
import { WhiteStyledTableRow } from "../Tables/WhiteStyledTableRow";

const Coupon = () => {
  const { t } = useTranslation("pages/coupon");
  const { isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const { id, selectedItem: selectedCoupon, loading, error, handleBack } = useDetailPage({
    selector: (state: RootState) => ({
      selectedItem: state.coupons.selectedCoupon,
      loading: state.coupons.loading,
      error: state.coupons.error,
    }),
    fetchAction: fetchCouponById,
    clearAction: clearSelectedCoupon,
    backRoute: `${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}`,
  });

  if (!isSuperAdmin) {
    return null;
  }

  const actions = (
    <DetailPageActions
      entityId={id}
      editRoute={`${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}/edit/${id}`}
      deleteType="deleteCoupon"
      deleteIdKey="couponId"
      editLabel={t("edit", { defaultValue: "Edit" })}
      deleteLabel={t("delete", { defaultValue: "Delete" })}
    />
  );

  if (!selectedCoupon && !loading) {
    return null;
  }

  const formatValue = (coupon: typeof selectedCoupon) => {
    if (!coupon) return "-";
    if (coupon.type === "percentage") {
      // Handle undefined/null values for percentage
      const value = coupon.value ?? 0;
      const maxDiscount = coupon.max_discount 
        ? (typeof coupon.max_discount === 'string' ? parseFloat(coupon.max_discount) : coupon.max_discount)
        : null;
      // Check if maxDiscount is valid before using toFixed
      const maxDiscountFormatted = maxDiscount !== null && !isNaN(maxDiscount) ? ` (Max: $${maxDiscount.toFixed(2)})` : "";
      return `${value}%${maxDiscountFormatted}`;
    }
    // Convert to number in case API returns string
    const numValue = typeof coupon.value === 'string' ? parseFloat(coupon.value) : coupon.value;
    // Handle undefined, null, or NaN values
    if (numValue === undefined || numValue === null || isNaN(numValue)) {
      return "$0.00";
    }
    return `$${numValue.toFixed(2)}`;
  };

  return (
    <Box className="grid justify-stretch items-start gap-6">
      <PageHeader
        title={selectedCoupon?.code || ""}
        subtitle={t("subtitle", { defaultValue: "Coupon Details" })}
        actions={actions}
        backUrl={`${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}`}
      />
      <DetailPageWrapper
        loading={loading}
        error={error}
        data={selectedCoupon}
        onBack={handleBack}
      >
      <Paper className="paper shadow-lg">
        <Box className="p-6">
          <SectionHeader
            title={t("basicInformation", { defaultValue: "Basic Information" })}
            className="mb-4"
          />
          <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
            <InfoField
              label={t("code", { defaultValue: "Code" })}
              value={selectedCoupon?.code || "-"}
            />
            <InfoField
              label={t("type", { defaultValue: "Type" })}
              value={
                selectedCoupon?.type ? (
                  <Chip
                    label={selectedCoupon.type === "percentage" ? t("percentage", { defaultValue: "Percentage" }) : t("fixedAmount", { defaultValue: "Fixed Amount" })}
                    className={selectedCoupon.type === "percentage" ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-green-100 text-green-700 border-green-200"}
                    size="small"
                  />
                ) : "-"
              }
            />
            <InfoField
              label={t("value", { defaultValue: "Value" })}
              value={formatValue(selectedCoupon)}
            />
            <InfoField
              label={t("minOrderAmount", { defaultValue: "Min Order Amount" })}
              value={selectedCoupon?.min_order_amount ? (() => {
                const amount = typeof selectedCoupon.min_order_amount === 'string' ? parseFloat(selectedCoupon.min_order_amount) : selectedCoupon.min_order_amount;
                return amount !== null && !isNaN(amount) ? `$${amount.toFixed(2)}` : "-";
              })() : "-"}
            />
            <InfoField
              label={t("usageLimit", { defaultValue: "Usage Limit" })}
              value={selectedCoupon?.usage_limit?.toString() || "Unlimited"}
            />
            <InfoField
              label={t("userLimit", { defaultValue: "User Limit" })}
              value={selectedCoupon?.user_limit?.toString() || "-"}
            />
            <InfoField
              label={t("validFrom", { defaultValue: "Valid From" })}
              value={selectedCoupon?.valid_from ? new Date(selectedCoupon.valid_from).toLocaleString() : "-"}
            />
            <InfoField
              label={t("validUntil", { defaultValue: "Valid Until" })}
              value={selectedCoupon?.valid_until ? new Date(selectedCoupon.valid_until).toLocaleString() : "-"}
            />
            <InfoField
              label={t("status", { defaultValue: "Status" })}
              value={
                selectedCoupon?.is_active !== undefined ? (
                  <Chip
                    label={selectedCoupon.is_active ? t("active", { defaultValue: "Active" }) : t("inactive", { defaultValue: "Inactive" })}
                    className={selectedCoupon.is_active ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}
                    size="small"
                  />
                ) : "-"
              }
            />
            <InfoField
              label={t("applicableTo", { defaultValue: "Applicable To" })}
              value={selectedCoupon?.applicable_to === "specific_vehicle_types" ? t("specificVehicleTypes", { defaultValue: "Specific Vehicle Types" }) : t("all", { defaultValue: "All" })}
            />
            {selectedCoupon?.vehicle_types && selectedCoupon.vehicle_types.length > 0 && (
              <InfoField
                label={t("vehicleTypes", { defaultValue: "Vehicle Types" })}
                value={selectedCoupon.vehicle_types
                  .map((vt: any) => {
                    // Handle both VehicleType objects and primitive values
                    if (typeof vt === 'object' && vt !== null && 'name' in vt) {
                      return vt.name;
                    }
                    return String(vt);
                  })
                  .join(", ")}
              />
            )}
            <InfoField
              label={t("description", { defaultValue: "Description" })}
              value={selectedCoupon?.description || "-"}
            />
          </Box>
        </Box>
      </Paper>

      {selectedCoupon?.usage_stats && (
        <>
          {/* Usage Statistics Cards */}
          <Paper className="paper shadow-lg">
            <Box className="p-6">
              <SectionHeader
                title={t("usageStatistics", { defaultValue: "Usage Statistics" })}
                className="mb-6"
              />
              <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Usages Card */}
                <Box className="p-5 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 hover:shadow-md transition-shadow">
                  <Box className="flex items-center justify-between mb-2">
                    <Typography variant="caption" className="!text-blue-600 !font-[500]">
                      {t("totalUsages", { defaultValue: "Total Usages" })}
                    </Typography>
                    <Box className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Typography className="!text-blue-600 !text-xl">📊</Typography>
                    </Box>
                  </Box>
                  <Typography variant="h4" className="!font-[700] !text-blue-900">
                    {selectedCoupon.usage_stats.total_usages ?? selectedCoupon.usage_stats.total_uses ?? 0}
                  </Typography>
                  {selectedCoupon.usage_stats.usage_limit && (
                    <Typography variant="caption" className="!text-blue-600 !mt-1">
                      of {selectedCoupon.usage_stats.usage_limit} limit
                    </Typography>
                  )}
                </Box>

                {/* Remaining Usages Card */}
                <Box className="p-5 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 hover:shadow-md transition-shadow">
                  <Box className="flex items-center justify-between mb-2">
                    <Typography variant="caption" className="!text-green-600 !font-[500]">
                      {t("remainingUsages", { defaultValue: "Remaining" })}
                    </Typography>
                    <Box className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Typography className="!text-green-600 !text-xl">✓</Typography>
                    </Box>
                  </Box>
                  <Typography variant="h4" className="!font-[700] !text-green-900">
                    {selectedCoupon.usage_stats.remaining_usages ?? 
                      (selectedCoupon.usage_stats.usage_limit 
                        ? selectedCoupon.usage_stats.usage_limit - (selectedCoupon.usage_stats.total_usages ?? selectedCoupon.usage_stats.total_uses ?? 0)
                        : "∞")}
                  </Typography>
                </Box>

                {/* Unique Users Card */}
                <Box className="p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 border border-purple-200 hover:shadow-md transition-shadow">
                  <Box className="flex items-center justify-between mb-2">
                    <Typography variant="caption" className="!text-purple-600 !font-[500]">
                      {t("uniqueUsers", { defaultValue: "Unique Users" })}
                    </Typography>
                    <Box className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Typography className="!text-purple-600 !text-xl">👥</Typography>
                    </Box>
                  </Box>
                  <Typography variant="h4" className="!font-[700] !text-purple-900">
                    {selectedCoupon.usage_stats.unique_users ?? 0}
                  </Typography>
                </Box>

                {/* Total Discount Card */}
                <Box className="p-5 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200 hover:shadow-md transition-shadow">
                  <Box className="flex items-center justify-between mb-2">
                    <Typography variant="caption" className="!text-orange-600 !font-[500]">
                      {t("totalDiscount", { defaultValue: "Total Discount" })}
                    </Typography>
                    <Box className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                      <Typography className="!text-orange-600 !text-xl">💰</Typography>
                    </Box>
                  </Box>
                  <Typography variant="h4" className="!font-[700] !text-orange-900">
                    {(() => {
                      const amount = selectedCoupon.usage_stats.total_discount_amount ?? 
                        (selectedCoupon.usage_stats.recent_usages?.reduce(
                          (sum: number, usage: any) => sum + (parseFloat(usage.discount_amount) || 0),
                          0
                        ) ?? 0);
                      return typeof amount === 'string' 
                        ? `$${parseFloat(amount).toFixed(2)}` 
                        : `$${amount.toFixed(2)}`;
                    })()}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Recent Usages Table */}
          {selectedCoupon.usage_stats.recent_usages && selectedCoupon.usage_stats.recent_usages.length > 0 && (
            <Paper className="paper shadow-lg mt-6">
              <Box className="p-6">
                <SectionHeader
                  title={t("recentUsages", { defaultValue: "Recent Usages" })}
                  className="mb-4"
                />
                <TableContainer component={Paper} className="!shadow-none border-[1px] border-solid border-neutral_100 !rounded-lg">
                  <Table>
                    <TableHead>
                      <WhiteStyledTableRow>
                        <StyledTableCell>{t("user", { defaultValue: "User" })}</StyledTableCell>
                        <StyledTableCell>{t("trip", { defaultValue: "Trip" })}</StyledTableCell>
                        <StyledTableCell align="right">{t("discountAmount", { defaultValue: "Discount Amount" })}</StyledTableCell>
                        <StyledTableCell align="right">{t("usedAt", { defaultValue: "Used At" })}</StyledTableCell>
                      </WhiteStyledTableRow>
                    </TableHead>
                    <TableBody>
                      {selectedCoupon.usage_stats.recent_usages.map((usage: any) => (
                        <WhiteStyledTableRow 
                          key={usage.id} 
                          hover
                          className="cursor-pointer"
                          onClick={() => usage.trip_id && navigate(`${import.meta.env.VITE_TRIPS_ROUTE || "/trips"}/${usage.trip_id}`)}
                        >
                          <StyledTableCell>
                            <Box className="flex items-center gap-3">
                              <Avatar
                                src={getAvatarUrl(usage.user?.photo_url)}
                                alt={usage.user?.name}
                                sx={{ width: 40, height: 40 }}
                              >
                                {usage.user?.name?.charAt(0).toUpperCase() || "U"}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" className="!font-[600]">
                                  {usage.user?.name || "Unknown User"}
                                </Typography>
                                <Typography variant="caption" className="!text-gray-500">
                                  {usage.user?.email || "-"}
                                </Typography>
                              </Box>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell>
                            <Box>
                              <Typography variant="body2" className="!font-[600]">
                                {usage.trip?.trip_title || `Trip #${usage.trip_id}`}
                              </Typography>
                              <Typography variant="caption" className="!text-gray-500">
                                {usage.trip?.pickup_address 
                                  ? (usage.trip.pickup_address.length > 40 
                                      ? `${usage.trip.pickup_address.substring(0, 40)}...` 
                                      : usage.trip.pickup_address)
                                  : "-"}
                              </Typography>
                            </Box>
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <Chip
                              label={`$${parseFloat(usage.discount_amount || "0").toFixed(2)}`}
                              className="bg-green-100 text-green-700 border-green-200 !font-[600]"
                              size="small"
                            />
                          </StyledTableCell>
                          <StyledTableCell align="right">
                            <Typography variant="body2" className="!text-gray-600">
                              {new Date(usage.used_at).toLocaleString()}
                            </Typography>
                            <Typography variant="caption" className="!text-gray-400">
                              {new Date(usage.used_at).toLocaleDateString()}
                            </Typography>
                          </StyledTableCell>
                        </WhiteStyledTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Paper>
          )}
        </>
      )}
      </DetailPageWrapper>
    </Box>
  );
};

export default Coupon;

