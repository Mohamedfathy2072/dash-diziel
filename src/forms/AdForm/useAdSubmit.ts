import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { createAd, updateAd } from "../../store/adsSlice";
import { useFormsStore } from "../../globals/formsStore";
import { handleToaster } from "../../functions/handleToaster";
import { handleApiError } from "../../utils/errorHandler";
import type { AdFormTypes } from "../../types/forms";
import type { AppDispatch } from "../../store/store";
import { useParams } from "react-router-dom";

const useAdSubmit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("forms/ad_form");
  const { id } = useParams();
  const setLoading = useFormsStore((state) => state.setLoading);
  const isLoading = useFormsStore((state) => state.isLoading);

  const addAd = async (values: AdFormTypes & { imageFile?: File | null }) => {
    if (isLoading) return;
    
    setLoading(true);
    try {
      // Prepare FormData for image upload
      const formData = new FormData();
      formData.append("title_ar", values.title_ar);
      formData.append("title_en", values.title_en);
      if (values.description_ar) formData.append("description_ar", values.description_ar);
      if (values.description_en) formData.append("description_en", values.description_en);
      if (values.link) formData.append("link", values.link);
      
      // Add image file from ref if provided
      if (values.imageFile && values.imageFile instanceof File) {
        formData.append("image", values.imageFile);
      }
      
      formData.append("is_active", values.is_active ? "1" : "0");
      if (values.valid_from) formData.append("valid_from", values.valid_from);
      if (values.valid_until) formData.append("valid_until", values.valid_until);
      formData.append("order", values.order?.toString() || "0");

      await dispatch(createAd(formData)).unwrap();
      handleToaster({
        msg: t("ad_created_successfully"),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_ADS_ROUTE || "/ads"}`);
    } catch (error: any) {
      handleApiError(error, {
        action: "create",
        entity: "ad",
        namespace: "forms/ad_form",
      });
    } finally {
      setLoading(false);
    }
  };

  const editAd = async (values: AdFormTypes & { imageFile?: File | null }) => {
    if (isLoading || !id) return;
    
    setLoading(true);
    try {
      // Prepare FormData for image upload
      const formData = new FormData();
      formData.append("title_ar", values.title_ar);
      formData.append("title_en", values.title_en);
      if (values.description_ar) formData.append("description_ar", values.description_ar);
      if (values.description_en) formData.append("description_en", values.description_en);
      if (values.link) formData.append("link", values.link);
      
      // Add image file from ref if provided (new image upload)
      if (values.imageFile && values.imageFile instanceof File) {
        formData.append("image", values.imageFile);
      } else if (!values.image_url) {
        // If no new image and image_url is null (user removed it via PhotoUpload), remove the image
        formData.append("remove_image", "1");
      }
      
      formData.append("is_active", values.is_active ? "1" : "0");
      if (values.valid_from) formData.append("valid_from", values.valid_from);
      if (values.valid_until) formData.append("valid_until", values.valid_until);
      formData.append("order", values.order?.toString() || "0");

      await dispatch(updateAd({ id: +id, data: formData })).unwrap();
      handleToaster({
        msg: t("ad_updated_successfully"),
        status: "success",
      });
      navigate(`${import.meta.env.VITE_ADS_ROUTE || "/ads"}/${id}`);
    } catch (error: any) {
      handleApiError(error, {
        action: "update",
        entity: "ad",
        namespace: "forms/ad_form",
      });
    } finally {
      setLoading(false);
    }
  };

  return { addAd, editAd };
};

export default useAdSubmit;

