import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { UserTypes } from "../../types/app";
import LoadingBody from "../LoadingBody";
import PrimaryTable from "../PrimaryTable";
import { StyledTableCell } from "../StyledTableCell";
import { WhiteStyledTableRow } from "../WhiteStyledTableRow";
import ActionMenus from "./ActionMenus";
import { getAvatarUrl } from "../../utils/avatarUtils";

const UsersTable = ({
  data,
  loading,
  count,
}: {
  data?: UserTypes[];
  loading?: boolean;
  count?: number;
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tables/users_table");

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'superAdmin':
        return 'bg-purple-100 text-purple-700';
      case 'driver':
        return 'bg-blue-100 text-blue-700';
      case 'user':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <PrimaryTable variant={"users"} count={count} currentCount={data?.length} loading={loading}>
      <TableHead>
        <TableRow>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.user", { defaultValue: "User" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.type", { defaultValue: "Type" })}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
            {t("labels.email", { defaultValue: "Email" })}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
            {t("labels.phone", { defaultValue: "Phone" })}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
            {t("labels.actions", { defaultValue: "Actions" })}
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data && !loading ? (
          data.map((user, i) => (
            <WhiteStyledTableRow key={i} hover>
              <StyledTableCell
                component="th"
                scope="row"
                align={i18n.language === "ar" ? "left" : "right"}
                className="!cursor-pointer"
                onClick={() =>
                  navigate(`${import.meta.env.VITE_USERS_ROUTE}/${user.id}`)
                }
              >
                <Box className="flex items-center gap-3">
                  <Avatar
                    src={getAvatarUrl(user.photo_url)}
                    alt={user.name || "User"}
                    sx={{ width: 40, height: 40 }}
                    className=""
                  >
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="body1"
                      className="!font-[600] !text-primary hover:underline"
                    >
                      {user.name || "-"}
                    </Typography>
                  </Box>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={user.type}
                  className={`!capitalize ${getTypeColor(user.type)}`}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <Typography variant="body2" className="!text-gray-600">
                  {user.email}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <Typography variant="body2" className="!text-gray-600">
                  {user.phone || "-"}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <ActionMenus user={user} />
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

export default UsersTable;
