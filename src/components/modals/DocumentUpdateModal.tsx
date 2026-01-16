import Forms from "../../forms/Forms";
import { useModalsStore } from "../../globals/modalsStore";
import CustomModal from "./CustomModal";

const DocumentUpdateModal = () => {
  const isOpenUpdateDocumentModal = useModalsStore((state) => state.isOpenUpdateDocumentModal);
  const setUpdateDocumentModal = useModalsStore((state) => state.setUpdateDocumentModal);

  return (
    <CustomModal
      open={isOpenUpdateDocumentModal}
      handleClose={() => setUpdateDocumentModal(false)}
    >
      <Forms type="updateDocument" />
    </CustomModal>
  );
};

export default DocumentUpdateModal;

