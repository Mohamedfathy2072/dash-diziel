import { styled } from "@mui/material/styles";
import { PrimaryButton } from "./PrimaryButton";

export const GradientButton = styled(PrimaryButton)(() => ({
  color: "#fff",
  border: "none",
  padding: "6px 14px !important",
  backgroundImage: "linear-gradient(90deg,#003355 20% ,#003366 100%)",
  "&:hover": {
    backgroundImage: "linear-gradient(90deg,#003366 20% ,#003355 100%)",
    color: "#fff !important",
  },
}));
