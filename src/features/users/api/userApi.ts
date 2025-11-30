/**
 * SoftOne Design System - User API
 * 작성: SoftOne Frontend Team
 * 설명: 리스트 화면 표준화를 위한 User API 및 TanStack Query 훅.
 *      이 패턴을 참고하여 다른 도메인(상품, 주문 등)의 API도 구현합니다.
 *
 * User API
 * - Mock Data + setTimeout으로 실제 API 동작 시뮬레이션
 * - useUserListQuery: TanStack Query 훅
 */

import { useQuery } from "@tanstack/react-query";
import type {
  User,
  UserListParams,
  UserListResponse,
  UserStatus,
} from "../model/user.types";

// ========================================
// Mock Data
// ========================================

const MOCK_USERS: User[] = [
  {
    id: "user-001",
    name: "김관리자",
    email: "admin@softone.co.kr",
    status: "ACTIVE",
    roles: ["ADMIN"],
    department: "IT기획팀",
    phone: "010-1234-5678",
    createdAt: "2023-01-15T09:00:00Z",
    lastLoginAt: "2024-11-29T14:30:00Z",
  },
  {
    id: "user-002",
    name: "이매니저",
    email: "manager@softone.co.kr",
    status: "ACTIVE",
    roles: ["MANAGER"],
    department: "영업팀",
    phone: "010-2345-6789",
    createdAt: "2023-03-20T10:30:00Z",
    lastLoginAt: "2024-11-28T11:20:00Z",
  },
  {
    id: "user-003",
    name: "박사용자",
    email: "user@softone.co.kr",
    status: "ACTIVE",
    roles: ["USER"],
    department: "마케팅팀",
    phone: "010-3456-7890",
    createdAt: "2023-05-10T14:00:00Z",
    lastLoginAt: "2024-11-27T09:45:00Z",
  },
  {
    id: "user-004",
    name: "최대기",
    email: "pending@softone.co.kr",
    status: "PENDING",
    roles: ["USER"],
    department: "개발팀",
    createdAt: "2024-11-25T08:00:00Z",
  },
  {
    id: "user-005",
    name: "정정지",
    email: "suspended@softone.co.kr",
    status: "SUSPENDED",
    roles: ["USER"],
    department: "인사팀",
    phone: "010-5678-9012",
    createdAt: "2023-06-01T11:00:00Z",
    lastLoginAt: "2024-10-15T16:30:00Z",
  },
  {
    id: "user-006",
    name: "한철수",
    email: "cheolsu.han@softone.co.kr",
    status: "ACTIVE",
    roles: ["USER"],
    department: "재무팀",
    phone: "010-6789-0123",
    createdAt: "2023-07-15T09:30:00Z",
    lastLoginAt: "2024-11-29T10:00:00Z",
  },
  {
    id: "user-007",
    name: "강영희",
    email: "younghee.kang@softone.co.kr",
    status: "ACTIVE",
    roles: ["MANAGER"],
    department: "CS팀",
    phone: "010-7890-1234",
    createdAt: "2023-08-20T13:00:00Z",
    lastLoginAt: "2024-11-28T15:45:00Z",
  },
  {
    id: "user-008",
    name: "윤민수",
    email: "minsu.yoon@softone.co.kr",
    status: "PENDING",
    roles: ["USER"],
    department: "개발팀",
    createdAt: "2024-11-20T10:00:00Z",
  },
  {
    id: "user-009",
    name: "서지은",
    email: "jieun.seo@softone.co.kr",
    status: "ACTIVE",
    roles: ["USER"],
    department: "디자인팀",
    phone: "010-8901-2345",
    createdAt: "2023-09-10T11:30:00Z",
    lastLoginAt: "2024-11-29T09:15:00Z",
  },
  {
    id: "user-010",
    name: "임동현",
    email: "donghyun.lim@softone.co.kr",
    status: "DELETED",
    roles: ["USER"],
    department: "영업팀",
    phone: "010-9012-3456",
    createdAt: "2023-02-01T08:00:00Z",
    lastLoginAt: "2024-09-01T14:00:00Z",
  },
  {
    id: "user-011",
    name: "조현아",
    email: "hyuna.cho@softone.co.kr",
    status: "ACTIVE",
    roles: ["USER", "MANAGER"],
    department: "QA팀",
    phone: "010-0123-4567",
    createdAt: "2023-10-05T14:30:00Z",
    lastLoginAt: "2024-11-29T11:30:00Z",
  },
  {
    id: "user-012",
    name: "배준혁",
    email: "junhyuk.bae@softone.co.kr",
    status: "SUSPENDED",
    roles: ["USER"],
    department: "물류팀",
    phone: "010-1234-5670",
    createdAt: "2023-11-15T09:00:00Z",
    lastLoginAt: "2024-08-20T10:00:00Z",
  },
  {
    id: "user-013",
    name: "신예진",
    email: "yejin.shin@softone.co.kr",
    status: "ACTIVE",
    roles: ["USER"],
    department: "마케팅팀",
    phone: "010-2345-6780",
    createdAt: "2023-12-01T10:00:00Z",
    lastLoginAt: "2024-11-28T16:00:00Z",
  },
  {
    id: "user-014",
    name: "오성민",
    email: "sungmin.oh@softone.co.kr",
    status: "PENDING",
    roles: ["USER"],
    department: "개발팀",
    createdAt: "2024-11-28T14:00:00Z",
  },
  {
    id: "user-015",
    name: "권다은",
    email: "daeun.kwon@softone.co.kr",
    status: "ACTIVE",
    roles: ["ADMIN", "MANAGER"],
    department: "IT기획팀",
    phone: "010-3456-7891",
    createdAt: "2024-01-10T09:00:00Z",
    lastLoginAt: "2024-11-29T13:00:00Z",
  },
];

// ========================================
// API Functions
// ========================================

/**
 * 사용자 목록 조회
 * Mock 구현: setTimeout으로 네트워크 지연 시뮬레이션
 */
export const getUsers = async (
  params: UserListParams
): Promise<UserListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredUsers = [...MOCK_USERS];

      // 상태 필터
      if (params.status) {
        filteredUsers = filteredUsers.filter(
          (user) => user.status === params.status
        );
      }

      // 키워드 검색 (이름, 이메일)
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user) =>
            user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword) ||
            (user.department && user.department.toLowerCase().includes(keyword))
        );
      }

      // 정렬
      if (params.sortField) {
        filteredUsers.sort((a, b) => {
          const aValue = a[params.sortField!];
          const bValue = b[params.sortField!];

          if (aValue === undefined || aValue === null) return 1;
          if (bValue === undefined || bValue === null) return -1;

          const comparison = String(aValue).localeCompare(String(bValue));
          return params.sortOrder === "desc" ? -comparison : comparison;
        });
      }

      // 전체 개수
      const total = filteredUsers.length;

      // 페이지네이션
      const startIndex = (params.page - 1) * params.pageSize;
      const endIndex = startIndex + params.pageSize;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

      resolve({
        data: paginatedUsers,
        total,
        page: params.page,
        pageSize: params.pageSize,
      });
    }, 500); // 500ms 지연
  });
};

/**
 * 사용자 상세 조회
 */
export const getUserById = async (id: string): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = MOCK_USERS.find((u) => u.id === id);
      resolve(user || null);
    }, 300);
  });
};

/**
 * 사용자 상태 변경
 */
export const updateUserStatus = async (
  id: string,
  status: UserStatus
): Promise<User | null> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userIndex = MOCK_USERS.findIndex((u) => u.id === id);
      if (userIndex === -1) {
        reject(new Error("사용자를 찾을 수 없습니다."));
        return;
      }
      MOCK_USERS[userIndex].status = status;
      resolve(MOCK_USERS[userIndex]);
    }, 300);
  });
};

// ========================================
// TanStack Query Hooks
// ========================================

/**
 * 사용자 목록 조회 Query 키
 */
export const USER_QUERY_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_QUERY_KEYS.all, "list"] as const,
  list: (params: UserListParams) =>
    [...USER_QUERY_KEYS.lists(), params] as const,
  details: () => [...USER_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USER_QUERY_KEYS.details(), id] as const,
};

/**
 * 사용자 목록 조회 훅
 *
 * @example
 * const { data, isLoading, error } = useUserListQuery({
 *   page: 1,
 *   pageSize: 10,
 *   status: "ACTIVE",
 *   keyword: "김",
 * });
 */
export const useUserListQuery = (params: UserListParams) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.list(params),
    queryFn: () => getUsers(params),
    staleTime: 1000 * 60 * 5, // 5분
    placeholderData: (previousData) => previousData, // 이전 데이터 유지
  });
};

/**
 * 사용자 상세 조회 훅
 */
export const useUserDetailQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: USER_QUERY_KEYS.detail(id),
    queryFn: () => getUserById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
