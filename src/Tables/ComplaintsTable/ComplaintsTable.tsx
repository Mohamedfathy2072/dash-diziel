import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Complaint } from "../../types/domain";
import { getComplaintStatusLabel, getComplaintStatusColor } from "../../utils/enums";
import LoadingBody from "../LoadingBody";
import PrimaryTable from "../PrimaryTable";
import { StyledTableCell } from "../StyledTableCell";
import { WhiteStyledTableRow } from "../WhiteStyledTableRow";
import ActionMenus from "./ActionMenus";

const ComplaintsTable = ({
  data,
  loading,
  count,
}: {
  data?: Complaint[];
  loading?: boolean;
  count?: number;
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tables/complaints_table");

  const getComplaintableTypeLabel = (type: string | null): string => {
    if (!type) return 'General';
    return type;
  };

  return (
    <PrimaryTable variant={"complaints"} count={count} currentCount={data?.length} loading={loading}>
      <TableHead>
        <TableRow>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.subject", { defaultValue: "Subject" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.status", { defaultValue: "Status" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.user", { defaultValue: "User" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.type", { defaultValue: "Type" })}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.created", { defaultValue: "Created" })}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
            {t("labels.actions", { defaultValue: "Actions" })}
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data && !loading ? (
          data.map((complaint, i) => (
            <WhiteStyledTableRow key={i} hover>
              <StyledTableCell
                component="th"
                scope="row"
                align={i18n.language === "ar" ? "left" : "right"}
                className="!cursor-pointer"
                onClick={() =>
                  navigate(`${import.meta.env.VITE_COMPLAINTS_ROUTE || '/complaints'}/${complaint.id}`)
                }
              >
                <Box>
                  <Typography
                    variant="body1"
                    className="!font-[600] !text-primary hover:underline"
                  >
                    {complaint.subject}
                  </Typography>
                  <Typography variant="caption" className="!text-gray-500">
                    {new Date(complaint.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={getComplaintStatusLabel(complaint.status)}
                  className={getComplaintStatusColor(complaint.status)}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {complaint.user?.name || `User #${complaint.user_id}`}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!capitalize">
                  {getComplaintableTypeLabel(complaint.complaintable_type)}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {new Date(complaint.created_at).toLocaleDateString()}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <ActionMenus complaint={complaint} />
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

export default ComplaintsTable;

