/**
 * SoftOne Design System - Grid Utilities
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – 재사용 가능한 그리드 패턴 캡슐화:
 *   그리드에서 자주 사용되는 유틸리티 함수들을 제공합니다.
 *   - 셀 포맷팅 (숫자, 날짜)
 *   - 상태별 행 스타일링
 *   - 쿼리 파라미터 빌드
 */

import type {
  PaginationState,
  SortState,
  FilterState,
  RowStatus,
} from "../model/grid.types";
import { formatDate, formatDateTime } from "./dateUtils";

// ========================================
// Cell Formatting Functions
// ========================================

/**
 * 숫자 셀 포맷팅 (천 단위 콤마)
 */
export function formatCellNumber(
  value: number | null | undefined,
  options?: {
    decimals?: number;
    prefix?: string;
    suffix?: string;
    emptyValue?: string;
  }
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return options?.emptyValue ?? "-";
  }

  const { decimals = 0, prefix = "", suffix = "" } = options ?? {};

  const formatted = value.toLocaleString("ko-KR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${prefix}${formatted}${suffix}`;
}

/**
 * 날짜 셀 포맷팅
 */
export function formatCellDate(
  value: string | Date | null | undefined,
  options?: {
    format?: "date" | "datetime" | "time";
    emptyValue?: string;
  }
): string {
  if (!value) {
    return options?.emptyValue ?? "-";
  }

  const { format = "date" } = options ?? {};

  try {
    const date = typeof value === "string" ? new Date(value) : value;

    if (isNaN(date.getTime())) {
      return options?.emptyValue ?? "-";
    }

    switch (format) {
      case "datetime":
        return formatDateTime(date);
      case "time":
        return date.toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
        });
      default:
        return formatDate(date);
    }
  } catch {
    return options?.emptyValue ?? "-";
  }
}

/**
 * 퍼센트 셀 포맷팅
 */
export function formatCellPercent(
  value: number | null | undefined,
  options?: {
    decimals?: number;
    emptyValue?: string;
  }
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return options?.emptyValue ?? "-";
  }

  const { decimals = 1 } = options ?? {};

  return `${value.toFixed(decimals)}%`;
}

/**
 * 통화 셀 포맷팅
 */
export function formatCellCurrency(
  value: number | null | undefined,
  options?: {
    currency?: "KRW" | "USD" | "EUR";
    emptyValue?: string;
  }
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return options?.emptyValue ?? "-";
  }

  const { currency = "KRW" } = options ?? {};

  const formatter = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    minimumFractionDigits: currency === "KRW" ? 0 : 2,
  });

  return formatter.format(value);
}

// ========================================
// Row Styling Functions
// ========================================

/**
 * 상태별 행 클래스 반환
 */
export function getRowClassByStatus(status: RowStatus | string): string {
  const statusClasses: Record<string, string> = {
    ACTIVE: "bg-green-50 hover:bg-green-100",
    INACTIVE: "bg-gray-50 hover:bg-gray-100 text-gray-500",
    PENDING: "bg-yellow-50 hover:bg-yellow-100",
    ERROR: "bg-red-50 hover:bg-red-100 text-red-700",
    SUCCESS: "bg-green-50 hover:bg-green-100 text-green-700",
    WARNING: "bg-orange-50 hover:bg-orange-100 text-orange-700",
  };

  return statusClasses[status] || "";
}

/**
 * ag-Grid CellClassRules 생성
 */
export function getAgGridCellClassRules(): Record<
  string,
  (params: { value: unknown }) => boolean
> {
  return {
    "bg-red-100 text-red-700": (params) => {
      const value = params.value;
      return typeof value === "number" && value < 0;
    },
    "bg-green-100 text-green-700": (params) => {
      const value = params.value;
      return typeof value === "number" && value > 1000;
    },
  };
}

// ========================================
// Query Parameter Functions
// ========================================

/**
 * 그리드 상태에서 API 쿼리 파라미터 빌드
 */
export function buildQueryParamsFromGridState(
  pagination: PaginationState,
  sorts?: SortState[],
  filters?: FilterState[]
): Record<string, unknown> {
  const params: Record<string, unknown> = {
    page: pagination.page,
    pageSize: pagination.pageSize,
  };

  // 정렬 파라미터 추가
  if (sorts && sorts.length > 0) {
    params.sortField = sorts.map((s) => s.field).join(",");
    params.sortDirection = sorts.map((s) => s.direction).join(",");
  }

  // 필터 파라미터 추가
  if (filters && filters.length > 0) {
    filters.forEach((filter, index) => {
      params[`filter[${index}][field]`] = filter.field;
      params[`filter[${index}][operator]`] = filter.operator;
      params[`filter[${index}][value]`] = filter.value;
    });
  }

  return params;
}

/**
 * 그리드 상태를 URL 쿼리스트링으로 변환
 */
export function buildQueryStringFromGridState(
  pagination: PaginationState,
  sorts?: SortState[],
  filters?: FilterState[]
): string {
  const params = buildQueryParamsFromGridState(pagination, sorts, filters);
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

// ========================================
// Data Transformation Functions
// ========================================

/**
 * 플랫 데이터를 그룹 데이터로 변환
 */
export function groupDataByField<T>(
  data: T[],
  groupField: keyof T
): Record<string, T[]> {
  return data.reduce((groups, item) => {
    const key = String(item[groupField] ?? "기타");
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * 그룹별 집계 계산
 */
export function calculateGroupAggregates<T>(
  groupedData: Record<string, T[]>,
  numericFields: (keyof T)[]
): Record<string, Record<string, { sum: number; avg: number; count: number }>> {
  const result: Record<
    string,
    Record<string, { sum: number; avg: number; count: number }>
  > = {};

  Object.entries(groupedData).forEach(([groupKey, items]) => {
    result[groupKey] = {};

    numericFields.forEach((field) => {
      const values: number[] = [];

      items.forEach((item) => {
        const val = item[field];
        if (typeof val === "number" && !isNaN(val)) {
          values.push(val);
        }
      });

      const sum = values.reduce((acc, val) => acc + val, 0);
      const count = values.length;
      const avg = count > 0 ? sum / count : 0;

      result[groupKey][String(field)] = { sum, avg, count };
    });
  });

  return result;
}

// ========================================
// Validation Functions
// ========================================

/**
 * 셀 값 유효성 검증
 */
export function validateCellValue(
  value: unknown,
  rules: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => string | null;
  }
): string | null {
  const { required, min, max, pattern, custom } = rules;

  // Required 체크
  if (required && (value === null || value === undefined || value === "")) {
    return "필수 입력 항목입니다.";
  }

  // 숫자 범위 체크
  if (typeof value === "number") {
    if (min !== undefined && value < min) {
      return `최소값은 ${min}입니다.`;
    }
    if (max !== undefined && value > max) {
      return `최대값은 ${max}입니다.`;
    }
  }

  // 패턴 체크
  if (pattern && typeof value === "string" && !pattern.test(value)) {
    return "형식이 올바르지 않습니다.";
  }

  // 커스텀 검증
  if (custom) {
    return custom(value);
  }

  return null;
}
