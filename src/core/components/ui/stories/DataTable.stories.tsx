/**
 * SoftOne Design System(SDS) - DataTable Stories
 * 작성: SoftOne Frontend Team
 * 설명: DataTable 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { DataTable, type DataTableColumn } from "../DataTable";
import { Badge } from "../Badge";

const meta: Meta<typeof DataTable> = {
  title: "Core/UI/DataTable",
  component: DataTable,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
SoftOne Design System의 DataTable 컴포넌트입니다.

### 특징
- **제네릭 타입**: 어떤 데이터 타입도 지원
- **커스텀 렌더러**: column.render로 셀 커스터마이징
- **상태 표시**: 로딩, 빈 상태 자동 처리
- **스타일링**: zebra, hover, border 옵션

### 사용법
\`\`\`tsx
import { DataTable } from '@core/components/ui';

const columns = [
  { key: 'name', header: '이름' },
  { key: 'email', header: '이메일' },
];

<DataTable columns={columns} data={users} />
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
      description: "로딩 상태",
    },
    striped: {
      control: "boolean",
      description: "줄무늬 스타일",
    },
    hoverable: {
      control: "boolean",
      description: "호버 효과",
    },
    bordered: {
      control: "boolean",
      description: "테두리",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Sample Data
// ========================================

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
}

const sampleUsers: User[] = [
  { id: 1, name: "홍길동", email: "hong@example.com", role: "관리자", status: "ACTIVE", createdAt: "2024-01-15" },
  { id: 2, name: "김철수", email: "kim@example.com", role: "매니저", status: "ACTIVE", createdAt: "2024-01-20" },
  { id: 3, name: "이영희", email: "lee@example.com", role: "사용자", status: "INACTIVE", createdAt: "2024-02-01" },
  { id: 4, name: "박민수", email: "park@example.com", role: "사용자", status: "PENDING", createdAt: "2024-02-10" },
  { id: 5, name: "최수진", email: "choi@example.com", role: "매니저", status: "ACTIVE", createdAt: "2024-02-15" },
];

const basicColumns: DataTableColumn<User>[] = [
  { key: "id", header: "ID", width: 60, align: "center" },
  { key: "name", header: "이름" },
  { key: "email", header: "이메일" },
  { key: "role", header: "역할" },
  { key: "status", header: "상태" },
  { key: "createdAt", header: "가입일" },
];

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 DataTable
 */
export const Default: Story = {
  render: () => (
    <DataTable columns={basicColumns} data={sampleUsers} />
  ),
};

/**
 * 커스텀 렌더러
 */
export const WithCustomRenderers: Story = {
  render: () => {
    const columns: DataTableColumn<User>[] = [
      { key: "id", header: "ID", width: 60, align: "center" },
      { key: "name", header: "이름" },
      { key: "email", header: "이메일" },
      { key: "role", header: "역할" },
      {
        key: "status",
        header: "상태",
        render: (row) => {
          const variants: Record<string, "success" | "danger" | "warning"> = {
            ACTIVE: "success",
            INACTIVE: "danger",
            PENDING: "warning",
          };
          const labels: Record<string, string> = {
            ACTIVE: "활성",
            INACTIVE: "비활성",
            PENDING: "대기중",
          };
          return (
            <Badge variant={variants[row.status]}>
              {labels[row.status]}
            </Badge>
          );
        },
      },
      {
        key: "createdAt",
        header: "가입일",
        render: (row) => new Date(row.createdAt).toLocaleDateString("ko-KR"),
      },
    ];

    return <DataTable columns={columns} data={sampleUsers} />;
  },
};

// ========================================
// State Variants
// ========================================

/**
 * 로딩 상태
 */
export const Loading: Story = {
  render: () => (
    <DataTable columns={basicColumns} data={[]} loading />
  ),
};

/**
 * 빈 상태
 */
export const Empty: Story = {
  render: () => (
    <DataTable
      columns={basicColumns}
      data={[]}
      emptyMessage="등록된 사용자가 없습니다."
    />
  ),
};

/**
 * 커스텀 빈 상태 아이콘
 */
export const CustomEmptyIcon: Story = {
  render: () => (
    <DataTable
      columns={basicColumns}
      data={[]}
      emptyMessage="검색 결과가 없습니다."
      emptyIcon={
        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      }
    />
  ),
};

// ========================================
// Style Variants
// ========================================

/**
 * 줄무늬 없음
 */
export const NoStripes: Story = {
  render: () => (
    <DataTable columns={basicColumns} data={sampleUsers} striped={false} />
  ),
};

/**
 * 호버 없음
 */
export const NoHover: Story = {
  render: () => (
    <DataTable columns={basicColumns} data={sampleUsers} hoverable={false} />
  ),
};

/**
 * 테두리 없음
 */
export const NoBorder: Story = {
  render: () => (
    <DataTable columns={basicColumns} data={sampleUsers} bordered={false} />
  ),
};

/**
 * 최소 스타일
 */
export const MinimalStyle: Story = {
  render: () => (
    <DataTable
      columns={basicColumns}
      data={sampleUsers}
      striped={false}
      bordered={false}
    />
  ),
};

// ========================================
// Interactive Examples
// ========================================

/**
 * 행 클릭
 */
export const WithRowClick: Story = {
  render: () => {
    const handleRowClick = (row: User) => {
      alert(`선택: ${row.name} (${row.email})`);
    };

    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-500">행을 클릭해보세요</p>
        <DataTable
          columns={basicColumns}
          data={sampleUsers}
          onRowClick={handleRowClick}
        />
      </div>
    );
  },
};

// ========================================
// Column Alignment
// ========================================

/**
 * 컬럼 정렬
 */
export const ColumnAlignment: Story = {
  render: () => {
    interface Product {
      id: number;
      name: string;
      price: number;
      stock: number;
    }

    const products: Product[] = [
      { id: 1, name: "노트북", price: 1500000, stock: 10 },
      { id: 2, name: "마우스", price: 50000, stock: 100 },
      { id: 3, name: "키보드", price: 120000, stock: 50 },
    ];

    const columns: DataTableColumn<Product>[] = [
      { key: "id", header: "ID", width: 60, align: "center" },
      { key: "name", header: "상품명", align: "left" },
      {
        key: "price",
        header: "가격",
        align: "right",
        render: (row) => `₩${row.price.toLocaleString()}`,
      },
      {
        key: "stock",
        header: "재고",
        align: "right",
        render: (row) => `${row.stock}개`,
      },
    ];

    return <DataTable columns={columns} data={products} />;
  },
};

// ========================================
// Complex Examples
// ========================================

/**
 * 복합 예시 - 주문 목록
 */
export const OrderListExample: Story = {
  render: () => {
    interface Order {
      id: string;
      customer: string;
      product: string;
      quantity: number;
      total: number;
      status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
      date: string;
    }

    const orders: Order[] = [
      { id: "ORD-001", customer: "홍길동", product: "맥북 프로", quantity: 1, total: 2500000, status: "DELIVERED", date: "2024-03-01" },
      { id: "ORD-002", customer: "김철수", product: "아이패드", quantity: 2, total: 1800000, status: "SHIPPED", date: "2024-03-05" },
      { id: "ORD-003", customer: "이영희", product: "에어팟 프로", quantity: 3, total: 900000, status: "PROCESSING", date: "2024-03-10" },
      { id: "ORD-004", customer: "박민수", product: "애플워치", quantity: 1, total: 599000, status: "PENDING", date: "2024-03-12" },
    ];

    const statusConfig: Record<string, { label: string; variant: "success" | "info" | "warning" | "neutral" }> = {
      PENDING: { label: "대기중", variant: "warning" },
      PROCESSING: { label: "처리중", variant: "info" },
      SHIPPED: { label: "배송중", variant: "info" },
      DELIVERED: { label: "배송완료", variant: "success" },
    };

    const columns: DataTableColumn<Order>[] = [
      { key: "id", header: "주문번호", width: 100 },
      { key: "customer", header: "고객명" },
      { key: "product", header: "상품" },
      { key: "quantity", header: "수량", align: "center", width: 80 },
      {
        key: "total",
        header: "금액",
        align: "right",
        render: (row) => `₩${row.total.toLocaleString()}`,
      },
      {
        key: "status",
        header: "상태",
        render: (row) => (
          <Badge variant={statusConfig[row.status].variant}>
            {statusConfig[row.status].label}
          </Badge>
        ),
      },
      {
        key: "date",
        header: "주문일",
        render: (row) => new Date(row.date).toLocaleDateString("ko-KR"),
      },
    ];

    return <DataTable columns={columns} data={orders} />;
  },
};

/**
 * 액션 버튼 포함
 */
export const WithActions: Story = {
  render: () => {
    const columns: DataTableColumn<User>[] = [
      { key: "id", header: "ID", width: 60, align: "center" },
      { key: "name", header: "이름" },
      { key: "email", header: "이메일" },
      { key: "role", header: "역할" },
      {
        key: "actions",
        header: "액션",
        align: "center",
        render: (row) => (
          <div className="flex items-center justify-center gap-2">
            <button
              className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                alert(`수정: ${row.name}`);
              }}
            >
              수정
            </button>
            <button
              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
              onClick={(e) => {
                e.stopPropagation();
                alert(`삭제: ${row.name}`);
              }}
            >
              삭제
            </button>
          </div>
        ),
      },
    ];

    return <DataTable columns={columns} data={sampleUsers} />;
  },
};

