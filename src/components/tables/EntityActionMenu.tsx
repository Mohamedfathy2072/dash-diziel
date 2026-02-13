import Box from "@mui/material/Box";
import { memo, useCallback } from "react";
import type { ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import TableIconButton from "../TableIconButton/TableIconButton";
import { useAppStore } from "../../globals/appStore";
import { useModalsStore } from "../../globals/modalsStore";
import DeleteIcon from "../../icons/DeleteIcon";
import EditIcon from "../../icons/EditIcon";
import type { FormsType } from "../../types/forms";

/**
 * Props for EntityActionMenu component
 */
interface EntityActionMenuProps<T extends { id: number }> {
  entity: T;
  editRoute: string | ((id: number) => string);
  deleteType: FormsType;
  deleteIdKey: string; // e.g., "couponId", "vehicleTypeId"
  onEdit?: (entity: T) => void;
  onDelete?: (entity: T) => void;
  className?: string;
  viewRoute?: string | ((id: number) => string);
  onView?: (entity: T) => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  additionalActions?: React.ReactNode;
}

/**
 * Generic action menu component for entity tables
 * Replaces all individual ActionMenus with a reusable component
 * 
 * @example
 * <EntityActionMenu
 *   entity={coupon}
 *   editRoute={(id) => `${import.meta.env.VITE_COUPONS_ROUTE || "/coupons"}/edit/${id}`}
 *   deleteType="deleteCoupon"
 *   deleteIdKey="couponId"
 * />
 */
import EyeIcon from "../../icons/EyeIcon";

const EntityActionMenu = memo(<T extends { id: number }>({
  entity,
  editRoute,
  deleteType,
  deleteIdKey,
  onEdit,
  onDelete,
  className,
  viewRoute,
  onView,
  showEdit = true,
  showDelete = true,
  showView = false,
  additionalActions,
}: EntityActionMenuProps<T>) => {
  const deleted = useAppStore((state) => state.delete);
  const setDelete = useAppStore((state) => state.setDelete);
  const setDeleteType = useAppStore((state) => state.setDeleteType);
  const setDeleteModal = useModalsStore((state) => state.setDeleteModal);
  const navigate = useNavigate();

  const handleDelete = useCallback(() => {
    setDeleteModal(true);
    setDeleteType(deleteType);
    setDelete({ ...deleted, [deleteIdKey]: entity.id.toString() });
    onDelete?.(entity);
  }, [setDeleteModal, setDeleteType, deleteType, setDelete, deleted, deleteIdKey, entity, onDelete]);

  const handleEdit = useCallback(() => {
    const route = typeof editRoute === 'function' ? editRoute(entity.id) : editRoute.replace(':id', entity.id.toString());
    navigate(route);
    onEdit?.(entity);
  }, [editRoute, entity, navigate, onEdit]);

  const handleView = useCallback(() => {
    if (viewRoute) {
      const route = typeof viewRoute === 'function' ? viewRoute(entity.id) : viewRoute.replace(':id', entity.id.toString());
      navigate(route);
      onView?.(entity);
    }
  }, [viewRoute, entity, navigate, onView]);

  return (
    <Box className={`flex justify-end items-center gap-2 ${className || ""}`}>
      {showView && viewRoute && (
        <TableIconButton
          onClick={handleView}
          className={`!bg-blue-100 !text-blue-600`}
        >
          <EyeIcon className={`w-[20px] h-[20px] md:w-[18px] md:h-[18px] xs:w-[15px] xs:h-[15px]`} />
        </TableIconButton>
      )}
      {showEdit && (
        <TableIconButton
          onClick={handleEdit}
          className={`!bg-green-100 !text-green-600`}
        >
          <EditIcon className={`w-[20px] h-[20px] md:w-[18px] md:h-[18px] xs:w-[15px] xs:h-[15px]`} />
        </TableIconButton>
      )}
      {/* {showDelete && (
        <TableIconButton
          onClick={handleDelete}
          className={`!bg-red-100 !text-red-600`}
        >
          <DeleteIcon className={`w-[20px] h-[20px] md:w-[18px] md:h-[18px] xs:w-[15px] xs:h-[15px]`} />
        </TableIconButton>
      )} */}
      {additionalActions}
    </Box>
  );
}) as <T extends { id: number }>(props: EntityActionMenuProps<T>) => ReactElement;

(EntityActionMenu as any).displayName = "EntityActionMenu";

export default EntityActionMenu;

