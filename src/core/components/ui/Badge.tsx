/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 엔터프라이즈 Admin에서 반복되는 UI 패턴을 캡슐화하고,
 *      테스트/스토리 문서화로 품질을 보장하는 SDS 공통 컴포넌트입니다.
 *
 * Badge Component
 * - variant: primary | success | warning | danger | neutral | info
 * - enumUtils의 color 값과 연결 가능
 */

import React from "react";
import { cn } from "../../utils/classUtils";
import type { EnumMeta } from "../../utils/enumUtils";

// ========================================
// Badge Types
// ========================================

export type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral"
  | "info";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** 배지 변형 스타일 */
  variant?: BadgeVariant;
  /** 배지 크기 */
  size?: "sm" | "md";
  /** 점(dot) 표시 여부 */
  dot?: boolean;
}

// ========================================
// Style Variants
// ========================================

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-softone-primary-light text-softone-primary",
  success: "bg-softone-success-light text-softone-success",
  warning: "bg-softone-warning-light text-yellow-800",
  danger: "bg-softone-danger-light text-softone-danger",
  neutral: "bg-gray-100 text-gray-700",
  info: "bg-softone-info-light text-softone-info",
};

const dotColors: Record<BadgeVariant, string> = {
  primary: "bg-softone-primary",
  success: "bg-softone-success",
  warning: "bg-softone-warning",
  danger: "bg-softone-danger",
  neutral: "bg-gray-500",
  info: "bg-softone-info",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
};

// ========================================
// Badge Component
// ========================================

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "neutral",
  size = "sm",
  dot = false,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full mr-1.5",
            dotColors[variant]
          )}
        />
      )}
      {children}
    </span>
  );
};

Badge.displayName = "Badge";

// ========================================
// EnumBadge - enumUtils와 연동
// ========================================

export interface EnumBadgeProps
  extends Omit<BadgeProps, "variant" | "children"> {
  /** EnumMeta 객체 */
  meta: EnumMeta;
  /** 라벨 대신 표시할 내용 */
  children?: React.ReactNode;
}

/**
 * EnumBadge - enumUtils의 EnumMeta와 연동되는 Badge
 *
 * @example
 * const status = getEnumMeta(USER_STATUS, 'ACTIVE');
 * <EnumBadge meta={status} />
 */
export const EnumBadge: React.FC<EnumBadgeProps> = ({
  meta,
  children,
  ...props
}) => {
  return (
    <Badge variant={meta.color ?? "neutral"} {...props}>
      {children ?? meta.label}
    </Badge>
  );
};

EnumBadge.displayName = "EnumBadge";

