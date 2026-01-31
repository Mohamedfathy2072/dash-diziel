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
import { handleGetFileFromServer } from "../functions/handleGetFileFromServer";
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
                {selectedVehicle.display_name}
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
                {selectedVehicle.vehicle_type === "composite" && (
                  <Chip
                    label={t("composite_vehicle", { defaultValue: "Composite Vehicle" })}
                    className="bg-green-100 text-green-700 border-green-200"
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
                  label={t("driver_email", { defaultValue: "Driver Email" })}
                  value={selectedVehicle.driver?.email || "-"}
                />
                <InfoField
                  label={t("head_license_plate", { defaultValue: "Head License Plate" })}
                  value={selectedVehicle.head?.license_plate || "-"}
                />
                <InfoField
                  label={t("head_chassis_number", { defaultValue: "Head Chassis Number" })}
                  value={selectedVehicle.head?.chassis_number || "-"}
                />
                <InfoField
                  label={t("head_engine_number", { defaultValue: "Head Engine Number" })}
                  value={selectedVehicle.head?.engine_number || "-"}
                />
                <InfoField
                  label={t("trailer_license_plate", { defaultValue: "Trailer License Plate" })}
                  value={selectedVehicle.trailer?.license_plate || "-"}
                />
                <InfoField
                  label={t("vehicle_type", { defaultValue: "Vehicle Type" })}
                  value={selectedVehicle.vehicle_type === "composite" 
                    ? t("composite_vehicle", { defaultValue: "Composite Vehicle" })
                    : (selectedVehicle.vehicle_type?.name_ar || selectedVehicle.vehicle_type?.name || 
                       getVehicleTypeName(selectedVehicle.vehicle_type_id, activeVehicleTypes))
                  }
                />
                <InfoField
                  label={t("color", { defaultValue: "Color" })}
                  value={selectedVehicle.color || "-"}
                />
              </Box>
            </Box>

            {/* Vehicle Specifications */}
            <Box className="mb-6">
              <SectionHeader
                title={t("vehicle_specifications", { defaultValue: "Vehicle Specifications" })}
                className="mb-4"
              />
              <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                {selectedVehicle.vehicle_type === "composite" && (
                  <>
                    <InfoField
                      label={t("total_axles", { defaultValue: "Total Axles" })}
                      value={selectedVehicle.total_axles?.toString() || "-"}
                    />
                    <InfoField
                      label={t("total_max_load", { defaultValue: "Total Max Load" })}
                      value={selectedVehicle.total_max_load ? `${selectedVehicle.total_max_load} ${t("ton", { defaultValue: "ton" })}` : "-"}
                    />
                    <InfoField
                      label={t("total_length", { defaultValue: "Total Length" })}
                      value={selectedVehicle.total_length ? `${selectedVehicle.total_length} ${t("meter", { defaultValue: "m" })}` : "-"}
                    />
                  </>
                )}
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
                {selectedVehicle.mileage && (
                  <InfoField
                    label={t("mileage", { defaultValue: "Mileage" })}
                    value={`${selectedVehicle.mileage.toLocaleString()} ${t("km", { defaultValue: "km" })}`}
                  />
                )}
                {selectedVehicle.condition_rating && (
                  <InfoField
                    label={t("condition_rating", { defaultValue: "Condition Rating" })}
                    value={`${selectedVehicle.condition_rating}/10`}
                  />
                )}
              </Box>
            </Box>

            {/* Head & Trailer Details */}
            {(selectedVehicle.vehicle_type === "composite" || (selectedVehicle.head && selectedVehicle.trailer)) && (
              <Box className="mb-6">
                <SectionHeader
                  title={t("head_trailer_details", { defaultValue: "Head & Trailer Details" })}
                  className="mb-4"
                />
                
                {/* Head Information */}
                {selectedVehicle.head && (
                  <Box className="mb-4 p-4 border rounded-lg bg-blue-50">
                    <Typography variant="h6" className="!font-[600] !mb-3 text-blue-800">
                      {t("head_information", { defaultValue: "Head Information" })}
                    </Typography>
                    <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                      <InfoField
                        label={t("license_plate", { defaultValue: "License Plate" })}
                        value={selectedVehicle.head.license_plate}
                      />
                      <InfoField
                        label={t("chassis_number", { defaultValue: "Chassis Number" })}
                        value={selectedVehicle.head.chassis_number}
                      />
                      <InfoField
                        label={t("engine_number", { defaultValue: "Engine Number" })}
                        value={selectedVehicle.head.engine_number || "-"}
                      />
                      <InfoField
                        label={t("number_of_axles", { defaultValue: "Number of Axles" })}
                        value={selectedVehicle.head.number_of_axles.toString()}
                      />
                      <InfoField
                        label={t("max_load", { defaultValue: "Max Load" })}
                        value={`${selectedVehicle.head.max_load} ${t("ton", { defaultValue: "ton" })}`}
                      />
                      <InfoField
                        label={t("length", { defaultValue: "Length" })}
                        value={`${selectedVehicle.head.length} ${t("meter", { defaultValue: "m" })}`}
                      />
                    </Box>
                    
                    {/* Head Photos */}
                    {selectedVehicle.head.photos && (
                      <Box className="mt-4">
                        <Typography variant="subtitle1" className="!font-[600] !mb-2">
                          {t("head_photos", { defaultValue: "Head Photos" })}
                        </Typography>
                        <Box className="grid grid-cols-2 gap-4">
                          {selectedVehicle.head.photos.license_front && (
                            <Box>
                              <Typography variant="caption" className="mb-1 block">
                                {t("license_front", { defaultValue: "License Front" })}
                              </Typography>
                              <img 
                                src={handleGetFileFromServer(selectedVehicle.head.photos.license_front) || selectedVehicle.head.photos.license_front} 
                                alt="Head License Front"
                                className="w-full h-32 object-cover rounded border"
                              />
                            </Box>
                          )}
                          {selectedVehicle.head.photos.license_back && (
                            <Box>
                              <Typography variant="caption" className="mb-1 block">
                                {t("license_back", { defaultValue: "License Back" })}
                              </Typography>
                              <img 
                                src={handleGetFileFromServer(selectedVehicle.head.photos.license_back) || selectedVehicle.head.photos.license_back} 
                                alt="Head License Back"
                                className="w-full h-32 object-cover rounded border"
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}

                {/* Trailer Information */}
                {selectedVehicle.trailer && (
                  <Box className="mb-4 p-4 border rounded-lg bg-green-50">
                    <Typography variant="h6" className="!font-[600] !mb-3 text-green-800">
                      {t("trailer_information", { defaultValue: "Trailer Information" })}
                    </Typography>
                    <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                      <InfoField
                        label={t("make_model", { defaultValue: "Make & Model" })}
                        value={`${selectedVehicle.make} ${selectedVehicle.trailer.model}`}
                      />
                      <InfoField
                        label={t("year", { defaultValue: "Year" })}
                        value={selectedVehicle.trailer.year.toString()}
                      />
                      <InfoField
                        label={t("license_plate", { defaultValue: "License Plate" })}
                        value={selectedVehicle.trailer.license_plate}
                      />
                      <InfoField
                        label={t("chassis_number", { defaultValue: "Chassis Number" })}
                        value={selectedVehicle.trailer.chassis_number}
                      />
                      <InfoField
                        label={t("engine_number", { defaultValue: "Engine Number" })}
                        value={selectedVehicle.trailer.engine_number || "-"}
                      />
                      <InfoField
                        label={t("number_of_axles", { defaultValue: "Number of Axles" })}
                        value={selectedVehicle.trailer.number_of_axles.toString()}
                      />
                      <InfoField
                        label={t("max_load", { defaultValue: "Max Load" })}
                        value={`${selectedVehicle.trailer.max_load} ${t("ton", { defaultValue: "ton" })}`}
                      />
                      <InfoField
                        label={t("length", { defaultValue: "Length" })}
                        value={`${selectedVehicle.trailer.length} ${t("meter", { defaultValue: "m" })}`}
                      />
                    </Box>

                    {/* Trailer Photos */}
                    {selectedVehicle.trailer.photos && (
                      <Box className="mt-4">
                        <Typography variant="subtitle1" className="!font-[600] !mb-2">
                          {t("trailer_photos", { defaultValue: "Trailer Photos" })}
                        </Typography>
                        <Box className="grid grid-cols-2 gap-4">
                          {selectedVehicle.trailer.photos.license_front && (
                            <Box>
                              <Typography variant="caption" className="mb-1 block">
                                {t("license_front", { defaultValue: "License Front" })}
                              </Typography>
                              <img 
                                src={handleGetFileFromServer(selectedVehicle.trailer.photos.license_front) || selectedVehicle.trailer.photos.license_front} 
                                alt="Trailer License Front"
                                className="w-full h-32 object-cover rounded border"
                              />
                            </Box>
                          )}
                          {selectedVehicle.trailer.photos.license_back && (
                            <Box>
                              <Typography variant="caption" className="mb-1 block">
                                {t("license_back", { defaultValue: "License Back" })}
                              </Typography>
                              <img 
                                src={handleGetFileFromServer(selectedVehicle.trailer.photos.license_back) || selectedVehicle.trailer.photos.license_back} 
                                alt="Trailer License Back"
                                className="w-full h-32 object-cover rounded border"
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            )}

            {/* Registration Information */}
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

            {/* Insurance Information */}
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

            {/* Inspection & Maintenance Information */}
            <Box className="mb-6">
              <SectionHeader
                title={t("inspection_maintenance", { defaultValue: "Inspection & Maintenance" })}
                className="mb-4"
              />
              <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <InfoField
                  label={t("inspection_date", { defaultValue: "Inspection Date" })}
                  value={selectedVehicle.inspection_date ? new Date(selectedVehicle.inspection_date).toLocaleDateString() : "-"}
                />
                <InfoField
                  label={t("inspection_expiry", { defaultValue: "Inspection Expiry" })}
                  value={selectedVehicle.inspection_expiry ? new Date(selectedVehicle.inspection_expiry).toLocaleDateString() : "-"}
                />
                <InfoField
                  label={t("inspection_certificate", { defaultValue: "Inspection Certificate" })}
                  value={selectedVehicle.inspection_certificate || "-"}
                />
                <InfoField
                  label={t("last_maintenance_date", { defaultValue: "Last Maintenance" })}
                  value={selectedVehicle.last_maintenance_date ? new Date(selectedVehicle.last_maintenance_date).toLocaleDateString() : "-"}
                />
                <InfoField
                  label={t("next_maintenance_due", { defaultValue: "Next Maintenance Due" })}
                  value={selectedVehicle.next_maintenance_due ? new Date(selectedVehicle.next_maintenance_due).toLocaleDateString() : "-"}
                />
              </Box>
            </Box>

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

            {/* Creator Information */}
            <Box className="mb-6">
              <SectionHeader
                title={t("creator_information", { defaultValue: "Creator Information" })}
                className="mb-4"
              />
              <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <InfoField
                  label={t("created_by", { defaultValue: "Created By" })}
                  value={selectedVehicle.creator?.name || "-"}
                />
                <InfoField
                  label={t("created_at", { defaultValue: "Created At" })}
                  value={selectedVehicle.created_at ? new Date(selectedVehicle.created_at).toLocaleString() : "-"}
                />
                <InfoField
                  label={t("updated_by", { defaultValue: "Updated By" })}
                  value={selectedVehicle.updater?.name || "-"}
                />
                <InfoField
                  label={t("updated_at", { defaultValue: "Updated At" })}
                  value={selectedVehicle.updated_at ? new Date(selectedVehicle.updated_at).toLocaleString() : "-"}
                />
              </Box>
            </Box>


            {/* Notes */}
            {selectedVehicle.notes && (
              <Box className="mb-6">
                <SectionHeader
                  title={t("additional_notes", { defaultValue: "Additional Notes" })}
                  className="mb-4"
                />
                <Box className="p-4 bg-gray-50 rounded-lg">
                  <Typography variant="body2" className="whitespace-pre-wrap">
                    {selectedVehicle.notes}
                  </Typography>
                </Box>
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
