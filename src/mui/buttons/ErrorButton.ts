import { styled } from "@mui/material/styles";
import { PrimaryButton } from "./PrimaryButton";

export const ErrorButton = styled(PrimaryButton)(() => ({
  color: "#FF2828",
  backgroundColor: "transparent",
  borderColor: "#FF2828",
  borderWidth: "2px",
  borderStyle: "solid",
  "&:hover": {
    backgroundColor: "#FF2828",
    color: "#fff",
  }
}));
