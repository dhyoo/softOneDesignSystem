/**
 * SoftOne Design System(SDS) - Auth Store
 * 작성: SoftOne Frontend Team
 *
 * 이 파일은 사용자 단위(User Menu Policy) 메뉴/기능 접근 권한을 정의/적용하기 위한 구현입니다.
 * Role/Grade 기반 RBAC 위에, 사용자별 예외 정책(허용/차단/기본 진입 페이지)을 오버레이합니다.
 *
 * Zustand 기반 인증 상태 관리:
 *   - 사용자 정보, 토큰, 역할(roles) 기반 인증/인가
 *   - Role, Grade 기반 Permission 시스템
 *   - User Menu Policy 기반 사용자별 메뉴 접근 제어
 *   - persist 미들웨어로 로컬스토리지 연동
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Role,
  Grade,
  PermissionKey,
  computePermissions,
} from "../auth/role.types";
import type { UserMenuPolicy } from "../auth/userMenuPolicy.types";
import type { MenuNode } from "../router/menu.types";
import { buildAccessContext } from "../router/menuAccessUtils";
import { routeConfig } from "../router/routeConfig";
import { menuTree } from "../router/menuConfig";

// ========================================
// Auth Types
// ========================================

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[]; // 기존 호환용 (ADMIN, USER 등)
}

export interface AuthState {
  /** 현재 로그인한 사용자 정보 */
  user: User | null;
  /** 액세스 토큰 */
  accessToken: string | null;
  /** 사용자 역할 (RBAC) */
  role: Role | null;
  /** 사용자 직급 */
  grade: Grade | null;
  /** Role/Grade 기반 기본 권한 목록 */
  basePermissions: PermissionKey[];
  /** 최종 계산된 권한 목록 (RBAC + UserMenuPolicy) */
  permissions: PermissionKey[];
  /** 사용자별 메뉴 정책 */
  userMenuPolicy: UserMenuPolicy | null;
  /** 접근 가능한 routeKey 목록 */
  accessibleRouteKeys: string[];
  /** 필터링된 메뉴 트리 */
  filteredMenuTree: MenuNode[];
  /** 기본 랜딩 페이지 routeKey */
  defaultLandingRouteKey: string | null;
  /** 인증 로딩 상태 */
  isAuthLoading: boolean;
  /** 메뉴 정책 로딩 상태 */
  isPolicyLoading: boolean;
  /** 인증 에러 */
  authError: string | null;
}

export interface AuthActions {
  /**
   * 로그인 처리
   * @param payload 사용자 정보와 토큰
   */
  login: (payload: {
    user: User;
    accessToken: string;
    role?: Role;
    grade?: Grade;
  }) => void;

  /**
   * 로그아웃 처리
   */
  logout: () => void;

  /**
   * 사용자 정보 업데이트
   */
  updateUser: (user: Partial<User>) => void;

  /**
   * Role/Grade 업데이트
   */
  updateRoleAndGrade: (role: Role | null, grade: Grade | null) => void;

  /**
   * User Menu Policy 설정
   */
  setUserMenuPolicy: (policy: UserMenuPolicy | null) => void;

  /**
   * Access Context 재계산 (권한/메뉴 정책 변경 시)
   */
  recomputeAccessContext: () => void;

  /**
   * 인증 로딩 상태 설정
   */
  setAuthLoading: (loading: boolean) => void;

  /**
   * 메뉴 정책 로딩 상태 설정
   */
  setPolicyLoading: (loading: boolean) => void;

  /**
   * 인증 에러 설정
   */
  setAuthError: (error: string | null) => void;
}

export interface AuthGetters {
  /** 인증 여부 */
  isAuthenticated: () => boolean;

  /** 특정 역할 보유 여부 (기존 호환) */
  hasRole: (role: string) => boolean;

  /** 특정 역할들 중 하나라도 보유 여부 */
  hasAnyRole: (roles: string[]) => boolean;

  /** 모든 역할 보유 여부 */
  hasAllRoles: (roles: string[]) => boolean;

  /** 특정 권한 보유 여부 */
  hasPermission: (permission: PermissionKey) => boolean;

  /** 특정 권한들 중 하나라도 보유 여부 */
  hasAnyPermission: (permissions: PermissionKey[]) => boolean;

  /** 모든 권한 보유 여부 */
  hasAllPermissions: (permissions: PermissionKey[]) => boolean;

  /** 특정 routeKey 접근 가능 여부 */
  canAccessRoute: (routeKey: string) => boolean;

  /** 인증 및 정책 로딩 완료 여부 */
  isFullyLoaded: () => boolean;
}

export type AuthStore = AuthState & AuthActions & AuthGetters;

// ========================================
// Initial State
// ========================================

const initialState: AuthState = {
  user: null,
  accessToken: null,
  role: null,
  grade: null,
  basePermissions: [],
  permissions: [],
  userMenuPolicy: null,
  accessibleRouteKeys: [],
  filteredMenuTree: [],
  defaultLandingRouteKey: null,
  isAuthLoading: false,
  isPolicyLoading: false,
  authError: null,
};

// ========================================
// Auth Store Implementation
// ========================================

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // ========================================
      // State
      // ========================================
      ...initialState,

      // ========================================
      // Actions
      // ========================================

      login: (payload) => {
        const { user, accessToken, role, grade } = payload;

        // Role과 Grade에서 기본 Permission 계산
        const basePermissions = computePermissions(role ?? null, grade ?? null);

        // 초기 Access Context 계산 (정책 없이)
        const context = buildAccessContext({
          routes: routeConfig,
          menuTree: menuTree,
          basePermissions,
          userMenuPolicy: null,
        });

        set({
          user,
          accessToken,
          role: role ?? null,
          grade: grade ?? null,
          basePermissions,
          permissions: context.finalPermissions,
          accessibleRouteKeys: context.accessibleRouteKeys,
          filteredMenuTree: context.filteredMenuTree,
          defaultLandingRouteKey: context.defaultLandingRouteKey,
          authError: null,
        });
      },

      logout: () => {
        // 상태 초기화
        set(initialState);
        // 로컬스토리지 명시적 클리어
        localStorage.removeItem("sds-auth-storage");
      },

      updateUser: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },

      updateRoleAndGrade: (role, grade) => {
        const basePermissions = computePermissions(role, grade);
        const { userMenuPolicy } = get();

        // Access Context 재계산
        const context = buildAccessContext({
          routes: routeConfig,
          menuTree: menuTree,
          basePermissions,
          userMenuPolicy,
        });

        set({
          role,
          grade,
          basePermissions,
          permissions: context.finalPermissions,
          accessibleRouteKeys: context.accessibleRouteKeys,
          filteredMenuTree: context.filteredMenuTree,
          defaultLandingRouteKey: context.defaultLandingRouteKey,
        });
      },

      setUserMenuPolicy: (policy) => {
        const { basePermissions } = get();

        // Access Context 재계산
        const context = buildAccessContext({
          routes: routeConfig,
          menuTree: menuTree,
          basePermissions,
          userMenuPolicy: policy,
        });

        set({
          userMenuPolicy: policy,
          permissions: context.finalPermissions,
          accessibleRouteKeys: context.accessibleRouteKeys,
          filteredMenuTree: context.filteredMenuTree,
          defaultLandingRouteKey: context.defaultLandingRouteKey,
          isPolicyLoading: false,
        });
      },

      recomputeAccessContext: () => {
        const { basePermissions, userMenuPolicy } = get();

        const context = buildAccessContext({
          routes: routeConfig,
          menuTree: menuTree,
          basePermissions,
          userMenuPolicy,
        });

        set({
          permissions: context.finalPermissions,
          accessibleRouteKeys: context.accessibleRouteKeys,
          filteredMenuTree: context.filteredMenuTree,
          defaultLandingRouteKey: context.defaultLandingRouteKey,
        });
      },

      setAuthLoading: (loading) => {
        set({ isAuthLoading: loading });
      },

      setPolicyLoading: (loading) => {
        set({ isPolicyLoading: loading });
      },

      setAuthError: (error) => {
        set({ authError: error });
      },

      // ========================================
      // Getters
      // ========================================

      isAuthenticated: () => {
        const { user, accessToken } = get();
        return !!user && !!accessToken;
      },

      hasRole: (role) => {
        const { user } = get();
        return user?.roles?.includes(role) ?? false;
      },

      hasAnyRole: (roles) => {
        const { user } = get();
        if (!user?.roles) return false;
        return roles.some((role) => user.roles.includes(role));
      },

      hasAllRoles: (roles) => {
        const { user } = get();
        if (!user?.roles) return false;
        return roles.every((role) => user.roles.includes(role));
      },

      hasPermission: (permission) => {
        const { permissions } = get();
        return permissions.includes(permission);
      },

      hasAnyPermission: (perms) => {
        const { permissions } = get();
        if (perms.length === 0) return true;
        return perms.some((p) => permissions.includes(p));
      },

      hasAllPermissions: (perms) => {
        const { permissions } = get();
        if (perms.length === 0) return true;
        return perms.every((p) => permissions.includes(p));
      },

      canAccessRoute: (routeKey) => {
        const { accessibleRouteKeys } = get();
        return accessibleRouteKeys.includes(routeKey);
      },

      isFullyLoaded: () => {
        const { isAuthLoading, isPolicyLoading } = get();
        return !isAuthLoading && !isPolicyLoading;
      },
    }),
    {
      name: "sds-auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        role: state.role,
        grade: state.grade,
        basePermissions: state.basePermissions,
        permissions: state.permissions,
        userMenuPolicy: state.userMenuPolicy,
        accessibleRouteKeys: state.accessibleRouteKeys,
        // filteredMenuTree는 함수/아이콘을 포함하므로 저장하지 않음
        defaultLandingRouteKey: state.defaultLandingRouteKey,
      }),
      // 복원 시 Access Context 재계산
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 저장된 데이터 복원 후 Access Context 재계산
          setTimeout(() => {
            state.recomputeAccessContext();
          }, 0);
        }
      },
    }
  )
);

// ========================================
// Selectors (성능 최적화용)
// ========================================

/**
 * 인증 여부 셀렉터
 */
export const selectIsAuthenticated = (state: AuthStore) =>
  !!state.user && !!state.accessToken;

/**
 * 현재 사용자 셀렉터
 */
export const selectCurrentUser = (state: AuthStore) => state.user;

/**
 * 권한 목록 셀렉터
 */
export const selectPermissions = (state: AuthStore) => state.permissions;

/**
 * 접근 가능한 routeKey 목록 셀렉터
 */
export const selectAccessibleRouteKeys = (state: AuthStore) =>
  state.accessibleRouteKeys;

/**
 * 필터링된 메뉴 트리 셀렉터
 */
export const selectFilteredMenuTree = (state: AuthStore) =>
  state.filteredMenuTree;

/**
 * 기본 랜딩 페이지 routeKey 셀렉터
 */
export const selectDefaultLandingRouteKey = (state: AuthStore) =>
  state.defaultLandingRouteKey;

/**
 * User Menu Policy 셀렉터
 */
export const selectUserMenuPolicy = (state: AuthStore) => state.userMenuPolicy;

/**
 * 로딩 상태 셀렉터
 */
export const selectIsLoading = (state: AuthStore) =>
  state.isAuthLoading || state.isPolicyLoading;
