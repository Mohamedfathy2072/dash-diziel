import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import type { FormSectionProps } from "../../../types/components";

const FormSection = ({ title, icon, children, className }: FormSectionProps) => {
  return (
    <Paper className={`paper ${className || ""}`}>
      <Box className="grid justify-stretch items-center gap-6">
        <Box className="flex items-center gap-2 pb-2 border-b border-gray-200">
          {icon && <Box className="w-5 h-5">{icon}</Box>}
          <Typography variant="h6" className="!font-[700] !text-[#003366]">
            {title}
          </Typography>
        </Box>
        {children}
      </Box>
    </Paper>
  );
};

export default FormSection;

