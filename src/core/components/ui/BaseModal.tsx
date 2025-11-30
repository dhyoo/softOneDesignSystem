/**
 * SoftOne Design System - BaseModal Component (Step 10)
 * 작성: SoftOne Frontend Team
 *
 * [목적]
 * - 모든 모달/다이얼로그의 기반이 되는 공통 컴포넌트
 * - 오버레이, 센터 정렬, 포커스 트랩, 애니메이션을 캡슐화하여 반복 구현 방지
 *
 * [A11y 고려]
 * - role="dialog" / role="alertdialog" 지원
 * - aria-modal="true", aria-labelledby, aria-describedby 설정
 * - ESC 키로 닫기, 포커스 트랩 (Tab 키 순환)
 * - 열릴 때 포커스 이동, 닫힐 때 이전 포커스 복원
 *
 * [사용법]
 * 1. 직접 사용: <BaseModal isOpen={isOpen} onClose={handleClose}>...</BaseModal>
 * 2. 전역 사용: useDialog().openModal() → DialogRoot에서 렌더링
 */

import React, {
  useEffect,
  useRef,
  useCallback,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/classUtils";

// ========================================
// Types
// ========================================

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export type ModalRole = "dialog" | "alertdialog";

export interface BaseModalProps {
  /** 모달 열림 상태 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 모달 제목 */
  title?: string;
  /** 모달 설명 (aria-describedby용) */
  description?: string;
  /** 모달 내용 */
  children: React.ReactNode;
  /** 모달 푸터 (액션 버튼 등) */
  footer?: React.ReactNode;
  /** 모달 크기 */
  size?: ModalSize;
  /** ARIA role (dialog | alertdialog) */
  role?: ModalRole;
  /** 배경 클릭으로 닫기 허용 */
  closeOnOverlayClick?: boolean;
  /** ESC 키로 닫기 허용 */
  closeOnEscape?: boolean;
  /** 닫기 버튼 숨기기 */
  hideCloseButton?: boolean;
  /** 헤더 숨기기 */
  hideHeader?: boolean;
  /** 추가 클래스 (모달 컨테이너) */
  className?: string;
  /** 오버레이 추가 클래스 */
  overlayClassName?: string;
  /** 초기 포커스 대상 요소 ref */
  initialFocusRef?: React.RefObject<HTMLElement>;
  /** 다이얼로그 고유 ID (여러 다이얼로그 구분용) */
  dialogId?: string;
}

// ========================================
// Size Styles
// ========================================

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-4xl",
};

// ========================================
// Focus Trap Utility
// ========================================

/**
 * 모달 내부의 포커스 가능한 요소들 가져오기
 */
const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    "[tabindex]:not([tabindex='-1'])",
  ].join(", ");

  return Array.from(
    container.querySelectorAll<HTMLElement>(focusableSelectors)
  );
};

// ========================================
// BaseModal Component
// ========================================

export const BaseModal: React.FC<BaseModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  role = "dialog",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  hideCloseButton = false,
  hideHeader = false,
  className,
  overlayClassName,
  initialFocusRef,
  dialogId,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 고유 ID 생성 (aria 연결용)
  const uniqueId =
    dialogId ?? `modal-${Math.random().toString(36).substr(2, 9)}`;
  const titleId = `${uniqueId}-title`;
  const descriptionId = `${uniqueId}-description`;

  // ========================================
  // Keyboard Handler
  // ========================================

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      // ESC 키 처리
      if (closeOnEscape && event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      // Tab 키 포커스 트랩
      if (event.key === "Tab" && modalRef.current) {
        const focusableElements = getFocusableElements(modalRef.current);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab: 첫 번째 요소에서 마지막으로 이동
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: 마지막 요소에서 첫 번째로 이동
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [closeOnEscape, onClose]
  );

  // ========================================
  // Overlay Click Handler
  // ========================================

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  // ========================================
  // Focus Management
  // ========================================

  useEffect(() => {
    if (isOpen) {
      // 현재 포커스된 요소 저장
      previousActiveElement.current = document.activeElement as HTMLElement;

      // 초기 포커스 설정
      requestAnimationFrame(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else if (modalRef.current) {
          // 첫 번째 포커스 가능 요소 또는 모달 자체에 포커스
          const focusableElements = getFocusableElements(modalRef.current);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            modalRef.current.focus();
          }
        }
      });

      // 스크롤 방지
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;

        // 이전 포커스 복원
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, initialFocusRef]);

  // ========================================
  // Render
  // ========================================

  if (!isOpen) return null;

  const showHeader = !hideHeader && (title || !hideCloseButton);

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm",
          "animate-in fade-in duration-200",
          overlayClassName
        )}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        role={role}
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative z-10 w-full bg-softone-surface rounded-lg shadow-xl",
          "animate-in zoom-in-95 fade-in duration-200",
          "flex flex-col max-h-[90vh]",
          "focus:outline-none",
          sizeStyles[size],
          className
        )}
      >
        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-softone-border">
            {title && (
              <h2
                id={titleId}
                className="text-lg font-semibold text-softone-text"
              >
                {title}
              </h2>
            )}
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "p-1.5 rounded-md text-softone-text-muted",
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

        {/* Description (hidden but accessible) */}
        {description && (
          <div id={descriptionId} className="sr-only">
            {description}
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

BaseModal.displayName = "BaseModal";

export default BaseModal;
