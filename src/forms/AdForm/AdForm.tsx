import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useTranslation } from "react-i18next";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import FormSection from "../../components/common/FormSection/FormSection";
import PhotoUpload from "../../components/common/PhotoUpload/PhotoUpload";
import type { FormiksTypes, AdFormTypes } from "../../types/forms";

const AdForm = ({
  formik,
  type,
  imageFileRef,
}: FormiksTypes<AdFormTypes> & {
  type?: "addAd" | "editAd";
  imageFileRef?: React.MutableRefObject<File | null>;
}) => {
  const { t } = useTranslation("forms/ad_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const isEdit = type === "editAd";

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* Basic Information Section */}
      <FormSection title={t("basicInformation")}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("titleEn")}
            name="title_en"
            placeholder={t("titleEnPlaceholder")}
          />
          <Input
            formik={formik}
            label={t("titleAr")}
            name="title_ar"
            placeholder={t("titleArPlaceholder")}
          />
          <Input
            formik={formik}
            label={t("descriptionEn")}
            name="description_en"
            placeholder={t("descriptionEnPlaceholder")}
            rows={4}
            optional
          />
          <Input
            formik={formik}
            label={t("descriptionAr")}
            name="description_ar"
            placeholder={t("descriptionArPlaceholder")}
            rows={4}
            optional
          />
          <Input
            formik={formik}
            label={t("link")}
            name="link"
            placeholder={t("linkPlaceholder")}
            optional
          />
        </Box>
      </FormSection>

      {/* Image Section */}
      <FormSection title={t("image")}>
        <Box className="grid justify-stretch items-start gap-5">
          <PhotoUpload
            value={isEdit ? formik.values.image_url || null : undefined}
            photoFileRef={imageFileRef}
            formik={formik}
            name="title_en"
            size={200}
            onRemove={() => {
              if (isEdit) {
                formik.setFieldValue("image_url", null);
              }
            }}
          />
        </Box>
      </FormSection>

      {/* Settings Section */}
      <FormSection title={t("settings")}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.is_active}
                onChange={formik.handleChange}
                name="is_active"
              />
            }
            label={t("isActive")}
          />
          <Input
            formik={formik}
            label={t("order")}
            name="order"
            type="number"
            placeholder={t("orderPlaceholder")}
          />
          <Input
            formik={formik}
            label={t("validFrom")}
            name="valid_from"
            type="date"
            placeholder={t("validFromPlaceholder")}
            optional
          />
          <Input
            formik={formik}
            label={t("validUntil")}
            name="valid_until"
            type="date"
            placeholder={t("validUntilPlaceholder")}
            optional
          />
        </Box>
      </FormSection>

      {/* Submit Button */}
      <Box className="flex justify-end gap-4">
        <SubmitButton
          loading={isLoading}
          variant="basic"
          disabled={isLoading}
        >
          {t("cancel")}
        </SubmitButton>
        <SubmitButton
          loading={isLoading}
          disabled={isLoading}
        >
          {isEdit ? t("updateAd") : t("createAd")}
        </SubmitButton>
      </Box>
    </Box>
  );
};

export default AdForm;

