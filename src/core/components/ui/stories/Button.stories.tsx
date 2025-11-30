/**
 * SoftOne Design System(SDS) - Button Stories
 * 작성: SoftOne Frontend Team
 * 설명: Button 컴포넌트의 Storybook 문서.
 *      테스트/스토리 문서화를 통한 엔터프라이즈 품질 보장.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Plus, Download, ArrowRight, Mail } from "lucide-react";
import { Button } from "../Button";

const meta: Meta<typeof Button> = {
  title: "Core/UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 Button 컴포넌트입니다.

### 특징
- **variant**: primary, outline, ghost 스타일
- **size**: sm, md, lg 크기
- **loading**: 로딩 상태 지원
- **아이콘**: leftIcon, rightIcon 지원

### 사용법
\`\`\`tsx
import { Button } from '@core/components/ui';

<Button variant="primary" size="md">
  버튼
</Button>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "outline", "ghost"],
      description: "버튼 스타일 변형",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "버튼 크기",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    loading: {
      control: "boolean",
      description: "로딩 상태",
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
 * 기본 버튼
 */
export const Default: Story = {
  args: {
    children: "버튼",
    variant: "primary",
    size: "md",
  },
};

/**
 * Primary 버튼
 */
export const Primary: Story = {
  args: {
    children: "Primary 버튼",
    variant: "primary",
  },
};

/**
 * Outline 버튼
 */
export const Outline: Story = {
  args: {
    children: "Outline 버튼",
    variant: "outline",
  },
};

/**
 * Ghost 버튼
 */
export const Ghost: Story = {
  args: {
    children: "Ghost 버튼",
    variant: "ghost",
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
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

/**
 * Small 버튼
 */
export const Small: Story = {
  args: {
    children: "Small 버튼",
    size: "sm",
  },
};

/**
 * Large 버튼
 */
export const Large: Story = {
  args: {
    children: "Large 버튼",
    size: "lg",
  },
};

// ========================================
// State Variants
// ========================================

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    children: "비활성화",
    disabled: true,
  },
};

/**
 * 로딩 상태
 */
export const Loading: Story = {
  args: {
    children: "로딩 중...",
    loading: true,
  },
};

/**
 * 전체 너비
 */
export const FullWidth: Story = {
  args: {
    children: "전체 너비 버튼",
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

// ========================================
// With Icons
// ========================================

/**
 * 좌측 아이콘
 */
export const WithLeftIcon: Story = {
  args: {
    children: "새로 만들기",
    leftIcon: <Plus className="w-4 h-4" />,
  },
};

/**
 * 우측 아이콘
 */
export const WithRightIcon: Story = {
  args: {
    children: "다음으로",
    rightIcon: <ArrowRight className="w-4 h-4" />,
  },
};

/**
 * 양쪽 아이콘
 */
export const WithBothIcons: Story = {
  args: {
    children: "이메일 보내기",
    leftIcon: <Mail className="w-4 h-4" />,
    rightIcon: <ArrowRight className="w-4 h-4" />,
  },
};

// ========================================
// All Variants Showcase
// ========================================

/**
 * 모든 Variant 조합
 */
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Primary */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Primary</h3>
        <div className="flex items-center gap-4">
          <Button variant="primary" size="sm">
            Small
          </Button>
          <Button variant="primary" size="md">
            Medium
          </Button>
          <Button variant="primary" size="lg">
            Large
          </Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Button variant="primary" loading>
            Loading
          </Button>
        </div>
      </div>

      {/* Outline */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Outline</h3>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            Small
          </Button>
          <Button variant="outline" size="md">
            Medium
          </Button>
          <Button variant="outline" size="lg">
            Large
          </Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
          <Button variant="outline" loading>
            Loading
          </Button>
        </div>
      </div>

      {/* Ghost */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">Ghost</h3>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Small
          </Button>
          <Button variant="ghost" size="md">
            Medium
          </Button>
          <Button variant="ghost" size="lg">
            Large
          </Button>
          <Button variant="ghost" disabled>
            Disabled
          </Button>
          <Button variant="ghost" loading>
            Loading
          </Button>
        </div>
      </div>
    </div>
  ),
};

/**
 * 아이콘 버튼 조합
 */
export const IconButtonShowcase: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button leftIcon={<Plus className="w-4 h-4" />}>새로 만들기</Button>
      <Button variant="outline" leftIcon={<Download className="w-4 h-4" />}>
        다운로드
      </Button>
      <Button variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
        더 보기
      </Button>
    </div>
  ),
};

