/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 *
 * 이 파일에서는 Role/Grade 기반 PermissionKey를 사용하여
 * 메뉴/페이지/버튼/액션의 표시/비활성화/숨김을 제어합니다.
 *
 * Button Component
 *   - variant: primary | secondary | danger | outline | ghost
 *   - size: sm | md | lg
 *   - 권한 기반 비활성화/숨김 지원
 *   - 직급 기반 액션 제한 지원
 */

import React, { forwardRef } from "react";
import { Lock } from "lucide-react";
import { cn } from "../../utils/classUtils";
import { usePermission } from "../../hooks/usePermission";
import { isActionDisabledByGrade } from "../../utils/gradeUtils";
import type { PermissionKey, Grade } from "../../auth/role.types";

// ========================================
// Button Types
// ========================================

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "outline"
  | "ghost"
  | "success"
  | "warning"
  | "info";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 변형 스타일 */
  variant?: ButtonVariant;
  /** 버튼 크기 */
  size?: ButtonSize;
  /** 로딩 상태 (loading 또는 isLoading 모두 지원) */
  loading?: boolean;
  /** 로딩 상태 (alias) */
  isLoading?: boolean;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** 좌측 아이콘 */
  leftIcon?: React.ReactNode;
  /** 우측 아이콘 */
  rightIcon?: React.ReactNode;

  // ========================================
  // 권한 관련 Props
  // ========================================

  /** 필요한 권한 (없으면 비활성화) */
  requiredPermission?: PermissionKey;
  /** 최소 필요 직급 (미달 시 비활성화) */
  minRequiredGrade?: Grade;
  /** 권한 없을 때 숨김 여부 (기본: false) */
  hideIfNoPermission?: boolean;
  /** 비활성화 시 잠금 아이콘 표시 여부 */
  showLockIconIfDisabled?: boolean;
}

// ========================================
// Style Variants
// ========================================

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-softone-primary text-white
    hover:bg-softone-primary-hover
    focus-visible:ring-softone-primary
  `,
  secondary: `
    bg-softone-surface text-softone-text border border-softone-border
    hover:bg-softone-surface-hover
    focus-visible:ring-softone-border
  `,
  danger: `
    bg-red-600 text-white
    hover:bg-red-700
    focus-visible:ring-red-500
  `,
  outline: `
    border border-softone-primary text-softone-primary bg-transparent
    hover:bg-softone-primary-light
    focus-visible:ring-softone-primary
  `,
  ghost: `
    text-softone-primary bg-transparent
    hover:bg-softone-surface-hover
    focus-visible:ring-softone-primary
  `,
  success: `
    bg-green-600 text-white
    hover:bg-green-700
    focus-visible:ring-green-500
  `,
  warning: `
    bg-amber-500 text-white
    hover:bg-amber-600
    focus-visible:ring-amber-500
  `,
  info: `
    bg-blue-500 text-white
    hover:bg-blue-600
    focus-visible:ring-blue-500
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded",
  md: "h-10 px-4 text-sm gap-2 rounded-md",
  lg: "h-12 px-6 text-base gap-2.5 rounded-lg",
};

// ========================================
// Loading Spinner
// ========================================

const LoadingSpinner: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={cn("animate-spin h-4 w-4", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// ========================================
// Button Component
// ========================================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      loading = false,
      isLoading = false,
      disabled,
      fullWidth = false,
      leftIcon,
      rightIcon,
      type = "button",
      // 권한 관련 Props
      requiredPermission,
      minRequiredGrade,
      hideIfNoPermission = false,
      showLockIconIfDisabled = false,
      ...props
    },
    ref
  ) => {
    const { hasPermission, grade } = usePermission();

    // 권한 검사
    const hasRequiredPermission = requiredPermission
      ? hasPermission(requiredPermission)
      : true;

    // 직급 검사
    const hasRequiredGrade = minRequiredGrade
      ? !isActionDisabledByGrade(grade, minRequiredGrade)
      : true;

    // 권한/직급에 의한 비활성화 여부
    const isDisabledByPermission = !hasRequiredPermission || !hasRequiredGrade;

    // 숨김 처리
    if (hideIfNoPermission && isDisabledByPermission) {
      return null;
    }

    const isLoadingState = loading || isLoading;
    const isDisabled = disabled || isLoadingState || isDisabledByPermission;

    // 비활성화 이유에 따른 툴팁 메시지
    const disabledReason = isDisabledByPermission
      ? !hasRequiredPermission
        ? "권한이 없습니다"
        : "직급 요건을 충족하지 않습니다"
      : undefined;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        title={isDisabled ? disabledReason : undefined}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          // Full width
          fullWidth && "w-full",
          // Disabled styles
          isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
          className
        )}
        {...props}
      >
        {/* 잠금 아이콘 (권한/직급 비활성화 시) */}
        {showLockIconIfDisabled && isDisabledByPermission && (
          <Lock className="w-4 h-4 mr-1.5 text-current" />
        )}

        {/* 로딩 스피너 */}
        {isLoadingState && <LoadingSpinner className="mr-2" />}

        {/* 좌측 아이콘 */}
        {!isLoadingState &&
          !showLockIconIfDisabled &&
          !isDisabledByPermission &&
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {!isLoadingState &&
          showLockIconIfDisabled &&
          !isDisabledByPermission &&
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {!isLoadingState && !showLockIconIfDisabled && leftIcon && (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        )}

        {/* 버튼 텍스트 */}
        {children}

        {/* 우측 아이콘 */}
        {!isLoadingState && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// ========================================
// 편의용 Wrapper 컴포넌트
// ========================================

/**
 * 권한이 필요한 액션 버튼
 */
export const ActionButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & { permission: PermissionKey }
>(({ permission, ...props }, ref) => (
  <Button
    ref={ref}
    requiredPermission={permission}
    hideIfNoPermission
    {...props}
  />
));

ActionButton.displayName = "ActionButton";

/**
 * 직급 제한이 있는 버튼
 */
export const GradeRestrictedButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & { minGrade: Grade }
>(({ minGrade, ...props }, ref) => (
  <Button
    ref={ref}
    minRequiredGrade={minGrade}
    showLockIconIfDisabled
    {...props}
  />
));

GradeRestrictedButton.displayName = "GradeRestrictedButton";
