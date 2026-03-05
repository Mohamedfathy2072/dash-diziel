import { useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogContent,
  Tooltip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { uploadTripPhoto, deleteTripPhoto } from "../store/tripsSlice";
import { useTranslation } from "react-i18next";
import { GradientButton } from "../mui/buttons/GradientButton";
import SectionHeader from "../components/common/SectionHeader/SectionHeader";
import type { AppDispatch, RootState } from "../store/store";
import {
  CloudUploadIcon,
  DeleteIcon,
  ImageIcon,
  ZoomInIcon,
  EyeIcon,
  RefreshCwIcon,
} from "lucide-react";
import CloseIcon from "../icons/CloseIcon";

interface TripPhotosSectionProps {
  tripId: number;
  isSuperAdmin: boolean;
  isView: boolean;
}

const MANDATORY_TYPES = ["policy_before", "policy_after"] as const;
const ADDITIONAL_TYPES = [
  "additional_1",
  "additional_2",
  "additional_3",
  "additional_4",
  "additional_5",
  "additional_6",
] as const;

type PhotoType =
  | (typeof MANDATORY_TYPES)[number]
  | (typeof ADDITIONAL_TYPES)[number];

const TripPhotosSection = ({
  tripId,
  isSuperAdmin,
  isView,
}: TripPhotosSectionProps) => {
  const { t } = useTranslation("pages/trip");
  const PHOTO_LABELS: Record<PhotoType, string> = {
    policy_before: t("before_loading", { defaultValue: "Before Loading" }),
    policy_after: t("after_signature", { defaultValue: "After Signature" }),
    additional_1: t("additional_1", { defaultValue: "Additional 1" }),
    additional_2: t("additional_2", { defaultValue: "Additional 2" }),
    additional_3: t("additional_3", { defaultValue: "Additional 3" }),
    additional_4: t("additional_4", { defaultValue: "Additional 4" }),
    additional_5: t("additional_5", { defaultValue: "Additional 5" }),
    additional_6: t("additional_6", { defaultValue: "Additional 6" }),
  };
  const dispatch = useDispatch<AppDispatch>();
  const photos = useSelector((state: RootState) => state.trips.photos) || [];
  const photosLoading = useSelector(
    (state: RootState) => state.trips.photosLoading,
  );

  const [uploadingType, setUploadingType] = useState<PhotoType | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewImage, setViewImage] = useState<string | null>(null);

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const getPhotoByType = (type: PhotoType) =>
    photos.find((p: any) => p.photo_type === type);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: PhotoType,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("photo_type", type);

    setUploadingType(type);
    await dispatch(uploadTripPhoto({ tripId, formData }));
    setUploadingType(null);

    if (fileInputRefs.current[type]) {
      fileInputRefs.current[type]!.value = "";
    }
  };

  const handleDelete = async (photoId: number) => {
    setDeletingId(photoId);
    await dispatch(deleteTripPhoto({ tripId, photoId }));
    setDeletingId(null);
  };

  const getImageUrl = (photoUrl: string) => {
    if (!photoUrl) return null;
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      return photoUrl;
    }
    return `${import.meta.env.VITE_BACKEND_URL}${photoUrl}`;
  };

  const renderPhotoSlot = (type: PhotoType, isMandatory = false) => {
    const photo = getPhotoByType(type);
    const isUploading = uploadingType === type;
    const isDeleting = deletingId === photo?.id;
    const label = PHOTO_LABELS[type];
    const imageUrl = photo ? getImageUrl(photo.photo_url) : null;

    return (
      <Box
        key={type}
        className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden transition-all hover:border-blue-300 hover:bg-blue-50/30"
      >
        {/* Header */}
        <Box className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-gray-200 bg-white/80">
          <Box className="flex items-center gap-2">
            <ImageIcon fontSize="small" className="text-gray-400" />
            <Typography
              variant="body2"
              className="!font-semibold !text-gray-700"
            >
              {label}
            </Typography>
            {isMandatory && (
              <Box className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs rounded-md font-semibold">
                {t("required", { defaultValue: "Required" })}
              </Box>
            )}
          </Box>
          {photo && !isView && isSuperAdmin && (
            <Tooltip
              title={t("delete_photo", { defaultValue: "Delete photo" })}
            >
              <IconButton
                size="small"
                onClick={() => handleDelete(photo.id)}
                disabled={isDeleting}
                className="!text-red-400 hover:!text-red-600 hover:!bg-red-50"
              >
                {isDeleting ? (
                  <CircularProgress size={16} className="!text-red-400" />
                ) : (
                  <DeleteIcon fontSize="small" />
                )}
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Content */}
        <Box className="flex items-center p-4 gap-4">
          {photo ? (
            // Has photo — small square thumbnail + action buttons
            <Box className="flex items-center gap-3 w-full">
              {/* Small square thumbnail */}
              <Box
                className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-sm cursor-pointer group"
                style={{ width: 100, height: 100 }}
                onClick={() => setViewImage(imageUrl)}
              >
                <img
                  src={imageUrl!}
                  alt={label}
                  className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                />
                <Box className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <ZoomInIcon size={18} className="text-white" />
                </Box>
              </Box>

              {/* Action buttons */}
              <Box className="flex items-center gap-2">
                {/* Eye / View button */}
                <Tooltip
                  title={t("view_photo", { defaultValue: "View photo" })}
                >
                  <IconButton
                    size="small"
                    onClick={() => setViewImage(imageUrl)}
                    className="!bg-blue-50 !text-blue-500 hover:!bg-blue-100 hover:!text-blue-700 !border !border-blue-200"
                  >
                    <EyeIcon size={16} />
                  </IconButton>
                </Tooltip>

                {/* Replace / Upload button */}
                {!isView && isSuperAdmin && (
                  <>
                    <input
                      ref={(el) => (fileInputRefs.current[type] = el)}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleUpload(e, type)}
                    />
                    <Tooltip
                      title={t("replace", { defaultValue: "Replace photo" })}
                    >
                      <IconButton
                        size="small"
                        onClick={() => fileInputRefs.current[type]?.click()}
                        disabled={isUploading}
                        className="!bg-gray-50 !text-gray-500 hover:!bg-gray-100 hover:!text-gray-700 !border !border-gray-200"
                      >
                        {isUploading ? (
                          <CircularProgress
                            size={16}
                            className="!text-gray-400"
                          />
                        ) : (
                          <RefreshCwIcon size={16} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </Box>
            </Box>
          ) : (
            // No photo
            <Box className="flex flex-col items-center gap-1 w-full">
              <Box className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <CloudUploadIcon className="!text-gray-300 !text-2xl" />
              </Box>
              <Typography
                variant="caption"
                className="!text-gray-400 text-center"
              >
                {t("no_photo_uploaded", {
                  defaultValue: "No photo uploaded yet",
                })}
              </Typography>
              {!isView && isSuperAdmin && (
                <>
                  <input
                    ref={(el) => (fileInputRefs.current[type] = el)}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleUpload(e, type)}
                  />
                  <GradientButton
                    onClick={() => fileInputRefs.current[type]?.click()}
                    disabled={isUploading}
                    className="!px-5 !py-2 !text-sm"
                  >
                    {isUploading ? (
                      <CircularProgress size={16} className="!text-white" />
                    ) : (
                      <>
                        <CloudUploadIcon fontSize="small" className="mr-1" />
                        {t("upload", { defaultValue: "Upload" })}
                      </>
                    )}
                  </GradientButton>
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
    );
  };

  if (photosLoading) {
    return (
      <Paper className="paper shadow-xl !rounded-2xl">
        <Box className="p-6 md:p-8 flex justify-center py-16">
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <>
      <Paper className="paper shadow-xl !rounded-2xl">
        <Box className="p-6 md:p-8">
          {isView && (
            <SectionHeader
              title={t("trip_photos", { defaultValue: "Trip Photos" })}
              className="mb-8"
            />
          )}

          {/* Mandatory Photos */}
          <Typography
            variant="subtitle2"
            className="!text-gray-500 !mb-4 !font-semibold uppercase tracking-wide text-xs"
          >
            {t("mandatory_photos", { defaultValue: "Mandatory Photos" })}
          </Typography>
          <Box className="grid grid-cols-2 md:grid-cols-1 gap-5 mb-8">
            {MANDATORY_TYPES.map((type) => renderPhotoSlot(type, true))}
          </Box>

          {/* Additional Photos */}
          <Typography
            variant="subtitle2"
            className="!text-gray-500 !mb-4 !font-semibold uppercase tracking-wide text-xs"
          >
            {t("additional_photos", { defaultValue: "Additional Photos" })}
          </Typography>
          <Box className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-5">
            {ADDITIONAL_TYPES.map((type) => renderPhotoSlot(type, false))}
          </Box>
        </Box>
      </Paper>

      {/* Lightbox */}
      <Dialog
        open={!!viewImage}
        onClose={() => setViewImage(null)}
        maxWidth="lg"
        PaperProps={{ className: "!bg-transparent !shadow-none" }}
      >
        <DialogContent className="!p-0 relative">
          <IconButton
            onClick={() => setViewImage(null)}
            className="!absolute !top-2 !right-2 !z-10 !bg-black/50 !text-white hover:!bg-black/70"
          >
            <CloseIcon />
          </IconButton>
          {viewImage && (
            <img
              src={viewImage}
              alt="Trip photo"
              className="max-w-full max-h-[90vh] rounded-xl"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TripPhotosSection;
