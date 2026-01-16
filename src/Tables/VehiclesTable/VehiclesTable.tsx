import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Vehicle } from "../../types/domain";
import { getVehicleStatusLabel, getVehicleStatusColor, getVehicleVerificationStatusLabel, getVehicleVerificationStatusColor } from "../../utils/enums";
import { getVehicleTypeName } from "../../utils/vehicleTypes";
import useVehicleTypes from "../../hooks/useVehicleTypes";
import LoadingBody from "../LoadingBody";
import PrimaryTable from "../PrimaryTable";
import { StyledTableCell } from "../StyledTableCell";
import { WhiteStyledTableRow } from "../WhiteStyledTableRow";
import ActionMenus from "./ActionMenus";

const VehiclesTable = ({
  data,
  loading,
  count,
}: {
  data?: Vehicle[];
  loading?: boolean;
  count?: number;
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tables/vehicles_table");
  const { activeVehicleTypes } = useVehicleTypes();

  return (
    <PrimaryTable variant={"vehicles"} count={count} currentCount={data?.length} loading={loading}>
      <TableHead>
        <TableRow>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.vehicle", { defaultValue: "Vehicle" })}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.driver", { defaultValue: "Driver" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.licensePlate", { defaultValue: "License Plate" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.vehicleType", { defaultValue: "Vehicle Type" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.status", { defaultValue: "Status" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.verificationStatus", { defaultValue: "Verification" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.primary", { defaultValue: "Primary" })}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
            {t("labels.actions", { defaultValue: "Actions" })}
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data && !loading ? (
          data.map((vehicle, i) => (
            <WhiteStyledTableRow key={i} hover>
              <StyledTableCell
                component="th"
                scope="row"
                align={i18n.language === "ar" ? "left" : "right"}
                className="!cursor-pointer"
                onClick={() =>
                  navigate(`${import.meta.env.VITE_VEHICLES_ROUTE}/${vehicle.id}`)
                }
              >
                <Box>
                  <Typography
                    variant="body1"
                    className="!font-[600] !text-primary hover:underline"
                  >
                    {vehicle.make} {vehicle.model}
                  </Typography>
                  <Typography variant="caption" className="!text-gray-500">
                    {vehicle.year}
                  </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
                <Box>
                  <Typography variant="body2" className="!font-[600]">
                    {vehicle.driver?.name || "-"}
                  </Typography>
                  <Typography variant="caption" className="!text-gray-500">
                    {vehicle.driver?.email || "-"}
                  </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {vehicle.license_plate}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!capitalize">
                  {getVehicleTypeName(vehicle.vehicle_type || vehicle.vehicle_type_id, activeVehicleTypes)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={getVehicleStatusLabel(vehicle.status)}
                  className={getVehicleStatusColor(vehicle.status)}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={getVehicleVerificationStatusLabel(vehicle.verification_status)}
                  className={getVehicleVerificationStatusColor(vehicle.verification_status)}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                {vehicle.is_primary ? (
                  <Chip
                    label={t("labels.primary", { defaultValue: "Primary" })}
                    className="bg-blue-100 text-blue-700 border-blue-200"
                    size="small"
                  />
                ) : (
                  <Typography variant="body2" className="!text-gray-400">
                    -
                  </Typography>
                )}
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <ActionMenus vehicle={vehicle} />
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

export default VehiclesTable;
