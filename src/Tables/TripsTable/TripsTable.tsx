import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Trip } from "../../types/domain";
import { getTripStatusLabel, getTripStatusColor } from "../../utils/enums";
import { getVehicleTypeName } from "../../utils/vehicleTypes";
import useVehicleTypes from "../../hooks/useVehicleTypes";
import LoadingBody from "../LoadingBody";
import PrimaryTable from "../PrimaryTable";
import { StyledTableCell } from "../StyledTableCell";
import { WhiteStyledTableRow } from "../WhiteStyledTableRow";
import ActionMenus from "./ActionMenus";

const TripsTable = ({
  data,
  loading,
  count,
}: {
  data?: Trip[];
  loading?: boolean;
  count?: number;
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tables/trips_table");
  const { activeVehicleTypes } = useVehicleTypes();

  return (
    <PrimaryTable variant={"trips"} count={count} currentCount={data?.length} loading={loading}>
      <TableHead>
        <TableRow>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.trip", { defaultValue: "Trip" })}
          </StyledTableCell>
          
          <StyledTableCell align="center">
            {t("labels.status", { defaultValue: "Status" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.pickup", { defaultValue: "Pickup" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.destination", { defaultValue: "Destination" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.vehicleType", { defaultValue: "Vehicle Type" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.basePrice", { defaultValue: "Base Price" })}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
            {t("labels.actions", { defaultValue: "Actions" })}
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data && !loading ? (
          data.map((trip, i) => (
            <WhiteStyledTableRow key={i} hover>
              <StyledTableCell
                component="th"
                scope="row"
                align={i18n.language === "ar" ? "left" : "right"}
                className="!cursor-pointer"
                onClick={() =>
                  navigate(`${import.meta.env.VITE_TRIPS_ROUTE}/${trip.id}`)
                }
              >
                <Box>
                  <Typography
                    variant="body1"
                    className="!font-[600] !text-primary hover:underline"
                  >
                    {trip.trip_title || `Trip #${trip.id}`}
                  </Typography>
                  <Typography variant="caption" className="!text-gray-500">
                    {new Date(trip.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </StyledTableCell>
              
              <StyledTableCell align="center">
                <Chip
                  label={getTripStatusLabel(trip.status)}
                  className={getTripStatusColor(trip.status)}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600" title={trip.pickup_address}>
                  {trip.pickup_address.length > 30 
                    ? `${trip.pickup_address.substring(0, 30)}...` 
                    : trip.pickup_address}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600" title={trip.destination_address}>
                  {trip.destination_address.length > 30 
                    ? `${trip.destination_address.substring(0, 30)}...` 
                    : trip.destination_address}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!capitalize">
                  {getVehicleTypeName(trip.vehicle_type || trip.vehicle_type_id, activeVehicleTypes)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!font-[600]">
                  ${(Number(trip.base_price) || 0).toFixed(2)}
                </Typography>
              </StyledTableCell>
             
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <ActionMenus trip={trip} />
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

export default TripsTable;
