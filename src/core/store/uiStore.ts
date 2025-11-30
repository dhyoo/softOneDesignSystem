/**
 * SoftOne Design System - UI Store
 * 전역 UI 상태 관리 (Zustand)
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ========================================
// UI Store Types
// ========================================

export type Theme = "light" | "dark" | "system";

export interface UIState {
  /** 현재 테마 */
  theme: Theme;

  /** 사이드바 접힘 상태 */
  isSidebarCollapsed: boolean;

  /** 모바일 사이드바 열림 상태 */
  isMobileSidebarOpen: boolean;

  /** 전역 로딩 상태 */
  isGlobalLoading: boolean;

  /** 전역 로딩 메시지 */
  globalLoadingMessage: string;
}

export interface UIActions {
  /** 테마 설정 */
  setTheme: (theme: Theme) => void;

  /** 테마 토글 (light ↔ dark) */
  toggleTheme: () => void;

  /** 사이드바 접힘 상태 설정 */
  setSidebarCollapsed: (collapsed: boolean) => void;

  /** 사이드바 토글 */
  toggleSidebar: () => void;

  /** 모바일 사이드바 상태 설정 */
  setMobileSidebarOpen: (open: boolean) => void;

  /** 모바일 사이드바 토글 */
  toggleMobileSidebar: () => void;

  /** 전역 로딩 상태 설정 */
  setGlobalLoading: (loading: boolean, message?: string) => void;
}

export type UIStore = UIState & UIActions;

// ========================================
// UI Store Implementation
// ========================================

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      // ========================================
      // State
      // ========================================
      theme: "light",
      isSidebarCollapsed: false,
      isMobileSidebarOpen: false,
      isGlobalLoading: false,
      globalLoadingMessage: "",

      // ========================================
      // Actions
      // ========================================

      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },

      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        applyTheme(newTheme);
      },

      setSidebarCollapsed: (collapsed) => {
        set({ isSidebarCollapsed: collapsed });
      },

      toggleSidebar: () => {
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }));
      },

      setMobileSidebarOpen: (open) => {
        set({ isMobileSidebarOpen: open });
      },

      toggleMobileSidebar: () => {
        set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen }));
      },

      setGlobalLoading: (loading, message = "") => {
        set({ isGlobalLoading: loading, globalLoadingMessage: message });
      },
    }),
    {
      name: "sds-ui-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

// ========================================
// Theme Utilities
// ========================================

/**
 * 테마를 DOM에 적용
 */
function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    root.classList.toggle("dark", systemTheme === "dark");
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

// 초기 테마 적용 (SSR 대응)
if (typeof window !== "undefined") {
  const stored = localStorage.getItem("sds-ui-storage");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.state?.theme) {
        applyTheme(parsed.state.theme);
      }
    } catch {
      // Ignore parse errors
    }
  }
}
