/**
 * SoftOne Design System - SPA App Router
 * React Router v6 기반 라우팅 정의
 *
 * routeConfig(AppRouteMeta)를 순회하여 Route를 생성하고,
 * ProtectedRoute와 RoleBasedRoute로 접근 제어를 수행합니다.
 *
 * Step 4: User Management Feature 추가
 * Step 5: Dashboard, Grid Samples, Schedule 추가
 * Step 6: Articles (Rich Text Editor) 추가
 * Step 8: Swagger Playground 추가
 */

import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  routeConfig,
  getFlatRoutes,
  type AppRouteMeta,
} from "@core/router/routeConfig";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";

// Lazy load pages
const LoginPage = lazy(() => import("@features/auth/pages/LoginPage"));
const UserListPage = lazy(() =>
  import("@features/users/pages/UserListPage").then((module) => ({
    default: module.UserListPage,
  }))
);

// Step 5: Dashboard, Grid Samples, Schedule
const DashboardPageFeature = lazy(() =>
  import("@features/dashboard/pages/DashboardPage").then((module) => ({
    default: module.DashboardPage,
  }))
);
const AgBasicGridPage = lazy(() =>
  import("@features/grid-samples/pages/AgBasicGridPage").then((module) => ({
    default: module.AgBasicGridPage,
  }))
);
const TanStackTableBasicPage = lazy(() =>
  import("@features/grid-samples/pages/TanStackTableBasicPage").then(
    (module) => ({
      default: module.TanStackTableBasicPage,
    })
  )
);
const SchedulePage = lazy(() =>
  import("@features/schedules/pages/SchedulePage").then((module) => ({
    default: module.SchedulePage,
  }))
);

// Step 6: Articles (Rich Text Editor)
const ArticleCreatePage = lazy(() =>
  import("@features/articles/pages/ArticleCreatePage").then((module) => ({
    default: module.ArticleCreatePage,
  }))
);

// Step 8: Swagger Playground
const SwaggerPlaygroundPage = lazy(() =>
  import("@features/api-playground/pages/SwaggerPlaygroundPage").then(
    (module) => ({
      default: module.SwaggerPlaygroundPage,
    })
  )
);

// Step 9-1: Grid Samples Lab
const AgAggregationGroupingPage = lazy(() =>
  import("@features/grid-samples/pages/AgAggregationGroupingPage").then(
    (module) => ({
      default: module.AgAggregationGroupingPage,
    })
  )
);
const TanStackRoleBasedGridPage = lazy(() =>
  import("@features/grid-samples/pages/TanStackRoleBasedGridPage").then(
    (module) => ({
      default: module.TanStackRoleBasedGridPage,
    })
  )
);
const AgEditingValidationPage = lazy(() =>
  import("@features/grid-samples/pages/AgEditingValidationPage").then(
    (module) => ({
      default: module.AgEditingValidationPage,
    })
  )
);
const InfiniteScrollVirtualGridPage = lazy(() =>
  import("@features/grid-samples/pages/InfiniteScrollVirtualGridPage").then(
    (module) => ({
      default: module.InfiniteScrollVirtualGridPage,
    })
  )
);
const AgPivotChartPlaygroundPage = lazy(() =>
  import("@features/grid-samples/pages/AgPivotChartPlaygroundPage").then(
    (module) => ({
      default: module.AgPivotChartPlaygroundPage,
    })
  )
);

// Step 9-2: Grid Samples Lab Part 2
const MultiGridTabsPage = lazy(() =>
  import("@features/grid-samples/pages/MultiGridTabsPage").then((module) => ({
    default: module.MultiGridTabsPage,
  }))
);
const TreeDataGridPage = lazy(() =>
  import("@features/grid-samples/pages/TreeDataGridPage").then((module) => ({
    default: module.TreeDataGridPage,
  }))
);
const FormLikeGridPage = lazy(() =>
  import("@features/grid-samples/pages/FormLikeGridPage").then((module) => ({
    default: module.FormLikeGridPage,
  }))
);
const TanStackFilterPlaygroundPage = lazy(() =>
  import("@features/grid-samples/pages/TanStackFilterPlaygroundPage").then(
    (module) => ({
      default: module.TanStackFilterPlaygroundPage,
    })
  )
);

// 멀티 그리드 & 전역 상태 관리 예제
const MultiGridMasterDetailPage = lazy(() =>
  import("@features/grid-samples/pages/MultiGridMasterDetailPage").then(
    (module) => ({
      default: module.MultiGridMasterDetailPage,
    })
  )
);
const GlobalStateDemoPage = lazy(() =>
  import("@features/grid-samples/pages/GlobalStateDemoPage").then((module) => ({
    default: module.GlobalStateDemoPage,
  }))
);

// Product CRUD
const ProductCrudPage = lazy(() =>
  import("@features/products/pages/ProductCrudPage").then((module) => ({
    default: module.ProductCrudPage,
  }))
);

// Step 10: Dialog Samples
const UserListWithDialogPage = lazy(() =>
  import("@features/users/pages/UserListWithDialogPage").then((module) => ({
    default: module.UserListWithDialogPage,
  }))
);
const GridWithRowDetailModalPage = lazy(() =>
  import("@features/grid-samples/pages/GridWithRowDetailModalPage").then(
    (module) => ({
      default: module.GridWithRowDetailModalPage,
    })
  )
);

// 설정 - 메뉴 관리
const MenuManagementPage = lazy(() =>
  import("@features/settings/pages/MenuManagementPage").then((module) => ({
    default: module.MenuManagementPage,
  }))
);

// Step 12: RBAC Pages
const RolePermissionDesignerPage = lazy(() =>
  import("@features/auth/pages/RolePermissionDesignerPage").then((module) => ({
    default: module.RolePermissionDesignerPage,
  }))
);
const UserMenuPolicyDesignerPage = lazy(() =>
  import("@features/auth/pages/UserMenuPolicyDesignerPage").then((module) => ({
    default: module.UserMenuPolicyDesignerPage,
  }))
);
const SystemSettingsPage = lazy(() =>
  import("@features/system/pages/SystemSettingsPage").then((module) => ({
    default: module.SystemSettingsPage,
  }))
);
const NotificationTemplatePage = lazy(() =>
  import("@features/notifications/pages/NotificationTemplatePage").then(
    (module) => ({
      default: module.NotificationTemplatePage,
    })
  )
);

// Dev / Playground
const MenuPlaygroundPage = lazy(() =>
  import("@features/dev/pages/MenuPlaygroundPage").then((module) => ({
    default: module.MenuPlaygroundPage,
  }))
);

// ========================================
// Loading Fallback
// ========================================

const PageLoading: React.FC = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-softone-primary border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-softone-text-muted">페이지 로딩 중...</p>
    </div>
  </div>
);

// ========================================
// Placeholder Page Component
// ========================================

interface PlaceholderPageProps {
  route: AppRouteMeta;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ route }) => {
  const Icon = route.icon;

  return (
    <div className="space-y-6 sds-animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-softone-primary-light flex items-center justify-center">
            <Icon className="w-5 h-5 text-softone-primary" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-softone-text">
            {route.label}
          </h1>
          <p className="text-softone-text-secondary">
            {route.path} - Placeholder Page
          </p>
        </div>
      </div>

      {/* Content Card */}
      <div className="bg-softone-surface border border-softone-border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-softone-bg flex items-center justify-center">
              {Icon ? (
                <Icon className="w-8 h-8 text-softone-text-muted" />
              ) : (
                <div className="w-8 h-8 bg-softone-border rounded" />
              )}
            </div>
            <h2 className="text-lg font-semibold text-softone-text mb-2">
              {route.label} 페이지
            </h2>
            <p className="text-softone-text-secondary max-w-md">
              이 페이지는 Step 4 이후에 실제 기능이 구현될 예정입니다. 현재는
              레이아웃과 네비게이션 테스트를 위한 Placeholder입니다.
            </p>
            {route.roles && route.roles.length > 0 && (
              <div className="mt-4 text-sm text-softone-text-muted">
                필요 권한: {route.roles.join(", ")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Route Info */}
      <div className="bg-softone-surface border border-softone-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-softone-text mb-2">
          라우트 정보
        </h3>
        <pre className="text-xs text-softone-text-secondary bg-softone-bg p-3 rounded overflow-auto">
          {JSON.stringify(
            {
              key: route.key,
              path: route.path,
              label: route.label,
              roles: route.roles,
              group: route.group,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

// ========================================
// Route Element Wrapper
// ========================================

interface RouteElementProps {
  route: AppRouteMeta;
}

const RouteElement: React.FC<RouteElementProps> = ({ route }) => {
  // 대시보드 (Step 5 - features/dashboard)
  if (route.key === "dashboard") {
    return <DashboardPageFeature />;
  }

  // 사용자 관리 페이지
  if (route.key === "users" || route.key === "users-list") {
    return <UserListPage />;
  }

  // AG Grid 기본 예제
  if (route.key === "grid-ag-basic") {
    return <AgBasicGridPage />;
  }

  // TanStack Table 기본 예제
  if (route.key === "grid-tanstack-basic") {
    return <TanStackTableBasicPage />;
  }

  // 일정 관리
  if (route.key === "schedules") {
    return <SchedulePage />;
  }

  // 게시글 작성 (Step 6)
  if (route.key === "articles-create") {
    return <ArticleCreatePage />;
  }

  // Swagger Playground (Step 8)
  if (route.key === "swagger-playground") {
    return <SwaggerPlaygroundPage />;
  }

  // Step 9-1: Grid Samples Lab
  if (route.key === "grid-ag-aggregation-grouping") {
    return <AgAggregationGroupingPage />;
  }
  if (route.key === "grid-tanstack-role-based") {
    return <TanStackRoleBasedGridPage />;
  }
  if (route.key === "grid-ag-editing-validation") {
    return <AgEditingValidationPage />;
  }
  if (route.key === "grid-ag-infinite-scroll") {
    return <InfiniteScrollVirtualGridPage />;
  }
  if (route.key === "grid-ag-pivot-chart") {
    return <AgPivotChartPlaygroundPage />;
  }

  // Step 9-2: Grid Samples Lab Part 2
  if (route.key === "grid-multi-tabs") {
    return <MultiGridTabsPage />;
  }
  if (route.key === "grid-tree-data") {
    return <TreeDataGridPage />;
  }
  if (route.key === "grid-form-like") {
    return <FormLikeGridPage />;
  }
  if (route.key === "grid-filter-playground") {
    return <TanStackFilterPlaygroundPage />;
  }
  if (route.key === "grid-master-detail") {
    return <MultiGridMasterDetailPage />;
  }
  if (route.key === "global-state-demo") {
    return <GlobalStateDemoPage />;
  }

  // Product CRUD
  if (route.key === "products") {
    return <ProductCrudPage />;
  }

  // Step 10: Dialog Samples
  if (route.key === "users-dialog-sample") {
    return <UserListWithDialogPage />;
  }
  if (route.key === "grid-row-detail-modal") {
    return <GridWithRowDetailModalPage />;
  }

  // 설정
  if (route.key === "settings") {
    return <MenuManagementPage />; // 설정 메인은 메뉴 관리로 리다이렉트
  }
  if (route.key === "settings-menu") {
    return <MenuManagementPage />;
  }
  if (route.key === "settings-general") {
    return <SystemSettingsPage />;
  }

  // Step 12: RBAC Pages
  if (route.key === "role-designer") {
    return <RolePermissionDesignerPage />;
  }
  if (route.key === "notification-templates") {
    return <NotificationTemplatePage />;
  }

  // Dev / Playground
  if (route.key === "dev-menu-playground") {
    return <MenuPlaygroundPage />;
  }

  // Auth / User Menu Policy
  if (route.key === "user-menu-policy") {
    return <UserMenuPolicyDesignerPage />;
  }

  return <PlaceholderPage route={route} />;
};

// ========================================
// Protected Route Element
// ========================================

const ProtectedRouteElement: React.FC<RouteElementProps> = ({ route }) => {
  const allowedRoles = route.roles ?? [];

  // 역할이 필요한 경우 RoleBasedRoute로 감싸기
  if (allowedRoles.length > 0) {
    return (
      <ProtectedRoute>
        <RoleBasedRoute allowedRoles={allowedRoles}>
          <RouteElement route={route} />
        </RoleBasedRoute>
      </ProtectedRoute>
    );
  }

  // 역할이 필요 없으면 ProtectedRoute만 적용
  return (
    <ProtectedRoute>
      <RouteElement route={route} />
    </ProtectedRoute>
  );
};

// ========================================
// Route Generator
// ========================================

function generateRoutes(routes: AppRouteMeta[]): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  const flatRoutes = getFlatRoutes(routes);

  for (const route of flatRoutes) {
    // 로그인 페이지는 별도 처리
    if (route.key === "login") {
      continue;
    }

    // 인증이 필요 없는 라우트
    if (route.requiresAuth === false) {
      result.push(
        <Route
          key={route.key}
          path={route.path}
          element={<RouteElement route={route} />}
        />
      );
      continue;
    }

    // 인증이 필요한 라우트 (기본)
    result.push(
      <Route
        key={route.key}
        path={route.path}
        element={<ProtectedRouteElement route={route} />}
      />
    );
  }

  return result;
}

// ========================================
// App Router
// ========================================

/**
 * App Router
 *
 * routeConfig를 순회하여 Route를 동적으로 생성하고,
 * ProtectedRoute와 RoleBasedRoute로 접근 제어를 수행합니다.
 */
export const AppRouter: React.FC = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* Auth Routes (Public) */}
        <Route path="/auth/login" element={<LoginPage />} />

        {/* Root redirect to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 설정 라우트 (명시적) - 테스트를 위해 권한 체크 제거 */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MenuManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/menus"
          element={
            <ProtectedRoute>
              <MenuManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings/general"
          element={
            <ProtectedRoute>
              <SystemSettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Step 12: RBAC Pages */}
        <Route
          path="/auth/role-designer"
          element={
            <ProtectedRoute>
              <RolePermissionDesignerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications/templates"
          element={
            <ProtectedRoute>
              <NotificationTemplatePage />
            </ProtectedRoute>
          }
        />

        {/* Dev / Playground (누구나 접근 가능) */}
        <Route
          path="/dev/menu-playground"
          element={
            <ProtectedRoute>
              <MenuPlaygroundPage />
            </ProtectedRoute>
          }
        />

        {/* User Menu Policy Designer */}
        <Route
          path="/auth/user-menu-policy"
          element={
            <ProtectedRoute>
              <UserMenuPolicyDesignerPage />
            </ProtectedRoute>
          }
        />

        {/* Generated routes from routeConfig */}
        {generateRoutes(routeConfig)}

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
