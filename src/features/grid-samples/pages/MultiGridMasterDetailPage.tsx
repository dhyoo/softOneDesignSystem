/**
 * SoftOne Design System - Multi-Grid Master-Detail Page
 * 작성: SoftOne Frontend Team
 *
 * 멀티 그리드 연동 예제:
 *   - 3개의 그리드가 하나의 화면에서 연동
 *   - 카테고리(마스터) → 상품(디테일) → 주문(서브디테일)
 *   - Zustand Store로 전역 상태 관리
 *   - 선택 상태, 필터, 요약 통계 공유
 */

import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  RowClickedEvent,
  RowSelectedEvent,
  ValueFormatterParams,
  ICellRendererParams,
  GridReadyEvent,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

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
import { useToast } from "@core/hooks/useToast";
import {
  Layers,
  Package,
  ShoppingCart,
  Search,
  RefreshCw,
  CheckSquare,
  XSquare,
  BarChart3,
} from "lucide-react";

import {
  useMasterDetailStore,
  generateMockCategories,
  generateMockProducts,
  generateMockOrders,
  type Category,
  type Product,
  type Order,
} from "../store/masterDetailStore";
import { formatCellCurrency, formatCellDate } from "@core/utils/gridUtils";

// ========================================
// MultiGridMasterDetailPage Component
// ========================================

export const MultiGridMasterDetailPage: React.FC = () => {
  const toast = useToast();

  // Store 상태 및 액션
  const {
    categories,
    selectedCategory,
    products,
    selectedProducts,
    orders,
    selectedOrder,
    globalFilter,
    isLoadingCategories,
    isLoadingProducts,
    isLoadingOrders,
    summary,
    setCategories,
    selectCategory,
    setProducts,
    toggleProductSelection,
    selectAllProducts,
    clearProductSelection,
    setOrders,
    selectOrder,
    setGlobalFilter,
    resetGlobalFilter,
    setLoadingCategories,
    setLoadingProducts,
    setLoadingOrders,
    getFilteredProducts,
    resetAll,
  } = useMasterDetailStore();

  // StrictMode 중복 방지용 ref
  const isDataLoadedRef = useRef(false);
  const loadingRef = useRef(false);

  const loadData = useCallback(() => {
    // 이미 로딩 중이면 중복 실행 방지
    if (loadingRef.current) return;
    loadingRef.current = true;

    setLoadingCategories(true);
    setLoadingProducts(true);
    setLoadingOrders(true);

    // 데이터 생성 시뮬레이션
    setTimeout(() => {
      const mockCategories = generateMockCategories();
      setCategories(mockCategories);
      setLoadingCategories(false);

      const mockProducts = generateMockProducts(mockCategories);
      setProducts(mockProducts);
      setLoadingProducts(false);

      const mockOrders = generateMockOrders(mockProducts);
      setOrders(mockOrders);
      setLoadingOrders(false);

      loadingRef.current = false;
      toast.success("데이터가 로드되었습니다.");
    }, 500);
  }, [
    setCategories,
    setProducts,
    setOrders,
    setLoadingCategories,
    setLoadingProducts,
    setLoadingOrders,
    toast,
  ]);

  // 데이터 로드
  useEffect(() => {
    if (!isDataLoadedRef.current) {
      isDataLoadedRef.current = true;
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 새로고침
  const handleRefresh = useCallback(() => {
    resetAll();
    loadData();
  }, [resetAll, loadData]);

  // 필터된 상품 목록
  const filteredProducts = useMemo(
    () => getFilteredProducts(),
    [getFilteredProducts, products, selectedCategory, globalFilter]
  );

  // 선택된 상품의 주문 목록
  const relatedOrders = useMemo(() => {
    if (selectedProducts.length === 0) return orders;
    const productIds = new Set(selectedProducts.map((p) => p.id));
    return orders.filter((o) => productIds.has(o.productId));
  }, [orders, selectedProducts]);

  // ========================================
  // 카테고리 그리드 컬럼
  // ========================================
  const categoryColumns: ColDef<Category>[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 100,
        cellClass: "font-mono text-xs",
      },
      {
        field: "name",
        headerName: "카테고리명",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "productCount",
        headerName: "상품수",
        width: 90,
        type: "numericColumn",
      },
      {
        field: "totalRevenue",
        headerName: "총 매출",
        width: 120,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellCurrency(params.value),
      },
      {
        field: "status",
        headerName: "상태",
        width: 90,
        cellRenderer: (params: ICellRendererParams<Category>) => (
          <Badge
            variant={params.value === "ACTIVE" ? "success" : "neutral"}
            size="sm"
          >
            {params.value === "ACTIVE" ? "활성" : "비활성"}
          </Badge>
        ),
      },
    ],
    []
  );

  // ========================================
  // 상품 그리드 컬럼
  // ========================================
  const productColumns: ColDef<Product>[] = useMemo(
    () => [
      {
        headerName: "",
        width: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
      },
      {
        field: "code",
        headerName: "상품코드",
        width: 110,
        cellClass: "font-mono text-xs",
      },
      {
        field: "name",
        headerName: "상품명",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "price",
        headerName: "가격",
        width: 110,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellCurrency(params.value),
      },
      {
        field: "stock",
        headerName: "재고",
        width: 80,
        type: "numericColumn",
      },
      {
        field: "status",
        headerName: "상태",
        width: 100,
        cellRenderer: (params: ICellRendererParams<Product>) => {
          const statusMap: Record<
            Product["status"],
            { label: string; variant: "success" | "warning" | "danger" }
          > = {
            AVAILABLE: { label: "판매중", variant: "success" },
            OUT_OF_STOCK: { label: "품절", variant: "warning" },
            DISCONTINUED: { label: "단종", variant: "danger" },
          };
          const config = statusMap[params.value as Product["status"]];
          return (
            <Badge variant={config?.variant || "neutral"} size="sm">
              {config?.label || params.value}
            </Badge>
          );
        },
      },
    ],
    []
  );

  // ========================================
  // 주문 그리드 컬럼
  // ========================================
  const orderColumns: ColDef<Order>[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "주문번호",
        width: 120,
        cellClass: "font-mono text-xs",
      },
      {
        field: "customerName",
        headerName: "고객명",
        flex: 1,
        minWidth: 100,
      },
      {
        field: "quantity",
        headerName: "수량",
        width: 70,
        type: "numericColumn",
      },
      {
        field: "totalPrice",
        headerName: "총액",
        width: 110,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellCurrency(params.value),
      },
      {
        field: "orderDate",
        headerName: "주문일",
        width: 100,
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellDate(params.value),
      },
      {
        field: "status",
        headerName: "상태",
        width: 90,
        cellRenderer: (params: ICellRendererParams<Order>) => {
          const statusMap: Record<
            Order["status"],
            { label: string; variant: "success" | "warning" | "danger" }
          > = {
            COMPLETED: { label: "완료", variant: "success" },
            PENDING: { label: "대기", variant: "warning" },
            CANCELLED: { label: "취소", variant: "danger" },
          };
          const config = statusMap[params.value as Order["status"]];
          return (
            <Badge variant={config?.variant || "neutral"} size="sm">
              {config?.label || params.value}
            </Badge>
          );
        },
      },
    ],
    []
  );

  // ========================================
  // 이벤트 핸들러
  // ========================================
  const handleCategoryRowClicked = useCallback(
    (event: RowClickedEvent<Category>) => {
      if (event.data) {
        selectCategory(event.data);
        toast.info(`카테고리 "${event.data.name}" 선택됨`);
      }
    },
    [selectCategory, toast]
  );

  const handleProductSelectionChanged = useCallback(
    (event: RowSelectedEvent<Product>) => {
      if (event.data) {
        toggleProductSelection(event.data);
      }
    },
    [toggleProductSelection]
  );

  const handleOrderRowClicked = useCallback(
    (event: RowClickedEvent<Order>) => {
      if (event.data) {
        selectOrder(event.data);
      }
    },
    [selectOrder]
  );

  // 그리드 준비 완료
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div className="space-y-4 sds-animate-fade-in">
      <PageHeader
        title="멀티 그리드 연동 (Master-Detail)"
        subtitle="카테고리 → 상품 → 주문 순서로 연동되는 3개의 그리드입니다. Zustand Store로 전역 상태를 관리합니다."
        icon={<Layers className="w-5 h-5 text-softone-primary" />}
      />

      {/* 요약 통계 + 필터 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 통계 카드 */}
        <Card>
          <CardBody className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-xs text-softone-text-muted">
                    카테고리
                  </div>
                  <div className="font-bold">{summary.totalCategories}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-green-500" />
                <div>
                  <div className="text-xs text-softone-text-muted">상품</div>
                  <div className="font-bold">{summary.totalProducts}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-xs text-softone-text-muted">주문</div>
                  <div className="font-bold">{summary.totalOrders}</div>
                </div>
              </div>
              {selectedProducts.length > 0 && (
                <div className="flex items-center gap-2 pl-4 border-l">
                  <CheckSquare className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="text-xs text-softone-text-muted">
                      선택 상품 가치
                    </div>
                    <div className="font-bold text-amber-600">
                      {formatCellCurrency(summary.selectedProductsValue)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              새로고침
            </Button>
          </CardBody>
        </Card>

        {/* 전역 필터 */}
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-softone-text-muted" />
              <Input
                placeholder="상품명 또는 코드로 검색..."
                value={globalFilter.searchKeyword}
                onChange={(e) =>
                  setGlobalFilter({ searchKeyword: e.target.value })
                }
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={
                  globalFilter.statusFilter.includes("AVAILABLE")
                    ? "primary"
                    : "outline"
                }
                size="sm"
                onClick={() => {
                  const current = globalFilter.statusFilter;
                  const newFilter = current.includes("AVAILABLE")
                    ? current.filter((s) => s !== "AVAILABLE")
                    : [...current, "AVAILABLE"];
                  setGlobalFilter({ statusFilter: newFilter });
                }}
              >
                판매중
              </Button>
              <Button
                variant={
                  globalFilter.statusFilter.includes("OUT_OF_STOCK")
                    ? "primary"
                    : "outline"
                }
                size="sm"
                onClick={() => {
                  const current = globalFilter.statusFilter;
                  const newFilter = current.includes("OUT_OF_STOCK")
                    ? current.filter((s) => s !== "OUT_OF_STOCK")
                    : [...current, "OUT_OF_STOCK"];
                  setGlobalFilter({ statusFilter: newFilter });
                }}
              >
                품절
              </Button>
              {(globalFilter.searchKeyword ||
                globalFilter.statusFilter.length > 0) && (
                <Button variant="ghost" size="sm" onClick={resetGlobalFilter}>
                  초기화
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 그리드 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 카테고리 그리드 (마스터) */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              카테고리 (마스터)
              {selectedCategory && (
                <Badge variant="info" size="sm">
                  선택: {selectedCategory.name}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="ag-theme-alpine" style={{ height: 350 }}>
              <AgGridReact
                rowData={categories}
                columnDefs={categoryColumns}
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                }}
                onGridReady={onGridReady}
                onRowClicked={handleCategoryRowClicked}
                rowSelection="single"
                loading={isLoadingCategories}
                getRowId={(params) => params.data.id}
                animateRows
                rowClass="cursor-pointer"
                getRowClass={(params) =>
                  params.data?.id === selectedCategory?.id
                    ? "bg-blue-50"
                    : undefined
                }
              />
            </div>
          </CardBody>
        </Card>

        {/* 상품 그리드 (디테일) */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-green-500" />
                상품 (디테일)
                <Badge variant="neutral" size="sm">
                  {filteredProducts.length}건
                </Badge>
                {selectedProducts.length > 0 && (
                  <Badge variant="success" size="sm">
                    {selectedProducts.length}개 선택
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={selectAllProducts}
                  leftIcon={<CheckSquare className="w-3 h-3" />}
                >
                  전체선택
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearProductSelection}
                  leftIcon={<XSquare className="w-3 h-3" />}
                >
                  선택해제
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="ag-theme-alpine" style={{ height: 350 }}>
              <AgGridReact
                rowData={filteredProducts}
                columnDefs={productColumns}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
                onGridReady={onGridReady}
                onRowSelected={handleProductSelectionChanged}
                rowSelection="multiple"
                loading={isLoadingProducts}
                getRowId={(params) => params.data.id}
                animateRows
                suppressRowClickSelection
              />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 주문 그리드 (서브 디테일) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-purple-500" />
            관련 주문 (서브 디테일)
            <Badge variant="neutral" size="sm">
              {relatedOrders.length}건
            </Badge>
            {selectedProducts.length > 0 && (
              <span className="text-xs font-normal text-softone-text-muted">
                - 선택된 상품의 주문만 표시
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="ag-theme-alpine" style={{ height: 250 }}>
            <AgGridReact
              rowData={relatedOrders}
              columnDefs={orderColumns}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
              }}
              onGridReady={onGridReady}
              onRowClicked={handleOrderRowClicked}
              rowSelection="single"
              loading={isLoadingOrders}
              getRowId={(params) => params.data.id}
              animateRows
              rowClass="cursor-pointer"
              getRowClass={(params) =>
                params.data?.id === selectedOrder?.id
                  ? "bg-purple-50"
                  : undefined
              }
            />
          </div>
        </CardBody>
      </Card>

      {/* Store 상태 시각화 */}
      <Card className="bg-slate-50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            🔍 Zustand Store 상태 (개발자용)
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <div className="font-semibold mb-1">선택된 카테고리</div>
              <pre className="bg-white p-2 rounded border overflow-auto max-h-32">
                {JSON.stringify(selectedCategory, null, 2) || "null"}
              </pre>
            </div>
            <div>
              <div className="font-semibold mb-1">
                선택된 상품 ({selectedProducts.length}개)
              </div>
              <pre className="bg-white p-2 rounded border overflow-auto max-h-32">
                {JSON.stringify(
                  selectedProducts.map((p) => ({ id: p.id, name: p.name })),
                  null,
                  2
                )}
              </pre>
            </div>
            <div>
              <div className="font-semibold mb-1">전역 필터</div>
              <pre className="bg-white p-2 rounded border overflow-auto max-h-32">
                {JSON.stringify(globalFilter, null, 2)}
              </pre>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

MultiGridMasterDetailPage.displayName = "MultiGridMasterDetailPage";
