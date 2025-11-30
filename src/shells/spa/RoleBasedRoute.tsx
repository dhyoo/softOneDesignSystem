/**
 * SoftOne Design System(SDS) - Role Based Route
 * 작성: SoftOne Frontend Team
 * 설명: 특정 역할이 필요한 라우트를 보호하는 컴포넌트.
 *      필요한 역할이 없는 사용자는 접근 거부 페이지 또는 리다이렉트됩니다.
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@core/hooks/useAuth";
import { Card, CardBody } from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { ShieldX } from "lucide-react";
import { useNavigation } from "@core/router/NavigationContext";

// ========================================
// Role Based Route Types
// ========================================

export interface RoleBasedRouteProps {
  /** 자식 요소 */
  children: React.ReactNode;
  /** 필요한 역할 (하나라도 있으면 접근 허용) */
  allowedRoles: string[];
  /** 권한 없을 때 리다이렉트 경로 (설정 시 리다이렉트, 미설정 시 AccessDenied 표시) */
  redirectTo?: string;
  /** 권한 없을 때 표시할 커스텀 Fallback */
  fallback?: React.ReactNode;
}

// ========================================
// Access Denied Component
// ========================================

const AccessDenied: React.FC<{ requiredRoles: string[] }> = ({
  requiredRoles,
}) => {
  const navigation = useNavigation();

  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Card className="max-w-md w-full text-center">
        <CardBody>
          <div className="mx-auto w-16 h-16 rounded-full bg-softone-danger-light flex items-center justify-center mb-4">
            <ShieldX className="w-8 h-8 text-softone-danger" />
          </div>
          <h2 className="text-xl font-semibold text-softone-text mb-2">
            접근 권한이 없습니다
          </h2>
          <p className="text-softone-text-secondary mb-4">
            이 페이지에 접근하려면 다음 역할이 필요합니다:
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {requiredRoles.map((role) => (
              <span
                key={role}
                className="px-3 py-1 bg-softone-primary-light text-softone-primary rounded-full text-sm font-medium"
              >
                {role}
              </span>
            ))}
          </div>
          <Button
            variant="primary"
            onClick={() => navigation.push("/dashboard")}
          >
            대시보드로 이동
          </Button>
        </CardBody>
      </Card>
    </div>
  );
};

// ========================================
// Role Based Route Component
// ========================================

/**
 * RoleBasedRoute - 역할 기반 접근 제어
 *
 * @example
 * <Route
 *   path="/admin"
 *   element={
 *     <RoleBasedRoute allowedRoles={['ADMIN']}>
 *       <AdminPage />
 *     </RoleBasedRoute>
 *   }
 * />
 */
export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo,
  fallback,
}) => {
  const { hasAnyRole, isAuthenticated } = useAuth();

  // 인증되지 않은 경우 (ProtectedRoute와 함께 사용하지 않은 경우)
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // 역할 체크
  const hasRequiredRole =
    allowedRoles.length === 0 || hasAnyRole(allowedRoles);

  if (!hasRequiredRole) {
    // 커스텀 Fallback이 있으면 사용
    if (fallback) {
      return <>{fallback}</>;
    }

    // 리다이렉트 경로가 있으면 리다이렉트
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // 기본 AccessDenied 컴포넌트 표시
    return <AccessDenied requiredRoles={allowedRoles} />;
  }

  return <>{children}</>;
};

RoleBasedRoute.displayName = "RoleBasedRoute";
