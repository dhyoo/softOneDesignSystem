/**
 * SoftOne Design System(SDS) - Badge Stories
 * 작성: SoftOne Frontend Team
 * 설명: Badge 컴포넌트의 Storybook 문서.
 *      테스트/스토리 문서화를 통한 엔터프라이즈 품질 보장.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Badge, EnumBadge } from "../Badge";
import {
  USER_STATUS,
  PROCESS_STATUS,
  getEnumMeta,
} from "../../../utils/enumUtils";

const meta: Meta<typeof Badge> = {
  title: "Core/UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 Badge 컴포넌트입니다.

### 특징
- **variant**: primary, success, warning, danger, neutral, info 상태
- **size**: sm, md 크기
- **dot**: 점(dot) 표시 옵션
- **EnumBadge**: enumUtils와 연동 가능

### 사용법
\`\`\`tsx
import { Badge, EnumBadge } from '@core/components/ui';
import { USER_STATUS, getEnumMeta } from '@core/utils';

<Badge variant="success">활성</Badge>

// EnumBadge 사용
const status = getEnumMeta(USER_STATUS, 'ACTIVE');
<EnumBadge meta={status} />
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "success", "warning", "danger", "neutral", "info"],
      description: "배지 스타일",
    },
    size: {
      control: "select",
      options: ["sm", "md"],
      description: "배지 크기",
    },
    dot: {
      control: "boolean",
      description: "점(dot) 표시",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 배지
 */
export const Default: Story = {
  args: {
    children: "Badge",
    variant: "neutral",
  },
};

/**
 * Primary 배지
 */
export const Primary: Story = {
  args: {
    children: "Primary",
    variant: "primary",
  },
};

/**
 * Success 배지
 */
export const Success: Story = {
  args: {
    children: "Success",
    variant: "success",
  },
};

/**
 * Warning 배지
 */
export const Warning: Story = {
  args: {
    children: "Warning",
    variant: "warning",
  },
};

/**
 * Danger 배지
 */
export const Danger: Story = {
  args: {
    children: "Danger",
    variant: "danger",
  },
};

/**
 * Info 배지
 */
export const Info: Story = {
  args: {
    children: "Info",
    variant: "info",
  },
};

// ========================================
// Size Variants
// ========================================

/**
 * 모든 크기
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Badge size="sm" variant="primary">
        Small
      </Badge>
      <Badge size="md" variant="primary">
        Medium
      </Badge>
    </div>
  ),
};

// ========================================
// With Dot
// ========================================

/**
 * Dot 표시
 */
export const WithDot: Story = {
  args: {
    children: "Status",
    variant: "success",
    dot: true,
  },
};

/**
 * 모든 Dot 상태
 */
export const AllDotsVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="primary" dot>
        Primary
      </Badge>
      <Badge variant="success" dot>
        Success
      </Badge>
      <Badge variant="warning" dot>
        Warning
      </Badge>
      <Badge variant="danger" dot>
        Danger
      </Badge>
      <Badge variant="info" dot>
        Info
      </Badge>
      <Badge variant="neutral" dot>
        Neutral
      </Badge>
    </div>
  ),
};

// ========================================
// All Variants
// ========================================

/**
 * 모든 Variant
 */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
};

// ========================================
// EnumBadge Examples
// ========================================

/**
 * EnumBadge - USER_STATUS
 */
export const EnumBadgeUserStatus: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">사용자 상태</h3>
      <div className="flex flex-wrap items-center gap-4">
        <EnumBadge meta={getEnumMeta(USER_STATUS, "ACTIVE")} />
        <EnumBadge meta={getEnumMeta(USER_STATUS, "INACTIVE")} />
        <EnumBadge meta={getEnumMeta(USER_STATUS, "PENDING")} />
        <EnumBadge meta={getEnumMeta(USER_STATUS, "SUSPENDED")} />
      </div>
    </div>
  ),
};

/**
 * EnumBadge - PROCESS_STATUS
 */
export const EnumBadgeProcessStatus: Story = {
  render: () => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700">처리 상태</h3>
      <div className="flex flex-wrap items-center gap-4">
        <EnumBadge meta={getEnumMeta(PROCESS_STATUS, "PENDING")} />
        <EnumBadge meta={getEnumMeta(PROCESS_STATUS, "IN_PROGRESS")} />
        <EnumBadge meta={getEnumMeta(PROCESS_STATUS, "COMPLETED")} />
        <EnumBadge meta={getEnumMeta(PROCESS_STATUS, "FAILED")} />
        <EnumBadge meta={getEnumMeta(PROCESS_STATUS, "CANCELLED")} />
      </div>
    </div>
  ),
};

// ========================================
// Use Cases
// ========================================

/**
 * 테이블에서의 사용 예시
 */
export const TableUsageExample: Story = {
  render: () => (
    <div className="bg-white border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              이름
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              상태
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-3 text-sm">홍길동</td>
            <td className="px-4 py-3">
              <Badge variant="success">활성</Badge>
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm">김철수</td>
            <td className="px-4 py-3">
              <Badge variant="warning">대기</Badge>
            </td>
          </tr>
          <tr>
            <td className="px-4 py-3 text-sm">이영희</td>
            <td className="px-4 py-3">
              <Badge variant="danger">비활성</Badge>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};
