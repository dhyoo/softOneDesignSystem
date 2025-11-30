/**
 * SoftOne Design System - SPA App Shell
 * GlobalErrorBoundary + Conditional Layout + AppRouter 래핑
 *
 * 인증 여부에 따라 MainLayout 또는 직접 렌더링을 결정합니다.
 */

import React from "react";
import { useLocation } from "react-router-dom";
import { GlobalErrorBoundary } from "@core/components/error/GlobalErrorBoundary";
import { MainLayout } from "@core/layout/MainLayout";
import { useAuth } from "@core/hooks/useAuth";
import { AppRouter } from "./AppRouter";

// ========================================
// Public Routes (No Layout)
// ========================================

const PUBLIC_ROUTES = ["/auth/login", "/auth/register", "/auth/forgot-password"];

// ========================================
// SPA App Shell
// ========================================

/**
 * SPA App Shell
 *
 * 애플리케이션의 최상위 레이어로:
 * 1. GlobalErrorBoundary - 런타임 에러 캐치
 * 2. Conditional Layout - 인증 상태에 따라 레이아웃 결정
 * 3. AppRouter - 라우팅
 */
export const SpaAppShell: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, roles, user } = useAuth();

  // 퍼블릭 라우트인지 확인
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    location.pathname.startsWith(route)
  );

  // 퍼블릭 라우트거나 인증되지 않은 경우 레이아웃 없이 렌더링
  if (isPublicRoute || !isAuthenticated) {
    return (
      <GlobalErrorBoundary>
        <AppRouter />
      </GlobalErrorBoundary>
    );
  }

  // 인증된 사용자는 MainLayout 적용
  return (
    <GlobalErrorBoundary>
      <MainLayout
        userRoles={roles}
        userName={user?.name}
        userEmail={user?.email}
      >
        <AppRouter />
      </MainLayout>
    </GlobalErrorBoundary>
  );
};

export default SpaAppShell;
