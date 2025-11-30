/**
 * SoftOne Design System - App Entry
 * Shell에서 공통으로 사용할 수 있는 App Entry Point
 *
 * 이 파일은 선택적으로 사용됩니다.
 * 각 Shell(SPA, Next)에서 직접 구성할 수도 있습니다.
 */

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@core/api/queryClient";
import { GlobalErrorBoundary } from "@core/components/error/GlobalErrorBoundary";

// ========================================
// App Entry Props
// ========================================

export interface AppEntryProps {
  /** 자식 요소 */
  children: React.ReactNode;
  /** React Query Devtools 표시 여부 */
  showDevtools?: boolean;
}

// ========================================
// App Entry Component
// ========================================

/**
 * App Entry
 *
 * QueryClientProvider와 GlobalErrorBoundary를 포함한 공통 래퍼입니다.
 * 각 Shell에서 이 컴포넌트를 사용하거나, 직접 구성할 수 있습니다.
 *
 * @example
 * // SPA Shell에서 사용
 * <AppEntry>
 *   <BrowserRouter>
 *     <NavigationProvider navigation={...}>
 *       <MainLayout>
 *         <AppRouter />
 *       </MainLayout>
 *     </NavigationProvider>
 *   </BrowserRouter>
 * </AppEntry>
 */
export const AppEntry: React.FC<AppEntryProps> = ({
  children,
  showDevtools = import.meta.env.DEV,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorBoundary>
        {children}
      </GlobalErrorBoundary>
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default AppEntry;

