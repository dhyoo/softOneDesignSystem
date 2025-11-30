/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 *
 * 중복 업무 감소:
 *   탭 UI 로직(활성 탭 상태, 탭/패널 연결)을 Compound Component 패턴으로 캡슐화.
 *   개발자는 선언적으로 탭을 구성하고 상태 관리를 신경 쓰지 않아도 됨.
 *
 * A11y (WAI-ARIA Tabs Pattern):
 *   - role="tablist", role="tab", role="tabpanel"
 *   - aria-selected, aria-controls, aria-labelledby
 *   - 키보드 네비게이션: 좌/우 방향키로 탭 이동, Enter/Space로 활성화
 *   - 포커스 관리: 활성 탭에 tabIndex="0", 비활성 탭에 tabIndex="-1"
 *
 * Tabs Component (Compound Pattern)
 * - Tabs, Tabs.List, Tabs.Trigger, Tabs.Content
 * - Controlled + Uncontrolled 지원
 *
 * @example
 * <Tabs defaultValue="profile">
 *   <Tabs.List>
 *     <Tabs.Trigger value="profile">프로필</Tabs.Trigger>
 *     <Tabs.Trigger value="settings">설정</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="profile">프로필 내용...</Tabs.Content>
 *   <Tabs.Content value="settings">설정 내용...</Tabs.Content>
 * </Tabs>
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useId,
  KeyboardEvent,
} from "react";
import { cn } from "../../utils/classUtils";

// ========================================
// Context
// ========================================

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  baseId: string;
  orientation: "horizontal" | "vertical";
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs compound components must be used within <Tabs>");
  }
  return context;
}

// ========================================
// Types
// ========================================

export interface TabsProps {
  /** 활성 탭 값 (Controlled) */
  value?: string;
  /** 기본 활성 탭 값 (Uncontrolled) */
  defaultValue?: string;
  /** 탭 변경 핸들러 */
  onValueChange?: (value: string) => void;
  /** 탭 방향 */
  orientation?: "horizontal" | "vertical";
  /** 자식 요소 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
}

export interface TabsListProps {
  /** 자식 요소 (Tabs.Trigger들) */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
}

export interface TabsTriggerProps {
  /** 탭 값 */
  value: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 자식 요소 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
}

export interface TabsContentProps {
  /** 탭 값 */
  value: string;
  /** 자식 요소 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
  /** 비활성 시에도 DOM에 유지 (lazy loading 방지) */
  forceMount?: boolean;
}

// ========================================
// Tabs Root
// ========================================

const TabsRoot: React.FC<TabsProps> = ({
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  orientation = "horizontal",
  children,
  className,
}) => {
  const baseId = useId();
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        baseId,
        orientation,
      }}
    >
      <div
        className={cn(orientation === "vertical" && "flex gap-4", className)}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// ========================================
// Tabs.List
// ========================================

const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  const { orientation } = useTabsContext();
  const listRef = useRef<HTMLDivElement>(null);

  // 키보드 네비게이션
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const triggers = listRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]:not([disabled])'
      );
      if (!triggers || triggers.length === 0) return;

      const currentIndex = Array.from(triggers).findIndex(
        (el) => el === document.activeElement
      );
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      const isHorizontal = orientation === "horizontal";
      const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
      const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";

      switch (event.key) {
        case prevKey:
          nextIndex = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
          event.preventDefault();
          break;
        case nextKey:
          nextIndex = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
          event.preventDefault();
          break;
        case "Home":
          nextIndex = 0;
          event.preventDefault();
          break;
        case "End":
          nextIndex = triggers.length - 1;
          event.preventDefault();
          break;
        default:
          return;
      }

      triggers[nextIndex].focus();
    },
    [orientation]
  );

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      onKeyDown={handleKeyDown}
      className={cn(
        "flex",
        orientation === "horizontal"
          ? "flex-row border-b border-softone-border"
          : "flex-col border-r border-softone-border",
        className
      )}
    >
      {children}
    </div>
  );
};

// ========================================
// Tabs.Trigger
// ========================================

const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  disabled = false,
  children,
  className,
}) => {
  const {
    value: activeValue,
    onValueChange,
    baseId,
    orientation,
  } = useTabsContext();
  const isActive = activeValue === value;
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  const handleClick = () => {
    if (!disabled) {
      onValueChange(value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      id={triggerId}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={panelId}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-softone-primary focus-visible:ring-offset-2",
        orientation === "horizontal"
          ? cn(
              "border-b-2 -mb-px",
              isActive
                ? "border-softone-primary text-softone-primary"
                : "border-transparent text-softone-text-secondary hover:text-softone-text hover:border-softone-border"
            )
          : cn(
              "border-r-2 -mr-px text-left",
              isActive
                ? "border-softone-primary text-softone-primary bg-softone-surface"
                : "border-transparent text-softone-text-secondary hover:text-softone-text"
            ),
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </button>
  );
};

// ========================================
// Tabs.Content
// ========================================

const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
  forceMount = false,
}) => {
  const { value: activeValue, baseId } = useTabsContext();
  const isActive = activeValue === value;
  const triggerId = `${baseId}-trigger-${value}`;
  const panelId = `${baseId}-panel-${value}`;

  if (!forceMount && !isActive) {
    return null;
  }

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      tabIndex={0}
      hidden={!isActive}
      className={cn(
        "mt-4 focus:outline-none",
        !isActive && "hidden",
        className
      )}
    >
      {children}
    </div>
  );
};

// ========================================
// Compound Component Export
// ========================================

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

Tabs.displayName = "Tabs";
TabsList.displayName = "Tabs.List";
TabsTrigger.displayName = "Tabs.Trigger";
TabsContent.displayName = "Tabs.Content";
