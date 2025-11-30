/**
 * SoftOne Design System - User Filter Form (Step 7 개선 버전)
 * 작성: SoftOne Frontend Team
 *
 * 중복 업무 감소:
 *   FormFieldWrapper를 사용하여 Label + Input 레이아웃 코드 간소화.
 *   CheckboxGroup을 사용하여 다중 상태 필터 로직 캡슐화.
 *   개발자는 필터 UI만 선언하면 되고, 레이아웃/스타일은 Core 컴포넌트에 위임.
 *
 * 설명: 리스트 화면 표준화를 위한 필터 폼 패턴.
 *      이 패턴을 참고하여 다른 도메인의 필터 폼도 구현합니다.
 *
 * UserFilterForm Component
 * - FormFieldWrapper로 일관된 폼 레이아웃
 * - CheckboxGroup으로 다중 상태 필터
 * - 검색/초기화 기능
 */

import React from "react";
import { Input } from "@core/components/ui/Input";
import { Select, type SelectOption } from "@core/components/ui/Select";
import { Button } from "@core/components/ui/Button";
import { FormFieldWrapper } from "@core/components/ui/FormFieldWrapper";
import { CheckboxGroup, type CheckboxOption } from "@core/components/ui/CheckboxGroup";
import { Search, RotateCcw } from "lucide-react";
import type {
  UserStatus,
  UserFilterFormValues,
} from "../model/user.types";
import { USER_STATUS_META } from "../model/user.types";

// ========================================
// Types
// ========================================

export interface UserFilterFormProps {
  /** 현재 필터 값 */
  values: UserFilterFormValues;
  /** 필터 변경 핸들러 */
  onChange: (values: UserFilterFormValues) => void;
  /** 검색 핸들러 */
  onSearch: () => void;
  /** 초기화 핸들러 */
  onReset: () => void;
  /** 로딩 상태 */
  loading?: boolean;
  /** 다중 상태 필터 사용 여부 (기본: false = 단일 선택) */
  useMultiStatusFilter?: boolean;
}

// ========================================
// Options
// ========================================

const STATUS_OPTIONS: SelectOption[] = [
  { value: "", label: "전체 상태" },
  ...Object.entries(USER_STATUS_META).map(([value, meta]) => ({
    value,
    label: meta.label,
  })),
];

const STATUS_CHECKBOX_OPTIONS: CheckboxOption[] = Object.entries(
  USER_STATUS_META
).map(([value, meta]) => ({
  value,
  label: meta.label,
}));

// ========================================
// UserFilterForm Component
// ========================================

export const UserFilterForm: React.FC<UserFilterFormProps> = ({
  values,
  onChange,
  onSearch,
  onReset,
  loading = false,
  useMultiStatusFilter = false,
}) => {
  // 필드 변경 핸들러
  const handleFieldChange = (
    field: keyof UserFilterFormValues,
    value: string | string[]
  ) => {
    onChange({
      ...values,
      [field]: value,
    });
  };

  // 엔터 키 검색
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="bg-softone-surface rounded-lg border border-softone-border p-4 mb-4">
      <div className="flex flex-wrap items-end gap-4">
        {/* 키워드 검색 - FormFieldWrapper 사용 */}
        <div className="flex-1 min-w-[200px]">
          <FormFieldWrapper label="검색">
            <Input
              placeholder="이름, 이메일, 부서로 검색"
              value={values.keyword}
              onChange={(e) => handleFieldChange("keyword", e.target.value)}
              onKeyDown={handleKeyDown}
              fullWidth
            />
          </FormFieldWrapper>
        </div>

        {/* 상태 필터 - 단일 선택 (Select) 또는 다중 선택 (CheckboxGroup) */}
        {useMultiStatusFilter ? (
          // 다중 상태 필터 (CheckboxGroup)
          <div className="w-auto">
            <FormFieldWrapper label="상태 (다중 선택)">
              <CheckboxGroup
                options={STATUS_CHECKBOX_OPTIONS}
                value={values.statuses || []}
                onChange={(selected) => handleFieldChange("statuses", selected)}
                direction="horizontal"
              />
            </FormFieldWrapper>
          </div>
        ) : (
          // 단일 상태 필터 (Select)
          <div className="w-[150px]">
            <FormFieldWrapper label="상태">
              <Select
                options={STATUS_OPTIONS}
                value={values.status}
                onChange={(e) =>
                  handleFieldChange("status", e.target.value as UserStatus | "")
                }
                fullWidth
              />
            </FormFieldWrapper>
          </div>
        )}

        {/* 버튼 그룹 */}
        <div className="flex gap-2 pb-1.5">
          <Button
            variant="primary"
            leftIcon={<Search className="w-4 h-4" />}
            onClick={onSearch}
            loading={loading}
          >
            검색
          </Button>
          <Button
            variant="outline"
            leftIcon={<RotateCcw className="w-4 h-4" />}
            onClick={onReset}
          >
            초기화
          </Button>
        </div>
      </div>

      {/* 선택된 다중 상태 표시 */}
      {useMultiStatusFilter && values.statuses && values.statuses.length > 0 && (
        <div className="mt-3 text-sm text-softone-text-secondary">
          선택된 상태:{" "}
          {values.statuses
            .map((s) => USER_STATUS_META[s as UserStatus]?.label || s)
            .join(", ")}
        </div>
      )}
    </div>
  );
};

UserFilterForm.displayName = "UserFilterForm";
