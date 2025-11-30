/**
 * SoftOne Design System - Menu Types
 * 작성: SoftOne Frontend Team
 *
 * 계층형 메뉴 트리 타입 정의 (최대 4 Depth 지원)
 *
 * MenuNode는 메뉴 트리를 표현하고,
 * 실제 라우트는 AppRoute.routeKey와 느슨하게 연결됩니다.
 *
 * Depth 구조:
 *   - Depth 1: Category (섹션 그룹)
 *   - Depth 2: Menu (클릭 가능한 메뉴 그룹)
 *   - Depth 3: Page/Menu (실제 화면 또는 하위 메뉴)
 *   - Depth 4: Page (최하위 화면)
 */

import type { LucideIcon } from "lucide-react";
import type { PermissionKey } from "../auth/role.types";

// ========================================
// Menu Node Types
// ========================================

/**
 * 메뉴 노드 타입
 *   - category: 클릭 불가 상위 그룹 (섹션 헤더)
 *   - menu: 클릭 가능 메뉴 (하위 메뉴 그룹일 수 있음)
 *   - page: 실제 화면에 매핑되는 메뉴
 *   - external: 외부 링크
 */
export type MenuNodeType = "category" | "menu" | "page" | "external";

// ========================================
// Base Menu Node
// ========================================

/**
 * 모든 메뉴 노드의 공통 속성
 */
export interface BaseMenuNode {
  /** 고유 식별자 */
  id: string;
  /** 메뉴 노드 타입 */
  type: MenuNodeType;
  /** 메뉴 라벨 */
  label: string;
  /** 아이콘 (lucide-react) */
  icon?: LucideIcon;
  /** 정렬 순서 */
  order?: number;
  /** 필요한 권한 목록 */
  requiredPermissions?: PermissionKey[];
  /** 숨김 여부 */
  hidden?: boolean;
  /** 배지 텍스트 */
  badge?: string;
  /** 배지 색상 */
  badgeColor?: "primary" | "success" | "warning" | "danger" | "info";
}

// ========================================
// Category Menu Node (Depth 1)
// ========================================

/**
 * 카테고리 노드 (섹션 그룹)
 * - 클릭 불가, 섹션 헤더로 렌더링
 * - 반드시 children을 가짐
 */
export interface CategoryMenuNode extends BaseMenuNode {
  type: "category";
  /** 하위 메뉴 노드 */
  children: MenuNode[];
}

// ========================================
// Menu Group Node (Depth 2-3)
// ========================================

/**
 * 메뉴 그룹 노드
 * - children이 있으면 Collapsible/Accordion 구조로 토글
 * - routeKey가 있으면 메뉴 자체도 클릭 시 해당 route로 이동 가능
 */
export interface MenuGroupNode extends BaseMenuNode {
  type: "menu";
  /** 하위 메뉴 노드 (선택적) */
  children?: MenuNode[];
  /** 메뉴 자체도 화면에 매핑할 때 사용하는 routeKey */
  routeKey?: string;
}

// ========================================
// Page Menu Node (Depth 2-4)
// ========================================

/**
 * 페이지 노드 (실제 화면에 매핑)
 * - routeKey로 AppRoute와 연결
 */
export interface PageMenuNode extends BaseMenuNode {
  type: "page";
  /** AppRoute.routeKey와 매핑 (필수) */
  routeKey: string;
}

// ========================================
// External Menu Node
// ========================================

/**
 * 외부 링크 노드
 * - a 태그로 렌더링
 */
export interface ExternalMenuNode extends BaseMenuNode {
  type: "external";
  /** 외부 링크 URL */
  href: string;
  /** 링크 타겟 */
  target?: "_blank" | "_self";
}

// ========================================
// Union Type
// ========================================

/**
 * 메뉴 노드 유니온 타입
 */
export type MenuNode =
  | CategoryMenuNode
  | MenuGroupNode
  | PageMenuNode
  | ExternalMenuNode;

// ========================================
// Type Guards
// ========================================

/**
 * CategoryMenuNode 타입 가드
 */
export function isCategoryNode(node: MenuNode): node is CategoryMenuNode {
  return node.type === "category";
}

/**
 * MenuGroupNode 타입 가드
 */
export function isMenuGroupNode(node: MenuNode): node is MenuGroupNode {
  return node.type === "menu";
}

/**
 * PageMenuNode 타입 가드
 */
export function isPageNode(node: MenuNode): node is PageMenuNode {
  return node.type === "page";
}

/**
 * ExternalMenuNode 타입 가드
 */
export function isExternalNode(node: MenuNode): node is ExternalMenuNode {
  return node.type === "external";
}

/**
 * 자식이 있는 노드인지 확인
 */
export function hasChildren(
  node: MenuNode
): node is CategoryMenuNode | MenuGroupNode {
  return (
    (node.type === "category" || node.type === "menu") &&
    Array.isArray((node as CategoryMenuNode | MenuGroupNode).children) &&
    (node as CategoryMenuNode | MenuGroupNode).children!.length > 0
  );
}

// ========================================
// Helper Functions
// ========================================

/**
 * 메뉴 트리에서 routeKey로 노드를 찾습니다.
 */
export function findMenuNodeByRouteKey(
  nodes: MenuNode[],
  routeKey: string
): MenuNode | null {
  for (const node of nodes) {
    // Page 노드 확인
    if (isPageNode(node) && node.routeKey === routeKey) {
      return node;
    }

    // Menu 노드의 routeKey 확인
    if (isMenuGroupNode(node) && node.routeKey === routeKey) {
      return node;
    }

    // 자식 노드 탐색
    if (hasChildren(node)) {
      const found = findMenuNodeByRouteKey(node.children!, routeKey);
      if (found) return found;
    }
  }

  return null;
}

/**
 * 메뉴 트리에서 routeKey까지의 경로를 찾습니다.
 * @returns 루트부터 해당 노드까지의 경로 배열
 */
export function findMenuPathByRouteKey(
  nodes: MenuNode[],
  routeKey: string,
  currentPath: MenuNode[] = []
): MenuNode[] | null {
  for (const node of nodes) {
    const path = [...currentPath, node];

    // Page 노드에서 routeKey 일치
    if (isPageNode(node) && node.routeKey === routeKey) {
      return path;
    }

    // Menu 노드의 routeKey 일치
    if (isMenuGroupNode(node) && node.routeKey === routeKey) {
      return path;
    }

    // 자식 노드 탐색
    if (hasChildren(node)) {
      const found = findMenuPathByRouteKey(node.children!, routeKey, path);
      if (found) return found;
    }
  }

  return null;
}

/**
 * 메뉴 노드의 깊이(Depth)를 계산합니다.
 */
export function getMenuNodeDepth(
  nodes: MenuNode[],
  targetId: string,
  currentDepth: number = 1
): number {
  for (const node of nodes) {
    if (node.id === targetId) {
      return currentDepth;
    }

    if (hasChildren(node)) {
      const depth = getMenuNodeDepth(
        node.children!,
        targetId,
        currentDepth + 1
      );
      if (depth > 0) return depth;
    }
  }

  return 0;
}

/**
 * 메뉴 트리의 최대 깊이를 계산합니다.
 */
export function getMaxMenuDepth(
  nodes: MenuNode[],
  currentDepth: number = 1
): number {
  let maxDepth = currentDepth;

  for (const node of nodes) {
    if (hasChildren(node)) {
      const childDepth = getMaxMenuDepth(node.children!, currentDepth + 1);
      maxDepth = Math.max(maxDepth, childDepth);
    }
  }

  return maxDepth;
}

/**
 * 메뉴 노드를 order 기준으로 정렬합니다.
 */
export function sortMenuNodes(nodes: MenuNode[]): MenuNode[] {
  return [...nodes]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((node) => {
      if (hasChildren(node)) {
        return {
          ...node,
          children: sortMenuNodes(node.children!),
        } as MenuNode;
      }
      return node;
    });
}
