import { TextField, styled } from "@mui/material";

export const PrimaryTextField = styled(TextField)(({ theme }) => ({
  minWidth: "auto !important",
  padding: "0px !important",
  width: "100% !important",
  "& > div": {
    padding: "0px !important",
    backgroundColor: "#fff"
  },
  "& input , & select": {
    padding: "12px 16px !important",
    fontSize: "14px",
    backgroundColor: theme.palette.common.white,
    boxShadow: "none",
    border: "none !important",
    borderRadius: "4px !important",
    width: "100% !important",
  },
  "& input::focus , & select::focus": {
    outline: "none",
    backgroundColor: "#fff",
  },
  "& input:-internal-autofill-selected": {
    backgroundColor: "#fff",
  },
  "& label": {
    fontSize: "14px",
    lineHeight: "1.1 !important",
  },
  "& label[data-shrink=true]": {
    lineHeight: "1.4375em !important",
    backgroundColor: "#fff",
  },
  "& svg": {
    fontSize: "32px",
    padding: "0px 6px"
  },
  "& input:not(:placeholder-shown)": {
    fontWeight: "600",
  },
  [theme.breakpoints.down("lg")]: {
    "& input , & select": {
      padding: "10px 14px !important",
      fontSize: "13px",
    },
    "& label": {
      lineHeight: "0.7 !important",
      fontSize: "13px",
    },
    "& svg": {
      fontSize: "30px",
      padding: "0px 5px"
    },
  },
  [theme.breakpoints.down("md")]: {
    "& input , & select": {
      padding: "9px 12px !important",
      fontSize: "12px",
      borderRadius: "3px",
    },
    "& label": {
      top: "-3px",
      lineHeight: "0.7 !important",
      fontSize: "12px",
    },
    "& svg": {
      fontSize: "26px",
      padding: "0px 4px"
    },
  },
  [theme.breakpoints.down("sm")]: {
    "& input , & select": {
      padding: "9px 10px !important",
      fontSize: "11px",
      borderRadius: "2px",
    },
    "& label": {
      top: "-3px",
      lineHeight: "0.7 !important",
      fontSize: "12px",
    },
    "& svg": {
      fontSize: "22px",
      padding: "0px 4px"
    },
  },
  [theme.breakpoints.down("xs")]: {
    "& input , & select": {
      padding: "8px !important",
      fontSize: "11px",
      borderRadius: "1px",
    },
    "& label": {
      top: "-4px",
      lineHeight: "0.8 !important",
      fontSize: "11px",
    },
    "& svg": {
      fontSize: "18px",
      padding: "0px 2px"
    },
  },
  "& select": {
    title: "Select an option",
  },
}));
