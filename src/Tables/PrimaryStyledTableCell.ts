import { styled, tableCellClasses } from "@mui/material";
import { StyledTableCell } from "./StyledTableCell";

export const PrimaryStyledTableCell = styled(StyledTableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#5A46E6",
    color: "#fff",
  }
}));
