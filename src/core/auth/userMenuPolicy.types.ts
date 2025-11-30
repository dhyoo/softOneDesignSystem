/**
 * SoftOne Design System - User Menu Policy Types
 * 작성: SoftOne Frontend Team
 *
 * 이 파일은 사용자 단위(User Menu Policy) 메뉴/기능 접근 권한을 정의하기 위한 구현입니다.
 * Role/Grade 기반 RBAC 위에, 사용자별 예외 정책(허용/차단/기본 진입 페이지)을 오버레이합니다.
 *
 * UserMenuPolicy는 Role/Grade에 기반한 기본 권한 위에,
 * 사용자별로 예외(추가 허용 또는 제한)를 정의하기 위한 구조입니다.
 *
 * 프론트에서 계산된 결과는 결국 PermissionKey + routeKey 단위로 반영됩니다.
 */

import type { PermissionKey } from "./role.types";

// ========================================
// User Menu Policy Interface
// ========================================

/**
 * 사용자별 메뉴/기능 접근 정책
 *
 * @description
 * Role/Grade 기반 RBAC 시스템 위에 사용자별 예외 정책을 오버레이합니다.
 *
 * 우선순위:
 *   1. deniedPermissions/deniedRouteKeys - 명시적 차단 (최우선)
 *   2. allowedPermissions/allowedRouteKeys - 명시적 허용
 *   3. Role/Grade 기반 기본 권한
 *
 * @example
 * ```ts
 * const policy: UserMenuPolicy = {
 *   userId: "user-123",
 *   // 기본 권한에서 대시보드 운영 메뉴 차단
 *   deniedPermissions: ["menu:dashboard:ops:view"],
 *   // 특별히 알림 템플릿 페이지 허용
 *   allowedPermissions: ["page:notifications:templates:view"],
 *   // 특정 그리드 샘플 페이지만 차단
 *   deniedRouteKeys: ["grid.samples.infinite"],
 *   // 로그인 시 대시보드로 이동
 *   defaultLandingRouteKey: "dashboard.main",
 * };
 * ```
 */
export interface UserMenuPolicy {
  /** 사용자 고유 식별자 */
  userId: string;

  /**
   * 추가로 허용할 PermissionKey 목록
   * Role/Grade 기반 권한에 추가됩니다.
   */
  allowedPermissions?: PermissionKey[];

  /**
   * 차단할 PermissionKey 목록
   * Role/Grade에서 부여된 권한이라도 이 목록에 있으면 차단됩니다.
   * (deniedPermissions가 allowedPermissions보다 우선순위가 높습니다)
   */
  deniedPermissions?: PermissionKey[];

  /**
   * 접근 허용할 routeKey 목록 (화이트리스트 모드)
   * 이 필드가 정의되면, 오직 이 목록에 포함된 routeKey만 접근 가능합니다.
   * (권한 기반 필터링 후 추가로 적용)
   */
  allowedRouteKeys?: string[];

  /**
   * 접근 차단할 routeKey 목록 (블랙리스트 모드)
   * 권한이 있더라도 이 목록에 포함된 routeKey는 접근 불가합니다.
   */
  deniedRouteKeys?: string[];

  /**
   * 로그인 후 기본 진입 페이지의 routeKey
   * accessibleRouteKeys에 포함되어 있어야 유효합니다.
   */
  defaultLandingRouteKey?: string;

  /**
   * 정책 설명 (관리자용 메모)
   */
  description?: string;

  /**
   * 정책 활성화 여부
   */
  isActive?: boolean;

  /**
   * 정책 만료일
   */
  expiresAt?: string;

  /**
   * 정책 생성일
   */
  createdAt?: string;

  /**
   * 정책 수정일
   */
  updatedAt?: string;
}

// ========================================
// Default Values
// ========================================

/**
 * 빈 User Menu Policy (정책 없음)
 */
export const EMPTY_USER_MENU_POLICY: UserMenuPolicy = {
  userId: "",
  allowedPermissions: [],
  deniedPermissions: [],
  allowedRouteKeys: undefined, // undefined = 화이트리스트 모드 비활성화
  deniedRouteKeys: [],
  defaultLandingRouteKey: undefined,
  isActive: true,
};

// ========================================
// Helper Types
// ========================================

/**
 * User Menu Policy 생성/수정 시 사용하는 입력 타입
 */
export interface UserMenuPolicyInput {
  allowedPermissions?: PermissionKey[];
  deniedPermissions?: PermissionKey[];
  allowedRouteKeys?: string[];
  deniedRouteKeys?: string[];
  defaultLandingRouteKey?: string;
  description?: string;
  isActive?: boolean;
  expiresAt?: string;
}

/**
 * User Menu Policy API 응답 타입
 */
export interface UserMenuPolicyResponse {
  success: boolean;
  data: UserMenuPolicy | null;
  message?: string;
}

// ========================================
// Validation Helpers
// ========================================

/**
 * User Menu Policy가 유효한지 검증합니다.
 */
export function isValidUserMenuPolicy(
  policy: unknown
): policy is UserMenuPolicy {
  if (!policy || typeof policy !== "object") return false;

  const p = policy as Record<string, unknown>;

  // 필수 필드 검증
  if (typeof p.userId !== "string" || p.userId.length === 0) return false;

  // 선택 필드 타입 검증
  if (
    p.allowedPermissions !== undefined &&
    !Array.isArray(p.allowedPermissions)
  ) {
    return false;
  }

  if (
    p.deniedPermissions !== undefined &&
    !Array.isArray(p.deniedPermissions)
  ) {
    return false;
  }

  if (p.allowedRouteKeys !== undefined && !Array.isArray(p.allowedRouteKeys)) {
    return false;
  }

  if (p.deniedRouteKeys !== undefined && !Array.isArray(p.deniedRouteKeys)) {
    return false;
  }

  return true;
}

/**
 * User Menu Policy가 만료되었는지 확인합니다.
 */
export function isUserMenuPolicyExpired(policy: UserMenuPolicy): boolean {
  if (!policy.expiresAt) return false;

  try {
    const expiresAt = new Date(policy.expiresAt);
    return expiresAt < new Date();
  } catch {
    return false;
  }
}

/**
 * User Menu Policy가 활성 상태인지 확인합니다.
 */
export function isUserMenuPolicyActive(policy: UserMenuPolicy): boolean {
  // 비활성화 상태
  if (policy.isActive === false) return false;

  // 만료됨
  if (isUserMenuPolicyExpired(policy)) return false;

  return true;
}
