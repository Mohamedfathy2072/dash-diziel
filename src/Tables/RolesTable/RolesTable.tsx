import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Role } from "../../types/domain";
import LoadingBody from "../LoadingBody";
import PrimaryTable from "../PrimaryTable";
import { StyledTableCell } from "../StyledTableCell";
import { WhiteStyledTableRow } from "../WhiteStyledTableRow";
import ActionMenus from "./ActionMenus";

const RolesTable = ({
  data,
  loading,
  count,
}: {
  data?: Role[];
  loading?: boolean;
  count?: number;
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tables/roles_table");

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-100 text-green-700 border-green-200" 
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <PrimaryTable variant={"roles"} count={count} currentCount={data?.length} loading={loading}>
      <TableHead>
        <TableRow>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.name", { defaultValue: "Name" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.slug", { defaultValue: "Slug" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.description", { defaultValue: "Description" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.permissions", { defaultValue: "Permissions" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.users", { defaultValue: "Users" })}
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
          data.map((role) => (
            <WhiteStyledTableRow key={role.id} hover>
              <StyledTableCell
                component="th"
                scope="row"
                align={i18n.language === "ar" ? "left" : "right"}
                className="!cursor-pointer"
                onClick={() =>
                  navigate(`${import.meta.env.VITE_ROLES_ROUTE || "/roles"}/${role.id}`)
                }
              >
                <Box>
                  <Typography
                    variant="body1"
                    className="!font-[600] !text-primary hover:underline"
                  >
                    {role.name}
                  </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600 !font-mono !text-xs">
                  {role.slug}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600" title={role.description || ""}>
                  {role.description ? (role.description.length > 50 ? `${role.description.substring(0, 50)}...` : role.description) : "-"}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={role.permissions_count || 0}
                  className="bg-blue-100 text-blue-700 border-blue-200"
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={role.users_count || 0}
                  className="bg-purple-100 text-purple-700 border-purple-200"
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={role.is_active ? t("labels.active", { defaultValue: "Active" }) : t("labels.inactive", { defaultValue: "Inactive" })}
                  className={getStatusColor(role.is_active)}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <ActionMenus role={role} />
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

export default RolesTable;

