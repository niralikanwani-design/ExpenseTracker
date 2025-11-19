import { create } from "zustand";
import { UserStore } from "../types";
import { persist } from "zustand/middleware";

const useUserStore = create<UserStore>()(
    persist(
      (set) => ({
        user: null,
  
        setUser: (userData) => set({ user: userData }),
  
        logout: () => set({ user: null })
      }),
      {
        name: "user-storage",
      }
    )
  );

export default useUserStore;