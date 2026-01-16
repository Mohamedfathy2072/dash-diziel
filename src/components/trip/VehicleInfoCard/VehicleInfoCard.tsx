import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InfoField from "../../common/InfoField/InfoField";
import { getVehicleTypeName } from "../../../utils/vehicleTypes";
import type { VehicleType } from "../../../types/domain";

interface VehicleInfoCardProps {
  make: string;
  model: string;
  year?: number | string | null;
  color?: string | null;
  licensePlate?: string | null;
  vehicleType?: string | number | object | null;
  vehicleTypeId?: number | null;
  activeVehicleTypes?: VehicleType[];
  onClick?: () => void;
  className?: string;
}

const VehicleInfoCard = ({
  make,
  model,
  year,
  color,
  licensePlate,
  vehicleType,
  vehicleTypeId,
  activeVehicleTypes = [],
  onClick,
  className = "",
}: VehicleInfoCardProps) => {
  const cardClasses = onClick
    ? "cursor-pointer hover:bg-gray-50 p-4 rounded-lg transition-colors"
    : "p-4 rounded-lg";

  return (
    <Box className={`${cardClasses} ${className}`} onClick={onClick}>
      <Typography variant="h6" className="!font-[600] hover:underline mb-4">
        {make} {model}
      </Typography>
      <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
        <InfoField
          label="Vehicle Type"
          value={getVehicleTypeName(
            (typeof vehicleType === 'object' && vehicleType !== null ? null : vehicleType) || vehicleTypeId,
            activeVehicleTypes
          )}
        />
        {year && <InfoField label="Year" value={year.toString()} />}
        {color && <InfoField label="Color" value={color} />}
        {licensePlate && <InfoField label="License Plate" value={licensePlate} />}
      </Box>
    </Box>
  );
};

export default VehicleInfoCard;

