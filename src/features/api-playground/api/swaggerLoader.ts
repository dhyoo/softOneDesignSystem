/**
 * SoftOne Design System - Swagger Loader
 * 작성: SoftOne Frontend Team
 *
 * 스펙 기반(Meta-driven) API Playground 지원:
 *   Swagger/OpenAPI JSON 스펙을 URL로부터 로딩하고,
 *   React Query로 캐싱하여 반복 요청 방지.
 *
 * 주의사항:
 *   - CORS 이슈가 있는 외부 스펙은 프록시 필요
 *   - 대용량 스펙 로딩 시 성능 고려 필요
 */

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  parseOpenApiSpec,
  type ApiOperationMeta,
} from "@core/utils/openapiUtils";

// ========================================
// Types
// ========================================

export interface OpenApiSpecResult {
  /** 원본 스펙 */
  rawSpec: Record<string, unknown>;
  /** 파싱된 Operations */
  operations: ApiOperationMeta[];
  /** 스펙 버전 */
  version: string;
  /** API 정보 */
  info: {
    title: string;
    version: string;
    description?: string;
  };
  /** 서버 목록 */
  servers: Array<{
    url: string;
    description?: string;
  }>;
}

// ========================================
// Loader Functions
// ========================================

/**
 * OpenAPI 스펙 URL에서 JSON 로드
 */
export async function loadOpenApiSpec(
  swaggerUrl: string
): Promise<Record<string, unknown>> {
  const response = await axios.get(swaggerUrl, {
    headers: {
      Accept: "application/json",
    },
    // CORS 프록시가 필요한 경우를 위한 타임아웃
    timeout: 30000,
  });

  return response.data;
}

/**
 * 스펙 로드 및 파싱
 */
export async function loadAndParseSpec(
  swaggerUrl: string
): Promise<OpenApiSpecResult> {
  const rawSpec = await loadOpenApiSpec(swaggerUrl);
  const operations = parseOpenApiSpec(rawSpec);

  // 스펙 정보 추출
  const info = rawSpec.info as Record<string, unknown> | undefined;
  const servers = (rawSpec.servers as Array<Record<string, unknown>>) || [];

  // OpenAPI 버전 확인
  const version =
    (rawSpec.openapi as string) || (rawSpec.swagger as string) || "unknown";

  return {
    rawSpec,
    operations,
    version,
    info: {
      title: (info?.title as string) || "Unknown API",
      version: (info?.version as string) || "1.0.0",
      description: info?.description as string | undefined,
    },
    servers: servers.map((s) => ({
      url: s.url as string,
      description: s.description as string | undefined,
    })),
  };
}

// ========================================
// React Query Hooks
// ========================================

/**
 * OpenAPI 스펙 로딩 훅
 *
 * @example
 * const { data, isLoading, error } = useOpenApiSpecQuery("https://petstore.swagger.io/v2/swagger.json");
 */
export function useOpenApiSpecQuery(swaggerUrl: string | null) {
  return useQuery<OpenApiSpecResult, Error>({
    queryKey: ["openapi-spec", swaggerUrl],
    queryFn: () => loadAndParseSpec(swaggerUrl!),
    enabled: !!swaggerUrl && swaggerUrl.length > 0,
    staleTime: 5 * 60 * 1000, // 5분간 캐시
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

/**
 * 스펙 프리페치 (선택적)
 */
export function prefetchOpenApiSpec(
  queryClient: import("@tanstack/react-query").QueryClient,
  swaggerUrl: string
) {
  return queryClient.prefetchQuery({
    queryKey: ["openapi-spec", swaggerUrl],
    queryFn: () => loadAndParseSpec(swaggerUrl),
    staleTime: 5 * 60 * 1000,
  });
}

