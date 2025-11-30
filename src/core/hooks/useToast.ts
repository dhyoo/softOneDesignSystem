/**
 * SoftOne Design System - useToast Hook
 * 작성: SoftOne Frontend Team
 *
 * 중복 업무 감소:
 *   toastStore를 직접 사용하지 않고, 헬퍼 함수들을 제공하여
 *   개발자가 간편하게 toast.success(), toast.error() 형태로 호출 가능.
 *
 * useToast Hook
 * - showSuccess, showError, showWarning, showInfo 헬퍼
 * - toasts 배열과 removeToast 액세스
 *
 * @example
 * const toast = useToast();
 *
 * // 성공 메시지
 * toast.success('저장되었습니다.');
 *
 * // 에러 메시지 (제목 포함)
 * toast.error('저장에 실패했습니다.', { title: '오류' });
 *
 * // 커스텀 duration
 * toast.info('5초 후 사라집니다.', { duration: 5000 });
 */

import { useCallback } from "react";
import { useToastStore, type ToastOptions, type ToastType } from "../store/toastStore";

// ========================================
// useToast Hook
// ========================================

export function useToast() {
  const { toasts, showToast, removeToast, clearAll } = useToastStore();

  const success = useCallback(
    (message: string, options?: ToastOptions) => {
      return showToast("success", message, options);
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: ToastOptions) => {
      return showToast("error", message, options);
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, options?: ToastOptions) => {
      return showToast("warning", message, options);
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: ToastOptions) => {
      return showToast("info", message, options);
    },
    [showToast]
  );

  const show = useCallback(
    (type: ToastType, message: string, options?: ToastOptions) => {
      return showToast(type, message, options);
    },
    [showToast]
  );

  return {
    /** 현재 토스트 목록 */
    toasts,
    /** 특정 토스트 제거 */
    remove: removeToast,
    /** 모든 토스트 제거 */
    clearAll,
    /** 성공 토스트 */
    success,
    /** 에러 토스트 */
    error,
    /** 경고 토스트 */
    warning,
    /** 정보 토스트 */
    info,
    /** 범용 토스트 */
    show,
  };
}

export type UseToastReturn = ReturnType<typeof useToast>;

