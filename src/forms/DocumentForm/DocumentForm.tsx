import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Input from "../../components/Input/Input";
import { DOCUMENT_TYPES } from "../../types/enums";
import { getDocumentTypeLabel } from "../../utils/enums";
import type { FormiksTypes, DocumentFormTypes } from "../../types/forms";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { BasicButton } from "../../mui/buttons/BasicButton";
import { useFormsStore } from "../../globals/formsStore";
import { useModalsStore } from "../../globals/modalsStore";
import { useAppStore } from "../../globals/appStore";
import type { RootState } from "../../store/store";
import { handleGetFileFromServer } from "../../functions/handleGetFileFromServer";

interface DocumentFormProps extends FormiksTypes<DocumentFormTypes> {
  fileRef?: React.MutableRefObject<File | null>;
}

const DocumentForm = ({ formik, fileRef }: DocumentFormProps) => {
  const { t } = useTranslation("pages/driver");
  const isLoading = useFormsStore((state) => state.isLoading);
  const setUpdateDocumentModal = useModalsStore((state) => state.setUpdateDocumentModal);
  const updateDocumentData = useAppStore((state) => state.updateDocumentData);
  const { selectedDriver } = useSelector((state: RootState) => state.drivers);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<'current' | 'new' | null>(null);

  // Get current document
  const currentDocument = updateDocumentData && selectedDriver?.documents
    ? selectedDriver.documents.find((doc) => doc.id === updateDocumentData.documentId)
    : undefined;

  // Set preview for current document
  useEffect(() => {
    if (currentDocument && !fileRef?.current) {
      const isImage = currentDocument.mime_type?.startsWith('image/');
      const isPdf = currentDocument.mime_type === 'application/pdf' || currentDocument.original_name?.toLowerCase().endsWith('.pdf');
      
      if ((isImage || isPdf) && currentDocument.download_url) {
        const documentUrl = currentDocument.download_url.startsWith('http')
          ? currentDocument.download_url
          : handleGetFileFromServer(currentDocument.download_url);
        setPreviewUrl(documentUrl);
        setPreviewType('current');
      } else {
        setPreviewUrl(null);
        setPreviewType(null);
      }
    } else if (!fileRef?.current) {
      setPreviewUrl(null);
      setPreviewType(null);
    }
  }, [currentDocument, fileRef]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (fileRef) {
        fileRef.current = file;
      }
      
      // Create preview for new file
      const isImage = file.type.startsWith('image/');
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      
      if (isImage || isPdf) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setPreviewType('new');
      } else {
        setPreviewUrl(null);
        setPreviewType(null);
      }
    } else {
      // Reset to current document preview if file input is cleared
      if (currentDocument) {
        const isImage = currentDocument.mime_type?.startsWith('image/');
        const isPdf = currentDocument.mime_type === 'application/pdf' || currentDocument.original_name?.toLowerCase().endsWith('.pdf');
        
        if ((isImage || isPdf) && currentDocument.download_url) {
          const documentUrl = currentDocument.download_url.startsWith('http')
            ? currentDocument.download_url
            : handleGetFileFromServer(currentDocument.download_url);
          setPreviewUrl(documentUrl);
          setPreviewType('current');
        } else {
          setPreviewUrl(null);
          setPreviewType(null);
        }
      } else {
        setPreviewUrl(null);
        setPreviewType(null);
      }
      if (fileRef) {
        fileRef.current = null;
      }
    }
  };

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl && previewType === 'new') {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, previewType]);

  const isImage = previewUrl && (
    (previewType === 'new' && fileRef?.current?.type.startsWith('image/')) ||
    (previewType === 'current' && currentDocument?.mime_type?.startsWith('image/'))
  );
  const isPdf = previewUrl && (
    (previewType === 'new' && (fileRef?.current?.type === 'application/pdf' || fileRef?.current?.name.toLowerCase().endsWith('.pdf'))) ||
    (previewType === 'current' && (currentDocument?.mime_type === 'application/pdf' || currentDocument?.original_name?.toLowerCase().endsWith('.pdf')))
  );

  return (
    <Box component="form" onSubmit={formik.handleSubmit} className="grid gap-4">
      {/* File Upload (Optional) */}
      <Box>
        <Typography variant="subtitle2" className="!font-[600] !mb-2">
          {t("fileInformation", { defaultValue: "File Information" })}
        </Typography>
        <TextField
          fullWidth
          type="file"
          inputRef={fileInputRef}
          onChange={handleFileChange}
          inputProps={{
            accept: "application/pdf,image/jpeg,image/jpg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          }}
          helperText={t("fileUploadOptional", { defaultValue: "Leave empty to keep existing file" })}
        />
        {fileRef?.current && (
          <Typography variant="caption" className="!text-gray-600 !mt-1 !block">
            {t("selectedFile", { defaultValue: "Selected" })}: {fileRef.current.name}
          </Typography>
        )}
        {currentDocument && !fileRef?.current && (
          <Typography variant="caption" className="!text-gray-600 !mt-1 !block">
            {t("currentFile", { defaultValue: "Current file" })}: {currentDocument.original_name || currentDocument.name || "N/A"}
          </Typography>
        )}
      </Box>

      {/* Document Preview */}
      {previewUrl && (
        <Box>
          <Typography variant="subtitle2" className="!font-[600] !mb-2">
            {previewType === 'new' 
              ? t("newFilePreview", { defaultValue: "New File Preview" })
              : t("currentFilePreview", { defaultValue: "Current File Preview" })}
          </Typography>
          <Box className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            {isImage ? (
              <img
                src={previewUrl}
                alt={fileRef?.current?.name || currentDocument?.original_name || "Document"}
                className="w-full h-auto max-h-[400px] object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    // Use textContent instead of innerHTML to prevent XSS
                    const messageDiv = document.createElement('div');
                    messageDiv.className = 'p-8 text-center text-gray-500';
                    messageDiv.textContent = t("previewNotAvailable", { defaultValue: "Preview not available" });
                    parent.innerHTML = '';
                    parent.appendChild(messageDiv);
                  }
                }}
              />
            ) : isPdf ? (
              <iframe
                src={previewUrl}
                className="w-full h-[400px] border-0"
                title={fileRef?.current?.name || currentDocument?.original_name || "Document"}
              />
            ) : null}
          </Box>
        </Box>
      )}

      {/* Document Type */}
      <Input
        formik={formik}
        label={t("documentType", { defaultValue: "Document Type" })}
        name="type"
        select
        options={DOCUMENT_TYPES.map(type => t(`documents.${type}`, { defaultValue: getDocumentTypeLabel(type) }))}
        values={DOCUMENT_TYPES}
        placeholder={t("selectDocumentType", { defaultValue: "Select Document Type" })}
      />

      {/* Document Number */}
      <Input
        formik={formik}
        label={t("documentNumber", { defaultValue: "Document Number" })}
        name="document_number"
        placeholder={t("documentNumberPlaceholder", { defaultValue: "Enter document number" })}
      />

      {/* Issue Date */}
      <Input
        formik={formik}
        label={t("issueDate", { defaultValue: "Issue Date" })}
        name="issue_date"
        type="date"
      />

      {/* Expiry Date */}
      <Input
        formik={formik}
        label={t("expiryDate", { defaultValue: "Expiry Date" })}
        name="expiry_date"
        type="date"
      />

      {/* Issuing Authority */}
      <Input
        formik={formik}
        label={t("issuingAuthority", { defaultValue: "Issuing Authority" })}
        name="issuing_authority"
        placeholder={t("issuingAuthorityPlaceholder", { defaultValue: "Enter issuing authority" })}
      />

      {/* Action Buttons */}
      <Box className="flex justify-end gap-2 !mt-4">
        <BasicButton 
          onClick={() => setUpdateDocumentModal(false)}
          className="!min-w-[120px] !px-6 !py-2.5"
        >
          {t("cancel", { defaultValue: "Cancel" })}
        </BasicButton>
        <SubmitButton
          variant="gradient"
          loading={isLoading}
          className="!min-w-[120px] !px-6 !py-2.5"
        >
          {t("update", { defaultValue: "Update" })}
        </SubmitButton>
      </Box>
    </Box>
  );
};

export default DocumentForm;

