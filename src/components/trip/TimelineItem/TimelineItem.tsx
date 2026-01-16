import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { formatDateTime } from "../../../utils/dateFormat";

interface TimelineItemProps {
  label: string;
  date: string | null | undefined;
  variant?: "accepted" | "started" | "completed" | "cancelled" | "default";
}

const TimelineItem = ({ label, date, variant = "default" }: TimelineItemProps) => {
  if (!date) return null;

  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    accepted: { bg: "bg-blue-50", border: "border-blue-500", text: "text-blue-700" },
    started: { bg: "bg-purple-50", border: "border-purple-500", text: "text-purple-700" },
    completed: { bg: "bg-green-50", border: "border-green-500", text: "text-green-700" },
    cancelled: { bg: "bg-red-50", border: "border-red-500", text: "text-red-700" },
    default: { bg: "bg-gray-50", border: "border-gray-500", text: "text-gray-700" },
  };

  const colors = colorMap[variant] || colorMap.default;

  return (
    <Box className={`p-4 rounded-xl ${colors.bg} border-l-4 ${colors.border}`}>
      <Typography variant="caption" className={`!${colors.text} !block !mb-1 !font-semibold`}>
        {label}
      </Typography>
      <Typography variant="body1" className="!font-semibold !text-gray-900">
        {formatDateTime(date)}
      </Typography>
    </Box>
  );
};

export default TimelineItem;

