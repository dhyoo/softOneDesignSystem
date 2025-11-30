/**
 * SoftOne Design System - User Types
 * 작성: SoftOne Frontend Team
 * 설명: 리스트 화면 표준화를 위한 User 도메인 타입 정의.
 *      이 패턴을 참고하여 다른 도메인(상품, 주문 등)의 타입도 정의합니다.
 *
 * User Model Types
 * - User: 사용자 엔티티
 * - UserStatus: enumUtils와 연동된 상태 Enum
 * - UserListParams: 목록 조회 파라미터
 * - UserListResponse: 목록 조회 응답
 */

import type { BadgeVariant } from "@core/components/ui/Badge";

// ========================================
// User Status Enum
// ========================================

/**
 * 사용자 상태 코드
 * enumUtils의 Status 타입과 연동됩니다.
 */
export type UserStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "DELETED";

/**
 * 사용자 상태 메타데이터
 * 레이블, 색상 등을 정의하여 Badge와 연동합니다.
 */
export const USER_STATUS_META: Record<
  UserStatus,
  { label: string; variant: BadgeVariant }
> = {
  PENDING: { label: "대기", variant: "warning" },
  ACTIVE: { label: "활성", variant: "success" },
  SUSPENDED: { label: "정지", variant: "danger" },
  DELETED: { label: "삭제", variant: "neutral" },
};

// ========================================
// User Entity
// ========================================

export interface User {
  /** 사용자 고유 ID */
  id: string;
  /** 이름 */
  name: string;
  /** 이메일 */
  email: string;
  /** 상태 */
  status: UserStatus;
  /** 역할 */
  roles: string[];
  /** 부서 */
  department?: string;
  /** 전화번호 */
  phone?: string;
  /** 생성일 */
  createdAt: string;
  /** 마지막 로그인 일시 */
  lastLoginAt?: string;
  /** 프로필 이미지 URL */
  avatarUrl?: string;
}

// ========================================
// API Request/Response Types
// ========================================

/**
 * 사용자 목록 조회 파라미터
 */
export interface UserListParams {
  /** 현재 페이지 (1부터 시작) */
  page: number;
  /** 페이지당 항목 수 */
  pageSize: number;
  /** 상태 필터 */
  status?: UserStatus | "";
  /** 검색 키워드 (이름, 이메일) */
  keyword?: string;
  /** 정렬 필드 */
  sortField?: keyof User;
  /** 정렬 방향 */
  sortOrder?: "asc" | "desc";
}

/**
 * 사용자 목록 조회 응답
 */
export interface UserListResponse {
  /** 사용자 목록 */
  data: User[];
  /** 전체 항목 수 */
  total: number;
  /** 현재 페이지 */
  page: number;
  /** 페이지당 항목 수 */
  pageSize: number;
}

/**
 * 사용자 생성/수정 DTO
 */
export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  status: UserStatus;
  roles: string[];
  department?: string;
  phone?: string;
}

// ========================================
// Filter Form Types
// ========================================

/**
 * 사용자 필터 폼 값
 */
export interface UserFilterFormValues {
  keyword: string;
  status: UserStatus | "";
  /** 다중 상태 필터 (Step 7 CheckboxGroup용) */
  statuses?: UserStatus[];
}

/**
 * 기본 필터 값
 */
export const DEFAULT_USER_FILTER: UserFilterFormValues = {
  keyword: "",
  status: "",
};

/**
 * 기본 페이지네이션
 */
export const DEFAULT_USER_PAGINATION = {
  page: 1,
  pageSize: 10,
};
