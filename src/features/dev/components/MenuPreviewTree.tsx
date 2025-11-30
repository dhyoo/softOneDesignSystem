/**
 * SoftOne Design System - Menu Preview Tree Component
 * 작성: SoftOne Frontend Team
 *
 * 이 파일은 RBAC 및 4 Depth 메뉴 구조를 시각적으로 설명하기 위한 Playground 용 샘플입니다.
 * 실제 로그인/권한과는 독립적으로 동작하며, 교육/데모/테스트 용도로만 사용됩니다.
 *
 * 이 컴포넌트는 Menu & RBAC 교육용 프리뷰이며,
 * 실제 Sidebar는 src/core/layout/Sidebar.tsx를 사용한다.
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Lock,
  FileText,
  Folder,
} from "lucide-react";
import { cn } from "@core/utils/classUtils";
import { Badge } from "@core/components/ui/Badge";
import type {
  MenuNode,
  CategoryMenuNode,
  MenuGroupNode,
  PageMenuNode,
  ExternalMenuNode,
} from "@core/router/menu.types";
import {
  isCategoryNode,
  isMenuGroupNode,
  isPageNode,
  isExternalNode,
  hasChildren,
} from "@core/router/menu.types";
import { getPathByRouteKey } from "@core/router/menuConfig";
import type { PermissionKey } from "@core/auth/role.types";

// ========================================
// Types
// ========================================

export interface MenuPreviewTreeProps {
  /** 메뉴 트리 데이터 */
  menuTree: MenuNode[];
  /** 현재 선택된 가상 Permission 배열 */
  permissions: PermissionKey[];
  /** 상단 설명 텍스트 */
  title?: string;
  /** 권한 없어서 숨길 노드를 흐리게라도 보여줄지 */
  showHiddenNodes?: boolean;
  /** 선택된 routeKey */
  selectedRouteKey?: string;
  /** routeKey 선택 핸들러 */
  onSelectRouteKey?: (routeKey: string) => void;
}

// ========================================
// Helper Functions
// ========================================

/**
 * 권한을 만족하는지 확인
 */
function hasRequiredPermissions(
  nodePermissions: PermissionKey[] | undefined,
  userPermissions: PermissionKey[]
): boolean {
  if (!nodePermissions || nodePermissions.length === 0) return true;
  return nodePermissions.every((p) => userPermissions.includes(p));
}

/**
 * 자식 중에 권한 있는 노드가 있는지 확인
 */
function hasAnyVisibleChild(
  children: MenuNode[] | undefined,
  userPermissions: PermissionKey[]
): boolean {
  if (!children || children.length === 0) return false;

  return children.some((child) => {
    const hasPermission = hasRequiredPermissions(
      child.requiredPermissions,
      userPermissions
    );
    if (hasPermission) return true;

    // 재귀적으로 자식 확인
    if (hasChildren(child)) {
      return hasAnyVisibleChild(
        (child as CategoryMenuNode | MenuGroupNode).children,
        userPermissions
      );
    }
    return false;
  });
}

// ========================================
// Menu Node Components
// ========================================

interface NodeProps {
  node: MenuNode;
  depth: number;
  permissions: PermissionKey[];
  showHiddenNodes: boolean;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  selectedRouteKey?: string;
  onSelectRouteKey?: (routeKey: string) => void;
}

/**
 * 카테고리 노드 렌더링
 */
const CategoryNodePreview: React.FC<{
  node: CategoryMenuNode;
  depth: number;
  permissions: PermissionKey[];
  showHiddenNodes: boolean;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  selectedRouteKey?: string;
  onSelectRouteKey?: (routeKey: string) => void;
}> = ({
  node,
  depth,
  permissions,
  showHiddenNodes,
  expandedIds,
  onToggle,
  selectedRouteKey,
  onSelectRouteKey,
}) => {
  const hasPermission = hasRequiredPermissions(
    node.requiredPermissions,
    permissions
  );
  const hasVisibleChildren = hasAnyVisibleChild(node.children, permissions);

  // 권한 없고 showHiddenNodes=false면 숨김
  if (!hasPermission && !hasVisibleChildren && !showHiddenNodes) {
    return null;
  }

  const Icon = node.icon;
  const isDisabled = !hasPermission && !hasVisibleChildren;

  return (
    <div className="mb-3">
      {/* 카테고리 헤더 */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider",
          isDisabled
            ? "text-gray-400 opacity-50"
            : "text-slate-600 dark:text-slate-400"
        )}
      >
        {Icon && <Icon className="w-4 h-4" />}
        <span>{node.label}</span>
        {node.badge && (
          <Badge variant={node.badgeColor || "primary"} size="sm">
            {node.badge}
          </Badge>
        )}
        {isDisabled && (
          <Badge variant="neutral" size="sm" className="ml-auto">
            <Lock className="w-3 h-3 mr-1" />
            권한 없음
          </Badge>
        )}
      </div>

      {/* 자식 메뉴 */}
      <div className="space-y-0.5">
        {node.children.map((child) => (
          <MenuNodePreview
            key={child.id}
            node={child}
            depth={depth + 1}
            permissions={permissions}
            showHiddenNodes={showHiddenNodes}
            expandedIds={expandedIds}
            onToggle={onToggle}
            selectedRouteKey={selectedRouteKey}
            onSelectRouteKey={onSelectRouteKey}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * 메뉴 그룹 노드 렌더링
 */
const MenuGroupPreview: React.FC<{
  node: MenuGroupNode;
  depth: number;
  permissions: PermissionKey[];
  showHiddenNodes: boolean;
  expandedIds: Set<string>;
  onToggle: (id: string) => void;
  selectedRouteKey?: string;
  onSelectRouteKey?: (routeKey: string) => void;
}> = ({
  node,
  depth,
  permissions,
  showHiddenNodes,
  expandedIds,
  onToggle,
  selectedRouteKey,
  onSelectRouteKey,
}) => {
  const hasPermission = hasRequiredPermissions(
    node.requiredPermissions,
    permissions
  );
  const hasVisibleChildren = node.children
    ? hasAnyVisibleChild(node.children, permissions)
    : false;

  // 권한 없고 showHiddenNodes=false면 숨김
  if (!hasPermission && !hasVisibleChildren && !showHiddenNodes) {
    return null;
  }

  const Icon = node.icon;
  const isExpanded = expandedIds.has(node.id);
  const hasChildNodes = node.children && node.children.length > 0;
  const isDisabled = !hasPermission && !hasVisibleChildren;
  const isSelected = node.routeKey === selectedRouteKey;

  const paddingLeft = depth * 12;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildNodes) {
            onToggle(node.id);
          }
          if (node.routeKey && onSelectRouteKey) {
            onSelectRouteKey(node.routeKey);
          }
        }}
        className={cn(
          "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors",
          isDisabled
            ? "opacity-40 text-gray-400 cursor-not-allowed"
            : isSelected
            ? "bg-softone-primary text-white"
            : "hover:bg-softone-surface-hover text-softone-text"
        )}
        style={{ paddingLeft: `${paddingLeft}px` }}
        disabled={isDisabled}
      >
        {Icon ? (
          <Icon className="w-4 h-4 shrink-0" />
        ) : (
          <Folder className="w-4 h-4 shrink-0" />
        )}
        <span className="flex-1 text-left truncate">{node.label}</span>
        {node.badge && (
          <Badge variant={node.badgeColor || "primary"} size="sm">
            {node.badge}
          </Badge>
        )}
        {isDisabled && <Lock className="w-3 h-3 text-gray-400" />}
        {hasChildNodes && !isDisabled && (
          <span className="ml-auto">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
        )}
      </button>

      {/* 자식 메뉴 */}
      {hasChildNodes && isExpanded && (
        <div className="mt-0.5 space-y-0.5">
          {node.children!.map((child) => (
            <MenuNodePreview
              key={child.id}
              node={child}
              depth={depth + 1}
              permissions={permissions}
              showHiddenNodes={showHiddenNodes}
              expandedIds={expandedIds}
              onToggle={onToggle}
              selectedRouteKey={selectedRouteKey}
              onSelectRouteKey={onSelectRouteKey}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * 페이지 노드 렌더링
 */
const PageNodePreview: React.FC<{
  node: PageMenuNode;
  depth: number;
  permissions: PermissionKey[];
  showHiddenNodes: boolean;
  selectedRouteKey?: string;
  onSelectRouteKey?: (routeKey: string) => void;
}> = ({
  node,
  depth,
  permissions,
  showHiddenNodes,
  selectedRouteKey,
  onSelectRouteKey,
}) => {
  const hasPermission = hasRequiredPermissions(
    node.requiredPermissions,
    permissions
  );

  if (!hasPermission && !showHiddenNodes) {
    return null;
  }

  const Icon = node.icon;
  const isDisabled = !hasPermission;
  const isSelected = node.routeKey === selectedRouteKey;
  const path = getPathByRouteKey(node.routeKey);
  const paddingLeft = depth * 12;

  return (
    <button
      onClick={() => {
        if (!isDisabled && onSelectRouteKey) {
          onSelectRouteKey(node.routeKey);
        }
      }}
      className={cn(
        "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors",
        isDisabled
          ? "opacity-40 text-gray-400 cursor-not-allowed"
          : isSelected
          ? "bg-softone-primary text-white"
          : "hover:bg-softone-surface-hover text-softone-text"
      )}
      style={{ paddingLeft: `${paddingLeft}px` }}
      disabled={isDisabled}
    >
      {Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : (
        <FileText className="w-4 h-4 shrink-0" />
      )}
      <div className="flex-1 text-left">
        <div className="truncate">{node.label}</div>
        {path && (
          <div
            className={cn(
              "text-xs truncate",
              isDisabled
                ? "text-gray-400"
                : isSelected
                ? "text-white/70"
                : "text-softone-text-muted"
            )}
          >
            {node.routeKey}
          </div>
        )}
      </div>
      {node.badge && (
        <Badge variant={node.badgeColor || "primary"} size="sm">
          {node.badge}
        </Badge>
      )}
      {isDisabled && (
        <Badge variant="danger" size="sm">
          <Lock className="w-3 h-3 mr-1" />
          권한 없음
        </Badge>
      )}
    </button>
  );
};

/**
 * 외부 링크 노드 렌더링
 */
const ExternalNodePreview: React.FC<{
  node: ExternalMenuNode;
  depth: number;
  permissions: PermissionKey[];
  showHiddenNodes: boolean;
}> = ({ node, depth, permissions, showHiddenNodes }) => {
  const hasPermission = hasRequiredPermissions(
    node.requiredPermissions,
    permissions
  );

  if (!hasPermission && !showHiddenNodes) {
    return null;
  }

  const Icon = node.icon;
  const isDisabled = !hasPermission;
  const paddingLeft = depth * 12;

  return (
    <a
      href={isDisabled ? undefined : node.href}
      target={node.target || "_blank"}
      rel="noopener noreferrer"
      className={cn(
        "flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm transition-colors",
        isDisabled
          ? "opacity-40 text-gray-400 cursor-not-allowed pointer-events-none"
          : "hover:bg-softone-surface-hover text-softone-text"
      )}
      style={{ paddingLeft: `${paddingLeft}px` }}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span className="flex-1 truncate">{node.label}</span>
      <ExternalLink className="w-4 h-4 opacity-50" />
      {isDisabled && (
        <Badge variant="danger" size="sm">
          <Lock className="w-3 h-3 mr-1" />
          권한 없음
        </Badge>
      )}
    </a>
  );
};

/**
 * 메뉴 노드 렌더러 (타입별 분기)
 */
const MenuNodePreview: React.FC<NodeProps> = ({
  node,
  depth,
  permissions,
  showHiddenNodes,
  expandedIds,
  onToggle,
  selectedRouteKey,
  onSelectRouteKey,
}) => {
  if (isCategoryNode(node)) {
    return (
      <CategoryNodePreview
        node={node}
        depth={depth}
        permissions={permissions}
        showHiddenNodes={showHiddenNodes}
        expandedIds={expandedIds}
        onToggle={onToggle}
        selectedRouteKey={selectedRouteKey}
        onSelectRouteKey={onSelectRouteKey}
      />
    );
  }

  if (isMenuGroupNode(node)) {
    return (
      <MenuGroupPreview
        node={node}
        depth={depth}
        permissions={permissions}
        showHiddenNodes={showHiddenNodes}
        expandedIds={expandedIds}
        onToggle={onToggle}
        selectedRouteKey={selectedRouteKey}
        onSelectRouteKey={onSelectRouteKey}
      />
    );
  }

  if (isPageNode(node)) {
    return (
      <PageNodePreview
        node={node}
        depth={depth}
        permissions={permissions}
        showHiddenNodes={showHiddenNodes}
        selectedRouteKey={selectedRouteKey}
        onSelectRouteKey={onSelectRouteKey}
      />
    );
  }

  if (isExternalNode(node)) {
    return (
      <ExternalNodePreview
        node={node}
        depth={depth}
        permissions={permissions}
        showHiddenNodes={showHiddenNodes}
      />
    );
  }

  return null;
};

// ========================================
// MenuPreviewTree Component
// ========================================

export const MenuPreviewTree: React.FC<MenuPreviewTreeProps> = ({
  menuTree,
  permissions,
  title,
  showHiddenNodes = false,
  selectedRouteKey,
  onSelectRouteKey,
}) => {
  // 확장된 메뉴 ID 상태
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    const ids = new Set<string>();
    // 기본적으로 모든 메뉴 그룹을 확장
    const collectMenuIds = (nodes: MenuNode[]) => {
      nodes.forEach((node) => {
        if (isMenuGroupNode(node)) {
          ids.add(node.id);
          if (node.children) {
            collectMenuIds(node.children);
          }
        }
        if (isCategoryNode(node)) {
          collectMenuIds(node.children);
        }
      });
    };
    collectMenuIds(menuTree);
    return ids;
  });

  const handleToggle = useCallback((id: string) => {
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

  // 접근 가능한 routeKey 목록 계산
  const accessibleRouteKeys = useMemo(() => {
    const keys: string[] = [];
    const collect = (nodes: MenuNode[]) => {
      nodes.forEach((node) => {
        const hasPermission = hasRequiredPermissions(
          node.requiredPermissions,
          permissions
        );
        if (hasPermission) {
          if (isPageNode(node)) {
            keys.push(node.routeKey);
          }
          if (isMenuGroupNode(node) && node.routeKey) {
            keys.push(node.routeKey);
          }
        }
        if (hasChildren(node)) {
          collect((node as CategoryMenuNode | MenuGroupNode).children!);
        }
      });
    };
    collect(menuTree);
    return keys;
  }, [menuTree, permissions]);

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 */}
      {title && (
        <div className="px-4 py-3 border-b border-softone-border bg-softone-surface">
          <h3 className="text-sm font-semibold text-softone-text">{title}</h3>
          <p className="text-xs text-softone-text-muted mt-1">
            {accessibleRouteKeys.length}개 페이지 접근 가능
          </p>
        </div>
      )}

      {/* 메뉴 트리 */}
      <div className="flex-1 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-900">
        {menuTree.map((node) => (
          <MenuNodePreview
            key={node.id}
            node={node}
            depth={0}
            permissions={permissions}
            showHiddenNodes={showHiddenNodes}
            expandedIds={expandedIds}
            onToggle={handleToggle}
            selectedRouteKey={selectedRouteKey}
            onSelectRouteKey={onSelectRouteKey}
          />
        ))}
      </div>
    </div>
  );
};

MenuPreviewTree.displayName = "MenuPreviewTree";

export default MenuPreviewTree;
