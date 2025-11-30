/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 *
 * 중복 업무 감소:
 *   트리 구조 렌더링, 확장/축소, 선택, 3-state 체크박스 로직을
 *   하나의 컴포넌트로 캡슐화. 조직도, 카테고리, 메뉴 등에 재사용 가능.
 *
 * A11y:
 *   role="tree", role="treeitem", role="group" 등 WAI-ARIA 트리 패턴 적용.
 *   aria-expanded로 확장 상태 전달.
 *   키보드 네비게이션은 1차에서 최소 지원 (추후 확장 가능).
 *
 * TreeView Component
 * - Controlled + Uncontrolled 지원
 * - checkable 옵션으로 3-state 체크박스 지원
 *
 * @example
 * const nodes = [
 *   { id: '1', label: '루트', children: [
 *     { id: '1-1', label: '자식 1' },
 *     { id: '1-2', label: '자식 2' },
 *   ]},
 * ];
 *
 * <TreeView
 *   nodes={nodes}
 *   checkable
 *   checkedIds={checked}
 *   onCheckedIdsChange={setChecked}
 * />
 */

import React, { useState, useCallback, useMemo } from "react";
import { ChevronRight, ChevronDown, Folder, File } from "lucide-react";
import { Checkbox } from "./Checkbox";
import { cn } from "../../utils/classUtils";
import type {
  TreeNode,
  TreeViewProps,
  CheckState,
  CheckStateMap,
} from "./tree.types";

// ========================================
// Utility Functions
// ========================================

/**
 * 모든 자식 ID를 재귀적으로 수집
 */
function getAllDescendantIds(node: TreeNode): string[] {
  const ids: string[] = [];
  function collect(n: TreeNode) {
    ids.push(n.id);
    n.children?.forEach(collect);
  }
  collect(node);
  return ids;
}

/**
 * 노드 ID로 노드 찾기
 */
function findNodeById(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * 체크 상태 계산 (3-state)
 */
function calculateCheckStates(
  nodes: TreeNode[],
  checkedIds: Set<string>
): CheckStateMap {
  const stateMap: CheckStateMap = new Map();

  function process(node: TreeNode): CheckState {
    if (!node.children || node.children.length === 0) {
      // 리프 노드
      const state = checkedIds.has(node.id) ? "checked" : "unchecked";
      stateMap.set(node.id, state);
      return state;
    }

    // 자식들의 상태 확인
    const childStates = node.children.map(process);
    const allChecked = childStates.every((s) => s === "checked");
    const allUnchecked = childStates.every((s) => s === "unchecked");

    let state: CheckState;
    if (allChecked) {
      state = "checked";
    } else if (allUnchecked) {
      state = "unchecked";
    } else {
      state = "indeterminate";
    }

    stateMap.set(node.id, state);
    return state;
  }

  nodes.forEach(process);
  return stateMap;
}

// ========================================
// TreeNodeItem Component
// ========================================

interface TreeNodeItemInternalProps {
  node: TreeNode;
  depth: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  checkable: boolean;
  checkState: CheckState;
  onCheck: (id: string, checked: boolean) => void;
  expandedIds: Set<string>;
  selectedIds: Set<string>;
  checkStates: CheckStateMap;
}

const TreeNodeItem: React.FC<TreeNodeItemInternalProps> = ({
  node,
  depth,
  isSelected,
  onSelect,
  isExpanded,
  onToggleExpand,
  checkable,
  checkState,
  onCheck,
  expandedIds,
  selectedIds,
  checkStates,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const paddingLeft = depth * 20;

  return (
    <li
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-disabled={node.disabled}
    >
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer",
          "transition-colors duration-150",
          isSelected
            ? "bg-softone-primary/10 text-softone-primary"
            : "hover:bg-softone-surface-hover",
          node.disabled && "opacity-50 cursor-not-allowed"
        )}
        style={{ paddingLeft }}
        onClick={() => !node.disabled && onSelect(node.id)}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="p-0.5 hover:bg-softone-bg rounded"
            aria-label={isExpanded ? "축소" : "확장"}
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="w-5" /> // 정렬용 스페이서
        )}

        {/* Checkbox */}
        {checkable && (
          <Checkbox
            checked={checkState === "checked"}
            indeterminate={checkState === "indeterminate"}
            onChange={(e) => onCheck(node.id, e.target.checked)}
            disabled={node.disabled}
            onClick={(e) => e.stopPropagation()}
          />
        )}

        {/* Icon */}
        {node.icon ||
          (hasChildren ? (
            <Folder className="w-4 h-4 text-softone-text-muted" />
          ) : (
            <File className="w-4 h-4 text-softone-text-muted" />
          ))}

        {/* Label */}
        <span className="text-sm truncate">{node.label}</span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <ul role="group" className="list-none">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              isSelected={selectedIds.has(child.id)}
              onSelect={onSelect}
              isExpanded={expandedIds.has(child.id)}
              onToggleExpand={onToggleExpand}
              checkable={checkable}
              checkState={checkStates.get(child.id) || "unchecked"}
              onCheck={onCheck}
              expandedIds={expandedIds}
              selectedIds={selectedIds}
              checkStates={checkStates}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

// ========================================
// TreeView Component
// ========================================

export const TreeView: React.FC<TreeViewProps> = ({
  nodes,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds = [],
  onSelectIdsChange,
  multiSelect = false,
  expandedIds: controlledExpandedIds,
  defaultExpandedIds = [],
  onExpandedIdsChange,
  checkable = false,
  checkedIds: controlledCheckedIds,
  defaultCheckedIds = [],
  onCheckedIdsChange,
  className,
}) => {
  // Selected state
  const isSelectedControlled = controlledSelectedIds !== undefined;
  const [internalSelectedIds, setInternalSelectedIds] =
    useState<string[]>(defaultSelectedIds);
  const selectedIds = useMemo(
    () =>
      new Set(
        isSelectedControlled ? controlledSelectedIds : internalSelectedIds
      ),
    [isSelectedControlled, controlledSelectedIds, internalSelectedIds]
  );

  // Expanded state
  const isExpandedControlled = controlledExpandedIds !== undefined;
  const [internalExpandedIds, setInternalExpandedIds] =
    useState<string[]>(defaultExpandedIds);
  const expandedIds = useMemo(
    () =>
      new Set(
        isExpandedControlled ? controlledExpandedIds : internalExpandedIds
      ),
    [isExpandedControlled, controlledExpandedIds, internalExpandedIds]
  );

  // Checked state
  const isCheckedControlled = controlledCheckedIds !== undefined;
  const [internalCheckedIds, setInternalCheckedIds] =
    useState<string[]>(defaultCheckedIds);
  const checkedIds = useMemo(
    () =>
      new Set(isCheckedControlled ? controlledCheckedIds : internalCheckedIds),
    [isCheckedControlled, controlledCheckedIds, internalCheckedIds]
  );

  // Calculate check states for 3-state
  const checkStates = useMemo(
    () => calculateCheckStates(nodes, checkedIds),
    [nodes, checkedIds]
  );

  // Selection handler
  const handleSelect = useCallback(
    (id: string) => {
      let newIds: string[];
      if (multiSelect) {
        newIds = selectedIds.has(id)
          ? Array.from(selectedIds).filter((i) => i !== id)
          : [...Array.from(selectedIds), id];
      } else {
        newIds = [id];
      }

      if (!isSelectedControlled) {
        setInternalSelectedIds(newIds);
      }
      onSelectIdsChange?.(newIds);
    },
    [selectedIds, multiSelect, isSelectedControlled, onSelectIdsChange]
  );

  // Expand/Collapse handler
  const handleToggleExpand = useCallback(
    (id: string) => {
      const newIds = expandedIds.has(id)
        ? Array.from(expandedIds).filter((i) => i !== id)
        : [...Array.from(expandedIds), id];

      if (!isExpandedControlled) {
        setInternalExpandedIds(newIds);
      }
      onExpandedIdsChange?.(newIds);
    },
    [expandedIds, isExpandedControlled, onExpandedIdsChange]
  );

  // Check handler (3-state 지원)
  const handleCheck = useCallback(
    (id: string, checked: boolean) => {
      const node = findNodeById(nodes, id);
      if (!node) return;

      const descendantIds = getAllDescendantIds(node);
      let newCheckedSet = new Set(checkedIds);

      if (checked) {
        // 자신과 모든 자손 체크
        descendantIds.forEach((dId) => newCheckedSet.add(dId));
      } else {
        // 자신과 모든 자손 체크 해제
        descendantIds.forEach((dId) => newCheckedSet.delete(dId));
      }

      const newIds = Array.from(newCheckedSet);

      if (!isCheckedControlled) {
        setInternalCheckedIds(newIds);
      }
      onCheckedIdsChange?.(newIds);
    },
    [nodes, checkedIds, isCheckedControlled, onCheckedIdsChange]
  );

  return (
    <ul
      role="tree"
      aria-multiselectable={multiSelect}
      className={cn(
        "list-none p-2 bg-softone-surface border border-softone-border rounded-lg",
        className
      )}
    >
      {nodes.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          depth={0}
          isSelected={selectedIds.has(node.id)}
          onSelect={handleSelect}
          isExpanded={expandedIds.has(node.id)}
          onToggleExpand={handleToggleExpand}
          checkable={checkable}
          checkState={checkStates.get(node.id) || "unchecked"}
          onCheck={handleCheck}
          expandedIds={expandedIds}
          selectedIds={selectedIds}
          checkStates={checkStates}
        />
      ))}
    </ul>
  );
};

TreeView.displayName = "TreeView";

// Re-export types
export type { TreeNode, TreeViewProps } from "./tree.types";
