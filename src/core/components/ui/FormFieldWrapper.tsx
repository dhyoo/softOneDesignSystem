/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 *
 * 중복 업무 감소:
 *   모든 폼 필드에서 반복되는 Label + Input + Description + Error 레이아웃을
 *   하나의 컴포넌트로 캡슐화. 퍼블리셔가 이 파일만 수정하면 전체 폼 스타일 변경 가능.
 *
 * A11y:
 *   htmlFor와 id 연결로 라벨 클릭 시 입력 필드 포커스.
 *   에러 메시지는 aria-describedby로 입력 필드와 연결.
 *
 * FormFieldWrapper Component
 * - Label + Description + Error 일관된 레이아웃
 * - 필수 표시(*), 에러 스타일 자동 적용
 *
 * @example
 * <FormFieldWrapper
 *   label="이메일"
 *   required
 *   errorMessage={errors.email?.message}
 * >
 *   <Input {...register('email')} error={!!errors.email} />
 * </FormFieldWrapper>
 */

import React, { useId } from "react";
import { cn } from "../../utils/classUtils";

// ========================================
// Types
// ========================================

export interface FormFieldWrapperProps {
  /** 필드 라벨 */
  label: string;
  /** HTML for 속성 (자동 생성 가능) */
  htmlFor?: string;
  /** 필드 설명 */
  description?: string;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 필수 필드 여부 */
  required?: boolean;
  /** 자식 요소 (Input, Select 등) */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
  /** 라벨 숨김 (시각적으로만) */
  hideLabel?: boolean;
}

// ========================================
// FormFieldWrapper Component
// ========================================

export const FormFieldWrapper: React.FC<FormFieldWrapperProps> = ({
  label,
  htmlFor,
  description,
  errorMessage,
  required = false,
  children,
  className,
  hideLabel = false,
}) => {
  const autoId = useId();
  const fieldId = htmlFor || autoId;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  const hasError = !!errorMessage;

  return (
    <div className={cn("space-y-1.5", className)}>
      {/* Label */}
      <label
        htmlFor={fieldId}
        className={cn(
          "block text-sm font-medium text-softone-text",
          hideLabel && "sr-only"
        )}
      >
        {label}
        {required && (
          <span className="ml-1 text-softone-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {/* Description */}
      {description && !hasError && (
        <p id={descriptionId} className="text-xs text-softone-text-muted">
          {description}
        </p>
      )}

      {/* Input (children) */}
      <div>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // 자식 요소에 id와 aria 속성 주입
            return React.cloneElement(
              child as React.ReactElement<Record<string, unknown>>,
              {
                id: fieldId,
                "aria-describedby": hasError
                  ? errorId
                  : description
                  ? descriptionId
                  : undefined,
                "aria-invalid": hasError ? true : undefined,
              }
            );
          }
          return child;
        })}
      </div>

      {/* Error Message */}
      {hasError && (
        <p id={errorId} className="text-sm text-softone-danger" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

FormFieldWrapper.displayName = "FormFieldWrapper";
