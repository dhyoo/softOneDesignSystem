/**
 * SoftOne Design System(SDS) - StatCard Stories
 * 작성: SoftOne Frontend Team
 * 설명: StatCard 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Clock,
} from "lucide-react";
import { StatCard } from "../StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Core/UI/StatCard",
  component: StatCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 StatCard 컴포넌트입니다.

### 특징
- **대시보드 통계**: 주요 지표 표시용
- **트렌드 표시**: 상승/하락 트렌드 지원
- **Variant**: default, primary, success, warning, danger
- **로딩 상태**: skeleton 로딩 지원

### 사용법
\`\`\`tsx
import { StatCard } from '@core/components/ui';

<StatCard
  title="총 사용자"
  value={1234}
  icon={<Users />}
  trend={{ value: "+12%", direction: "up" }}
  variant="primary"
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "primary", "success", "warning", "danger"],
      description: "카드 스타일 변형",
    },
    loading: {
      control: "boolean",
      description: "로딩 상태",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 StatCard
 */
export const Default: Story = {
  args: {
    title: "총 사용자",
    value: 1234,
    description: "지난 30일 기준",
  },
};

/**
 * 아이콘 포함
 */
export const WithIcon: Story = {
  args: {
    title: "총 사용자",
    value: 1234,
    icon: <Users className="w-6 h-6" />,
    description: "지난 30일 기준",
  },
};

/**
 * 트렌드 포함
 */
export const WithTrend: Story = {
  args: {
    title: "총 매출",
    value: "₩12,340,000",
    icon: <DollarSign className="w-6 h-6" />,
    trend: {
      value: "+12.5%",
      direction: "up",
      label: "지난달 대비",
    },
  },
};

// ========================================
// Variants
// ========================================

/**
 * Primary 변형
 */
export const Primary: Story = {
  args: {
    title: "총 사용자",
    value: 1234,
    icon: <Users className="w-6 h-6" />,
    variant: "primary",
    trend: {
      value: "+5.2%",
      direction: "up",
    },
  },
};

/**
 * Success 변형
 */
export const Success: Story = {
  args: {
    title: "완료된 주문",
    value: 856,
    icon: <ShoppingCart className="w-6 h-6" />,
    variant: "success",
    trend: {
      value: "+23%",
      direction: "up",
      label: "지난주 대비",
    },
  },
};

/**
 * Warning 변형
 */
export const Warning: Story = {
  args: {
    title: "대기 중",
    value: 42,
    icon: <Clock className="w-6 h-6" />,
    variant: "warning",
    description: "처리가 필요합니다",
  },
};

/**
 * Danger 변형
 */
export const Danger: Story = {
  args: {
    title: "취소된 주문",
    value: 12,
    icon: <ShoppingCart className="w-6 h-6" />,
    variant: "danger",
    trend: {
      value: "-15%",
      direction: "down",
    },
  },
};

// ========================================
// States
// ========================================

/**
 * 로딩 상태
 */
export const Loading: Story = {
  args: {
    title: "총 사용자",
    value: 0,
    loading: true,
  },
};

/**
 * 클릭 가능
 */
export const Clickable: Story = {
  args: {
    title: "총 사용자",
    value: 1234,
    icon: <Users className="w-6 h-6" />,
    onClick: () => alert("StatCard 클릭됨"),
    description: "클릭하여 상세 보기",
  },
};

// ========================================
// Trend Directions
// ========================================

/**
 * 상승 트렌드
 */
export const TrendUp: Story = {
  args: {
    title: "방문자 수",
    value: "12,345",
    icon: <Eye className="w-6 h-6" />,
    trend: {
      value: "+24.5%",
      direction: "up",
      label: "지난주 대비",
    },
    variant: "success",
  },
};

/**
 * 하락 트렌드
 */
export const TrendDown: Story = {
  args: {
    title: "이탈률",
    value: "32.5%",
    icon: <TrendingUp className="w-6 h-6" />,
    trend: {
      value: "-8.2%",
      direction: "down",
      label: "지난달 대비",
    },
    variant: "danger",
  },
};

/**
 * 중립 트렌드
 */
export const TrendNeutral: Story = {
  args: {
    title: "평균 체류시간",
    value: "3분 42초",
    icon: <Clock className="w-6 h-6" />,
    trend: {
      value: "0%",
      direction: "neutral",
      label: "변동 없음",
    },
  },
};

// ========================================
// Dashboard Examples
// ========================================

/**
 * 대시보드 그리드
 */
export const DashboardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[600px]">
      <StatCard
        title="총 사용자"
        value="12,345"
        icon={<Users className="w-6 h-6" />}
        variant="primary"
        trend={{
          value: "+12%",
          direction: "up",
          label: "지난달 대비",
        }}
      />
      <StatCard
        title="총 매출"
        value="₩45,678,000"
        icon={<DollarSign className="w-6 h-6" />}
        variant="success"
        trend={{
          value: "+8.5%",
          direction: "up",
          label: "지난달 대비",
        }}
      />
      <StatCard
        title="주문 건수"
        value="1,234"
        icon={<ShoppingCart className="w-6 h-6" />}
        trend={{
          value: "-3%",
          direction: "down",
          label: "지난주 대비",
        }}
      />
      <StatCard
        title="페이지뷰"
        value="89,012"
        icon={<Eye className="w-6 h-6" />}
        trend={{
          value: "+15%",
          direction: "up",
        }}
      />
    </div>
  ),
};

/**
 * 로딩 대시보드
 */
export const LoadingDashboard: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 w-[600px]">
      <StatCard title="총 사용자" value="" loading />
      <StatCard title="총 매출" value="" loading />
      <StatCard title="주문 건수" value="" loading />
      <StatCard title="페이지뷰" value="" loading />
    </div>
  ),
};

/**
 * 모든 Variant 비교
 */
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-[800px]">
      <StatCard
        title="Default"
        value="1,234"
        variant="default"
        icon={<Users className="w-6 h-6" />}
      />
      <StatCard
        title="Primary"
        value="1,234"
        variant="primary"
        icon={<Users className="w-6 h-6" />}
      />
      <StatCard
        title="Success"
        value="1,234"
        variant="success"
        icon={<Users className="w-6 h-6" />}
      />
      <StatCard
        title="Warning"
        value="1,234"
        variant="warning"
        icon={<Users className="w-6 h-6" />}
      />
      <StatCard
        title="Danger"
        value="1,234"
        variant="danger"
        icon={<Users className="w-6 h-6" />}
      />
    </div>
  ),
};
