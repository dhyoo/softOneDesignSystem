/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 *
 * 중복 업무 감소:
 *   토스트 렌더링 로직(위치, 애니메이션, 아이콘, 색상)을 캡슐화.
 *   App 루트에서 한 번 렌더하면 어디서든 useToast로 알림 표시 가능.
 *
 * A11y:
 *   - role="alert"로 스크린 리더에 알림 전달
 *   - aria-live="polite"로 비동기 알림 처리
 *   - 닫기 버튼에 명확한 aria-label 제공
 *
 * ToastContainer Component
 * - App 루트(MainLayout, SpaAppShell)에서 렌더
 * - 오른쪽 상단에 토스트 스택 표시
 * - 자동 사라짐 + X 버튼
 *
 * @example
 * // App 루트 또는 MainLayout에서
 * <ToastContainer />
 */

import React from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useToastStore, type Toast, type ToastType } from "../../store/toastStore";
import { cn } from "../../utils/classUtils";

// ========================================
// Toast Type Config
// ========================================

const toastConfig: Record<
  ToastType,
  {
    icon: React.ElementType;
    bgColor: string;
    borderColor: string;
    iconColor: string;
    titleColor: string;
  }
> = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-softone-surface",
    borderColor: "border-softone-success",
    iconColor: "text-softone-success",
    titleColor: "text-softone-success",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-softone-surface",
    borderColor: "border-softone-danger",
    iconColor: "text-softone-danger",
    titleColor: "text-softone-danger",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-softone-surface",
    borderColor: "border-softone-warning",
    iconColor: "text-softone-warning",
    titleColor: "text-softone-warning",
  },
  info: {
    icon: Info,
    bgColor: "bg-softone-surface",
    borderColor: "border-softone-info",
    iconColor: "text-softone-info",
    titleColor: "text-softone-info",
  },
};

// ========================================
// ToastItem Component
// ========================================

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove }) => {
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "relative flex items-start gap-3 p-4 rounded-lg shadow-lg border-l-4",
        "animate-slide-in-right",
        config.bgColor,
        config.borderColor
      )}
    >
      {/* Icon */}
      <Icon className={cn("w-5 h-5 shrink-0 mt-0.5", config.iconColor)} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className={cn("font-semibold text-sm", config.titleColor)}>
            {toast.title}
          </p>
        )}
        <p className="text-sm text-softone-text">{toast.message}</p>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className={cn(
          "shrink-0 p-1 rounded hover:bg-softone-bg transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-softone-primary"
        )}
        aria-label="닫기"
      >
        <X className="w-4 h-4 text-softone-text-muted" />
      </button>
    </div>
  );
};

// ========================================
// ToastContainer Component
// ========================================

export interface ToastContainerProps {
  /** 위치 */
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center";
  /** 최대 표시 개수 */
  maxToasts?: number;
  /** 추가 클래스 */
  className?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  position = "top-right",
  maxToasts = 5,
  className,
}) => {
  const { toasts, removeToast } = useToastStore();

  // 최대 개수 제한
  const visibleToasts = toasts.slice(-maxToasts);

  // 위치별 스타일
  const positionStyles: Record<string, string> = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-center": "top-4 left-1/2 -translate-x-1/2",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
  };

  if (visibleToasts.length === 0) {
    return null;
  }

  const container = (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none",
        positionStyles[position],
        className
      )}
    >
      {visibleToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );

  // Portal로 body에 렌더
  if (typeof document !== "undefined") {
    return createPortal(container, document.body);
  }

  return container;
};

ToastContainer.displayName = "ToastContainer";

