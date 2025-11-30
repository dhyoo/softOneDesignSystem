/**
 * SoftOne Design System(SDS) - Sidebar Component
 * 작성: SoftOne Frontend Team
 *
 * 이 파일은 사용자 단위(User Menu Policy) 메뉴/기능 접근 권한을 정의/적용하기 위한 구현입니다.
 * Role/Grade 기반 RBAC 위에, 사용자별 예외 정책(허용/차단/기본 진입 페이지)을 오버레이합니다.
 *
 * 메뉴 렌더링 모드:
 *   1. filteredMenuTree 모드 (권장): authStore.filteredMenuTree 사용
 *   2. 정적 routeConfig 모드: routeConfig + 역할 필터링 사용
 *   3. 동적 menuStore 모드: menuStore 사용
 *
 * SDSLink를 사용하여 라우터 중립성을 유지합니다.
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Loader2,
  LayoutDashboard,
  Users,
  Calendar,
  Table,
  FileText,
  Settings,
  HelpCircle,
  Code2,
  Globe,
  Package,
  ExternalLink,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../utils/classUtils";
import { useNavigation } from "../router/NavigationContext";
import { SDSLink } from "../components/navigation/SDSLink";
import {
  routeConfig,
  menuGroups,
  getGroupedMenuRoutes,
  type AppRouteMeta,
} from "../router/routeConfig";
import { Badge } from "../components/ui/Badge";
import { useUIStore } from "../store/uiStore";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore, selectFilteredMenuTree } from "../store/authStore";
import {
  useMenuStore,
  type MenuItem as DynamicMenuItem,
  type MenuGroup as DynamicMenuGroup,
} from "../store/menuStore";
import type {
  MenuNode,
  CategoryMenuNode,
  MenuGroupNode,
} from "../router/menu.types";
import {
  isCategoryNode,
  isMenuGroupNode,
  isPageNode,
  isExternalNode,
  hasChildren,
} from "../router/menu.types";
import { getPathByRouteKey } from "../router/menuAccessUtils";

// ========================================
// Icon Map (string -> Component)
// ========================================

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Calendar,
  Table,
  FileText,
  Settings,
  HelpCircle,
  Code2,
  Globe,
  Package,
};

// ========================================
// Sidebar Types
// ========================================

export type SidebarMenuMode = "filtered" | "static" | "dynamic";

export interface SidebarProps {
  /** 추가 클래스 */
  className?: string;
  /**
   * 메뉴 렌더링 모드
   * - filtered: authStore.filteredMenuTree 사용 (User Menu Policy 반영)
   * - static: 정적 routeConfig 사용
   * - dynamic: menuStore 사용
   */
  menuMode?: SidebarMenuMode;
  /** @deprecated useDynamicMenu 대신 menuMode 사용 */
  useDynamicMenu?: boolean;
}

// ========================================
// Filtered Menu Item Component (MenuNode 기반)
// ========================================

interface FilteredMenuItemProps {
  node: MenuNode;
  isCollapsed: boolean;
  depth?: number;
}

const FilteredMenuItem: React.FC<FilteredMenuItemProps> = ({
  node,
  isCollapsed,
  depth = 0,
}) => {
  const navigation = useNavigation();
  const currentPath = navigation.getCurrentPath();
  const [isExpanded, setIsExpanded] = useState(() => {
    // 현재 경로가 자식에 포함되어 있으면 확장
    if (hasChildren(node)) {
      const nodeWithChildren = node as CategoryMenuNode | MenuGroupNode;
      const checkChildren = (children: MenuNode[]): boolean => {
        for (const child of children) {
          if (isPageNode(child) || isMenuGroupNode(child)) {
            const path = child.routeKey
              ? getPathByRouteKey(routeConfig, child.routeKey)
              : null;
            if (path && currentPath.startsWith(path)) return true;
          }
          if (hasChildren(child)) {
            const childWithChildren = child as CategoryMenuNode | MenuGroupNode;
            if (checkChildren(childWithChildren.children || [])) return true;
          }
        }
        return false;
      };
      return checkChildren(nodeWithChildren.children || []);
    }
    return false;
  });

  // 노드별 path 가져오기
  const nodePath = useMemo(() => {
    if (isPageNode(node)) {
      return getPathByRouteKey(routeConfig, node.routeKey);
    }
    if (isMenuGroupNode(node) && node.routeKey) {
      return getPathByRouteKey(routeConfig, node.routeKey);
    }
    return null;
  }, [node]);

  const isExactActive = nodePath ? currentPath === nodePath : false;
  const Icon = node.icon;

  // 카테고리 노드는 섹션 헤더로 렌더링
  if (isCategoryNode(node)) {
    return (
      <div className="mb-4">
        {!isCollapsed && (
          <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-softone-sidebar-text/60">
            {node.label}
          </div>
        )}
        <nav className="space-y-1">
          {node.children.map((child) => (
            <FilteredMenuItem
              key={child.id}
              node={child}
              isCollapsed={isCollapsed}
              depth={depth + 1}
            />
          ))}
        </nav>
      </div>
    );
  }

  // 외부 링크 노드
  if (isExternalNode(node)) {
    const itemStyles = cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
      "text-sm font-medium text-softone-sidebar-text",
      "hover:bg-softone-sidebar-hover hover:text-white",
      depth > 0 && "ml-8",
      isCollapsed && "justify-center px-2"
    );

    return (
      <a
        href={node.href}
        target={node.target || "_blank"}
        rel="noopener noreferrer"
        className={itemStyles}
      >
        {Icon && <Icon className="w-5 h-5 shrink-0" />}
        {!isCollapsed && (
          <>
            <span className="flex-1 truncate">{node.label}</span>
            <ExternalLink className="w-3 h-3 text-softone-sidebar-text/60" />
          </>
        )}
      </a>
    );
  }

  // 클릭 핸들러
  const handleClick = () => {
    if (hasChildren(node)) {
      setIsExpanded(!isExpanded);
    }
  };

  // 링크 컨텐츠
  const linkContent = (
    <>
      {Icon && (
        <Icon
          className={cn(
            "w-5 h-5 shrink-0",
            isExactActive ? "text-white" : "text-softone-sidebar-text"
          )}
        />
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
          {hasChildren(node) && (
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
    </>
  );

  // 스타일
  const itemStyles = cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
    "text-sm font-medium",
    isExactActive
      ? "bg-softone-sidebar-active text-white"
      : "text-softone-sidebar-text hover:bg-softone-sidebar-hover hover:text-white",
    depth > 0 && "ml-8",
    isCollapsed && "justify-center px-2"
  );

  // 자식이 있는 노드
  if (hasChildren(node) && !isCollapsed) {
    const nodeWithChildren = node as MenuGroupNode | CategoryMenuNode;
    const childNodes = nodeWithChildren.children || [];

    return (
      <div>
        <button onClick={handleClick} className={cn(itemStyles, "w-full")}>
          {linkContent}
        </button>
        {isExpanded && (
          <div className="mt-1 space-y-1 max-h-[60vh] overflow-y-auto sidebar-scrollbar">
            {childNodes.map((child) => (
              <FilteredMenuItem
                key={child.id}
                node={child}
                isCollapsed={isCollapsed}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 리프 노드 (Page 또는 routeKey 없는 Menu)
  if (nodePath) {
    return (
      <SDSLink href={nodePath} className={itemStyles}>
        {linkContent}
      </SDSLink>
    );
  }

  // path가 없는 노드는 렌더링하지 않음
  return null;
};

// ========================================
// Dynamic MenuItem Component
// ========================================

interface DynamicMenuItemProps {
  item: DynamicMenuItem;
  isCollapsed: boolean;
  depth?: number;
}

const DynamicMenuItemComponent: React.FC<DynamicMenuItemProps> = ({
  item,
  isCollapsed,
  depth = 0,
}) => {
  const navigation = useNavigation();
  const currentPath = navigation.getCurrentPath();
  const { expandedMenuIds, toggleMenu } = useMenuStore();

  const hasItemChildren = item.children && item.children.length > 0;
  const isExpanded = expandedMenuIds.has(item.id);
  const Icon = item.icon ? iconMap[item.icon] : null;

  const isExactActive = currentPath === item.path;

  const handleClick = () => {
    if (hasItemChildren) {
      toggleMenu(item.id);
    }
  };

  const linkContent = (
    <>
      {Icon && (
        <Icon
          className={cn(
            "w-5 h-5 shrink-0",
            isExactActive ? "text-white" : "text-softone-sidebar-text"
          )}
        />
      )}
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <Badge
              variant={item.badgeColor ?? "primary"}
              size="sm"
              className="ml-2"
            >
              {item.badge}
            </Badge>
          )}
          {hasItemChildren && (
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
    </>
  );

  const itemStyles = cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
    "text-sm font-medium",
    isExactActive
      ? "bg-softone-sidebar-active text-white"
      : "text-softone-sidebar-text hover:bg-softone-sidebar-hover hover:text-white",
    depth > 0 && "ml-8",
    isCollapsed && "justify-center px-2"
  );

  if (hasItemChildren && !isCollapsed) {
    return (
      <div>
        <button onClick={handleClick} className={cn(itemStyles, "w-full")}>
          {linkContent}
        </button>
        {isExpanded && (
          <div className="mt-1 space-y-1 max-h-[60vh] overflow-y-auto sidebar-scrollbar">
            {item.children
              ?.filter((child) => !child.hideInMenu)
              .map((child) => (
                <DynamicMenuItemComponent
                  key={child.id}
                  item={child}
                  isCollapsed={isCollapsed}
                  depth={depth + 1}
                />
              ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <SDSLink href={item.path} className={itemStyles}>
      {linkContent}
    </SDSLink>
  );
};

// ========================================
// Dynamic MenuGroup Component
// ========================================

interface DynamicMenuGroupProps {
  group: DynamicMenuGroup;
  items: DynamicMenuItem[];
  isCollapsed: boolean;
}

const DynamicMenuGroupComponent: React.FC<DynamicMenuGroupProps> = ({
  group,
  items,
  isCollapsed,
}) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-6">
      {group.label && !isCollapsed && (
        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-softone-sidebar-text/60">
          {group.label}
        </div>
      )}
      <nav className="space-y-1">
        {items.map((item) => (
          <DynamicMenuItemComponent
            key={item.id}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </div>
  );
};

// ========================================
// Static MenuItem Component (Legacy)
// ========================================

interface StaticMenuItemProps {
  item: AppRouteMeta;
  isCollapsed: boolean;
  depth?: number;
}

const StaticMenuItem: React.FC<StaticMenuItemProps> = ({
  item,
  isCollapsed,
  depth = 0,
}) => {
  const navigation = useNavigation();
  const currentPath = navigation.getCurrentPath();
  const [isExpanded, setIsExpanded] = useState(() => {
    if (item.children) {
      return item.children.some(
        (child) =>
          currentPath.startsWith(child.path) ||
          child.path.startsWith(currentPath.split("/").slice(0, 3).join("/"))
      );
    }
    return false;
  });

  const hasItemChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  const isExactActive = currentPath === item.path;

  const handleClick = () => {
    if (hasItemChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const linkContent = (
    <>
      {Icon && (
        <Icon
          className={cn(
            "w-5 h-5 shrink-0",
            isExactActive ? "text-white" : "text-softone-sidebar-text"
          )}
        />
      )}
      {!isCollapsed && (
        <>
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && (
            <Badge
              variant={item.badgeColor ?? "primary"}
              size="sm"
              className="ml-2"
            >
              {item.badge}
            </Badge>
          )}
          {hasItemChildren && (
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
    </>
  );

  const itemStyles = cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
    "text-sm font-medium",
    isExactActive
      ? "bg-softone-sidebar-active text-white"
      : "text-softone-sidebar-text hover:bg-softone-sidebar-hover hover:text-white",
    depth > 0 && "ml-8",
    isCollapsed && "justify-center px-2"
  );

  if (hasItemChildren && !isCollapsed) {
    return (
      <div>
        <button onClick={handleClick} className={cn(itemStyles, "w-full")}>
          {linkContent}
        </button>
        {isExpanded && (
          <div className="mt-1 space-y-1 max-h-[60vh] overflow-y-auto sidebar-scrollbar">
            {item.children
              ?.filter((child) => !child.hideInMenu)
              .map((child) => (
                <StaticMenuItem
                  key={child.key}
                  item={child}
                  isCollapsed={isCollapsed}
                  depth={depth + 1}
                />
              ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <SDSLink href={item.path} className={itemStyles}>
      {linkContent}
    </SDSLink>
  );
};

// ========================================
// Static MenuGroup Component (Legacy)
// ========================================

interface StaticMenuGroupProps {
  groupKey: string;
  items: AppRouteMeta[];
  isCollapsed: boolean;
}

const StaticMenuGroup: React.FC<StaticMenuGroupProps> = ({
  groupKey,
  items,
  isCollapsed,
}) => {
  const group = menuGroups[groupKey as keyof typeof menuGroups];
  const label = group?.label;

  return (
    <div className="mb-6">
      {label && !isCollapsed && (
        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-softone-sidebar-text/60">
          {label}
        </div>
      )}
      <nav className="space-y-1">
        {items.map((item) => (
          <StaticMenuItem
            key={item.key}
            item={item}
            isCollapsed={isCollapsed}
          />
        ))}
      </nav>
    </div>
  );
};

// ========================================
// Sidebar Component
// ========================================

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  menuMode = "static",
  useDynamicMenu = false,
}) => {
  const { isSidebarCollapsed } = useUIStore();
  const { user, roles, logout } = useAuth();
  const navigation = useNavigation();

  // 실제 메뉴 모드 결정 (useDynamicMenu 레거시 지원)
  const effectiveMode: SidebarMenuMode = useDynamicMenu ? "dynamic" : menuMode;

  // authStore에서 filteredMenuTree 가져오기
  const filteredMenuTree = useAuthStore(selectFilteredMenuTree);

  // 동적 메뉴 Store
  const {
    filteredMenus,
    menuGroups: dynamicMenuGroups,
    isLoading,
    isLoaded,
    loadMenus,
    filterMenusByRole,
  } = useMenuStore();

  // 동적 메뉴 로드 (dynamic 모드일 때만)
  useEffect(() => {
    if (effectiveMode === "dynamic" && !isLoaded) {
      loadMenus();
    }
  }, [effectiveMode, isLoaded, loadMenus]);

  // 역할 변경 시 필터링 (dynamic 모드일 때만)
  useEffect(() => {
    if (effectiveMode === "dynamic" && isLoaded) {
      filterMenusByRole(roles);
    }
  }, [effectiveMode, isLoaded, roles, filterMenusByRole]);

  // 정적 메뉴: 역할 기반 필터링 & 그룹화
  const staticGroupedRoutes = useMemo(() => {
    return getGroupedMenuRoutes(routeConfig, roles);
  }, [roles]);

  // 정적 그룹 순서대로 정렬
  const sortedStaticGroups = useMemo(() => {
    return Object.entries(staticGroupedRoutes).sort(([a], [b]) => {
      const orderA = menuGroups[a as keyof typeof menuGroups]?.order ?? 50;
      const orderB = menuGroups[b as keyof typeof menuGroups]?.order ?? 50;
      return orderA - orderB;
    });
  }, [staticGroupedRoutes]);

  // 동적 메뉴: 그룹별 분류
  const groupedDynamicMenus = useMemo(() => {
    const grouped: Record<string, DynamicMenuItem[]> = {};

    filteredMenus.forEach((menu) => {
      const groupId = menu.group || "main";
      if (!grouped[groupId]) {
        grouped[groupId] = [];
      }
      grouped[groupId].push(menu);
    });

    // 그룹 내에서 order로 정렬
    Object.keys(grouped).forEach((groupId) => {
      grouped[groupId].sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [filteredMenus]);

  // 동적 그룹 순서대로 정렬
  const sortedDynamicGroups = useMemo(() => {
    return dynamicMenuGroups
      .slice()
      .sort((a, b) => a.order - b.order)
      .filter((group) => groupedDynamicMenus[group.id]?.length > 0);
  }, [dynamicMenuGroups, groupedDynamicMenus]);

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout();
    // 상태 업데이트 후 리다이렉트
    setTimeout(() => {
      navigation.replace("/auth/login");
    }, 0);
  };

  // 메뉴 렌더링
  const renderMenu = () => {
    switch (effectiveMode) {
      case "filtered":
        // filteredMenuTree 기반 렌더링 (User Menu Policy 반영)
        if (filteredMenuTree.length === 0) {
          return (
            <div className="px-3 py-8 text-center text-softone-sidebar-text/60">
              <p className="text-sm">접근 가능한 메뉴가 없습니다.</p>
            </div>
          );
        }
        return (
          <nav className="space-y-1">
            {filteredMenuTree.map((node) => (
              <FilteredMenuItem
                key={node.id}
                node={node}
                isCollapsed={isSidebarCollapsed}
              />
            ))}
          </nav>
        );

      case "dynamic":
        // 동적 메뉴 Store 기반 렌더링
        if (isLoading) {
          return (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-softone-sidebar-text animate-spin" />
            </div>
          );
        }
        return sortedDynamicGroups.map((group) => (
          <DynamicMenuGroupComponent
            key={group.id}
            group={group}
            items={groupedDynamicMenus[group.id] || []}
            isCollapsed={isSidebarCollapsed}
          />
        ));

      case "static":
      default:
        // 정적 routeConfig 기반 렌더링
        return sortedStaticGroups.map(([groupKey, items]) => (
          <StaticMenuGroup
            key={groupKey}
            groupKey={groupKey}
            items={items}
            isCollapsed={isSidebarCollapsed}
          />
        ));
    }
  };

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
        {renderMenu()}
      </div>

      {/* User Info & Logout */}
      <div className="border-t border-slate-700/50 p-3">
        {!isSidebarCollapsed && user && (
          <div className="mb-3 px-2">
            <div className="text-sm font-medium text-white truncate">
              {user.name}
            </div>
            <div className="text-xs text-softone-sidebar-text truncate">
              {user.roles.join(", ")}
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

Sidebar.displayName = "Sidebar";

export default Sidebar;
