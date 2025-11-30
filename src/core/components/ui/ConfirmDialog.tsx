/**
 * SoftOne Design System - ConfirmDialog Component (Step 10)
 * 작성: SoftOne Frontend Team
 *
 * [목적]
 * - "정말 삭제하시겠습니까?" 같은 확인 패턴을 위한 공통 컴포넌트
 * - 매번 확인 모달을 새로 만들지 않고, 일관된 UX 제공
 *
 * [A11y 고려]
 * - role="alertdialog" 사용 (중요한 확인이 필요한 상황)
 * - 확인/취소 버튼에 명확한 레이블
 * - 위험한 작업(삭제 등)은 variant="danger"로 시각적 강조
 *
 * [사용법]
 * 1. 직접 사용:
 *    <ConfirmDialog
 *      isOpen={isOpen}
 *      onClose={handleClose}
 *      title="삭제 확인"
 *      message="이 항목을 삭제하시겠습니까?"
 *      onConfirm={handleDelete}
 *    />
 *
 * 2. 전역 사용:
 *    useDialog().openConfirm({ title, message, onConfirm })
 */

import React, { useState, useRef } from "react";
import { AlertTriangle, AlertCircle, Info, CheckCircle } from "lucide-react";
import { cn } from "../../utils/classUtils";
import { BaseModal } from "./BaseModal";
import { Button } from "./Button";
import type { DialogVariant } from "../../store/dialogStore";

// ========================================
// Types
// ========================================

export interface ConfirmDialogProps {
  /** 다이얼로그 열림 상태 */
  isOpen: boolean;
  /** 다이얼로그 닫기 핸들러 */
  onClose: () => void;
  /** 제목 */
  title?: string;
  /** 확인 메시지 */
  message: string;
  /** 확인 버튼 텍스트 */
  confirmLabel?: string;
  /** 취소 버튼 텍스트 */
  cancelLabel?: string;
  /** 스타일 변형 (danger, warning, info, success) */
  variant?: DialogVariant;
  /** 확인 클릭 핸들러 (async 지원) */
  onConfirm?: () => void | Promise<void>;
  /** 취소 클릭 핸들러 */
  onCancel?: () => void;
  /** 확인 중 로딩 표시 */
  isLoading?: boolean;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// Variant Styles & Icons
// ========================================

const variantStyles: Record<
  DialogVariant,
  {
    icon: React.ComponentType<{ className?: string }>;
    iconBg: string;
    iconColor: string;
    buttonVariant: "primary" | "danger" | "secondary";
  }
> = {
  default: {
    icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonVariant: "primary",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    buttonVariant: "primary",
  },
  success: {
    icon: CheckCircle,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    buttonVariant: "primary",
  },
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    buttonVariant: "primary",
  },
  danger: {
    icon: AlertCircle,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    buttonVariant: "danger",
  },
};

// ========================================
// ConfirmDialog Component
// ========================================

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = "확인",
  cancelLabel = "취소",
  variant = "default",
  onConfirm,
  onCancel,
  isLoading: externalLoading,
  className,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const isLoading = externalLoading ?? isProcessing;
  const {
    icon: Icon,
    iconBg,
    iconColor,
    buttonVariant,
  } = variantStyles[variant];

  // ========================================
  // Handlers
  // ========================================

  const handleConfirm = async () => {
    if (isLoading) return;

    try {
      setIsProcessing(true);
      if (onConfirm) {
        await onConfirm();
      }
      onClose();
    } catch (error) {
      console.error("[ConfirmDialog] Error in onConfirm:", error);
      // 에러 발생 시에도 다이얼로그는 닫지 않음 (사용자가 재시도할 수 있도록)
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (isLoading) return;
    onCancel?.();
    onClose();
  };

  // ========================================
  // Footer Buttons
  // ========================================

  const footer = (
    <>
      <Button
        ref={cancelButtonRef}
        variant="secondary"
        onClick={handleCancel}
        disabled={isLoading}
      >
        {cancelLabel}
      </Button>
      <Button
        variant={buttonVariant}
        onClick={handleConfirm}
        isLoading={isLoading}
        disabled={isLoading}
      >
        {confirmLabel}
      </Button>
    </>
  );

  // ========================================
  // Render
  // ========================================

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleCancel}
      size="sm"
      role="alertdialog"
      footer={footer}
      hideHeader
      hideCloseButton
      closeOnOverlayClick={!isLoading}
      closeOnEscape={!isLoading}
      initialFocusRef={cancelButtonRef as React.RefObject<HTMLElement>}
      className={className}
    >
      <div className="flex flex-col items-center text-center py-2">
        {/* Icon */}
        <div
          className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center mb-4",
            iconBg
          )}
        >
          <Icon className={cn("w-6 h-6", iconColor)} />
        </div>

        {/* Title */}
        {title && (
          <h3 className="text-lg font-semibold text-softone-text mb-2">
            {title}
          </h3>
        )}

        {/* Message */}
        <p className="text-softone-text-secondary leading-relaxed">{message}</p>
      </div>
    </BaseModal>
  );
};

ConfirmDialog.displayName = "ConfirmDialog";

export default ConfirmDialog;
