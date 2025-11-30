/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 엔터프라이즈 Admin에서 반복되는 UI 패턴을 캡슐화하고,
 *      테스트/스토리 문서화로 품질을 보장하는 SDS 공통 컴포넌트입니다.
 *
 * Checkbox Component
 * - 일반 체크박스 컴포넌트
 * - forwardRef 사용으로 React Hook Form 연동 가능
 */

import React, { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "../../utils/classUtils";

// ========================================
// Checkbox Types
// ========================================

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** 체크박스 크기 */
  size?: CheckboxSize;
  /** 라벨 텍스트 */
  label?: string;
  /** 에러 상태 */
  error?: boolean;
  /** 부분 선택 상태 (indeterminate) */
  indeterminate?: boolean;
}

// ========================================
// Style Variants
// ========================================

const sizeStyles: Record<CheckboxSize, { box: string; icon: string; label: string }> = {
  sm: {
    box: "w-4 h-4",
    icon: "w-3 h-3",
    label: "text-sm",
  },
  md: {
    box: "w-5 h-5",
    icon: "w-3.5 h-3.5",
    label: "text-sm",
  },
  lg: {
    box: "w-6 h-6",
    icon: "w-4 h-4",
    label: "text-base",
  },
};

// ========================================
// Checkbox Component
// ========================================

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      size = "md",
      label,
      error = false,
      disabled,
      checked,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const styles = sizeStyles[size];

    // Indeterminate 상태 처리
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    // ref 병합
    React.useImperativeHandle(ref, () => inputRef.current!, []);

    return (
      <label
        className={cn(
          "inline-flex items-center gap-2 cursor-pointer",
          disabled && "cursor-not-allowed opacity-60",
          className
        )}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="checkbox"
            checked={checked}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              styles.box,
              "rounded border-2 transition-all duration-200",
              "flex items-center justify-center",
              // Unchecked state
              "border-softone-border bg-softone-surface",
              // Checked state
              "peer-checked:border-softone-primary peer-checked:bg-softone-primary",
              // Focus state
              "peer-focus-visible:ring-2 peer-focus-visible:ring-softone-primary/20 peer-focus-visible:ring-offset-1",
              // Hover state
              !disabled && "hover:border-softone-primary",
              // Error state
              error && "border-softone-danger",
              // Indeterminate state
              indeterminate && "border-softone-primary bg-softone-primary"
            )}
          >
            {(checked || indeterminate) && (
              <Check className={cn(styles.icon, "text-white stroke-[3]")} />
            )}
          </div>
        </div>
        {label && (
          <span className={cn(styles.label, "text-softone-text select-none")}>
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

