/**
 * SoftOne Design System - Global Error Boundary
 * 런타임 에러 처리를 위한 Error Boundary
 *
 * react-error-boundary 라이브러리를 사용하여 구현
 */

import React from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { AlertTriangle, RefreshCw } from "lucide-react";

// ========================================
// Error Fallback Component
// ========================================

/**
 * 에러 발생 시 표시되는 Fallback UI
 */
function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-softone-bg p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mx-auto w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          시스템 오류가 발생했습니다
        </h1>

        {/* Message */}
        <p className="text-slate-600 mb-6">
          예기치 않은 오류가 발생했습니다.
          <br />
          문제가 지속되면 관리자에게 문의하세요.
        </p>

        {/* Error Details (Development Only) */}
        {import.meta.env.DEV && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
              오류 상세 정보 (개발 모드)
            </summary>
            <pre className="mt-2 p-4 bg-slate-100 rounded-lg text-xs overflow-auto max-h-40 text-red-600">
              {error.message}
              {error.stack && (
                <>
                  {"\n\n"}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}

        {/* Retry Button */}
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-softone-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <RefreshCw className="w-4 h-4" />
          다시 시도
        </button>
      </div>
    </div>
  );
}

// ========================================
// Global Error Boundary
// ========================================

export interface GlobalErrorBoundaryProps {
  /** 자식 요소 */
  children: React.ReactNode;
  /** 커스텀 Fallback 컴포넌트 */
  fallback?: React.ComponentType<FallbackProps>;
  /** 에러 발생 시 콜백 */
  onError?: (error: Error, info: React.ErrorInfo) => void;
}

/**
 * Global Error Boundary
 *
 * 애플리케이션 전체를 감싸서 런타임 에러를 캐치합니다.
 *
 * @example
 * <GlobalErrorBoundary>
 *   <App />
 * </GlobalErrorBoundary>
 */
export const GlobalErrorBoundary: React.FC<GlobalErrorBoundaryProps> = ({
  children,
  fallback: FallbackComponent = ErrorFallback,
  onError,
}) => {
  const handleError = (error: Error, info: React.ErrorInfo) => {
    // 에러 로깅
    console.error("[SDS] Uncaught error:", error);
    console.error("[SDS] Error info:", info);

    // 추후 Sentry 등 외부 서비스 연동 예정
    // if (typeof Sentry !== 'undefined') {
    //   Sentry.captureException(error, {
    //     extra: {
    //       componentStack: info.componentStack,
    //     },
    //   });
    // }

    // 사용자 정의 에러 핸들러 호출
    onError?.(error, info);
  };

  const handleReset = () => {
    // 에러 상태 초기화 시 추가 로직
    // 예: 특정 상태 리셋, 페이지 리로드 등
  };

  return (
    <ErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={handleError}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
};

// ========================================
// useErrorHandler Hook (선택적 사용)
// ========================================

export { useErrorBoundary } from "react-error-boundary";

