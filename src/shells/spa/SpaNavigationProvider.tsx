/**
 * SoftOne Design System - SPA Navigation Provider
 * React Router를 NavigationApi로 래핑
 */

import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { NavigationProvider, type NavigationApi } from "@core/router/NavigationContext";

// ========================================
// SPA Navigation Provider
// ========================================

interface SpaNavigationProviderProps {
  children: React.ReactNode;
}

/**
 * SPA Navigation Provider
 *
 * React Router의 useNavigate, useLocation을 사용하여
 * NavigationApi 인터페이스를 구현합니다.
 */
export const SpaNavigationProvider: React.FC<SpaNavigationProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationApi: NavigationApi = useMemo(
    () => ({
      push: (path) => {
        navigate(path);
        // 스크롤 맨 위로
        window.scrollTo(0, 0);
      },

      replace: (path) => {
        navigate(path, { replace: true });
        window.scrollTo(0, 0);
      },

      back: () => {
        navigate(-1);
      },

      forward: () => {
        navigate(1);
      },

      getCurrentPath: () => {
        return location.pathname;
      },

      getQueryParams: () => {
        return new URLSearchParams(location.search);
      },

      // SPA에서는 prefetch 불필요 (no-op)
      prefetch: () => {
        // No-op for SPA
      },
    }),
    [navigate, location]
  );

  return (
    <NavigationProvider navigation={navigationApi}>
      {children}
    </NavigationProvider>
  );
};
