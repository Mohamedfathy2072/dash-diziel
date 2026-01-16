import { useTranslation } from "react-i18next";
import * as yup from "yup";
import { DOCUMENT_TYPES } from "../../types/enums";
import type { DriverDocument } from "../../types/domain";

const useDocumentSchema = (currentDocument?: DriverDocument) => {
  const { t } = useTranslation("forms/document_form");

  const DocumentSchema = yup.object({
    type: yup
      .string()
      .oneOf(DOCUMENT_TYPES, t("documentType_invalid", { defaultValue: "Invalid document type" }))
      .required(t("documentType_required", { defaultValue: "Document type is required" })),
    document_number: yup
      .string()
      .nullable()
      .max(100, t("documentNumber_max", { defaultValue: "Document number must be less than 100 characters" })),
    issue_date: yup
      .string()
      .nullable()
      .matches(/^\d{4}-\d{2}-\d{2}$|^$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" })),
    expiry_date: yup
      .string()
      .nullable()
      .matches(/^\d{4}-\d{2}-\d{2}$|^$/, t("date_invalid", { defaultValue: "Invalid date format (YYYY-MM-DD)" }))
      .test(
        'is-after-issue-date',
        t("expiryDate_after_issueDate", { defaultValue: "Expiry date must be after issue date" }),
        function(value) {
          const { issue_date } = this.parent;
          if (!value || !issue_date) return true;
          return new Date(value) >= new Date(issue_date);
        }
      ),
    issuing_authority: yup
      .string()
      .nullable()
      .max(100, t("issuingAuthority_max", { defaultValue: "Issuing authority must be less than 100 characters" })),
  });

  const DocumentInitialValues = {
    type: currentDocument?.type || '',
    document_number: currentDocument?.document_number || '',
    issue_date: currentDocument?.issue_date ? currentDocument.issue_date.split('T')[0] : '',
    expiry_date: currentDocument?.expiry_date ? currentDocument.expiry_date.split('T')[0] : '',
    issuing_authority: currentDocument?.issuing_authority || '',
  };

  return { DocumentSchema, DocumentInitialValues };
};

export default useDocumentSchema;

