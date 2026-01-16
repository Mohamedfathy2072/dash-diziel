import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BasicButton } from "../../../mui/buttons/BasicButton";
import { GradientButton } from "../../../mui/buttons/GradientButton";
import type { RejectionReasonModalProps } from "../../../types/components";

const RejectionReasonModal = ({
  open,
  onClose,
  onConfirm,
  title,
  label,
  placeholder,
}: RejectionReasonModalProps) => {
  const { t } = useTranslation("common");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(t("rejectionReasonRequired", { defaultValue: "Rejection reason is required" }));
      return;
    }
    onConfirm(reason.trim());
    setReason("");
    setError("");
  };

  const handleClose = () => {
    setReason("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title || t("rejectDocument", { defaultValue: "Reject Document" })}</DialogTitle>
      <DialogContent>
        <Box className="mt-4">
          <TextField
            fullWidth
            multiline
            rows={4}
            label={label || t("rejectionReason", { defaultValue: "Rejection Reason" })}
            placeholder={placeholder || t("enterRejectionReason", { defaultValue: "Enter the reason for rejection" })}
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error}
            required
          />
        </Box>
      </DialogContent>
      <DialogActions className="!p-4 !pt-2">
        <BasicButton onClick={handleClose}>
          {t("cancel", { defaultValue: "Cancel" })}
        </BasicButton>
        <GradientButton onClick={handleConfirm}>
          {t("confirm", { defaultValue: "Confirm" })}
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
};

export default RejectionReasonModal;

