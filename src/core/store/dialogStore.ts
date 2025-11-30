/**
 * SoftOne Design System - Dialog Store (Step 10)
 * 작성: SoftOne Frontend Team
 *
 * [목적]
 * - 확인 팝업, 상세 보기, Form 모달 등 반복적인 다이얼로그 패턴을 전역에서 일관되게 관리
 * - 개발자가 매번 모달 상태/열기/닫기 로직을 작성하지 않도록 공통화
 *
 * [A11y 고려]
 * - 각 Dialog 타입에 맞는 role(dialog/alertdialog) 적용
 * - 포커스 트랩과 ESC 닫기는 개별 컴포넌트에서 처리
 *
 * [사용 시나리오]
 * - 전역 팝업(확인/알림/폼)이 필요할 때 이 스토어 사용
 * - 단순한 로컬 모달은 컴포넌트 내부 state로 처리해도 무방
 */

import { create } from "zustand";

// ========================================
// Dialog Types
// ========================================

export type DialogType = "modal" | "confirm" | "drawer" | "form";

export type DialogSize = "sm" | "md" | "lg" | "xl" | "full";

export type DialogVariant =
  | "default"
  | "danger"
  | "warning"
  | "info"
  | "success";

export interface DialogOptions {
  /** 다이얼로그 고유 ID (자동 생성 또는 직접 지정) */
  id?: string;
  /** 다이얼로그 타입 */
  type: DialogType;
  /** 제목 */
  title?: string;
  /** 메시지 (주로 confirm에서 사용) */
  message?: string;
  /** 크기 */
  size?: DialogSize;
  /** 스타일 변형 (danger, warning 등) */
  variant?: DialogVariant;

  // ===== Confirm 전용 옵션 =====
  /** 확인 버튼 텍스트 */
  confirmLabel?: string;
  /** 취소 버튼 텍스트 */
  cancelLabel?: string;
  /** 확인 시 콜백 (async 지원) */
  onConfirm?: () => void | Promise<void>;
  /** 취소 시 콜백 */
  onCancel?: () => void;

  // ===== Drawer 전용 옵션 =====
  /** Drawer 너비 */
  width?: string;
  /** Drawer 위치 */
  position?: "left" | "right";

  // ===== Form 전용 옵션 =====
  /**
   * Form Dialog에서 사용할 폼 식별자 (예: 'userCreate', 'userEdit')
   * 실제 폼 렌더링은 DialogRoot에서 formKey에 따라 분기 처리
   */
  formKey?: string;
  /** 폼 초기값 */
  initialValues?: Record<string, unknown>;
  /** 폼 제출 핸들러 */
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;

  // ===== 공통 옵션 =====
  /** 추가 데이터 (상세 보기 등에서 활용) */
  payload?: unknown;
  /** 컨텐츠 렌더 함수 (커스텀 내용이 필요할 때) */
  content?: React.ReactNode;
  /** 오버레이 클릭으로 닫기 허용 */
  closeOnOverlayClick?: boolean;
  /** ESC 키로 닫기 허용 */
  closeOnEscape?: boolean;
  /** 닫기 버튼 표시 */
  showCloseButton?: boolean;
}

// ========================================
// Dialog State Interface
// ========================================

interface DialogState {
  /** 현재 열린 다이얼로그 목록 (스택 구조) */
  dialogs: DialogOptions[];
}

interface DialogActions {
  /**
   * 다이얼로그 열기
   * @param options 다이얼로그 옵션
   * @returns 생성된 다이얼로그 ID
   */
  openDialog: (options: DialogOptions) => string;

  /**
   * 특정 다이얼로그 닫기
   * @param id 다이얼로그 ID (없으면 마지막 다이얼로그 닫기)
   */
  closeDialog: (id?: string) => void;

  /**
   * 모든 다이얼로그 닫기
   */
  closeAll: () => void;

  /**
   * 특정 다이얼로그 업데이트
   * @param id 다이얼로그 ID
   * @param updates 업데이트할 옵션
   */
  updateDialog: (id: string, updates: Partial<DialogOptions>) => void;
}

export type DialogStore = DialogState & DialogActions;

// ========================================
// ID Generator
// ========================================

let dialogIdCounter = 0;

const generateDialogId = (): string => {
  dialogIdCounter += 1;
  return `dialog-${Date.now()}-${dialogIdCounter}`;
};

// ========================================
// Dialog Store Implementation
// ========================================

export const useDialogStore = create<DialogStore>((set, get) => ({
  // ========================================
  // State
  // ========================================
  dialogs: [],

  // ========================================
  // Actions
  // ========================================

  openDialog: (options) => {
    const id = options.id ?? generateDialogId();
    const dialogWithId: DialogOptions = {
      ...options,
      id,
      // 기본값 설정
      closeOnOverlayClick: options.closeOnOverlayClick ?? true,
      closeOnEscape: options.closeOnEscape ?? true,
      showCloseButton: options.showCloseButton ?? true,
      size: options.size ?? "md",
      variant: options.variant ?? "default",
    };

    set((state) => ({
      dialogs: [...state.dialogs, dialogWithId],
    }));

    return id;
  },

  closeDialog: (id) => {
    const { dialogs } = get();

    if (id) {
      // 특정 ID의 다이얼로그 닫기
      const dialog = dialogs.find((d) => d.id === id);
      if (dialog?.onCancel) {
        dialog.onCancel();
      }
      set((state) => ({
        dialogs: state.dialogs.filter((d) => d.id !== id),
      }));
    } else {
      // 마지막 다이얼로그 닫기
      if (dialogs.length > 0) {
        const lastDialog = dialogs[dialogs.length - 1];
        if (lastDialog.onCancel) {
          lastDialog.onCancel();
        }
        set((state) => ({
          dialogs: state.dialogs.slice(0, -1),
        }));
      }
    }
  },

  closeAll: () => {
    const { dialogs } = get();
    // 모든 다이얼로그의 onCancel 호출
    dialogs.forEach((dialog) => {
      if (dialog.onCancel) {
        dialog.onCancel();
      }
    });
    set({ dialogs: [] });
  },

  updateDialog: (id, updates) => {
    set((state) => ({
      dialogs: state.dialogs.map((dialog) =>
        dialog.id === id ? { ...dialog, ...updates } : dialog
      ),
    }));
  },
}));

// ========================================
// Selector Hooks (성능 최적화)
// ========================================

/**
 * 현재 열린 다이얼로그 개수
 */
export const useDialogCount = () =>
  useDialogStore((state) => state.dialogs.length);

/**
 * 특정 타입의 다이얼로그가 열려있는지 확인
 */
export const useHasDialogOfType = (type: DialogType) =>
  useDialogStore((state) => state.dialogs.some((d) => d.type === type));

/**
 * 가장 최근 다이얼로그 가져오기
 */
export const useTopDialog = () =>
  useDialogStore((state) =>
    state.dialogs.length > 0 ? state.dialogs[state.dialogs.length - 1] : null
  );
