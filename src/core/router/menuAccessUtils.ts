/**
 * SoftOne Design System - Menu Access Utilities
 * 작성: SoftOne Frontend Team
 *
 * 이 파일은 사용자 단위(User Menu Policy) 메뉴/기능 접근 권한을 정의/적용하기 위한 구현입니다.
 * Role/Grade 기반 RBAC 위에, 사용자별 예외 정책(허용/차단/기본 진입 페이지)을 오버레이합니다.
 *
 * 이 함수는 Role/Grade 기반 권한 + User Menu Policy를 통합하여,
 * 실제로 렌더링 가능한 메뉴 트리와 접근 가능한 routeKey 목록을 계산하는 핵심 엔진입니다.
 */

import type { PermissionKey } from "../auth/role.types";
import type { UserMenuPolicy } from "../auth/userMenuPolicy.types";
import { isUserMenuPolicyActive } from "../auth/userMenuPolicy.types";
import type { AppRouteMeta } from "./routeConfig";
import type {
  MenuNode,
  CategoryMenuNode,
  MenuGroupNode,
  PageMenuNode,
} from "./menu.types";
import {
  isCategoryNode,
  isMenuGroupNode,
  isPageNode,
  hasChildren,
} from "./menu.types";

// ========================================
// Types
// ========================================

/**
 * buildAccessContext 함수의 입력 인자
 */
export interface BuildAccessContextArgs {
  /** 라우트 설정 배열 (routeConfig) */
  routes: AppRouteMeta[];
  /** 메뉴 트리 (menuTree) */
  menuTree: MenuNode[];
  /** Role/Grade 기반 기본 권한 */
  basePermissions: PermissionKey[];
  /** 사용자별 메뉴 정책 (없으면 null) */
  userMenuPolicy: UserMenuPolicy | null;
}

/**
 * buildAccessContext 함수의 반환 타입
 */
export interface AccessContext {
  /** 최종 계산된 권한 목록 (RBAC + UserMenuPolicy) */
  finalPermissions: PermissionKey[];
  /** 접근 가능한 routeKey 목록 */
  accessibleRouteKeys: string[];
  /** 권한/정책이 반영된 필터링된 메뉴 트리 */
  filteredMenuTree: MenuNode[];
  /** 기본 랜딩 페이지 routeKey */
  defaultLandingRouteKey: string | null;
}

// ========================================
// Permission Computation
// ========================================

/**
 * 최종 권한을 계산합니다.
 *
 * 우선순위:
 * 1. basePermissions에서 deniedPermissions 제거
 * 2. allowedPermissions 추가
 */
export function computeFinalPermissions(
  basePermissions: PermissionKey[],
  userMenuPolicy: UserMenuPolicy | null
): PermissionKey[] {
  // 정책이 없거나 비활성화 상태면 기본 권한 그대로 반환
  if (!userMenuPolicy || !isUserMenuPolicyActive(userMenuPolicy)) {
    return [...basePermissions];
  }

  const deniedSet = new Set(userMenuPolicy.deniedPermissions || []);
  const allowedSet = new Set(userMenuPolicy.allowedPermissions || []);

  // 1. basePermissions에서 denied 제외
  let result = basePermissions.filter((p) => !deniedSet.has(p));

  // 2. allowed 추가 (중복 제거)
  result = [...new Set([...result, ...Array.from(allowedSet)])];

  return result;
}

// ========================================
// Route Access Computation
// ========================================

/**
 * 접근 가능한 routeKey 목록을 계산합니다.
 *
 * @param routes 라우트 설정 배열
 * @param finalPermissions 최종 권한 목록
 * @param userMenuPolicy 사용자 메뉴 정책
 */
export function computeAccessibleRouteKeys(
  routes: AppRouteMeta[],
  finalPermissions: PermissionKey[],
  userMenuPolicy: UserMenuPolicy | null
): string[] {
  const accessibleKeys: string[] = [];
  const permissionSet = new Set(finalPermissions);

  // 정책 활성화 여부
  const isPolicyActive =
    userMenuPolicy && isUserMenuPolicyActive(userMenuPolicy);

  // 화이트리스트 모드 체크
  const useWhitelist =
    isPolicyActive &&
    userMenuPolicy.allowedRouteKeys &&
    userMenuPolicy.allowedRouteKeys.length > 0;
  const whitelistSet = useWhitelist
    ? new Set(userMenuPolicy.allowedRouteKeys)
    : null;

  // 블랙리스트
  const blacklistSet = isPolicyActive
    ? new Set(userMenuPolicy.deniedRouteKeys || [])
    : new Set<string>();

  // 재귀적으로 라우트 순회
  function processRoute(route: AppRouteMeta) {
    // routeKey가 있는 경우만 처리
    const routeKey = (route as { routeKey?: string }).routeKey;

    if (routeKey) {
      // 1. 블랙리스트 체크
      if (blacklistSet.has(routeKey)) {
        // 블랙리스트에 있으면 접근 불가
      }
      // 2. 화이트리스트 모드일 때
      else if (whitelistSet) {
        if (whitelistSet.has(routeKey)) {
          // 화이트리스트에 있고, 권한도 만족하면 접근 가능
          const requiredPerms =
            (route as { requiredPermissions?: PermissionKey[] })
              .requiredPermissions || [];
          const hasAllPerms =
            requiredPerms.length === 0 ||
            requiredPerms.every((p) => permissionSet.has(p));
          if (hasAllPerms) {
            accessibleKeys.push(routeKey);
          }
        }
      }
      // 3. 일반 모드 (권한 기반)
      else {
        const requiredPerms =
          (route as { requiredPermissions?: PermissionKey[] })
            .requiredPermissions || [];
        const hasAllPerms =
          requiredPerms.length === 0 ||
          requiredPerms.every((p) => permissionSet.has(p));
        if (hasAllPerms) {
          accessibleKeys.push(routeKey);
        }
      }
    }

    // 자식 라우트 처리
    if (route.children) {
      for (const child of route.children) {
        processRoute(child);
      }
    }
  }

  for (const route of routes) {
    processRoute(route);
  }

  return accessibleKeys;
}

// ========================================
// Menu Tree Filtering
// ========================================

/**
 * 메뉴 트리를 필터링합니다.
 * accessibleRouteKeys에 포함된 페이지만 남기고,
 * 자식이 없는 그룹/카테고리는 제거합니다.
 */
export function filterMenuTree(
  menuTree: MenuNode[],
  accessibleRouteKeys: string[],
  finalPermissions: PermissionKey[]
): MenuNode[] {
  const routeKeySet = new Set(accessibleRouteKeys);
  const permissionSet = new Set(finalPermissions);

  function filterNode(node: MenuNode): MenuNode | null {
    // 숨김 처리된 노드 제외
    if (node.hidden) {
      return null;
    }

    // 노드 자체의 requiredPermissions 체크
    if (node.requiredPermissions && node.requiredPermissions.length > 0) {
      const hasAllPerms = node.requiredPermissions.every((p) =>
        permissionSet.has(p)
      );
      if (!hasAllPerms) {
        return null;
      }
    }

    // Page 노드: routeKey가 accessibleRouteKeys에 있어야 함
    if (isPageNode(node)) {
      if (!routeKeySet.has(node.routeKey)) {
        return null;
      }
      return { ...node };
    }

    // Menu 노드: routeKey가 있으면 체크, 자식이 있으면 필터링
    if (isMenuGroupNode(node)) {
      // Menu 자체의 routeKey 체크
      if (node.routeKey && !routeKeySet.has(node.routeKey)) {
        // routeKey가 접근 불가해도 자식이 있으면 유지할 수 있음
      }

      if (node.children && node.children.length > 0) {
        const filteredChildren = node.children
          .map(filterNode)
          .filter((child): child is MenuNode => child !== null);

        // 자식이 하나도 없으면 이 노드도 제거
        if (filteredChildren.length === 0) {
          // 단, 자체 routeKey가 있고 접근 가능하면 유지
          if (node.routeKey && routeKeySet.has(node.routeKey)) {
            return { ...node, children: undefined };
          }
          return null;
        }

        return { ...node, children: filteredChildren } as MenuGroupNode;
      }

      // 자식이 없는 Menu 노드: routeKey가 접근 가능해야 함
      if (!node.routeKey || !routeKeySet.has(node.routeKey)) {
        return null;
      }
      return { ...node };
    }

    // Category 노드: 자식 필터링 후 자식이 없으면 제거
    if (isCategoryNode(node)) {
      const filteredChildren = node.children
        .map(filterNode)
        .filter((child): child is MenuNode => child !== null);

      if (filteredChildren.length === 0) {
        return null;
      }

      return { ...node, children: filteredChildren } as CategoryMenuNode;
    }

    // External 노드: 권한만 체크하고 유지
    return { ...node };
  }

  return menuTree
    .map(filterNode)
    .filter((node): node is MenuNode => node !== null);
}

// ========================================
// Main Function
// ========================================

/**
 * Role/Grade 기반 권한 + User Menu Policy를 통합하여
 * AccessContext를 생성합니다.
 *
 * @example
 * ```ts
 * const context = buildAccessContext({
 *   routes: routeConfig,
 *   menuTree: menuTree,
 *   basePermissions: computePermissions(role, grade),
 *   userMenuPolicy: policy,
 * });
 *
 * // Sidebar에서 사용
 * renderMenu(context.filteredMenuTree);
 *
 * // 라우트 가드에서 사용
 * if (context.accessibleRouteKeys.includes(currentRouteKey)) {
 *   // 접근 허용
 * }
 * ```
 */
export function buildAccessContext(
  args: BuildAccessContextArgs
): AccessContext {
  const { routes, menuTree, basePermissions, userMenuPolicy } = args;

  // 1. 최종 권한 계산
  const finalPermissions = computeFinalPermissions(
    basePermissions,
    userMenuPolicy
  );

  // 2. 접근 가능한 routeKey 계산
  const accessibleRouteKeys = computeAccessibleRouteKeys(
    routes,
    finalPermissions,
    userMenuPolicy
  );

  // 3. 메뉴 트리 필터링
  const filteredMenuTree = filterMenuTree(
    menuTree,
    accessibleRouteKeys,
    finalPermissions
  );

  // 4. 기본 랜딩 페이지 결정
  let defaultLandingRouteKey: string | null = null;

  // 4-1. userMenuPolicy.defaultLandingRouteKey가 있고 접근 가능하면 사용
  if (
    userMenuPolicy?.defaultLandingRouteKey &&
    accessibleRouteKeys.includes(userMenuPolicy.defaultLandingRouteKey)
  ) {
    defaultLandingRouteKey = userMenuPolicy.defaultLandingRouteKey;
  }
  // 4-2. 없으면 첫 번째 접근 가능한 routeKey 사용
  else if (accessibleRouteKeys.length > 0) {
    defaultLandingRouteKey = accessibleRouteKeys[0];
  }

  return {
    finalPermissions,
    accessibleRouteKeys,
    filteredMenuTree,
    defaultLandingRouteKey,
  };
}

// ========================================
// Helper Functions
// ========================================

/**
 * routeKey가 접근 가능한지 확인합니다.
 */
export function isRouteKeyAccessible(
  routeKey: string,
  accessibleRouteKeys: string[]
): boolean {
  return accessibleRouteKeys.includes(routeKey);
}

/**
 * routeKey로 path를 찾습니다.
 */
export function getPathByRouteKey(
  routes: AppRouteMeta[],
  routeKey: string
): string | null {
  function findPath(routeList: AppRouteMeta[]): string | null {
    for (const route of routeList) {
      const rKey = (route as { routeKey?: string }).routeKey;
      if (rKey === routeKey) {
        return route.path;
      }
      if (route.children) {
        const childPath = findPath(route.children);
        if (childPath) return childPath;
      }
    }
    return null;
  }

  return findPath(routes);
}

/**
 * path로 routeKey를 찾습니다.
 */
export function getRouteKeyByPath(
  routes: AppRouteMeta[],
  path: string
): string | null {
  function findRouteKey(routeList: AppRouteMeta[]): string | null {
    for (const route of routeList) {
      if (route.path === path) {
        return (route as { routeKey?: string }).routeKey || null;
      }
      if (route.children) {
        const childKey = findRouteKey(route.children);
        if (childKey) return childKey;
      }
    }
    return null;
  }

  return findRouteKey(routes);
}

/**
 * filteredMenuTree에서 첫 번째 접근 가능한 페이지의 routeKey를 찾습니다.
 */
export function findFirstAccessibleRouteKey(
  menuTree: MenuNode[]
): string | null {
  for (const node of menuTree) {
    if (isPageNode(node)) {
      return node.routeKey;
    }
    if (isMenuGroupNode(node)) {
      if (node.routeKey) {
        return node.routeKey;
      }
      if (node.children) {
        const childKey = findFirstAccessibleRouteKey(node.children);
        if (childKey) return childKey;
      }
    }
    if (isCategoryNode(node)) {
      const childKey = findFirstAccessibleRouteKey(node.children);
      if (childKey) return childKey;
    }
  }
  return null;
}

/**
 * AccessContext를 기반으로 사용자가 어느 페이지로 리다이렉트되어야 하는지 결정합니다.
 */
export function determineLandingPath(
  context: AccessContext,
  routes: AppRouteMeta[],
  fallbackPath: string = "/forbidden"
): string {
  if (context.defaultLandingRouteKey) {
    const path = getPathByRouteKey(routes, context.defaultLandingRouteKey);
    if (path) return path;
  }

  // filteredMenuTree에서 첫 번째 접근 가능한 페이지 찾기
  const firstRouteKey = findFirstAccessibleRouteKey(context.filteredMenuTree);
  if (firstRouteKey) {
    const path = getPathByRouteKey(routes, firstRouteKey);
    if (path) return path;
  }

  // 접근 가능한 페이지가 없으면 fallback
  return fallbackPath;
}
