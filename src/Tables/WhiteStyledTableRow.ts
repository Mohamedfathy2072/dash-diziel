import { styled } from "@mui/material";
import { StyledTableRow } from "./StyledTableRow";

export const WhiteStyledTableRow = styled(StyledTableRow)(() => ({
  "&:nth-of-type(even)": {
    backgroundColor: "#fff",
    color: "rgba(46, 46, 46, 1)",
    padding: "10px 12px",
  }
}));
