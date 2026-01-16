import { useNavigate } from "react-router-dom";
import { useAppStore } from "../globals/appStore";
import { useModalsStore } from "../globals/modalsStore";
import type { FormsType } from "../types/forms";

/**
 * Configuration for detail page actions
 */
interface UseDetailActionsConfig {
  entityId: string | number | undefined;
  editRoute: string;
  deleteType: FormsType;
  deleteIdKey: string; // e.g., "couponId", "vehicleTypeId"
}

/**
 * Hook for common edit/delete actions in detail pages
 * Extracts the repetitive logic from detail pages
 * 
 * @example
 * const { handleEdit, handleDeleteClick } = useDetailActions({
 *   entityId: id,
 *   editRoute: `${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}/edit/${id}`,
 *   deleteType: "deleteCoupon",
 *   deleteIdKey: "couponId",
 * });
 */
export const useDetailActions = ({
  entityId,
  editRoute,
  deleteType,
  deleteIdKey,
}: UseDetailActionsConfig) => {
  const navigate = useNavigate();
  const deleted = useAppStore((state) => state.delete);
  const setDelete = useAppStore((state) => state.setDelete);
  const setDeleteType = useAppStore((state) => state.setDeleteType);
  const setDeleteModal = useModalsStore((state) => state.setDeleteModal);

  const handleEdit = () => {
    if (entityId) {
      navigate(editRoute);
    }
  };

  const handleDeleteClick = (itemId?: string | number) => {
    if (!itemId && !entityId) return;
    const idToDelete = itemId || entityId;
    setDeleteModal(true);
    setDeleteType(deleteType);
    setDelete({ ...deleted, [deleteIdKey]: idToDelete?.toString() });
  };

  return {
    handleEdit,
    handleDeleteClick,
  };
};

export default useDetailActions;

