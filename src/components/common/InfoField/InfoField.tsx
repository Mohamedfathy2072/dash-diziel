import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { InfoFieldProps } from "../../../types/components";

const InfoField = ({ label, value, className }: InfoFieldProps) => {
  if (!value) return null;

  return (
    <Box className={`p-4 rounded-xl bg-gray-50 border border-gray-200 ${className || ""}`}>
      <Typography variant="caption" className="!text-gray-500 !block !mb-2 !font-[500]">
        {label}
      </Typography>
      {typeof value === 'string' ? (
        <Typography variant="body1" className="!font-[600] !text-gray-900">
          {value}
        </Typography>
      ) : (
        <Box>{value}</Box>
      )}
    </Box>
  );
};

export default InfoField;

