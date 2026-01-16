import { useTranslation } from "react-i18next";
import * as yup from "yup";
import type { User } from "../../types/domain";

const useUserSchema = (isEdit = false, selectedUser?: User | null) => {
  const { t } = useTranslation("forms/user_form");

  const UserSchema = yup.object({
    name: yup
      .string()
      .trim()
      .max(255, t("name_max", { defaultValue: "Name must be less than 255 characters" }))
      .required(t("name_required", { defaultValue: "Name is required" })),
    email: yup
      .string()
      .trim()
      .email(t("email_invalid", { defaultValue: "Invalid email address" }))
      .max(255, t("email_max", { defaultValue: "Email must be less than 255 characters" }))
      .required(t("email_required", { defaultValue: "Email is required" })),
    password: isEdit
      ? yup
          .string()
          .trim()
          .min(8, t("password_min", { defaultValue: "Password must be at least 8 characters" }))
          .notRequired()
      : yup
          .string()
          .trim()
          .min(8, t("password_min", { defaultValue: "Password must be at least 8 characters" }))
          .required(t("password_required", { defaultValue: "Password is required" })),
    password_confirmation: yup
      .string()
      .trim()
      .when("password", {
        is: (val: string) => val && val.length > 0,
        then: (schema) =>
          schema
            .required(t("password_confirmation_required", { defaultValue: "Password confirmation is required" }))
            .oneOf([yup.ref("password")], t("password_mismatch", { defaultValue: "Passwords do not match" })),
        otherwise: (schema) => schema.notRequired(),
      }),
    type: yup
      .string()
      .oneOf(["user", "driver", "superAdmin"], t("type_invalid", { defaultValue: "Invalid user type" }))
      .required(t("type_required", { defaultValue: "User type is required" })),
    phone: yup
      .string()
      .nullable()
      .max(20, t("phone_max", { defaultValue: "Phone must be less than 20 characters" })),
    date_of_birth: yup
      .string()
      .nullable()
      .matches(/^\d{4}-\d{2}-\d{2}$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" })),
    gender: yup
      .string()
      .nullable()
      .oneOf(["male", "female", "other"], t("gender_invalid", { defaultValue: "Invalid gender" })),
    address: yup
      .string()
      .nullable()
      .max(255, t("address_max", { defaultValue: "Address must be less than 255 characters" })),
    city: yup
      .string()
      .nullable()
      .max(255, t("city_max", { defaultValue: "City must be less than 255 characters" })),
    state: yup
      .string()
      .nullable()
      .max(255, t("state_max", { defaultValue: "State must be less than 255 characters" })),
    postal_code: yup
      .string()
      .nullable()
      .max(20, t("postal_code_max", { defaultValue: "Postal code must be less than 20 characters" })),
    country: yup
      .string()
      .nullable()
      .max(50, t("country_max", { defaultValue: "Country must be less than 50 characters" })),
    role_ids: yup
      .array()
      .of(yup.number())
      .nullable(),
  });

  const UserInitialValues = isEdit && selectedUser
    ? {
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        password: "",
        password_confirmation: "",
        type: selectedUser.type || "user",
        phone: selectedUser.phone || null,
        photo_url: selectedUser.photo_url || null,
        date_of_birth: selectedUser.date_of_birth || null,
        gender: selectedUser.gender || null,
        address: selectedUser.address || null,
        city: selectedUser.city || null,
        state: selectedUser.state || null,
        postal_code: selectedUser.postal_code || null,
        country: selectedUser.country || null,
        role_ids: (selectedUser as any).roles?.map((r: any) => r.id) || [],
      }
    : {
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        type: "user" as "user" | "driver" | "superAdmin",
        phone: null as string | null,
        photo_url: null as string | null,
        date_of_birth: null as string | null,
        gender: null as "male" | "female" | "other" | null,
        address: null as string | null,
        city: null as string | null,
        state: null as string | null,
        postal_code: null as string | null,
        country: null as string | null,
        role_ids: [] as number[],
      };

  return { UserSchema, UserInitialValues };
};

export default useUserSchema;
