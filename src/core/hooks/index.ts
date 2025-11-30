/**
 * SoftOne Design System - Hooks Module
 * Core Hooks exports
 *
 * Step 7: useToast 추가
 * Step 10: useDialog 추가
 * Step 12: usePermission 추가
 */

export { useAuth } from "./useAuth";
export { useToast, type UseToastReturn } from "./useToast";

// Dialog Hook (Step 10)
export {
  useDialog,
  dialogActions,
  type OpenModalOptions,
  type OpenConfirmOptions,
  type OpenDrawerOptions,
  type OpenFormDialogOptions,
} from "./useDialog";

// Permission Hook (Step 12 - RBAC)
export {
  usePermission,
  PermissionGuard,
  type UsePermissionResult,
  type PermissionGuardProps,
} from "./usePermission";
