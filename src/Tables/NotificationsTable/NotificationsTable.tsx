import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Notification } from "../../types/domain";
import LoadingBody from "../LoadingBody";
import PrimaryTable from "../PrimaryTable";
import { StyledTableCell } from "../StyledTableCell";
import { WhiteStyledTableRow } from "../WhiteStyledTableRow";
import ActionMenus from "./ActionMenus";
import { handleGetCreationTime } from "../../functions/handleGetCreationTime";

const NotificationsTable = ({
  data,
  loading,
  count,
}: {
  data?: Notification[];
  loading?: boolean;
  count?: number;
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tables/notifications_table");

  const getTargetTypeColor = (targetType: string) => {
    switch (targetType) {
      case "all_users":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "all_drivers":
        return "bg-green-100 text-green-700 border-green-200";
      case "user":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "driver":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case "all_users":
        return t("labels.allUsers", { defaultValue: "All Users" });
      case "all_drivers":
        return t("labels.allDrivers", { defaultValue: "All Drivers" });
      case "user":
        return t("labels.specificUser", { defaultValue: "Specific User" });
      case "driver":
        return t("labels.specificDriver", { defaultValue: "Specific Driver" });
      default:
        return targetType;
    }
  };

  return (
    <PrimaryTable variant={"notifications"} count={count} currentCount={data?.length} loading={loading}>
      <TableHead>
        <TableRow>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.title", { defaultValue: "Title" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.body", { defaultValue: "Body" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.targetType", { defaultValue: "Target Type" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.sentCount", { defaultValue: "Sent" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.totalCount", { defaultValue: "Total" })}
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
          data.length > 0 ? (
            data.map((notification, i) => (
              <WhiteStyledTableRow key={i} hover>
                <StyledTableCell
                  component="th"
                  scope="row"
                  align={i18n.language === "ar" ? "left" : "right"}
                  className="!cursor-pointer"
                  onClick={() =>
                    navigate(`${import.meta.env.VITE_NOTIFICATIONS_ROUTE || "/notifications"}/${notification.id}`)
                  }
                >
                  <Box>
                    <Typography
                      variant="body1"
                      className="!font-[600] !text-primary hover:underline"
                    >
                      {notification.title}
                    </Typography>
                  </Box>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="body2" className="!text-gray-600 line-clamp-2 max-w-xs">
                    {notification.body}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Chip
                    label={getTargetTypeLabel(notification.target_type)}
                    className={getTargetTypeColor(notification.target_type)}
                    size="small"
                  />
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="body2" className="!text-gray-600">
                    {notification.sent_count || 0}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="body2" className="!text-gray-600">
                    {notification.total_count || 0}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Typography variant="body2" className="!text-gray-600">
                    {handleGetCreationTime(notification.created_at)}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                  <ActionMenus notification={notification} />
                </StyledTableCell>
              </WhiteStyledTableRow>
            ))
          ) : (
            <TableRow>
              <StyledTableCell colSpan={7} align="center" className="!py-8">
                <Typography variant="body2" className="!text-gray-500">
                  {t("noNotifications", { defaultValue: "No notifications found" })}
                </Typography>
              </StyledTableCell>
            </TableRow>
          )
        ) : (
          <LoadingBody count={5} />
        )}
      </TableBody>
    </PrimaryTable>
  );
};

export default NotificationsTable;

