/**
 * SoftOne Design System - TanStack Table Role-Based Grid Page
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – 재사용 가능한 그리드 패턴 캡슐화:
 *   사용자 역할(Role)에 따라 컬럼을 동적으로 숨기거나 표시합니다.
 *   - ADMIN: 모든 컬럼 표시 (원가, 마진율 포함)
 *   - 일반 사용자: 민감한 컬럼(원가, 마진율) 숨김
 *
 *   @tanstack/react-table의 headless 구조와 Tailwind 스타일링 예시입니다.
 */

import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";

import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { Input } from "@core/components/ui/Input";
import { Pagination } from "@core/components/ui/Pagination";
import { cn } from "@core/utils/classUtils";
import { useAuth } from "@core/hooks/useAuth";

import { useSalesDataQuery, type SalesData } from "../api/gridSampleApi";
import {
  formatCellNumber,
  formatCellCurrency,
  formatCellPercent,
  formatCellDate,
} from "@core/utils/gridUtils";

// ========================================
// Constants
// ========================================

const PAGE_SIZE = 15;

const columnHelper = createColumnHelper<SalesData>();

// ========================================
// TanStackRoleBasedGridPage Component
// ========================================

export const TanStackRoleBasedGridPage: React.FC = () => {
  const { user, hasRole } = useAuth();
  const isAdmin = hasRole("ADMIN");

  // 시뮬레이션용 역할 토글
  const [simulateAdmin, setSimulateAdmin] = useState(isAdmin);
  const showSensitiveColumns = simulateAdmin;

  // 상태
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  // 데이터 로딩
  const { data: response, isLoading } = useSalesDataQuery({
    page: 1,
    pageSize: 500, // 클라이언트 사이드 페이징을 위해 전체 로드
  });

  // 컬럼 정의
  const columns = useMemo(() => {
    const baseColumns = [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => (
          <span className="font-mono text-xs text-softone-text-muted">
            {info.getValue()}
          </span>
        ),
        size: 120,
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
      columnHelper.accessor("quantity", {
        header: "수량",
        cell: (info) => formatCellNumber(info.getValue()),
        meta: { align: "right" },
      }),
      columnHelper.accessor("unitPrice", {
        header: "단가",
        cell: (info) => formatCellCurrency(info.getValue()),
        meta: { align: "right" },
      }),
      columnHelper.accessor("totalAmount", {
        header: "매출액",
        cell: (info) => (
          <span className="font-semibold text-green-600">
            {formatCellCurrency(info.getValue())}
          </span>
        ),
        meta: { align: "right" },
      }),
    ];

    // 민감한 컬럼 (ADMIN만 볼 수 있음)
    const sensitiveColumns = showSensitiveColumns
      ? [
          columnHelper.accessor("cost", {
            header: () => (
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                원가
              </span>
            ),
            cell: (info) => (
              <span className="text-red-600">
                {formatCellCurrency(info.getValue())}
              </span>
            ),
            meta: { align: "right", sensitive: true },
          }),
          columnHelper.accessor("margin", {
            header: () => (
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                마진
              </span>
            ),
            cell: (info) => formatCellCurrency(info.getValue()),
            meta: { align: "right", sensitive: true },
          }),
          columnHelper.accessor("marginRate", {
            header: () => (
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                마진율
              </span>
            ),
            cell: (info) => {
              const value = info.getValue();
              const color =
                value >= 30
                  ? "text-green-600"
                  : value >= 20
                  ? "text-yellow-600"
                  : "text-red-600";
              return (
                <span className={cn("font-semibold", color)}>
                  {formatCellPercent(value)}
                </span>
              );
            },
            meta: { align: "right", sensitive: true },
          }),
        ]
      : [];

    const statusColumn = columnHelper.accessor("status", {
      header: "상태",
      cell: (info) => {
        const status = info.getValue();
        const variant =
          status === "COMPLETED"
            ? "success"
            : status === "PENDING"
            ? "warning"
            : "danger";
        const label =
          status === "COMPLETED"
            ? "완료"
            : status === "PENDING"
            ? "대기"
            : "취소";
        return <Badge variant={variant}>{label}</Badge>;
      },
    });

    const dateColumn = columnHelper.accessor("salesDate", {
      header: "판매일",
      cell: (info) => formatCellDate(info.getValue()),
    });

    return [...baseColumns, ...sensitiveColumns, statusColumn, dateColumn];
  }, [showSensitiveColumns]);

  // 테이블 인스턴스
  const table = useReactTable({
    data: response?.data ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="역할 기반 컬럼 제어"
        subtitle="사용자 역할에 따라 민감한 정보(원가, 마진율)를 숨기거나 표시합니다."
        icon={<Users className="w-5 h-5 text-softone-primary" />}
      />

      {/* 역할 상태 표시 */}
      <Card>
        <CardBody className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-softone-text-muted mr-2">
                현재 사용자:
              </span>
              <Badge variant="primary">{user?.name || "Guest"}</Badge>
            </div>
            <div>
              <span className="text-sm text-softone-text-muted mr-2">
                역할:
              </span>
              {user?.roles?.map((role) => (
                <Badge key={role} variant="info" className="mr-1">
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant={simulateAdmin ? "primary" : "outline"}
              onClick={() => setSimulateAdmin(!simulateAdmin)}
              leftIcon={
                simulateAdmin ? (
                  <Unlock className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )
              }
            >
              {simulateAdmin ? "ADMIN 모드" : "일반 사용자 모드"}
            </Button>

            <div className="flex items-center gap-2">
              {simulateAdmin ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm">
                민감 컬럼: {simulateAdmin ? "표시" : "숨김"}
              </span>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 검색 */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-4">
            <Input
              placeholder="전체 검색..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="max-w-xs"
            />
            <span className="text-sm text-softone-text-muted">
              총 {table.getFilteredRowModel().rows.length}건
            </span>
          </div>
        </CardBody>
      </Card>

      {/* 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">
            매출 데이터
            {!showSensitiveColumns && (
              <span className="ml-2 text-xs text-softone-text-muted font-normal">
                (원가/마진 컬럼 숨김)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-softone-bg border-b border-softone-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta as
                      | { align?: string; sensitive?: boolean }
                      | undefined;
                    const isSensitive = meta?.sensitive;

                    return (
                      <th
                        key={header.id}
                        className={cn(
                          "px-4 py-3 text-left font-semibold text-softone-text whitespace-nowrap",
                          meta?.align === "right" && "text-right",
                          isSensitive && "bg-red-50",
                          header.column.getCanSort() &&
                            "cursor-pointer select-none hover:bg-softone-surface-hover"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            meta?.align === "right" && "justify-end"
                          )}
                        >
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
                    );
                  })}
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
                    {row.getVisibleCells().map((cell) => {
                      const meta = cell.column.columnDef.meta as
                        | { align?: string; sensitive?: boolean }
                        | undefined;
                      const isSensitive = meta?.sensitive;

                      return (
                        <td
                          key={cell.id}
                          className={cn(
                            "px-4 py-3",
                            meta?.align === "right" && "text-right",
                            isSensitive && "bg-red-50/50"
                          )}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
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
          page={pagination.pageIndex + 1}
          pageSize={PAGE_SIZE}
          total={table.getFilteredRowModel().rows.length}
          onChange={(page: number) =>
            setPagination({ ...pagination, pageIndex: page - 1 })
          }
        />
      </div>
    </div>
  );
};

TanStackRoleBasedGridPage.displayName = "TanStackRoleBasedGridPage";
