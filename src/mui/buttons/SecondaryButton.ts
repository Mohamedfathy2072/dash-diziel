import { styled } from "@mui/material/styles";
import { PrimaryButton } from "./PrimaryButton";

export const SecondaryButton = styled(PrimaryButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: "transparent",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
  },
}));
