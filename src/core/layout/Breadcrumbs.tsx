/**
 * SoftOne Design System - Breadcrumbs Component
 * 작성: SoftOne Frontend Team
 *
 * 이 파일은 사용자 단위(User Menu Policy) 메뉴/기능 접근 권한을 정의/적용하기 위한 구현입니다.
 * Role/Grade 기반 RBAC 위에, 사용자별 예외 정책(허용/차단/기본 진입 페이지)을 오버레이합니다.
 *
 * 기능:
 *   - 현재 URL 기반 브레드크럼 생성
 *   - filteredMenuTree에서 경로 탐색 (User Menu Policy 반영)
 *   - accessibleRouteKeys 기반 권한 체크
 *   - 클릭 가능한 경로 링크
 */

import React, { useMemo } from "react";
import { ChevronRight, Home, Lock } from "lucide-react";
import { cn } from "../utils/classUtils";
import { SDSLink } from "../components/navigation/SDSLink";
import { useNavigation } from "../router/NavigationContext";
import {
  useAuthStore,
  selectFilteredMenuTree,
  selectAccessibleRouteKeys,
} from "../store/authStore";
import {
  menuTree as originalMenuTree,
  getPathByRouteKey,
  getRouteKeyByPath,
} from "../router/menuConfig";
import {
  findMenuPathByRouteKey,
  isPageNode,
  isMenuGroupNode,
  type MenuNode,
} from "../router/menu.types";

// ========================================
// Types
// ========================================

export interface BreadcrumbItem {
  label: string;
  path?: string;
  routeKey?: string;
  isCurrentPage?: boolean;
  hasAccess?: boolean;
}

export interface BreadcrumbsProps {
  /** 추가 클래스 */
  className?: string;
  /** 홈 아이콘 표시 여부 */
  showHomeIcon?: boolean;
  /** 구분자 커스터마이즈 */
  separator?: React.ReactNode;
  /** 최대 표시 항목 수 (초과 시 ... 표시) */
  maxItems?: number;
  /**
   * 메뉴 트리 소스
   * - filtered: authStore.filteredMenuTree 사용 (User Menu Policy 반영)
   * - original: 원본 menuTree 사용
   */
  menuSource?: "filtered" | "original";
  /** 접근 권한이 없는 경로도 표시할지 여부 */
  showInaccessible?: boolean;
}

// ========================================
// Helper Functions
// ========================================

/**
 * 현재 경로에서 브레드크럼 항목을 생성합니다.
 */
function generateBreadcrumbs(
  currentPath: string,
  menuTree: MenuNode[],
  accessibleRouteKeys: string[]
): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [];

  // 홈 추가
  const homeRouteKey = "dashboard.main";
  const homeHasAccess = accessibleRouteKeys.includes(homeRouteKey);
  items.push({
    label: "홈",
    path: homeHasAccess ? "/dashboard" : undefined,
    routeKey: homeRouteKey,
    hasAccess: homeHasAccess,
  });

  // 현재 경로에 해당하는 routeKey 찾기
  const routeKey = getRouteKeyByPath(currentPath);

  if (!routeKey) {
    // routeKey를 찾을 수 없으면 경로 기반으로 생성
    const segments = currentPath.split("/").filter(Boolean);
    segments.forEach((segment, index) => {
      const path = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;
      const segmentRouteKey = getRouteKeyByPath(path);

      items.push({
        label: formatSegmentLabel(segment),
        path: isLast ? undefined : path,
        routeKey: segmentRouteKey || undefined,
        isCurrentPage: isLast,
        hasAccess: segmentRouteKey
          ? accessibleRouteKeys.includes(segmentRouteKey)
          : true,
      });
    });

    return items;
  }

  // menuTree에서 경로 찾기
  const menuPath = findMenuPathByRouteKey(menuTree, routeKey);

  if (menuPath) {
    menuPath.forEach((node, index) => {
      const isLast = index === menuPath.length - 1;
      let nodePath: string | undefined;
      let nodeRouteKey: string | undefined;

      // 페이지 노드이면 경로 가져오기
      if (isPageNode(node)) {
        nodeRouteKey = node.routeKey;
        nodePath = getPathByRouteKey(node.routeKey) ?? undefined;
      } else if (isMenuGroupNode(node) && node.routeKey) {
        nodeRouteKey = node.routeKey;
        nodePath = getPathByRouteKey(node.routeKey) ?? undefined;
      }

      const hasAccess = nodeRouteKey
        ? accessibleRouteKeys.includes(nodeRouteKey)
        : true;

      items.push({
        label: node.label,
        path: isLast ? undefined : hasAccess ? nodePath : undefined,
        routeKey: nodeRouteKey,
        isCurrentPage: isLast,
        hasAccess,
      });
    });
  } else {
    // 폴백: 경로 기반 생성
    const segments = currentPath.split("/").filter(Boolean);
    segments.forEach((segment, index) => {
      const path = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;
      const segmentRouteKey = getRouteKeyByPath(path);

      items.push({
        label: formatSegmentLabel(segment),
        path: isLast ? undefined : path,
        routeKey: segmentRouteKey || undefined,
        isCurrentPage: isLast,
        hasAccess: segmentRouteKey
          ? accessibleRouteKeys.includes(segmentRouteKey)
          : true,
      });
    });
  }

  return items;
}

/**
 * URL 세그먼트를 읽기 좋은 라벨로 변환합니다.
 */
function formatSegmentLabel(segment: string): string {
  // 하이픈/언더스코어를 공백으로 변환하고 첫 글자 대문자화
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// ========================================
// Breadcrumbs Component
// ========================================

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  className,
  showHomeIcon = true,
  separator,
  maxItems,
  menuSource = "filtered",
  showInaccessible = false,
}) => {
  const navigation = useNavigation();
  const currentPath = navigation.getCurrentPath();

  // authStore에서 filteredMenuTree와 accessibleRouteKeys 가져오기
  const filteredMenuTree = useAuthStore(selectFilteredMenuTree);
  const accessibleRouteKeys = useAuthStore(selectAccessibleRouteKeys);

  // 사용할 메뉴 트리 결정
  const menuTree =
    menuSource === "filtered" ? filteredMenuTree : originalMenuTree;

  // 브레드크럼 항목 생성
  const items = useMemo(
    () => generateBreadcrumbs(currentPath, menuTree, accessibleRouteKeys),
    [currentPath, menuTree, accessibleRouteKeys]
  );

  // 접근 불가 항목 필터링
  const filteredItems = useMemo(() => {
    if (showInaccessible) {
      return items;
    }
    // 접근 가능한 항목만 표시 (단, 현재 페이지는 항상 표시)
    return items.filter((item) => item.hasAccess || item.isCurrentPage);
  }, [items, showInaccessible]);

  // 항목 수 제한 처리
  const displayItems = useMemo(() => {
    if (!maxItems || filteredItems.length <= maxItems) {
      return filteredItems;
    }

    // 처음, ..., 마지막 몇 개만 표시
    const firstItems = filteredItems.slice(0, 1);
    const lastItems = filteredItems.slice(-(maxItems - 2));

    return [
      ...firstItems,
      { label: "...", path: undefined, hasAccess: true },
      ...lastItems,
    ];
  }, [filteredItems, maxItems]);

  // 기본 구분자
  const defaultSeparator = (
    <ChevronRight className="w-4 h-4 text-softone-text-muted" />
  );

  return (
    <nav
      className={cn("flex items-center text-sm", className)}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-1">
        {displayItems.map((item, index) => {
          const isFirst = index === 0;
          const isLast = index === displayItems.length - 1;

          return (
            <li key={index} className="flex items-center">
              {/* 구분자 */}
              {!isFirst && (
                <span className="mx-2">{separator ?? defaultSeparator}</span>
              )}

              {/* 항목 */}
              {item.path && item.hasAccess ? (
                <SDSLink
                  href={item.path}
                  className={cn(
                    "flex items-center gap-1 hover:text-softone-primary transition-colors",
                    isFirst && showHomeIcon
                      ? "text-softone-text-muted"
                      : "text-softone-text-secondary"
                  )}
                >
                  {isFirst && showHomeIcon && <Home className="w-4 h-4" />}
                  <span>{isFirst && showHomeIcon ? "" : item.label}</span>
                </SDSLink>
              ) : (
                <span
                  className={cn(
                    "flex items-center gap-1",
                    isLast
                      ? "text-softone-text font-medium"
                      : item.hasAccess === false
                      ? "text-softone-text-muted line-through"
                      : "text-softone-text-muted"
                  )}
                  aria-current={item.isCurrentPage ? "page" : undefined}
                >
                  {item.hasAccess === false && showInaccessible && (
                    <Lock className="w-3 h-3 text-softone-text-muted" />
                  )}
                  {isFirst && showHomeIcon && item.hasAccess === false ? (
                    <>
                      <Home className="w-4 h-4" />
                    </>
                  ) : (
                    item.label
                  )}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

Breadcrumbs.displayName = "Breadcrumbs";

export default Breadcrumbs;
