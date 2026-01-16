import { Select, styled } from "@mui/material";

export const PrimarySelect = styled(Select)(({ theme }) => ({
    minWidth: "auto !important",
    width: "100% !important",
    "& > div": {
        backgroundColor: "#fff",
        padding: "12px 16px !important",
    },
    "& input , & select": {
        fontSize: "14px",
        backgroundColor: theme.palette.common.white,
        boxShadow: "none",
        border: "none !important",
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
        fontSize: "20px",
    },
    "& input:not(:placeholder-shown)": {
        fontWeight: "600",
    },
    [theme.breakpoints.down("lg")]: {
        "& input , & select": {
            padding: "9px !important",
            fontSize: "13px",
        },
        "& label": {
            lineHeight: "0.7 !important",
            fontSize: "13px",
        },
        "& svg": {
            fontSize: "18px",
        },
    },
    [theme.breakpoints.down("md")]: {
        "& input , & select": {
            padding: "8px !important",
            fontSize: "12px",
            borderRadius: "8px",
        },
        "& label": {
            top: "-3px",
            lineHeight: "0.7 !important",
            fontSize: "12px",
        },
        "& svg": {
            fontSize: "16px",
        },
    },
    [theme.breakpoints.down("sm")]: {
        "& input , & select": {
            fontSize: "11px",
            borderRadius: "6px",
        },
        "& label": {
            top: "-3px",
            lineHeight: "0.7 !important",
            fontSize: "12px",
        },
        "& svg": {
            fontSize: "15px",
        },
    },
    [theme.breakpoints.down("xs")]: {
        "& input , & select": {
            fontSize: "11px",
        },
        "& label": {
            top: "-4px",
            lineHeight: "0.8 !important",
            fontSize: "11px",
        },
        "& svg": {
            fontSize: "12px",
        },
    },
    "& select": {
        title: "Select an option",
    },
}));
