import { useMemo } from "react";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import type { AdFormTypes } from "../../types/forms";
import type { Ad } from "../../types/domain";

const useAdSchema = (isEdit: boolean, ad?: Ad | null) => {
  const { t } = useTranslation("forms/ad_form");
  const AdInitialValues: AdFormTypes = useMemo(() => {
    if (isEdit && ad) {
      return {
        title_ar: ad.title_ar || "",
        title_en: ad.title_en || "",
        description_ar: ad.description_ar || "",
        description_en: ad.description_en || "",
        link: ad.link || "",
        image: null,
        image_url: ad.image_url || null,
        is_active: ad.is_active ?? true,
        valid_from: ad.valid_from ? new Date(ad.valid_from).toISOString().split('T')[0] : "",
        valid_until: ad.valid_until ? new Date(ad.valid_until).toISOString().split('T')[0] : "",
        order: ad.order ?? 0,
      };
    }
    return {
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      link: "",
      image: null,
      image_url: null,
      is_active: true,
      valid_from: "",
      valid_until: "",
      order: 0,
    };
  }, [isEdit, ad]);

  const AdSchema = useMemo(
    () =>
      Yup.object().shape({
        title_ar: Yup.string()
          .required(t("title_ar_required"))
          .max(255, t("title_ar_max")),
        title_en: Yup.string()
          .required(t("title_en_required"))
          .max(255, t("title_en_max")),
        description_ar: Yup.string()
          .max(1000, t("description_ar_max")),
        description_en: Yup.string()
          .max(1000, t("description_en_max")),
        link: Yup.string()
          .url(t("link_invalid"))
          .max(500, t("link_max")),
        image: Yup.mixed<File>()
          .nullable()
          .test("fileSize", t("image_size_max"), (value) => {
            if (!value || !(value instanceof File)) return true;
            return value.size <= 5 * 1024 * 1024;
          })
          .test("fileType", t("image_type_invalid"), (value) => {
            if (!value || !(value instanceof File)) return true;
            return ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"].includes(value.type);
          }),
        is_active: Yup.boolean(),
        valid_from: Yup.string()
          .nullable(),
        valid_until: Yup.string()
          .nullable()
          .when("valid_from", {
            is: (val: string) => val && val.length > 0,
            then: (schema) => schema.test(
              "after-valid-from",
              t("valid_until_after"),
              function (value) {
                const { valid_from } = this.parent;
                if (!value || !valid_from) return true;
                return new Date(value) > new Date(valid_from);
              }
            ),
          }),
        order: Yup.number()
          .integer(t("order_integer"))
          .min(0, t("order_min"))
          .nullable(),
      }),
    [t]
  );

  return { AdInitialValues, AdSchema };
};

export default useAdSchema;

