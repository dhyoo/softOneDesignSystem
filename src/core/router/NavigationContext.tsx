/**
 * SoftOne Design System - Navigation Context
 * 라우터 추상화 레이어
 *
 * Shell에서 NavigationApi 구현체를 주입하면,
 * Core/Features에서는 useNavigation() 훅으로 라우팅 기능을 사용합니다.
 */

import React, { createContext, useContext } from "react";
import type { NavigationApi } from "./navigation.types";

// ========================================
// Default Navigation API (Fallback)
// ========================================

/**
 * 기본 네비게이션 API
 * Shell에서 Provider를 설정하지 않았을 때 사용되는 fallback
 */
const defaultNavigationApi: NavigationApi = {
  push: (path: string) => {
    console.warn("[SDS] NavigationApi not provided. Using window.location.");
    window.location.href = path;
  },
  replace: (path: string) => {
    console.warn("[SDS] NavigationApi not provided. Using window.location.");
    window.location.replace(path);
  },
  back: () => {
    window.history.back();
  },
  forward: () => {
    window.history.forward();
  },
  getCurrentPath: () => {
    return window.location.pathname;
  },
  getQueryParams: () => {
    return new URLSearchParams(window.location.search);
  },
};

// ========================================
// Navigation Context
// ========================================

const NavigationContext = createContext<NavigationApi>(defaultNavigationApi);

// ========================================
// Navigation Provider
// ========================================

export interface NavigationProviderProps {
  /** NavigationApi 구현체 (Shell에서 제공) */
  navigation: NavigationApi;
  /** 자식 요소 */
  children: React.ReactNode;
}

/**
 * Navigation Provider
 *
 * @example
 * // SPA Shell에서 사용
 * const spaNavigation: NavigationApi = {
 *   push: (path) => navigate(path),
 *   replace: (path) => navigate(path, { replace: true }),
 *   // ...
 * };
 *
 * <NavigationProvider navigation={spaNavigation}>
 *   <App />
 * </NavigationProvider>
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  navigation,
  children,
}) => {
  return (
    <NavigationContext.Provider value={navigation}>
      {children}
    </NavigationContext.Provider>
  );
};

// ========================================
// useNavigation Hook
// ========================================

/**
 * Navigation API를 사용하기 위한 훅
 *
 * @example
 * const MyComponent = () => {
 *   const nav = useNavigation();
 *
 *   const handleClick = () => {
 *     nav.push('/users');
 *   };
 *
 *   return <button onClick={handleClick}>Go to Users</button>;
 * };
 */
export function useNavigation(): NavigationApi {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "[SDS] useNavigation must be used within a NavigationProvider"
    );
  }

  return context;
}

// ========================================
// Navigation Utilities
// ========================================

/**
 * 경로가 현재 경로와 일치하는지 확인
 */
export function isActivePath(
  currentPath: string,
  targetPath: string,
  exact: boolean = false
): boolean {
  if (exact) {
    return currentPath === targetPath;
  }
  return currentPath.startsWith(targetPath);
}

/**
 * 쿼리 파라미터 객체를 문자열로 변환
 */
export function buildQueryString(
  params: Record<string, string | number | boolean | undefined>
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

/**
 * 경로와 쿼리 파라미터를 합치기
 */
export function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  if (!params) return path;
  return `${path}${buildQueryString(params)}`;
}

// Re-export types
export type { NavigationApi } from "./navigation.types";
