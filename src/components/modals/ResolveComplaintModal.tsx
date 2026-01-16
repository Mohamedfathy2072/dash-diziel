import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useModalsStore } from "../../globals/modalsStore";
import { useAppStore } from "../../globals/appStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import { GradientButton } from "../../mui/buttons/GradientButton";
import { resolveComplaint } from "../../store/complaintsSlice";
import { handleToaster } from "../../functions/handleToaster";
import type { AppDispatch } from "../../store/store";

const ResolveComplaintModal = () => {
  const { t } = useTranslation("modals/resolve_complaint_modal");
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useModalsStore((state) => state.isOpenResolveComplaintModal);
  const setResolveModal = useModalsStore((state) => state.setResolveComplaintModal);
  const resolveComplaintData = useAppStore((state) => state.resolveComplaintData);
  const setResolveComplaintData = useAppStore((state) => state.setResolveComplaintData);
  
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setNotes("");
      setError("");
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    if (!resolveComplaintData?.complaintId) {
      setError(t("complaintIdRequired", { defaultValue: "Complaint ID is required" }));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await dispatch(resolveComplaint({
        id: resolveComplaintData.complaintId,
        data: { resolution_notes: notes.trim() || undefined }
      })).unwrap();

      handleToaster({
        msg: t("complaintResolvedSuccessfully", { defaultValue: "Complaint resolved successfully" }),
        status: "success",
      });

      setResolveModal(false);
      setResolveComplaintData(undefined);
      setNotes("");
    } catch (error: any) {
      setError(error?.message || t("failedToResolveComplaint", { defaultValue: "Failed to resolve complaint" }));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setNotes("");
    setError("");
    setResolveComplaintData(undefined);
    setResolveModal(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("title", { defaultValue: "Resolve Complaint" })}</DialogTitle>
      <DialogContent>
        <Box className="mt-4">
          <TextField
            fullWidth
            multiline
            rows={6}
            label={t("resolutionNotes", { defaultValue: "Resolution Notes" })}
            placeholder={t("resolutionNotesPlaceholder", { defaultValue: "Enter resolution notes (optional)" })}
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error || t("resolutionNotesHelper", { defaultValue: "Optional: Add notes about how this complaint was resolved" })}
          />
        </Box>
      </DialogContent>
      <DialogActions className="!p-4 !pt-2">
        <BasicButton onClick={handleClose} disabled={loading}>
          {t("cancel", { defaultValue: "Cancel" })}
        </BasicButton>
        <GradientButton onClick={handleConfirm} disabled={loading}>
          {loading ? t("resolving", { defaultValue: "Resolving..." }) : t("resolve", { defaultValue: "Resolve" })}
        </GradientButton>
      </DialogActions>
    </Dialog>
  );
};

export default ResolveComplaintModal;

