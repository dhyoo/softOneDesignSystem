/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 엔터프라이즈 Admin에서 반복되는 UI 패턴을 캡슐화하고,
 *      테스트/스토리 문서화로 품질을 보장하는 SDS 공통 컴포넌트입니다.
 *
 * Input Component
 * - forwardRef 사용으로 React Hook Form 연동 가능
 * - SDS 토큰 기반 스타일링
 */

import React, { forwardRef } from "react";
import { cn } from "../../utils/classUtils";

// ========================================
// Input Types
// ========================================

export type InputSize = "sm" | "md" | "lg";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  /** 입력 필드 크기 */
  size?: InputSize;
  /** 에러 상태 */
  error?: boolean;
  /** 전체 너비 */
  fullWidth?: boolean;
  /** 좌측 아이콘/요소 */
  leftElement?: React.ReactNode;
  /** 우측 아이콘/요소 */
  rightElement?: React.ReactNode;
}

// ========================================
// Style Variants
// ========================================

const sizeStyles: Record<InputSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-4 text-base",
};

// ========================================
// Input Component
// ========================================

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      size = "md",
      error = false,
      fullWidth = false,
      disabled,
      leftElement,
      rightElement,
      ...props
    },
    ref
  ) => {
    const hasLeftElement = !!leftElement;
    const hasRightElement = !!rightElement;

    const inputElement = (
      <input
        ref={ref}
        type={type}
        disabled={disabled}
        className={cn(
          // Base styles
          "rounded-md border bg-softone-surface",
          "text-softone-text placeholder:text-softone-text-muted",
          "transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-0",
          // Size styles
          sizeStyles[size],
          // Full width
          fullWidth && "w-full",
          // With elements padding adjustment
          hasLeftElement && "pl-10",
          hasRightElement && "pr-10",
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
      />
    );

    // 아이콘이 없으면 input만 반환
    if (!hasLeftElement && !hasRightElement) {
      return inputElement;
    }

    // 아이콘이 있으면 wrapper로 감싸기
    return (
      <div className={cn("relative", fullWidth && "w-full")}>
        {hasLeftElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-softone-text-muted">
            {leftElement}
          </div>
        )}
        {inputElement}
        {hasRightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-softone-text-muted">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

