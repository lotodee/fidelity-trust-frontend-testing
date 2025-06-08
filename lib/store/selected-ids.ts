import { create } from "zustand";

interface SelectedIdsState {
  selectedTransactionId: string | null;
  selectedUserId: string | null;
  setSelectedTransactionId: (id: string | null) => void;
  setSelectedUserId: (id: string | null) => void;
  clearSelectedIds: () => void;
}

export const useSelectedIdsStore = create<SelectedIdsState>((set) => ({
  selectedTransactionId: null,
  selectedUserId: null,
  setSelectedTransactionId: (id) => set({ selectedTransactionId: id }),
  setSelectedUserId: (id) => set({ selectedUserId: id }),
  clearSelectedIds: () =>
    set({ selectedTransactionId: null, selectedUserId: null }),
}));
