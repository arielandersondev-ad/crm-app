import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;

  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: false,

  toggleSidebar: () =>
    set((state) => ({
      sidebarOpen: !state.sidebarOpen,
    })),

  openSidebar: () =>
    set({
      sidebarOpen: true,
    }),

  closeSidebar: () =>
    set({
      sidebarOpen: false,
    }),
}));