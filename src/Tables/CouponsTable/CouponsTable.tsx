import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Coupon } from "../../types/domain";
import LoadingBody from "../LoadingBody";
import PrimaryTable from "../PrimaryTable";
import { StyledTableCell } from "../StyledTableCell";
import { WhiteStyledTableRow } from "../WhiteStyledTableRow";
import ActionMenus from "./ActionMenus";

const CouponsTable = ({
  data,
  loading,
  count,
}: {
  data?: Coupon[];
  loading?: boolean;
  count?: number;
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tables/coupons_table");

  const getTypeColor = (type: string) => {
    return type === "percentage" 
      ? "bg-blue-100 text-blue-700 border-blue-200" 
      : "bg-green-100 text-green-700 border-green-200";
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-100 text-green-700 border-green-200" 
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const formatValue = (coupon: Coupon) => {
    if (coupon.type === "percentage") {
      // Handle undefined/null values for percentage
      if (coupon.value === undefined || coupon.value === null) {
        return "0%";
      }
      return `${coupon.value}%`;
    }
    // Convert to number in case API returns string
    const numValue = typeof coupon.value === 'string' ? parseFloat(coupon.value) : coupon.value;
    // Handle undefined, null, or NaN values
    if (numValue === undefined || numValue === null || isNaN(numValue)) {
      return "$0.00";
    }
    return `$${numValue.toFixed(2)}`;
  };

  const formatUsage = (coupon: Coupon) => {
    if (coupon.usage_limit) {
      return `${coupon.usage_stats?.total_uses || 0}/${coupon.usage_limit}`;
    }
    return `${coupon.usage_stats?.total_uses || 0}`;
  };

  return (
    <PrimaryTable variant={"coupons"} count={count} currentCount={data?.length} loading={loading}>
      <TableHead>
        <TableRow>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.code", { defaultValue: "Code" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.type", { defaultValue: "Type" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.value", { defaultValue: "Value" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.usage", { defaultValue: "Usage" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.validFrom", { defaultValue: "Valid From" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.validUntil", { defaultValue: "Valid Until" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.status", { defaultValue: "Status" })}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
            {t("labels.actions", { defaultValue: "Actions" })}
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data && !loading ? (
          data.map((coupon, i) => (
            <WhiteStyledTableRow key={i} hover>
              <StyledTableCell
                component="th"
                scope="row"
                align={i18n.language === "ar" ? "left" : "right"}
                className="!cursor-pointer"
                onClick={() =>
                  navigate(`${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}/${coupon.id}`)
                }
              >
                <Box>
                  <Typography
                    variant="body1"
                    className="!font-[600] !text-primary hover:underline"
                  >
                    {coupon.code}
                  </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={coupon.type === "percentage" ? t("labels.percentage", { defaultValue: "Percentage" }) : t("labels.fixedAmount", { defaultValue: "Fixed Amount" })}
                  className={getTypeColor(coupon.type)}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {formatValue(coupon)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {formatUsage(coupon)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {new Date(coupon.valid_from).toLocaleDateString()}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {new Date(coupon.valid_until).toLocaleDateString()}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={coupon.is_active ? t("labels.active", { defaultValue: "Active" }) : t("labels.inactive", { defaultValue: "Inactive" })}
                  className={getStatusColor(coupon.is_active)}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <ActionMenus coupon={coupon} />
              </StyledTableCell>
            </WhiteStyledTableRow>
          ))
        ) : (
          <LoadingBody count={5} />
        )}
      </TableBody>
    </PrimaryTable>
  );
};

export default CouponsTable;

