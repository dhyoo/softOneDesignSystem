/**
 * SoftOne Design System(SDS) - Select Stories
 * 작성: SoftOne Frontend Team
 * 설명: Select 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Select, type SelectOption } from "../Select";

const meta: Meta<typeof Select> = {
  title: "Core/UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 Select 컴포넌트입니다.

### 특징
- **Native select**: 접근성 보장
- **size**: sm, md, lg 크기 지원
- **error**: 에러 상태 표시
- **forwardRef**: React Hook Form 연동 가능

### 사용법
\`\`\`tsx
import { Select } from '@core/components/ui';

const options = [
  { value: 'kr', label: '한국' },
  { value: 'us', label: '미국' },
];

<Select options={options} placeholder="국가 선택" />
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "선택 필드 크기",
    },
    error: {
      control: "boolean",
      description: "에러 상태",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    fullWidth: {
      control: "boolean",
      description: "전체 너비",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Sample Options
// ========================================

const countryOptions: SelectOption[] = [
  { value: "kr", label: "한국" },
  { value: "us", label: "미국" },
  { value: "jp", label: "일본" },
  { value: "cn", label: "중국" },
  { value: "uk", label: "영국" },
];

const statusOptions: SelectOption[] = [
  { value: "ACTIVE", label: "활성" },
  { value: "INACTIVE", label: "비활성" },
  { value: "PENDING", label: "대기중" },
  { value: "SUSPENDED", label: "정지" },
];

const roleOptions: SelectOption[] = [
  { value: "ADMIN", label: "관리자" },
  { value: "MANAGER", label: "매니저" },
  { value: "USER", label: "일반 사용자" },
  { value: "GUEST", label: "게스트", disabled: true },
];

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 Select
 */
export const Default: Story = {
  args: {
    options: countryOptions,
    placeholder: "국가를 선택하세요",
  },
};

/**
 * Placeholder 없이
 */
export const WithoutPlaceholder: Story = {
  args: {
    options: statusOptions,
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
    <div className="space-y-4">
      <Select size="sm" options={countryOptions} placeholder="Small" />
      <Select size="md" options={countryOptions} placeholder="Medium" />
      <Select size="lg" options={countryOptions} placeholder="Large" />
    </div>
  ),
};

/**
 * Small Select
 */
export const Small: Story = {
  args: {
    size: "sm",
    options: countryOptions,
    placeholder: "Small",
  },
};

/**
 * Large Select
 */
export const Large: Story = {
  args: {
    size: "lg",
    options: countryOptions,
    placeholder: "Large",
  },
};

// ========================================
// State Variants
// ========================================

/**
 * 에러 상태
 */
export const Error: Story = {
  args: {
    options: statusOptions,
    placeholder: "상태 선택",
    error: true,
  },
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    options: statusOptions,
    placeholder: "선택 불가",
    disabled: true,
  },
};

/**
 * 일부 옵션 비활성화
 */
export const WithDisabledOptions: Story = {
  args: {
    options: roleOptions,
    placeholder: "역할 선택",
  },
};

/**
 * 전체 너비
 */
export const FullWidth: Story = {
  args: {
    options: countryOptions,
    placeholder: "국가 선택",
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
};

// ========================================
// Showcase
// ========================================

/**
 * 모든 상태 조합
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-6 w-64">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">기본</h3>
        <Select options={countryOptions} placeholder="국가 선택" fullWidth />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">값 선택됨</h3>
        <Select options={countryOptions} defaultValue="kr" fullWidth />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">에러 상태</h3>
        <Select options={statusOptions} placeholder="상태 선택" error fullWidth />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">비활성화</h3>
        <Select options={countryOptions} placeholder="선택 불가" disabled fullWidth />
      </div>
    </div>
  ),
};

/**
 * 폼 예시
 */
export const FormExample: Story = {
  render: () => (
    <div className="space-y-4 w-80 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">사용자 정보</h3>
      
      <div className="space-y-1">
        <label className="text-sm font-medium">국가</label>
        <Select options={countryOptions} placeholder="국가 선택" fullWidth />
      </div>
      
      <div className="space-y-1">
        <label className="text-sm font-medium">상태</label>
        <Select options={statusOptions} placeholder="상태 선택" fullWidth />
      </div>
      
      <div className="space-y-1">
        <label className="text-sm font-medium">역할</label>
        <Select options={roleOptions} placeholder="역할 선택" fullWidth />
      </div>
    </div>
  ),
};

