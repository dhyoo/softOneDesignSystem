/**
 * SoftOne Design System(SDS) - Auth API
 * 작성: SoftOne Frontend Team
 *
 * 이 파일에서는 Role/Grade 기반 PermissionKey를 사용하여
 * 메뉴/페이지/버튼/액션의 표시/비활성화/숨김을 제어합니다.
 *
 * 인증 관련 API 호출.
 * 현재는 Mock 구현으로, 실제 백엔드 연동 시 교체합니다.
 */

import type { User } from "@core/store/authStore";
import type { Role, Grade } from "@core/auth/role.types";

// ========================================
// Types
// ========================================

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  role: Role;
  grade: Grade;
}

export interface AuthError {
  message: string;
  code: string;
}

// ========================================
// Mock Users (RBAC 포함)
// ========================================

interface MockUserData {
  password: string;
  user: User;
  role: Role;
  grade: Grade;
}

const MOCK_USERS: Record<string, MockUserData> = {
  // 시스템 관리자 (전체 권한)
  admin: {
    password: "admin123",
    user: {
      id: "1",
      name: "시스템 관리자",
      email: "admin@softone.co.kr",
      roles: ["ADMIN"],
    },
    role: "SYSTEM_ADMIN",
    grade: "EXECUTIVE",
  },

  // 조직 관리자
  orgadmin: {
    password: "orgadmin123",
    user: {
      id: "2",
      name: "조직 관리자",
      email: "orgadmin@softone.co.kr",
      roles: ["ADMIN"],
    },
    role: "ORG_ADMIN",
    grade: "TEAM_LEAD",
  },

  // 매니저
  manager: {
    password: "manager123",
    user: {
      id: "3",
      name: "김매니저",
      email: "manager@softone.co.kr",
      roles: ["MANAGER"],
    },
    role: "MANAGER",
    grade: "SENIOR",
  },

  // 일반 직원
  user: {
    password: "user123",
    user: {
      id: "4",
      name: "일반 직원",
      email: "user@softone.co.kr",
      roles: ["USER"],
    },
    role: "STAFF",
    grade: "JUNIOR",
  },

  // 인턴
  intern: {
    password: "intern123",
    user: {
      id: "5",
      name: "인턴",
      email: "intern@softone.co.kr",
      roles: ["USER"],
    },
    role: "STAFF",
    grade: "INTERN",
  },

  // 게스트
  guest: {
    password: "guest123",
    user: {
      id: "6",
      name: "게스트 사용자",
      email: "guest@softone.co.kr",
      roles: ["GUEST"],
    },
    role: "GUEST",
    grade: "INTERN",
  },
};

// ========================================
// Auth API Functions
// ========================================

/**
 * 로그인 API
 *
 * Mock 사용자:
 *   - admin/admin123 → SYSTEM_ADMIN / EXECUTIVE
 *   - orgadmin/orgadmin123 → ORG_ADMIN / TEAM_LEAD
 *   - manager/manager123 → MANAGER / SENIOR
 *   - user/user123 → STAFF / JUNIOR
 *   - intern/intern123 → STAFF / INTERN
 *   - guest/guest123 → GUEST / INTERN
 *
 * @param credentials 로그인 정보
 * @returns Promise<LoginResponse>
 */
export async function login(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  // 네트워크 지연 시뮬레이션 (0.5~1초)
  await new Promise((resolve) =>
    setTimeout(resolve, 500 + Math.random() * 500)
  );

  const { username, password } = credentials;

  // Mock 사용자 검증
  const mockUser = MOCK_USERS[username.toLowerCase()];

  if (!mockUser || mockUser.password !== password) {
    throw {
      message: "아이디 또는 비밀번호가 올바르지 않습니다.",
      code: "INVALID_CREDENTIALS",
    } as AuthError;
  }

  // Mock 토큰 생성
  const accessToken = `mock-token-${mockUser.user.id}-${Date.now()}`;

  return {
    user: mockUser.user,
    accessToken,
    role: mockUser.role,
    grade: mockUser.grade,
  };
}

/**
 * 로그아웃 API
 */
export async function logout(): Promise<void> {
  // 네트워크 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 300));

  // 실제 구현에서는 서버에 로그아웃 요청
  // await httpClient.post('/auth/logout');
}

/**
 * 토큰 갱신 API
 */
export async function refreshToken(): Promise<{ accessToken: string }> {
  // 네트워크 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock 구현: 새 토큰 반환
  return {
    accessToken: `mock-refreshed-token-${Date.now()}`,
  };
}

/**
 * 현재 사용자 정보 조회 API
 */
export async function getCurrentUser(): Promise<User | null> {
  // 실제 구현에서는 서버에서 현재 사용자 정보 조회
  // return await httpClient.get('/auth/me');

  // Mock: localStorage에서 사용자 정보 확인은 authStore에서 처리
  return null;
}

// ========================================
// 테스트/개발용 헬퍼
// ========================================

/**
 * 사용 가능한 테스트 계정 목록을 반환합니다.
 */
export function getTestAccounts(): Array<{
  username: string;
  password: string;
  role: Role;
  grade: Grade;
  description: string;
}> {
  return [
    {
      username: "admin",
      password: "admin123",
      role: "SYSTEM_ADMIN",
      grade: "EXECUTIVE",
      description: "시스템 관리자 (전체 권한)",
    },
    {
      username: "orgadmin",
      password: "orgadmin123",
      role: "ORG_ADMIN",
      grade: "TEAM_LEAD",
      description: "조직 관리자",
    },
    {
      username: "manager",
      password: "manager123",
      role: "MANAGER",
      grade: "SENIOR",
      description: "매니저",
    },
    {
      username: "user",
      password: "user123",
      role: "STAFF",
      grade: "JUNIOR",
      description: "일반 직원",
    },
    {
      username: "intern",
      password: "intern123",
      role: "STAFF",
      grade: "INTERN",
      description: "인턴",
    },
    {
      username: "guest",
      password: "guest123",
      role: "GUEST",
      grade: "INTERN",
      description: "게스트 (최소 권한)",
    },
  ];
}
