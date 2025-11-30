/**
 * SoftOne Design System - API Param Form
 * 작성: SoftOne Frontend Team
 *
 * 스펙 기반(Meta-driven) API Playground 지원:
 *   OpenAPI 스펙의 파라미터/Request Body 스키마를 기반으로
 *   자동으로 폼 필드를 생성하여 개발자 하드코딩 최소화.
 *
 * 중복 업무 감소:
 *   - Path/Query/Header 파라미터별 폼 필드 자동 생성
 *   - Enum 값은 Select로, Boolean은 Checkbox로 자동 변환
 *   - Request Body는 JSON 입력 또는 필드별 입력 지원
 *
 * 제한사항 (1차 버전):
 *   - 중첩 객체는 JSON textarea로 입력 (향후 재귀 폼 지원 예정)
 *   - allOf/oneOf 복합 스키마는 단순 처리
 */

import React, { useEffect, useMemo, useState } from "react";
import { Play, RotateCcw } from "lucide-react";

import { Card, CardHeader, CardTitle, CardBody } from "@core/components/ui/Card";
import { Input } from "@core/components/ui/Input";
import { Select } from "@core/components/ui/Select";
import { Checkbox } from "@core/components/ui/Checkbox";
import { Button } from "@core/components/ui/Button";
import { FormFieldWrapper } from "@core/components/ui/FormFieldWrapper";
import { cn } from "@core/utils/classUtils";
import type {
  ApiOperationMeta,
  OpenApiParameterMeta,
  OpenApiFieldMeta,
} from "@core/utils/openapiUtils";
import type { ApiRequestPayload } from "../model/openapi.types";

// ========================================
// Types
// ========================================

export interface ApiParamFormProps {
  /** 선택된 Operation */
  operation: ApiOperationMeta;
  /** 폼 제출 핸들러 */
  onSubmit: (payload: ApiRequestPayload) => void;
  /** 로딩 상태 */
  loading?: boolean;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// Form State Types
// ========================================

interface FormState {
  pathParams: Record<string, string>;
  queryParams: Record<string, string>;
  headerParams: Record<string, string>;
  body: string;
}

// ========================================
// Parameter Field Component
// ========================================

interface ParamFieldProps {
  param: OpenApiParameterMeta;
  value: string;
  onChange: (value: string) => void;
}

const ParamField: React.FC<ParamFieldProps> = ({
  param,
  value,
  onChange,
}) => {
  // Enum 값이 있으면 Select
  if (param.enumValues && param.enumValues.length > 0) {
    return (
      <FormFieldWrapper
        label={param.name}
        required={param.required}
        description={param.description}
      >
        <Select
          options={[
            { value: "", label: "선택..." },
            ...param.enumValues.map((v) => ({ value: v, label: v })),
          ]}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          fullWidth
        />
      </FormFieldWrapper>
    );
  }

  // Boolean은 Checkbox
  if (param.type === "boolean") {
    return (
      <FormFieldWrapper
        label={param.name}
        required={param.required}
        description={param.description}
      >
        <Checkbox
          checked={value === "true"}
          onChange={(e) => onChange(e.target.checked ? "true" : "false")}
          label="활성화"
        />
      </FormFieldWrapper>
    );
  }

  // 기본 Input
  return (
    <FormFieldWrapper
      label={param.name}
      required={param.required}
      description={param.description}
    >
      <Input
        type={param.type === "integer" || param.type === "number" ? "number" : "text"}
        placeholder={param.example ? String(param.example) : `Enter ${param.name}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
      />
    </FormFieldWrapper>
  );
};

// ========================================
// Request Body Field Component
// ========================================

interface BodyFieldProps {
  fields: OpenApiFieldMeta[];
  value: string;
  onChange: (value: string) => void;
}

/**
 * Request Body 필드 렌더링
 * 1차 버전: JSON textarea로 입력
 * TODO: 향후 필드별 입력 지원
 */
const BodyField: React.FC<BodyFieldProps> = ({ fields, value, onChange }) => {
  // 필드들의 예제 JSON 생성
  const exampleJson = useMemo(() => {
    const example: Record<string, unknown> = {};
    for (const field of fields) {
      if (field.example !== undefined) {
        example[field.name] = field.example;
      } else if (field.defaultValue !== undefined) {
        example[field.name] = field.defaultValue;
      } else {
        switch (field.type) {
          case "string":
            example[field.name] = "";
            break;
          case "number":
          case "integer":
            example[field.name] = 0;
            break;
          case "boolean":
            example[field.name] = false;
            break;
          case "array":
            example[field.name] = [];
            break;
          case "object":
            example[field.name] = {};
            break;
        }
      }
    }
    return JSON.stringify(example, null, 2);
  }, [fields]);

  return (
    <FormFieldWrapper
      label="Request Body (JSON)"
      description="JSON 형식으로 요청 본문을 입력하세요. 중첩 객체도 지원됩니다."
    >
      <textarea
        className={cn(
          "w-full min-h-[200px] p-3 font-mono text-sm",
          "bg-softone-surface border border-softone-border rounded-md",
          "focus:outline-none focus:ring-2 focus:ring-softone-primary/20 focus:border-softone-primary",
          "resize-y"
        )}
        value={value || exampleJson}
        onChange={(e) => onChange(e.target.value)}
        placeholder={exampleJson}
      />
    </FormFieldWrapper>
  );
};

// ========================================
// ApiParamForm Component
// ========================================

export const ApiParamForm: React.FC<ApiParamFormProps> = ({
  operation,
  onSubmit,
  loading = false,
  className,
}) => {
  // 폼 상태 (단순 state 기반)
  const [formState, setFormState] = useState<FormState>({
    pathParams: {},
    queryParams: {},
    headerParams: {},
    body: "",
  });

  // Operation 변경 시 폼 리셋
  useEffect(() => {
    setFormState({
      pathParams: {},
      queryParams: {},
      headerParams: {},
      body: "",
    });
  }, [operation.id]);

  // 파라미터 분류
  const pathParams = operation.parameters.filter((p) => p.in === "path");
  const queryParams = operation.parameters.filter((p) => p.in === "query");
  const headerParams = operation.parameters.filter((p) => p.in === "header");
  const hasRequestBody = !!operation.requestBody;

  // 값 변경 핸들러
  const handleParamChange = (
    category: "pathParams" | "queryParams" | "headerParams",
    name: string,
    value: string
  ) => {
    setFormState((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [name]: value,
      },
    }));
  };

  const handleBodyChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      body: value,
    }));
  };

  // 폼 제출
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let body: unknown = null;

    if (formState.body && formState.body.trim()) {
      try {
        body = JSON.parse(formState.body);
      } catch {
        body = formState.body; // 파싱 실패 시 문자열로 전송
      }
    }

    onSubmit({
      pathParams: formState.pathParams,
      queryParams: formState.queryParams,
      headerParams: formState.headerParams,
      body,
    });
  };

  // 리셋 핸들러
  const handleReset = () => {
    setFormState({
      pathParams: {},
      queryParams: {},
      headerParams: {},
      body: "",
    });
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className={cn("space-y-4", className)}
    >
      {/* Path 파라미터 */}
      {pathParams.length > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Path Parameters</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {pathParams.map((param) => (
              <ParamField
                key={param.name}
                param={param}
                value={formState.pathParams[param.name] || ""}
                onChange={(value) => handleParamChange("pathParams", param.name, value)}
              />
            ))}
          </CardBody>
        </Card>
      )}

      {/* Query 파라미터 */}
      {queryParams.length > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Query Parameters</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {queryParams.map((param) => (
              <ParamField
                key={param.name}
                param={param}
                value={formState.queryParams[param.name] || ""}
                onChange={(value) => handleParamChange("queryParams", param.name, value)}
              />
            ))}
          </CardBody>
        </Card>
      )}

      {/* Header 파라미터 */}
      {headerParams.length > 0 && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">Header Parameters</CardTitle>
          </CardHeader>
          <CardBody className="space-y-3">
            {headerParams.map((param) => (
              <ParamField
                key={param.name}
                param={param}
                value={formState.headerParams[param.name] || ""}
                onChange={(value) => handleParamChange("headerParams", param.name, value)}
              />
            ))}
          </CardBody>
        </Card>
      )}

      {/* Request Body */}
      {hasRequestBody && operation.requestBody && (
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm">
              Request Body
              {operation.requestBody.required && (
                <span className="text-softone-danger ml-1">*</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardBody>
            <BodyField
              fields={operation.requestBody.fields}
              value={formState.body}
              onChange={handleBodyChange}
            />
          </CardBody>
        </Card>
      )}

      {/* 파라미터 없음 안내 */}
      {pathParams.length === 0 &&
        queryParams.length === 0 &&
        headerParams.length === 0 &&
        !hasRequestBody && (
          <Card>
            <CardBody className="py-8 text-center text-softone-text-muted">
              이 엔드포인트는 파라미터가 필요하지 않습니다.
            </CardBody>
          </Card>
        )}

      {/* 액션 버튼 */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          disabled={loading}
          leftIcon={<RotateCcw className="w-4 h-4" />}
        >
          초기화
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          leftIcon={<Play className="w-4 h-4" />}
        >
          실행
        </Button>
      </div>
    </form>
  );
};

ApiParamForm.displayName = "ApiParamForm";
