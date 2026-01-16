import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { GradientButton } from "../mui/buttons/GradientButton";
import CheckCircleIcon from "../icons/CheckCircleIcon";
import PageHeader from "../components/common/PageHeader/PageHeader";
import SectionHeader from "../components/common/SectionHeader/SectionHeader";
import InfoField from "../components/common/InfoField/InfoField";
import DetailPageWrapper from "../components/pages/DetailPageWrapper";
import DetailPageActions from "../components/common/DetailPageActions/DetailPageActions";
import VehicleVerificationModal from "../components/common/VehicleVerificationModal/VehicleVerificationModal";
import useDetailPage from "../hooks/useDetailPage";
import { fetchVehicleById, clearSelectedVehicle } from "../store/vehiclesSlice";
import { getVehicleStatusLabel, getVehicleStatusColor, getVehicleVerificationStatusLabel, getVehicleVerificationStatusColor } from "../utils/enums";
import { getVehicleTypeName } from "../utils/vehicleTypes";
import useVehicleTypes from "../hooks/useVehicleTypes";
import useAuth from "../hooks/useAuth";
import type { RootState } from "../store/store";

const Vehicle = () => {
  const { t } = useTranslation("pages/vehicle");
  const { isSuperAdmin } = useAuth();
  const { activeVehicleTypes } = useVehicleTypes();
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);

  const { id, selectedItem: selectedVehicle, loading, error, handleBack } = useDetailPage({
    selector: (state: RootState) => ({
      selectedItem: state.vehicles.selectedVehicle,
      loading: state.vehicles.loading,
      error: state.vehicles.error,
    }),
    fetchAction: fetchVehicleById,
    clearAction: clearSelectedVehicle,
    backRoute: `${import.meta.env.VITE_VEHICLES_ROUTE}`,
  });

  const handleVerify = () => {
    setVerificationModalOpen(true);
  };

  const verifyButton = isSuperAdmin() ? (
    <GradientButton 
      onClick={handleVerify}
      className="!px-6 !py-2.5 hover:!shadow-lg transition-all !bg-purple-600"
    >
      <CheckCircleIcon className="w-5 h-5 mr-2" />
      {t("verify", { defaultValue: "Verify/Reject" })}
    </GradientButton>
  ) : null;

  const actions = (
    <DetailPageActions
      entityId={id}
      editRoute={`${import.meta.env.VITE_VEHICLES_ROUTE}/edit/${id}`}
      deleteType="deleteVehicle"
      deleteIdKey="vehicleId"
      editLabel={t("edit", { defaultValue: "Edit" })}
      deleteLabel={t("delete", { defaultValue: "Delete" })}
      additionalActions={verifyButton}
    />
  );

  return (
    <DetailPageWrapper
      loading={loading}
      error={error}
      data={selectedVehicle}
      notFoundMessage={t("vehicle_not_found", { defaultValue: "Vehicle not found" })}
      onBack={handleBack}
      backLabel={t("back_to_vehicles", { defaultValue: "Back to Vehicles" })}
    >
      <PageHeader
        title={t("vehicle_details", { defaultValue: "Vehicle Details" })}
        backUrl={`${import.meta.env.VITE_VEHICLES_ROUTE}`}
        actions={actions}
      />

      {selectedVehicle && (
        <Paper className="paper">
          <Box className="p-6">
            {/* Vehicle Header */}
            <Box className="mb-6 pb-6 border-b">
              <Typography variant="h4" className="!font-[700] !mb-2">
                {selectedVehicle.make} {selectedVehicle.model} ({selectedVehicle.year})
              </Typography>
              <Box className="flex items-center gap-3 flex-wrap">
                <Chip
                  label={getVehicleStatusLabel(selectedVehicle.status)}
                  className={getVehicleStatusColor(selectedVehicle.status)}
                  size="small"
                />
                <Chip
                  label={getVehicleVerificationStatusLabel(selectedVehicle.verification_status)}
                  className={getVehicleVerificationStatusColor(selectedVehicle.verification_status)}
                  size="small"
                />
                {selectedVehicle.is_primary && (
                  <Chip
                    label={t("primary", { defaultValue: "Primary" })}
                    className="bg-blue-100 text-blue-700 border-blue-200"
                    size="small"
                  />
                )}
              </Box>
            </Box>

            {/* Basic Information */}
            <Box className="mb-6">
              <SectionHeader
                title={t("basic_information", { defaultValue: "Basic Information" })}
                className="mb-4"
              />
              <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <InfoField
                  label={t("driver", { defaultValue: "Driver" })}
                  value={selectedVehicle.driver?.name || "-"}
                />
                <InfoField
                  label={t("license_plate", { defaultValue: "License Plate" })}
                  value={selectedVehicle.license_plate}
                />
                <InfoField
                  label={t("vin", { defaultValue: "VIN" })}
                  value={selectedVehicle.vin || "-"}
                />
                <InfoField
                  label={t("vehicle_type", { defaultValue: "Vehicle Type" })}
                  value={getVehicleTypeName(selectedVehicle.vehicle_type || selectedVehicle.vehicle_type_id, activeVehicleTypes)}
                />
                <InfoField
                  label={t("color", { defaultValue: "Color" })}
                  value={selectedVehicle.color || "-"}
                />
              </Box>
            </Box>

            {/* Vehicle Specifications */}
            {(selectedVehicle.fuel_type || selectedVehicle.transmission || selectedVehicle.doors || selectedVehicle.seats) && (
              <Box className="mb-6">
                <SectionHeader
                  title={t("vehicle_specifications", { defaultValue: "Vehicle Specifications" })}
                  className="mb-4"
                />
                <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  <InfoField
                    label={t("fuel_type", { defaultValue: "Fuel Type" })}
                    value={selectedVehicle.fuel_type || "-"}
                  />
                  <InfoField
                    label={t("transmission", { defaultValue: "Transmission" })}
                    value={selectedVehicle.transmission ? selectedVehicle.transmission.charAt(0).toUpperCase() + selectedVehicle.transmission.slice(1) : "-"}
                  />
                  <InfoField
                    label={t("doors", { defaultValue: "Doors" })}
                    value={selectedVehicle.doors?.toString() || "-"}
                  />
                  <InfoField
                    label={t("seats", { defaultValue: "Seats" })}
                    value={selectedVehicle.seats?.toString() || "-"}
                  />
                </Box>
              </Box>
            )}

            {/* Registration Information */}
            {(selectedVehicle.registration_number || selectedVehicle.registration_expiry || selectedVehicle.registration_state) && (
              <Box className="mb-6">
                <SectionHeader
                  title={t("registration_information", { defaultValue: "Registration Information" })}
                  className="mb-4"
                />
                <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  <InfoField
                    label={t("registration_number", { defaultValue: "Registration Number" })}
                    value={selectedVehicle.registration_number || "-"}
                  />
                  <InfoField
                    label={t("registration_expiry", { defaultValue: "Registration Expiry" })}
                    value={selectedVehicle.registration_expiry ? new Date(selectedVehicle.registration_expiry).toLocaleDateString() : "-"}
                  />
                  <InfoField
                    label={t("registration_state", { defaultValue: "Registration State" })}
                    value={selectedVehicle.registration_state || "-"}
                  />
                </Box>
              </Box>
            )}

            {/* Insurance Information */}
            {(selectedVehicle.insurance_provider || selectedVehicle.insurance_policy_number || selectedVehicle.insurance_expiry) && (
              <Box className="mb-6">
                <SectionHeader
                  title={t("insurance_information", { defaultValue: "Insurance Information" })}
                  className="mb-4"
                />
                <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  <InfoField
                    label={t("insurance_provider", { defaultValue: "Insurance Provider" })}
                    value={selectedVehicle.insurance_provider || "-"}
                  />
                  <InfoField
                    label={t("insurance_policy_number", { defaultValue: "Insurance Policy Number" })}
                    value={selectedVehicle.insurance_policy_number || "-"}
                  />
                  <InfoField
                    label={t("insurance_expiry", { defaultValue: "Insurance Expiry" })}
                    value={selectedVehicle.insurance_expiry ? new Date(selectedVehicle.insurance_expiry).toLocaleDateString() : "-"}
                  />
                </Box>
              </Box>
            )}

            {/* Verification Information */}
            {selectedVehicle.verification_status && (
              <Box className="mb-6">
                <SectionHeader
                  title={t("verification_information", { defaultValue: "Verification Information" })}
                  className="mb-4"
                />
                <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                  <InfoField
                    label={t("verification_date", { defaultValue: "Verification Date" })}
                    value={selectedVehicle.verification_date ? new Date(selectedVehicle.verification_date).toLocaleDateString() : "-"}
                  />
                  <InfoField
                    label={t("verified_by", { defaultValue: "Verified By" })}
                    value={selectedVehicle.verifier?.name || "-"}
                  />
                  {selectedVehicle.verification_notes && (
                    <InfoField
                      label={t("verification_notes", { defaultValue: "Verification Notes" })}
                      value={selectedVehicle.verification_notes}
                      className="col-span-full"
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Notes */}
            {selectedVehicle.notes && (
              <Box>
                <SectionHeader
                  title={t("notes", { defaultValue: "Notes" })}
                  className="mb-4"
                />
                <Typography variant="body2" className="!text-gray-600">
                  {selectedVehicle.notes}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}
      <VehicleVerificationModal
        open={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        vehicleId={selectedVehicle?.id || 0}
        currentStatus={selectedVehicle?.verification_status}
      />
    </DetailPageWrapper>
  );
};

export default Vehicle;
