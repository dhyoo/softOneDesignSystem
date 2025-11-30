/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 엔터프라이즈 Admin에서 반복되는 UI 패턴을 캡슐화하고,
 *      테스트/스토리 문서화로 품질을 보장하는 SDS 공통 컴포넌트입니다.
 *
 * Card Component
 * - Card: 카드 컨테이너
 * - CardHeader: 카드 헤더 영역
 * - CardTitle: 카드 제목
 * - CardBody: 카드 본문 영역
 * - CardFooter: 카드 푸터 영역
 */

import React from "react";
import { cn } from "../../utils/classUtils";

// ========================================
// Card Types
// ========================================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 패딩 없이 사용 */
  noPadding?: boolean;
  /** 호버 효과 */
  hoverable?: boolean;
  /** 클릭 가능 */
  clickable?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 액션 버튼 영역 */
  actions?: React.ReactNode;
}

export interface CardTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** 제목 레벨 */
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export type CardBodyProps = React.HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

// ========================================
// Card Component
// ========================================

export const Card: React.FC<CardProps> = ({
  children,
  className,
  noPadding = false,
  hoverable = false,
  clickable = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-softone-surface border border-softone-border rounded-lg shadow-sm",
        !noPadding && "p-4",
        hoverable && "transition-shadow hover:shadow-md",
        clickable && "cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Card.displayName = "Card";

// ========================================
// CardHeader Component
// ========================================

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className,
  actions,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between pb-4 mb-4 border-b border-softone-border",
        className
      )}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

CardHeader.displayName = "CardHeader";

// ========================================
// CardTitle Component
// ========================================

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className,
  as: Component = "h3",
  ...props
}) => {
  return (
    <Component
      className={cn("text-lg font-semibold text-softone-text", className)}
      {...props}
    >
      {children}
    </Component>
  );
};

CardTitle.displayName = "CardTitle";

// ========================================
// CardBody Component
// ========================================

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("text-softone-text-secondary", className)} {...props}>
      {children}
    </div>
  );
};

CardBody.displayName = "CardBody";

// ========================================
// CardFooter Component
// ========================================

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-2 pt-4 mt-4 border-t border-softone-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

CardFooter.displayName = "CardFooter";

