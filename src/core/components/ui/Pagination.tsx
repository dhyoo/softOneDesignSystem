/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 리스트 화면 표준화를 위해 Pagination 패턴을 캡슐화합니다.
 *      모든 도메인(사용자, 상품, 주문 등)의 리스트에서
 *      동일한 페이지네이션 UX를 제공합니다.
 *
 * Pagination Component
 * - 이전/다음 버튼 + 숫자 버튼 구성
 * - 반응형 페이지 번호 표시
 */

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { cn } from "../../utils/classUtils";

// ========================================
// Pagination Types
// ========================================

export interface PaginationProps {
  /** 현재 페이지 (1부터 시작) */
  page: number;
  /** 페이지당 항목 수 */
  pageSize: number;
  /** 전체 항목 수 */
  total: number;
  /** 페이지 변경 핸들러 */
  onChange: (page: number) => void;
  /** 최대 표시 페이지 버튼 수 (기본: 5) */
  maxButtons?: number;
  /** 첫/마지막 페이지 버튼 표시 */
  showFirstLast?: boolean;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// Pagination Component
// ========================================

export const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  onChange,
  maxButtons = 5,
  showFirstLast = true,
  className,
}) => {
  // 전체 페이지 수 계산
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // 현재 페이지가 범위 내인지 확인
  const currentPage = Math.min(Math.max(1, page), totalPages);

  // 표시할 페이지 번호 계산
  const getPageNumbers = (): number[] => {
    const pages: number[] = [];
    const half = Math.floor(maxButtons / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxButtons - 1);

    // 시작 조정
    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      onChange(newPage);
    }
  };

  // 페이지가 1개일 때는 숨김
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      {/* 첫 페이지 */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className={cn(
            "p-2 rounded-md transition-colors",
            "text-softone-text-secondary hover:bg-softone-surface-hover",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          )}
          aria-label="첫 페이지"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
      )}

      {/* 이전 페이지 */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          "p-2 rounded-md transition-colors",
          "text-softone-text-secondary hover:bg-softone-surface-hover",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        )}
        aria-label="이전 페이지"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* 페이지 번호 */}
      <div className="flex items-center gap-1">
        {pageNumbers[0] > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={cn(
                "min-w-[36px] h-9 px-3 rounded-md text-sm font-medium transition-colors",
                "text-softone-text-secondary hover:bg-softone-surface-hover"
              )}
            >
              1
            </button>
            {pageNumbers[0] > 2 && (
              <span className="px-2 text-softone-text-muted">...</span>
            )}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={cn(
              "min-w-[36px] h-9 px-3 rounded-md text-sm font-medium transition-colors",
              pageNum === currentPage
                ? "bg-softone-primary text-white"
                : "text-softone-text-secondary hover:bg-softone-surface-hover"
            )}
            aria-current={pageNum === currentPage ? "page" : undefined}
          >
            {pageNum}
          </button>
        ))}

        {pageNumbers[pageNumbers.length - 1] < totalPages && (
          <>
            {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
              <span className="px-2 text-softone-text-muted">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={cn(
                "min-w-[36px] h-9 px-3 rounded-md text-sm font-medium transition-colors",
                "text-softone-text-secondary hover:bg-softone-surface-hover"
              )}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      {/* 다음 페이지 */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          "p-2 rounded-md transition-colors",
          "text-softone-text-secondary hover:bg-softone-surface-hover",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        )}
        aria-label="다음 페이지"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* 마지막 페이지 */}
      {showFirstLast && (
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className={cn(
            "p-2 rounded-md transition-colors",
            "text-softone-text-secondary hover:bg-softone-surface-hover",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
          )}
          aria-label="마지막 페이지"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

Pagination.displayName = "Pagination";

// ========================================
// Pagination Info Component
// ========================================

export interface PaginationInfoProps {
  page: number;
  pageSize: number;
  total: number;
  className?: string;
}

/**
 * PaginationInfo - 페이지 정보 표시
 *
 * @example
 * <PaginationInfo page={1} pageSize={10} total={100} />
 * // "1-10 / 100건"
 */
export const PaginationInfo: React.FC<PaginationInfoProps> = ({
  page,
  pageSize,
  total,
  className,
}) => {
  const start = Math.min((page - 1) * pageSize + 1, total);
  const end = Math.min(page * pageSize, total);

  return (
    <div className={cn("text-sm text-softone-text-secondary", className)}>
      {total > 0 ? (
        <>
          <span className="font-medium text-softone-text">
            {start}-{end}
          </span>
          {" / "}
          <span className="font-medium text-softone-text">
            {total.toLocaleString()}
          </span>
          건
        </>
      ) : (
        "0건"
      )}
    </div>
  );
};

PaginationInfo.displayName = "PaginationInfo";
