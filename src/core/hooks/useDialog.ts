/**
 * SoftOne Design System - useDialog Hook (Step 10)
 * 작성: SoftOne Frontend Team
 *
 * [목적]
 * - dialogStore를 감싸 개발자가 쉽게 다이얼로그를 열고 닫을 수 있도록 편의 메서드 제공
 * - 타입별 openModal, openConfirm, openDrawer, openFormDialog 메서드로 직관적인 API 제공
 *
 * [A11y 고려]
 * - 각 다이얼로그 타입에 맞는 기본 옵션 자동 설정
 * - Confirm은 role="alertdialog" 사용 권장
 *
 * @example
 * const { openConfirm, openDrawer, openFormDialog, closeDialog } = useDialog();
 *
 * // 확인 다이얼로그
 * openConfirm({
 *   title: '삭제 확인',
 *   message: '정말 삭제하시겠습니까?',
 *   variant: 'danger',
 *   onConfirm: async () => {
 *     await deleteUser(userId);
 *   },
 * });
 *
 * // 사이드 패널 (Drawer)
 * openDrawer({
 *   title: '사용자 상세',
 *   payload: userData,
 *   width: '500px',
 * });
 *
 * // 폼 다이얼로그
 * openFormDialog({
 *   title: '사용자 생성',
 *   formKey: 'userCreate',
 *   onSubmit: async (values) => {
 *     await createUser(values);
 *   },
 * });
 */

import { useCallback } from "react";
import {
  useDialogStore,
  type DialogSize,
  type DialogVariant,
} from "../store/dialogStore";

// ========================================
// Type-specific Option Interfaces
// ========================================

export interface OpenModalOptions {
  title?: string;
  content?: React.ReactNode;
  size?: DialogSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  payload?: unknown;
}

export interface OpenConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: DialogVariant;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface OpenDrawerOptions {
  title?: string;
  content?: React.ReactNode;
  width?: string;
  position?: "left" | "right";
  payload?: unknown;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
}

export interface OpenFormDialogOptions {
  title?: string;
  formKey?: string;
  initialValues?: Record<string, unknown>;
  size?: DialogSize;
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
  onCancel?: () => void;
  content?: React.ReactNode;
}

// ========================================
// useDialog Hook
// ========================================

export function useDialog() {
  const openDialog = useDialogStore((state) => state.openDialog);
  const closeDialog = useDialogStore((state) => state.closeDialog);
  const closeAll = useDialogStore((state) => state.closeAll);
  const updateDialog = useDialogStore((state) => state.updateDialog);
  const dialogs = useDialogStore((state) => state.dialogs);

  /**
   * 일반 모달 열기
   */
  const openModal = useCallback(
    (options: OpenModalOptions): string => {
      return openDialog({
        type: "modal",
        ...options,
      });
    },
    [openDialog]
  );

  /**
   * 확인 다이얼로그 열기
   *
   * @example
   * openConfirm({
   *   title: '삭제 확인',
   *   message: '이 항목을 삭제하시겠습니까?',
   *   variant: 'danger',
   *   confirmLabel: '삭제',
   *   onConfirm: async () => {
   *     await deleteItem(id);
   *     showToast.success('삭제되었습니다.');
   *   },
   * });
   */
  const openConfirm = useCallback(
    (options: OpenConfirmOptions): string => {
      return openDialog({
        type: "confirm",
        size: "sm",
        confirmLabel: options.confirmLabel ?? "확인",
        cancelLabel: options.cancelLabel ?? "취소",
        ...options,
      });
    },
    [openDialog]
  );

  /**
   * Drawer(사이드 패널) 열기
   *
   * @example
   * openDrawer({
   *   title: '사용자 상세 정보',
   *   payload: userData,
   *   width: '480px',
   * });
   */
  const openDrawer = useCallback(
    (options: OpenDrawerOptions): string => {
      return openDialog({
        type: "drawer",
        width: options.width ?? "400px",
        position: options.position ?? "right",
        ...options,
      });
    },
    [openDialog]
  );

  /**
   * 폼 다이얼로그 열기
   *
   * @example
   * openFormDialog({
   *   title: '새 사용자 등록',
   *   formKey: 'userCreate',
   *   size: 'lg',
   *   onSubmit: async (values) => {
   *     await createUser(values);
   *   },
   * });
   */
  const openFormDialog = useCallback(
    (options: OpenFormDialogOptions): string => {
      return openDialog({
        type: "form",
        size: options.size ?? "md",
        ...options,
      });
    },
    [openDialog]
  );

  /**
   * Promise 기반 확인 다이얼로그
   * await 가능한 confirm 패턴
   *
   * @example
   * const confirmed = await confirm({
   *   title: '삭제 확인',
   *   message: '정말 삭제하시겠습니까?',
   * });
   * if (confirmed) {
   *   // 삭제 로직
   * }
   */
  const confirm = useCallback(
    (
      options: Omit<OpenConfirmOptions, "onConfirm" | "onCancel">
    ): Promise<boolean> => {
      return new Promise((resolve) => {
        openDialog({
          type: "confirm",
          size: "sm",
          confirmLabel: options.confirmLabel ?? "확인",
          cancelLabel: options.cancelLabel ?? "취소",
          ...options,
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false),
        });
      });
    },
    [openDialog]
  );

  /**
   * Promise 기반 폼 다이얼로그
   * 폼 제출 값을 await로 받을 수 있음
   *
   * @example
   * const result = await showFormDialog<UserFormValues>({
   *   title: '사용자 수정',
   *   formKey: 'userEdit',
   *   initialValues: existingUser,
   * });
   * if (result) {
   *   // result는 폼 제출 값
   * }
   */
  const showFormDialog = useCallback(
    <T extends Record<string, unknown>>(
      options: Omit<OpenFormDialogOptions, "onSubmit" | "onCancel">
    ): Promise<T | null> => {
      return new Promise((resolve) => {
        openDialog({
          type: "form",
          size: options.size ?? "md",
          ...options,
          onSubmit: (values) => resolve(values as T),
          onCancel: () => resolve(null),
        });
      });
    },
    [openDialog]
  );

  return {
    // Dialog Store State
    dialogs,

    // Basic Open Methods
    openModal,
    openConfirm,
    openDrawer,
    openFormDialog,

    // Promise-based Methods
    confirm,
    showFormDialog,

    // Control Methods
    closeDialog,
    closeAll,
    updateDialog,
  };
}

// ========================================
// Standalone Functions (Non-hook context)
// ========================================

/**
 * 훅 외부에서 다이얼로그를 열어야 할 때 사용
 * (예: API 에러 핸들러, 이벤트 리스너 등)
 *
 * @example
 * // API 에러 핸들러에서
 * httpClient.interceptors.response.use(
 *   (response) => response,
 *   (error) => {
 *     if (error.response?.status === 401) {
 *       dialogActions.openConfirm({
 *         title: '세션 만료',
 *         message: '다시 로그인해주세요.',
 *         onConfirm: () => router.push('/login'),
 *       });
 *     }
 *     return Promise.reject(error);
 *   }
 * );
 */
export const dialogActions = {
  openModal: (options: OpenModalOptions): string => {
    return useDialogStore.getState().openDialog({
      type: "modal",
      ...options,
    });
  },

  openConfirm: (options: OpenConfirmOptions): string => {
    return useDialogStore.getState().openDialog({
      type: "confirm",
      size: "sm",
      confirmLabel: options.confirmLabel ?? "확인",
      cancelLabel: options.cancelLabel ?? "취소",
      ...options,
    });
  },

  openDrawer: (options: OpenDrawerOptions): string => {
    return useDialogStore.getState().openDialog({
      type: "drawer",
      width: options.width ?? "400px",
      position: options.position ?? "right",
      ...options,
    });
  },

  openFormDialog: (options: OpenFormDialogOptions): string => {
    return useDialogStore.getState().openDialog({
      type: "form",
      size: options.size ?? "md",
      ...options,
    });
  },

  closeDialog: (id?: string): void => {
    useDialogStore.getState().closeDialog(id);
  },

  closeAll: (): void => {
    useDialogStore.getState().closeAll();
  },
};
