import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export const PrimaryButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main,
  borderRadius: "8px",
  padding: "4px 16px !important",
  boxShadow: "none",
  borderWidth: "2px",
  borderStyle: "solid",
  borderColor: theme.palette.primary.main,
  height: "fit-content",
  fontWeight: "600",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  "& > span ": {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "5px",
  },
  "& > span > span": {
    height: "20px !important",
    width: "20px !important",
  },
  "& > span > span > span": {
    width: "20px !important",
    height: "20px !important",
  },
  "& svg": {
    fontSize: "16px",
  },
  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
  },
}));
