/**
 * SoftOne Design System - TanStack Table Basic Sample
 * 작성: SoftOne Frontend Team
 * 설명: @tanstack/react-table v8 기본 예제 페이지.
 *      SDS DataTable과 비교 가능한 구조로 구현됩니다.
 *
 * TanStackTableBasicPage Component
 * - @tanstack/react-table v8 사용
 * - 정렬, 필터, 페이지네이션 기능
 * - SDS 스타일 적용
 */

import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, Table } from "lucide-react";

import { Card, CardBody } from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { Input } from "@core/components/ui/Input";
import { PageHeader } from "@core/components/layout/PageHeader";
import { cn } from "@core/utils/classUtils";

// ========================================
// Types
// ========================================

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
  createdAt: string;
}

// ========================================
// Mock Data
// ========================================

const MOCK_PRODUCTS: Product[] = [
  {
    id: "PROD001",
    name: "노트북 프로 15",
    category: "전자기기",
    price: 1500000,
    stock: 45,
    status: "IN_STOCK",
    createdAt: "2024-01-15",
  },
  {
    id: "PROD002",
    name: "무선 마우스",
    category: "액세서리",
    price: 35000,
    stock: 120,
    status: "IN_STOCK",
    createdAt: "2024-02-20",
  },
  {
    id: "PROD003",
    name: "기계식 키보드",
    category: "액세서리",
    price: 89000,
    stock: 8,
    status: "LOW_STOCK",
    createdAt: "2024-01-10",
  },
  {
    id: "PROD004",
    name: "27인치 모니터",
    category: "전자기기",
    price: 450000,
    stock: 0,
    status: "OUT_OF_STOCK",
    createdAt: "2023-12-05",
  },
  {
    id: "PROD005",
    name: "USB 허브",
    category: "액세서리",
    price: 25000,
    stock: 200,
    status: "IN_STOCK",
    createdAt: "2024-03-01",
  },
  {
    id: "PROD006",
    name: "웹캠 HD",
    category: "전자기기",
    price: 78000,
    stock: 35,
    status: "IN_STOCK",
    createdAt: "2024-02-15",
  },
  {
    id: "PROD007",
    name: "노트북 스탠드",
    category: "액세서리",
    price: 45000,
    stock: 5,
    status: "LOW_STOCK",
    createdAt: "2024-01-25",
  },
  {
    id: "PROD008",
    name: "블루투스 스피커",
    category: "전자기기",
    price: 120000,
    stock: 0,
    status: "OUT_OF_STOCK",
    createdAt: "2024-02-28",
  },
  {
    id: "PROD009",
    name: "마우스 패드",
    category: "액세서리",
    price: 15000,
    stock: 500,
    status: "IN_STOCK",
    createdAt: "2024-03-10",
  },
  {
    id: "PROD010",
    name: "태블릿 펜",
    category: "액세서리",
    price: 55000,
    stock: 28,
    status: "IN_STOCK",
    createdAt: "2024-02-05",
  },
];

// ========================================
// Status Badge
// ========================================

const getStatusBadge = (status: Product["status"]) => {
  const statusMap = {
    IN_STOCK: { label: "재고있음", variant: "success" as const },
    LOW_STOCK: { label: "재고부족", variant: "warning" as const },
    OUT_OF_STOCK: { label: "품절", variant: "danger" as const },
  };

  const config = statusMap[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

// ========================================
// TanStackTableBasicPage Component
// ========================================

export const TanStackTableBasicPage: React.FC = () => {
  const [data] = useState<Product[]>(MOCK_PRODUCTS);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Column Definitions
  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: "id",
        header: "상품코드",
        cell: (info) => (
          <span className="font-medium text-softone-text">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            상품명
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => info.getValue<string>(),
      },
      {
        accessorKey: "category",
        header: "카테고리",
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            가격
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => `₩${info.getValue<number>().toLocaleString()}`,
      },
      {
        accessorKey: "stock",
        header: ({ column }) => (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            재고
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: (info) => info.getValue<number>().toLocaleString(),
      },
      {
        accessorKey: "status",
        header: "상태",
        cell: (info) => getStatusBadge(info.getValue<Product["status"]>()),
      },
      {
        accessorKey: "createdAt",
        header: "등록일",
      },
    ],
    []
  );

  // Table Instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="TanStack Table 기본 예제"
        subtitle="@tanstack/react-table v8을 사용한 Headless 테이블 구현 예제입니다."
        icon={<Table className="w-5 h-5 text-softone-primary" />}
      />

      {/* Filter */}
      <Card>
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="flex-1 max-w-sm">
              <Input
                placeholder="전체 검색..."
                value={globalFilter ?? ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                fullWidth
              />
            </div>
            <div className="text-sm text-softone-text-muted">
              총 {table.getFilteredRowModel().rows.length}개 상품
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="bg-softone-bg border-b border-softone-border"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-softone-text-secondary"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-softone-surface divide-y divide-softone-border">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-12 text-center text-softone-text-muted"
                    >
                      데이터가 없습니다
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className={cn(
                        "transition-colors hover:bg-softone-surface-hover",
                        index % 2 === 1 && "bg-softone-bg/50"
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-4 py-3 text-sm text-softone-text"
                        >
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
          </div>
        </CardBody>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-softone-text-muted">
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}
          -
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          / {table.getFilteredRowModel().rows.length}개
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-softone-text">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Comparison Info */}
      <Card>
        <CardBody>
          <h3 className="text-sm font-medium text-softone-text mb-3">
            TanStack Table vs SDS DataTable
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-softone-text-secondary">
            <div>
              <h4 className="font-medium text-softone-text mb-2">TanStack Table</h4>
              <ul className="space-y-1">
                <li>• Headless UI - 완전한 커스터마이징</li>
                <li>• 가상화, 무한 스크롤 지원</li>
                <li>• 복잡한 데이터 조작에 적합</li>
                <li>• 학습 곡선이 있음</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-softone-text mb-2">SDS DataTable</h4>
              <ul className="space-y-1">
                <li>• 즉시 사용 가능한 스타일</li>
                <li>• 단순한 API</li>
                <li>• 일반적인 리스트에 적합</li>
                <li>• SDS 디자인 토큰 적용</li>
              </ul>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

TanStackTableBasicPage.displayName = "TanStackTableBasicPage";

export default TanStackTableBasicPage;

