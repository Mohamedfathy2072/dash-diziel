import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Driver } from "../../types/domain";
import { getDriverStatusColor, getDriverStatusLabel, getDriverAvailabilityStatusDotColor } from "../../utils/enums";
import LoadingBody from "../LoadingBody";
import PrimaryTable from "../PrimaryTable";
import { StyledTableCell } from "../StyledTableCell";
import { WhiteStyledTableRow } from "../WhiteStyledTableRow";
import ActionMenus from "./ActionMenus";
import { getAvatarUrl } from "../../utils/avatarUtils";

const DriversTable = ({
  data,
  loading,
  count,
}: {
  data?: Driver[];
  loading?: boolean;
  count?: number;
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tables/drivers_table");


  return (
    <PrimaryTable variant={"drivers"} count={count} currentCount={data?.length} loading={loading}>
      <TableHead>
        <TableRow>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.driver", { defaultValue: "Driver" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.status", { defaultValue: "Status" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.license", { defaultValue: "License" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.rating", { defaultValue: "Rating" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.trips", { defaultValue: "Trips" })}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
            {t("labels.actions", { defaultValue: "Actions" })}
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data && !loading ? (
          data.map((driver, i) => (
            <WhiteStyledTableRow key={i} hover>
              <StyledTableCell
                component="th"
                scope="row"
                align={i18n.language === "ar" ? "left" : "right"}
                className="!cursor-pointer"
                onClick={() =>
                  navigate(`${import.meta.env.VITE_DRIVERS_ROUTE}/${driver.id}`)
                }
              >
                <Box className="flex items-center gap-3">
                  <Box className="relative">
                    <Avatar
                      src={getAvatarUrl(driver.photo_url)}
                      alt={driver.name || "Driver"}
                      sx={{ width: 40, height: 40 }}
                    >
                      {driver.name?.charAt(0).toUpperCase() || "D"}
                    </Avatar>
                    {driver.availability_status && (
                      <Box
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${getDriverAvailabilityStatusDotColor(driver.availability_status)}`}
                        title={driver.availability_status}
                      />
                    )}
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      className="!font-[600] !text-primary hover:underline"
                    >
                      {driver.name || "Unknown"}
                    </Typography>
                    <Typography variant="caption" className="!text-gray-500">
                      {driver.email || "-"}
                    </Typography>
                  </Box>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={getDriverStatusLabel(driver.status)}
                  className={getDriverStatusColor(driver.status)}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {driver.license_number || "-"}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!font-[600]">
                  {(() => {
                    const rating = driver.rating;
                    if (rating == null || rating === undefined) return "0.0";
                    const numRating = typeof rating === 'number' ? rating : Number(rating);
                    return isNaN(numRating) ? "0.0" : numRating.toFixed(1);
                  })()} ⭐
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {driver.total_rides ||  0}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <ActionMenus driver={driver} />
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

export default DriversTable;

