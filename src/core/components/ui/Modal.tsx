/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 재사용 가능한 Modal 컴포넌트.
 *      Overlay, ESC/배경 클릭 닫기, A11y 속성을 포함합니다.
 *      모든 도메인에서 일관된 모달 UX를 제공합니다.
 *
 * Modal Component
 * - role="dialog", aria-modal="true" 등 접근성 지원
 * - Portal 렌더링으로 z-index 이슈 방지
 * - 애니메이션 효과 포함
 */

import React, { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/classUtils";

// ========================================
// Modal Types
// ========================================

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 모달 제목 */
  title?: string;
  /** 모달 내용 */
  children: React.ReactNode;
  /** 모달 푸터 (액션 버튼 등) */
  footer?: React.ReactNode;
  /** 모달 크기 */
  size?: ModalSize;
  /** 배경 클릭으로 닫기 허용 */
  closeOnOverlayClick?: boolean;
  /** ESC 키로 닫기 허용 */
  closeOnEscape?: boolean;
  /** 닫기 버튼 표시 */
  showCloseButton?: boolean;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// Size Styles
// ========================================

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

// ========================================
// Modal Component
// ========================================

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  className,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // ESC 키 핸들러
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === "Escape") {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  // 오버레이 클릭 핸들러
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // 포커스 트랩 및 이벤트 리스너 설정
  useEffect(() => {
    if (isOpen) {
      // 현재 포커스된 요소 저장
      previousActiveElement.current = document.activeElement as HTMLElement;

      // 모달에 포커스
      modalRef.current?.focus();

      // ESC 키 리스너 등록
      document.addEventListener("keydown", handleKeyDown);

      // 스크롤 방지
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";

        // 이전 포커스 복원
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, handleKeyDown]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        tabIndex={-1}
        className={cn(
          "relative z-10 w-full bg-softone-surface rounded-lg shadow-xl",
          "animate-in zoom-in-95 fade-in duration-200",
          "flex flex-col max-h-[90vh]",
          sizeStyles[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-softone-border">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-softone-text"
              >
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "p-1 rounded-md text-softone-text-muted",
                  "hover:bg-softone-surface-hover hover:text-softone-text",
                  "transition-colors focus:outline-none focus:ring-2 focus:ring-softone-primary/50",
                  !title && "ml-auto"
                )}
                aria-label="닫기"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-softone-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Portal로 body에 렌더링
  return createPortal(modalContent, document.body);
};

Modal.displayName = "Modal";

// ========================================
// Confirm Modal Hook (Utility)
// ========================================

export interface UseConfirmModalOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

/**
 * useConfirmModal - 확인 모달을 쉽게 사용하기 위한 훅
 *
 * @example
 * const { ConfirmModal, confirm } = useConfirmModal();
 *
 * const handleDelete = async () => {
 *   const confirmed = await confirm({
 *     title: '삭제 확인',
 *     message: '정말 삭제하시겠습니까?',
 *     variant: 'danger'
 *   });
 *   if (confirmed) {
 *     // 삭제 로직
 *   }
 * };
 */
// Note: useConfirmModal 구현은 상태 관리가 복잡하여 별도 파일로 분리 권장
