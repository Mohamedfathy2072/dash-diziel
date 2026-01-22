import Box from "@mui/material/Box";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import FormSection from "../../components/common/FormSection/FormSection";
import type { FormiksTypes, VehicleFormTypes } from "../../types/forms";
import { VEHICLE_STATUSES, VEHICLE_VERIFICATION_STATUSES } from "../../types/enums";
import DocumentUpload from "../../components/common/DocumentUpload/DocumentUpload";
import useVehicleTypes from "../../hooks/useVehicleTypes";
import {vehicleService, driverService} from "../../services/api" 
import axios from "axios";
import i18n from "../../i18n"
import { useState, useEffect } from "react";
import {toast} from "react-hot-toast"
import AutocompleteSelect from "../../components/Input/AutocompleteSelect";
import type { Driver } from "../../types/domain";
import { handleApiError } from "../../utils/errorHandler";

// const createAxios=axios.create({
//     baseURL: 'http://localhost:8000/api/v1',
//     withCredentials: true,
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//       'Accept-Language': i18n.language || 'en',
//     },
//   });



const VehicleForm = ({
  formik,
  type,
}: FormiksTypes<VehicleFormTypes> & {
  type?: "addVehicle" | "editVehicle";
}) => {
  const { t } = useTranslation("forms/vehicle_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const navigate = useNavigate();
  const isEdit = type === "editVehicle";
  const { activeVehicleTypes } = useVehicleTypes();
  const [photos, setPhotos] = useState<{
    head_license_front: File | null;
    head_license_back: File | null;
    trailer_license_front: File | null;
    trailer_license_back: File | null;
    four_sides: (File | null)[];
  }>({
    head_license_front: null,
    head_license_back: null,
    trailer_license_front: null,
    trailer_license_back: null,
    four_sides: [null, null, null, null], // Four sides for the whole vehicle
  });
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(false);

  // Fetch drivers on component mount
  useEffect(() => {
    setLoadingDrivers(true);
    driverService.getAll(1, 1000)
      .then((response) => {
        const driversData = response.data.data?.data || [];
        setDrivers(Array.isArray(driversData) ? driversData : []);
      })
      .catch((error) => {
        console.error("Error fetching drivers:", error);
        setDrivers([]);
      })
      .finally(() => {
        setLoadingDrivers(false);
      });
  }, []);

  interface VehiclePayload {
  driver_id: number;
  make: string;
  color: string | null;
  vehicle_type_id: number;
  head: {
    model: string;
    year: number;
    license_plate: string;
    chassis_number: string;
    engine_number: string;
    number_of_axles: number;
    max_load: number;
    length: number;
    photos: {
      license_front?: File | null;
      license_back?: File | null;
    };
  };
  trailer: {
    model: string;
    year: number;
    license_plate: string;
    chassis_number: string;
    number_of_axles: number;
    max_load: number;
    length: number;
    photos: {
      license_front?: File | null;
      license_back?: File | null;
    };
  };
  four_sides: (File | null)[];
}

  const handlePhotoChange = (
    file: File | null,
    key: "head_license_front" | "head_license_back" | "trailer_license_front" | "trailer_license_back"
  ) => {
    console.log(`Setting photo for ${key}:`, file ? file.name : 'null');
    setPhotos(prev => {
      const updated = {
        ...prev,
        [key]: file,
      };
      console.log('Updated photos state:', updated);
      return updated;
    });
  };

  // Build payload function to get fresh photos state
  const buildPayload = (): VehiclePayload => {
    const payload = {
      driver_id: formik.values.driver_id,
      make: formik.values.make,
      color: formik.values.color,
      vehicle_type_id: formik.values.vehicle_type_id,
      head: {
        ...formik.values.head, // all head fields from the form
        photos: {
          license_front: photos.head_license_front,
          license_back: photos.head_license_back,
        }
      },
      trailer: {
        ...formik.values.trailer, // all trailer fields from the form
        photos: {
          license_front: photos.trailer_license_front,
          license_back: photos.trailer_license_back,
        }
      },
      four_sides: photos.four_sides.filter(f => f !== null) as File[]
    };
    
    // Debug: Log photos to verify they're being captured
    console.log("🔵 Photos state:", photos);
    console.log("🔵 Payload photos:", {
      head: payload.head.photos,
      trailer: payload.trailer.photos,
      four_sides: payload.four_sides
    });
    
    return payload;
  };
  

 const formData = new FormData();



  const handleFourSidesChange = (file: File | null, index: number) => {
  setPhotos(prev => {
    const updated = [...prev.four_sides];
    updated[index] = file;
    return { ...prev, four_sides: updated };
  });
};


const handleSubmit =() => {
  const formData = new FormData();

  if (photos.head_license_front) formData.append("head[photos][license_front]", photos.head_license_front);
  if (photos.head_license_back) formData.append("head[photos][license_back]", photos.head_license_back);
  if (photos.trailer_license_front) formData.append("trailer[photos][license_front]", photos.trailer_license_front);
  if (photos.trailer_license_back) formData.append("trailer[photos][license_back]", photos.trailer_license_back);

  photos.four_sides.forEach((file, idx) => {
    if (file) formData.append(`photos[four_sides][${idx}]`, file);
  });
};


   
const handleCreateVehicle = async (payload: VehiclePayload) => {
  try {
    // Use a closure to capture the current photos state
    const currentPhotos = photos;
    
    console.log("🔵 Current photos state:", currentPhotos);
    
    const formData = new FormData();

    // 1️⃣ Top-level fields
    formData.append("driver_id", String(payload.driver_id));
    formData.append("make", payload.make);
    formData.append("color", payload.color || "");
    formData.append("vehicle_type_id", String(payload.vehicle_type_id));

    // 2️⃣ Head fields (excluding photos)
    Object.entries(payload.head).forEach(([key, value]) => {
      if (key !== "photos") {
        // Skip null values or convert to empty string
        if (value === null || value === undefined || value === "null") {
          return;
        }
        formData.append(`head[${key}]`, String(value));
      }
    });

    // 2️⃣ Head photos - use captured photos state
    if (currentPhotos.head_license_front && currentPhotos.head_license_front instanceof File) {
      formData.append("head[photos][license_front]", currentPhotos.head_license_front);
      console.log("✅ Head license front:", currentPhotos.head_license_front.name, currentPhotos.head_license_front.size, "bytes");
    } else {
      console.log("❌ Head license front is missing or not a File:", currentPhotos.head_license_front);
    }

    if (currentPhotos.head_license_back && currentPhotos.head_license_back instanceof File) {
      formData.append("head[photos][license_back]", currentPhotos.head_license_back);
      console.log("✅ Head license back:", currentPhotos.head_license_back.name, currentPhotos.head_license_back.size, "bytes");
    } else {
      console.log("❌ Head license back is missing or not a File:", currentPhotos.head_license_back);
    }

    // 3️⃣ Trailer fields (excluding photos)
    Object.entries(payload.trailer).forEach(([key, value]) => {
      if (key !== "photos") {
        // Skip null values or convert to empty string
        if (value === null || value === undefined || value === "null") {
          return;
        }
        formData.append(`trailer[${key}]`, String(value));
      }
    });

    // 3️⃣ Trailer photos - use captured photos state
    if (currentPhotos.trailer_license_front && currentPhotos.trailer_license_front instanceof File) {
      formData.append("trailer[photos][license_front]", currentPhotos.trailer_license_front);
      console.log("✅ Trailer license front:", currentPhotos.trailer_license_front.name, currentPhotos.trailer_license_front.size, "bytes");
    } else {
      console.log("❌ Trailer license front is missing or not a File:", currentPhotos.trailer_license_front);
    }

    if (currentPhotos.trailer_license_back && currentPhotos.trailer_license_back instanceof File) {
      formData.append("trailer[photos][license_back]", currentPhotos.trailer_license_back);
      console.log("✅ Trailer license back:", currentPhotos.trailer_license_back.name, currentPhotos.trailer_license_back.size, "bytes");
    } else {
      console.log("❌ Trailer license back is missing or not a File:", currentPhotos.trailer_license_back);
    }

    // 4️⃣ Four sides photos - use captured photos state
    currentPhotos.four_sides.forEach((file, idx) => {
      if (file && file instanceof File) {
        formData.append(`photos[four_sides][${idx}]`, file);
        console.log(`✅ Four sides ${idx}:`, file.name, file.size, "bytes");
      } else {
        console.log(`❌ Four sides ${idx} is missing or not a File:`, file);
      }
    });

    // Debug: Log FormData contents
    console.log("🔵 FormData entries:");
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }

    // 5️⃣ Call the API with proper headers for FormData
    const client = vehicleService.create;
    const response = await client(formData);
    console.log("✅ Vehicle created:", response);

    toast.success("تم إنشاء المركبة بنجاح!");
    navigate(`${import.meta.env.VITE_VEHICLES_ROUTE}`);
  } catch (error: any) {
    console.error("❌ Error creating vehicle:", error);
    
    // Handle validation errors
    if (error?.response?.status === 422) {
      const errorData = error.response.data;
      const errors = errorData?.errors || {};
      
      // Build error message from validation errors
      const errorMessages: string[] = [];
      Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages)) {
          messages.forEach((msg: string) => errorMessages.push(msg));
        } else if (typeof messages === 'string') {
          errorMessages.push(messages);
        }
      });
      
      if (errorMessages.length > 0) {
        // Show first few errors
        const displayMessage = errorMessages.slice(0, 5).join('\n');
        toast.error(displayMessage, { duration: 5000 });
        
        // Also log all errors
        console.error("Validation errors:", errors);
      } else {
        toast.error(errorData?.message || "فشل التحقق من البيانات");
      }
    } else {
      // Use handleApiError for other errors
      handleApiError(error, {
        action: "create",
        entity: "vehicle",
        namespace: "forms/vehicle_form",
        showToast: true,
      });
    }
  }
};



  return (
    <Box className="grid justify-stretch items-start gap-6">
       
      <FormSection title={t("", { defaultValue: "المعلومات الأساسية" })}>
    <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">

    <Box className="grid justify-stretch w-full items-center gap-1">
      <AutocompleteSelect
        formik={formik}
        name="driver_id"
        label={t("", { defaultValue: "السائق" })}
        placeholder={t("", { defaultValue: "اختر السائق" })}
        options={drivers.map((driver) => {
          const name = driver.name || "Unknown";
          return `${name}${driver.phone ? ` - ${driver.phone}` : ""}`;
        })}
        values={drivers.map((driver) => driver.id.toString())}
        loading={loadingDrivers}
        value={formik.values.driver_id?.toString() || ""}
        change={(value) => {
          formik.setFieldValue("driver_id", value ? Number(value) : null);
        }}
        error={formik.touched.driver_id && Boolean(formik.errors.driver_id)}
        helperText={formik.touched.driver_id && formik.errors.driver_id ? String(formik.errors.driver_id) : undefined}
      />
    </Box>

    <Input
      formik={formik}
      label={t("", { defaultValue: "الشركة المصنعة" })}
      name="make"
      placeholder={t("", { defaultValue: "أدخل الشركة المصنعة" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "اللون" })}
      name="color"
      placeholder={t("", { defaultValue: "أدخل اللون" })}
      optional
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "نوع المركبة" })}
      name="vehicle_type_id"
      select
      options={activeVehicleTypes.map(vt => vt.name)}
      values={activeVehicleTypes.map(vt => vt.id.toString())}
      placeholder={t("", { defaultValue: "اختر نوع المركبة" })}
    />

  </Box>
      </FormSection>

      <FormSection title={t("", { defaultValue: "رأس الشاحنة" })}>
  <Box className="grid grid-cols-2 md:grid-cols-1 gap-5">

    <Input
      formik={formik}
      label={t("", { defaultValue: "الموديل" })}
      name="head.model"
      placeholder={t("", { defaultValue: "أدخل موديل الرأس" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "سنة الصنع" })}
      name="head.year"
      type="number"
      placeholder={t("", { defaultValue: "أدخل سنة الصنع" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "رقم اللوحة" })}
      name="head.license_plate"
      placeholder={t("", { defaultValue: "أدخل رقم اللوحة" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "رقم الشاسيه" })}
      name="head.chassis_number"
      placeholder={t("", { defaultValue: "أدخل رقم الشاسيه" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "رقم المحرك" })}
      name="head.engine_number"
      placeholder={t("", { defaultValue: "أدخل رقم المحرك" })}
      optional
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "عدد المحاور" })}
      name="head.number_of_axles"
      type="number"
      placeholder={t("", { defaultValue: "أدخل عدد المحاور" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "الحمولة القصوى (طن)" })}
      name="head.max_load"
      type="number"
      placeholder={t("", { defaultValue: "أدخل الحمولة القصوى" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "الطول (متر)" })}
      name="head.length"
      type="number"
      placeholder={t("", { defaultValue: "أدخل الطول" })}
    />

  </Box>
  
  {/* Head License Photos */}
  <Box className="grid grid-cols-2 md:grid-cols-1 gap-5 mt-5">
    <DocumentUpload
      type="head_license_front"
      label="رخصة المركبة - الرأس (أمام)"
      value={photos.head_license_front}
      onChange={(file) => handlePhotoChange(file, "head_license_front")}
    />
    <DocumentUpload
      type="head_license_back"
      label="رخصة المركبة - الرأس (خلف)"
      value={photos.head_license_back}
      onChange={(file) => handlePhotoChange(file, "head_license_back")}
    />
  </Box>
      </FormSection>

        <FormSection title={t("", { defaultValue: "المقطورة" })}>
  <Box className="grid grid-cols-2 md:grid-cols-1 gap-5">

    <Input
      formik={formik}
      label={t("", { defaultValue: "موديل المقطورة" })}
      name="trailer.model"
      placeholder={t("", { defaultValue: "أدخل موديل المقطورة" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "سنة الصنع" })}
      name="trailer.year"
      type="number"
      placeholder={t("", { defaultValue: "أدخل سنة الصنع" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "رقم اللوحة" })}
      name="trailer.license_plate"
      placeholder={t("", { defaultValue: "أدخل رقم اللوحة" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "رقم الشاسيه" })}
      name="trailer.chassis_number"
      placeholder={t("", { defaultValue: "أدخل رقم الشاسيه" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "عدد المحاور" })}
      name="trailer.number_of_axles"
      type="number"
      placeholder={t("", { defaultValue: "أدخل عدد المحاور" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "الحمولة القصوى (طن)" })}
      name="trailer.max_load"
      type="number"
      placeholder={t("", { defaultValue: "أدخل الحمولة القصوى" })}
    />

    <Input
      formik={formik}
      label={t("", { defaultValue: "الطول (متر)" })}
      name="trailer.length"
      type="number"
      placeholder={t("", { defaultValue: "أدخل الطول" })}
    />

  </Box>
  
  {/* Trailer License Photos */}
  <Box className="grid grid-cols-2 md:grid-cols-1 gap-5 mt-5">
    <DocumentUpload
      type="trailer_license_front"
      label="رخصة المركبة - المقطورة (أمام)"
      value={photos.trailer_license_front}
      onChange={(file) => handlePhotoChange(file, "trailer_license_front")}
    />
    <DocumentUpload
      type="trailer_license_back"
      label="رخصة المركبة - المقطورة (خلف)"
      value={photos.trailer_license_back}
      onChange={(file) => handlePhotoChange(file, "trailer_license_back")}
    />
  </Box>
        </FormSection>

    
      <FormSection title={t("", { defaultValue: "الأربع جوانب للعربة" })}>
         <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
                  {photos.four_sides.map((file, idx) => (
                      <DocumentUpload
                           key={idx}
                           type={`four_sides_${idx}`}
                           label={`الجانب ${idx + 1}`}
                          value={file}
                        onChange={(f) => handleFourSidesChange(f, idx)}
                        />
              ))
               }
          </Box>
      </FormSection>

      
     

      {/* Form Actions */}
      <Box className="flex justify-end items-center gap-3">
        <BasicButton onClick={() => navigate(`${import.meta.env.VITE_VEHICLES_ROUTE}`)}>
          {t("cancel", { defaultValue: "Cancel" })}
        </BasicButton>
        {/* <SubmitButton loading={isLoading}>
          {isEdit
            ? t("update", { defaultValue: "Update Vehicle" })
            : t("create", { defaultValue: "Create Vehicle" })}
        </SubmitButton> */}
         <BasicButton
          // onClick={()=>handleCreateVehicle(formik.values)}
            onClick={()=>{handleCreateVehicle(buildPayload())}}
          >
          {t("", { defaultValue: "انشاء مركبة" })}
        </BasicButton>
      </Box>
    </Box>
  );
};

export default VehicleForm;
