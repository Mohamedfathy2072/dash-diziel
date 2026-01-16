import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { BasicButton } from "../../../mui/buttons/BasicButton";

interface ErrorStateProps {
  error?: string | null;
  message?: string;
  onBack?: () => void;
  backLabel?: string;
  minHeight?: string;
  className?: string;
}

const ErrorState = ({
  error,
  message,
  onBack,
  backLabel = "Back",
  minHeight = "min-h-[400px]",
  className,
}: ErrorStateProps) => {
  const { t } = useTranslation("common");
  const displayMessage = error || message || t("somethingWentWrong", { defaultValue: "Something went wrong" });
  
  // Log error to console for debugging
  if (error) {
    console.error('ErrorState - Error:', error);
  }

  return (
    <Box className={`flex flex-col justify-center items-center ${minHeight} gap-4 ${className || ""}`}>
      <Typography variant="h6" className="!text-red-600 !text-center !px-4">
        {displayMessage}
      </Typography>
      {error && (
        <Typography variant="body2" className="!text-gray-500 !text-center !px-4 !max-w-md">
          {t("errorDetails", { defaultValue: "Please check the browser console for more details." })}
        </Typography>
      )}
      {onBack && (
        <BasicButton onClick={onBack}>
          {backLabel}
        </BasicButton>
      )}
    </Box>
  );
};

export default ErrorState;

