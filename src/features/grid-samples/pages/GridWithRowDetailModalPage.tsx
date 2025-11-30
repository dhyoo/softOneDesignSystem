/**
 * SoftOne Design System - GridWithRowDetailModalPage (Step 10)
 * 작성: SoftOne Frontend Team
 *
 * [목적]
 * - Grid 행 더블클릭 시 BaseModal/FormDialog로 상세 정보 표시
 * - Modal 내부에서 서브 그리드나 상세 데이터 렌더링 예시
 * - ag-Grid와 Dialog 시스템 통합 패턴 시연
 *
 * [A11y 고려]
 * - 더블클릭 외에도 Enter 키로 상세 보기 가능
 * - 모달 내 포커스 트랩 적용
 */

import React, { useState, useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  type ColDef,
  type RowDoubleClickedEvent,
  type CellKeyDownEvent,
} from "ag-grid-community";
import { Grid, Eye, Package, TrendingUp, Calendar } from "lucide-react";

import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  BaseModal,
  Tabs,
} from "@core/components/ui";
import { useToast } from "@core/hooks/useToast";
import { cn } from "@core/utils/classUtils";

// AG Grid Styles
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

// ========================================
// Types
// ========================================

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  totalAmount: number;
  shippingAddress: string;
  items: OrderItem[];
  notes?: string;
}

// ========================================
// Mock Data
// ========================================

const generateOrders = (): Order[] => {
  const statuses: Order["status"][] = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];
  const products = [
    { id: "P001", name: "노트북", price: 1500000 },
    { id: "P002", name: "모니터", price: 450000 },
    { id: "P003", name: "키보드", price: 150000 },
    { id: "P004", name: "마우스", price: 80000 },
    { id: "P005", name: "헤드셋", price: 200000 },
  ];

  return Array.from({ length: 30 }, (_, i) => {
    const itemCount = (i % 4) + 1;
    const items: OrderItem[] = Array.from({ length: itemCount }, (_, j) => {
      const product = products[(i + j) % products.length];
      const quantity = ((i + j) % 3) + 1;
      return {
        productId: product.id,
        productName: product.name,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);

    return {
      id: `order-${i + 1}`,
      orderNumber: `ORD-${String(2024001 + i).padStart(7, "0")}`,
      customerName: `고객 ${i + 1}`,
      customerEmail: `customer${i + 1}@example.com`,
      orderDate: new Date(Date.now() - i * 86400000 * 2)
        .toISOString()
        .split("T")[0],
      status: statuses[i % statuses.length],
      totalAmount,
      shippingAddress: `서울시 강남구 테헤란로 ${100 + i}`,
      items,
      notes: i % 3 === 0 ? `주문 ${i + 1}에 대한 특별 요청사항` : undefined,
    };
  });
};

// ========================================
// Status Badge
// ========================================

const StatusBadge: React.FC<{ status: Order["status"] }> = ({ status }) => {
  const config: Record<
    Order["status"],
    {
      variant: "warning" | "info" | "success" | "danger" | "neutral";
      label: string;
    }
  > = {
    PENDING: { variant: "warning", label: "대기" },
    PROCESSING: { variant: "info", label: "처리중" },
    SHIPPED: { variant: "info", label: "배송중" },
    DELIVERED: { variant: "success", label: "배송완료" },
    CANCELLED: { variant: "danger", label: "취소" },
  };

  const { variant, label } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
};

// ========================================
// Order Detail Modal Content
// ========================================

interface OrderDetailModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  // 상품 목록 컬럼 정의
  const itemColumns: ColDef<OrderItem>[] = useMemo(
    () => [
      {
        field: "productId",
        headerName: "상품코드",
        width: 100,
      },
      {
        field: "productName",
        headerName: "상품명",
        flex: 1,
      },
      {
        field: "quantity",
        headerName: "수량",
        width: 80,
        type: "numericColumn",
      },
      {
        field: "unitPrice",
        headerName: "단가",
        width: 120,
        type: "numericColumn",
        valueFormatter: (params) =>
          params.value?.toLocaleString("ko-KR") + "원",
      },
      {
        field: "totalPrice",
        headerName: "금액",
        width: 120,
        type: "numericColumn",
        valueFormatter: (params) =>
          params.value?.toLocaleString("ko-KR") + "원",
      },
    ],
    []
  );

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={`주문 상세 - ${order.orderNumber}`}
      size="xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            닫기
          </Button>
          <Button variant="primary">주문 수정</Button>
        </>
      }
    >
      <Tabs defaultValue="info">
        <Tabs.List>
          <Tabs.Trigger value="info">주문 정보</Tabs.Trigger>
          <Tabs.Trigger value="items">
            상품 목록 ({order.items.length})
          </Tabs.Trigger>
          <Tabs.Trigger value="shipping">배송 정보</Tabs.Trigger>
        </Tabs.List>

        {/* 주문 정보 탭 */}
        <Tabs.Content value="info" className="pt-4">
          <div className="grid grid-cols-2 gap-6">
            {/* 주문 요약 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">주문 요약</CardTitle>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-softone-text-secondary">주문번호</span>
                  <span className="font-medium">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-softone-text-secondary">주문일</span>
                  <span>{order.orderDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-softone-text-secondary">상태</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-softone-text-secondary font-medium">
                    총 금액
                  </span>
                  <span className="text-lg font-bold text-softone-primary">
                    {order.totalAmount.toLocaleString("ko-KR")}원
                  </span>
                </div>
              </CardBody>
            </Card>

            {/* 고객 정보 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">고객 정보</CardTitle>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-softone-text-secondary">고객명</span>
                  <span className="font-medium">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-softone-text-secondary">이메일</span>
                  <span>{order.customerEmail}</span>
                </div>
                {order.notes && (
                  <div className="pt-2 border-t">
                    <span className="text-softone-text-secondary text-sm">
                      요청사항
                    </span>
                    <p className="mt-1 text-sm bg-softone-bg p-2 rounded">
                      {order.notes}
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 text-blue-600">
                <Package className="w-5 h-5" />
                <span className="text-sm font-medium">상품 종류</span>
              </div>
              <p className="text-2xl font-bold text-blue-700 mt-1">
                {order.items.length}개
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm font-medium">총 수량</span>
              </div>
              <p className="text-2xl font-bold text-green-700 mt-1">
                {order.items.reduce((sum, i) => sum + i.quantity, 0)}개
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 text-purple-600">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">주문일</span>
              </div>
              <p className="text-2xl font-bold text-purple-700 mt-1">
                {order.orderDate}
              </p>
            </div>
          </div>
        </Tabs.Content>

        {/* 상품 목록 탭 */}
        <Tabs.Content value="items" className="pt-4">
          <div className="ag-theme-alpine" style={{ height: 300 }}>
            <AgGridReact<OrderItem>
              rowData={order.items}
              columnDefs={itemColumns}
              domLayout="normal"
              headerHeight={40}
              rowHeight={40}
              suppressRowClickSelection
            />
          </div>
          <div className="flex justify-end mt-4 p-4 bg-softone-bg rounded-lg">
            <div className="text-right">
              <span className="text-softone-text-secondary">총 주문 금액</span>
              <p className="text-2xl font-bold text-softone-primary">
                {order.totalAmount.toLocaleString("ko-KR")}원
              </p>
            </div>
          </div>
        </Tabs.Content>

        {/* 배송 정보 탭 */}
        <Tabs.Content value="shipping" className="pt-4">
          <Card>
            <CardBody className="space-y-4">
              <div>
                <label className="text-sm text-softone-text-secondary">
                  배송 주소
                </label>
                <p className="text-softone-text font-medium mt-1">
                  {order.shippingAddress}
                </p>
              </div>
              <div>
                <label className="text-sm text-softone-text-secondary">
                  배송 상태
                </label>
                <div className="mt-2">
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* 배송 진행 타임라인 */}
              <div className="pt-4 border-t">
                <label className="text-sm text-softone-text-secondary mb-3 block">
                  배송 진행 상황
                </label>
                <div className="space-y-3">
                  {[
                    { status: "주문 접수", done: true },
                    { status: "결제 완료", done: true },
                    {
                      status: "상품 준비중",
                      done: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(
                        order.status
                      ),
                    },
                    {
                      status: "배송중",
                      done: ["SHIPPED", "DELIVERED"].includes(order.status),
                    },
                    { status: "배송 완료", done: order.status === "DELIVERED" },
                  ].map((step, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          step.done
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-500"
                        )}
                      >
                        {step.done ? "✓" : index + 1}
                      </div>
                      <span
                        className={cn(
                          step.done
                            ? "text-softone-text"
                            : "text-softone-text-muted"
                        )}
                      >
                        {step.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </Tabs.Content>
      </Tabs>
    </BaseModal>
  );
};

// ========================================
// Main Page Component
// ========================================

export const GridWithRowDetailModalPage: React.FC = () => {
  // ========================================
  // State
  // ========================================
  const [orders] = useState<Order[]>(generateOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gridRef = useRef<AgGridReact<Order>>(null);

  const toast = useToast();

  // ========================================
  // Column Definitions
  // ========================================

  const columnDefs: ColDef<Order>[] = useMemo(
    () => [
      {
        field: "orderNumber",
        headerName: "주문번호",
        width: 150,
        pinned: "left",
      },
      {
        field: "customerName",
        headerName: "고객명",
        width: 120,
      },
      {
        field: "orderDate",
        headerName: "주문일",
        width: 120,
      },
      {
        field: "status",
        headerName: "상태",
        width: 100,
        cellRenderer: (params: { value: Order["status"] }) => {
          const config: Record<
            Order["status"],
            { bg: string; text: string; label: string }
          > = {
            PENDING: {
              bg: "bg-yellow-100",
              text: "text-yellow-800",
              label: "대기",
            },
            PROCESSING: {
              bg: "bg-blue-100",
              text: "text-blue-800",
              label: "처리중",
            },
            SHIPPED: {
              bg: "bg-indigo-100",
              text: "text-indigo-800",
              label: "배송중",
            },
            DELIVERED: {
              bg: "bg-green-100",
              text: "text-green-800",
              label: "완료",
            },
            CANCELLED: {
              bg: "bg-red-100",
              text: "text-red-800",
              label: "취소",
            },
          };
          const { bg, text, label } = config[params.value];
          return (
            <span
              className={cn("px-2 py-1 rounded text-xs font-medium", bg, text)}
            >
              {label}
            </span>
          );
        },
      },
      {
        field: "items",
        headerName: "상품수",
        width: 80,
        valueGetter: (params) => params.data?.items.length,
        type: "numericColumn",
      },
      {
        field: "totalAmount",
        headerName: "주문금액",
        width: 130,
        type: "numericColumn",
        valueFormatter: (params) =>
          params.value?.toLocaleString("ko-KR") + "원",
      },
      {
        field: "shippingAddress",
        headerName: "배송주소",
        flex: 1,
        minWidth: 200,
      },
      {
        headerName: "액션",
        width: 100,
        pinned: "right",
        cellRenderer: (params: { data: Order | undefined }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (params.data) {
                setSelectedOrder(params.data);
                setIsModalOpen(true);
              }
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
        ),
      },
    ],
    []
  );

  // ========================================
  // Handlers
  // ========================================

  const handleRowDoubleClick = useCallback(
    (event: RowDoubleClickedEvent<Order>) => {
      if (event.data) {
        setSelectedOrder(event.data);
        setIsModalOpen(true);
        toast.info(`${event.data.orderNumber} 상세 정보를 엽니다.`);
      }
    },
    [toast]
  );

  const handleCellKeyDown = useCallback((event: CellKeyDownEvent<Order>) => {
    if (event.event && (event.event as KeyboardEvent).key === "Enter") {
      if (event.data) {
        setSelectedOrder(event.data);
        setIsModalOpen(true);
      }
    }
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  }, []);

  // ========================================
  // Render
  // ========================================

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="그리드 행 상세 모달"
        subtitle="행을 더블클릭하거나 Enter를 누르면 상세 정보 모달이 열립니다."
        icon={<Grid className="w-5 h-5 text-softone-primary" />}
      />

      {/* Instructions */}
      <Card>
        <CardBody className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Eye className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-softone-text">사용 방법</h3>
            <p className="text-sm text-softone-text-secondary">
              행을 <strong>더블클릭</strong>하거나 행 선택 후{" "}
              <strong>Enter 키</strong>를 누르면 상세 모달이 열립니다. 또는 우측
              눈 아이콘을 클릭하세요.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Orders Grid */}
      <Card>
        <CardBody className="p-0">
          <div className="ag-theme-alpine" style={{ height: 600 }}>
            <AgGridReact<Order>
              ref={gridRef}
              rowData={orders}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                filter: true,
                resizable: true,
              }}
              rowSelection="single"
              onRowDoubleClicked={handleRowDoubleClick}
              onCellKeyDown={handleCellKeyDown}
              animateRows
              pagination
              paginationPageSize={15}
              suppressCellFocus={false}
            />
          </div>
        </CardBody>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default GridWithRowDetailModalPage;
