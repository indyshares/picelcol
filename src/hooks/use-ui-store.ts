import { create } from "zustand";

type UIState = {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
};

/**
 * Example Zustand store — add client-side state here once it grows
 * beyond what React Context comfortably handles (per the state
 * management guidance in the project doc).
 */
export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
}));
