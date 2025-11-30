/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 엔터프라이즈 Admin에서 반복되는 UI 패턴을 캡슐화하고,
 *      테스트/스토리 문서화로 품질을 보장하는 SDS 공통 컴포넌트입니다.
 *
 * Label Component
 * - 폼 필드용 라벨 컴포넌트
 * - 필수 표시(*) 지원
 */

import React from "react";
import { cn } from "../../utils/classUtils";

// ========================================
// Label Types
// ========================================

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** 필수 필드 표시 */
  required?: boolean;
  /** 비활성화 스타일 */
  disabled?: boolean;
}

// ========================================
// Label Component
// ========================================

export const Label: React.FC<LabelProps> = ({
  children,
  className,
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <label
      className={cn(
        "text-sm font-medium text-softone-text",
        "flex items-center gap-1",
        disabled && "opacity-60",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-softone-danger" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
};

Label.displayName = "Label";

// ========================================
// FormField Wrapper
// ========================================

export interface FormFieldProps {
  /** 라벨 텍스트 */
  label?: string;
  /** 라벨의 htmlFor */
  htmlFor?: string;
  /** 필수 필드 여부 */
  required?: boolean;
  /** 에러 메시지 */
  error?: string;
  /** 도움말 텍스트 */
  helperText?: string;
  /** 자식 요소 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
}

/**
 * FormField - 라벨, 입력 필드, 에러/도움말을 감싸는 Wrapper
 *
 * @example
 * <FormField label="이메일" required error={errors.email?.message}>
 *   <Input {...register('email')} error={!!errors.email} fullWidth />
 * </FormField>
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  required = false,
  error,
  helperText,
  children,
  className,
}) => {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-softone-danger" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p className="text-sm text-softone-text-muted">{helperText}</p>
      )}
    </div>
  );
};

FormField.displayName = "FormField";

