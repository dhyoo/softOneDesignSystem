/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 리스트 화면 표준화를 위해 DataTable 패턴을 캡슐화합니다.
 *      퍼블리셔가 이 파일만 수정하면 모든 도메인의 리스트 스타일을
 *      일괄 변경할 수 있습니다.
 *
 * DataTable Component
 * - 제네릭 타입 T로 어떤 데이터 타입도 지원
 * - Zebra striping, hover, 빈 상태 처리
 * - 정렬, 선택 기능 확장 가능
 */

import React from "react";
import { cn } from "../../utils/classUtils";
import { Inbox } from "lucide-react";

// ========================================
// DataTable Types
// ========================================

export interface DataTableColumn<T> {
  /** 컬럼 키 (데이터 필드명 또는 고유 키) */
  key: string;
  /** 헤더 텍스트 */
  header: string;
  /** 컬럼 너비 */
  width?: string | number;
  /** 정렬 */
  align?: "left" | "center" | "right";
  /** 커스텀 렌더러 */
  render?: (row: T, index: number) => React.ReactNode;
  /** 정렬 가능 여부 */
  sortable?: boolean;
}

export interface DataTableProps<T> {
  /** 컬럼 정의 */
  columns: DataTableColumn<T>[];
  /** 데이터 배열 */
  data: T[];
  /** 행 고유 키를 반환하는 함수 */
  rowKey?: (row: T, index: number) => string | number;
  /** 로딩 상태 */
  loading?: boolean;
  /** 빈 상태 메시지 */
  emptyMessage?: string;
  /** 빈 상태 아이콘 */
  emptyIcon?: React.ReactNode;
  /** 줄무늬(zebra) 스타일 */
  striped?: boolean;
  /** 호버 효과 */
  hoverable?: boolean;
  /** 테두리 */
  bordered?: boolean;
  /** 행 클릭 핸들러 */
  onRowClick?: (row: T, index: number) => void;
  /** 추가 클래스 */
  className?: string;
  /** 테이블 추가 클래스 */
  tableClassName?: string;
}

// ========================================
// Loading Skeleton
// ========================================

const LoadingSkeleton: React.FC<{ columns: number; rows?: number }> = ({
  columns,
  rows = 5,
}) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <tr key={rowIndex}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <td key={colIndex} className="px-4 py-3">
            <div className="h-4 bg-softone-border rounded animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

// ========================================
// Empty State
// ========================================

interface EmptyStateProps {
  message: string;
  icon?: React.ReactNode;
  colSpan: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, icon, colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="px-4 py-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 rounded-full bg-softone-bg flex items-center justify-center mb-3">
          {icon || <Inbox className="w-6 h-6 text-softone-text-muted" />}
        </div>
        <p className="text-softone-text-secondary">{message}</p>
      </div>
    </td>
  </tr>
);

// ========================================
// DataTable Component
// ========================================

export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading = false,
  emptyMessage = "데이터가 없습니다",
  emptyIcon,
  striped = true,
  hoverable = true,
  bordered = true,
  onRowClick,
  className,
  tableClassName,
}: DataTableProps<T>) {
  // 행 키 생성
  const getRowKey = (row: T, index: number): string | number => {
    if (rowKey) {
      return rowKey(row, index);
    }
    // 기본: id 필드 또는 index 사용
    const anyRow = row as Record<string, unknown>;
    return (anyRow.id as string | number) ?? index;
  };

  // 셀 값 가져오기
  const getCellValue = (
    row: T,
    column: DataTableColumn<T>,
    index: number
  ): React.ReactNode => {
    // 커스텀 렌더러가 있으면 사용
    if (column.render) {
      return column.render(row, index);
    }

    // 기본: 키로 값 접근
    const anyRow = row as Record<string, unknown>;
    const value = anyRow[column.key];

    // null/undefined 처리
    if (value === null || value === undefined) {
      return <span className="text-softone-text-muted">-</span>;
    }

    return String(value);
  };

  // 정렬 스타일
  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg",
        bordered && "border border-softone-border",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className={cn("w-full border-collapse", tableClassName)}>
          {/* Header */}
          <thead>
            <tr className="bg-softone-bg border-b border-softone-border">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-4 py-3 text-xs font-semibold uppercase tracking-wider",
                    "text-softone-text-secondary",
                    getAlignClass(column.align)
                  )}
                  style={{
                    width: column.width,
                    minWidth:
                      typeof column.width === "number"
                        ? column.width
                        : undefined,
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="bg-softone-surface divide-y divide-softone-border">
            {loading ? (
              <LoadingSkeleton columns={columns.length} />
            ) : data.length === 0 ? (
              <EmptyState
                message={emptyMessage}
                icon={emptyIcon}
                colSpan={columns.length}
              />
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={getRowKey(row, rowIndex)}
                  className={cn(
                    "transition-colors",
                    striped && rowIndex % 2 === 1 && "bg-softone-bg/50",
                    hoverable && "hover:bg-softone-surface-hover",
                    onRowClick && "cursor-pointer"
                  )}
                  onClick={() => onRowClick?.(row, rowIndex)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-3 text-sm text-softone-text",
                        getAlignClass(column.align)
                      )}
                    >
                      {getCellValue(row, column, rowIndex)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DataTable.displayName = "DataTable";
