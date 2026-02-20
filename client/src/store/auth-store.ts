// store/auth-store.ts
import { create } from "zustand";

interface AuthStore {
  isAuthLoading: boolean;
  setAuthLoading: (val: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthLoading: false,
  setAuthLoading: (val) => set({ isAuthLoading: val }),
}));
