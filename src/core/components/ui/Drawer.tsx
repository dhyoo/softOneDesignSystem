/**
 * SoftOne Design System - Drawer Component (Step 10)
 * 작성: SoftOne Frontend Team
 *
 * [목적]
 * - 화면 측면에서 슬라이드 인되는 사이드 패널
 * - 상세 보기, 필터 패널, 설정 패널 등에 활용
 * - 메인 콘텐츠를 가리지 않으면서 추가 정보 표시
 *
 * [A11y 고려]
 * - role="dialog", aria-modal="true" 설정
 * - ESC 키로 닫기, 포커스 트랩 적용
 * - 열릴 때 Drawer 내부로 포커스 이동
 *
 * [사용법]
 * 1. 직접 사용:
 *    <Drawer isOpen={isOpen} onClose={handleClose} title="상세 정보">
 *      <UserDetail user={selectedUser} />
 *    </Drawer>
 *
 * 2. 전역 사용:
 *    useDialog().openDrawer({ title, payload, width: '500px' })
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

export type DrawerPosition = "left" | "right";

export interface DrawerProps {
  /** Drawer 열림 상태 */
  isOpen: boolean;
  /** Drawer 닫기 핸들러 */
  onClose: () => void;
  /** 제목 */
  title?: string;
  /** 내용 */
  children: React.ReactNode;
  /** 푸터 */
  footer?: React.ReactNode;
  /** 너비 (px 또는 %) */
  width?: string;
  /** 위치 */
  position?: DrawerPosition;
  /** 배경 클릭으로 닫기 허용 */
  closeOnOverlayClick?: boolean;
  /** ESC 키로 닫기 허용 */
  closeOnEscape?: boolean;
  /** 닫기 버튼 숨기기 */
  hideCloseButton?: boolean;
  /** 오버레이 표시 */
  showOverlay?: boolean;
  /** 추가 클래스 */
  className?: string;
  /** Drawer ID */
  drawerId?: string;
}

// ========================================
// Position Styles
// ========================================

const getPositionStyles = (
  position: DrawerPosition,
  isOpen: boolean
): string => {
  const baseStyles =
    "fixed top-0 bottom-0 z-50 flex flex-col bg-softone-surface shadow-xl";

  if (position === "right") {
    return cn(
      baseStyles,
      "right-0",
      isOpen ? "animate-in slide-in-from-right duration-300" : ""
    );
  }

  return cn(
    baseStyles,
    "left-0",
    isOpen ? "animate-in slide-in-from-left duration-300" : ""
  );
};

// ========================================
// Focus Trap Utility
// ========================================

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
// Drawer Component
// ========================================

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  width = "400px",
  position = "right",
  closeOnOverlayClick = true,
  closeOnEscape = true,
  hideCloseButton = false,
  showOverlay = true,
  className,
  drawerId,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // 고유 ID 생성
  const uniqueId =
    drawerId ?? `drawer-${Math.random().toString(36).substr(2, 9)}`;
  const titleId = `${uniqueId}-title`;

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
      if (event.key === "Tab" && drawerRef.current) {
        const focusableElements = getFocusableElements(drawerRef.current);
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
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
      previousActiveElement.current = document.activeElement as HTMLElement;

      requestAnimationFrame(() => {
        if (drawerRef.current) {
          const focusableElements = getFocusableElements(drawerRef.current);
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            drawerRef.current.focus();
          }
        }
      });

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen]);

  // ========================================
  // Render
  // ========================================

  if (!isOpen) return null;

  const drawerContent = (
    <div className="fixed inset-0 z-50" role="presentation">
      {/* Overlay */}
      {showOverlay && (
        <div
          className={cn(
            "fixed inset-0 bg-black/50",
            "animate-in fade-in duration-200"
          )}
          onClick={handleOverlayClick}
          aria-hidden="true"
        />
      )}

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={{ width }}
        className={cn(
          getPositionStyles(position, isOpen),
          "focus:outline-none",
          className
        )}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-softone-border bg-softone-surface">
            {title && (
              <h2
                id={titleId}
                className="text-lg font-semibold text-softone-text truncate"
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-softone-border bg-softone-surface">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(drawerContent, document.body);
};

Drawer.displayName = "Drawer";

export default Drawer;
