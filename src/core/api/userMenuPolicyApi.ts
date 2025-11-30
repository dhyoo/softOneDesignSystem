/**
 * SoftOne Design System - User Menu Policy API
 * 작성: SoftOne Frontend Team
 *
 * 이 파일은 사용자 단위(User Menu Policy) 메뉴/기능 접근 권한을 정의/적용하기 위한 구현입니다.
 * Role/Grade 기반 RBAC 위에, 사용자별 예외 정책(허용/차단/기본 진입 페이지)을 오버레이합니다.
 *
 * 실제 서버 연동 시에는 httpClient를 사용하고,
 * 개발/테스트 환경에서는 Mock 데이터를 반환합니다.
 */

import { httpClient } from "./httpClient";
import type {
  UserMenuPolicy,
  UserMenuPolicyInput,
  UserMenuPolicyResponse,
} from "../auth/userMenuPolicy.types";
import { PERMISSION_KEYS } from "../auth/role.types";

// ========================================
// Mock Data (개발/테스트용)
// ========================================

/**
 * 사용자별 Mock User Menu Policy
 * 실제 서버가 없을 때 사용
 */
const MOCK_USER_POLICIES: Record<string, UserMenuPolicy> = {
  // 일반 사용자 - 기본 정책 (제한 없음)
  "user-1": {
    userId: "user-1",
    allowedPermissions: [],
    deniedPermissions: [],
    allowedRouteKeys: undefined,
    deniedRouteKeys: [],
    defaultLandingRouteKey: "dashboard.main",
    isActive: true,
    description: "기본 사용자 정책",
    createdAt: "2024-01-01T00:00:00Z",
  },

  // VIP 사용자 - 추가 권한 부여
  "user-vip": {
    userId: "user-vip",
    allowedPermissions: [
      PERMISSION_KEYS.MENU_DASHBOARD_OPS_VIEW,
      PERMISSION_KEYS.PAGE_DASHBOARD_OPS_VIEW,
      PERMISSION_KEYS.ACTION_DASHBOARD_OPS_VIEW,
    ],
    deniedPermissions: [],
    allowedRouteKeys: undefined,
    deniedRouteKeys: [],
    defaultLandingRouteKey: "dashboard.ops",
    isActive: true,
    description: "VIP 사용자 - 운영 대시보드 접근 허용",
    createdAt: "2024-01-15T00:00:00Z",
  },

  // 제한된 사용자 - 특정 메뉴 차단
  "user-restricted": {
    userId: "user-restricted",
    allowedPermissions: [],
    deniedPermissions: [
      PERMISSION_KEYS.MENU_USERS_VIEW,
      PERMISSION_KEYS.PAGE_USERS_LIST_VIEW,
    ],
    allowedRouteKeys: undefined,
    deniedRouteKeys: ["users.list", "users.detail", "grid.samples.infinite"],
    defaultLandingRouteKey: "dashboard.main",
    isActive: true,
    description: "제한된 사용자 - 사용자 관리 메뉴 차단",
    createdAt: "2024-02-01T00:00:00Z",
  },

  // 화이트리스트 사용자 - 특정 페이지만 허용
  "user-whitelist": {
    userId: "user-whitelist",
    allowedPermissions: [],
    deniedPermissions: [],
    allowedRouteKeys: ["dashboard.main", "products.crud", "articles.list"],
    deniedRouteKeys: [],
    defaultLandingRouteKey: "dashboard.main",
    isActive: true,
    description: "화이트리스트 사용자 - 지정된 페이지만 접근 가능",
    createdAt: "2024-02-15T00:00:00Z",
  },

  // 만료된 정책
  "user-expired": {
    userId: "user-expired",
    allowedPermissions: [PERMISSION_KEYS.MENU_DASHBOARD_OPS_VIEW],
    deniedPermissions: [],
    allowedRouteKeys: undefined,
    deniedRouteKeys: [],
    defaultLandingRouteKey: "dashboard.main",
    isActive: true,
    expiresAt: "2023-12-31T23:59:59Z", // 이미 만료됨
    description: "만료된 정책 테스트",
    createdAt: "2023-01-01T00:00:00Z",
  },
};

// ========================================
// API Configuration
// ========================================

/**
 * Mock API 사용 여부
 * 실제 서버가 없으면 true로 설정
 */
const USE_MOCK_API = true;

/**
 * Mock API 지연 시간 (ms)
 */
const MOCK_DELAY = 300;

// ========================================
// Helper Functions
// ========================================

/**
 * Mock API 지연 시뮬레이션
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ========================================
// User Menu Policy API Functions
// ========================================

/**
 * 사용자의 메뉴 정책을 조회합니다.
 *
 * @param userId 사용자 ID
 * @returns UserMenuPolicy 또는 null (정책 없음)
 *
 * @example
 * ```ts
 * const policy = await fetchUserMenuPolicy("user-123");
 * if (policy) {
 *   console.log("정책 발견:", policy);
 * }
 * ```
 */
export async function fetchUserMenuPolicy(
  userId: string
): Promise<UserMenuPolicy | null> {
  if (USE_MOCK_API) {
    await delay(MOCK_DELAY);

    const policy = MOCK_USER_POLICIES[userId];
    if (!policy) {
      // 정책이 없는 사용자는 기본 정책 반환
      return {
        userId,
        allowedPermissions: [],
        deniedPermissions: [],
        allowedRouteKeys: undefined,
        deniedRouteKeys: [],
        defaultLandingRouteKey: "dashboard.main",
        isActive: true,
      };
    }

    return { ...policy };
  }

  // 실제 API 호출
  try {
    const response = await httpClient.get<UserMenuPolicyResponse>(
      `/auth/users/${userId}/menu-policy`
    );
    return response.data.data;
  } catch (error) {
    console.error("[userMenuPolicyApi] fetchUserMenuPolicy 실패:", error);
    return null;
  }
}

/**
 * 사용자의 메뉴 정책을 저장/업데이트합니다.
 *
 * @param userId 사용자 ID
 * @param policyInput 정책 입력 데이터
 * @returns 저장된 UserMenuPolicy
 */
export async function saveUserMenuPolicy(
  userId: string,
  policyInput: UserMenuPolicyInput
): Promise<UserMenuPolicy | null> {
  if (USE_MOCK_API) {
    await delay(MOCK_DELAY);

    const now = new Date().toISOString();
    const existingPolicy = MOCK_USER_POLICIES[userId];

    const updatedPolicy: UserMenuPolicy = {
      ...existingPolicy,
      userId,
      ...policyInput,
      updatedAt: now,
      createdAt: existingPolicy?.createdAt || now,
    };

    MOCK_USER_POLICIES[userId] = updatedPolicy;
    return { ...updatedPolicy };
  }

  // 실제 API 호출
  try {
    const response = await httpClient.put<UserMenuPolicyResponse>(
      `/auth/users/${userId}/menu-policy`,
      policyInput
    );
    return response.data.data;
  } catch (error) {
    console.error("[userMenuPolicyApi] saveUserMenuPolicy 실패:", error);
    return null;
  }
}

/**
 * 사용자의 메뉴 정책을 삭제합니다.
 *
 * @param userId 사용자 ID
 * @returns 삭제 성공 여부
 */
export async function deleteUserMenuPolicy(userId: string): Promise<boolean> {
  if (USE_MOCK_API) {
    await delay(MOCK_DELAY);

    if (MOCK_USER_POLICIES[userId]) {
      delete MOCK_USER_POLICIES[userId];
      return true;
    }
    return false;
  }

  // 실제 API 호출
  try {
    await httpClient.delete(`/auth/users/${userId}/menu-policy`);
    return true;
  } catch (error) {
    console.error("[userMenuPolicyApi] deleteUserMenuPolicy 실패:", error);
    return false;
  }
}

/**
 * 모든 사용자의 메뉴 정책 목록을 조회합니다.
 * (관리자용)
 *
 * @returns UserMenuPolicy 배열
 */
export async function fetchAllUserMenuPolicies(): Promise<UserMenuPolicy[]> {
  if (USE_MOCK_API) {
    await delay(MOCK_DELAY);
    return Object.values(MOCK_USER_POLICIES);
  }

  // 실제 API 호출
  try {
    const response = await httpClient.get<{
      success: boolean;
      data: UserMenuPolicy[];
    }>("/auth/users/menu-policies");
    return response.data.data || [];
  } catch (error) {
    console.error("[userMenuPolicyApi] fetchAllUserMenuPolicies 실패:", error);
    return [];
  }
}

/**
 * 사용자 검색 (정책 설정용)
 *
 * @param query 검색어
 * @returns 사용자 목록 (간략 정보)
 */
export async function searchUsersForPolicy(
  query: string
): Promise<Array<{ id: string; name: string; email: string }>> {
  if (USE_MOCK_API) {
    await delay(MOCK_DELAY);

    // Mock 사용자 목록
    const mockUsers = [
      { id: "user-1", name: "홍길동", email: "hong@example.com" },
      { id: "user-vip", name: "김VIP", email: "vip@example.com" },
      {
        id: "user-restricted",
        name: "박제한",
        email: "restricted@example.com",
      },
      {
        id: "user-whitelist",
        name: "이화이트",
        email: "whitelist@example.com",
      },
      { id: "user-expired", name: "최만료", email: "expired@example.com" },
      { id: "user-new-1", name: "신규사용자1", email: "new1@example.com" },
      { id: "user-new-2", name: "신규사용자2", email: "new2@example.com" },
    ];

    if (!query) return mockUsers;

    const lowerQuery = query.toLowerCase();
    return mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.id.toLowerCase().includes(lowerQuery)
    );
  }

  // 실제 API 호출
  try {
    const response = await httpClient.get<{
      success: boolean;
      data: Array<{ id: string; name: string; email: string }>;
    }>("/auth/users/search", {
      params: { q: query },
    });
    return response.data.data || [];
  } catch (error) {
    console.error("[userMenuPolicyApi] searchUsersForPolicy 실패:", error);
    return [];
  }
}

// ========================================
// Export Types
// ========================================

export type {
  UserMenuPolicy,
  UserMenuPolicyInput,
  UserMenuPolicyResponse,
} from "../auth/userMenuPolicy.types";
