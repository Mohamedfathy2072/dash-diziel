import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/common/PageHeader/PageHeader";
import SectionHeader from "../components/common/SectionHeader/SectionHeader";
import InfoField from "../components/common/InfoField/InfoField";
import DetailPageWrapper from "../components/pages/DetailPageWrapper";
import DetailPageActions from "../components/common/DetailPageActions/DetailPageActions";
import useAuth from "../hooks/useAuth";
import useDetailPage from "../hooks/useDetailPage";
import { fetchVehicleTypeById, clearSelectedVehicleType } from "../store/vehicleTypesSlice";
import type { RootState } from "../store/store";

const VehicleType = () => {
  const { t } = useTranslation("pages/vehicle_type");
  const { isSuperAdmin } = useAuth();

  const { id, selectedItem: selectedVehicleType, loading, error, handleBack } = useDetailPage({
    selector: (state: RootState) => ({
      selectedItem: state.vehicleTypes.selectedVehicleType,
      loading: state.vehicleTypes.loading,
      error: state.vehicleTypes.error,
    }),
    fetchAction: fetchVehicleTypeById,
    clearAction: clearSelectedVehicleType,
    backRoute: `${import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types"}`,
  });

  if (!isSuperAdmin) {
    return null;
  }

  const actions = (
    <DetailPageActions
      entityId={id}
      editRoute={`${import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types"}/edit/${id}`}
      deleteType="deleteVehicleType"
      deleteIdKey="vehicleTypeId"
      editLabel={t("edit", { defaultValue: "Edit" })}
      deleteLabel={t("delete", { defaultValue: "Delete" })}
    />
  );

  if (!selectedVehicleType && !loading) {
    return null;
  }

  return (
    <Box className="grid justify-stretch items-start gap-6">
      <PageHeader
        title={selectedVehicleType?.name || ""}
        subtitle={t("subtitle", { defaultValue: "Vehicle Type Details" })}
        actions={actions}
        backUrl={`${import.meta.env.VITE_VEHICLE_TYPES_ROUTE || "/vehicle-types"}`}
      />
      <DetailPageWrapper
        loading={loading}
        error={error}
        data={selectedVehicleType}
        onBack={handleBack}
      >
      <Paper className="paper shadow-lg">
        <Box className="p-6">
          <SectionHeader
            title={t("basicInformation", { defaultValue: "Basic Information" })}
            className="mb-4"
          />
          <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
            <InfoField
              label={t("name", { defaultValue: "Name" })}
              value={selectedVehicleType?.name || "-"}
            />
            <InfoField
              label={t("nameAr", { defaultValue: "Arabic Name" })}
              value={selectedVehicleType?.name_ar || "-"}
            />
            <InfoField
              label={t("status", { defaultValue: "Status" })}
              value={
                selectedVehicleType?.status ? (
                  <Chip
                    label={selectedVehicleType.status === "active" ? t("active", { defaultValue: "Active" }) : t("inactive", { defaultValue: "Inactive" })}
                    className={selectedVehicleType.status === "active" ? "bg-green-100 text-green-700 border-green-200" : "bg-gray-100 text-gray-700 border-gray-200"}
                    size="small"
                  />
                ) : "-"
              }
            />
            <InfoField
              label={t("order", { defaultValue: "Order" })}
              value={selectedVehicleType?.order?.toString() || "-"}
            />
            <InfoField
              label={t("createdAt", { defaultValue: "Created At" })}
              value={selectedVehicleType?.created_at ? new Date(selectedVehicleType.created_at).toLocaleString() : "-"}
            />
            <InfoField
              label={t("updatedAt", { defaultValue: "Updated At" })}
              value={selectedVehicleType?.updated_at ? new Date(selectedVehicleType.updated_at).toLocaleString() : "-"}
            />
          </Box>
        </Box>
      </Paper>
      </DetailPageWrapper>
    </Box>
  );
};

export default VehicleType;

