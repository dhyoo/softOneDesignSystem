/**
 * SoftOne Design System(SDS) - Pagination Stories
 * 작성: SoftOne Frontend Team
 * 설명: Pagination 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Pagination, PaginationInfo } from "../Pagination";

const meta: Meta<typeof Pagination> = {
  title: "Core/UI/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 Pagination 컴포넌트입니다.

### 특징
- **페이지 네비게이션**: 이전/다음 + 숫자 버튼
- **반응형**: 최대 버튼 수 설정 가능
- **첫/마지막 페이지 버튼**: showFirstLast prop
- **A11y**: aria-label, aria-current 적용

### 사용법
\`\`\`tsx
import { Pagination } from '@core/components/ui';

<Pagination
  page={currentPage}
  pageSize={10}
  total={100}
  onChange={setCurrentPage}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    page: {
      control: { type: "number", min: 1 },
      description: "현재 페이지",
    },
    pageSize: {
      control: { type: "number", min: 1 },
      description: "페이지당 항목 수",
    },
    total: {
      control: { type: "number", min: 0 },
      description: "전체 항목 수",
    },
    maxButtons: {
      control: { type: "number", min: 3, max: 10 },
      description: "최대 표시 버튼 수",
    },
    showFirstLast: {
      control: "boolean",
      description: "첫/마지막 버튼 표시",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 Pagination
 */
export const Default: Story = {
  args: {
    page: 1,
    pageSize: 10,
    total: 100,
    onChange: () => {},
  },
};

/**
 * 중간 페이지
 */
export const MiddlePage: Story = {
  args: {
    page: 5,
    pageSize: 10,
    total: 100,
    onChange: () => {},
  },
};

/**
 * 마지막 페이지
 */
export const LastPage: Story = {
  args: {
    page: 10,
    pageSize: 10,
    total: 100,
    onChange: () => {},
  },
};

// ========================================
// Variants
// ========================================

/**
 * 첫/마지막 버튼 숨김
 */
export const WithoutFirstLast: Story = {
  args: {
    page: 5,
    pageSize: 10,
    total: 100,
    showFirstLast: false,
    onChange: () => {},
  },
};

/**
 * 버튼 수 조정
 */
export const CustomMaxButtons: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">maxButtons=3</p>
        <Pagination page={5} pageSize={10} total={100} maxButtons={3} onChange={() => {}} />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">maxButtons=5 (기본)</p>
        <Pagination page={5} pageSize={10} total={100} maxButtons={5} onChange={() => {}} />
      </div>
      <div className="space-y-2">
        <p className="text-sm text-gray-500">maxButtons=7</p>
        <Pagination page={5} pageSize={10} total={100} maxButtons={7} onChange={() => {}} />
      </div>
    </div>
  ),
};

/**
 * 적은 페이지 수
 */
export const FewPages: Story = {
  args: {
    page: 2,
    pageSize: 10,
    total: 30,
    onChange: () => {},
  },
};

/**
 * 단일 페이지 (숨겨짐)
 */
export const SinglePage: Story = {
  render: () => (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        페이지가 1개일 때는 Pagination이 숨겨집니다.
      </p>
      <div className="p-4 border rounded">
        <Pagination page={1} pageSize={10} total={5} onChange={() => {}} />
        <p className="text-xs text-gray-400 mt-2">
          (Pagination 컴포넌트가 렌더링되지 않음)
        </p>
      </div>
    </div>
  ),
};

// ========================================
// Interactive Examples
// ========================================

/**
 * 인터랙티브 페이지네이션
 */
export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const total = 100;
    
    return (
      <div className="space-y-4">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onChange={setPage}
        />
        <p className="text-sm text-gray-500 text-center">
          현재 페이지: {page} / {Math.ceil(total / pageSize)}
        </p>
      </div>
    );
  },
};

/**
 * PaginationInfo와 함께
 */
export const WithPaginationInfo: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const total = 87;
    
    return (
      <div className="space-y-4 w-[500px]">
        <div className="flex items-center justify-between">
          <PaginationInfo page={page} pageSize={pageSize} total={total} />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onChange={setPage}
          />
        </div>
      </div>
    );
  },
};

// ========================================
// Table Integration Example
// ========================================

/**
 * 테이블과 함께 사용
 */
export const WithTableExample: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const pageSize = 5;
    const total = 23;
    
    // 샘플 데이터
    const allData = Array.from({ length: total }, (_, i) => ({
      id: i + 1,
      name: `사용자 ${i + 1}`,
      email: `user${i + 1}@example.com`,
      status: i % 3 === 0 ? "비활성" : "활성",
    }));
    
    const currentData = allData.slice((page - 1) * pageSize, page * pageSize);
    
    return (
      <div className="w-[600px] space-y-4">
        <table className="w-full border-collapse border rounded-lg">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 text-left text-sm font-medium border">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium border">이름</th>
              <th className="px-4 py-2 text-left text-sm font-medium border">이메일</th>
              <th className="px-4 py-2 text-left text-sm font-medium border">상태</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm border">{row.id}</td>
                <td className="px-4 py-2 text-sm border">{row.name}</td>
                <td className="px-4 py-2 text-sm border">{row.email}</td>
                <td className="px-4 py-2 text-sm border">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      row.status === "활성"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="flex items-center justify-between pt-2">
          <PaginationInfo page={page} pageSize={pageSize} total={total} />
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onChange={setPage}
          />
        </div>
      </div>
    );
  },
};

// ========================================
// Showcase
// ========================================

/**
 * 다양한 데이터 크기
 */
export const VariousDataSizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium">적은 데이터 (30건)</p>
        <div className="flex items-center justify-between">
          <PaginationInfo page={1} pageSize={10} total={30} />
          <Pagination page={1} pageSize={10} total={30} onChange={() => {}} />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">중간 데이터 (100건)</p>
        <div className="flex items-center justify-between">
          <PaginationInfo page={5} pageSize={10} total={100} />
          <Pagination page={5} pageSize={10} total={100} onChange={() => {}} />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">많은 데이터 (1000건)</p>
        <div className="flex items-center justify-between">
          <PaginationInfo page={50} pageSize={10} total={1000} />
          <Pagination page={50} pageSize={10} total={1000} onChange={() => {}} />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-sm font-medium">빈 데이터 (0건)</p>
        <div className="flex items-center justify-between">
          <PaginationInfo page={1} pageSize={10} total={0} />
          <span className="text-xs text-gray-400">(Pagination 숨김)</span>
        </div>
      </div>
    </div>
  ),
};

