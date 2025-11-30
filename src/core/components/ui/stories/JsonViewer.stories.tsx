/**
 * SoftOne Design System(SDS) - JsonViewer Stories
 * 작성: SoftOne Frontend Team
 * 설명: JsonViewer 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { JsonViewer } from "../JsonViewer";

const meta: Meta<typeof JsonViewer> = {
  title: "Core/UI/JsonViewer",
  component: JsonViewer,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 JsonViewer 컴포넌트입니다.

### 특징
- **JSON 포맷팅**: 들여쓰기된 JSON 표시
- **복사 기능**: 클립보드 복사 지원
- **접기/펼치기**: 긴 JSON 축소 가능
- **다크 테마**: 코드 가독성 향상

### 사용법
\`\`\`tsx
import { JsonViewer } from '@core/components/ui';

<JsonViewer
  data={{ name: "test", value: 123 }}
  title="Response"
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    collapsed: {
      control: "boolean",
      description: "초기 접힘 상태",
    },
    noCard: {
      control: "boolean",
      description: "카드 없이 렌더링",
    },
    maxHeight: {
      control: { type: "number" },
      description: "최대 높이 (px)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Sample Data
// ========================================

const simpleData = {
  name: "홍길동",
  email: "hong@example.com",
  age: 30,
  active: true,
};

const nestedData = {
  user: {
    id: 1,
    name: "홍길동",
    email: "hong@example.com",
    profile: {
      avatar: "https://example.com/avatar.jpg",
      bio: "안녕하세요",
    },
  },
  permissions: ["read", "write", "delete"],
  metadata: {
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-03-20T14:45:00Z",
  },
};

const apiResponse = {
  status: 200,
  message: "Success",
  data: {
    users: [
      { id: 1, name: "홍길동", role: "admin" },
      { id: 2, name: "김철수", role: "user" },
      { id: 3, name: "이영희", role: "user" },
    ],
    pagination: {
      page: 1,
      pageSize: 10,
      total: 100,
      totalPages: 10,
    },
  },
  timestamp: "2024-03-25T12:00:00Z",
};

const errorResponse = {
  status: 400,
  error: "Bad Request",
  message: "Validation failed",
  details: [
    { field: "email", message: "Invalid email format" },
    { field: "password", message: "Password too short" },
  ],
};

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 JsonViewer
 */
export const Default: Story = {
  args: {
    data: simpleData,
    title: "JSON 데이터",
  },
};

/**
 * 중첩된 데이터
 */
export const NestedData: Story = {
  args: {
    data: nestedData,
    title: "사용자 정보",
  },
};

/**
 * 카드 없이
 */
export const NoCard: Story = {
  render: () => (
    <div className="w-[400px]">
      <JsonViewer data={simpleData} title="JSON" noCard />
    </div>
  ),
};

/**
 * 타이틀 없이
 */
export const NoTitle: Story = {
  args: {
    data: simpleData,
  },
};

// ========================================
// State Variants
// ========================================

/**
 * 초기 접힘 상태
 */
export const Collapsed: Story = {
  args: {
    data: apiResponse,
    title: "API Response",
    collapsed: true,
  },
};

/**
 * 최대 높이 제한
 */
export const WithMaxHeight: Story = {
  args: {
    data: apiResponse,
    title: "API Response",
    maxHeight: 200,
  },
};

// ========================================
// Real-world Examples
// ========================================

/**
 * API 성공 응답
 */
export const ApiSuccessResponse: Story = {
  render: () => (
    <div className="w-[500px]">
      <JsonViewer data={apiResponse} title="Response (200 OK)" />
    </div>
  ),
};

/**
 * API 에러 응답
 */
export const ApiErrorResponse: Story = {
  render: () => (
    <div className="w-[500px]">
      <JsonViewer data={errorResponse} title="Response (400 Bad Request)" />
    </div>
  ),
};

/**
 * Request/Response 비교
 */
export const RequestResponseComparison: Story = {
  render: () => {
    const request = {
      method: "POST",
      url: "/api/users",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer token...",
      },
      body: {
        name: "새 사용자",
        email: "new@example.com",
        role: "user",
      },
    };

    const response = {
      status: 201,
      data: {
        id: 4,
        name: "새 사용자",
        email: "new@example.com",
        role: "user",
        createdAt: "2024-03-25T12:00:00Z",
      },
    };

    return (
      <div className="w-[600px] space-y-4">
        <JsonViewer data={request} title="Request" />
        <JsonViewer data={response} title="Response" />
      </div>
    );
  },
};

/**
 * 다양한 데이터 타입
 */
export const VariousDataTypes: Story = {
  render: () => {
    const mixedData = {
      string: "문자열",
      number: 12345,
      float: 3.14159,
      boolean: true,
      null: null,
      array: [1, 2, 3, 4, 5],
      object: { nested: true },
      date: "2024-03-25T12:00:00Z",
      url: "https://example.com",
      emoji: "🎉",
    };

    return (
      <div className="w-[500px]">
        <JsonViewer data={mixedData} title="다양한 데이터 타입" />
      </div>
    );
  },
};

/**
 * 긴 배열 데이터
 */
export const LongArrayData: Story = {
  render: () => {
    const longArray = {
      items: Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `Item ${i + 1}`,
        value: Math.random().toFixed(2),
      })),
    };

    return (
      <div className="w-[500px]">
        <JsonViewer data={longArray} title="긴 배열 데이터" maxHeight={300} />
      </div>
    );
  },
};

// ========================================
// Showcase
// ========================================

/**
 * API Playground 스타일
 */
export const ApiPlaygroundStyle: Story = {
  render: () => {
    return (
      <div className="w-[600px] space-y-4 p-4 bg-gray-100 rounded-lg">
        <div className="flex gap-2 items-center">
          <span className="px-2 py-1 bg-green-600 text-white text-xs font-bold rounded">
            GET
          </span>
          <code className="text-sm">/api/users?page=1&limit=10</code>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Request Headers</h4>
            <JsonViewer
              data={{
                "Content-Type": "application/json",
                Authorization: "Bearer eyJhbGci...",
              }}
              noCard
              maxHeight={150}
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Query Parameters</h4>
            <JsonViewer data={{ page: 1, limit: 10 }} noCard maxHeight={150} />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Response Body</h4>
          <JsonViewer data={apiResponse} noCard maxHeight={250} />
        </div>
      </div>
    );
  },
};
