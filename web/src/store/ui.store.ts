import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  sidebarCollapsed: boolean;
  impersonatingUserId: string | null;
  impersonatingUserName: string | null;
  toggleSidebar: () => void;
  setImpersonating: (id: string, name: string) => void;
  clearImpersonation: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      impersonatingUserId: null,
      impersonatingUserName: null,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setImpersonating: (id, name) => set({ impersonatingUserId: id, impersonatingUserName: name }),
      clearImpersonation: () => set({ impersonatingUserId: null, impersonatingUserName: null }),
    }),
    { name: "ui" }
  )
);
