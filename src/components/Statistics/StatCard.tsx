import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  gradient?: string;
  iconBg?: string;
  iconColor?: string;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({
  title,
  value,
  icon,
  gradient = "from-blue-50 to-blue-100/50",
  iconBg = "bg-blue-500/20",
  iconColor = "text-blue-600",
  subtitle,
  trend,
}: StatCardProps) => {
  return (
    <Box
      className={`relative p-6 rounded-3xl bg-gradient-to-br ${gradient} border border-gray-200/50 hover:shadow-2xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group w-full`}
    >
      {/* Background decoration */}
      <Box className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></Box>
      <Box className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full -ml-12 -mb-12 group-hover:scale-150 transition-transform duration-500"></Box>
      
      <Box className="relative flex items-start justify-between mb-4">
        <Box className="flex-1 z-10">
          <Typography
            variant="caption"
            className="!text-gray-600 !font-[600] !block !mb-3 !uppercase !tracking-wide"
          >
            {title}
          </Typography>
          <Typography
            variant="h3"
            className="!font-[800] !text-gray-900 !mb-2 !bg-gradient-to-r !from-gray-900 !to-gray-700 !bg-clip-text !text-transparent"
          >
            {typeof value === "number" ? value.toLocaleString() : value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" className="!text-gray-500 !font-[500] !block">
              {subtitle}
            </Typography>
          )}
          {trend && (
            <Box className="flex items-center gap-1 mt-3">
              <Typography
                variant="caption"
                className={`!font-[700] !text-sm ${
                  trend.isPositive ? "!text-green-600" : "!text-red-600"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </Typography>
            </Box>
          )}
        </Box>
        {icon && (
          <Box
            className={`relative w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center ${iconColor} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 z-10`}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StatCard;

