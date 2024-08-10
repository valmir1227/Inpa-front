import { create } from "zustand";

export const useUsers = create((set) => ({
  user: {},
  councils: [""],
  setUserStore: (user) => set({ user }),
  setCouncils: (councils) => set({ councils }),
}));
