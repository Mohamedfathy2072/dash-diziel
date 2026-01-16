import { CircularProgress } from "@mui/material";
import { BasicButton } from "../../mui/buttons/BasicButton";
import { ErrorButton } from "../../mui/buttons/ErrorButton";
import { GradientButton } from "../../mui/buttons/GradientButton";
import { PrimaryButton } from "../../mui/buttons/PrimaryButton";
import { SecondaryButton } from "../../mui/buttons/SecondaryButton";
import type { SubmitButtonTypes } from "../../types/components";

const SubmitButton = ({
    loading,
    children,
    handling,
    className,
    variant,
    type,
    disabled,
    id
}: SubmitButtonTypes) => {
    const loadingIcon = (
        <CircularProgress sx={{ color: (theme) => variant === "error" ? theme.palette.error.main : (variant === "secondary" || variant === "basic") ? theme.palette.primary.main : theme.palette.common.white }} />
    );

    const props = {
        title: "Submit Form",
        loadingPosition: "center" as const,
        loading: loading,
        loadingIndicator: loadingIcon,
        type: type || ("submit" as const),
        onClick: handling,
        className: className,
        disabled: disabled,
        id: id
    };

    const chosenButton =
        variant === "gradient" ? (
            <GradientButton {...props}>{children}</GradientButton>
        ) : variant === "secondary" ? (
            <SecondaryButton {...props}>{children}</SecondaryButton>
        ) : variant === "error" ? (
            <ErrorButton {...props}>{children}</ErrorButton>
        ) : variant === "basic" ? (
            <BasicButton {...props}>{children}</BasicButton>
        ) : (
            <PrimaryButton {...props}>{children}</PrimaryButton>
        );

    return chosenButton;
};

export default SubmitButton;
