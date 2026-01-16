import { styled, TableCell, tableCellClasses } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#FAFAFA",
    color: "#838383",
    padding: "10px 12px",
    fontWeight: "700",
    fontSize: "14px",
    whiteSpace: "nowrap"
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: "14px",
  },
  [theme.breakpoints.down("lg")]: {
    [`&.${tableCellClasses.head}`]: {
      padding: "9px 10px",
      fontSize: "13px",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: "13px",
    },
  },
  [theme.breakpoints.down("md")]: {
    [`&.${tableCellClasses.head}`]: {
      padding: "8px 10px",
      fontSize: "12px",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: "12px",
    },
  }
}));