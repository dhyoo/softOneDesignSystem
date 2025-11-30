/**
 * SoftOne Design System - usePermission Hook
 * 작성: SoftOne Frontend Team
 *
 * 이 파일에서는 Role/Grade 기반 PermissionKey를 사용하여
 * 메뉴/페이지/버튼/액션의 표시/비활성화/숨김을 제어합니다.
 *
 * authStore를 구독하여 권한 검사 기능을 제공합니다.
 */

import { useAuthStore } from "../store/authStore";
import type { Role, Grade, PermissionKey } from "../auth/role.types";
import { isActionDisabledByGrade } from "../utils/gradeUtils";

// ========================================
// Types
// ========================================

export interface UsePermissionResult {
  /** 특정 권한 보유 여부 확인 */
  hasPermission: (permission: PermissionKey) => boolean;
  /** 권한 목록 중 하나라도 보유 여부 확인 */
  hasAnyPermission: (permissions: PermissionKey[]) => boolean;
  /** 권한 목록 전체 보유 여부 확인 */
  hasAllPermissions: (permissions: PermissionKey[]) => boolean;
  /** 직급에 의해 액션이 제한되는지 확인 */
  isDisabledByGrade: (minRequiredGrade: Grade) => boolean;
  /** 권한 및 직급 조건 모두 확인 */
  canPerformAction: (
    requiredPermission?: PermissionKey,
    minRequiredGrade?: Grade
  ) => boolean;
  /** 현재 사용자의 역할 */
  role: Role | null;
  /** 현재 사용자의 직급 */
  grade: Grade | null;
  /** 현재 사용자의 권한 목록 */
  permissions: PermissionKey[];
  /** 인증 여부 */
  isAuthenticated: boolean;
}

// ========================================
// usePermission Hook
// ========================================

/**
 * 권한 검사를 위한 훅
 *
 * @example
 * const { hasPermission, canPerformAction, role, grade } = usePermission();
 *
 * // 단일 권한 검사
 * if (hasPermission('action:users:create')) {
 *   // 사용자 생성 버튼 표시
 * }
 *
 * // 권한 + 직급 조건 검사
 * if (canPerformAction('action:users:delete', 'SENIOR')) {
 *   // 삭제 가능
 * }
 */
export function usePermission(): UsePermissionResult {
  const role = useAuthStore((state) => state.role);
  const grade = useAuthStore((state) => state.grade);
  const permissions = useAuthStore((state) => state.permissions);
  const hasPermissionStore = useAuthStore((state) => state.hasPermission);
  const hasAnyPermissionStore = useAuthStore((state) => state.hasAnyPermission);
  const hasAllPermissionsStore = useAuthStore(
    (state) => state.hasAllPermissions
  );
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const isAuthenticated = !!user && !!accessToken;

  /**
   * 직급에 의해 액션이 제한되는지 확인
   */
  const isDisabledByGrade = (minRequiredGrade: Grade): boolean => {
    return isActionDisabledByGrade(grade, minRequiredGrade);
  };

  /**
   * 권한 및 직급 조건을 모두 확인하여 액션 수행 가능 여부 반환
   */
  const canPerformAction = (
    requiredPermission?: PermissionKey,
    minRequiredGrade?: Grade
  ): boolean => {
    // 권한 검사
    if (requiredPermission && !hasPermissionStore(requiredPermission)) {
      return false;
    }

    // 직급 검사
    if (minRequiredGrade && isActionDisabledByGrade(grade, minRequiredGrade)) {
      return false;
    }

    return true;
  };

  return {
    hasPermission: hasPermissionStore,
    hasAnyPermission: hasAnyPermissionStore,
    hasAllPermissions: hasAllPermissionsStore,
    isDisabledByGrade,
    canPerformAction,
    role,
    grade,
    permissions,
    isAuthenticated,
  };
}

// ========================================
// 컴포넌트용 Permission Guard
// ========================================

export interface PermissionGuardProps {
  /** 필요한 권한 */
  permission?: PermissionKey;
  /** 필요한 권한들 (OR 조건) */
  anyPermissions?: PermissionKey[];
  /** 필요한 권한들 (AND 조건) */
  allPermissions?: PermissionKey[];
  /** 최소 필요 직급 */
  minGrade?: Grade;
  /** 권한이 없을 때 표시할 컴포넌트 */
  fallback?: React.ReactNode;
  /** 권한이 없을 때 null 반환 여부 */
  hideIfNoPermission?: boolean;
  /** 자식 컴포넌트 */
  children: React.ReactNode;
}

/**
 * 권한 기반 조건부 렌더링 컴포넌트
 *
 * @example
 * <PermissionGuard permission="action:users:create">
 *   <CreateUserButton />
 * </PermissionGuard>
 *
 * <PermissionGuard
 *   anyPermissions={['action:users:update', 'action:users:delete']}
 *   minGrade="SENIOR"
 *   fallback={<DisabledButton />}
 * >
 *   <EditUserButton />
 * </PermissionGuard>
 */
export function PermissionGuard({
  permission,
  anyPermissions,
  allPermissions,
  minGrade,
  fallback = null,
  hideIfNoPermission = true,
  children,
}: PermissionGuardProps): React.ReactNode {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isDisabledByGrade,
  } = usePermission();

  // 권한 검사
  let hasRequiredPermission = true;

  if (permission) {
    hasRequiredPermission = hasPermission(permission);
  } else if (anyPermissions && anyPermissions.length > 0) {
    hasRequiredPermission = hasAnyPermission(anyPermissions);
  } else if (allPermissions && allPermissions.length > 0) {
    hasRequiredPermission = hasAllPermissions(allPermissions);
  }

  // 직급 검사
  const hasRequiredGrade = minGrade ? !isDisabledByGrade(minGrade) : true;

  // 모든 조건 충족 여부
  const isAllowed = hasRequiredPermission && hasRequiredGrade;

  if (!isAllowed) {
    return hideIfNoPermission ? null : fallback;
  }

  return <>{children}</>;
}

// ========================================
// 편의용 타입 내보내기
// ========================================

export type { Role, Grade, PermissionKey } from "../auth/role.types";
