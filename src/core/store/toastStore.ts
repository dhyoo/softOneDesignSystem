/**
 * SoftOne Design System - Toast Store
 * 작성: SoftOne Frontend Team
 *
 * 중복 업무 감소:
 *   전역 토스트 알림 상태를 Zustand로 관리.
 *   각 feature에서 별도의 알림 상태를 만들지 않고 useToast 훅으로 일관된 알림 제공.
 *
 * toastStore
 * - toasts: 현재 표시 중인 토스트 배열
 * - showToast: 새 토스트 추가
 * - removeToast: 특정 토스트 제거
 * - clearAll: 모든 토스트 제거
 */

import { create } from "zustand";

// ========================================
// Types
// ========================================

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  /** 고유 ID */
  id: string;
  /** 타입 (색상/아이콘 결정) */
  type: ToastType;
  /** 제목 (선택) */
  title?: string;
  /** 메시지 */
  message: string;
  /** 자동 닫힘 시간 (ms) - undefined면 기본값 사용 */
  duration?: number;
  /** 생성 시간 */
  createdAt: number;
}

export interface ToastOptions {
  /** 제목 */
  title?: string;
  /** 자동 닫힘 시간 (ms) */
  duration?: number;
}

interface ToastState {
  /** 토스트 목록 */
  toasts: Toast[];
  /** 기본 자동 닫힘 시간 (ms) */
  defaultDuration: number;
}

interface ToastActions {
  /** 토스트 추가 */
  showToast: (type: ToastType, message: string, options?: ToastOptions) => string;
  /** 특정 토스트 제거 */
  removeToast: (id: string) => void;
  /** 모든 토스트 제거 */
  clearAll: () => void;
  /** 기본 duration 설정 */
  setDefaultDuration: (duration: number) => void;
}

// ========================================
// Store
// ========================================

export const useToastStore = create<ToastState & ToastActions>((set, get) => ({
  toasts: [],
  defaultDuration: 5000, // 5초

  showToast: (type, message, options) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const toast: Toast = {
      id,
      type,
      message,
      title: options?.title,
      duration: options?.duration ?? get().defaultDuration,
      createdAt: Date.now(),
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // 자동 제거 타이머
    const duration = toast.duration;
    if (duration && duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },

  setDefaultDuration: (duration) => {
    set({ defaultDuration: duration });
  },
}));

