/**
 * SoftOne Design System - Global State Demo Store
 * 작성: SoftOne Frontend Team
 *
 * Zustand 전역 상태 관리 데모:
 *   - 장바구니 (Cart) 상태
 *   - UI 설정 (Preferences) 상태
 *   - 알림 (Notifications) 상태
 *   - 다중 Store 연동 패턴
 */

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

// ========================================
// Types
// ========================================

/** 상품 */
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

/** UI 설정 */
export interface UIPreferences {
  theme: "light" | "dark" | "system";
  sidebarCollapsed: boolean;
  gridDensity: "compact" | "normal" | "comfortable";
  showNotifications: boolean;
  language: "ko" | "en" | "ja";
  tablePageSize: number;
}

/** 알림 */
export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

// ========================================
// Cart Store (장바구니)
// ========================================

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartActions {
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState & CartActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        items: [],
        isOpen: false,

        addItem: (item) =>
          set((state) => {
            const existing = state.items.find((i) => i.id === item.id);
            if (existing) {
              existing.quantity += 1;
            } else {
              state.items.push({ ...item, quantity: 1 });
            }
          }),

        removeItem: (id) =>
          set((state) => {
            const index = state.items.findIndex((i) => i.id === id);
            if (index !== -1) {
              state.items.splice(index, 1);
            }
          }),

        updateQuantity: (id, quantity) =>
          set((state) => {
            const item = state.items.find((i) => i.id === id);
            if (item) {
              item.quantity = Math.max(0, quantity);
              if (item.quantity === 0) {
                const index = state.items.findIndex((i) => i.id === id);
                state.items.splice(index, 1);
              }
            }
          }),

        clearCart: () =>
          set((state) => {
            state.items = [];
          }),

        toggleCart: () =>
          set((state) => {
            state.isOpen = !state.isOpen;
          }),

        setCartOpen: (open) =>
          set((state) => {
            state.isOpen = open;
          }),

        getTotalItems: () => {
          return get().items.reduce((sum, item) => sum + item.quantity, 0);
        },

        getTotalPrice: () => {
          return get().items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          );
        },
      })),
      {
        name: "cart-storage",
        partialize: (state) => ({ items: state.items }),
      }
    ),
    { name: "cart-store" }
  )
);

// ========================================
// UI Preferences Store (UI 설정)
// ========================================

interface PreferencesState {
  preferences: UIPreferences;
}

interface PreferencesActions {
  setTheme: (theme: UIPreferences["theme"]) => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setGridDensity: (density: UIPreferences["gridDensity"]) => void;
  setShowNotifications: (show: boolean) => void;
  setLanguage: (language: UIPreferences["language"]) => void;
  setTablePageSize: (size: number) => void;
  resetPreferences: () => void;
}

const defaultPreferences: UIPreferences = {
  theme: "light",
  sidebarCollapsed: false,
  gridDensity: "normal",
  showNotifications: true,
  language: "ko",
  tablePageSize: 10,
};

export const usePreferencesStore = create<PreferencesState & PreferencesActions>()(
  devtools(
    persist(
      immer((set) => ({
        preferences: defaultPreferences,

        setTheme: (theme) =>
          set((state) => {
            state.preferences.theme = theme;
          }),

        toggleSidebar: () =>
          set((state) => {
            state.preferences.sidebarCollapsed =
              !state.preferences.sidebarCollapsed;
          }),

        setSidebarCollapsed: (collapsed) =>
          set((state) => {
            state.preferences.sidebarCollapsed = collapsed;
          }),

        setGridDensity: (density) =>
          set((state) => {
            state.preferences.gridDensity = density;
          }),

        setShowNotifications: (show) =>
          set((state) => {
            state.preferences.showNotifications = show;
          }),

        setLanguage: (language) =>
          set((state) => {
            state.preferences.language = language;
          }),

        setTablePageSize: (size) =>
          set((state) => {
            state.preferences.tablePageSize = size;
          }),

        resetPreferences: () =>
          set((state) => {
            state.preferences = defaultPreferences;
          }),
      })),
      {
        name: "preferences-storage",
      }
    ),
    { name: "preferences-store" }
  )
);

// ========================================
// Notifications Store (알림)
// ========================================

interface NotificationsState {
  notifications: Notification[];
  maxNotifications: number;
}

interface NotificationsActions {
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">
  ) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  getUnreadCount: () => number;
}

export const useNotificationsStore = create<
  NotificationsState & NotificationsActions
>()(
  devtools(
    immer((set, get) => ({
      notifications: [],
      maxNotifications: 50,

      addNotification: (notification) => {
        const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        set((state) => {
          state.notifications.unshift({
            ...notification,
            id,
            timestamp: Date.now(),
            read: false,
          });
          // 최대 개수 유지
          if (state.notifications.length > state.maxNotifications) {
            state.notifications = state.notifications.slice(
              0,
              state.maxNotifications
            );
          }
        });
        return id;
      },

      removeNotification: (id) =>
        set((state) => {
          const index = state.notifications.findIndex((n) => n.id === id);
          if (index !== -1) {
            state.notifications.splice(index, 1);
          }
        }),

      markAsRead: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (notification) {
            notification.read = true;
          }
        }),

      markAllAsRead: () =>
        set((state) => {
          state.notifications.forEach((n) => {
            n.read = true;
          });
        }),

      clearAllNotifications: () =>
        set((state) => {
          state.notifications = [];
        }),

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length;
      },
    })),
    { name: "notifications-store" }
  )
);

// ========================================
// Mock Products for Demo
// ========================================

export const mockDemoProducts = [
  {
    id: "DEMO-001",
    name: "프리미엄 노트북",
    price: 1500000,
    imageUrl: "💻",
  },
  {
    id: "DEMO-002",
    name: "무선 마우스",
    price: 45000,
    imageUrl: "🖱️",
  },
  {
    id: "DEMO-003",
    name: "기계식 키보드",
    price: 120000,
    imageUrl: "⌨️",
  },
  {
    id: "DEMO-004",
    name: "27인치 모니터",
    price: 350000,
    imageUrl: "🖥️",
  },
  {
    id: "DEMO-005",
    name: "웹캠 HD",
    price: 85000,
    imageUrl: "📷",
  },
  {
    id: "DEMO-006",
    name: "USB 허브",
    price: 25000,
    imageUrl: "🔌",
  },
];

