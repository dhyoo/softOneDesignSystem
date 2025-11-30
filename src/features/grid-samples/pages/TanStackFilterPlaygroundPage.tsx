/**
 * SoftOne Design System - TanStack Filter Playground Page
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – Store Isolation 및 백엔드 Mock 연동을 통한 실제 운영 패턴 검증:
 *   TanStack Table 기반 필터/정렬/페이지네이션을 URL QueryString과 동기화합니다.
 *
 *   핵심 기능:
 *   - useSearchParams로 필터 상태 URL 동기화
 *   - 뒤로가기/앞으로가기 시 상태 복원
 *   - 북마크/공유 가능한 필터 URL
 */

import React, { useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Link2,
  Search,
  X,
  RefreshCw,
} from "lucide-react";

import { PageHeader } from "@core/components/layout/PageHeader";
import { Card, CardBody } from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { Input } from "@core/components/ui/Input";
import { Select } from "@core/components/ui/Select";
import { Pagination } from "@core/components/ui/Pagination";
import { FormFieldWrapper } from "@core/components/ui/FormFieldWrapper";
import { useToast } from "@core/hooks/useToast";
import { cn } from "@core/utils/classUtils";

import { useSalesDataQuery, type SalesData } from "../api/gridSampleApi";
import { formatCellCurrency, formatCellDate } from "@core/utils/gridUtils";

// ========================================
// Constants
// ========================================

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10개" },
  { value: "20", label: "20개" },
  { value: "50", label: "50개" },
];

const STATUS_OPTIONS = [
  { value: "", label: "전체" },
  { value: "COMPLETED", label: "완료" },
  { value: "PENDING", label: "대기" },
  { value: "CANCELLED", label: "취소" },
];

const CATEGORY_OPTIONS = [
  { value: "", label: "전체" },
  { value: "전자제품", label: "전자제품" },
  { value: "의류", label: "의류" },
  { value: "식품", label: "식품" },
  { value: "가구", label: "가구" },
];

const columnHelper = createColumnHelper<SalesData>();

// ========================================
// TanStackFilterPlaygroundPage Component
// ========================================

export const TanStackFilterPlaygroundPage: React.FC = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 상태 읽기
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);
  const keyword = searchParams.get("keyword") || "";
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const sortField = searchParams.get("sortField") || "";
  const sortDir = searchParams.get("sortDir") || "";

  // 정렬 상태
  const sorting: SortingState = sortField
    ? [{ id: sortField, desc: sortDir === "desc" }]
    : [];

  // 데이터 로딩
  const { data: response, isLoading, refetch } = useSalesDataQuery({
    page: 1,
    pageSize: 500, // 클라이언트 필터링을 위해 전체 로드
    categoryFilter: category || undefined,
  });

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    let data = response?.data || [];

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      data = data.filter(
        (item) =>
          item.productName.toLowerCase().includes(lowerKeyword) ||
          item.id.toLowerCase().includes(lowerKeyword)
      );
    }

    if (status) {
      data = data.filter((item) => item.status === status);
    }

    return data;
  }, [response?.data, keyword, status]);

  // 컬럼 정의
  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => (
          <span className="font-mono text-xs text-softone-text-muted">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("productName", {
        header: "상품명",
        cell: (info) => <span className="font-medium">{info.getValue()}</span>,
      }),
      columnHelper.accessor("category", {
        header: "카테고리",
        cell: (info) => (
          <Badge variant="neutral" size="sm">
            {info.getValue()}
          </Badge>
        ),
      }),
      columnHelper.accessor("region", {
        header: "지역",
      }),
      columnHelper.accessor("totalAmount", {
        header: "매출액",
        cell: (info) => (
          <span className="font-semibold text-green-600">
            {formatCellCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "상태",
        cell: (info) => {
          const value = info.getValue();
          const variant =
            value === "COMPLETED"
              ? "success"
              : value === "PENDING"
              ? "warning"
              : "danger";
          const label =
            value === "COMPLETED"
              ? "완료"
              : value === "PENDING"
              ? "대기"
              : "취소";
          return <Badge variant={variant}>{label}</Badge>;
        },
      }),
      columnHelper.accessor("salesDate", {
        header: "판매일",
        cell: (info) => formatCellDate(info.getValue()),
      }),
    ],
    []
  );

  // 테이블 인스턴스
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination: { pageIndex: page - 1, pageSize },
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting) : updater;
      if (newSorting.length > 0) {
        updateParams({
          sortField: newSorting[0].id,
          sortDir: newSorting[0].desc ? "desc" : "asc",
        });
      } else {
        updateParams({ sortField: undefined, sortDir: undefined });
      }
    },
    onPaginationChange: (updater) => {
      const current = { pageIndex: page - 1, pageSize };
      const newPagination =
        typeof updater === "function" ? updater(current) : updater;
      updateParams({
        page: String(newPagination.pageIndex + 1),
        pageSize: String(newPagination.pageSize),
      });
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: false,
  });

  // URL 파라미터 업데이트
  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, value);
        }
      });

      setSearchParams(newParams, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // 필터 초기화
  const handleClearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
    toast.info("필터가 초기화되었습니다.");
  }, [setSearchParams, toast]);

  // URL 복사
  const handleCopyUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("URL이 클립보드에 복사되었습니다.");
  }, [toast]);

  // 현재 URL 표시
  const currentUrl = useMemo(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", String(page));
    if (pageSize !== 20) params.set("pageSize", String(pageSize));
    if (keyword) params.set("keyword", keyword);
    if (status) params.set("status", status);
    if (category) params.set("category", category);
    if (sortField) params.set("sortField", sortField);
    if (sortDir) params.set("sortDir", sortDir);

    const queryString = params.toString();
    return queryString ? `?${queryString}` : "(필터 없음)";
  }, [page, pageSize, keyword, status, category, sortField, sortDir]);

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="TanStack Filter Playground (URL Sync)"
        subtitle="필터/정렬/페이지네이션 상태를 URL QueryString과 동기화합니다."
        icon={<Link2 className="w-5 h-5 text-softone-primary" />}
      />

      {/* 설명 */}
      <Card>
        <CardBody className="text-sm text-softone-text-secondary">
          <p>
            <strong>URL 동기화:</strong> 필터를 변경하면 URL이 자동으로
            업데이트됩니다. 이 URL을 북마크하거나 공유할 수 있으며, 브라우저
            뒤로가기/앞으로가기로 이전 필터 상태를 복원할 수 있습니다.
          </p>
        </CardBody>
      </Card>

      {/* 현재 URL */}
      <Card>
        <CardBody className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <span className="text-sm text-softone-text-muted mr-2">
              현재 URL:
            </span>
            <code className="text-sm bg-softone-bg px-2 py-1 rounded">
              {currentUrl}
            </code>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            leftIcon={<Link2 className="w-4 h-4" />}
          >
            URL 복사
          </Button>
        </CardBody>
      </Card>

      {/* 필터 영역 */}
      <Card>
        <CardBody className="flex items-end gap-4 flex-wrap">
          <FormFieldWrapper label="키워드 검색" className="w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-softone-text-muted" />
              <Input
                placeholder="상품명, ID..."
                value={keyword}
                onChange={(e) => updateParams({ keyword: e.target.value, page: "1" })}
                className="pl-10"
                fullWidth
              />
            </div>
          </FormFieldWrapper>

          <FormFieldWrapper label="카테고리" className="w-40">
            <Select
              options={CATEGORY_OPTIONS}
              value={category}
              onChange={(e) =>
                updateParams({ category: e.target.value, page: "1" })
              }
              fullWidth
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="상태" className="w-32">
            <Select
              options={STATUS_OPTIONS}
              value={status}
              onChange={(e) =>
                updateParams({ status: e.target.value, page: "1" })
              }
              fullWidth
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="페이지 크기" className="w-28">
            <Select
              options={PAGE_SIZE_OPTIONS}
              value={String(pageSize)}
              onChange={(e) =>
                updateParams({ pageSize: e.target.value, page: "1" })
              }
              fullWidth
            />
          </FormFieldWrapper>

          <Button
            variant="outline"
            onClick={handleClearFilters}
            leftIcon={<X className="w-4 h-4" />}
          >
            초기화
          </Button>

          <Button
            variant="outline"
            onClick={() => refetch()}
            loading={isLoading}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            새로고침
          </Button>
        </CardBody>
      </Card>

      {/* 결과 정보 */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-softone-text-muted">
          총 {filteredData.length}건 중 {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, filteredData.length)}건 표시
        </span>
        <div className="flex items-center gap-2">
          {sorting.length > 0 && (
            <Badge variant="info">
              정렬: {sorting[0].id} ({sorting[0].desc ? "내림차순" : "오름차순"})
            </Badge>
          )}
        </div>
      </div>

      {/* 테이블 */}
      <Card>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-softone-bg border-b border-softone-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={cn(
                        "px-4 py-3 text-left font-semibold text-softone-text whitespace-nowrap",
                        header.column.getCanSort() &&
                          "cursor-pointer select-none hover:bg-softone-surface-hover"
                      )}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          <span className="text-softone-text-muted">
                            {header.column.getIsSorted() === "asc" ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronsUpDown className="w-4 h-4 opacity-50" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-softone-text-muted"
                  >
                    로딩 중...
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-softone-text-muted"
                  >
                    데이터가 없습니다.
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-softone-border hover:bg-softone-surface-hover transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* 페이지네이션 */}
      <div className="flex justify-center">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={filteredData.length}
          onChange={(newPage: number) => updateParams({ page: String(newPage) })}
        />
      </div>
    </div>
  );
};

TanStackFilterPlaygroundPage.displayName = "TanStackFilterPlaygroundPage";

