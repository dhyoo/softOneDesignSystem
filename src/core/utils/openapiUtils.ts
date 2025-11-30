/**
 * SoftOne Design System - OpenAPI Utilities
 * 작성: SoftOne Frontend Team
 *
 * 스펙 기반(Meta-driven) UI 생성:
 *   OpenAPI/Swagger JSON 스펙을 파싱하여 엔드포인트, 파라미터, 스키마 메타데이터를 추출.
 *   이를 통해 개발자가 API 폼/파라미터를 하드코딩하지 않고 동적으로 생성 가능.
 *
 * 주의사항:
 *   - OpenAPI 3.0 기준으로 구현
 *   - allOf/oneOf/anyOf 등 복잡한 스키마는 1차 버전에서 단순 처리
 *   - $ref 참조는 스펙 로딩 시 사전 resolve 권장 (swagger-client 등 사용)
 */

// ========================================
// Types
// ========================================

/**
 * 필드 타입
 */
export type OpenApiFieldType = "string" | "number" | "integer" | "boolean" | "object" | "array";

/**
 * 파라미터 위치
 */
export type ParameterIn = "path" | "query" | "header" | "cookie";

/**
 * 파라미터 메타데이터
 */
export interface OpenApiParameterMeta {
  /** 파라미터 이름 */
  name: string;
  /** 파라미터 위치 */
  in: ParameterIn;
  /** 데이터 타입 */
  type: OpenApiFieldType;
  /** 필수 여부 */
  required: boolean;
  /** 설명 */
  description?: string;
  /** Enum 값들 */
  enumValues?: string[];
  /** 기본값 */
  defaultValue?: unknown;
  /** 예제 값 */
  example?: unknown;
}

/**
 * 필드 메타데이터 (Request Body 스키마용)
 */
export interface OpenApiFieldMeta {
  /** 필드 이름 */
  name: string;
  /** 데이터 타입 */
  type: OpenApiFieldType;
  /** 필수 여부 */
  required: boolean;
  /** 설명 */
  description?: string;
  /** Enum 값들 */
  enumValues?: string[];
  /** 기본값 */
  defaultValue?: unknown;
  /** 예제 값 */
  example?: unknown;
  /** 중첩 객체의 프로퍼티들 */
  properties?: OpenApiFieldMeta[];
  /** 배열 아이템 타입 */
  items?: OpenApiFieldMeta;
}

/**
 * Request Body 메타데이터
 */
export interface OpenApiRequestBodyMeta {
  /** 필수 여부 */
  required: boolean;
  /** 설명 */
  description?: string;
  /** Content-Type */
  contentType: string;
  /** 스키마 필드들 */
  fields: OpenApiFieldMeta[];
  /** 원본 스키마 (JSON textarea 입력용) */
  rawSchema?: Record<string, unknown>;
}

/**
 * API Operation 메타데이터
 */
export interface ApiOperationMeta {
  /** 고유 ID (예: "GET /users") */
  id: string;
  /** HTTP 메서드 */
  method: string;
  /** 경로 */
  path: string;
  /** 요약 */
  summary?: string;
  /** 상세 설명 */
  description?: string;
  /** 태그 */
  tags?: string[];
  /** 파라미터들 */
  parameters: OpenApiParameterMeta[];
  /** Request Body */
  requestBody: OpenApiRequestBodyMeta | null;
  /** operationId */
  operationId?: string;
}

// ========================================
// Schema Helpers
// ========================================

/**
 * OpenAPI 스키마에서 타입 추출
 */
function extractType(schema: Record<string, unknown>): OpenApiFieldType {
  const type = schema.type as string;

  if (type === "integer") return "integer";
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";
  if (type === "array") return "array";
  if (type === "object" || schema.properties) return "object";

  return "string";
}

/**
 * $ref 참조 해결 (간단 버전)
 * 주의: 실제 프로덕션에서는 swagger-client나 @apidevtools/swagger-parser 사용 권장
 */
function resolveRef(spec: Record<string, unknown>, ref: string): Record<string, unknown> | null {
  if (!ref.startsWith("#/")) return null;

  const parts = ref.slice(2).split("/");
  let current: unknown = spec;

  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return null;
    }
  }

  return current as Record<string, unknown>;
}

/**
 * 스키마에서 필드 메타데이터 추출
 */
function extractFieldMeta(
  name: string,
  schema: Record<string, unknown>,
  spec: Record<string, unknown>,
  requiredFields: string[] = []
): OpenApiFieldMeta {
  // $ref 해결
  let resolvedSchema = schema;
  if (schema.$ref) {
    const resolved = resolveRef(spec, schema.$ref as string);
    if (resolved) {
      resolvedSchema = resolved;
    }
  }

  // allOf 처리 (간단 버전 - 첫 번째 스키마만 사용)
  if (resolvedSchema.allOf && Array.isArray(resolvedSchema.allOf)) {
    const merged: Record<string, unknown> = {};
    for (const subSchema of resolvedSchema.allOf as Record<string, unknown>[]) {
      const resolved = subSchema.$ref
        ? resolveRef(spec, subSchema.$ref as string) || subSchema
        : subSchema;
      Object.assign(merged, resolved);
    }
    resolvedSchema = merged;
  }

  const type = extractType(resolvedSchema);
  const field: OpenApiFieldMeta = {
    name,
    type,
    required: requiredFields.includes(name),
    description: resolvedSchema.description as string | undefined,
    enumValues: resolvedSchema.enum as string[] | undefined,
    defaultValue: resolvedSchema.default,
    example: resolvedSchema.example,
  };

  // Object 타입의 중첩 프로퍼티 추출
  if (type === "object" && resolvedSchema.properties) {
    const nestedRequired = (resolvedSchema.required as string[]) || [];
    field.properties = Object.entries(
      resolvedSchema.properties as Record<string, Record<string, unknown>>
    ).map(([propName, propSchema]) =>
      extractFieldMeta(propName, propSchema, spec, nestedRequired)
    );
  }

  // Array 타입의 아이템 스키마 추출
  if (type === "array" && resolvedSchema.items) {
    field.items = extractFieldMeta(
      "item",
      resolvedSchema.items as Record<string, unknown>,
      spec
    );
  }

  return field;
}

// ========================================
// Parameter Extraction
// ========================================

/**
 * 파라미터 메타데이터 추출
 */
export function extractParameters(
  parameters: Record<string, unknown>[] | undefined,
  spec: Record<string, unknown>
): OpenApiParameterMeta[] {
  if (!parameters) return [];

  return parameters.map((param) => {
    // $ref 해결
    let resolvedParam = param;
    if (param.$ref) {
      const resolved = resolveRef(spec, param.$ref as string);
      if (resolved) {
        resolvedParam = resolved;
      }
    }

    const schema = (resolvedParam.schema as Record<string, unknown>) || {};

    return {
      name: resolvedParam.name as string,
      in: resolvedParam.in as ParameterIn,
      type: extractType(schema),
      required: (resolvedParam.required as boolean) || false,
      description: resolvedParam.description as string | undefined,
      enumValues: schema.enum as string[] | undefined,
      defaultValue: schema.default,
      example: resolvedParam.example ?? schema.example,
    };
  });
}

/**
 * Request Body 스키마 추출
 */
export function extractRequestBodySchema(
  requestBody: Record<string, unknown> | undefined,
  spec: Record<string, unknown>
): OpenApiRequestBodyMeta | null {
  if (!requestBody) return null;

  // $ref 해결
  let resolvedBody = requestBody;
  if (requestBody.$ref) {
    const resolved = resolveRef(spec, requestBody.$ref as string);
    if (resolved) {
      resolvedBody = resolved;
    }
  }

  const content = resolvedBody.content as Record<string, Record<string, unknown>> | undefined;
  if (!content) return null;

  // application/json 우선, 없으면 첫 번째 content-type
  const contentType =
    "application/json" in content
      ? "application/json"
      : Object.keys(content)[0];

  if (!contentType) return null;

  const mediaType = content[contentType];
  const schema = mediaType?.schema as Record<string, unknown>;

  if (!schema) return null;

  // 스키마 해결
  let resolvedSchema = schema;
  if (schema.$ref) {
    const resolved = resolveRef(spec, schema.$ref as string);
    if (resolved) {
      resolvedSchema = resolved;
    }
  }

  const requiredFields = (resolvedSchema.required as string[]) || [];
  const properties = resolvedSchema.properties as Record<string, Record<string, unknown>> | undefined;

  const fields: OpenApiFieldMeta[] = properties
    ? Object.entries(properties).map(([name, propSchema]) =>
        extractFieldMeta(name, propSchema, spec, requiredFields)
      )
    : [];

  return {
    required: (resolvedBody.required as boolean) || false,
    description: resolvedBody.description as string | undefined,
    contentType,
    fields,
    rawSchema: resolvedSchema,
  };
}

// ========================================
// Main Parser
// ========================================

/**
 * OpenAPI 스펙 파싱하여 ApiOperationMeta 배열 반환
 */
export function parseOpenApiSpec(spec: Record<string, unknown>): ApiOperationMeta[] {
  const operations: ApiOperationMeta[] = [];
  const paths = spec.paths as Record<string, Record<string, Record<string, unknown>>> | undefined;

  if (!paths) return operations;

  const httpMethods = ["get", "post", "put", "patch", "delete", "options", "head"];

  for (const [path, pathItem] of Object.entries(paths)) {
    // Path-level 파라미터
    const pathParameters = (pathItem.parameters as unknown) as Record<string, unknown>[] | undefined;

    for (const method of httpMethods) {
      const operation = pathItem[method];
      if (!operation) continue;

      // Operation-level 파라미터 + Path-level 파라미터 병합
      const operationParameters = operation.parameters as Record<string, unknown>[] | undefined;
      const allParameters = [...(pathParameters || []), ...(operationParameters || [])];

      const operationMeta: ApiOperationMeta = {
        id: `${method.toUpperCase()} ${path}`,
        method: method.toUpperCase(),
        path,
        summary: operation.summary as string | undefined,
        description: operation.description as string | undefined,
        tags: operation.tags as string[] | undefined,
        operationId: operation.operationId as string | undefined,
        parameters: extractParameters(allParameters, spec),
        requestBody: extractRequestBodySchema(
          operation.requestBody as Record<string, unknown> | undefined,
          spec
        ),
      };

      operations.push(operationMeta);
    }
  }

  // 경로순 정렬
  operations.sort((a, b) => {
    const pathCompare = a.path.localeCompare(b.path);
    if (pathCompare !== 0) return pathCompare;
    return a.method.localeCompare(b.method);
  });

  return operations;
}

/**
 * 태그별로 Operation 그룹화
 */
export function groupOperationsByTag(
  operations: ApiOperationMeta[]
): Record<string, ApiOperationMeta[]> {
  const grouped: Record<string, ApiOperationMeta[]> = {};

  for (const op of operations) {
    const tags = op.tags?.length ? op.tags : ["default"];
    for (const tag of tags) {
      if (!grouped[tag]) {
        grouped[tag] = [];
      }
      grouped[tag].push(op);
    }
  }

  return grouped;
}

/**
 * HTTP 메서드별 색상 반환
 */
export function getMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: "success",
    POST: "primary",
    PUT: "warning",
    PATCH: "info",
    DELETE: "danger",
    OPTIONS: "neutral",
    HEAD: "neutral",
  };
  return colors[method.toUpperCase()] || "neutral";
}

