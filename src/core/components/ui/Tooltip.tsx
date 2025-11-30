/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 *
 * Tooltip Component
 * - 호버/포커스 시 추가 정보를 표시하는 툴팁
 * - 다양한 위치(top, bottom, left, right) 지원
 * - 딜레이 설정 가능
 * - A11y: role="tooltip", aria-describedby 지원
 *
 * @example
 * <Tooltip content="추가 정보">
 *   <Button>호버하세요</Button>
 * </Tooltip>
 */

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  cloneElement,
  isValidElement,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils/classUtils";

// ========================================
// Types
// ========================================

export type TooltipPosition = "top" | "bottom" | "left" | "right";
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipProps {
  /** 툴팁 내용 */
  content: React.ReactNode;
  /** 툴팁 위치 */
  position?: TooltipPosition;
  /** 정렬 */
  align?: TooltipAlign;
  /** 표시 딜레이 (ms) */
  delayShow?: number;
  /** 숨김 딜레이 (ms) */
  delayHide?: number;
  /** 비활성화 */
  disabled?: boolean;
  /** 최대 너비 */
  maxWidth?: number;
  /** 자식 요소 (트리거) */
  children: React.ReactElement;
  /** 추가 클래스 */
  className?: string;
  /** 항상 표시 (제어 모드) */
  open?: boolean;
  /** 표시 상태 변경 콜백 */
  onOpenChange?: (open: boolean) => void;
}

// ========================================
// Position Calculation
// ========================================

interface Position {
  top: number;
  left: number;
}

const OFFSET = 8;

const calculatePosition = (
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  position: TooltipPosition,
  align: TooltipAlign
): Position => {
  let top = 0;
  let left = 0;

  // 기본 위치 계산
  switch (position) {
    case "top":
      top = triggerRect.top - tooltipRect.height - OFFSET;
      break;
    case "bottom":
      top = triggerRect.bottom + OFFSET;
      break;
    case "left":
      left = triggerRect.left - tooltipRect.width - OFFSET;
      break;
    case "right":
      left = triggerRect.right + OFFSET;
      break;
  }

  // 정렬 계산
  if (position === "top" || position === "bottom") {
    switch (align) {
      case "start":
        left = triggerRect.left;
        break;
      case "center":
        left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
        break;
      case "end":
        left = triggerRect.right - tooltipRect.width;
        break;
    }
  } else {
    switch (align) {
      case "start":
        top = triggerRect.top;
        break;
      case "center":
        top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
        break;
      case "end":
        top = triggerRect.bottom - tooltipRect.height;
        break;
    }
  }

  // 스크롤 위치 추가
  top += window.scrollY;
  left += window.scrollX;

  // 화면 경계 체크
  const padding = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (left < padding) left = padding;
  if (left + tooltipRect.width > viewportWidth - padding) {
    left = viewportWidth - tooltipRect.width - padding;
  }
  if (top < padding + window.scrollY) top = padding + window.scrollY;
  if (top + tooltipRect.height > viewportHeight + window.scrollY - padding) {
    top = viewportHeight + window.scrollY - tooltipRect.height - padding;
  }

  return { top, left };
};

// ========================================
// Arrow Styles
// ========================================

const getArrowStyles = (position: TooltipPosition): string => {
  const base = "absolute w-0 h-0 border-solid";

  switch (position) {
    case "top":
      return cn(
        base,
        "bottom-0 left-1/2 -translate-x-1/2 translate-y-full",
        "border-l-[6px] border-l-transparent",
        "border-r-[6px] border-r-transparent",
        "border-t-[6px] border-t-gray-900"
      );
    case "bottom":
      return cn(
        base,
        "top-0 left-1/2 -translate-x-1/2 -translate-y-full",
        "border-l-[6px] border-l-transparent",
        "border-r-[6px] border-r-transparent",
        "border-b-[6px] border-b-gray-900"
      );
    case "left":
      return cn(
        base,
        "right-0 top-1/2 -translate-y-1/2 translate-x-full",
        "border-t-[6px] border-t-transparent",
        "border-b-[6px] border-b-transparent",
        "border-l-[6px] border-l-gray-900"
      );
    case "right":
      return cn(
        base,
        "left-0 top-1/2 -translate-y-1/2 -translate-x-full",
        "border-t-[6px] border-t-transparent",
        "border-b-[6px] border-b-transparent",
        "border-r-[6px] border-r-gray-900"
      );
  }
};

// ========================================
// Tooltip Component
// ========================================

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  position = "top",
  align = "center",
  delayShow = 200,
  delayHide = 0,
  disabled = false,
  maxWidth = 250,
  children,
  className,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [coords, setCoords] = useState<Position>({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Controlled vs Uncontrolled
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const tooltipId = useRef(
    `tooltip-${Math.random().toString(36).substr(2, 9)}`
  );

  // 위치 업데이트
  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    const newCoords = calculatePosition(
      triggerRect,
      tooltipRect,
      position,
      align
    );
    setCoords(newCoords);
    setIsPositioned(true);
  }, [position, align]);

  // 표시
  const show = useCallback(() => {
    if (disabled) return;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    showTimeoutRef.current = setTimeout(() => {
      if (!isControlled) {
        setInternalOpen(true);
      }
      onOpenChange?.(true);
    }, delayShow);
  }, [disabled, delayShow, isControlled, onOpenChange]);

  // 숨김
  const hide = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
    }

    hideTimeoutRef.current = setTimeout(() => {
      if (!isControlled) {
        setInternalOpen(false);
      }
      setIsPositioned(false);
      onOpenChange?.(false);
    }, delayHide);
  }, [delayHide, isControlled, onOpenChange]);

  // 위치 업데이트 (열릴 때)
  useEffect(() => {
    if (isOpen) {
      // 약간의 딜레이 후 위치 계산 (DOM 렌더링 완료 후)
      requestAnimationFrame(() => {
        updatePosition();
      });

      // 스크롤/리사이즈 이벤트
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    }
  }, [isOpen, updatePosition]);

  // 클린업
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // 자식 요소에 이벤트 핸들러 추가
  if (!isValidElement(children)) {
    return children;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const childPropsAny = children.props as any;

  const childProps = {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      childPropsAny.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      childPropsAny.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      show();
      childPropsAny.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      childPropsAny.onBlur?.(e);
    },
    "aria-describedby": isOpen ? tooltipId.current : undefined,
  };

  const trigger = cloneElement(children, childProps);

  // 툴팁 내용 없으면 트리거만 반환
  if (!content) {
    return trigger;
  }

  // 툴팁 렌더링
  const tooltip =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId.current}
            role="tooltip"
            className={cn(
              "fixed z-[9999] px-3 py-2 text-sm text-white bg-gray-900 rounded-md shadow-lg",
              className
            )}
            style={{
              top: coords.top,
              left: coords.left,
              maxWidth,
              visibility: isPositioned ? "visible" : "hidden",
            }}
          >
            {content}
            <div className={getArrowStyles(position)} />
          </div>,
          document.body
        )
      : null;

  return (
    <>
      {trigger}
      {tooltip}
    </>
  );
};

Tooltip.displayName = "Tooltip";

export default Tooltip;
