/**
 * SoftOne Design System - Grid Types
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – 재사용 가능한 그리드 패턴 캡슐화:
 *   ag-Grid, TanStack Table 등 다양한 그리드 라이브러리에서
 *   공통으로 사용하는 타입들을 정의합니다.
 *
 * 이 타입들은 서버 페이징, 정렬, 필터링 파라미터 생성에 활용됩니다.
 */

// ========================================
// Pagination Types
// ========================================

/**
 * 페이지네이션 상태
 */
export interface PaginationState {
  /** 현재 페이지 (1부터 시작) */
  page: number;
  /** 페이지당 항목 수 */
  pageSize: number;
  /** 전체 항목 수 */
  total?: number;
}

/**
 * 기본 페이지네이션 상태
 */
export const DEFAULT_PAGINATION: PaginationState = {
  page: 1,
  pageSize: 20,
};

// ========================================
// Sort Types
// ========================================

/**
 * 정렬 방향
 */
export type SortDirection = "asc" | "desc";

/**
 * 정렬 상태
 */
export interface SortState {
  /** 정렬할 필드명 */
  field: string;
  /** 정렬 방향 */
  direction: SortDirection;
}

// ========================================
// Filter Types
// ========================================

/**
 * 필터 연산자
 */
export type FilterOperator =
  | "eq"       // 같음
  | "ne"       // 같지 않음
  | "gt"       // 보다 큼
  | "gte"      // 보다 크거나 같음
  | "lt"       // 보다 작음
  | "lte"      // 보다 작거나 같음
  | "contains" // 포함
  | "startsWith" // 시작
  | "endsWith"   // 끝
  | "in"       // 배열에 포함
  | "between"; // 범위

/**
 * 필터 상태
 */
export interface FilterState {
  /** 필터할 필드명 */
  field: string;
  /** 필터 연산자 */
  operator: FilterOperator;
  /** 필터 값 */
  value: unknown;
}

// ========================================
// Grid Query Types
// ========================================

/**
 * 그리드 쿼리 파라미터
 * 서버 사이드 페이징/정렬/필터링에 사용
 */
export interface GridQueryParams {
  /** 페이지네이션 */
  pagination: PaginationState;
  /** 정렬 (다중 정렬 지원) */
  sorts?: SortState[];
  /** 필터 (다중 필터 지원) */
  filters?: FilterState[];
}

/**
 * 그리드 데이터 응답
 */
export interface GridDataResponse<T> {
  /** 데이터 배열 */
  data: T[];
  /** 전체 항목 수 */
  total: number;
  /** 현재 페이지 */
  page: number;
  /** 페이지당 항목 수 */
  pageSize: number;
  /** 전체 페이지 수 */
  totalPages: number;
}

// ========================================
// Row Selection Types
// ========================================

/**
 * 행 선택 모드
 */
export type RowSelectionMode = "single" | "multiple" | "none";

/**
 * 행 선택 상태
 */
export interface RowSelectionState<T = unknown> {
  /** 선택된 행 ID 목록 */
  selectedIds: string[];
  /** 선택된 행 데이터 */
  selectedRows: T[];
}

// ========================================
// Cell Edit Types
// ========================================

/**
 * 셀 편집 상태
 */
export interface CellEditState {
  /** 편집 중인 행 ID */
  rowId: string;
  /** 편집 중인 필드명 */
  field: string;
  /** 원래 값 */
  originalValue: unknown;
  /** 현재 값 */
  currentValue: unknown;
}

/**
 * 편집된 행 변경사항
 */
export interface RowChanges<T = Record<string, unknown>> {
  /** 행 ID */
  rowId: string;
  /** 변경된 필드들 */
  changes: Partial<T>;
  /** 원본 데이터 */
  original: T;
}

// ========================================
// Status Types (for styling)
// ========================================

/**
 * 일반적인 행 상태
 */
export type RowStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING"
  | "ERROR"
  | "SUCCESS"
  | "WARNING";

