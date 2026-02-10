import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type filters = {
  page: number;
  limit: number;
  categoryId?: string;
  search?: string;
};

type FilterStore = {
  filters: filters;
  setFilters: (newFilters: Partial<filters>) => void;
  clearFilters: () => void;
};
export const useFilterStore = create<FilterStore>()(
  persist(
    (set) => ({
      filters: {
        page: 1,
        limit: 9,
        categoryId: undefined,
        search: undefined,
      },
      setFilters: (newFilters: Partial<filters>) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      clearFilters: () => set({ filters: { page: 1, limit: 9 } }),
    }),
    {
      name: "filter-store",
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
