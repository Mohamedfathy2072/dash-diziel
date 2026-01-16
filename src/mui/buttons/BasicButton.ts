import { styled } from "@mui/material/styles";
import { PrimaryButton } from "./PrimaryButton";

export const BasicButton = styled(PrimaryButton)(() => ({
  color: "#82808D",
  backgroundColor: "#fff",
  borderColor: "#EEEEEE",
  "&:hover": {
    backgroundColor: "#5a46e6",
    borderColor: "#5a46e6",
    color: "#fff",
  }
}));
