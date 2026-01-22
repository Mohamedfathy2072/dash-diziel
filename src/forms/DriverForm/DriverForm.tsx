import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { data, useNavigate } from "react-router-dom";
import Input from "../../components/Input/Input";
import PhoneNumberInput from "../../components/PhoneNumberInput/PhoneNumberInput";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import PhotoUpload from "../../components/common/PhotoUpload/PhotoUpload";
import FormSection from "../../components/common/FormSection/FormSection";
import DocumentUpload from "../../components/common/DocumentUpload/DocumentUpload";
import type { FormiksTypes, DriverFormTypes } from "../../types/forms";
import {
  DRIVER_STATUSES,
  DRIVER_AVAILABILITY_STATUSES,
} from "../../types/enums";
import { governoratesService } from "../../services/api";

const DriverForm = ({
  formik,
  type,
  photoFileRef,
  documentsRef,
}: FormiksTypes<DriverFormTypes> & {
  type?: "addDriver" | "editDriver";
  photoFileRef?: React.MutableRefObject<File | null>;
  documentsRef?: React.MutableRefObject<{ [key: string]: File | null }>;
}) => {
  const { t } = useTranslation("forms/driver_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const navigate = useNavigate();
  const isEdit = type === "editDriver";

  // State to track document files
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({});
  
  // State for governorates
  const [governorates, setGovernorates] = useState<Array<{ id: number; name_ar: string; name_en: string }>>([]);
  const [loadingGovernorates, setLoadingGovernorates] = useState(false);

  // Fetch governorates on component mount
  useEffect(() => {
    setLoadingGovernorates(true);
    governoratesService.getAll()
      .then((response) => {
        const data = response.data?.data || response.data || [];
        setGovernorates(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Error fetching governorates:", error);
        setGovernorates([]);
      })
      .finally(() => {
        setLoadingGovernorates(false);
      });
  }, []);

  // Driver type options
  const driverTypeOptions = ["محلي", "دولي", "الاتنين معا"];
  const driverTypeValues = ["محلي", "دولي", "الاتنين معا"];

  // License degree options
  const licenseDegreeOptions = ["أولى", "ثانية", "ثالثة"];
  const licenseDegreeValues = ["أولى", "ثانية", "ثالثة"];

  const handleDocumentChange = (file: File | null, docType: string) => {
    const updated = {
      ...documents,
      [docType]: file
    };
    setDocuments(updated);
    // Update ref if provided
    if (documentsRef) {
      documentsRef.current = updated;
    }
  };

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* User Information Section */}
      <FormSection title={t("userInformation", { defaultValue: "User Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <PhotoUpload
            value={isEdit ? formik.values.photo_url : undefined}
            photoFileRef={photoFileRef}
            formik={formik}
            name="name"
            onRemove={() => {
              if (isEdit) {
                formik.setFieldValue("photo_url", null);
              }
            }}
          />
          <Input
            formik={formik}
            label={t("name", { defaultValue: "Name" })}
            name="name"
            placeholder={t("namePlaceholder", { defaultValue: "Enter name" })}
            optional={!!formik.values.user_id}
          />
          <Input
            formik={formik}
            label={t("email", { defaultValue: "Email" })}
            name="email"
            type="email"
            placeholder={t("emailPlaceholder", { defaultValue: "Enter email" })}
            optional={true}
          />
          <PhoneNumberInput
            value={formik.values.phone || ""}
            formik={formik}
            label={t("phoneNumber", { defaultValue: "Phone" })}
            name="phone"
            optional
          />
          {!isEdit && !formik.values.user_id && (
            <>
              <Input
                formik={formik}
                label={t("password", { defaultValue: "Password" })}
                name="password"
                type="password"
                placeholder={t("passwordPlaceholder", { defaultValue: "Enter password" })}
              />
              <Input
                formik={formik}
                label={t("passwordConfirmation", { defaultValue: "Confirm Password" })}
                name="password_confirmation"
                type="password"
                placeholder={t("passwordConfirmationPlaceholder", { defaultValue: "Confirm password" })}
              />
            </>
          )}
          <Input
            formik={formik}
            label={t("dateOfBirth", { defaultValue: "Date of Birth" })}
            name="date_of_birth"
            type="date"
            optional
          />
          <Input
            formik={formik}
            label={t("gender", { defaultValue: "Gender" })}
            name="gender"
            select
            options={["male", "female", "other"]}
            values={["male", "female", "other"]}
            placeholder={t("genderPlaceholder", { defaultValue: "Select gender" })}
            optional
          />
          
        </Box>
      </FormSection>
      
      {/* Driver Information Section */}
      <FormSection title={t("driverInformation", { defaultValue: "Driver Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("licenseNumber", { defaultValue: "License Number" })}
            name="license_number"
            placeholder={t("licenseNumberPlaceholder", { defaultValue: "Enter license number" })}
            optional
          />
          <Input
            formik={formik}
            label={t("licenseClass", { defaultValue: "License Class" })}
            name="license_class"
            placeholder={t("licenseClassPlaceholder", { defaultValue: "Enter license class" })}
            optional
          />
          <Input
            formik={formik}
            label={t("licenseType", { defaultValue: "License Type" })}
            name="license_type"
            placeholder={t("licenseTypePlaceholder", { defaultValue: "Enter license type" })}
            optional
          />
          <Input
            formik={formik}
            label={t("licenseIssueDate", { defaultValue: "License Issue Date" })}
            name="license_issue_date"
            type="date"
            optional
          />
          <Input
            formik={formik}
            label={t("licenseExpiryDate", { defaultValue: "License Expiry Date" })}
            name="license_expiry_date"
            type="date"
            optional
          />
          <Input
            formik={formik}
            label={t("licenseIssuingState", { defaultValue: "License Issuing State" })}
            name="license_issuing_state"
            placeholder={t("licenseIssuingStatePlaceholder", { defaultValue: "Enter issuing state" })}
            optional
          />
          <Input
            formik={formik}
            label={t("licenseIssuingCountry", { defaultValue: "License Issuing Country" })}
            name="license_issuing_country"
            placeholder={t("licenseIssuingCountryPlaceholder", { defaultValue: "Enter issuing country (3 letters max)" })}
            optional
            maxLength={3}
          />
        </Box>
      </FormSection>

      <FormSection title={t("", { defaultValue: "بيانات إضافية" })}>
  <Box className="grid grid-cols-2 md:grid-cols-1 gap-5">

    {/* العنوان */}
    {/* <Input
      formik={formik}
      name="address"
      label={t("", { defaultValue: "العنوان" })}
      placeholder={t("", { defaultValue: "أدخل العنوان" })}
    /> */}

    {/* المحافظة */}
    <Input
      formik={formik}
      name="governorate_id"
      label={t("", { defaultValue: "المحافظة" })}
      select
      options={governorates.map(g => g.name_ar || g.name_en)}
      values={governorates.map(g => g.id.toString())}
      loading={loadingGovernorates}
      placeholder={t("", { defaultValue: "اختر المحافظة" })}
      optional
      change={(value) => {
        formik.setFieldValue("governorate_id", value ? Number(value) : null);
      }}
    />

    {/* نوع السائق */}
    <Input
      formik={formik}
      name="driver_type"
      label={t("", { defaultValue: "نوع السائق" })}
      select
      options={driverTypeOptions}
      values={driverTypeValues}
      placeholder={t("", { defaultValue: "اختر نوع السائق" })}
      optional
    />

    {/* درجة الرخصة */}
    <Input
      formik={formik}
      name="license_degree"
      label={t("", { defaultValue: "درجة الرخصة" })}
      select
      options={licenseDegreeOptions}
      values={licenseDegreeValues}
      placeholder={t("", { defaultValue: "اختر درجة الرخصة" })}
      optional
    />

    {/* الرقم القومي */}
    <Input
      formik={formik}
      name="national_id"
      label={t("", { defaultValue: "الرقم القومي" })}
      placeholder={t("", { defaultValue: "أدخل الرقم القومي" })}
    />

  </Box>
      </FormSection>

      {/* Emergency Contact Section */}
      <FormSection title={t("emergencyContact", { defaultValue: "Emergency Contact" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("emergencyContactName", { defaultValue: "Emergency Contact Name" })}
            name="emergency_contact_name"
            placeholder={t("emergencyContactNamePlaceholder", { defaultValue: "Enter emergency contact name" })}
            optional
          />
          <PhoneNumberInput
            value={formik.values.emergency_contact_phone || ""}
            formik={formik}
            label={t("emergencyContactPhone", { defaultValue: "Emergency Contact Phone" })}
            name="emergency_contact_phone"
            optional
          />
        </Box>
      </FormSection>

      {/* Status Section */}
      <FormSection title={t("status", { defaultValue: "Status" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Input
            formik={formik}
            label={t("driverStatus", { defaultValue: "Driver Status" })}
            name="status"
            select
            options={DRIVER_STATUSES}
            values={DRIVER_STATUSES}
            placeholder={t("driverStatusPlaceholder", { defaultValue: "Select status" })}
            optional
          />
          <Input
            formik={formik}
            label={t("availabilityStatus", { defaultValue: "Availability Status" })}
            name="availability_status"
            select
            options={DRIVER_AVAILABILITY_STATUSES}
            values={DRIVER_AVAILABILITY_STATUSES}
            placeholder={t("availabilityStatusPlaceholder", { defaultValue: "Select availability" })}
            optional
          />
        </Box>
      </FormSection>

      {/* Documents Section */}
      <FormSection title={t("documents", { defaultValue: "Documents" })}>
        <Box className="grid justify-stretch items-start grid-cols-1 gap-6">
          <Typography variant="body2" className="!text-gray-600 !mb-2">
            {t("documentsDescription", { defaultValue: "Upload driver documents. All documents are optional." })}
          </Typography>
          
          {/* Driver's License Front */}
          <DocumentUpload
            type="drivers_license_front"
            label={t("documents.driversLicenseFront", { defaultValue: "رخصة القيادة (أمام)" })}
            onChange={handleDocumentChange}
            value={documents['drivers_license_front'] || null}
          />
          
          {/* Driver's License Back */}
          <DocumentUpload
            type="drivers_license_back"
            label={t("documents.driversLicenseBack", { defaultValue: "رخصة القيادة (خلف)" })}
            onChange={handleDocumentChange}
            value={documents['drivers_license_back'] || null}
          />
          
          {/* National ID Front */}
          <DocumentUpload
            type="national_id_front"
            label={t("documents.nationalIdFront", { defaultValue: "الهوية الوطنية (أمام)" })}
            onChange={handleDocumentChange}
            value={documents['national_id_front'] || null}
          />
          
          {/* National ID Back */}
          <DocumentUpload
            type="national_id_back"
            label={t("documents.nationalIdBack", { defaultValue: "الهوية الوطنية (خلف)" })}
            onChange={handleDocumentChange}
            value={documents['national_id_back'] || null}
          />
          
          {/* Power of Attorney Front (Optional) */}
          {/* <DocumentUpload
            type="power_of_attorney_front"
            label={t("documents.powerOfAttorneyFront", { defaultValue: "الوكالة (أمام) – اختياري" })}
            onChange={handleDocumentChange}
            value={documents['power_of_attorney_front'] || null}
          /> */}
          
          {/* Power of Attorney Back (Optional) */}
          {/* <DocumentUpload
            type="power_of_attorney_back"
            label={t("documents.powerOfAttorneyBack", { defaultValue: "الوكالة (خلف) – اختياري" })}
            onChange={handleDocumentChange}
            value={documents['power_of_attorney_back'] || null}
          /> */}
          
          {/* Vehicle License Front */}
          {/* <DocumentUpload
            type="vehicle_license_front"
            label={t("documents.vehicleLicenseFront", { defaultValue: "رخصة المركبة (وجه)" })}
            onChange={handleDocumentChange}
            value={documents['vehicle_license_front'] || null}
          /> */}
          
          {/* Vehicle License Back */}
          {/* <DocumentUpload
            type="vehicle_license_back"
            label={t("documents.vehicleLicenseBack", { defaultValue: "رخصة المركبة (خلف)" })}
            onChange={handleDocumentChange}
            value={documents['vehicle_license_back'] || null}
          /> */}
          
          {/* Insurance Certificate */}
          {/* <DocumentUpload
            type="insurance_certificate"
            label={t("documents.insuranceCertificate", { defaultValue: "شهادة التأمين" })}
            onChange={handleDocumentChange}
            value={documents['insurance_certificate'] || null}
          /> */}
          
          {/* Vehicle Photos */}
          {/* <DocumentUpload
            type="vehicle_photo"
            label={t("documents.vehiclePhotos", { defaultValue: "صور المركبة" })}
            onChange={handleDocumentChange}
            value={documents['vehicle_photo'] || null}
          />
           */}
          {/**/}
          <DocumentUpload
            type="residence_card_front"
            label={"الصحيفة الجنائية"}
            onChange={handleDocumentChange}
            value={documents['residence_card_front'] || null}
          />
          
          {/**/}
          <DocumentUpload
            type="residence_card_back"
            label={"تحليل المخدرات"}
            onChange={handleDocumentChange}
            value={documents['residence_card_back'] || null}
          />
        </Box>
      </FormSection>

      {/* Action Buttons */}
      <Paper className="paper !bg-gray-50">
        <Box className="flex justify-end items-center gap-4 flex-wrap">
          <BasicButton
            type="button"
            onClick={() => navigate(`${import.meta.env.VITE_DRIVERS_ROUTE}`)}
            className="!min-w-[120px] !px-6 !py-2.5 hover:!shadow-md transition-all"
          >
            {t("cancel", { defaultValue: "Cancel" })}
          </BasicButton>
          <SubmitButton
            variant="gradient"
            loading={isLoading}
            className="!min-w-[120px] !px-6 !py-2.5 hover:!shadow-lg transition-all"
            type="submit"
          >
            {isEdit ? t("save", { defaultValue: "Save Changes" }) : t("", { defaultValue: "اضافة سائق" })}
          </SubmitButton>

        </Box>
      </Paper>
    </Box>
  );
};

export default DriverForm;

