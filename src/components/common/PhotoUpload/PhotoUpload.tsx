import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useState, useRef, useEffect, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { BasicButton } from "../../../mui/buttons/BasicButton";
import DeleteIcon from "../../../icons/DeleteIcon";
import UploadIcon from "../../../icons/UploadIcon";
import { handleGetFileFromServer } from "../../../functions/handleGetFileFromServer";
import { handleToaster } from "../../../functions/handleToaster";
import type { PhotoUploadProps } from "../../../types/components";

const PhotoUpload = ({
  value,
  onChange,
  onRemove,
  preview,
  size = 128,
  photoFileRef,
  formik,
  name = "name",
}: PhotoUploadProps) => {
  const { t } = useTranslation("forms/user_form");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set initial preview from value prop or preview prop
  useEffect(() => {
    if (value && !photoFile) {
      // Use unified function to handle both relative paths and full URLs
      const photoUrl = handleGetFileFromServer(value);
      console.log("PhotoUpload: value prop:", value);
      console.log("PhotoUpload: processed URL:", photoUrl);
      if (photoUrl) {
        setPhotoPreview(photoUrl);
        setPreviewError(false);
      } else {
        console.warn("PhotoUpload: Failed to process photo URL:", value);
        setPhotoPreview(null);
        setPreviewError(false);
      }
    } else if (preview && !photoFile) {
      // Use unified function for preview prop as well
      const previewUrl = handleGetFileFromServer(preview);
      if (previewUrl) {
        setPhotoPreview(previewUrl);
        setPreviewError(false);
      } else {
        setPhotoPreview(null);
        setPreviewError(false);
      }
    } else if (!value && !preview && !photoFile) {
      setPhotoPreview(null);
      setPreviewError(false);
    }
  }, [value, preview, photoFile]);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        handleToaster({
          msg: t("invalidFileType", { defaultValue: "Invalid file type. Please upload an image (jpeg, jpg, png, gif, webp)" }),
          status: "error",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      
      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        handleToaster({
          msg: t("fileTooLarge", { defaultValue: "File size is too large. Maximum size is 5MB" }),
          status: "error",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        return;
      }
      
      setPhotoFile(file);
      setPreviewError(false);
      if (photoFileRef && photoFileRef.current !== undefined) {
        photoFileRef.current = file;
      }
      // Reset input value after file is selected to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPreviewError(false);
        if (onChange) {
          onChange(file, result);
        }
      };
      reader.onerror = () => {
        setPreviewError(true);
        handleToaster({
          msg: t("previewError", { defaultValue: "Failed to load image preview" }),
          status: "error",
        });
        setPhotoFile(null);
        setPhotoPreview(null);
        if (photoFileRef) {
          photoFileRef.current = null;
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (photoFileRef) {
      photoFileRef.current = null;
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (formik) {
      formik.setFieldValue("photo_url", null);
    }
    if (onRemove) {
      onRemove();
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const displayName = formik?.values?.[name]?.charAt(0)?.toUpperCase() || "U";

  return (
    <Box className="col-span-full">
      <Typography
        variant="subtitle2"
        className="!text-gray-700 !mb-4 !font-[600]"
      >
        {t("photo", { defaultValue: "Profile Photo" })}
      </Typography>
      <Box className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <Box
          component="label"
          htmlFor={`photo-upload-${name}`}
          onClick={handlePhotoClick}
          className="cursor-pointer relative rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 hover:border-[#003366] hover:border-solid transition-all hover:shadow-lg group"
          sx={{ width: size, height: size }}
        >
          {photoPreview && !previewError ? (
            <>
              <Avatar
                src={photoPreview}
                alt="User photo"
                className="w-full h-full !border-4 !border-white"
                sx={{ width: size, height: size }}
                imgProps={{
                  onError: (e) => {
                    const target = e.target as HTMLImageElement;
                    console.error("PhotoUpload: Image failed to load", photoPreview);
                    // Only show error if we haven't already shown it for this image
                    if (!previewError) {
                      setPreviewError(true);
                      // Don't hide the avatar, show fallback instead
                      target.style.display = "none";
                      // Only show error message if it's a new upload, not an existing image from server
                      if (photoFile) {
                        handleToaster({
                          msg: t("imageLoadError", { defaultValue: "Failed to load image. Please try uploading again." }),
                          status: "error",
                        });
                      }
                    }
                  },
                  onLoad: () => {
                    console.log("PhotoUpload: Image loaded successfully");
                    setPreviewError(false);
                  },
                }}
              >
                {displayName}
              </Avatar>
              <Box className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <UploadIcon className="text-white w-8 h-8" />
              </Box>
            </>
          ) : (
            <Box className="flex flex-col items-center gap-2">
              <UploadIcon className="text-gray-400 w-10 h-10 group-hover:text-[#003366] transition-colors" />
              <Typography
                variant="caption"
                className="!text-gray-500 !text-xs group-hover:!text-[#003366] transition-colors"
              >
                {t("uploadPhoto", { defaultValue: "Click to Upload" })}
              </Typography>
            </Box>
          )}
        <input
          ref={fileInputRef}
          id={`photo-upload-${name}`}
          name={`photo-upload-${name}`}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={handlePhotoChange}
          className="hidden"
        />
        </Box>
        <Box className="flex flex-col gap-3">
          <BasicButton
            type="button"
            onClick={handlePhotoClick}
            className="!text-sm !min-w-[140px] !px-4 !py-2.5 hover:!shadow-md transition-all"
          >
            <UploadIcon className="w-4 h-4 mr-2" />
            {photoPreview
              ? t("changePhoto", { defaultValue: "Change Photo" })
              : t("uploadPhoto", { defaultValue: "Upload Photo" })}
          </BasicButton>
          {photoPreview && (
            <BasicButton
              type="button"
              onClick={handleRemovePhoto}
              className="!text-sm !bg-red-50 !text-red-600 hover:!bg-red-100 !border-red-200 !border !min-w-[140px] !px-4 !py-2.5 transition-all"
            >
              <DeleteIcon className="w-4 h-4 mr-2" />
              {t("removePhoto", { defaultValue: "Remove Photo" })}
            </BasicButton>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PhotoUpload;

