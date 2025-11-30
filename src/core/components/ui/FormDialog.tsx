/**
 * SoftOne Design System - FormDialog Component (Step 10)
 * 작성: SoftOne Frontend Team
 *
 * [목적]
 * - RHF + Zod 기반의 폼을 내부에 가진 모달 템플릿
 * - 사용자 생성/수정, 설정 변경 등 폼 모달을 빠르게 구현
 * - 유효성 검사, 제출 상태 관리를 캡슐화
 *
 * [A11y 고려]
 * - 폼 필드에 적절한 label 연결
 * - 에러 메시지 연결 (aria-describedby)
 * - 제출 버튼 로딩 상태 표시
 *
 * [사용법]
 * 1. 직접 사용 (커스텀 폼 렌더링):
 *    <FormDialog isOpen={isOpen} onClose={onClose} title="사용자 생성">
 *      {({ control, errors, isSubmitting }) => (
 *        <FormFieldWrapper label="이름" error={errors.name?.message}>
 *          <Controller name="name" control={control} render={...} />
 *        </FormFieldWrapper>
 *      )}
 *    </FormDialog>
 *
 * 2. schema + fields 기반 자동 생성:
 *    <FormDialog
 *      isOpen={isOpen}
 *      onClose={onClose}
 *      title="사용자 생성"
 *      schema={userSchema}
 *      fields={[
 *        { name: 'name', label: '이름', type: 'text' },
 *        { name: 'email', label: '이메일', type: 'email' },
 *      ]}
 *      onSubmit={handleSubmit}
 *    />
 */

import React, { useCallback } from "react";
import {
  useForm,
  Controller,
  type FieldValues,
  type DefaultValues,
  type Control,
  type FieldErrors,
  type Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ZodSchema } from "zod";
import { cn } from "../../utils/classUtils";
import { BaseModal, type ModalSize } from "./BaseModal";
import { Button } from "./Button";
import { Input } from "./Input";
import { Select, type SelectOption } from "./Select";
import { Checkbox } from "./Checkbox";
import { FormFieldWrapper } from "./FormFieldWrapper";

// ========================================
// Types
// ========================================

export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "textarea"
  | "select"
  | "checkbox"
  | "date";

export interface FormFieldConfig<T extends FieldValues = FieldValues> {
  /** 필드 이름 (폼 데이터의 키) */
  name: Path<T>;
  /** 필드 라벨 */
  label: string;
  /** 필드 타입 */
  type: FormFieldType;
  /** placeholder */
  placeholder?: string;
  /** 설명 텍스트 */
  description?: string;
  /** Select 옵션 */
  options?: SelectOption[];
  /** 비활성화 */
  disabled?: boolean;
  /** 추가 클래스 */
  className?: string;
  /** 그리드 열 span (1-12) */
  colSpan?: number;
}

export interface FormDialogRenderProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  isSubmitting: boolean;
  reset: () => void;
}

export interface FormDialogProps<T extends FieldValues = FieldValues> {
  /** 다이얼로그 열림 상태 */
  isOpen: boolean;
  /** 다이얼로그 닫기 핸들러 */
  onClose: () => void;
  /** 제목 */
  title?: string;
  /** 설명 */
  description?: string;
  /** 모달 크기 */
  size?: ModalSize;
  /** Zod 스키마 */
  schema?: ZodSchema<T>;
  /** 초기값 */
  defaultValues?: DefaultValues<T>;
  /** 필드 설정 (자동 생성용) */
  fields?: FormFieldConfig<T>[];
  /** 제출 버튼 텍스트 */
  submitLabel?: string;
  /** 취소 버튼 텍스트 */
  cancelLabel?: string;
  /** 폼 제출 핸들러 */
  onSubmit?: (values: T) => void | Promise<void>;
  /** 취소 핸들러 */
  onCancel?: () => void;
  /** 커스텀 폼 렌더 함수 */
  children?: (props: FormDialogRenderProps<T>) => React.ReactNode;
  /** 추가 클래스 */
  className?: string;
  /** 제출 중 다른 필드 비활성화 */
  disableOnSubmit?: boolean;
}

// ========================================
// FormDialog Component
// ========================================

export function FormDialog<T extends FieldValues = FieldValues>({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  schema,
  defaultValues,
  fields,
  submitLabel = "저장",
  cancelLabel = "취소",
  onSubmit,
  onCancel,
  children,
  className,
  disableOnSubmit = true,
}: FormDialogProps<T>) {
  // ========================================
  // Form Setup
  // ========================================

  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: schema ? zodResolver(schema as any) : undefined,
    defaultValues,
    mode: "onBlur",
  });

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  // ========================================
  // Handlers
  // ========================================

  const handleFormSubmit = rhfHandleSubmit(async (values) => {
    if (onSubmit) {
      await onSubmit(values as T);
    }
    reset();
    onClose();
  });

  const handleCancel = useCallback(() => {
    reset();
    onCancel?.();
    onClose();
  }, [reset, onCancel, onClose]);

  // ========================================
  // Field Renderer
  // ========================================

  const renderField = (field: FormFieldConfig<T>) => {
    const fieldError = errors[field.name as keyof typeof errors];
    const errorMessage = fieldError?.message as string | undefined;

    return (
      <div
        key={field.name}
        className={cn(field.colSpan && `col-span-${field.colSpan}`)}
      >
        <FormFieldWrapper
          label={field.label}
          description={field.description}
          errorMessage={errorMessage}
          required={!!schema}
        >
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => {
              switch (field.type) {
                case "select":
                  return (
                    <Select
                      {...controllerField}
                      options={field.options ?? []}
                      placeholder={field.placeholder}
                      disabled={
                        field.disabled || (disableOnSubmit && isSubmitting)
                      }
                    />
                  );

                case "checkbox":
                  return (
                    <Checkbox
                      checked={!!controllerField.value}
                      onChange={(e) =>
                        controllerField.onChange(e.target.checked)
                      }
                      disabled={
                        field.disabled || (disableOnSubmit && isSubmitting)
                      }
                      label={field.placeholder}
                    />
                  );

                case "textarea":
                  return (
                    <textarea
                      {...controllerField}
                      placeholder={field.placeholder}
                      disabled={
                        field.disabled || (disableOnSubmit && isSubmitting)
                      }
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border",
                        "bg-softone-surface text-softone-text",
                        "border-softone-border focus:border-softone-primary",
                        "focus:ring-2 focus:ring-softone-primary/20 focus:outline-none",
                        "placeholder:text-softone-text-muted",
                        "transition-colors min-h-[100px] resize-y",
                        errorMessage &&
                          "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      )}
                    />
                  );

                case "number":
                  return (
                    <Input
                      {...controllerField}
                      type="number"
                      placeholder={field.placeholder}
                      disabled={
                        field.disabled || (disableOnSubmit && isSubmitting)
                      }
                      onChange={(e) =>
                        controllerField.onChange(e.target.valueAsNumber || "")
                      }
                    />
                  );

                default:
                  return (
                    <Input
                      {...controllerField}
                      type={field.type}
                      placeholder={field.placeholder}
                      disabled={
                        field.disabled || (disableOnSubmit && isSubmitting)
                      }
                    />
                  );
              }
            }}
          />
        </FormFieldWrapper>
      </div>
    );
  };

  // ========================================
  // Footer Buttons
  // ========================================

  const footer = (
    <>
      <Button
        variant="secondary"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>
      <Button
        type="submit"
        form="form-dialog-form"
        variant="primary"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      >
        {submitLabel}
      </Button>
    </>
  );

  // ========================================
  // Render
  // ========================================

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      title={title}
      description={description}
      size={size}
      footer={footer}
      closeOnOverlayClick={!isSubmitting}
      closeOnEscape={!isSubmitting}
      className={className}
    >
      <form
        id="form-dialog-form"
        onSubmit={handleFormSubmit}
        className="space-y-4"
      >
        {/* 커스텀 렌더 함수 사용 */}
        {children &&
          children({
            control: control as unknown as Control<T>,
            errors,
            isSubmitting,
            reset,
          })}

        {/* 필드 설정 기반 자동 생성 */}
        {!children && fields && (
          <div className="grid grid-cols-12 gap-4">
            {fields.map((field) => (
              <div
                key={field.name}
                className={cn(
                  "col-span-12",
                  field.colSpan && `sm:col-span-${field.colSpan}`
                )}
              >
                {renderField(field)}
              </div>
            ))}
          </div>
        )}
      </form>
    </BaseModal>
  );
}

FormDialog.displayName = "FormDialog";

export default FormDialog;
