import { create } from "zustand";

type EditTransactionSheetState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
};

export const useEditTransactionSheet = create<EditTransactionSheetState>(
  (set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id) => set({ isOpen: true, id }),
    onClose: () => set({ isOpen: false, id: undefined }),
  }),
);
