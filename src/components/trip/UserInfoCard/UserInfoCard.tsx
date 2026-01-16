import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import InfoField from "../../common/InfoField/InfoField";
import { getAvatarUrl } from "../../../utils/avatarUtils";
import type { ReactNode } from "react";

interface UserInfoCardProps {
  photoUrl?: string | null;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  onClick?: () => void;
  className?: string;
  children?: ReactNode;
}

const UserInfoCard = ({
  photoUrl,
  name,
  email,
  phone,
  address,
  onClick,
  className = "",
  children,
}: UserInfoCardProps) => {
  const cardClasses = onClick
    ? "cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-all duration-200 hover:shadow-md"
    : "p-4 rounded-lg";

  const avatarInitial = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <Box className={`${cardClasses} ${className}`} onClick={onClick}>
      <Box className="flex items-center gap-4 mb-4">
        <Avatar
          src={getAvatarUrl(photoUrl)}
          alt={name}
          sx={{ width: 64, height: 64 }}
          className="!border-2 !border-white !shadow-lg hover:!shadow-xl transition-shadow"
        >
          {avatarInitial}
        </Avatar>
        <Box className="flex-1">
          <Typography variant="h6" className="!font-[600] hover:underline">
            {name}
          </Typography>
          {email && (
            <Typography variant="body2" className="!text-gray-500">
              {email}
            </Typography>
          )}
        </Box>
      </Box>
      {(phone || address) && (
        <>
          {phone && <Divider className="!my-4" />}
          <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
            {phone && <InfoField label="Phone" value={phone} />}
            {address && (
              <InfoField label="Address" value={address} className="col-span-full" />
            )}
          </Box>
        </>
      )}
      {children}
    </Box>
  );
};

export default UserInfoCard;

