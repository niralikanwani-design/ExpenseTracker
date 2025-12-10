import { create } from "zustand";
import { UserStore } from "../types";
import { persist } from "zustand/middleware";

const initialState = {
  user: null,
};

const useUserStore = create<UserStore>()(
    persist(
      (set) => ({
        user: null,
  
        setUser: (userData) => set({ user: userData }),
  
        logout: () => set(initialState)
      }),
      {
        name: "user-storage",
      }
    )
  );

export default useUserStore;