import { create } from "zustand";

type EditCategorySheetState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useEditCategorySheet = create<EditCategorySheetState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id) => set({ isOpen: true, id }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));
