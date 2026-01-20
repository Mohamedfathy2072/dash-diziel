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
import {vehicleService} from "../../services/api" 
import axios from "axios";
import i18n from "../../i18n"
import { useState } from "react";
import {toast} from "react-hot-toast"

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
  license_front: File | null;
  license_back: File | null;
  four_sides: (File | null)[];
   }>({
  license_front: null,
  license_back: null,
  four_sides: [null, null, null, null], // placeholder for four sides
  });

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
      four_sides?: (File | null)[];
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
  };
}

  const handlePhotoChange = (
    file: File | null,
    key: "license_front" | "license_back"
  ) => {
    setPhotos(prev => ({
      ...prev,
      [key]: file,
    }));
    console.log("2photo",photos)
  };

  const payload: VehiclePayload = {
  driver_id: formik.values.driver_id,
  make: formik.values.make,
  color: formik.values.color,
  vehicle_type_id: formik.values.vehicle_type_id,
  head: {
    ...formik.values.head, // all head fields from the form
    photos: {
      license_front: photos.license_front,
      license_back: photos.license_back,
      four_sides: photos.four_sides.filter(f => f !== null)
    }
  },
  trailer: {
    ...formik.values.trailer // all trailer fields from the form
  }
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

  if (photos.license_front) formData.append("photos[license_front]", photos.license_front);
  if (photos.license_back) formData.append("photos[license_back]", photos.license_back);

  photos.four_sides.forEach((file, idx) => {
    if (file) formData.append(`photos[four_sides][${idx}]`, file);
    console.log("formdata",formData)
  });
};


   
const handleCreateVehicle = async (payload: VehiclePayload) => {
  try {
    const formData = new FormData();

    // 1️⃣ Top-level fields
    formData.append("driver_id", String(payload.driver_id));
    formData.append("make", payload.make);
    formData.append("color", payload.color || "");
    formData.append("vehicle_type_id", String(payload.vehicle_type_id));

    // 2️⃣ Head fields
    Object.entries(payload.head).forEach(([key, value]) => {
      if (key === "photos" && value) {
        // Tell TS this is the photos object
        const photos = value as {
          license_front?: File | null;
          license_back?: File | null;
          four_sides?: (File | null)[];
        };

        if (photos.license_front) {
          formData.append("head[photos][license_front]", photos.license_front);
        }

        if (photos.license_back) {
          formData.append("head[photos][license_back]", photos.license_back);
        }

        photos.four_sides?.forEach((file, idx) => {
          if (file) {
            formData.append(`head[photos][four_sides][${idx}]`, file);
          }
        });
      } else {
        // Cast value to string for FormData
        formData.append(`head[${key}]`, String(value));
      }
    });

    // 3️⃣ Trailer fields
    Object.entries(payload.trailer).forEach(([key, value]) => {
      formData.append(`trailer[${key}]`, String(value));
    });

    // 4️⃣ Call the API
    const response = await vehicleService.create(formData);
    console.log("Vehicle created:", response);

    toast.success("Vehicle created successfully!");
  } catch (error: any) {
    console.error("Error creating vehicle:", error);
    toast.error(error?.message || "Failed to create vehicle");
  }
};



  return (
    <Box className="grid justify-stretch items-start gap-6">
       
      <FormSection title={t("", { defaultValue: "المعلومات الأساسية" })}>
    <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">

    <Input
      formik={formik}
      label={t("", { defaultValue: "رقم السائق" })}
      name="driver_id"
      type="number"
      placeholder={t("", { defaultValue: "أدخل رقم السائق" })}
    />

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
      label={t("", { defaultValue: "رقم الشاصي" })}
      name="head.chassis_number"
      placeholder={t("", { defaultValue: "أدخل رقم الشاصي" })}
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
      label={t("", { defaultValue: "رقم الشاصي" })}
      name="trailer.chassis_number"
      placeholder={t("", { defaultValue: "أدخل رقم الشاصي" })}
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
        </FormSection>

    
      <FormSection title={t("documents", { defaultValue: "Documents" })}>
         <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <DocumentUpload
            type="license_front"
                  label="رخصة القيادة (أمام)"
                 value={photos.license_front}
           onChange={(file) => handlePhotoChange(file, "license_front")}  />
          
          <DocumentUpload
               type="license_back"
               label="رخصة القيادة (خلف)"
               value={photos.license_back}
             onChange={(file) => handlePhotoChange(file, "license_back")}
             />
          
                  {photos.four_sides.map((file, idx) => (
                      <DocumentUpload
                           key={idx}
                           type={`four_sides_${idx}`}
                           label={`Side ${idx + 1}`}
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
            onClick={()=>{handleCreateVehicle(payload)}}
          >
          {t("", { defaultValue: "انشاء مركبة" })}
        </BasicButton>
      </Box>
    </Box>
  );
};

export default VehicleForm;
