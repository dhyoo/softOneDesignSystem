/**
 * SoftOne Design System - Multi Grid Tabs Page
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – Store Isolation 및 백엔드 Mock 연동을 통한 실제 운영 패턴 검증:
 *   Tabs 구조에서 각 탭(사용자/주문)이 독립적인 Zustand Store를 사용하여
 *   상태 간섭 없이 Pagination, Sort, Filter를 관리하는 패턴을 시연합니다.
 *
 *   핵심 포인트:
 *   - 탭 전환 시 각 그리드의 상태(페이지, 정렬, 필터)가 유지됨
 *   - userGridStore와 orderGridStore가 완전히 분리됨
 */

import React, { useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ValueFormatterParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "@core/components/ui/Card";
import { Tabs } from "@core/components/ui/Tabs";
import { Badge } from "@core/components/ui/Badge";
import { Pagination } from "@core/components/ui/Pagination";
import { Input } from "@core/components/ui/Input";
import { Button } from "@core/components/ui/Button";
import { Layers, Users, ShoppingCart, RefreshCw } from "lucide-react";

import { useUserGridStore, type UserGridData } from "../store/userGridStore";
import { useOrderGridStore, type OrderGridData } from "../store/orderGridStore";
import {
  useUserGridDataQuery,
  useOrderGridDataQuery,
} from "../api/gridSampleApi";
import { formatCellCurrency, formatCellDate } from "@core/utils/gridUtils";

// ========================================
// User Grid Component
// ========================================

const UserGrid: React.FC = () => {
  const {
    pagination,
    filters,
    setPage,
    setFilters,
    clearFilters,
    setPagination,
  } = useUserGridStore();

  const keywordFilter =
    (filters.find((f) => f.field === "keyword")?.value as string) || "";

  // 데이터 로딩
  const { data, isLoading, refetch } = useUserGridDataQuery({
    page: pagination.page,
    pageSize: pagination.pageSize,
    keyword: keywordFilter,
  });

  // Total 업데이트
  React.useEffect(() => {
    if (data?.total !== undefined) {
      setPagination({ total: data.total });
    }
  }, [data?.total, setPagination]);

  // 컬럼 정의
  const columnDefs: ColDef<UserGridData>[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 100 },
      { field: "name", headerName: "이름", flex: 1 },
      { field: "email", headerName: "이메일", flex: 1.5 },
      { field: "department", headerName: "부서", width: 120 },
      { field: "position", headerName: "직급", width: 100 },
      {
        field: "status",
        headerName: "상태",
        width: 100,
        cellRenderer: (params: { value: string }) => {
          const variant =
            params.value === "ACTIVE"
              ? "success"
              : params.value === "INACTIVE"
              ? "neutral"
              : "warning";
          return <Badge variant={variant}>{params.value}</Badge>;
        },
      },
      {
        field: "createdAt",
        headerName: "등록일",
        width: 120,
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellDate(params.value),
      },
    ],
    []
  );

  const handleSearch = useCallback(
    (keyword: string) => {
      if (keyword) {
        setFilters([
          { field: "keyword", operator: "contains", value: keyword },
        ]);
      } else {
        clearFilters();
      }
    },
    [setFilters, clearFilters]
  );

  return (
    <div className="space-y-4">
      {/* 필터 영역 */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-xs">
          <Input
            placeholder="이름, 이메일 검색..."
            defaultValue={keywordFilter as string}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch((e.target as HTMLInputElement).value);
              }
            }}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => {
            clearFilters();
            refetch();
          }}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          초기화
        </Button>
      </div>

      {/* 상태 표시 */}
      <div className="flex items-center gap-4 text-sm text-softone-text-muted">
        <span>
          페이지: {pagination.page} / 정렬:{" "}
          {filters.length > 0 ? "적용됨" : "없음"}
        </span>
        <Badge variant="info">총 {data?.total || 0}건</Badge>
      </div>

      {/* 그리드 */}
      <div className="ag-theme-alpine" style={{ height: 400 }}>
        <AgGridReact
          rowData={data?.data || []}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, resizable: true }}
          loading={isLoading}
          getRowId={(params) => params.data.id}
          animateRows
        />
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center">
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total || 0}
          onChange={setPage}
        />
      </div>
    </div>
  );
};

// ========================================
// Order Grid Component
// ========================================

const OrderGrid: React.FC = () => {
  const {
    pagination,
    filters,
    setPage,
    setFilters,
    clearFilters,
    setPagination,
  } = useOrderGridStore();

  const statusFilter =
    (filters.find((f) => f.field === "status")?.value as string) || "";

  // 데이터 로딩
  const { data, isLoading, refetch } = useOrderGridDataQuery({
    page: pagination.page,
    pageSize: pagination.pageSize,
    status: statusFilter,
  });

  // Total 업데이트
  React.useEffect(() => {
    if (data?.total !== undefined) {
      setPagination({ total: data.total });
    }
  }, [data?.total, setPagination]);

  // 컬럼 정의
  const columnDefs: ColDef<OrderGridData>[] = useMemo(
    () => [
      { field: "orderNo", headerName: "주문번호", width: 130 },
      { field: "customerName", headerName: "고객명", flex: 1 },
      { field: "productName", headerName: "상품명", flex: 1.5 },
      {
        field: "quantity",
        headerName: "수량",
        width: 80,
        type: "numericColumn",
      },
      {
        field: "totalAmount",
        headerName: "총액",
        width: 130,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellCurrency(params.value),
      },
      {
        field: "status",
        headerName: "상태",
        width: 110,
        cellRenderer: (params: { value: string }) => {
          const variantMap: Record<
            string,
            "success" | "warning" | "info" | "danger" | "neutral"
          > = {
            PENDING: "warning",
            PROCESSING: "info",
            SHIPPED: "info",
            DELIVERED: "success",
            CANCELLED: "danger",
          };
          return (
            <Badge variant={variantMap[params.value] || "neutral"}>
              {params.value}
            </Badge>
          );
        },
      },
      {
        field: "orderDate",
        headerName: "주문일",
        width: 120,
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellDate(params.value),
      },
    ],
    []
  );

  const handleStatusFilter = useCallback(
    (status: string) => {
      if (status) {
        setFilters([{ field: "status", operator: "eq", value: status }]);
      } else {
        clearFilters();
      }
    },
    [setFilters, clearFilters]
  );

  return (
    <div className="space-y-4">
      {/* 필터 영역 */}
      <div className="flex items-center gap-4">
        <div className="flex gap-2">
          {["", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].map(
            (status) => (
              <Button
                key={status}
                variant={statusFilter === status ? "primary" : "outline"}
                size="sm"
                onClick={() => handleStatusFilter(status)}
              >
                {status || "전체"}
              </Button>
            )
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => {
            clearFilters();
            refetch();
          }}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          초기화
        </Button>
      </div>

      {/* 상태 표시 */}
      <div className="flex items-center gap-4 text-sm text-softone-text-muted">
        <span>
          페이지: {pagination.page} / 필터:{" "}
          {filters.length > 0 ? String(filters[0].value) : "없음"}
        </span>
        <Badge variant="info">총 {data?.total || 0}건</Badge>
      </div>

      {/* 그리드 */}
      <div className="ag-theme-alpine" style={{ height: 400 }}>
        <AgGridReact
          rowData={data?.data || []}
          columnDefs={columnDefs}
          defaultColDef={{ sortable: true, resizable: true }}
          loading={isLoading}
          getRowId={(params) => params.data.id}
          animateRows
        />
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center">
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total || 0}
          onChange={setPage}
        />
      </div>
    </div>
  );
};

// ========================================
// Main Page Component
// ========================================

export const MultiGridTabsPage: React.FC = () => {
  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="Multi-Grid Tabs (Store Isolation)"
        subtitle="탭별로 독립적인 Zustand Store를 사용하여 상태 간섭을 방지합니다."
        icon={<Layers className="w-5 h-5 text-softone-primary" />}
      />

      {/* 설명 */}
      <Card>
        <CardBody className="text-sm text-softone-text-secondary">
          <p>
            <strong>Store Isolation 패턴:</strong> "사용자" 탭과 "주문" 탭이
            각각 독립적인 Zustand Store(<code>userGridStore</code>,{" "}
            <code>orderGridStore</code>)를 사용합니다. 탭을 전환해도 각 그리드의
            페이지, 필터, 정렬 상태가 유지됩니다.
          </p>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="users">
        <Tabs.List>
          <Tabs.Trigger value="users">
            <span className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              사용자
            </span>
          </Tabs.Trigger>
          <Tabs.Trigger value="orders">
            <span className="flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2" />
              주문
            </span>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="users">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                사용자 목록 (userGridStore)
              </CardTitle>
            </CardHeader>
            <CardBody>
              <UserGrid />
            </CardBody>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="orders">
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                주문 목록 (orderGridStore)
              </CardTitle>
            </CardHeader>
            <CardBody>
              <OrderGrid />
            </CardBody>
          </Card>
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

MultiGridTabsPage.displayName = "MultiGridTabsPage";
