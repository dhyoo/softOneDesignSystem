/**
 * SoftOne Design System - Store Module
 * Zustand Store exports
 *
 * Step 7: Toast Store 추가
 * Step 10: Dialog Store 추가
 */

// UI Store
export {
  useUIStore,
  type UIState,
  type UIActions,
  type UIStore,
  type Theme,
} from "./uiStore";

// Auth Store
export {
  useAuthStore,
  type User,
  type AuthState,
  type AuthActions,
  type AuthStore,
} from "./authStore";

// Toast Store
export { useToastStore, type Toast, type ToastType } from "./toastStore";

// Dialog Store (Step 10)
export {
  useDialogStore,
  useDialogCount,
  useHasDialogOfType,
  useTopDialog,
  type DialogType,
  type DialogSize,
  type DialogVariant,
  type DialogOptions,
  type DialogStore,
} from "./dialogStore";

// Menu Store (동적 메뉴)
export {
  useMenuStore,
  selectFilteredMenus,
  selectMenuGroups,
  selectIsLoading,
  selectIsLoaded,
  selectExpandedMenuIds,
  selectActiveMenuId,
  type MenuItem,
  type MenuGroup,
  type MenuFormData,
} from "./menuStore";
