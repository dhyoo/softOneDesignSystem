/**
 * SoftOne Design System(SDS) - Protected Route
 * 작성: SoftOne Frontend Team
 *
 * 이 파일은 사용자 단위(User Menu Policy) 메뉴/기능 접근 권한을 정의/적용하기 위한 구현입니다.
 * Role/Grade 기반 RBAC 위에, 사용자별 예외 정책(허용/차단/기본 진입 페이지)을 오버레이합니다.
 *
 * 기능:
 *   - 인증이 필요한 라우트 보호
 *   - 권한(Permission) 기반 접근 제어
 *   - routeKey 기반 접근 제어 (User Menu Policy)
 *   - 인증되지 않은 사용자는 로그인 페이지로 리다이렉트
 *   - 권한이 없으면 ForbiddenPage 표시
 *   - 초기 진입 페이지(Landing Route) 결정 로직
 */

import React, { useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@core/hooks/useAuth";
import { usePermission } from "@core/hooks/usePermission";
import { useAuthStore } from "@core/store/authStore";
import type { PermissionKey } from "@core/auth/role.types";
import { routeConfig } from "@core/router/routeConfig";
import {
  getPathByRouteKey,
  getRouteKeyByPath,
} from "@core/router/menuAccessUtils";
import { ForbiddenPage } from "./ForbiddenPage";

// ========================================
// Protected Route Types
// ========================================

export interface ProtectedRouteProps {
  /** 자식 요소 */
  children: React.ReactNode;
  /** 인증되지 않았을 때 리다이렉트 경로 */
  redirectTo?: string;
  /** 필요한 권한 목록 (AND 조건) */
  requiredPermissions?: PermissionKey[];
  /** 필요한 routeKey (User Menu Policy 기반 체크) */
  requiredRouteKey?: string;
  /** 권한이 없을 때 커스텀 Fallback 컴포넌트 */
  forbiddenFallback?: React.ReactNode;
  /** 접근 불가 시 리다이렉트할 경로 (기본: ForbiddenPage 표시) */
  forbiddenRedirectTo?: string;
}

// ========================================
// Protected Route Component
// ========================================

/**
 * ProtectedRoute - 인증 및 권한이 필요한 라우트를 보호
 *
 * @description
 * 로그인 직후(토큰/유저/권한/메뉴 정책이 모두 준비된 시점)에
 * 다음 순서로 초기 진입 경로를 결정합니다:
 *
 * 1. userMenuPolicy.defaultLandingRouteKey가 있다면:
 *    - 해당 routeKey가 accessibleRouteKeys에 포함되어 있는지 확인하고,
 *      포함되어 있다면 그 path로 redirect.
 * 2. 위가 없거나 접근 불가라면:
 *    - accessibleRouteKeys[0] (첫 번째 접근 가능한 routeKey)를 찾아 그 path로 redirect.
 * 3. accessibleRouteKeys가 비어있다면:
 *    - "접근 가능한 메뉴가 없습니다"라는 안내 페이지 또는 403/EmptyState 페이지로 이동.
 *
 * @example
 * // 기본 사용 (인증만 체크)
 * <Route
 *   path="/dashboard"
 *   element={
 *     <ProtectedRoute>
 *       <DashboardPage />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * @example
 * // 권한 체크 포함
 * <Route
 *   path="/users"
 *   element={
 *     <ProtectedRoute requiredPermissions={['page:users:list:view']}>
 *       <UserListPage />
 *     </ProtectedRoute>
 *   }
 * />
 *
 * @example
 * // routeKey 기반 체크 (User Menu Policy)
 * <Route
 *   path="/users"
 *   element={
 *     <ProtectedRoute requiredRouteKey="users.list">
 *       <UserListPage />
 *     </ProtectedRoute>
 *   }
 * />
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth/login",
  requiredPermissions,
  requiredRouteKey,
  forbiddenFallback,
  forbiddenRedirectTo,
}) => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { hasAllPermissions } = usePermission();

  // authStore에서 accessibleRouteKeys 가져오기
  const accessibleRouteKeys = useAuthStore(
    (state) => state.accessibleRouteKeys
  );

  // ========================================
  // 1. 인증 체크
  // ========================================

  if (!isAuthenticated) {
    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    // state에 현재 경로를 저장하여 로그인 후 돌아올 수 있게 함
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  // ========================================
  // 2. 권한(Permission) 체크
  // ========================================

  if (requiredPermissions && requiredPermissions.length > 0) {
    const hasPermission = hasAllPermissions(requiredPermissions);

    if (!hasPermission) {
      // 리다이렉트 경로가 지정된 경우
      if (forbiddenRedirectTo) {
        return <Navigate to={forbiddenRedirectTo} replace />;
      }

      // 커스텀 Fallback이 있으면 사용
      if (forbiddenFallback) {
        return <>{forbiddenFallback}</>;
      }

      // 기본 ForbiddenPage 표시
      return <ForbiddenPage requiredPermissions={requiredPermissions} />;
    }
  }

  // ========================================
  // 3. routeKey 기반 접근 제어 (User Menu Policy)
  // ========================================

  if (requiredRouteKey) {
    const canAccessRoute = accessibleRouteKeys.includes(requiredRouteKey);

    if (!canAccessRoute) {
      // 리다이렉트 경로가 지정된 경우
      if (forbiddenRedirectTo) {
        return <Navigate to={forbiddenRedirectTo} replace />;
      }

      // 커스텀 Fallback이 있으면 사용
      if (forbiddenFallback) {
        return <>{forbiddenFallback}</>;
      }

      // 기본 ForbiddenPage 표시
      return (
        <ForbiddenPage
          message={`이 페이지에 대한 접근 권한이 없습니다. (routeKey: ${requiredRouteKey})`}
        />
      );
    }
  }

  // ========================================
  // 4. 현재 경로의 routeKey 기반 접근 체크
  // ========================================

  // 현재 경로에서 routeKey 추출
  const currentRouteKey = getRouteKeyByPath(routeConfig, location.pathname);

  // routeKey가 있고, accessibleRouteKeys에 없으면 접근 차단
  if (
    currentRouteKey &&
    accessibleRouteKeys.length > 0 &&
    !accessibleRouteKeys.includes(currentRouteKey)
  ) {
    // 리다이렉트 경로가 지정된 경우
    if (forbiddenRedirectTo) {
      return <Navigate to={forbiddenRedirectTo} replace />;
    }

    // 기본 ForbiddenPage 표시
    return (
      <ForbiddenPage
        message={`이 페이지에 대한 접근 권한이 없습니다. (routeKey: ${currentRouteKey})`}
      />
    );
  }

  // 모든 체크 통과 - 자식 렌더링
  return <>{children}</>;
};

ProtectedRoute.displayName = "ProtectedRoute";

// ========================================
// Initial Landing Route Handler
// ========================================

/**
 * 로그인 직후 초기 진입 페이지로 리다이렉트하는 컴포넌트
 *
 * @description
 * 이 컴포넌트는 로그인 완료 후 App 또는 MainLayout 첫 렌더에서만 실행됩니다.
 * 일반적인 경로 이동(사용자가 직접 URL을 입력하거나 메뉴 클릭)은 기존 ProtectedRoute 로직을 따릅니다.
 *
 * 결정 순서:
 * 1. 로그인 시 state.from이 있으면 (이전 경로) 그곳으로 복귀
 * 2. userMenuPolicy.defaultLandingRouteKey가 있고 접근 가능하면 그 path로 이동
 * 3. 없으면 첫 번째 접근 가능한 페이지로 이동
 * 4. 접근 가능한 페이지가 없으면 /forbidden으로 이동
 */
export interface InitialLandingHandlerProps {
  /** 자식 요소 */
  children: React.ReactNode;
  /** 로그인 페이지에서 넘어온 이전 경로가 있으면 우선 사용할지 여부 */
  useFromState?: boolean;
}

export const InitialLandingHandler: React.FC<InitialLandingHandlerProps> = ({
  children,
  useFromState = true,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const accessibleRouteKeys = useAuthStore(
    (state) => state.accessibleRouteKeys
  );
  const defaultLandingRouteKey = useAuthStore(
    (state) => state.defaultLandingRouteKey
  );
  const isFullyLoaded = useAuthStore((state) => state.isFullyLoaded);

  // 초기 리다이렉트가 이미 수행되었는지 추적
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    // 조건: 인증됨, 로딩 완료, 아직 리다이렉트 안 함, 루트 경로일 때만
    if (
      isAuthenticated &&
      isFullyLoaded() &&
      !hasRedirectedRef.current &&
      (location.pathname === "/" || location.pathname === "")
    ) {
      hasRedirectedRef.current = true;

      // 1. 로그인 시 state.from이 있으면 복귀
      const fromState = (location.state as { from?: string })?.from;
      if (useFromState && fromState && fromState !== "/auth/login") {
        // 해당 경로가 접근 가능한지 확인
        const fromRouteKey = getRouteKeyByPath(routeConfig, fromState);
        if (!fromRouteKey || accessibleRouteKeys.includes(fromRouteKey)) {
          navigate(fromState, { replace: true });
          return;
        }
      }

      // 2. defaultLandingRouteKey가 있고 접근 가능하면 사용
      if (
        defaultLandingRouteKey &&
        accessibleRouteKeys.includes(defaultLandingRouteKey)
      ) {
        const path = getPathByRouteKey(routeConfig, defaultLandingRouteKey);
        if (path) {
          navigate(path, { replace: true });
          return;
        }
      }

      // 3. 첫 번째 접근 가능한 페이지로 이동
      if (accessibleRouteKeys.length > 0) {
        const firstRouteKey = accessibleRouteKeys[0];
        const path = getPathByRouteKey(routeConfig, firstRouteKey);
        if (path) {
          navigate(path, { replace: true });
          return;
        }
      }

      // 4. 접근 가능한 페이지가 없으면 forbidden
      navigate("/forbidden", { replace: true });
    }
  }, [
    isAuthenticated,
    isFullyLoaded,
    location.pathname,
    location.state,
    accessibleRouteKeys,
    defaultLandingRouteKey,
    navigate,
    useFromState,
  ]);

  return <>{children}</>;
};

InitialLandingHandler.displayName = "InitialLandingHandler";

// ========================================
// No Access Page Component
// ========================================

/**
 * 접근 가능한 메뉴가 없을 때 표시하는 컴포넌트
 */
export const NoAccessPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login", { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-softone-bg p-8">
      <div className="max-w-md text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-softone-text mb-4">
          접근 가능한 메뉴가 없습니다
        </h1>

        <p className="text-softone-text-secondary mb-8">
          현재 계정에 할당된 메뉴 권한이 없습니다.
          <br />
          관리자에게 문의하여 필요한 권한을 요청해 주세요.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 bg-softone-primary text-white rounded-lg hover:bg-softone-primary-dark transition-colors"
          >
            로그아웃
          </button>

          <p className="text-sm text-softone-text-muted">
            문의: admin@softone.co.kr
          </p>
        </div>
      </div>
    </div>
  );
};

NoAccessPage.displayName = "NoAccessPage";
