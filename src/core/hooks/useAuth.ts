/**
 * SoftOne Design System(SDS) - useAuth Hook
 * 작성: SoftOne Frontend Team
 * 설명: authStore를 감싼 편의 훅.
 *      컴포넌트에서 인증 상태와 액션을 쉽게 사용할 수 있습니다.
 */

import { useAuthStore, type User } from "../store/authStore";

// ========================================
// useAuth Hook
// ========================================

/**
 * 인증 관련 상태와 액션을 제공하는 훅
 *
 * @example
 * const { user, isAuthenticated, login, logout, hasRole } = useAuth();
 *
 * if (!isAuthenticated) {
 *   return <LoginPage />;
 * }
 *
 * if (hasRole('ADMIN')) {
 *   return <AdminDashboard />;
 * }
 */
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const updateUser = useAuthStore((state) => state.updateUser);
  const hasRole = useAuthStore((state) => state.hasRole);
  const hasAnyRole = useAuthStore((state) => state.hasAnyRole);
  const hasAllRoles = useAuthStore((state) => state.hasAllRoles);

  // 직접 계산 (persist 미들웨어와의 호환성 문제 방지)
  const isAuthenticated = !!user && !!accessToken;

  return {
    // State
    user,
    accessToken,
    roles: user?.roles ?? [],

    // Computed
    isAuthenticated,

    // Actions
    login,
    logout,
    updateUser,

    // Role Helpers
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
}

// ========================================
// useRequireAuth Hook
// ========================================

/**
 * 인증이 필요한 페이지에서 사용하는 훅
 * 인증되지 않은 경우 리다이렉트 처리는 ProtectedRoute에서 수행
 *
 * @example
 * const { user, roles } = useRequireAuth();
 * // user는 null이 아님이 보장됨 (ProtectedRoute 내에서 사용 시)
 */
export function useRequireAuth() {
  const { user, roles, accessToken, ...rest } = useAuth();

  return {
    user: user as User,
    roles,
    accessToken: accessToken as string,
    ...rest,
  };
}

// ========================================
// useRoleCheck Hook
// ========================================

/**
 * 역할 기반 접근 제어를 위한 훅
 *
 * @param requiredRoles 필요한 역할 배열
 * @param mode 'any' (하나라도 있으면 허용) | 'all' (모두 있어야 허용)
 *
 * @example
 * const { isAllowed, missingRoles } = useRoleCheck(['ADMIN', 'MANAGER']);
 *
 * if (!isAllowed) {
 *   return <AccessDenied />;
 * }
 */
export function useRoleCheck(
  requiredRoles: string[],
  mode: "any" | "all" = "any"
) {
  const { roles, hasAnyRole, hasAllRoles } = useAuth();

  const isAllowed =
    requiredRoles.length === 0 ||
    (mode === "any" ? hasAnyRole(requiredRoles) : hasAllRoles(requiredRoles));

  const missingRoles = requiredRoles.filter((role) => !roles.includes(role));

  return {
    isAllowed,
    missingRoles,
    userRoles: roles,
  };
}

export type { User } from "../store/authStore";
