import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { memo, Suspense } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import type { CustomModalTypes } from "../../types/app";

const CustomModal = ({
  children,
  open,
  handleClose,
  className,
}: CustomModalTypes) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={`modal ${className}`}>
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      </Box>
    </Modal>
  );
};

export default memo(CustomModal);

