import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
// Avatar is now used in ProfileHeader component
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { BasicButton } from "../mui/buttons/BasicButton";
import { GradientButton } from "../mui/buttons/GradientButton";
import EditIcon from "../icons/EditIcon";
import DeleteIcon from "../icons/DeleteIcon";
import MailIcon from "../icons/MailIcon";
import PhoneIcon from "../icons/PhoneIcon";
import LocationIcon from "../icons/LocationIcon";
import CheckCircleIcon from "../icons/CheckCircleIcon";
import PageHeader from "../components/common/PageHeader/PageHeader";
import InfoCard from "../components/common/InfoCard/InfoCard";
import SectionHeader from "../components/common/SectionHeader/SectionHeader";
import InfoField from "../components/common/InfoField/InfoField";
import ProfileHeader from "../components/common/ProfileHeader/ProfileHeader";
import DetailPageWrapper from "../components/pages/DetailPageWrapper";
import DetailPageActions from "../components/common/DetailPageActions/DetailPageActions";
import useDetailPage from "../hooks/useDetailPage";
import type { AppDispatch, RootState } from "../store/store";
import { fetchDriverById, clearSelectedDriver, verifyDriverDocument, rejectDriverDocument, updateDriver, downloadDriverDocument, deleteDriverDocument, expireDriverDocument } from "../store/driversSlice";
import { useEffect } from "react";
import { fetchDriverRatings } from "../store/ratingsSlice";
import RatingList from "../components/ratings/RatingList";
import RatingStars from "../components/ratings/RatingStars";
import { useAppStore } from "../globals/appStore";
import { useModalsStore } from "../globals/modalsStore";
import { getAvatarUrl } from "../utils/avatarUtils";
import { handleToaster } from "../functions/handleToaster";
import RejectionReasonModal from "../components/common/RejectionReasonModal/RejectionReasonModal";
import DocumentUpdateModal from "../components/modals/DocumentUpdateModal";
import DocumentViewModal from "../components/common/DocumentViewModal/DocumentViewModal";
import DownloadIcon from "../icons/DownloadIcon";
import DriverWalletSection from "../sections/DriverWalletSection/DriverWalletSection";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  DRIVER_STATUSES,
  // DRIVER_AVAILABILITY_STATUSES, // Commented out - availability is now a text description, not a select
  type DriverStatus,
  // type DriverAvailabilityStatus, // Commented out - availability is now a text description
  type DocumentVerificationStatus,
} from "../types/enums";
import {
  getDriverStatusColor,
  getDriverStatusLabel,
  getDocumentVerificationStatusColor,
  getDocumentVerificationStatusLabel,
  getDocumentTypeLabel,
  getDriverAvailabilityStatusDotColor,
} from "../utils/enums";
import type { DriverDocument } from "../types/domain";

const Driver = () => {
  const { t } = useTranslation("pages/driver");
  const dispatch = useDispatch<AppDispatch>();
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{ driverId: number; documentId: number } | null>(null);
  const setUpdateDocumentData = useAppStore((state) => state.setUpdateDocumentData);
  const setUpdateDocumentModal = useModalsStore((state) => state.setUpdateDocumentModal);
  const [deleteDocumentModalOpen, setDeleteDocumentModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{ driverId: number; documentId: number } | null>(null);
  const [viewDocumentModalOpen, setViewDocumentModalOpen] = useState(false);
  const [documentToView, setDocumentToView] = useState<DriverDocument | null>(null);

  const { id, selectedItem: selectedDriver, loading, error, handleBack } = useDetailPage({
    selector: (state: RootState) => ({
      selectedItem: state.drivers.selectedDriver,
      loading: state.drivers.loading,
      error: state.drivers.error,
    }),
    fetchAction: fetchDriverById,
    clearAction: clearSelectedDriver,
    backRoute: `${import.meta.env.VITE_DRIVERS_ROUTE}`,
  });

  // Debug: Log current state to see what's happening
  useEffect(() => {
    const state = {
      id,
      hasSelectedDriver: !!selectedDriver,
      selectedDriverId: selectedDriver?.id,
      selectedDriverName: selectedDriver?.name,
      loading,
      error,
      reduxState: {
        selectedDriver: selectedDriver ? { id: selectedDriver.id, name: selectedDriver.name } : null,
        loading,
        error
      }
    };
    console.log('🔍 Driver Page State:', state);
    
    // Also log what will be passed to DetailPageWrapper
    console.log('📦 Data being passed to DetailPageWrapper:', {
      loading,
      error,
      data: selectedDriver ? { id: selectedDriver.id, name: selectedDriver.name } : null,
      hasData: !!selectedDriver
    });
  }, [id, selectedDriver, loading, error]);

  const driverRatings = useSelector((state: RootState) => state.ratings.driverRatings) || [];
  const ratingsLoading = useSelector((state: RootState) => state.ratings.loading);
  const { user } = useSelector((state: RootState) => state.auth);

  // Fetch driver ratings when driver is loaded
  useEffect(() => {
    if (selectedDriver?.id) {
      dispatch(fetchDriverRatings(selectedDriver.id)).catch((error) => {
        // Silently fail for ratings - don't break the page if ratings endpoint doesn't exist
        console.warn('Failed to fetch driver ratings:', error);
      });
    }
  }, [selectedDriver?.id, dispatch]);


  const handleVerifyDocument = async (driverId: number, documentId: number) => {
    try {
      await dispatch(verifyDriverDocument({ driverId, documentId })).unwrap();
      handleToaster({ msg: t("documentVerified", { defaultValue: "Document verified successfully" }), status: "success" });
      // Refresh driver data
      if (id) {
        dispatch(fetchDriverById(+id));
      }
    } catch (error: any) {
      handleToaster({ msg: error?.message || t("documentVerifyError", { defaultValue: "Failed to verify document" }), status: "error" });
    }
  };

  const handleRejectDocument = (driverId: number, documentId: number) => {
    setSelectedDocument({ driverId, documentId });
    setRejectionModalOpen(true);
  };

  const handleConfirmRejection = async (reason: string) => {
    if (!selectedDocument) return;
    // Check if this is for driver rejection (documentId === 0) or document rejection
    if (selectedDocument.documentId === 0) {
      await handleConfirmDriverRejection(reason);
      return;
    }
    try {
      await dispatch(rejectDriverDocument({ 
        driverId: selectedDocument.driverId, 
        documentId: selectedDocument.documentId,
        rejectionReason: reason
      })).unwrap();
      handleToaster({ msg: t("documentRejected", { defaultValue: "Document rejected successfully" }), status: "success" });
      setRejectionModalOpen(false);
      setSelectedDocument(null);
      // Refresh driver data
      if (id) {
        dispatch(fetchDriverById(+id));
      }
    } catch (error: any) {
      handleToaster({ msg: error?.message || t("documentRejectError", { defaultValue: "Failed to reject document" }), status: "error" });
    }
  };

  const handleDownloadDocument = async (driverId: number, documentId: number, fileName?: string) => {
    try {
      await dispatch(downloadDriverDocument({ driverId, documentId, fileName })).unwrap();
      handleToaster({ msg: t("documentDownloaded", { defaultValue: "Document downloaded successfully" }), status: "success" });
    } catch (error: any) {
      handleToaster({ msg: error?.message || t("documentDownloadError", { defaultValue: "Failed to download document" }), status: "error" });
    }
  };

  const handleUpdateDocument = (driverId: number, documentId: number) => {
    setUpdateDocumentData({ driverId, documentId });
    setUpdateDocumentModal(true);
  };

  const handleDeleteDocument = (driverId: number, documentId: number) => {
    setDocumentToDelete({ driverId, documentId });
    setDeleteDocumentModalOpen(true);
  };

  const handleConfirmDeleteDocument = async () => {
    if (!documentToDelete) return;
    try {
      await dispatch(deleteDriverDocument({ 
        driverId: documentToDelete.driverId, 
        documentId: documentToDelete.documentId
      })).unwrap();
      handleToaster({ msg: t("documentDeleted", { defaultValue: "Document deleted successfully" }), status: "success" });
      setDeleteDocumentModalOpen(false);
      setDocumentToDelete(null);
      // Refresh driver data
      if (id) {
        dispatch(fetchDriverById(+id));
      }
    } catch (error: any) {
      handleToaster({ msg: error?.message || t("documentDeleteError", { defaultValue: "Failed to delete document" }), status: "error" });
    }
  };

  const handleExpireDocument = async (driverId: number, documentId: number) => {
    try {
      await dispatch(expireDriverDocument({ driverId, documentId })).unwrap();
      handleToaster({ msg: t("documentExpired", { defaultValue: "Document marked as expired successfully" }), status: "success" });
      // Refresh driver data
      if (id) {
        dispatch(fetchDriverById(+id));
      }
    } catch (error: any) {
      handleToaster({ msg: error?.message || t("documentExpireError", { defaultValue: "Failed to expire document" }), status: "error" });
    }
  };

  const handleRejectDriver = () => {
    if (!selectedDriver) return;
    setSelectedDocument({ driverId: selectedDriver.id, documentId: 0 }); // Use 0 to indicate driver rejection
    setRejectionModalOpen(true);
  };

  const handleConfirmDriverRejection = async (reason: string) => {
    if (!selectedDriver || !id) return;
    try {
      await dispatch(updateDriver({ id: +id, data: { status: 'rejected', verification_notes: reason } })).unwrap();
      handleToaster({ msg: t("driverRejected", { defaultValue: "Driver rejected successfully" }), status: "success" });
      setRejectionModalOpen(false);
      setSelectedDocument(null);
      // Refresh driver data
      dispatch(fetchDriverById(+id));
    } catch (error: any) {
      handleToaster({ msg: error?.message || t("driverRejectError", { defaultValue: "Failed to reject driver" }), status: "error" });
    }
  };

  // Commented out - Super admin can no longer change availability status via select
  // const handleUpdateAvailabilityStatus = async (availabilityStatus: DriverAvailabilityStatus) => {
  //   if (!selectedDriver || !id) return;
  //   try {
  //     await dispatch(updateDriver({ id: +id, data: { availability_status: availabilityStatus } })).unwrap();
  //     handleToaster({ msg: t("availabilityStatusUpdated", { defaultValue: "Availability status updated successfully" }), status: "success" });
  //     // Refresh driver data
  //     dispatch(fetchDriverById(+id));
  //   } catch (error: any) {
  //     handleToaster({ msg: error?.message || t("availabilityStatusUpdateError", { defaultValue: "Failed to update availability status" }), status: "error" });
  //   }
  // };

  const handleUpdateDriverStatus = async (status: DriverStatus) => {
    if (!selectedDriver || !id) return;
    try {
      await dispatch(updateDriver({ id: +id, data: { status } })).unwrap();
      handleToaster({ msg: t("driverStatusUpdated", { defaultValue: "Driver status updated successfully" }), status: "success" });
      // Refresh driver data
      dispatch(fetchDriverById(+id));
    } catch (error: any) {
      handleToaster({ msg: error?.message || t("driverStatusUpdateError", { defaultValue: "Failed to update driver status" }), status: "error" });
    }
  };

  const handleVerifyDriver = async () => {
    if (!selectedDriver || !id) return;
    try {
      await dispatch(updateDriver({ id: +id, data: { status: 'verified' } })).unwrap();
      handleToaster({ msg: t("driverVerified", { defaultValue: "Driver verified successfully" }), status: "success" });
      // Refresh driver data
      dispatch(fetchDriverById(+id));
    } catch (error: any) {
      handleToaster({ msg: error?.message || t("driverVerifyError", { defaultValue: "Failed to verify driver" }), status: "error" });
    }
  };

  const getStatusColor = (status: string) => {
    // Use utility function if status matches DriverStatus, otherwise fallback
    if (DRIVER_STATUSES.includes(status as DriverStatus)) {
      return getDriverStatusColor(status as DriverStatus);
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const additionalActions = selectedDriver && selectedDriver.status !== 'verified' && selectedDriver.status !== 'rejected' ? (
    <>
      <BasicButton
        onClick={handleVerifyDriver}
        disabled={selectedDriver.documents && selectedDriver.documents.length > 0 && !selectedDriver.has_all_documents_verified}
        className={`!px-6 !py-2.5 transition-all ${
          selectedDriver.documents && selectedDriver.documents.length > 0 && !selectedDriver.has_all_documents_verified
            ? '!bg-gray-100 !text-gray-400 !cursor-not-allowed'
            : '!bg-green-50 !text-green-600 hover:!bg-green-100 !border-green-200 !border'
        }`}
        title={
          selectedDriver.documents && selectedDriver.documents.length > 0 && !selectedDriver.has_all_documents_verified
            ? t("verifyDriverDisabled", { defaultValue: "All documents must be verified first" })
            : undefined
        }
      >
        <CheckCircleIcon className="w-5 h-5 mr-2" />
        {t("verifyDriver", { defaultValue: "Verify Driver" })}
      </BasicButton>
      <BasicButton
        onClick={handleRejectDriver}
        className="!bg-red-50 !text-red-600 hover:!bg-red-100 !border-red-200 !border !px-6 !py-2.5 transition-all"
      >
        <DeleteIcon className="w-5 h-5 mr-2" />
        {t("rejectDriver", { defaultValue: "Reject Driver" })}
      </BasicButton>
    </>
  ) : null;

  const statusSelect = (
    <Box className="flex items-center gap-2">
      <Typography variant="body2" className="!text-gray-600 !mr-2">
        {t("status", { defaultValue: "Status" })}:
      </Typography>
      <select
        value={selectedDriver?.status || 'pending'}
        onChange={(e) => handleUpdateDriverStatus(e.target.value as DriverStatus)}
        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent"
      >
        {DRIVER_STATUSES.map((status) => (
          <option key={status} value={status}>
            {t(status, { defaultValue: getDriverStatusLabel(status) })}
          </option>
        ))}
      </select>
    </Box>
  );

  const actions = (
    <DetailPageActions
      entityId={id}
      editRoute={`${import.meta.env.VITE_DRIVERS_ROUTE}/edit/${id}`}
      deleteType="deleteDriver"
      deleteIdKey="driverId"
      editLabel={t("edit", { defaultValue: "Edit" })}
      deleteLabel={t("delete", { defaultValue: "Delete" })}
      additionalActions={
        <>
          {additionalActions}
          {statusSelect}
        </>
      }
    />
  );

  const photoUrl = getAvatarUrl(selectedDriver?.photo_url);

  return (
    <DetailPageWrapper
      loading={loading}
      error={error}
      data={selectedDriver}
      notFoundMessage={t("driver_not_found", { defaultValue: "Driver not found" })}
      onBack={handleBack}
      backLabel={t("back_to_drivers", { defaultValue: "Back to Drivers" })}
    >
      <PageHeader
        title={t("title", { defaultValue: "Driver Details" })}
        subtitle={t("subtitle", { defaultValue: "View driver information and documents" })}
        backUrl={`${import.meta.env.VITE_DRIVERS_ROUTE}`}
        actions={actions}
      />

      {/* Driver Header Card */}
      {selectedDriver && (
        <ProfileHeader
          photoUrl={photoUrl}
          name={selectedDriver.name || "Unknown Driver"}
          subtitle={selectedDriver.email || "No email"}
          status={selectedDriver.status}
          statusLabel={selectedDriver.status ? t(selectedDriver.status, { defaultValue: getDriverStatusLabel(selectedDriver.status as DriverStatus) }) : "N/A"}
          statusColor={getStatusColor(selectedDriver.status || "")}
          availabilityStatus={selectedDriver.availability_status || null}
          availabilityStatusDotColor={selectedDriver.availability_status ? getDriverAvailabilityStatusDotColor(selectedDriver.availability_status) : undefined}
          rating={selectedDriver.rating}
          totalTrips={selectedDriver.total_rides}
          showDriverStats={true}
          variant="driver"
        />
      )}

      {/* Contact Information */}
      {selectedDriver && (
        <>
          <SectionHeader
            title={t("contactInformation", { defaultValue: "Contact Information" })}
            icon={<MailIcon className="w-5 h-5 text-[#003366]" />}
          />
          <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
            <InfoCard
              icon={<MailIcon className="w-5 h-5 text-[#003366]" />}
              label={t("email", { defaultValue: "Email" })}
              value={selectedDriver.email || "N/A"}
            />
            <InfoCard
              icon={<PhoneIcon className="w-5 h-5 text-[#003366]" />}
              label={t("phone", { defaultValue: "Phone" })}
              value={selectedDriver.phone || selectedDriver.emergency_contact_phone || "N/A"}
            />
          </Box>

          {/* Driver Information */}
          <SectionHeader
            title={t("driverInformation", { defaultValue: "Driver Information" })}
            icon={<LocationIcon className="w-5 h-5 text-[#003366]" />}
          />
          <Box className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-4">
            <InfoField
              label={t("licenseNumber", { defaultValue: "License Number" })}
              value={selectedDriver.license_number || "N/A"}
            />
            <InfoField
              label={t("licenseExpiryDate", { defaultValue: "License Expiry Date" })}
              value={selectedDriver.license_expiry_date ? new Date(selectedDriver.license_expiry_date).toLocaleDateString() : "N/A"}
            />
            <InfoField
              label={t("status", { defaultValue: "Status" })}
              value={selectedDriver.status ? t(selectedDriver.status, { defaultValue: getDriverStatusLabel(selectedDriver.status as DriverStatus) }) : "N/A"}
            />
            <InfoField
              label={t("rating", { defaultValue: "Rating" })}
              value={(() => {
                const rating = selectedDriver.rating;
                if (rating == null || rating === undefined) return "N/A";
                const numRating = typeof rating === 'number' ? rating : Number(rating);
                return isNaN(numRating) ? "N/A" : numRating.toFixed(1);
              })()}
            />
            <InfoField
              label={t("totalTrips", { defaultValue: "Total Trips" })}
              value={(selectedDriver.total_rides)?.toString() || "0"}
            />
                  <InfoField
                    label={t("isVerified", { defaultValue: "Verified" })}
                    value={selectedDriver.status === 'verified' ? t("yes", { defaultValue: "Yes" }) : t("no", { defaultValue: "No" })}
                  />
            {/* Availability is now shown next to the avatar */}
            {/* {selectedDriver.availability_status && (
              <InfoField
                label={t("availabilityDescription", { defaultValue: "Availability Description" })}
                value={selectedDriver.availability_status}
                className="col-span-2"
              />
            )} */}
            {(selectedDriver.status === 'verified' || selectedDriver.status === 'rejected') && (
              <InfoField
                label={t("verificationStatus", { defaultValue: "Verification Status" })}
                value={t(selectedDriver.status, { defaultValue: selectedDriver.status.charAt(0).toUpperCase() + selectedDriver.status.slice(1).replace(/_/g, ' ') })}
              />
            )}
            {selectedDriver.verified_at && (
              <InfoField
                label={t("verifiedAt", { defaultValue: "Verified At" })}
                value={new Date(selectedDriver.verified_at).toLocaleString()}
              />
            )}
            {selectedDriver.verifier && (
              <InfoField
                label={t("verifiedBy", { defaultValue: "Verified By" })}
                value={`${selectedDriver.verifier.name} (${selectedDriver.verifier.email})`}
              />
            )}
            {selectedDriver.verification_notes && (
              <InfoField
                label={t("verificationNotes", { defaultValue: "Verification Notes" })}
                value={selectedDriver.verification_notes}
              />
            )}
            {selectedDriver.total_earnings != null && (
              <InfoField
                label={t("totalEarnings", { defaultValue: "Total Earnings" })}
                value={(() => {
                  const earnings = selectedDriver.total_earnings;
                  if (earnings == null) return "N/A";
                  const numEarnings = typeof earnings === 'number' ? earnings : Number(earnings);
                  return isNaN(numEarnings) ? "N/A" : `$${numEarnings.toFixed(2)}`;
                })()}
              />
            )}
            {selectedDriver.completed_rides != null && (
              <InfoField
                label={t("completedRides", { defaultValue: "Completed Rides" })}
                value={selectedDriver.completed_rides.toString()}
              />
            )}
            {selectedDriver.cancelled_rides != null && (
              <InfoField
                label={t("cancelledRides", { defaultValue: "Cancelled Rides" })}
                value={selectedDriver.cancelled_rides.toString()}
              />
            )}
          </Box>

          {/* Ratings Section */}
          {selectedDriver.rating != null && (
            <>
              <SectionHeader
                title={t("ratings", { defaultValue: "Ratings & Reviews" })}
                icon={<CheckCircleIcon className="w-5 h-5 text-[#003366]" />}
              />
              <Box className="mb-4">
                <Box className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <Box>
                    <Typography variant="caption" className="text-gray-600 block mb-1">
                      {t("overallRating", { defaultValue: "Overall Rating" })}
                    </Typography>
                    <Box className="flex items-center gap-2">
                      <RatingStars rating={typeof selectedDriver.rating === 'number' ? selectedDriver.rating : Number(selectedDriver.rating)} showValue />
                      <Typography variant="body2" className="text-gray-600">
                        ({driverRatings.length} {t("reviews", { defaultValue: "reviews" })})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              {ratingsLoading ? (
                <Typography variant="body2" className="text-gray-500 text-center py-8">
                  {t("loadingRatings", { defaultValue: "Loading ratings..." })}
                </Typography>
              ) : (
                <RatingList
                  ratings={Array.isArray(driverRatings) ? driverRatings.slice(0, 5) : []}
                  showDetails={true}
                  emptyMessage={t("noRatingsYet", { defaultValue: "No ratings yet" })}
                />
              )}
            </>
          )}

          {/* Wallet Section - Only for SuperAdmin */}
          {user?.type === 'superAdmin' && (
            <>
              <DriverWalletSection />
              <Divider className="!my-8" />
            </>
          )}

          {/* Emergency Contact */}
          {(selectedDriver.emergency_contact_name || selectedDriver.emergency_contact_phone) && (
            <>
              <SectionHeader
                title={t("emergencyContact", { defaultValue: "Emergency Contact" })}
                icon={<PhoneIcon className="w-5 h-5 text-[#003366]" />}
              />
              <Box className="grid grid-cols-2 md:grid-cols-1 gap-4">
                <InfoField
                  label={t("emergencyContactName", { defaultValue: "Emergency Contact Name" })}
                  value={selectedDriver.emergency_contact_name || "N/A"}
                />
                <InfoField
                  label={t("emergencyContactPhone", { defaultValue: "Emergency Contact Phone" })}
                  value={selectedDriver.emergency_contact_phone || "N/A"}
                />
              </Box>
            </>
          )}

          {/* Documents Section */}
          {selectedDriver && selectedDriver.documents && selectedDriver.documents.length > 0 && (
            <>
              <SectionHeader
                title={t("documents", { defaultValue: "Documents" })}
                icon={<CheckCircleIcon className="w-5 h-5 text-[#003366]" />}
              />
              <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedDriver.documents.map((doc) => {
              const docStatus: DocumentVerificationStatus = (doc.verification_status || doc.status || 'pending') as DocumentVerificationStatus;
              return (
                <Card 
                  key={doc.id} 
                  className="!shadow-md hover:!shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setDocumentToView(doc);
                    setViewDocumentModalOpen(true);
                  }}
                >
                  <CardContent className="!p-4">
                    <Box className="flex justify-between items-start mb-2">
                      <Typography variant="subtitle2" className="!font-[600]">
                        {t(`documents.${doc.type}`, { defaultValue: getDocumentTypeLabel(doc.type) })}
                      </Typography>
                      <Box className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        {docStatus === 'pending' && (
                        <BasicButton
                          size="small"
                          onClick={() => handleVerifyDocument(selectedDriver!.id, doc.id)}
                          className="!min-w-0 !p-1 !bg-green-50 !text-green-600 hover:!bg-green-100"
                          title={t("verifyDocument", { defaultValue: "Verify Document" })}
                        >
                          <CheckCircleIcon className="w-4 h-4" />
                        </BasicButton>
                      )}
                      {(docStatus === 'pending' || docStatus === 'verified') && (
                        <BasicButton
                          size="small"
                          onClick={() => handleRejectDocument(selectedDriver!.id, doc.id)}
                          className="!min-w-0 !p-1 !bg-red-50 !text-red-600 hover:!bg-red-100"
                          title={t("rejectDocument", { defaultValue: "Reject Document" })}
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </BasicButton>
                      )}
                      {docStatus !== 'expired' && (
                        <BasicButton
                          size="small"
                          onClick={() => handleExpireDocument(selectedDriver!.id, doc.id)}
                          className="!min-w-0 !p-1 !bg-orange-50 !text-orange-600 hover:!bg-orange-100"
                          title={t("expireDocument", { defaultValue: "Expire Document" })}
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </BasicButton>
                      )}
                      <BasicButton
                        size="small"
                        onClick={() => handleDownloadDocument(selectedDriver!.id, doc.id, doc.original_name || doc.name)}
                        className="!min-w-0 !p-1 !bg-blue-50 !text-blue-600 hover:!bg-blue-100"
                        title={t("downloadDocument", { defaultValue: "Download Document" })}
                      >
                        <DownloadIcon className="w-4 h-4" />
                      </BasicButton>
                      <BasicButton
                        size="small"
                        onClick={() => handleUpdateDocument(selectedDriver!.id, doc.id)}
                        className="!min-w-0 !p-1 !bg-yellow-50 !text-yellow-600 hover:!bg-yellow-100"
                        title={t("updateDocument", { defaultValue: "Update Document" })}
                      >
                        <EditIcon className="w-4 h-4" />
                      </BasicButton>
                      <BasicButton
                        size="small"
                        onClick={() => handleDeleteDocument(selectedDriver!.id, doc.id)}
                        className="!min-w-0 !p-1 !bg-red-50 !text-red-600 hover:!bg-red-100"
                        title={t("deleteDocument", { defaultValue: "Delete Document" })}
                      >
                        <DeleteIcon className="w-4 h-4" />
                      </BasicButton>
                      </Box>
                    </Box>
                    <Chip
                      label={getDocumentVerificationStatusLabel(docStatus)}
                      size="small"
                      className={`!text-xs !font-[600] !mt-2 ${getDocumentVerificationStatusColor(docStatus)}`}
                    />
                    {doc.expiry_date && (
                      <Typography variant="caption" className="!text-gray-500 !block !mt-1">
                        {t("expiryDate", { defaultValue: "Expires" })}: {new Date(doc.expiry_date).toLocaleDateString()}
                      </Typography>
                    )}
                    {doc.verified_at && (
                      <Typography variant="caption" className="!text-gray-500 !block !mt-1">
                        {t("verifiedAt", { defaultValue: "Verified" })}: {new Date(doc.verified_at).toLocaleDateString()}
                      </Typography>
                    )}
                    {doc.rejection_reason && (
                      <Typography variant="caption" className="!text-red-600 !block !mt-1">
                        {t("rejectionReason", { defaultValue: "Reason" })}: {doc.rejection_reason}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              );
              })}
              </Box>
            </>
          )}
        </>
      )}

      {/* Rejection Reason Modal */}
      <RejectionReasonModal
        open={rejectionModalOpen}
        onClose={() => {
          setRejectionModalOpen(false);
          setSelectedDocument(null);
        }}
        onConfirm={handleConfirmRejection}
        title={selectedDocument?.documentId === 0 
          ? t("rejectDriver", { defaultValue: "Reject Driver" })
          : t("rejectDocument", { defaultValue: "Reject Document" })}
        label={t("rejectionReason", { defaultValue: "Rejection Reason" })}
        placeholder={t("enterRejectionReason", { defaultValue: "Enter the reason for rejection" })}
      />

      {/* Delete Document Confirmation Modal */}
      <Dialog open={deleteDocumentModalOpen} onClose={() => setDeleteDocumentModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t("deleteDocument", { defaultValue: "Delete Document" })}</DialogTitle>
        <DialogContent>
          <Typography variant="body1" className="!mt-4">
            {t("deleteDocumentConfirm", { defaultValue: "Are you sure you want to delete this document? This action cannot be undone." })}
          </Typography>
        </DialogContent>
        <DialogActions className="!p-4 !pt-2">
          <BasicButton onClick={() => setDeleteDocumentModalOpen(false)}>
            {t("cancel", { defaultValue: "Cancel" })}
          </BasicButton>
          <GradientButton onClick={handleConfirmDeleteDocument}>
            {t("delete", { defaultValue: "Delete" })}
          </GradientButton>
        </DialogActions>
      </Dialog>

      {/* Update Document Modal */}
      <DocumentUpdateModal />

      {/* View Document Modal */}
      <DocumentViewModal
        open={viewDocumentModalOpen}
        onClose={() => {
          setViewDocumentModalOpen(false);
          setDocumentToView(null);
        }}
        document={documentToView}
        driverId={selectedDriver?.id || 0}
        onDownload={handleDownloadDocument}
        onUpdate={handleUpdateDocument}
        onDelete={handleDeleteDocument}
        onVerify={handleVerifyDocument}
        onReject={handleRejectDocument}
        onExpire={handleExpireDocument}
      />
    </DetailPageWrapper>
  );
};

export default Driver;

