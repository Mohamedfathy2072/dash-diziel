import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import { formatDateTime, formatDate, formatTime } from "../../../utils/dateFormat";
import { formatPrice } from "../../../utils/priceFormat";
import { getAvatarUrl } from "../../../utils/avatarUtils";
import type { TripOffer } from "../../../types/domain";

interface TripOfferCardProps {
  offer: TripOffer;
  basePrice?: number | string | null;
  onDriverClick?: (driverId?: number) => void;
  onVehicleClick?: (vehicleId?: number) => void;
  getOfferStatusColor: (status: string) => string;
  getOfferStatusLabel: (status: string) => string;
  t: (key: string, options?: { defaultValue?: string }) => string;
}

const TripOfferCard = ({
  offer,
  basePrice,
  onDriverClick,
  onVehicleClick,
  getOfferStatusColor,
  getOfferStatusLabel,
  t,
}: TripOfferCardProps) => {
  const isAccepted = offer.status === "accepted";

  return (
    <Box
      className="p-5 rounded-xl border-2 transition-all hover:shadow-lg"
      sx={{
        borderColor: isAccepted ? "rgb(34, 197, 94)" : "rgb(229, 231, 235)",
        backgroundColor: isAccepted ? "rgba(34, 197, 94, 0.05)" : "white",
      }}
    >
      {/* Offer Header */}
      <Box className="flex items-start justify-between mb-4">
        <Box className="flex-1">
          <Box className="flex items-center gap-3 mb-2">
            <Chip
              label={getOfferStatusLabel(offer.status)}
              className={`${getOfferStatusColor(offer.status)} !font-semibold !px-3 !py-1`}
              size="small"
            />
            <Typography variant="caption" className="!text-gray-500">
              {formatDate(offer.created_at)} {formatTime(offer.created_at)}
            </Typography>
          </Box>
          <Typography variant="h6" className="!font-bold !text-green-600 !mt-2">
            {formatPrice(offer.offered_price)}
          </Typography>
          {basePrice && (
            <Typography variant="caption" className="!text-gray-500">
              {t("base_price")}: {formatPrice(basePrice)}
            </Typography>
          )}
        </Box>
      </Box>

      <Divider className="!my-4" />

      {/* Driver Information */}
      {offer.driver?.user && (
        <Box
          className="mb-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
          onClick={() => onDriverClick?.(offer.driver?.id)}
        >
          <Typography variant="caption" className="!text-gray-500 !block !mb-2 !font-medium">
            {t("driver")}
          </Typography>
          <Box className="flex items-center gap-3">
            <Avatar
              src={getAvatarUrl(offer.driver.user.photo_url)}
              alt={offer.driver.user.name || ""}
              sx={{ width: 40, height: 40 }}
              className="!border-2 !border-white !shadow-md hover:!shadow-lg transition-shadow"
            >
              {offer.driver.user.name?.charAt(0)?.toUpperCase() || "?"}
            </Avatar>
            <Box className="flex-1">
              <Typography variant="body2" className="!font-semibold hover:!text-blue-600 transition-colors">
                {offer.driver.user.name}
              </Typography>
              <Typography variant="caption" className="!text-gray-500">
                {offer.driver.user.email}
              </Typography>
              <Box className="flex items-center gap-2 mt-1">
                {offer.driver.rating && (
                  <Typography variant="caption" className="!text-yellow-600">
                    ⭐ {Number(offer.driver.rating).toFixed(1)}
                  </Typography>
                )}
                {offer.driver.total_rides !== undefined && (
                  <Typography variant="caption" className="!text-gray-500">
                    • {offer.driver.total_rides} {t("rides", { defaultValue: "rides" })}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Vehicle Information */}
      {offer.vehicle && (
        <Box
          className="mb-4 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors"
          onClick={() => onVehicleClick?.(offer.vehicle?.id)}
        >
          <Typography variant="caption" className="!text-gray-500 !block !mb-2 !font-medium">
            {t("vehicle")}
          </Typography>
          <Typography variant="body2" className="!font-semibold hover:!text-blue-600 transition-colors">
            {offer.vehicle.make} {offer.vehicle.model}
            {offer.vehicle.year && ` (${offer.vehicle.year})`}
          </Typography>
          <Box className="flex items-center gap-4 mt-2">
            {offer.vehicle.license_plate && (
              <Typography variant="caption" className="!text-gray-600">
                {t("license_plate")}: {offer.vehicle.license_plate}
              </Typography>
            )}
            {offer.vehicle.color && (
              <Typography variant="caption" className="!text-gray-600">
                {t("color")}: {offer.vehicle.color}
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Notes */}
      {offer.notes && (
        <>
          <Divider className="!my-4" />
          <Box className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <Typography variant="caption" className="!text-yellow-800 !block !mb-1 !font-semibold">
              {t("notes")}
            </Typography>
            <Typography variant="body2" className="!text-gray-900 whitespace-pre-wrap">
              {offer.notes}
            </Typography>
          </Box>
        </>
      )}

      {/* Offer Timestamps */}
      {(offer.accepted_at || offer.rejected_at) && (
        <>
          <Divider className="!my-4" />
          <Box className="flex gap-4 text-sm">
            {offer.accepted_at && (
              <Typography variant="caption" className="!text-green-700">
                {t("accepted_at")}: {formatDateTime(offer.accepted_at)}
              </Typography>
            )}
            {offer.rejected_at && (
              <Typography variant="caption" className="!text-red-700">
                {t("rejected_at")}: {formatDateTime(offer.rejected_at)}
              </Typography>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default TripOfferCard;

