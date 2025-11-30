/**
 * SoftOne Design System(SDS) - Input Stories
 * 작성: SoftOne Frontend Team
 * 설명: Input 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Search, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "../Input";

const meta: Meta<typeof Input> = {
  title: "Core/UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 Input 컴포넌트입니다.

### 특징
- **size**: sm, md, lg 크기 지원
- **error**: 에러 상태 표시
- **아이콘**: leftElement, rightElement 지원
- **forwardRef**: React Hook Form 연동 가능

### 사용법
\`\`\`tsx
import { Input } from '@core/components/ui';

<Input
  placeholder="이메일을 입력하세요"
  size="md"
  leftElement={<Mail className="w-4 h-4" />}
/>
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
      description: "입력 필드 크기",
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
// Basic Stories
// ========================================

/**
 * 기본 Input
 */
export const Default: Story = {
  args: {
    placeholder: "입력하세요...",
    size: "md",
  },
};

/**
 * 다양한 타입
 */
export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Input type="text" placeholder="텍스트" />
      <Input type="email" placeholder="이메일" />
      <Input type="password" placeholder="비밀번호" />
      <Input type="number" placeholder="숫자" />
      <Input type="tel" placeholder="전화번호" />
      <Input type="date" />
    </div>
  ),
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
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium" />
      <Input size="lg" placeholder="Large" />
    </div>
  ),
};

/**
 * Small Input
 */
export const Small: Story = {
  args: {
    size: "sm",
    placeholder: "Small input",
  },
};

/**
 * Large Input
 */
export const Large: Story = {
  args: {
    size: "lg",
    placeholder: "Large input",
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
    placeholder: "에러 상태",
    error: true,
    defaultValue: "잘못된 값",
  },
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    placeholder: "비활성화",
    disabled: true,
    defaultValue: "수정 불가",
  },
};

/**
 * 전체 너비
 */
export const FullWidth: Story = {
  args: {
    placeholder: "전체 너비 입력 필드",
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
// With Icons
// ========================================

/**
 * 좌측 아이콘
 */
export const WithLeftIcon: Story = {
  args: {
    placeholder: "검색어 입력...",
    leftElement: <Search className="w-4 h-4" />,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

/**
 * 우측 아이콘
 */
export const WithRightIcon: Story = {
  args: {
    placeholder: "이메일 입력",
    rightElement: <Mail className="w-4 h-4" />,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

/**
 * 양쪽 아이콘
 */
export const WithBothIcons: Story = {
  args: {
    placeholder: "검색...",
    leftElement: <Search className="w-4 h-4" />,
    rightElement: <span className="text-xs text-gray-400">⌘K</span>,
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

/**
 * 비밀번호 토글 예시
 */
export const PasswordToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <div className="w-80">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="비밀번호 입력"
          leftElement={<Lock className="w-4 h-4" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          }
          fullWidth
        />
      </div>
    );
  },
};

// ========================================
// Showcase
// ========================================

/**
 * 모든 상태 조합
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-6 w-80">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">기본 상태</h3>
        <Input placeholder="기본 입력" fullWidth />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">값 입력됨</h3>
        <Input defaultValue="입력된 값" fullWidth />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">에러 상태</h3>
        <Input placeholder="에러" error fullWidth />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">비활성화</h3>
        <Input placeholder="비활성화" disabled fullWidth />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">아이콘 포함</h3>
        <Input
          placeholder="검색"
          leftElement={<Search className="w-4 h-4" />}
          fullWidth
        />
      </div>
    </div>
  ),
};

