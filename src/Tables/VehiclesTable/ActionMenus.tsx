import { useState } from "react";
import EntityActionMenu from "../../components/tables/EntityActionMenu";
import TableIconButton from "../../components/TableIconButton/TableIconButton";
import CheckCircleIcon from "../../icons/CheckCircleIcon";
import VehicleVerificationModal from "../../components/common/VehicleVerificationModal/VehicleVerificationModal";
import type { Vehicle } from "../../types/domain";
import useAuth from "../../hooks/useAuth";

const ActionMenus = ({ vehicle }: { vehicle: Vehicle }) => {
  const { isSuperAdmin } = useAuth();
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

  const handleVerify = () => {
    setVerificationModalOpen(true);
  };

  const verifyButton = isSuperAdmin() ? (
    <TableIconButton
      onClick={handleVerify}
      className={`!bg-purple-100 !text-purple-600`}
    >
      <CheckCircleIcon className={`w-[20px] h-[20px] md:w-[18px] md:h-[18px] xs:w-[15px] xs:h-[15px]`} />
    </TableIconButton>
  ) : null;

  return (
    <>
      <EntityActionMenu
        entity={vehicle}
        editRoute={(id) => `${import.meta.env.VITE_VEHICLES_ROUTE}/edit/${id}`}
        deleteType="deleteVehicle"
        deleteIdKey="vehicleId"
        viewRoute={(id) => `${import.meta.env.VITE_VEHICLES_ROUTE}/${id}`}
        showView={true}
        additionalActions={verifyButton}
      />
      <VehicleVerificationModal
        open={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        vehicleId={vehicle.id}
        currentStatus={vehicle.verification_status}
      />
    </>
  );
};

export default ActionMenus;
