import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Permission } from "../../types/domain";
import LoadingBody from "../LoadingBody";
import PrimaryTable from "../PrimaryTable";
import { StyledTableCell } from "../StyledTableCell";
import { WhiteStyledTableRow } from "../WhiteStyledTableRow";
import ActionMenus from "./ActionMenus";

const PermissionsTable = ({
  data,
  loading,
  count,
}: {
  data?: Permission[];
  loading?: boolean;
  count?: number;
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tables/permissions_table");

  const getGroupColor = (group: string | null) => {
    if (!group) return "bg-gray-100 text-gray-700 border-gray-200";
    
    const colors: Record<string, string> = {
      dashboard: "bg-blue-100 text-blue-700 border-blue-200",
      users: "bg-green-100 text-green-700 border-green-200",
      drivers: "bg-yellow-100 text-yellow-700 border-yellow-200",
      vehicles: "bg-purple-100 text-purple-700 border-purple-200",
      trips: "bg-pink-100 text-pink-700 border-pink-200",
      complaints: "bg-red-100 text-red-700 border-red-200",
      coupons: "bg-indigo-100 text-indigo-700 border-indigo-200",
      ads: "bg-orange-100 text-orange-700 border-orange-200",
      settings: "bg-teal-100 text-teal-700 border-teal-200",
      roles: "bg-cyan-100 text-cyan-700 border-cyan-200",
      permissions: "bg-violet-100 text-violet-700 border-violet-200",
    };
    
    return colors[group] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <PrimaryTable variant={"permissions"} count={count} currentCount={data?.length} loading={loading}>
      <TableHead>
        <TableRow>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.name", { defaultValue: "Name" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.slug", { defaultValue: "Slug" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.group", { defaultValue: "Group" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.description", { defaultValue: "Description" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.roles", { defaultValue: "Roles" })}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
            {t("labels.actions", { defaultValue: "Actions" })}
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data && !loading ? (
          data.map((permission) => (
            <WhiteStyledTableRow key={permission.id} hover>
              <StyledTableCell
                component="th"
                scope="row"
                align={i18n.language === "ar" ? "left" : "right"}
                className="!cursor-pointer"
                onClick={() =>
                  navigate(`${import.meta.env.VITE_PERMISSIONS_ROUTE || "/permissions"}/${permission.id}`)
                }
              >
                <Box>
                  <Typography
                    variant="body1"
                    className="!font-[600] !text-primary hover:underline"
                  >
                    {permission.name}
                  </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600 !font-mono !text-xs">
                  {permission.slug}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                {permission.group ? (
                  <Chip
                    label={permission.group}
                    className={getGroupColor(permission.group)}
                    size="small"
                  />
                ) : (
                  <Typography variant="body2" className="!text-gray-400">-</Typography>
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600" title={permission.description || ""}>
                  {permission.description ? (permission.description.length > 50 ? `${permission.description.substring(0, 50)}...` : permission.description) : "-"}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={permission.roles_count || 0}
                  className="bg-blue-100 text-blue-700 border-blue-200"
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <ActionMenus permission={permission} />
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

export default PermissionsTable;

