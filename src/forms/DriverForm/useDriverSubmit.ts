import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { handleToaster } from "../../functions/handleToaster";
import { handleApiError } from "../../utils/errorHandler";
import type { AppDispatch } from "../../store/store";
import { createDriver, updateDriver, getDrivers } from "../../store/driversSlice";
import type { DriverFormTypes } from "../../types/forms";

const useDriverSubmit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation("forms/driver_form");

  // Map frontend document keys to backend document types
  const mapDocumentType = (frontendKey: string): string => {
    const typeMap: { [key: string]: string } = {
      'drivers_license_front': 'drivers_license',
      'drivers_license_back': 'drivers_license',
      'national_id_front': 'identity_proof',
      'national_id_back': 'identity_proof',
      'power_of_attorney_front': 'other',
      'power_of_attorney_back': 'other',
      'vehicle_license_front': 'vehicle_registration',
      'vehicle_license_back': 'vehicle_registration',
      'insurance_certificate': 'insurance_certificate',
      'vehicle_photo': 'vehicle_photo',
      'residence_card_front': 'address_proof',
      'residence_card_back': 'address_proof',
    };
    return typeMap[frontendKey] || frontendKey;
  };

  const addDriver = async (values: DriverFormTypes & { 
    photoFile?: File | null;
    documents?: { [key: string]: File | null };
  }) => {
    console.log("addDriver called with values:", values);
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'photoFile' && key !== 'documents' && value !== null && value !== undefined && value !== '') {
          // Convert governorate_id to string if it's a number
          if (key === 'governorate_id' && typeof value === 'number') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value as string);
          }
        }
      });

      // Add photo file if provided
      if (values.photoFile && values.photoFile instanceof File) {
        formData.append('photo', values.photoFile);
      }

      // Add documents if provided
      if (values.documents) {
        let docIndex = 0;
        Object.entries(values.documents).forEach(([docKey, file]) => {
          if (file && file instanceof File) {
            const backendType = mapDocumentType(docKey);
            formData.append(`documents[${docIndex}][file]`, file);
            formData.append(`documents[${docIndex}][type]`, backendType);
            docIndex++;
          }
        });
      }

      await dispatch(createDriver(formData as any)).unwrap();
      handleToaster({ msg: t("add_submit_success", { defaultValue: "Driver created successfully" }), status: "success" });
      // Refresh drivers list
      dispatch(getDrivers({ page: 1, limit: 10 }));
      navigate(`${import.meta.env.VITE_DRIVERS_ROUTE}`);
    } catch (error: any) {
      handleApiError(error, {
        action: "create",
        entity: "driver",
        namespace: "forms/driver_form",
      });
    }
  };

  const editDriver = async (values: DriverFormTypes & { 
    photoFile?: File | null;
    documents?: { [key: string]: File | null };
  }) => {
    console.log("editDriver called with values:", values);
    console.log("Driver ID:", id);
    try {
      if (!id) {
        console.error("editDriver: No driver ID provided");
        handleToaster({ 
          msg: t("edit_submit_error", { defaultValue: "Driver ID is required" }), 
          status: "error" 
        });
        return;
      }

      console.log("editDriver: Creating FormData");
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'photoFile' && key !== 'documents' && value !== null && value !== undefined && value !== '') {
          // Convert governorate_id to string if it's a number
          if (key === 'governorate_id' && typeof value === 'number') {
            formData.append(key, value.toString());
          } else {
            formData.append(key, value as string);
          }
        }
      });

      // Add photo file if provided
      if (values.photoFile && values.photoFile instanceof File) {
        formData.append('photo', values.photoFile);
      } else if (!values.photo_url) {
        // If no new photo and photo_url is null (user removed it via PhotoUpload), remove the photo
        formData.append('remove_photo', '1');
      }

      // Add documents if provided
      if (values.documents) {
        let docIndex = 0;
        Object.entries(values.documents).forEach(([docKey, file]) => {
          if (file && file instanceof File) {
            const backendType = mapDocumentType(docKey);
            formData.append(`documents[${docIndex}][file]`, file);
            formData.append(`documents[${docIndex}][type]`, backendType);
            docIndex++;
          }
        });
      }

      console.log("editDriver: Dispatching updateDriver action");
      console.log("editDriver: FormData entries:", Array.from(formData.entries()).map(([key, value]) => [key, value instanceof File ? `File: ${value.name}` : value]));
      
      await dispatch(updateDriver({ id: +id, data: formData as any })).unwrap();
      
      console.log("editDriver: Driver updated successfully");
      handleToaster({ msg: t("edit_submit_success", { defaultValue: "Driver updated successfully" }), status: "success" });
      navigate(`${import.meta.env.VITE_DRIVERS_ROUTE}/${id}`);
    } catch (error: any) {
      console.error("editDriver: Error updating driver:", error);
      handleApiError(error, {
        action: "update",
        entity: "driver",
        namespace: "forms/driver_form",
      });
    }
  };

  return { addDriver, editDriver };
};

export default useDriverSubmit;
