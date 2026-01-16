import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface QuickInfoCardProps {
  label: string;
  value: string | number | React.ReactNode;
  className?: string;
}

const QuickInfoCard = ({ label, value, className = "" }: QuickInfoCardProps) => {
  return (
    <Box className={`p-4 bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      <Typography variant="caption" className="!text-gray-500 !block !mb-2 !font-medium">
        {label}
      </Typography>
      {typeof value === "string" || typeof value === "number" ? (
        <Typography variant="body1" className="!font-semibold !text-gray-900 !capitalize">
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  );
};

export default QuickInfoCard;

