import Forms from "../../forms/Forms";
import { useAppStore } from "../../globals/appStore";
import { useModalsStore } from "../../globals/modalsStore";
import CustomModal from "./CustomModal";

const DeleteModal = () => {
  const isOpenDeleteModal = useModalsStore((state) => state.isOpenDeleteModal);
  const setDeleteModal = useModalsStore((state) => state.setDeleteModal);
  const deleteType = useAppStore((state) => state.deleteType);

  return (
    <CustomModal
      open={isOpenDeleteModal}
      handleClose={() =>
        setDeleteModal(false)
      }
    >
      <Forms type={deleteType} />
    </CustomModal>
  );
};

export default DeleteModal;

