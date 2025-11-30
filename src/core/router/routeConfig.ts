/**
 * SoftOne Design System - Route Configuration
 * 라우트 메타데이터 정의 (JSX/Route 사용 금지)
 *
 * 실제 라우팅(Route JSX)은 Shell에서 구현하고,
 * 이 설정은 메뉴/사이드바/브레드크럼/권한 체크에 사용됩니다.
 */

import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Table,
  FileText,
  Settings,
  HelpCircle,
  LogIn,
  Code2,
  Globe,
  Package,
  Wrench,
} from "lucide-react";

// ========================================
// Route Meta Types
// ========================================

/**
 * 애플리케이션 라우트 메타데이터
 */
export interface AppRouteMeta {
  /** 라우트 키 (고유 식별자) */
  key: string;

  /** URL 경로 */
  path: string;

  /** 메뉴에 표시될 라벨 */
  label: string;

  /** 메뉴 아이콘 (lucide-react) */
  icon?: LucideIcon;

  /** 접근 가능한 역할 (빈 배열 = 모든 인증된 사용자) */
  roles?: string[];

  /** 메뉴에서 숨김 여부 */
  hideInMenu?: boolean;

  /** 하위 라우트 */
  children?: AppRouteMeta[];

  /** 브레드크럼 숨김 여부 */
  hideInBreadcrumb?: boolean;

  /** 메뉴 순서 */
  order?: number;

  /** 메뉴 그룹 */
  group?: string;

  /** 배지 텍스트 */
  badge?: string;

  /** 배지 색상 */
  badgeColor?: "primary" | "success" | "warning" | "danger";

  /** 인증 필요 여부 (기본: true) */
  requiresAuth?: boolean;
}

// ========================================
// Route Configuration
// ========================================

/**
 * 애플리케이션 라우트 메타데이터
 */
export const routeConfig: AppRouteMeta[] = [
  // ----------------------------------------
  // 인증 (Auth) - 비인증 사용자용
  // ----------------------------------------
  {
    key: "login",
    path: "/auth/login",
    label: "로그인",
    icon: LogIn,
    hideInMenu: true,
    requiresAuth: false,
  },

  // ----------------------------------------
  // 메인 메뉴
  // ----------------------------------------
  {
    key: "dashboard",
    path: "/dashboard",
    label: "대시보드",
    icon: LayoutDashboard,
    order: 1,
    group: "main",
    roles: [], // 모든 인증된 사용자 접근 가능
  },

  // ----------------------------------------
  // 관리 메뉴
  // ----------------------------------------
  {
    key: "users",
    path: "/users",
    label: "사용자 관리",
    icon: Users,
    roles: ["ADMIN", "MANAGER"], // ADMIN 또는 MANAGER만 접근 가능
    order: 10,
    group: "management",
    children: [
      {
        key: "users-list",
        path: "/users",
        label: "사용자 목록",
        hideInMenu: true,
      },
      {
        key: "users-create",
        path: "/users/create",
        label: "사용자 등록",
        hideInMenu: true,
      },
      {
        key: "users-detail",
        path: "/users/:id",
        label: "사용자 상세",
        hideInMenu: true,
        hideInBreadcrumb: true,
      },
    ],
  },
  {
    key: "auth-management",
    path: "/auth",
    label: "권한 관리",
    icon: Users,
    roles: ["ADMIN"],
    order: 11,
    group: "management",
    children: [
      {
        key: "user-menu-policy",
        path: "/auth/user-menu-policy",
        label: "사용자 메뉴 정책",
      },
    ],
  },
  {
    key: "schedules",
    path: "/schedules",
    label: "일정 관리",
    icon: Calendar,
    order: 20,
    group: "management",
    roles: [], // 모든 인증된 사용자
  },

  // ----------------------------------------
  // 데이터 메뉴
  // ----------------------------------------
  {
    key: "grid-samples",
    path: "/grid-samples",
    label: "그리드 샘플",
    icon: Table,
    order: 30,
    group: "data",
    badge: "Lab",
    badgeColor: "primary",
    roles: [], // 모든 인증된 사용자
    children: [
      {
        key: "grid-ag-basic",
        path: "/grid-samples/ag-basic",
        label: "AG Grid 기본",
      },
      {
        key: "grid-tanstack-basic",
        path: "/grid-samples/tanstack-basic",
        label: "TanStack Table 기본",
      },
      // Step 9-1: Grid Samples Lab 추가
      {
        key: "grid-ag-aggregation-grouping",
        path: "/grid-samples/ag-aggregation-grouping",
        label: "그룹핑 & 집계",
      },
      {
        key: "grid-tanstack-role-based",
        path: "/grid-samples/tanstack-role-based",
        label: "역할 기반 컬럼",
      },
      {
        key: "grid-ag-editing-validation",
        path: "/grid-samples/ag-editing-validation",
        label: "인라인 편집",
      },
      {
        key: "grid-ag-infinite-scroll",
        path: "/grid-samples/ag-infinite-scroll",
        label: "무한 스크롤",
      },
      {
        key: "grid-ag-pivot-chart",
        path: "/grid-samples/ag-pivot-chart",
        label: "차트 연동",
      },
      // Step 9-2: Grid Samples Lab Part 2 추가
      {
        key: "grid-multi-tabs",
        path: "/grid-samples/multi-grid-tabs",
        label: "Multi-Grid Tabs",
      },
      {
        key: "grid-tree-data",
        path: "/grid-samples/tree-data-grid",
        label: "Tree Data",
      },
      {
        key: "grid-form-like",
        path: "/grid-samples/form-like-grid",
        label: "Form-Like Grid",
      },
      {
        key: "grid-filter-playground",
        path: "/grid-samples/tanstack-filter-playground",
        label: "Filter Playground",
      },
      // 멀티 그리드 & 전역 상태 관리 예제
      {
        key: "grid-master-detail",
        path: "/grid-samples/master-detail",
        label: "멀티그리드 연동",
        badge: "New",
        badgeColor: "success",
      },
      {
        key: "global-state-demo",
        path: "/grid-samples/global-state-demo",
        label: "전역 상태 관리",
        badge: "New",
        badgeColor: "success",
      },
    ],
  },
  {
    key: "articles",
    path: "/articles",
    label: "게시물 관리",
    icon: FileText,
    order: 40,
    group: "data",
    roles: [], // 모든 인증된 사용자
    children: [
      {
        key: "articles-list",
        path: "/articles",
        label: "게시물 목록",
        hideInMenu: true,
      },
      {
        key: "articles-create",
        path: "/articles/new",
        label: "게시글 작성",
        roles: ["ADMIN"], // ADMIN만 작성 가능
        // hideInMenu: true, // 메뉴에 표시하려면 이 줄 제거
      },
      {
        key: "articles-edit",
        path: "/articles/:id/edit",
        label: "게시글 수정",
        hideInMenu: true,
        hideInBreadcrumb: true,
        roles: ["ADMIN"],
      },
      {
        key: "articles-detail",
        path: "/articles/:id",
        label: "게시글 상세",
        hideInMenu: true,
      },
    ],
  },

  // ----------------------------------------
  // 상품 관리 (CRUD 예제)
  // ----------------------------------------
  {
    key: "products",
    path: "/products",
    label: "상품 관리",
    icon: Package,
    order: 45,
    group: "data",
    badge: "CRUD",
    badgeColor: "success",
    roles: [], // 모든 인증된 사용자
  },

  // ----------------------------------------
  // 개발자 도구 메뉴 (Step 8)
  // ----------------------------------------
  {
    key: "dev-tools",
    path: "/tools",
    label: "개발자 도구",
    icon: Code2,
    order: 50,
    group: "tools",
    // 모든 인증된 사용자 접근 가능
    children: [
      {
        key: "swagger-playground",
        path: "/tools/swagger-playground",
        label: "Swagger Playground",
        icon: Globe,
      },
      {
        key: "dev-menu-playground",
        path: "/dev/menu-playground",
        label: "Menu Playground",
        icon: Wrench,
      },
    ],
  },

  // ----------------------------------------
  // Dialog 예시 메뉴 (Step 10)
  // ----------------------------------------
  {
    key: "dialog-samples",
    path: "/dialog-samples",
    label: "Dialog 예시",
    icon: LayoutDashboard,
    order: 55,
    group: "samples",
    badge: "New",
    badgeColor: "success",
    roles: [], // 모든 인증된 사용자
    children: [
      {
        key: "users-dialog-sample",
        path: "/users/dialog-sample",
        label: "사용자 CRUD (Dialog)",
      },
      {
        key: "grid-row-detail-modal",
        path: "/grid-samples/row-detail-modal",
        label: "그리드 행 상세 모달",
      },
    ],
  },

  // ----------------------------------------
  // 설정 메뉴
  // ----------------------------------------
  {
    key: "settings",
    path: "/settings",
    label: "설정",
    icon: Settings,
    order: 100,
    group: "system",
    roles: ["ADMIN"], // ADMIN만 접근 가능
    children: [
      {
        key: "settings-menu",
        path: "/settings/menus",
        label: "메뉴 관리",
        roles: ["ADMIN"],
      },
      {
        key: "settings-general",
        path: "/settings/general",
        label: "일반 설정",
        roles: ["ADMIN"],
      },
    ],
  },
  {
    key: "help",
    path: "/help",
    label: "도움말",
    icon: HelpCircle,
    order: 110,
    group: "system",
    roles: [], // 모든 인증된 사용자
  },
];

// ========================================
// Route Menu Groups
// ========================================

export const menuGroups = {
  main: { label: "", order: 0 },
  management: { label: "관리", order: 10 },
  data: { label: "데이터", order: 20 },
  samples: { label: "예시", order: 45 },
  tools: { label: "개발자 도구", order: 50 },
  system: { label: "시스템", order: 100 },
};

// ========================================
// Route Utilities
// ========================================

/**
 * 경로로 라우트 메타 찾기
 */
export function findRouteByPath(
  path: string,
  routes: AppRouteMeta[] = routeConfig
): AppRouteMeta | undefined {
  for (const route of routes) {
    // 정확히 일치
    if (route.path === path) {
      return route;
    }

    // 동적 라우트 매칭 (예: /users/:id)
    const routePattern = route.path.replace(/:[^/]+/g, "[^/]+");
    const regex = new RegExp(`^${routePattern}$`);
    if (regex.test(path)) {
      return route;
    }

    // 자식 라우트 검색
    if (route.children) {
      const found = findRouteByPath(path, route.children);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * 키로 라우트 메타 찾기
 */
export function findRouteByKey(
  key: string,
  routes: AppRouteMeta[] = routeConfig
): AppRouteMeta | undefined {
  for (const route of routes) {
    if (route.key === key) {
      return route;
    }
    if (route.children) {
      const found = findRouteByKey(key, route.children);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * 메뉴에 표시할 라우트 필터링
 *
 * @param routes 라우트 배열
 * @param userRoles 현재 사용자의 역할 배열
 */
export function getMenuRoutes(
  routes: AppRouteMeta[] = routeConfig,
  userRoles: string[] = []
): AppRouteMeta[] {
  return routes
    .filter((route) => {
      // 메뉴에서 숨김 처리된 라우트 제외
      if (route.hideInMenu) return false;

      // 인증이 필요 없는 라우트 제외 (로그인 페이지 등)
      if (route.requiresAuth === false) return false;

      // 역할 기반 필터링
      // roles가 undefined거나 빈 배열이면 모든 인증된 사용자 접근 가능
      if (route.roles && route.roles.length > 0) {
        const hasRole = route.roles.some((role) => userRoles.includes(role));
        if (!hasRole) return false;
      }

      return true;
    })
    .map((route) => ({
      ...route,
      children: route.children
        ? getMenuRoutes(route.children, userRoles)
        : undefined,
    }))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * 그룹별 메뉴 라우트 분류
 */
export function getGroupedMenuRoutes(
  routes: AppRouteMeta[] = routeConfig,
  userRoles: string[] = []
): Record<string, AppRouteMeta[]> {
  const menuRoutes = getMenuRoutes(routes, userRoles);
  const grouped: Record<string, AppRouteMeta[]> = {};

  for (const route of menuRoutes) {
    const group = route.group ?? "default";
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push(route);
  }

  return grouped;
}

/**
 * 브레드크럼 생성
 */
export function getBreadcrumbs(
  path: string,
  routes: AppRouteMeta[] = routeConfig
): AppRouteMeta[] {
  const breadcrumbs: AppRouteMeta[] = [];
  const segments = path.split("/").filter(Boolean);
  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const route = findRouteByPath(currentPath, routes);

    if (route && !route.hideInBreadcrumb) {
      breadcrumbs.push(route);
    }
  }

  return breadcrumbs;
}

/**
 * 플랫 라우트 목록 생성 (모든 라우트를 평면화)
 */
export function getFlatRoutes(
  routes: AppRouteMeta[] = routeConfig
): AppRouteMeta[] {
  const flat: AppRouteMeta[] = [];

  function flatten(items: AppRouteMeta[]) {
    for (const item of items) {
      flat.push(item);
      if (item.children) {
        flatten(item.children);
      }
    }
  }

  flatten(routes);
  return flat;
}

/**
 * 라우트가 특정 역할을 필요로 하는지 확인
 */
export function routeRequiresRole(
  route: AppRouteMeta,
  userRoles: string[]
): boolean {
  // roles가 없거나 빈 배열이면 모든 인증된 사용자 접근 가능
  if (!route.roles || route.roles.length === 0) {
    return true;
  }

  return route.roles.some((role) => userRoles.includes(role));
}
