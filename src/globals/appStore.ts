import { create } from "zustand";
import type {
    DeleteDataTypes,
    UserTypes,
} from "../types/app";
import type { FormsType } from "../types/forms";

type AppState = {
    backdrop: boolean;
    sidebar: boolean;
    selectedUserData?: UserTypes;
    user?: UserTypes;
    deleteType: FormsType;
    delete?: DeleteDataTypes;
    focusedLocation?: Location;
    updateDocumentData?: { driverId: number; documentId: number };
    resolveComplaintData?: { complaintId: number };
    ratingData?: { tripId: number };
};

type AppActions = {
    setBackdrop: (value: boolean) => void;
    setSidebar: (value: boolean) => void;
    setSelectedUserData: (user?: UserTypes) => void;
    setUser: (user?: UserTypes) => void;
    setDeleteType: (type: FormsType) => void;
    setDelete: (data?: DeleteDataTypes) => void;
    setFocusedLocation: (loc?: Location) => void;
    setUpdateDocumentData: (data?: { driverId: number; documentId: number }) => void;
    setResolveComplaintData: (data?: { complaintId: number }) => void;
    setRatingData: (data?: { tripId: number }) => void;
};

export const useAppStore = create<AppState & AppActions>((set) => ({
    // state
    backdrop: false,
    sidebar: false,
    selectedUserData: undefined,
    user: undefined,
    deleteType: "deleteUser" as FormsType,
    delete: undefined,
    focusedLocation: undefined,
    updateDocumentData: undefined,
    resolveComplaintData: undefined,
    ratingData: undefined,

    // actions
    setBackdrop: (value) => set({ backdrop: value }),
    setSidebar: (value) => set({ sidebar: value }),
    setSelectedUserData: (user) => set({ selectedUserData: user }),
    setUser: (user) => set({ user }),
    setDeleteType: (type) => set({ deleteType: type }),
    setDelete: (data) => set({ delete: data }),
    setFocusedLocation: (loc) => set({ focusedLocation: loc }),
    setUpdateDocumentData: (data) => set({ updateDocumentData: data }),
    setResolveComplaintData: (data) => set({ resolveComplaintData: data }),
    setRatingData: (data) => set({ ratingData: data }),
}));
