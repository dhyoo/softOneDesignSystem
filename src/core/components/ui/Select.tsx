/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 리스트 화면 표준화를 위해 Select 패턴을 캡슐화합니다.
 *      Native select 기반으로 접근성을 보장하고,
 *      SDS Design Token을 적용한 일관된 스타일을 제공합니다.
 *
 * Select Component
 * - forwardRef 사용으로 React Hook Form 연동 가능
 * - SDS 토큰 기반 스타일링
 */

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/classUtils";

// ========================================
// Select Types
// ========================================

export type SelectSize = "sm" | "md" | "lg";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  /** 옵션 목록 */
  options: SelectOption[];
  /** 선택 필드 크기 */
  size?: SelectSize;
  /** 에러 상태 */
  error?: boolean;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** placeholder 텍스트 */
  placeholder?: string;
}

// ========================================
// Style Variants
// ========================================

const sizeStyles: Record<SelectSize, string> = {
  sm: "h-8 pl-3 pr-8 text-sm",
  md: "h-10 pl-4 pr-10 text-sm",
  lg: "h-12 pl-4 pr-10 text-base",
};

const iconSizeStyles: Record<SelectSize, string> = {
  sm: "w-4 h-4 right-2",
  md: "w-4 h-4 right-3",
  lg: "w-5 h-5 right-3",
};

// ========================================
// Select Component
// ========================================

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      options,
      size = "md",
      error = false,
      fullWidth = false,
      disabled,
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            // Base styles
            "appearance-none rounded-md border bg-softone-surface",
            "text-softone-text",
            "transition-colors duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            "cursor-pointer",
            // Size styles
            sizeStyles[size],
            // Full width
            fullWidth && "w-full",
            // Normal state
            !error && [
              "border-softone-border",
              "hover:border-softone-border-hover",
              "focus:border-softone-primary focus:ring-softone-primary/20",
            ],
            // Error state
            error && [
              "border-softone-danger",
              "focus:border-softone-danger focus:ring-softone-danger/20",
            ],
            // Disabled state
            disabled && "bg-gray-100 cursor-not-allowed opacity-60",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className={cn(
            "absolute top-1/2 -translate-y-1/2 pointer-events-none text-softone-text-muted",
            iconSizeStyles[size]
          )}
        />
      </div>
    );
  }
);

Select.displayName = "Select";
