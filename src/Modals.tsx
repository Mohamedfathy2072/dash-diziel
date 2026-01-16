import { lazy } from "react";
import { useModalsStore } from "./globals/modalsStore";

const DeleteModal = lazy(() => import("./components/modals/DeleteModal"));
const ResolveComplaintModal = lazy(() => import("./components/modals/ResolveComplaintModal"));
const RatingModal = lazy(() => import("./components/modals/RatingModal"));

const Modals = () => {
  const isOpenDeleteModal = useModalsStore((state) => state.isOpenDeleteModal);
  const isOpenResolveComplaintModal = useModalsStore((state) => state.isOpenResolveComplaintModal);
  const isOpenRatingModal = useModalsStore((state) => state.isOpenRatingModal);

  return (
    <>
      {isOpenDeleteModal && <DeleteModal />}
      {isOpenResolveComplaintModal && <ResolveComplaintModal />}
      {isOpenRatingModal && <RatingModal />}
    </>
  );
};

export default Modals;
