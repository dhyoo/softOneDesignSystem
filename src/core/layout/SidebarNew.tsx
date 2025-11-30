/**
 * SoftOne Design System(SDS) - Sidebar Component (Menu Tree Based)
 * 작성: SoftOne Frontend Team
 *
 * 이 파일에서는 Role/Grade 기반 PermissionKey를 사용하여
 * 메뉴/페이지/버튼/액션의 표시/비활성화/숨김을 제어합니다.
 *
 * MenuNode.routeKey와 AppRoute.routeKey를 통해
 * 메뉴와 실제 화면을 느슨하게 결합합니다.
 *
 * 기능:
 *   - menuTree 기반 4 Depth 메뉴 렌더링
 *   - 권한 기반 메뉴 필터링
 *   - Collapsible 메뉴 그룹
 *   - 현재 경로 하이라이팅
 */

import React, { useState, useMemo, useCallback } from "react";
import { ChevronDown, ChevronRight, LogOut, ExternalLink } from "lucide-react";
import { cn } from "../utils/classUtils";
import { useNavigation } from "../router/NavigationContext";
import { SDSLink } from "../components/navigation/SDSLink";
import { Badge } from "../components/ui/Badge";
import { useUIStore } from "../store/uiStore";
import { useAuth } from "../hooks/useAuth";
import { usePermission } from "../hooks/usePermission";
import { menuTree, getPathByRouteKey } from "../router/menuConfig";
import type {
  MenuNode,
  CategoryMenuNode,
  MenuGroupNode,
  PageMenuNode,
  ExternalMenuNode,
} from "../router/menu.types";
import {
  isCategoryNode,
  isMenuGroupNode,
  isPageNode,
  isExternalNode,
  hasChildren,
} from "../router/menu.types";

// ========================================
// Types
// ========================================

export interface SidebarProps {
  className?: string;
}

// ========================================
// Permission Filter Hook
// ========================================

/**
 * 권한 기반으로 메뉴 노드를 필터링합니다.
 */
function useFilteredMenuTree(nodes: MenuNode[]): MenuNode[] {
  const { hasAllPermissions } = usePermission();

  const filterNodes = useCallback(
    (menuNodes: MenuNode[]): MenuNode[] => {
      return menuNodes
        .filter((node) => {
          // hidden 체크
          if (node.hidden) return false;

          // 권한 체크
          if (node.requiredPermissions && node.requiredPermissions.length > 0) {
            if (!hasAllPermissions(node.requiredPermissions)) {
              return false;
            }
          }

          return true;
        })
        .map((node) => {
          // 자식이 있는 노드는 자식도 필터링
          if (hasChildren(node)) {
            const filteredChildren = filterNodes(node.children!);
            // 자식이 모두 필터링되면 부모도 숨김
            if (filteredChildren.length === 0) {
              return null;
            }
            return {
              ...node,
              children: filteredChildren,
            } as MenuNode;
          }
          return node;
        })
        .filter((node): node is MenuNode => node !== null);
    },
    [hasAllPermissions]
  );

  return useMemo(() => filterNodes(nodes), [nodes, filterNodes]);
}

// ========================================
// Menu Node Components
// ========================================

interface MenuNodeProps {
  node: MenuNode;
  depth: number;
  isCollapsed: boolean;
  currentPath: string;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}

/**
 * 카테고리 노드 렌더링 (섹션 헤더)
 */
const CategoryNode: React.FC<{
  node: CategoryMenuNode;
  depth: number;
  isCollapsed: boolean;
  currentPath: string;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}> = ({
  node,
  depth,
  isCollapsed,
  currentPath,
  expandedIds,
  onToggleExpand,
}) => {
  const Icon = node.icon;

  return (
    <div className="mb-4">
      {/* 섹션 헤더 */}
      {!isCollapsed && (
        <div className="flex items-center gap-2 px-3 mb-2">
          {Icon && <Icon className="w-4 h-4 text-softone-sidebar-text/60" />}
          <span className="text-xs font-semibold uppercase tracking-wider text-softone-sidebar-text/60">
            {node.label}
          </span>
          {node.badge && (
            <Badge
              variant={node.badgeColor ?? "primary"}
              size="sm"
              className="ml-auto"
            >
              {node.badge}
            </Badge>
          )}
        </div>
      )}

      {/* 자식 메뉴 */}
      <nav className="space-y-1">
        {node.children.map((child) => (
          <MenuNodeRenderer
            key={child.id}
            node={child}
            depth={depth + 1}
            isCollapsed={isCollapsed}
            currentPath={currentPath}
            expandedIds={expandedIds}
            onToggleExpand={onToggleExpand}
          />
        ))}
      </nav>
    </div>
  );
};

/**
 * 메뉴 그룹 노드 렌더링 (Collapsible)
 */
const MenuGroupNodeComponent: React.FC<{
  node: MenuGroupNode;
  depth: number;
  isCollapsed: boolean;
  currentPath: string;
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
}> = ({
  node,
  depth,
  isCollapsed,
  currentPath,
  expandedIds,
  onToggleExpand,
}) => {
  const Icon = node.icon;
  const isExpanded = expandedIds.has(node.id);
  const hasChildNodes = node.children && node.children.length > 0;

  // routeKey가 있으면 해당 경로 가져오기
  const path = node.routeKey ? getPathByRouteKey(node.routeKey) : null;
  const isActive = path ? currentPath === path : false;

  // 자식 중 하나라도 활성화되어 있는지 확인
  const hasActiveChild = useMemo(() => {
    if (!hasChildNodes) return false;

    const checkActive = (nodes: MenuNode[]): boolean => {
      for (const n of nodes) {
        if (isPageNode(n)) {
          const childPath = getPathByRouteKey(n.routeKey);
          if (childPath && currentPath.startsWith(childPath)) return true;
        }
        if (hasChildren(n) && checkActive(n.children!)) return true;
      }
      return false;
    };

    return checkActive(node.children!);
  }, [hasChildNodes, node.children, currentPath]);

  const handleClick = () => {
    if (hasChildNodes) {
      onToggleExpand(node.id);
    }
  };

  const itemStyles = cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full",
    "text-sm font-medium cursor-pointer",
    isActive
      ? "bg-softone-sidebar-active text-white"
      : hasActiveChild
      ? "text-white"
      : "text-softone-sidebar-text hover:bg-softone-sidebar-hover hover:text-white",
    depth > 1 && `ml-${Math.min(depth * 3, 9)}`,
    isCollapsed && "justify-center px-2"
  );

  return (
    <div>
      <button onClick={handleClick} className={itemStyles}>
        {Icon && (
          <Icon
            className={cn(
              "w-5 h-5 shrink-0",
              isActive ? "text-white" : "text-softone-sidebar-text"
            )}
          />
        )}
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate text-left">{node.label}</span>
            {node.badge && (
              <Badge
                variant={node.badgeColor ?? "primary"}
                size="sm"
                className="ml-2"
              >
                {node.badge}
              </Badge>
            )}
            {hasChildNodes && (
              <span className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </span>
            )}
          </>
        )}
      </button>

      {/* 자식 메뉴 */}
      {hasChildNodes && isExpanded && !isCollapsed && (
        <div className="mt-1 space-y-1 ml-4">
          {node.children!.map((child) => (
            <MenuNodeRenderer
              key={child.id}
              node={child}
              depth={depth + 1}
              isCollapsed={isCollapsed}
              currentPath={currentPath}
              expandedIds={expandedIds}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 페이지 노드 렌더링 (NavLink)
 */
const PageNodeComponent: React.FC<{
  node: PageMenuNode;
  depth: number;
  isCollapsed: boolean;
  currentPath: string;
}> = ({ node, depth, isCollapsed, currentPath }) => {
  const Icon = node.icon;
  const path = getPathByRouteKey(node.routeKey);
  const isActive = path ? currentPath === path : false;

  if (!path) {
    console.warn(`No path found for routeKey: ${node.routeKey}`);
    return null;
  }

  const itemStyles = cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
    "text-sm font-medium",
    isActive
      ? "bg-softone-sidebar-active text-white"
      : "text-softone-sidebar-text hover:bg-softone-sidebar-hover hover:text-white",
    depth > 1 && `ml-${Math.min((depth - 1) * 2, 6)}`,
    isCollapsed && "justify-center px-2"
  );

  return (
    <SDSLink href={path} className={itemStyles}>
      {Icon ? (
        <Icon
          className={cn(
            "w-5 h-5 shrink-0",
            isActive ? "text-white" : "text-softone-sidebar-text"
          )}
        />
      ) : (
        depth > 1 && (
          <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
        )
      )}
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{node.label}</span>
          {node.badge && (
            <Badge
              variant={node.badgeColor ?? "primary"}
              size="sm"
              className="ml-2"
            >
              {node.badge}
            </Badge>
          )}
        </>
      )}
    </SDSLink>
  );
};

/**
 * 외부 링크 노드 렌더링
 */
const ExternalNodeComponent: React.FC<{
  node: ExternalMenuNode;
  depth: number;
  isCollapsed: boolean;
}> = ({ node, depth, isCollapsed }) => {
  const Icon = node.icon;

  const itemStyles = cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
    "text-sm font-medium",
    "text-softone-sidebar-text hover:bg-softone-sidebar-hover hover:text-white",
    depth > 1 && `ml-${Math.min((depth - 1) * 2, 6)}`,
    isCollapsed && "justify-center px-2"
  );

  return (
    <a
      href={node.href}
      target={node.target ?? "_blank"}
      rel="noopener noreferrer"
      className={itemStyles}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0 text-softone-sidebar-text" />}
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{node.label}</span>
          <ExternalLink className="w-4 h-4 ml-auto opacity-50" />
        </>
      )}
    </a>
  );
};

/**
 * 메뉴 노드 렌더러 (타입에 따라 분기)
 */
const MenuNodeRenderer: React.FC<MenuNodeProps> = ({
  node,
  depth,
  isCollapsed,
  currentPath,
  expandedIds,
  onToggleExpand,
}) => {
  if (isCategoryNode(node)) {
    return (
      <CategoryNode
        node={node}
        depth={depth}
        isCollapsed={isCollapsed}
        currentPath={currentPath}
        expandedIds={expandedIds}
        onToggleExpand={onToggleExpand}
      />
    );
  }

  if (isMenuGroupNode(node)) {
    return (
      <MenuGroupNodeComponent
        node={node}
        depth={depth}
        isCollapsed={isCollapsed}
        currentPath={currentPath}
        expandedIds={expandedIds}
        onToggleExpand={onToggleExpand}
      />
    );
  }

  if (isPageNode(node)) {
    return (
      <PageNodeComponent
        node={node}
        depth={depth}
        isCollapsed={isCollapsed}
        currentPath={currentPath}
      />
    );
  }

  if (isExternalNode(node)) {
    return (
      <ExternalNodeComponent
        node={node}
        depth={depth}
        isCollapsed={isCollapsed}
      />
    );
  }

  return null;
};

// ========================================
// Sidebar Component
// ========================================

export const SidebarNew: React.FC<SidebarProps> = ({ className }) => {
  const { isSidebarCollapsed } = useUIStore();
  const { user, logout } = useAuth();
  const { role, grade } = usePermission();
  const navigation = useNavigation();
  const currentPath = navigation.getCurrentPath();

  // 권한 기반 필터링된 메뉴
  const filteredMenu = useFilteredMenuTree(menuTree);

  // 확장된 메뉴 ID 상태
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // 초기에 현재 경로에 해당하는 메뉴들을 확장
    const ids = new Set<string>();
    // 기본적으로 첫 번째 depth의 category들은 확장
    filteredMenu.forEach((node) => {
      if (isCategoryNode(node)) {
        // Category의 자식 중 menu가 있으면 확장
        node.children.forEach((child) => {
          if (isMenuGroupNode(child)) {
            ids.add(child.id);
          }
        });
      }
    });
    return ids;
  });

  const handleToggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  // 로그아웃 핸들러
  const handleLogout = useCallback(() => {
    logout();
    setTimeout(() => {
      navigation.replace("/auth/login");
    }, 0);
  }, [logout, navigation]);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-softone-sidebar-bg z-20",
        "transition-all duration-300 flex flex-col",
        "border-r border-slate-700/50",
        isSidebarCollapsed ? "w-16" : "w-sidebar",
        className
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "h-header flex items-center border-b border-slate-700/50",
          isSidebarCollapsed ? "justify-center px-2" : "px-4"
        )}
      >
        {isSidebarCollapsed ? (
          <span className="text-2xl font-bold text-white">S</span>
        ) : (
          <span className="text-xl font-bold text-white">SoftOne Admin</span>
        )}
      </div>

      {/* Menu */}
      <div className="flex-1 overflow-y-auto sidebar-scrollbar py-4 px-2">
        {filteredMenu.map((node) => (
          <MenuNodeRenderer
            key={node.id}
            node={node}
            depth={0}
            isCollapsed={isSidebarCollapsed}
            currentPath={currentPath}
            expandedIds={expandedIds}
            onToggleExpand={handleToggleExpand}
          />
        ))}
      </div>

      {/* User Info & Logout */}
      <div className="border-t border-slate-700/50 p-3">
        {!isSidebarCollapsed && user && (
          <div className="mb-3 px-2">
            <div className="text-sm font-medium text-white truncate">
              {user.name}
            </div>
            <div className="text-xs text-softone-sidebar-text truncate">
              {role || "Guest"} / {grade || "-"}
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors",
            "text-sm font-medium text-softone-sidebar-text",
            "hover:bg-red-600/20 hover:text-red-400",
            isSidebarCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isSidebarCollapsed && <span>로그아웃</span>}
        </button>
      </div>
    </aside>
  );
};

SidebarNew.displayName = "SidebarNew";

export default SidebarNew;
