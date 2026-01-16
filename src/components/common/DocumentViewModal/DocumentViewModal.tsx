import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { useTranslation } from "react-i18next";
import { BasicButton } from "../../../mui/buttons/BasicButton";
import type { DriverDocument } from "../../../types/domain";
import { getDocumentVerificationStatusColor, getDocumentVerificationStatusLabel, getDocumentTypeLabel, getDocumentCategoryLabel } from "../../../utils/enums";
import type { DocumentVerificationStatus } from "../../../types/enums";
import CheckCircleIcon from "../../../icons/CheckCircleIcon";
import DownloadIcon from "../../../icons/DownloadIcon";
import EditIcon from "../../../icons/EditIcon";
import DeleteIcon from "../../../icons/DeleteIcon";
import CloseIcon from "../../../icons/CloseIcon";
import { handleGetFileFromServer } from "../../../functions/handleGetFileFromServer";
import InfoField from "../InfoField/InfoField";

interface DocumentViewModalProps {
  open: boolean;
  onClose: () => void;
  document: DriverDocument | null;
  driverId: number;
  onDownload?: (driverId: number, documentId: number, fileName?: string) => void;
  onUpdate?: (driverId: number, documentId: number) => void;
  onDelete?: (driverId: number, documentId: number) => void;
  onVerify?: (driverId: number, documentId: number) => void;
  onReject?: (driverId: number, documentId: number) => void;
  onExpire?: (driverId: number, documentId: number) => void;
}

const DocumentViewModal = ({
  open,
  onClose,
  document: driverDocument,
  driverId,
  onDownload,
  onUpdate,
  onDelete,
  onVerify,
  onReject,
  onExpire,
}: DocumentViewModalProps) => {
  const { t } = useTranslation("pages/driver");

  if (!driverDocument) return null;

  const docStatus: DocumentVerificationStatus = (driverDocument.verification_status || 'pending') as DocumentVerificationStatus;
  const canVerify = docStatus === 'pending' && onVerify;
  const canReject = (docStatus === 'pending' || docStatus === 'verified') && onReject;
  const canExpire = docStatus !== 'expired' && onExpire;

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Determine if document can be previewed
  const isImage = driverDocument.mime_type?.startsWith('image/');
  const isPdf = driverDocument.mime_type === 'application/pdf' || driverDocument.original_name?.toLowerCase().endsWith('.pdf');
  const canPreview = isImage || isPdf;

  // Get document URL for preview/download
  // Use file_path for image previews (relative path), download_url for downloads (route URL)
  const documentUrl = driverDocument.file_path 
    ? handleGetFileFromServer(driverDocument.file_path)
    : driverDocument.download_url || null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle className="!flex !justify-between !items-center">
        <Box className="flex items-center gap-3">
          <Typography variant="h6" className="!font-[700]">
            {t(`documents.${driverDocument.type}`, { defaultValue: getDocumentTypeLabel(driverDocument.type) })}
          </Typography>
          <Chip
            label={getDocumentVerificationStatusLabel(docStatus)}
            size="small"
            className={`!text-xs !font-[600] ${getDocumentVerificationStatusColor(docStatus)}`}
          />
        </Box>
        <BasicButton onClick={onClose} className="!min-w-0 !p-1">
          <CloseIcon className="w-5 h-5" />
        </BasicButton>
      </DialogTitle>
      <DialogContent dividers className="!p-6">
        <Box className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Document Preview */}
          {canPreview && documentUrl && (
            <Box className="lg:col-span-1">
              <Typography variant="subtitle2" className="!font-[600] !mb-3">
                {t("documentPreview", { defaultValue: "Document Preview" })}
              </Typography>
              <Box className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                {isImage ? (
                  <img
                    src={documentUrl}
                    alt={driverDocument.original_name || driverDocument.name || "Document"}
                    className="w-full h-auto max-h-[500px] object-contain"
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
                    src={documentUrl}
                    className="w-full h-[500px] border-0"
                    title={driverDocument.original_name || driverDocument.name || "Document"}
                  />
                ) : null}
              </Box>
            </Box>
          )}

          {/* Right Column: Document Information */}
          <Box className="lg:col-span-1">
            <Box className="grid grid-cols-1 gap-4">
              {/* Document Type & Category */}
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField
                  label={t("documentType", { defaultValue: "Document Type" })}
                  value={t(`documents.${driverDocument.type}`, { defaultValue: getDocumentTypeLabel(driverDocument.type) })}
                />
                <InfoField
                  label={t("category", { defaultValue: "Category" })}
                  value={t(`documents.category.${driverDocument.category}`, { defaultValue: getDocumentCategoryLabel(driverDocument.category) })}
                />
              </Box>

              <Divider />

              {/* Document Number & Dates */}
              {driverDocument.document_number && (
                <InfoField
                  label={t("documentNumber", { defaultValue: "Document Number" })}
                  value={driverDocument.document_number}
                />
              )}

              <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {driverDocument.issue_date && (
                  <InfoField
                    label={t("issueDate", { defaultValue: "Issue Date" })}
                    value={new Date(driverDocument.issue_date).toLocaleDateString()}
                  />
                )}
                {driverDocument.expiry_date && (
                  <InfoField
                    label={t("expiryDate", { defaultValue: "Expiry Date" })}
                    value={new Date(driverDocument.expiry_date).toLocaleDateString()}
                  />
                )}
              </Box>

              {driverDocument.issuing_authority && (
                <InfoField
                  label={t("issuingAuthority", { defaultValue: "Issuing Authority" })}
                  value={driverDocument.issuing_authority}
                />
              )}

              <Divider />

              {/* File Information */}
              <Box>
                <Typography variant="subtitle2" className="!font-[600] !mb-3">
                  {t("fileInformation", { defaultValue: "File Information" })}
                </Typography>
                <Box className="grid grid-cols-1 gap-4">
                  <InfoField
                    label={t("fileName", { defaultValue: "File Name" })}
                    value={driverDocument.original_name || driverDocument.name || "N/A"}
                  />
                  <InfoField
                    label={t("fileSize", { defaultValue: "File Size" })}
                    value={formatFileSize(driverDocument.size)}
                  />
                  <InfoField
                    label={t("fileType", { defaultValue: "File Type" })}
                    value={driverDocument.mime_type || "N/A"}
                  />
                </Box>
              </Box>

              <Divider />

              {/* Verification Information */}
              {(driverDocument.verified_at || driverDocument.verifier || driverDocument.rejection_reason) && (
                <>
                  <Box>
                    <Typography variant="subtitle2" className="!font-[600] !mb-3">
                      {t("verificationInformation", { defaultValue: "Verification Information" })}
                    </Typography>
                    <Box className="grid grid-cols-1 gap-4">
                      {driverDocument.verified_at && (
                        <InfoField
                          label={t("verifiedAt", { defaultValue: "Verified At" })}
                          value={new Date(driverDocument.verified_at).toLocaleString()}
                        />
                      )}
                      {driverDocument.verifier && (
                        <InfoField
                          label={t("verifiedBy", { defaultValue: "Verified By" })}
                          value={`${driverDocument.verifier.name} (${driverDocument.verifier.email})`}
                        />
                      )}
                      {driverDocument.rejection_reason && (
                        <Box className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                          <Typography variant="caption" className="!text-gray-500 !block !mb-2 !font-[500]">
                            {t("rejectionReason", { defaultValue: "Rejection Reason" })}
                          </Typography>
                          <Typography variant="body1" className="!font-[600] !text-red-600">
                            {driverDocument.rejection_reason}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                  <Divider />
                </>
              )}

              {/* Flags */}
              {(driverDocument.is_required || driverDocument.is_sensitive) && (
                <Box className="flex gap-2">
                  {driverDocument.is_required && (
                    <Chip
                      label={t("required", { defaultValue: "Required" })}
                      size="small"
                      className="!bg-blue-100 !text-blue-700"
                    />
                  )}
                  {driverDocument.is_sensitive && (
                    <Chip
                      label={t("sensitive", { defaultValue: "Sensitive" })}
                      size="small"
                      className="!bg-orange-100 !text-orange-700"
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions className="!px-6 !py-4 !flex !justify-between">
        <Box className="flex gap-2">
          {canVerify && (
            <BasicButton
              onClick={() => {
                onVerify(driverId, driverDocument.id);
                onClose();
              }}
              className="!bg-green-50 !text-green-600 hover:!bg-green-100 !border-green-200 !border"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              {t("verifyDocument", { defaultValue: "Verify" })}
            </BasicButton>
          )}
          {canReject && (
            <BasicButton
              onClick={() => {
                onReject(driverId, driverDocument.id);
                onClose();
              }}
              className="!bg-red-50 !text-red-600 hover:!bg-red-100 !border-red-200 !border"
            >
              <DeleteIcon className="w-4 h-4 mr-2" />
              {t("rejectDocument", { defaultValue: "Reject" })}
            </BasicButton>
          )}
          {canExpire && (
            <BasicButton
              onClick={() => {
                onExpire(driverId, driverDocument.id);
                onClose();
              }}
              className="!bg-orange-50 !text-orange-600 hover:!bg-orange-100 !border-orange-200 !border"
            >
              <DeleteIcon className="w-4 h-4 mr-2" />
              {t("expireDocument", { defaultValue: "Expire" })}
            </BasicButton>
          )}
        </Box>
        <Box className="flex gap-2">
          {onDownload && (
            <BasicButton
              onClick={() => {
                onDownload(driverId, driverDocument.id, driverDocument.original_name || driverDocument.name);
              }}
              className="!bg-blue-50 !text-blue-600 hover:!bg-blue-100 !border-blue-200 !border"
            >
              <DownloadIcon className="w-4 h-4 mr-2" />
              {t("downloadDocument", { defaultValue: "Download" })}
            </BasicButton>
          )}
          {onUpdate && (
            <BasicButton
              onClick={() => {
                onUpdate(driverId, driverDocument.id);
                onClose();
              }}
              className="!bg-yellow-50 !text-yellow-600 hover:!bg-yellow-100 !border-yellow-200 !border"
            >
              <EditIcon className="w-4 h-4 mr-2" />
              {t("updateDocument", { defaultValue: "Update" })}
            </BasicButton>
          )}
          {onDelete && (
            <BasicButton
              onClick={() => {
                onDelete(driverId, driverDocument.id);
                onClose();
              }}
              className="!bg-red-50 !text-red-600 hover:!bg-red-100 !border-red-200 !border"
            >
              <DeleteIcon className="w-4 h-4 mr-2" />
              {t("deleteDocument", { defaultValue: "Delete" })}
            </BasicButton>
          )}
          <BasicButton onClick={onClose}>
            {t("close", { defaultValue: "Close" })}
          </BasicButton>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentViewModal;

