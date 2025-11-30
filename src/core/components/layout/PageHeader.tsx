/**
 * SoftOne Design System(SDS) - Layout Component
 * 작성: SoftOne Frontend Team
 * 설명: 페이지 상단 헤더 레이아웃 컴포넌트.
 *      모든 페이지에서 일관된 헤더 스타일을 제공합니다.
 *
 * PageHeader Component
 * - 제목, 부제목, 액션 버튼 영역
 * - 아이콘 및 브레드크럼 옵션
 */

import React from "react";
import { cn } from "../../utils/classUtils";

// ========================================
// PageHeader Types
// ========================================

export interface PageHeaderProps {
  /** 페이지 제목 */
  title: string;
  /** 부제목/설명 */
  subtitle?: string;
  /** 액션 버튼 영역 */
  actions?: React.ReactNode;
  /** 제목 앞 아이콘 */
  icon?: React.ReactNode;
  /** 브레드크럼 영역 */
  breadcrumbs?: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// PageHeader Component
// ========================================

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  icon,
  breadcrumbs,
  className,
}) => {
  return (
    <div className={cn("mb-6", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}

      {/* Header Content */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-softone-primary/10 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-softone-text">{title}</h1>
            {subtitle && (
              <p className="text-sm text-softone-text-secondary mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

PageHeader.displayName = "PageHeader";

// ========================================
// PageHeaderSkeleton Component
// ========================================

export const PageHeaderSkeleton: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <div className={cn("mb-6 animate-pulse", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-softone-border" />
          <div className="space-y-2">
            <div className="h-7 bg-softone-border rounded w-48" />
            <div className="h-4 bg-softone-border rounded w-64" />
          </div>
        </div>
        <div className="h-10 bg-softone-border rounded w-32" />
      </div>
    </div>
  );
};

PageHeaderSkeleton.displayName = "PageHeaderSkeleton";

