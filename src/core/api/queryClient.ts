/**
 * SoftOne Design System - Query Client
 * TanStack Query v5 기본 설정
 */

import { QueryClient } from "@tanstack/react-query";

// ========================================
// Query Client Configuration
// ========================================

/**
 * 기본 QueryClient 인스턴스
 *
 * 설정 옵션:
 * - staleTime: 데이터가 "신선한" 상태로 유지되는 시간
 * - gcTime: 사용되지 않는 데이터가 메모리에 유지되는 시간 (구 cacheTime)
 * - retry: 실패 시 재시도 횟수
 * - refetchOnWindowFocus: 창 포커스 시 재요청 여부
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 5분간 데이터를 신선한 상태로 유지
      staleTime: 1000 * 60 * 5,

      // 10분간 캐시 유지
      gcTime: 1000 * 60 * 10,

      // 실패 시 1회 재시도
      retry: 1,

      // 창 포커스 시 자동 재요청 비활성화 (Admin에서는 명시적 요청 선호)
      refetchOnWindowFocus: false,

      // 재연결 시 자동 재요청
      refetchOnReconnect: true,
    },
    mutations: {
      // Mutation은 재시도하지 않음
      retry: 0,

      // 에러 발생 시 자동 롤백하지 않음 (명시적 처리)
      // onError: (error) => { ... }
    },
  },
});

// ========================================
// Query Keys Factory
// ========================================

/**
 * 타입 안전한 Query Key 생성을 위한 팩토리
 *
 * @example
 * // users 도메인의 쿼리 키
 * export const userKeys = {
 *   all: ['users'] as const,
 *   lists: () => [...userKeys.all, 'list'] as const,
 *   list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
 *   details: () => [...userKeys.all, 'detail'] as const,
 *   detail: (id: string) => [...userKeys.details(), id] as const,
 * };
 *
 * // 사용
 * useQuery({ queryKey: userKeys.list({ page: 1 }), queryFn: fetchUsers });
 */
export function createQueryKeys<T extends string>(domain: T) {
  return {
    all: [domain] as const,
    lists: () => [domain, "list"] as const,
    list: <F>(filters: F) => [domain, "list", filters] as const,
    details: () => [domain, "detail"] as const,
    detail: (id: string | number) => [domain, "detail", id] as const,
  };
}

// ========================================
// Query Invalidation Helpers
// ========================================

/**
 * 특정 도메인의 모든 쿼리 무효화
 */
export function invalidateQueries(domain: string) {
  return queryClient.invalidateQueries({ queryKey: [domain] });
}

/**
 * 특정 쿼리 키 무효화
 */
export function invalidateQueryKey(queryKey: readonly unknown[]) {
  return queryClient.invalidateQueries({ queryKey });
}

/**
 * 모든 쿼리 리패치
 */
export function refetchAllQueries() {
  return queryClient.refetchQueries();
}

// Default export
export default queryClient;

