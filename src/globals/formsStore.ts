import { create } from "zustand";

type FormsState = {
    isLoading: boolean;
    usersLimit: number;
    driversLimit: number;
    vehiclesLimit: number;
    tripsLimit: number;
    complaintsLimit: number;
};

type FormsActions = {
    setLoading: (value: boolean) => void;
    setUsersLimit: (value: number) => void;
    setDriversLimit: (value: number) => void;
    setVehiclesLimit: (value: number) => void;
    setTripsLimit: (value: number) => void;
    setComplaintsLimit: (value: number) => void;
    setLimit: (key: string, value: number) => void;
};

export const useFormsStore = create<FormsState & FormsActions>((set) => ({
    isLoading: false,
    usersLimit: 10,
    driversLimit: 10,
    vehiclesLimit: 10,
    tripsLimit: 10,
    complaintsLimit: 10,

    setLoading: (value) => set({ isLoading: value }),
    setUsersLimit: (value) => set({ usersLimit: value }),
    setDriversLimit: (value) => set({ driversLimit: value }),
    setVehiclesLimit: (value) => set({ vehiclesLimit: value }),
    setTripsLimit: (value) => set({ tripsLimit: value }),
    setComplaintsLimit: (value) => set({ complaintsLimit: value }),
    setLimit: (key, value) => {
        if (key === "usersLimit") {
            set({ usersLimit: value });
        } else if (key === "driversLimit") {
            set({ driversLimit: value });
        } else if (key === "vehiclesLimit") {
            set({ vehiclesLimit: value });
        } else if (key === "tripsLimit") {
            set({ tripsLimit: value });
        } else if (key === "complaintsLimit") {
            set({ complaintsLimit: value });
        }
    },
}));
