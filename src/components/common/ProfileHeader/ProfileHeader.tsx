import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { getAvatarUrl } from "../../../utils/avatarUtils";
import defaultAvatar from "../../../assets/images/default_employee_male_avatar.webp";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";

interface ProfileHeaderProps {
  photoUrl?: string | null;
  name: string;
  subtitle?: string | ReactNode;
  status?: string;
  statusLabel?: string;
  statusColor?: string;
  availabilityStatus?: string | null;
  availabilityStatusDotColor?: string;
  actions?: ReactNode;
  avatarSize?: number;
  variant?: "default" | "gradient" | "driver";
  // Driver-specific optional props
  rating?: number | string | null;
  totalTrips?: number | null;
  showDriverStats?: boolean;
}

const ProfileHeader = ({
  photoUrl,
  name,
  subtitle,
  status,
  statusLabel,
  statusColor,
  availabilityStatus,
  availabilityStatusDotColor,
  actions,
  avatarSize = 96,
  variant = "default",
  rating,
  totalTrips,
  showDriverStats = false,
}: ProfileHeaderProps) => {
  const avatarInitial = name?.charAt(0)?.toUpperCase() || "?";
  const [avatarError, setAvatarError] = useState(false);
  
  // Reset error state when photoUrl changes
  useEffect(() => {
    setAvatarError(false);
  }, [photoUrl]);
  
  // Handle image load errors to prevent CORB issues
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    // Use local defaultAvatar path directly, not through getAvatarUrl
    if (target.src !== defaultAvatar && !avatarError) {
      setAvatarError(true);
      target.src = defaultAvatar;
    }
  };
  
  // Get avatar URL, use default if there was an error
  // Use local defaultAvatar directly instead of getAvatarUrl(null) to avoid CORS issues
  const currentAvatarUrl = avatarError ? defaultAvatar : getAvatarUrl(photoUrl);

  if (variant === "driver") {
    return (
      <Card className="!shadow-none">
        <CardContent className="!p-0">
          <Box className="bg-gradient-to-r from-[#003366] to-[#003366]/80 p-8 pb-8">
            <Box className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Box className="relative flex-shrink-0">
                <Avatar
                  src={currentAvatarUrl}
                  alt={name}
                  sx={{ width: avatarSize + 24, height: avatarSize + 24 }}
                  className="!border-4 !border-white !shadow-lg hover:!shadow-xl transition-shadow"
                  imgProps={{
                    onError: handleImageError,
                    crossOrigin: 'anonymous',
                  }}
                >
                  {avatarInitial}
                </Avatar>
                {availabilityStatus && availabilityStatusDotColor && (
                  <Box
                    className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-white shadow-md ${availabilityStatusDotColor} transition-all hover:scale-110`}
                    title={availabilityStatus}
                    sx={{ borderWidth: '3px', borderStyle: 'solid' }}
                  />
                )}
              </Box>
              <Box className="flex-1 text-center md:text-left">
                <Box className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                  <Typography variant="h4" className="!font-[700] !text-white">
                    {name}
                  </Typography>
                  <Box className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
                    {status && statusLabel && (
                      <Chip
                        label={statusLabel}
                        className={`!capitalize ${statusColor || ""} !border`}
                        size="small"
                      />
                    )}
                    {showDriverStats && rating !== null && rating !== undefined && (
                      <Chip
                        label={`${typeof rating === 'number' ? rating.toFixed(1) : Number(rating).toFixed(1)} ⭐`}
                        className="!text-xs !font-[600] !bg-white/20 !text-white !border-white/30 !border backdrop-blur-sm"
                        size="small"
                      />
                    )}
                    {showDriverStats && totalTrips !== null && totalTrips !== undefined && (
                      <Chip
                        label={`${totalTrips} ${totalTrips === 1 ? 'Trip' : 'Trips'}`}
                        className="!text-xs !font-[600] !bg-white/20 !text-white !border-white/30 !border backdrop-blur-sm"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>
                {subtitle && (
                  typeof subtitle === "string" ? (
                    <Typography variant="body2" className="!text-white/90 !mb-2">
                      {subtitle}
                    </Typography>
                  ) : (
                    subtitle
                  )
                )}
                {availabilityStatus && (
                  <Box className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <Box
                      className={`w-2.5 h-2.5 rounded-full ${availabilityStatusDotColor || 'bg-gray-400'} shadow-sm`}
                    />
                    <Typography variant="caption" className="!text-white/80 !capitalize !font-[500]">
                      {availabilityStatus}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          {actions && (
            <Box className="p-8 -mt-6">
              <Box className="flex justify-end gap-3">{actions}</Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === "gradient") {
    return (
      <Card className="!shadow-none">
        <CardContent className="!p-0">
          <Box className="bg-gradient-to-r from-[#003366] to-[#003366]/80 p-8 pb-12">
            <Box className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <Box className="relative flex-shrink-0">
                <Avatar
                  src={currentAvatarUrl}
                  alt={name}
                  sx={{ width: avatarSize + 24, height: avatarSize + 24 }}
                  className="!border-4 !border-white !shadow-lg hover:!shadow-xl transition-shadow"
                  imgProps={{
                    onError: handleImageError,
                    crossOrigin: 'anonymous',
                  }}
                >
                  {avatarInitial}
                </Avatar>
                {availabilityStatus && availabilityStatusDotColor && (
                  <Box
                    className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full border-white shadow-md ${availabilityStatusDotColor} transition-all hover:scale-110`}
                    title={availabilityStatus}
                    sx={{ borderWidth: '3px', borderStyle: 'solid' }}
                  />
                )}
              </Box>
              <Box className="flex-1 text-center md:text-left">
                <Box className="flex flex-col md:flex-row md:items-center gap-3 mb-3">
                  <Typography variant="h4" className="!font-[700] !text-white">
                    {name}
                  </Typography>
                  {status && statusLabel && (
                    <Chip
                      label={statusLabel}
                      className={`!capitalize ${statusColor || ""} !border`}
                      size="small"
                    />
                  )}
                </Box>
                {subtitle && (
                  typeof subtitle === "string" ? (
                    <Typography variant="body2" className="!text-white/90">
                      {subtitle}
                    </Typography>
                  ) : (
                    subtitle
                  )
                )}
              </Box>
            </Box>
          </Box>
          {actions && (
            <Box className="p-8 -mt-6">
              <Box className="flex justify-end gap-3">{actions}</Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="!shadow-lg !rounded-2xl !overflow-hidden !bg-white">
      <CardContent className="!p-6 md:!p-8">
        <Box className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Box className="relative flex-shrink-0">
            <Avatar
              src={currentAvatarUrl}
              alt={name}
              className="!w-24 !h-24 md:!w-28 md:!h-28 !border-4 !border-white !shadow-lg hover:!shadow-xl transition-shadow"
              sx={{ width: avatarSize, height: avatarSize }}
              imgProps={{
                onError: handleImageError,
                crossOrigin: 'anonymous',
              }}
            >
              {avatarInitial}
            </Avatar>
            {availabilityStatus && availabilityStatusDotColor && (
              <Box
                className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full border-white shadow-md ${availabilityStatusDotColor} transition-all hover:scale-110`}
                title={availabilityStatus}
                sx={{ borderWidth: '3px', borderStyle: 'solid' }}
              />
            )}
          </Box>
          <Box className="flex-1 w-full min-w-0">
            <Box className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
              <Typography variant="h5" className="!font-[700] !text-gray-900 !text-xl md:!text-2xl">
                {name}
              </Typography>
              <Box className="flex items-center gap-2 flex-wrap">
                {status && statusLabel && (
                  <Chip
                    label={statusLabel}
                    className={`!text-xs !font-[600] !border !px-2 ${statusColor || ""}`}
                    size="small"
                  />
                )}
                {showDriverStats && rating !== null && rating !== undefined && (
                  <Chip
                    label={`${typeof rating === 'number' ? rating.toFixed(1) : Number(rating).toFixed(1)} ⭐`}
                    className="!text-xs !font-[600] !bg-amber-50 !text-amber-700 !border-amber-200 !border"
                    size="small"
                  />
                )}
                {showDriverStats && totalTrips !== null && totalTrips !== undefined && (
                  <Chip
                    label={`${totalTrips} ${totalTrips === 1 ? 'Trip' : 'Trips'}`}
                    className="!text-xs !font-[600] !bg-blue-50 !text-blue-700 !border-blue-200 !border"
                    size="small"
                  />
                )}
              </Box>
            </Box>
            {subtitle && (
              typeof subtitle === "string" ? (
                <Typography variant="body2" className="!text-gray-600 !text-sm md:!text-base">
                  {subtitle}
                </Typography>
              ) : (
                subtitle
              )
            )}
            {availabilityStatus && !showDriverStats && (
              <Box className="mt-2 flex items-center gap-2">
                <Box
                  className={`w-2.5 h-2.5 rounded-full ${availabilityStatusDotColor || 'bg-gray-400'}`}
                />
                <Typography variant="caption" className="!text-gray-500 !capitalize">
                  {availabilityStatus}
                </Typography>
              </Box>
            )}
          </Box>
          {actions && (
            <Box className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-4 md:mt-0">
              {actions}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileHeader;

