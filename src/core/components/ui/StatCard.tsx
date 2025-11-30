/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 대시보드용 통계 카드 컴포넌트.
 *      주요 지표를 시각적으로 표시하는 재사용 가능한 패턴입니다.
 *
 * StatCard Component
 * - 아이콘, 제목, 값, 설명 표시
 * - 트렌드 표시 (상승/하락) 옵션
 * - 다양한 컬러 변형
 */

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../utils/classUtils";

// ========================================
// StatCard Types
// ========================================

export type StatCardVariant = "default" | "primary" | "success" | "warning" | "danger";

export interface StatCardTrend {
  /** 트렌드 값 (예: "+12%", "-5%") */
  value: string;
  /** 트렌드 방향 */
  direction: "up" | "down" | "neutral";
  /** 비교 기간 (예: "지난 주 대비") */
  label?: string;
}

export interface StatCardProps {
  /** 카드 제목 */
  title: string;
  /** 주요 값 */
  value: string | number;
  /** 부가 설명 */
  description?: string;
  /** 아이콘 */
  icon?: React.ReactNode;
  /** 트렌드 정보 */
  trend?: StatCardTrend;
  /** 카드 변형 */
  variant?: StatCardVariant;
  /** 로딩 상태 */
  loading?: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// Variant Styles
// ========================================

const variantStyles: Record<StatCardVariant, { icon: string; accent: string }> = {
  default: {
    icon: "bg-softone-bg text-softone-text-secondary",
    accent: "text-softone-text",
  },
  primary: {
    icon: "bg-softone-primary/10 text-softone-primary",
    accent: "text-softone-primary",
  },
  success: {
    icon: "bg-softone-success/10 text-softone-success",
    accent: "text-softone-success",
  },
  warning: {
    icon: "bg-softone-warning/10 text-yellow-700",
    accent: "text-yellow-700",
  },
  danger: {
    icon: "bg-softone-danger/10 text-softone-danger",
    accent: "text-softone-danger",
  },
};

const trendColors = {
  up: "text-softone-success",
  down: "text-softone-danger",
  neutral: "text-softone-text-muted",
};

// ========================================
// Loading Skeleton
// ========================================

const LoadingSkeleton: React.FC = () => (
  <div className="animate-pulse">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-4 bg-softone-border rounded w-24" />
        <div className="h-8 bg-softone-border rounded w-32" />
      </div>
      <div className="w-12 h-12 bg-softone-border rounded-lg" />
    </div>
    <div className="mt-4 h-4 bg-softone-border rounded w-40" />
  </div>
);

// ========================================
// StatCard Component
// ========================================

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  variant = "default",
  loading = false,
  onClick,
  className,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "bg-softone-surface border border-softone-border rounded-lg p-6",
        "transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:border-softone-primary/30",
        className
      )}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === "Enter" && onClick() : undefined}
    >
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-softone-text-secondary">
                {title}
              </p>
              <p className={cn("text-2xl font-bold", styles.accent)}>
                {typeof value === "number" ? value.toLocaleString() : value}
              </p>
            </div>
            {icon && (
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center",
                  styles.icon
                )}
              >
                {icon}
              </div>
            )}
          </div>

          {/* Description or Trend */}
          <div className="mt-4 flex items-center gap-2">
            {trend && (
              <>
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    trendColors[trend.direction]
                  )}
                >
                  {trend.direction === "up" && <TrendingUp className="w-4 h-4" />}
                  {trend.direction === "down" && <TrendingDown className="w-4 h-4" />}
                  {trend.value}
                </span>
                {trend.label && (
                  <span className="text-sm text-softone-text-muted">
                    {trend.label}
                  </span>
                )}
              </>
            )}
            {!trend && description && (
              <p className="text-sm text-softone-text-muted">{description}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

StatCard.displayName = "StatCard";

