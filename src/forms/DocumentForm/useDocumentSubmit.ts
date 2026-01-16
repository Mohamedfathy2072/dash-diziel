import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { handleToaster } from "../../functions/handleToaster";
import type { AppDispatch, RootState } from "../../store/store";
import { updateDriverDocument, fetchDriverById } from "../../store/driversSlice";
import type { DocumentFormTypes } from "../../types/forms";
import { useAppStore } from "../../globals/appStore";
import { useModalsStore } from "../../globals/modalsStore";

const useDocumentSubmit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("pages/driver");
  const updateDocumentData = useAppStore((state) => state.updateDocumentData);
  const setUpdateDocumentData = useAppStore((state) => state.setUpdateDocumentData);
  const setUpdateDocumentModal = useModalsStore((state) => state.setUpdateDocumentModal);
  const { selectedDriver } = useSelector((state: RootState) => state.drivers);
  const { id } = useParams();

  const updateDocument = async (
    values: DocumentFormTypes & { file?: File | null }
  ) => {
    if (!updateDocumentData) {
      handleToaster({ 
        msg: t("documentNotFound", { defaultValue: "Document not found" }), 
        status: "error" 
      });
      return;
    }

    const { driverId, documentId } = updateDocumentData;
    const currentDocument = selectedDriver?.documents?.find(
      (doc) => doc.id === documentId
    );

    try {
      const formData = new FormData();
      
      // Add file if provided
      if (values.file) {
        formData.append('file', values.file);
      }
      
      // Add other fields
      if (values.type) formData.append('type', values.type);
      if (values.document_number !== undefined) {
        formData.append('document_number', values.document_number || '');
      }
      if (values.issue_date) {
        formData.append('issue_date', values.issue_date);
      } else if (values.issue_date === '' && currentDocument?.issue_date) {
        // Allow clearing the date
        formData.append('issue_date', '');
      }
      if (values.expiry_date) {
        formData.append('expiry_date', values.expiry_date);
      } else if (values.expiry_date === '' && currentDocument?.expiry_date) {
        // Allow clearing the date
        formData.append('expiry_date', '');
      }
      if (values.issuing_authority !== undefined) {
        formData.append('issuing_authority', values.issuing_authority || '');
      }

      await dispatch(updateDriverDocument({ driverId, documentId, formData })).unwrap();
      handleToaster({ 
        msg: t("documentUpdated", { defaultValue: "Document updated successfully" }), 
        status: "success" 
      });
      
      // Close modal and clear data
      setUpdateDocumentModal(false);
      setUpdateDocumentData(undefined);
      
      // Refresh driver data if on driver page
      if (id && +id === driverId) {
        dispatch(fetchDriverById(driverId));
      }
      
      return true;
    } catch (error: any) {
      handleToaster({ 
        msg: error?.message || t("documentUpdateError", { defaultValue: "Failed to update document" }), 
        status: "error" 
      });
      return false;
    }
  };

  return { updateDocument };
};

export default useDocumentSubmit;

