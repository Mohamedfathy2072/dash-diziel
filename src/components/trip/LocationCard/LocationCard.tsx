import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LocationIcon from "../../../icons/LocationIcon";
import { formatDateTime } from "../../../utils/dateFormat";

interface LocationCardProps {
  title: string;
  address: string;
  date?: string | null;
  lat?: number | string | null;
  lng?: number | string | null;
  variant?: "pickup" | "destination";
}

const LocationCard = ({ title, address, date, lat, lng, variant = "pickup" }: LocationCardProps) => {
  const isPickup = variant === "pickup";
  const bgGradient = isPickup
    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200"
    : "bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200";
  const iconBg = isPickup ? "bg-green-500" : "bg-red-500";
  const textColor = isPickup ? "text-green-900" : "text-red-900";
  const dateColor = isPickup ? "text-green-700" : "text-red-700";

  return (
    <Box className={`p-5 rounded-xl ${bgGradient}`}>
      <Box className="flex items-start gap-3 mb-4">
        <Box className={`p-2 ${iconBg} rounded-lg`}>
          <LocationIcon className="w-5 h-5 text-white" />
        </Box>
        <Box className="flex-1">
          <Typography variant="h6" className={`!font-bold !mb-1 ${textColor}`}>
            {title}
          </Typography>
          {date && (
            <Typography variant="caption" className={dateColor}>
              {formatDateTime(date)}
            </Typography>
          )}
        </Box>
      </Box>
      <Typography variant="body1" className="!font-semibold !text-gray-900 !mb-3">
        {address}
      </Typography>
      {lat && lng && (
        <Box className="flex gap-4 text-sm text-gray-600">
          <Typography variant="caption">
            <span className="font-medium">Lat:</span> {(Number(lat) || 0).toFixed(6)}
          </Typography>
          <Typography variant="caption">
            <span className="font-medium">Lng:</span> {(Number(lng) || 0).toFixed(6)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LocationCard;

