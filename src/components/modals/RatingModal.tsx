import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useModalsStore } from "../../globals/modalsStore";
import { useAppStore } from "../../globals/appStore";
import RatingForm from "../../forms/RatingForm/RatingForm";
import useRatingSchema from "../../forms/RatingForm/useRatingSchema";
import useRatingSubmit from "../../forms/RatingForm/useRatingSubmit";
import type { TripRating } from "../../types/domain";

const RatingModal = () => {
  const { t } = useTranslation("modals/rating_modal");
  const isOpen = useModalsStore((state) => state.isOpenRatingModal);
  const setRatingModal = useModalsStore((state) => state.setRatingModal);
  const ratingData = useAppStore((state) => state.ratingData);
  const setRatingData = useAppStore((state) => state.setRatingData);
  const { RatingSchema, RatingInitialValues } = useRatingSchema();
  const { submitTripRating } = useRatingSubmit();

  const formik = useFormik<Partial<TripRating>>({
    initialValues: RatingInitialValues,
    validationSchema: RatingSchema,
    onSubmit: async (values) => {
      if (!ratingData?.tripId) return;

      const success = await submitTripRating(ratingData.tripId, values);
      if (success) {
        setRatingModal(false);
        setRatingData(undefined);
        formik.resetForm({ values: RatingInitialValues });
      }
    },
  });

  useEffect(() => {
    if (isOpen && ratingData?.tripId) {
      // Reset form when modal opens to ensure clean state
      formik.resetForm({ values: RatingInitialValues });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, ratingData?.tripId]);

  const handleClose = () => {
    formik.resetForm({ values: RatingInitialValues });
    setRatingData(undefined);
    setRatingModal(false);
  };

  if (!ratingData?.tripId) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{t("title", { defaultValue: "Rate Trip" })}</DialogTitle>
      <DialogContent>
        <RatingForm formik={formik} onClose={handleClose} tripId={ratingData.tripId} />
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;

