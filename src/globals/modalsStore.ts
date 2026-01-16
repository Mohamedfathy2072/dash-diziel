import { create } from "zustand";

export type ModalsState = {
    isOpenWelcomeModal: boolean;
    isOpenChangeProfileAvatarModal: boolean;
    isChooseFileNameModal: boolean;
    isOpenDeleteModal: boolean;
    isOpenUpdateDocumentModal: boolean;
    isOpenResolveComplaintModal: boolean;
    isOpenRatingModal: boolean;
};

type ModalsActions = {
    setWelcomeModal: (payload: boolean) => void;
    setChangeProfileAvatarModal: (payload: boolean) => void;
    setChooseFileNameModal: (payload: boolean) => void;
    setDeleteModal: (payload: boolean) => void;
    setUpdateDocumentModal: (payload: boolean) => void;
    setResolveComplaintModal: (payload: boolean) => void;
    setRatingModal: (payload: boolean) => void;
};

const initialState: ModalsState = {
    isOpenWelcomeModal: false,
    isOpenChangeProfileAvatarModal: false,
    isChooseFileNameModal: false,
    isOpenDeleteModal: false,
    isOpenUpdateDocumentModal: false,
    isOpenResolveComplaintModal: false,
    isOpenRatingModal: false,
};

export const useModalsStore = create<ModalsState & ModalsActions>((set) => ({
    ...initialState,

    setWelcomeModal: (payload) => set({ isOpenWelcomeModal: payload }),
    setChangeProfileAvatarModal: (payload) =>
        set({ isOpenChangeProfileAvatarModal: payload }),
    setChooseFileNameModal: (payload) => set({ isChooseFileNameModal: payload }),
    setDeleteModal: (payload) => set({ isOpenDeleteModal: payload }),
    setUpdateDocumentModal: (payload) => set({ isOpenUpdateDocumentModal: payload }),
    setResolveComplaintModal: (payload) => set({ isOpenResolveComplaintModal: payload }),
    setRatingModal: (payload) => set({ isOpenRatingModal: payload }),
}));
