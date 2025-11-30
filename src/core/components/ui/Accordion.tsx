/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 *
 * 중복 업무 감소:
 *   아코디언 UI 로직(확장/축소 상태, 애니메이션)을 Compound Component로 캡슐화.
 *   FAQ, 설정 섹션, 사이드바 메뉴 등에 재사용 가능.
 *
 * A11y (WAI-ARIA Accordion Pattern):
 *   - Trigger는 <button> 요소 사용
 *   - aria-expanded로 확장 상태 전달
 *   - aria-controls로 패널과 연결
 *   - Content는 aria-labelledby로 Trigger와 연결
 *   - Enter/Space로 토글
 *
 * Accordion Component (Compound Pattern)
 * - Accordion, Accordion.Item, Accordion.Trigger, Accordion.Content
 * - type="single" | "multiple" 지원
 * - Controlled + Uncontrolled 지원
 *
 * @example
 * <Accordion type="single" defaultValue="item-1">
 *   <Accordion.Item value="item-1">
 *     <Accordion.Trigger>섹션 1</Accordion.Trigger>
 *     <Accordion.Content>내용 1...</Accordion.Content>
 *   </Accordion.Item>
 *   <Accordion.Item value="item-2">
 *     <Accordion.Trigger>섹션 2</Accordion.Trigger>
 *     <Accordion.Content>내용 2...</Accordion.Content>
 *   </Accordion.Item>
 * </Accordion>
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useId,
  KeyboardEvent,
} from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/classUtils";

// ========================================
// Context
// ========================================

interface AccordionContextValue {
  type: "single" | "multiple";
  value: string[];
  onToggle: (itemValue: string) => void;
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("Accordion compound components must be used within <Accordion>");
  }
  return context;
}

interface AccordionItemContextValue {
  value: string;
  isOpen: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error("Accordion.Trigger/Content must be used within <Accordion.Item>");
  }
  return context;
}

// ========================================
// Types
// ========================================

export interface AccordionProps {
  /** 타입: single(하나만 열림) | multiple(여러 개 열림) */
  type?: "single" | "multiple";
  /** 열린 아이템 값 (Controlled) - single: string, multiple: string[] */
  value?: string | string[];
  /** 기본 열린 아이템 값 (Uncontrolled) */
  defaultValue?: string | string[];
  /** 값 변경 핸들러 */
  onValueChange?: (value: string | string[]) => void;
  /** 자식 요소 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
  /** 모든 아이템 축소 가능 (single 모드에서) */
  collapsible?: boolean;
}

export interface AccordionItemProps {
  /** 아이템 값 */
  value: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 자식 요소 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
}

export interface AccordionTriggerProps {
  /** 자식 요소 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
}

export interface AccordionContentProps {
  /** 자식 요소 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
  /** 닫힌 상태에서도 DOM에 유지 */
  forceMount?: boolean;
}

// ========================================
// Accordion Root
// ========================================

const AccordionRoot: React.FC<AccordionProps> = ({
  type = "single",
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  className,
  collapsible = true,
}) => {
  const baseId = useId();
  const isControlled = controlledValue !== undefined;

  // Normalize to array
  const normalizeValue = (val: string | string[] | undefined): string[] => {
    if (val === undefined) return [];
    return Array.isArray(val) ? val : [val];
  };

  const [internalValue, setInternalValue] = useState<string[]>(
    normalizeValue(defaultValue)
  );

  const value = isControlled ? normalizeValue(controlledValue) : internalValue;

  const handleToggle = useCallback(
    (itemValue: string) => {
      let newValue: string[];

      if (type === "single") {
        if (value.includes(itemValue)) {
          newValue = collapsible ? [] : value;
        } else {
          newValue = [itemValue];
        }
      } else {
        if (value.includes(itemValue)) {
          newValue = value.filter((v) => v !== itemValue);
        } else {
          newValue = [...value, itemValue];
        }
      }

      if (!isControlled) {
        setInternalValue(newValue);
      }

      if (type === "single") {
        onValueChange?.(newValue[0] || "");
      } else {
        onValueChange?.(newValue);
      }
    },
    [type, value, isControlled, onValueChange, collapsible]
  );

  return (
    <AccordionContext.Provider
      value={{
        type,
        value,
        onToggle: handleToggle,
        baseId,
      }}
    >
      <div className={cn("divide-y divide-softone-border", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

// ========================================
// Accordion.Item
// ========================================

const AccordionItem: React.FC<AccordionItemProps> = ({
  value,
  disabled = false,
  children,
  className,
}) => {
  const { value: openValues, baseId } = useAccordionContext();
  const isOpen = openValues.includes(value);
  const triggerId = `${baseId}-trigger-${value}`;
  const contentId = `${baseId}-content-${value}`;

  return (
    <AccordionItemContext.Provider
      value={{
        value,
        isOpen,
        triggerId,
        contentId,
      }}
    >
      <div
        className={cn(
          "border-softone-border",
          disabled && "opacity-50 pointer-events-none",
          className
        )}
        data-state={isOpen ? "open" : "closed"}
        data-disabled={disabled || undefined}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
};

// ========================================
// Accordion.Trigger
// ========================================

const AccordionTrigger: React.FC<AccordionTriggerProps> = ({
  children,
  className,
}) => {
  const { onToggle } = useAccordionContext();
  const { value, isOpen, triggerId, contentId } = useAccordionItemContext();

  const handleClick = () => {
    onToggle(value);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <h3 className="m-0">
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex w-full items-center justify-between py-4 px-4 text-left",
          "font-medium text-softone-text",
          "hover:bg-softone-surface-hover transition-colors",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-softone-primary focus-visible:ring-inset",
          className
        )}
      >
        {children}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-softone-text-muted transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
    </h3>
  );
};

// ========================================
// Accordion.Content
// ========================================

const AccordionContent: React.FC<AccordionContentProps> = ({
  children,
  className,
  forceMount = false,
}) => {
  const { isOpen, triggerId, contentId } = useAccordionItemContext();

  if (!forceMount && !isOpen) {
    return null;
  }

  return (
    <div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      hidden={!isOpen}
      className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "animate-accordion-down" : "animate-accordion-up",
        !isOpen && !forceMount && "hidden",
        className
      )}
    >
      <div className="px-4 pb-4 pt-0 text-softone-text-secondary">
        {children}
      </div>
    </div>
  );
};

// ========================================
// Compound Component Export
// ========================================

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

Accordion.displayName = "Accordion";
AccordionItem.displayName = "Accordion.Item";
AccordionTrigger.displayName = "Accordion.Trigger";
AccordionContent.displayName = "Accordion.Content";

