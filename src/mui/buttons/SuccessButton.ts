import { styled } from "@mui/material/styles";
import { PrimaryButton } from "./PrimaryButton";

export const SuccessButton = styled(PrimaryButton)(() => ({
  color: "#fff",
  backgroundColor: "#1EC940",
  borderColor: "#1EC940",
  borderWidth: "2px",
  borderStyle: "solid",
  "&:hover": {
    backgroundColor: "#fff !important",
    color: "#1EC940",
  }
}));
