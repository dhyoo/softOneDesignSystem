/**
 * SoftOne Design System - Router Module
 * Navigation 추상화 레이어 exports
 */

// Types
export type {
  NavigationApi,
  AppRouteMeta,
  RouteContext,
} from "./navigation.types";

// Context & Hooks
export {
  NavigationProvider,
  useNavigation,
  isActivePath,
  buildQueryString,
  buildUrl,
} from "./NavigationContext";

// Route Configuration
export {
  routeConfig,
  menuGroups,
  findRouteByPath,
  findRouteByKey,
  getMenuRoutes,
  getGroupedMenuRoutes,
  getBreadcrumbs,
  getFlatRoutes,
} from "./routeConfig";
