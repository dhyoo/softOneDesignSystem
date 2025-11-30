/**
 * SoftOne Design System(SDS) - HTTP Client
 * 작성: SoftOne Frontend Team
 * 설명: Axios 기반 HTTP 클라이언트.
 *      Request Interceptor에서 인증 토큰을 자동 주입하고,
 *      Response Interceptor에서 401 에러 시 로그아웃을 처리합니다.
 *
 * 참고: 로그인 페이지로의 리다이렉트는 SPA Shell의 ProtectedRoute에서 처리합니다.
 *
 * Grid Samples Lab – Backend Mock 연동:
 *   개발 환경에서 VITE_API_BASE_URL 또는 VITE_MOCK_API_URL을 설정하여
 *   Mock 서버(http://localhost:3001)와 통신할 수 있습니다.
 *
 *   .env.development 예시:
 *     VITE_API_BASE_URL=http://localhost:3001
 */

import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
} from "axios";
import { useAuthStore } from "../store/authStore";

// ========================================
// HTTP Client Configuration
// ========================================

/**
 * Base URL 결정 우선순위:
 * 1. VITE_API_BASE_URL (환경변수)
 * 2. VITE_MOCK_API_URL (Mock 서버용)
 * 3. 기본값: http://localhost:3000
 *
 * Mock 서버 사용 시:
 * - .env.development에 VITE_API_BASE_URL=http://localhost:3001 설정
 * - 또는 VITE_USE_MOCK_API=true로 설정하여 자동 전환
 */
const getMockBaseUrl = () => {
  // Mock API 사용 플래그가 true면 Mock 서버 URL 사용
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return import.meta.env.VITE_MOCK_API_URL || "http://localhost:3001";
  }
  return null;
};

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  getMockBaseUrl() ||
  "http://localhost:3000";

/**
 * Axios 인스턴스 생성
 */
export const httpClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30초
  headers: {
    "Content-Type": "application/json",
  },
});

// ========================================
// Request Interceptor
// ========================================

httpClient.interceptors.request.use(
  (config) => {
    // authStore에서 accessToken을 가져와 Authorization 헤더에 주입
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ========================================
// Response Interceptor
// ========================================

httpClient.interceptors.response.use(
  (response) => {
    // 성공 응답 그대로 반환
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 Unauthorized - 인증 실패 처리
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // authStore의 logout 호출
      // 로그인 페이지로의 리다이렉트는 SPA Shell의 ProtectedRoute에서 처리
      useAuthStore.getState().logout();

      console.warn(
        "[SDS] 401 Unauthorized - Session expired. User logged out."
      );
    }

    // 403 Forbidden - 권한 없음
    if (error.response?.status === 403) {
      console.warn("[SDS] 403 Forbidden - Access denied.");
    }

    // 에러 로깅 (추후 Sentry 등 연동 예정)
    console.error("[SDS] HTTP Error:", {
      status: error.response?.status,
      message: error.message,
      url: originalRequest?.url,
    });

    return Promise.reject(error);
  }
);

// ========================================
// Typed HTTP Methods
// ========================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

/**
 * GET 요청
 */
export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.get<T>(url, config);
  return response.data;
}

/**
 * POST 요청
 */
export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.post<T>(url, data, config);
  return response.data;
}

/**
 * PUT 요청
 */
export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.put<T>(url, data, config);
  return response.data;
}

/**
 * PATCH 요청
 */
export async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.patch<T>(url, data, config);
  return response.data;
}

/**
 * DELETE 요청
 */
export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  const response = await httpClient.delete<T>(url, config);
  return response.data;
}

// Default export
export default httpClient;
