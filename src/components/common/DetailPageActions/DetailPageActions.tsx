import { memo, useCallback } from "react";
import { BasicButton } from "../../../mui/buttons/BasicButton";
import { GradientButton } from "../../../mui/buttons/GradientButton";
import EditIcon from "../../../icons/EditIcon";
import DeleteIcon from "../../../icons/DeleteIcon";
import useDetailActions from "../../../hooks/useDetailActions";
import type { FormsType } from "../../../types/forms";

/**
 * Props for DetailPageActions component
 */
interface DetailPageActionsProps {
  entityId: string | number | undefined;
  editRoute: string;
  deleteType: FormsType;
  deleteIdKey: string;
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
  showEdit?: boolean;
  showDelete?: boolean;
  additionalActions?: React.ReactNode;
}

/**
 * Generic detail page actions component
 * Handles edit/delete buttons with consistent styling
 * 
 * @example
 * <DetailPageActions
 *   entityId={id}
 *   editRoute={`${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}/edit/${id}`}
 *   deleteType="deleteCoupon"
 *   deleteIdKey="couponId"
 *   editLabel={t("edit", { defaultValue: "Edit" })}
 *   deleteLabel={t("delete", { defaultValue: "Delete" })}
 * />
 */
const DetailPageActions = memo(({
  entityId,
  editRoute,
  deleteType,
  deleteIdKey,
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
  showEdit = true,
  showDelete = true,
  additionalActions,
}: DetailPageActionsProps) => {
  const { handleEdit, handleDeleteClick } = useDetailActions({
    entityId,
    editRoute,
    deleteType,
    deleteIdKey,
  });

  const handleEditClick = useCallback(() => {
    handleEdit();
    onEdit?.();
  }, [handleEdit, onEdit]);

  const handleDelete = useCallback(() => {
    handleDeleteClick();
    onDelete?.();
  }, [handleDeleteClick, onDelete]);

  return (
    <>
      {showEdit && (
        <GradientButton 
          onClick={handleEditClick}
          className="!px-6 !py-2.5 hover:!shadow-lg transition-all"
        >
          <EditIcon className="w-5 h-5 mr-2" />
          {editLabel}
        </GradientButton>
      )}
      {showDelete && (
        <BasicButton
          onClick={handleDelete}
          className="!bg-red-50 !text-red-600 hover:!bg-red-100 !border-red-200 !border !px-6 !py-2.5 transition-all"
        >
          <DeleteIcon className="w-5 h-5 mr-2" />
          {deleteLabel}
        </BasicButton>
      )}
      {additionalActions}
    </>
  );
});

DetailPageActions.displayName = "DetailPageActions";

export default DetailPageActions;

