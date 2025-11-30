/**
 * SoftOne Design System - Core Module
 * SDS Core exports (Runtime 중립)
 *
 * Core 모듈은 React만 알고, 특정 라우터(React Router, Next Router)는 모릅니다.
 * Shell에서 NavigationProvider를 통해 라우팅 구현을 주입합니다.
 */

// ========================================
// Router (Navigation 추상화)
// ========================================
export * from "./router";

// ========================================
// Store (Zustand)
// ========================================
export * from "./store";

// ========================================
// Hooks
// ========================================
export * from "./hooks";

// ========================================
// API (HTTP Client, Query Client)
// ========================================
export * from "./api";

// ========================================
// Layout
// ========================================
export * from "./layout";

// ========================================
// Utils
// ========================================
export * from "./utils";

// ========================================
// Components - Navigation
// ========================================
export {
  SDSLink,
  SDSNavLink,
  type SDSLinkProps,
  type SDSNavLinkProps,
} from "./components/navigation/SDSLink";

// ========================================
// Components - Error
// ========================================
export {
  GlobalErrorBoundary,
  useErrorBoundary,
  type GlobalErrorBoundaryProps,
} from "./components/error/GlobalErrorBoundary";

// ========================================
// Components - UI
// ========================================
export * from "./components/ui";
