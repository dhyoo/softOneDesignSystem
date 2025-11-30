/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 *
 * 중복 업무 감소:
 *   다중 선택 체크박스 로직(배열 상태 관리, 옵션 순회)을 캡슐화하여
 *   개발자가 매번 map/filter 로직을 작성할 필요 없이 선언적으로 사용 가능.
 *
 * A11y:
 *   role="group", aria-labelledby 등을 통해 스크린 리더가
 *   그룹화된 체크박스임을 인식할 수 있도록 구성.
 *
 * CheckboxGroup Component
 * - Controlled + Uncontrolled 지원
 * - 기존 Checkbox 컴포넌트 재사용
 * - React Hook Form Controller 연동 가능
 *
 * @example
 * // 기본 사용
 * <CheckboxGroup
 *   options={[
 *     { value: 'ACTIVE', label: '활성' },
 *     { value: 'SUSPENDED', label: '정지' },
 *   ]}
 *   value={selectedStatuses}
 *   onChange={setSelectedStatuses}
 * />
 *
 * @example
 * // React Hook Form Controller 연동
 * <Controller
 *   name="roles"
 *   control={control}
 *   render={({ field }) => (
 *     <CheckboxGroup
 *       options={roleOptions}
 *       value={field.value}
 *       onChange={field.onChange}
 *     />
 *   )}
 * />
 */

import React, { useState, useCallback, useId } from "react";
import { Checkbox } from "./Checkbox";
import { cn } from "../../utils/classUtils";

// ========================================
// Types
// ========================================

export interface CheckboxOption {
  /** 옵션 값 */
  value: string;
  /** 옵션 라벨 */
  label: string;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  /** 선택된 값 배열 (Controlled) */
  value?: string[];
  /** 기본 선택 값 배열 (Uncontrolled) */
  defaultValue?: string[];
  /** 옵션 목록 */
  options: CheckboxOption[];
  /** 값 변경 핸들러 */
  onChange?: (value: string[]) => void;
  /** 배치 방향 */
  direction?: "vertical" | "horizontal";
  /** 그룹 라벨 (접근성용) */
  label?: string;
  /** 전체 비활성화 */
  disabled?: boolean;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// CheckboxGroup Component
// ========================================

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value,
  defaultValue = [],
  options,
  onChange,
  direction = "vertical",
  label,
  disabled = false,
  className,
}) => {
  const groupId = useId();
  const labelId = `${groupId}-label`;

  // Controlled vs Uncontrolled
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue);
  const currentValue = isControlled ? value : internalValue;

  // 체크 상태 변경 핸들러
  const handleCheckChange = useCallback(
    (optionValue: string, checked: boolean) => {
      const newValue = checked
        ? [...currentValue, optionValue]
        : currentValue.filter((v) => v !== optionValue);

      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    },
    [currentValue, isControlled, onChange]
  );

  return (
    <div
      role="group"
      aria-labelledby={label ? labelId : undefined}
      className={cn(
        "flex",
        direction === "vertical"
          ? "flex-col gap-2"
          : "flex-row flex-wrap gap-4",
        className
      )}
    >
      {/* 그룹 라벨 (시각적으로 숨김, 스크린 리더용) */}
      {label && (
        <span id={labelId} className="sr-only">
          {label}
        </span>
      )}

      {options.map((option) => (
        <Checkbox
          key={option.value}
          label={option.label}
          checked={currentValue.includes(option.value)}
          onChange={(e) => handleCheckChange(option.value, e.target.checked)}
          disabled={disabled || option.disabled}
        />
      ))}
    </div>
  );
};

CheckboxGroup.displayName = "CheckboxGroup";
