import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { VehicleType } from "../../types/domain";
import LoadingBody from "../LoadingBody";
import PrimaryTable from "../PrimaryTable";
import { StyledTableCell } from "../StyledTableCell";
import { WhiteStyledTableRow } from "../WhiteStyledTableRow";
import ActionMenus from "./ActionMenus";

const VehicleTypesTable = ({
  data,
  loading,
  count,
}: {
  data?: VehicleType[];
  loading?: boolean;
  count?: number;
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tables/vehicle_types_table");

  const getStatusColor = (status: string) => {
    return status === "active" 
      ? "bg-green-100 text-green-700 border-green-200" 
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <PrimaryTable variant={"vehicleTypes"} count={count} currentCount={data?.length} loading={loading}>
      <TableHead>
        <TableRow>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.name", { defaultValue: "Name" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.nameAr", { defaultValue: "Arabic Name" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.status", { defaultValue: "Status" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.order", { defaultValue: "Order" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.createdAt", { defaultValue: "Created At" })}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
            {t("labels.actions", { defaultValue: "Actions" })}
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data && !loading ? (
          data.map((vehicleType, i) => (
            <WhiteStyledTableRow key={i} hover>
              <StyledTableCell
                component="th"
                scope="row"
                align={i18n.language === "ar" ? "left" : "right"}
                className="!cursor-pointer"
                onClick={() =>
                  navigate(`${import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types"}/${vehicleType.id}`)
                }
              >
                <Box>
                  <Typography
                    variant="body1"
                    className="!font-[600] !text-primary hover:underline"
                  >
                    {vehicleType.name}
                  </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {vehicleType.name_ar}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={vehicleType.status === "active" ? t("labels.active", { defaultValue: "Active" }) : t("labels.inactive", { defaultValue: "Inactive" })}
                  className={getStatusColor(vehicleType.status)}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {vehicleType.order ?? "-"}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {new Date(vehicleType.created_at).toLocaleDateString()}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <ActionMenus vehicleType={vehicleType} />
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

export default VehicleTypesTable;

