/**
 * SoftOne Design System - Tree Types
 * 작성: SoftOne Frontend Team
 *
 * TreeView 컴포넌트에서 사용되는 공통 타입 정의.
 * 도메인 독립적이며, 순수 UI 구조만 정의.
 */

import type { ReactNode } from "react";

// ========================================
// TreeNode
// ========================================

/**
 * 트리 노드 인터페이스
 */
export interface TreeNode {
  /** 노드 고유 ID */
  id: string;
  /** 노드 라벨 */
  label: string;
  /** 자식 노드 */
  children?: TreeNode[];
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 노드 아이콘 */
  icon?: ReactNode;
  /** 추가 데이터 */
  data?: Record<string, unknown>;
}

// ========================================
// TreeView Props
// ========================================

/**
 * TreeView 컴포넌트 Props
 */
export interface TreeViewProps {
  /** 노드 배열 */
  nodes: TreeNode[];

  // 선택 관련 (클릭 시 선택)
  /** 선택된 ID 배열 (Controlled) */
  selectedIds?: string[];
  /** 기본 선택 ID 배열 (Uncontrolled) */
  defaultSelectedIds?: string[];
  /** 선택 변경 핸들러 */
  onSelectIdsChange?: (ids: string[]) => void;
  /** 다중 선택 허용 */
  multiSelect?: boolean;

  // 확장/축소 관련
  /** 확장된 ID 배열 (Controlled) */
  expandedIds?: string[];
  /** 기본 확장 ID 배열 (Uncontrolled) */
  defaultExpandedIds?: string[];
  /** 확장 변경 핸들러 */
  onExpandedIdsChange?: (ids: string[]) => void;

  // 체크박스 관련
  /** 체크박스 표시 여부 */
  checkable?: boolean;
  /** 체크된 ID 배열 (Controlled) */
  checkedIds?: string[];
  /** 기본 체크 ID 배열 (Uncontrolled) */
  defaultCheckedIds?: string[];
  /** 체크 변경 핸들러 */
  onCheckedIdsChange?: (ids: string[]) => void;

  /** 추가 클래스 */
  className?: string;
}

// ========================================
// TreeNodeItem Props
// ========================================

/**
 * TreeNodeItem 컴포넌트 Props
 */
export interface TreeNodeItemProps {
  /** 노드 데이터 */
  node: TreeNode;
  /** 현재 depth (들여쓰기용) */
  depth: number;

  // 선택 상태
  /** 선택 여부 */
  isSelected: boolean;
  /** 선택 토글 핸들러 */
  onSelect: (id: string) => void;

  // 확장 상태
  /** 확장 여부 */
  isExpanded: boolean;
  /** 확장 토글 핸들러 */
  onToggleExpand: (id: string) => void;

  // 체크 상태 (checkable일 때만)
  /** 체크박스 표시 여부 */
  checkable: boolean;
  /** 체크 상태: 'checked' | 'unchecked' | 'indeterminate' */
  checkState?: "checked" | "unchecked" | "indeterminate";
  /** 체크 토글 핸들러 */
  onCheck?: (id: string, checked: boolean) => void;
}

// ========================================
// Utility Types
// ========================================

/**
 * 체크 상태 타입
 */
export type CheckState = "checked" | "unchecked" | "indeterminate";

/**
 * 노드 ID와 체크 상태 맵
 */
export type CheckStateMap = Map<string, CheckState>;
