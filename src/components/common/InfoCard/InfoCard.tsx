import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { InfoCardProps } from "../../../types/components";

const InfoCard = ({ icon, label, value, className }: InfoCardProps) => {
  if (!value) return null;

  return (
    <Box
      className={`flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border border-gray-200 hover:shadow-md transition-shadow ${className || ""}`}
    >
      <Box className="p-2 rounded-lg bg-[#003366]/10">
        {icon}
      </Box>
      <Box className="flex-1">
        <Typography variant="caption" className="!text-gray-500 !block !mb-1 !font-[500]">
          {label}
        </Typography>
        <Typography variant="body1" className="!font-[600] !text-gray-900">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

export default InfoCard;

