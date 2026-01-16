import EntityActionMenu from "../../components/tables/EntityActionMenu";
import type { Complaint } from "../../types/domain";
import useAuth from "../../hooks/useAuth";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

const ActionMenus = ({ complaint }: { complaint: Complaint }) => {
  const { isSuperAdmin } = useAuth();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  
  const isOwner = currentUser?.id === complaint.user_id;
  const isPending = complaint.status === 'pending';
  const canEdit = isOwner && isPending;
  const canDelete = isOwner && isPending;
  const canResolve = isSuperAdmin() && isPending;

  return (
    <EntityActionMenu
      entity={complaint}
      editRoute={(id) => `${import.meta.env.VITE_COMPLAINTS_ROUTE || '/complaints'}/edit/${id}`}
      deleteType="deleteComplaint"
      deleteIdKey="complaintId"
      viewRoute={(id) => `${import.meta.env.VITE_COMPLAINTS_ROUTE || '/complaints'}/${id}`}
      showView={true}
      showEdit={canEdit}
      showDelete={canDelete}
      additionalActions={
        canResolve ? (
          <button
            onClick={() => {
              // This will be handled by the detail page
              window.location.href = `${import.meta.env.VITE_COMPLAINTS_ROUTE || '/complaints'}/${complaint.id}`;
            }}
            className="px-3 py-1.5 text-sm text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
          >
            Resolve
          </button>
        ) : null
      }
    />
  );
};

export default ActionMenus;

