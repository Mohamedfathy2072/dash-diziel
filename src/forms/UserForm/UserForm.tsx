import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Input from "../../components/Input/Input";
import PhoneNumberInput from "../../components/PhoneNumberInput/PhoneNumberInput";
import SubmitButton from "../../components/SubmitButton/SubmitButton";
import { useFormsStore } from "../../globals/formsStore";
import { BasicButton } from "../../mui/buttons/BasicButton";
import PhotoUpload from "../../components/common/PhotoUpload/PhotoUpload";
import FormSection from "../../components/common/FormSection/FormSection";
import Typography from "@mui/material/Typography";
import type { FormiksTypes, UserFormTypes } from "../../types/forms";
import { fetchRoles } from "../../store/rolesSlice";
import type { RootState, AppDispatch } from "../../store/store";

const UserForm = ({
  formik,
  type,
  photoFileRef,
}: FormiksTypes<UserFormTypes> & {
  type?: "addUser" | "editUser";
  photoFileRef?: React.MutableRefObject<File | null>;
}) => {
  const { t } = useTranslation("forms/user_form");
  const isLoading = useFormsStore((state) => state.isLoading);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const isEdit = type === "editUser";
  const { roles } = useSelector((state: RootState) => state.roles);
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.type === 'superAdmin';

  useEffect(() => {
    if (isSuperAdmin) {
      dispatch(fetchRoles({ per_page: 1000, is_active: true }));
    }
  }, [dispatch, isSuperAdmin]);

  return (
    <Box className="grid justify-stretch items-start gap-6">
      {/* Basic Information Section */}
      <FormSection title={t("basicInformation", { defaultValue: "Basic Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <PhotoUpload
            value={isEdit ? formik.values.photo_url : undefined}
            photoFileRef={photoFileRef}
            formik={formik}
            name="name"
          />
          <Input
            formik={formik}
            label={t("name", { defaultValue: "Name" })}
            name="name"
            placeholder={t("namePlaceholder", { defaultValue: "Enter name" })}
          />
          <Input
            formik={formik}
            label={t("email", { defaultValue: "Email" })}
            name="email"
            type="email"
            placeholder={t("emailPlaceholder", {
              defaultValue: "Enter email",
            })}
          />
          <Input
            formik={formik}
            label={t("type", { defaultValue: "User Type" })}
            name="type"
            select
            options={["user", "driver", "admin", "superAdmin"]}
            values={["user", "driver", "admin", "superAdmin"]}
            placeholder={t("typePlaceholder", {
              defaultValue: "Select user type",
            })}
          />
          <PhoneNumberInput
            value={formik.values.phone || ""}
            formik={formik}
            label={t("phoneNumber", { defaultValue: "Phone" })}
            name="phone"
          />
          {!isEdit && (
            <>
              <Input
                formik={formik}
                label={t("password", { defaultValue: "Password" })}
                name="password"
                type="password"
                placeholder={t("passwordPlaceholder", {
                  defaultValue: "Enter password",
                })}
              />
              <Input
                formik={formik}
                label={t("passwordConfirmation", {
                  defaultValue: "Confirm Password",
                })}
                name="password_confirmation"
                type="password"
                placeholder={t("passwordConfirmationPlaceholder", {
                  defaultValue: "Confirm password",
                })}
              />
            </>
          )}
        </Box>
      </FormSection>

      {/* Personal Information Section */}
      <FormSection title={t("personalInformation", {
        defaultValue: "Personal Information",
      })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
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
            placeholder={t("genderPlaceholder", {
              defaultValue: "Select gender",
            })}
            optional
          />
        </Box>
      </FormSection>

      {/* Roles Section - Only for SuperAdmin */}
      {isSuperAdmin && (
        <FormSection title={t("roles", { defaultValue: "Roles" })}>
          <Box className="grid justify-stretch items-start gap-5">
            <Typography variant="body2" className="!text-gray-600 !text-sm">
              {t("rolesDescription", { defaultValue: "Select one or more roles to assign to this user. The user will inherit all permissions from the assigned roles." })}
            </Typography>
            {roles.length > 0 ? (
              <Box className="border border-gray-200 rounded-lg p-4 max-h-64 overflow-y-auto">
                <Box className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {roles.filter(role => role.is_active).map((role) => (
                    <FormControlLabel
                      key={role.id}
                      control={
                        <Checkbox
                          checked={(formik.values.role_ids || []).includes(role.id)}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const currentIds = formik.values.role_ids || [];
                            if (e.target.checked) {
                              formik.setFieldValue("role_ids", [...currentIds, role.id]);
                            } else {
                              formik.setFieldValue("role_ids", currentIds.filter((id: number) => id !== role.id));
                            }
                          }}
                        />
                      }
                      label={
                        <Box>
                          <Box className="font-medium">{role.name}</Box>
                          {role.description && (
                            <Box className="text-xs text-gray-500">{role.description}</Box>
                          )}
                        </Box>
                      }
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" className="!text-gray-500 !text-sm">
                {t("noRolesAvailable", { defaultValue: "No roles available" })}
              </Typography>
            )}
          </Box>
        </FormSection>
      )}

      {/* Address Information Section */}
      <FormSection title={t("addressInformation", { defaultValue: "Address Information" })}>
        <Box className="grid justify-stretch items-start grid-cols-2 md:grid-cols-1 gap-5">
          <Box className="col-span-full">
            <Input
              formik={formik}
              label={t("address", { defaultValue: "Address" })}
              name="address"
              placeholder={t("addressPlaceholder", {
                defaultValue: "Enter address",
              })}
              optional
            />
          </Box>
          <Input
            formik={formik}
            label={t("city", { defaultValue: "City" })}
            name="city"
            placeholder={t("cityPlaceholder", { defaultValue: "Enter city" })}
            optional
          />
          <Input
            formik={formik}
            label={t("state", { defaultValue: "State" })}
            name="state"
            placeholder={t("statePlaceholder", {
              defaultValue: "Enter state",
            })}
            optional
          />
          <Input
            formik={formik}
            label={t("postalCode", { defaultValue: "Postal Code" })}
            name="postal_code"
            placeholder={t("postalCodePlaceholder", {
              defaultValue: "Enter postal code",
            })}
            optional
          />
          <Input
            formik={formik}
            label={t("country", { defaultValue: "Country" })}
            name="country"
            placeholder={t("countryPlaceholder", {
              defaultValue: "Enter country",
            })}
            optional
          />
        </Box>
      </FormSection>

      {/* Action Buttons */}
      <Paper className="paper !bg-gray-50">
        <Box className="flex justify-end items-center gap-4 flex-wrap">
          <BasicButton
            type="button"
            onClick={() => navigate(`${import.meta.env.VITE_USERS_ROUTE}`)}
            className="!min-w-[120px] !px-6 !py-2.5 hover:!shadow-md transition-all"
          >
            {t("cancel", { defaultValue: "Cancel" })}
          </BasicButton>
          <SubmitButton
            variant="gradient"
            loading={isLoading}
            className="!min-w-[120px] !px-6 !py-2.5 hover:!shadow-lg transition-all"
          >
            {t("save", { defaultValue: "Save Changes" })}
          </SubmitButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default UserForm;
