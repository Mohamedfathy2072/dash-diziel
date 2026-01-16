import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../BreadCrumb/BreadCrumb";
import ArrowLeft from "../../../icons/ArrowLeft";
import { BasicButton } from "../../../mui/buttons/BasicButton";
import type { PageHeaderProps } from "../../../types/components";

const PageHeader = ({
  title,
  subtitle,
  backUrl,
  actions,
}: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <Box className="flex flex-col gap-4">
      <BreadCrumb />
      <Box className="flex justify-between items-center gap-4 flex-wrap">
        <Box className="flex items-center gap-3">
          {backUrl && (
            <BasicButton
              onClick={() => navigate(backUrl)}
              className="!min-w-0 !p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </BasicButton>
          )}
          <Typography variant="h4" className="!font-[700]">
            {title}
          </Typography>
        </Box>
        {actions && (
          <Box className="flex gap-3">
            {actions}
          </Box>
        )}
      </Box>
      {subtitle && (
        <Typography variant="body1" className="!text-gray-600">
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageHeader;

