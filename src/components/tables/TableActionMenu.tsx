import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import TableIconButton from "../TableIconButton/TableIconButton";
import DeleteIcon from "../../icons/DeleteIcon";
import EditIcon from "../../icons/EditIcon";
import EyeIcon from "../../icons/EyeIcon";

interface TableActionMenuProps {
  editUrl: string;
  viewUrl?: string;
  onDelete: () => void;
  showView?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
}

const TableActionMenu = ({
  editUrl,
  viewUrl,
  onDelete,
  showView = true,
  showEdit = true,
  showDelete = true,
}: TableActionMenuProps) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(editUrl);
  };

  const handleView = () => {
    if (viewUrl) {
      navigate(viewUrl);
    }
  };

  const handleDelete = () => {
    onDelete();
  };

  return (
    <Box className="flex justify-end items-center gap-2">
      {showView && viewUrl && (
        <TableIconButton
          onClick={handleView}
          className="!bg-blue-100 !text-blue-600"
        >
          <EyeIcon className="w-[20px] h-[20px] md:w-[18px] md:h-[18px] xs:w-[15px] xs:h-[15px]" />
        </TableIconButton>
      )}
      {showEdit && (
        <TableIconButton
          onClick={handleEdit}
          className="!bg-green-100 !text-green-600"
        >
          <EditIcon className="w-[20px] h-[20px] md:w-[18px] md:h-[18px] xs:w-[15px] xs:h-[15px]" />
        </TableIconButton>
      )}
      {showDelete && (
        <TableIconButton
          onClick={handleDelete}
          className="!bg-red-100 !text-red-600"
        >
          <DeleteIcon className="w-[20px] h-[20px] md:w-[18px] md:h-[18px] xs:w-[15px] xs:h-[15px]" />
        </TableIconButton>
      )}
    </Box>
  );
};

export default TableActionMenu;

