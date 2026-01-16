import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Ad } from "../../types/domain";
import LoadingBody from "../LoadingBody";
import PrimaryTable from "../PrimaryTable";
import { StyledTableCell } from "../StyledTableCell";
import { WhiteStyledTableRow } from "../WhiteStyledTableRow";
import ActionMenus from "./ActionMenus";
import { handleGetFileFromServer } from "../../functions/handleGetFileFromServer";

const AdsTable = ({
  data,
  loading,
  count,
}: {
  data?: Ad[];
  loading?: boolean;
  count?: number;
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("tables/ads_table");

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-100 text-green-700 border-green-200" 
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <PrimaryTable variant={"ads"} count={count} currentCount={data?.length} loading={loading}>
      <TableHead>
        <TableRow>
          <StyledTableCell align={i18n.language === "ar" ? "left" : "right"}>
            {t("labels.title")}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.image")}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.link")}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.order")}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.validFrom")}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.validUntil")}
          </StyledTableCell>
          <StyledTableCell align="center">
            {t("labels.status")}
          </StyledTableCell>
          <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
            {t("labels.actions")}
          </StyledTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data && !loading ? (
          data.map((ad, i) => (
            <WhiteStyledTableRow key={i} hover>
              <StyledTableCell
                component="th"
                scope="row"
                align={i18n.language === "ar" ? "left" : "right"}
                className="!cursor-pointer"
                onClick={() =>
                  navigate(`${import.meta.env.VITE_ADS_ROUTE || "/ads"}/${ad.id}`)
                }
              >
                <Box>
                  <Typography
                    variant="body1"
                    className="!font-[600] !text-primary hover:underline"
                  >
                    {i18n.language === "ar" ? ad.title_ar : ad.title_en}
                  </Typography>
                </Box>
              </StyledTableCell>
              <StyledTableCell align="center">
                {ad.image_url ? (
                  <img
                    src={handleGetFileFromServer(ad.image_url) || ''}
                    alt={i18n.language === "ar" ? ad.title_ar : ad.title_en}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <Typography variant="body2" className="!text-gray-400">
                    {t("labels.noImage")}
                  </Typography>
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                {ad.link ? (
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {t("labels.viewLink")}
                  </a>
                ) : (
                  <Typography variant="body2" className="!text-gray-400">
                    -
                  </Typography>
                )}
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {ad.order}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {ad.valid_from ? new Date(ad.valid_from).toLocaleDateString() : "-"}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Typography variant="body2" className="!text-gray-600">
                  {ad.valid_until ? new Date(ad.valid_until).toLocaleDateString() : "-"}
                </Typography>
              </StyledTableCell>
              <StyledTableCell align="center">
                <Chip
                  label={ad.is_active ? t("labels.active") : t("labels.inactive")}
                  className={getStatusColor(ad.is_active)}
                  size="small"
                />
              </StyledTableCell>
              <StyledTableCell align={i18n.language === "ar" ? "right" : "left"}>
                <ActionMenus ad={ad} />
              </StyledTableCell>
            </WhiteStyledTableRow>
          ))
        ) : (
          <LoadingBody count={8} />
        )}
      </TableBody>
    </PrimaryTable>
  );
};

export default AdsTable;

