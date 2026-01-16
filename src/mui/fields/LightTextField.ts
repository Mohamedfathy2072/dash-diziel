import { styled } from "@mui/material";
import { PrimaryTextField } from "./PrimaryTextField";

export const LightTextField = styled(PrimaryTextField)(() => ({
  "& input::focus , & select::focus": {
    border: "none !important",
  },
  "& fieldset": {
    outline: "none",
    border: "none !important",
  },
}));
