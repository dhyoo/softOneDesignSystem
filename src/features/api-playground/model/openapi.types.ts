/**
 * SoftOne Design System - API Playground Types
 * 작성: SoftOne Frontend Team
 *
 * 스펙 기반(Meta-driven) API Playground 타입 정의:
 *   Core의 OpenAPI 유틸리티 타입을 re-export하고,
 *   Feature 레벨에서 필요한 추가 타입을 정의.
 *
 * 주의: 도메인 지식 없이 순수 OpenAPI 스펙 처리에 집중
 */

// ========================================
// Re-export Core Types
// ========================================

export type {
  ApiOperationMeta,
  OpenApiParameterMeta,
  OpenApiFieldMeta,
  OpenApiRequestBodyMeta,
  OpenApiFieldType,
  ParameterIn,
} from "@core/utils/openapiUtils";

export {
  parseOpenApiSpec,
  extractParameters,
  extractRequestBodySchema,
  groupOperationsByTag,
  getMethodColor,
} from "@core/utils/openapiUtils";

// ========================================
// Playground State Types
// ========================================

/**
 * Swagger 스펙 로딩 상태
 */
export interface SwaggerSpecState {
  /** 스펙 URL */
  url: string;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 */
  error: string | null;
  /** 원본 스펙 */
  rawSpec: Record<string, unknown> | null;
  /** 파싱된 Operations */
  operations: import("@core/utils/openapiUtils").ApiOperationMeta[];
}

/**
 * API 요청 페이로드
 */
export interface ApiRequestPayload {
  /** Path 파라미터 */
  pathParams: Record<string, unknown>;
  /** Query 파라미터 */
  queryParams: Record<string, unknown>;
  /** Header 파라미터 */
  headerParams: Record<string, unknown>;
  /** Request Body */
  body: unknown;
}

/**
 * API 요청 결과
 */
export interface ApiRequestResult {
  /** 요청 성공 여부 */
  success: boolean;
  /** HTTP 상태 코드 */
  status: number;
  /** 상태 텍스트 */
  statusText: string;
  /** 응답 헤더 */
  headers: Record<string, string>;
  /** 응답 데이터 */
  data: unknown;
  /** 요청 시간 (ms) */
  duration: number;
  /** 에러 메시지 */
  error?: string;
}

/**
 * 요청 미리보기 데이터
 */
export interface RequestPreview {
  /** 최종 URL */
  url: string;
  /** HTTP 메서드 */
  method: string;
  /** 요청 헤더 */
  headers: Record<string, string>;
  /** 요청 바디 */
  body: unknown | null;
}

// ========================================
// Form State Types
// ========================================

/**
 * API 폼 필드 값 타입
 */
export type FormFieldValue = string | number | boolean | null | undefined;

/**
 * API 폼 값
 */
export interface ApiFormValues {
  /** Path 파라미터 */
  pathParams: Record<string, FormFieldValue>;
  /** Query 파라미터 */
  queryParams: Record<string, FormFieldValue>;
  /** Header 파라미터 */
  headerParams: Record<string, FormFieldValue>;
  /** Body JSON 문자열 또는 객체 */
  body: string | Record<string, FormFieldValue>;
}

// ========================================
// UI Config Types
// ========================================

/**
 * Endpoint 표시 설정
 */
export interface EndpointDisplayConfig {
  /** 태그별 그룹화 */
  groupByTag?: boolean;
  /** 검색 가능 */
  searchable?: boolean;
  /** 필터링할 태그 */
  filterTags?: string[];
}

/**
 * HTTP 메서드 색상 매핑
 */
export const HTTP_METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-100 text-green-800 border-green-200",
  POST: "bg-blue-100 text-blue-800 border-blue-200",
  PUT: "bg-yellow-100 text-yellow-800 border-yellow-200",
  PATCH: "bg-cyan-100 text-cyan-800 border-cyan-200",
  DELETE: "bg-red-100 text-red-800 border-red-200",
  OPTIONS: "bg-gray-100 text-gray-800 border-gray-200",
  HEAD: "bg-gray-100 text-gray-800 border-gray-200",
};

/**
 * HTTP 메서드 Badge variant 매핑
 */
export const HTTP_METHOD_VARIANTS: Record<string, import("@core/components/ui/Badge").BadgeVariant> = {
  GET: "success",
  POST: "primary",
  PUT: "warning",
  PATCH: "info",
  DELETE: "danger",
  OPTIONS: "neutral",
  HEAD: "neutral",
};

