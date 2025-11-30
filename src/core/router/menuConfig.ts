/**
 * SoftOne Design System - Menu Configuration
 * 작성: SoftOne Frontend Team
 *
 * 4 Depth 계층형 메뉴 트리 정의
 *
 * MenuNode.routeKey와 AppRoute.routeKey를 통해
 * 메뉴와 실제 화면을 느슨하게 결합합니다.
 *
 * Depth 구조 예시:
 *   - 대시보드 (Category, Depth 1)
 *     - 메인 대시보드 (Page, Depth 2)
 *     - 운영 대시보드 (Page, Depth 2)
 *   - 그리드 샘플 (Category, Depth 1)
 *     - 기본 패턴 (Menu, Depth 2)
 *       - Aggregation (Page, Depth 3)
 *       - Role-Based (Page, Depth 3)
 *     - 고급 패턴 (Menu, Depth 2)
 *       - 멀티 그리드 (Menu, Depth 3)
 *         - Multi Grid Tabs (Page, Depth 4)
 */

import {
  LayoutDashboard,
  Users,
  Table,
  FileText,
  Settings,
  HelpCircle,
  Package,
  Calendar,
  Code2,
  Bell,
  FolderTree,
  Shield,
  BookOpen,
  Globe,
  Wrench,
  Play,
} from "lucide-react";

import type { MenuNode } from "./menu.types";
import { PERMISSION_KEYS } from "../auth/role.types";

// ========================================
// Menu Tree Configuration (4 Depth)
// ========================================

export const menuTree: MenuNode[] = [
  // ========================================
  // 대시보드
  // ========================================
  {
    id: "category-dashboard",
    type: "category",
    label: "대시보드",
    icon: LayoutDashboard,
    order: 1,
    children: [
      {
        id: "page-dashboard-main",
        type: "page",
        label: "메인 대시보드",
        routeKey: "dashboard.main",
        requiredPermissions: [PERMISSION_KEYS.MENU_DASHBOARD_VIEW],
        order: 1,
      },
      {
        id: "page-dashboard-ops",
        type: "page",
        label: "운영 대시보드",
        routeKey: "dashboard.ops",
        requiredPermissions: [PERMISSION_KEYS.ACTION_DASHBOARD_OPS_VIEW],
        badge: "Beta",
        badgeColor: "warning",
        order: 2,
      },
    ],
  },

  // ========================================
  // 사용자 / 권한
  // ========================================
  {
    id: "category-user-auth",
    type: "category",
    label: "사용자 / 권한",
    icon: Users,
    order: 10,
    requiredPermissions: [PERMISSION_KEYS.MENU_USERS_VIEW],
    children: [
      {
        id: "menu-users",
        type: "menu",
        label: "사용자 관리",
        icon: Users,
        order: 1,
        children: [
          {
            id: "page-users-list",
            type: "page",
            label: "사용자 목록",
            routeKey: "users.list",
            requiredPermissions: [PERMISSION_KEYS.PAGE_USERS_LIST_VIEW],
            order: 1,
          },
          {
            id: "page-users-dialog",
            type: "page",
            label: "사용자 CRUD (Dialog)",
            routeKey: "users.dialog",
            requiredPermissions: [PERMISSION_KEYS.PAGE_USERS_LIST_VIEW],
            order: 2,
          },
        ],
      },
      {
        id: "menu-auth",
        type: "menu",
        label: "권한 관리",
        icon: Shield,
        order: 2,
        requiredPermissions: [PERMISSION_KEYS.MENU_AUTH_VIEW],
        children: [
          {
            id: "page-role-designer",
            type: "page",
            label: "역할 / 권한 디자이너",
            routeKey: "auth.role.designer",
            requiredPermissions: [PERMISSION_KEYS.PAGE_AUTH_ROLE_DESIGNER_VIEW],
            badge: "New",
            badgeColor: "success",
            order: 1,
          },
        ],
      },
    ],
  },

  // ========================================
  // 데이터 관리
  // ========================================
  {
    id: "category-data",
    type: "category",
    label: "데이터 관리",
    icon: Package,
    order: 20,
    children: [
      {
        id: "page-products",
        type: "page",
        label: "상품 관리",
        icon: Package,
        routeKey: "products.crud",
        requiredPermissions: [PERMISSION_KEYS.MENU_PRODUCTS_VIEW],
        badge: "CRUD",
        badgeColor: "success",
        order: 1,
      },
      {
        id: "page-articles",
        type: "page",
        label: "게시물 관리",
        icon: FileText,
        routeKey: "articles.list",
        requiredPermissions: [PERMISSION_KEYS.MENU_ARTICLES_VIEW],
        order: 2,
      },
      {
        id: "page-schedules",
        type: "page",
        label: "일정 관리",
        icon: Calendar,
        routeKey: "schedules.main",
        requiredPermissions: [PERMISSION_KEYS.MENU_SCHEDULES_VIEW],
        order: 3,
      },
    ],
  },

  // ========================================
  // 그리드 샘플 (Grid Samples)
  // ========================================
  {
    id: "category-grid",
    type: "category",
    label: "그리드 샘플",
    icon: Table,
    order: 30,
    badge: "Lab",
    badgeColor: "primary",
    requiredPermissions: [PERMISSION_KEYS.MENU_GRID_SAMPLES_VIEW],
    children: [
      {
        id: "menu-grid-basic",
        type: "menu",
        label: "기본 패턴",
        order: 1,
        children: [
          {
            id: "page-grid-ag-basic",
            type: "page",
            label: "AG Grid 기본",
            routeKey: "grid.samples.ag.basic",
            order: 1,
          },
          {
            id: "page-grid-tanstack-basic",
            type: "page",
            label: "TanStack Table 기본",
            routeKey: "grid.samples.tanstack.basic",
            order: 2,
          },
          {
            id: "page-grid-ag-aggregation",
            type: "page",
            label: "그룹핑 & 집계",
            routeKey: "grid.samples.ag.aggregation",
            order: 3,
          },
          {
            id: "page-grid-tanstack-role",
            type: "page",
            label: "역할 기반 컬럼",
            routeKey: "grid.samples.tanstack.role",
            order: 4,
          },
        ],
      },
      {
        id: "menu-grid-editing",
        type: "menu",
        label: "편집 패턴",
        order: 2,
        children: [
          {
            id: "page-grid-ag-editing",
            type: "page",
            label: "인라인 편집",
            routeKey: "grid.samples.ag.editing",
            order: 1,
          },
          {
            id: "page-grid-form-like",
            type: "page",
            label: "Form-Like Grid",
            routeKey: "grid.samples.form.like",
            order: 2,
          },
        ],
      },
      {
        id: "menu-grid-advanced",
        type: "menu",
        label: "고급 패턴",
        order: 3,
        children: [
          {
            id: "page-grid-infinite",
            type: "page",
            label: "무한 스크롤",
            routeKey: "grid.samples.infinite",
            order: 1,
          },
          {
            id: "page-grid-pivot-chart",
            type: "page",
            label: "차트 연동",
            routeKey: "grid.samples.pivot.chart",
            order: 2,
          },
          {
            id: "page-grid-tree",
            type: "page",
            label: "Tree Data",
            routeKey: "grid.samples.tree",
            order: 3,
          },
          {
            id: "menu-grid-multi",
            type: "menu",
            label: "멀티 그리드",
            order: 4,
            children: [
              {
                id: "page-grid-multi-tabs",
                type: "page",
                label: "Multi Grid Tabs",
                routeKey: "grid.samples.multi.tabs",
                order: 1,
              },
              {
                id: "page-grid-master-detail",
                type: "page",
                label: "Master-Detail 연동",
                routeKey: "grid.samples.master.detail",
                badge: "New",
                badgeColor: "success",
                order: 2,
              },
              {
                id: "page-grid-row-detail",
                type: "page",
                label: "행 상세 모달",
                routeKey: "grid.samples.row.detail",
                order: 3,
              },
            ],
          },
        ],
      },
      {
        id: "menu-grid-state",
        type: "menu",
        label: "상태 관리",
        order: 4,
        children: [
          {
            id: "page-grid-filter-playground",
            type: "page",
            label: "Filter Playground",
            routeKey: "grid.samples.filter.playground",
            order: 1,
          },
          {
            id: "page-grid-global-state",
            type: "page",
            label: "전역 상태 관리",
            routeKey: "grid.samples.global.state",
            badge: "New",
            badgeColor: "success",
            order: 2,
          },
        ],
      },
    ],
  },

  // ========================================
  // 알림 관리
  // ========================================
  {
    id: "category-notifications",
    type: "category",
    label: "알림",
    icon: Bell,
    order: 40,
    requiredPermissions: [PERMISSION_KEYS.MENU_NOTIFICATIONS_VIEW],
    children: [
      {
        id: "page-notification-templates",
        type: "page",
        label: "알림 템플릿",
        routeKey: "notifications.templates",
        requiredPermissions: [
          PERMISSION_KEYS.PAGE_NOTIFICATIONS_TEMPLATES_VIEW,
        ],
        order: 1,
      },
    ],
  },

  // ========================================
  // 시스템 설정
  // ========================================
  {
    id: "category-system",
    type: "category",
    label: "시스템",
    icon: Settings,
    order: 100,
    requiredPermissions: [PERMISSION_KEYS.MENU_SYSTEM_VIEW],
    children: [
      {
        id: "page-menu-management",
        type: "page",
        label: "메뉴 관리",
        icon: FolderTree,
        routeKey: "system.menu.management",
        requiredPermissions: [PERMISSION_KEYS.PAGE_MENU_MANAGEMENT_VIEW],
        order: 1,
      },
      {
        id: "page-system-settings",
        type: "page",
        label: "시스템 설정",
        icon: Settings,
        routeKey: "system.settings",
        requiredPermissions: [PERMISSION_KEYS.PAGE_SYSTEM_SETTINGS_VIEW],
        order: 2,
      },
    ],
  },

  // ========================================
  // 개발자 도구
  // ========================================
  {
    id: "category-dev-tools",
    type: "category",
    label: "개발자 도구",
    icon: Code2,
    order: 110,
    requiredPermissions: [PERMISSION_KEYS.MENU_DEV_TOOLS_VIEW],
    children: [
      {
        id: "page-swagger-playground",
        type: "page",
        label: "Swagger Playground",
        icon: Globe,
        routeKey: "tools.swagger",
        requiredPermissions: [PERMISSION_KEYS.PAGE_SWAGGER_PLAYGROUND_VIEW],
        order: 1,
      },
    ],
  },

  // ========================================
  // 문서 / 도움말
  // ========================================
  {
    id: "category-docs",
    type: "category",
    label: "문서 / 도구",
    icon: BookOpen,
    order: 120,
    children: [
      {
        id: "page-help",
        type: "page",
        label: "도움말",
        icon: HelpCircle,
        routeKey: "help.main",
        order: 1,
      },
      {
        id: "external-swagger",
        type: "external",
        label: "API 문서 (외부)",
        icon: Globe,
        href: "https://api.example.com/swagger",
        target: "_blank",
        requiredPermissions: [PERMISSION_KEYS.MENU_DOCS_SWAGGER_VIEW],
        order: 2,
      },
    ],
  },

  // ========================================
  // Dev / Playground (개발/교육용)
  // ========================================
  {
    id: "category-dev",
    type: "category",
    label: "Dev / Playground",
    icon: Wrench,
    order: 200,
    badge: "Dev",
    badgeColor: "warning",
    children: [
      {
        id: "page-dev-menu-playground",
        type: "page",
        label: "Menu / Permission Playground",
        icon: Play,
        routeKey: "dev.menu.playground",
        badge: "New",
        badgeColor: "success",
        order: 1,
      },
    ],
  },
];

// ========================================
// Route Key Map (빠른 조회용)
// ========================================

/**
 * routeKey를 path로 변환하는 맵
 * AppRouter에서 실제 라우트 경로를 정의하고,
 * 여기서는 메뉴에서 참조할 수 있도록 매핑합니다.
 */
export const ROUTE_KEY_PATH_MAP: Record<string, string> = {
  // 대시보드
  "dashboard.main": "/dashboard",
  "dashboard.ops": "/dashboard/ops",

  // 사용자
  "users.list": "/users",
  "users.dialog": "/users/dialog-sample",

  // 권한
  "auth.role.designer": "/auth/role-designer",

  // 데이터 관리
  "products.crud": "/products/crud",
  "articles.list": "/articles",
  "articles.create": "/articles/new",
  "schedules.main": "/schedules",

  // 그리드 샘플
  "grid.samples.ag.basic": "/grid-samples/ag-basic",
  "grid.samples.tanstack.basic": "/grid-samples/tanstack-basic",
  "grid.samples.ag.aggregation": "/grid-samples/ag-aggregation-grouping",
  "grid.samples.tanstack.role": "/grid-samples/tanstack-role-based",
  "grid.samples.ag.editing": "/grid-samples/ag-editing-validation",
  "grid.samples.form.like": "/grid-samples/form-like-grid",
  "grid.samples.infinite": "/grid-samples/ag-infinite-scroll",
  "grid.samples.pivot.chart": "/grid-samples/ag-pivot-chart",
  "grid.samples.tree": "/grid-samples/tree-data-grid",
  "grid.samples.multi.tabs": "/grid-samples/multi-grid-tabs",
  "grid.samples.master.detail": "/grid-samples/master-detail",
  "grid.samples.row.detail": "/grid-samples/row-detail-modal",
  "grid.samples.filter.playground": "/grid-samples/tanstack-filter-playground",
  "grid.samples.global.state": "/grid-samples/global-state-demo",

  // 알림
  "notifications.templates": "/notifications/templates",

  // 시스템
  "system.menu.management": "/settings/menus",
  "system.settings": "/settings/general",

  // 개발자 도구
  "tools.swagger": "/tools/swagger-playground",

  // 도움말
  "help.main": "/help",

  // Dev / Playground
  "dev.menu.playground": "/dev/menu-playground",
};

/**
 * routeKey로 path를 조회합니다.
 */
export function getPathByRouteKey(routeKey: string): string | null {
  return ROUTE_KEY_PATH_MAP[routeKey] ?? null;
}

/**
 * path로 routeKey를 조회합니다.
 */
export function getRouteKeyByPath(path: string): string | null {
  for (const [key, value] of Object.entries(ROUTE_KEY_PATH_MAP)) {
    if (value === path) return key;
  }
  return null;
}
