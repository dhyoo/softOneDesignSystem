/**
 * SoftOne Design System - SDSLink Component
 * 라우터 중립적인 링크 컴포넌트
 *
 * Core/Features에서 직접 react-router-dom의 Link나 next/link를 사용하지 않고,
 * 이 컴포넌트를 통해 네비게이션합니다.
 */

import React, { useCallback } from "react";
import { useNavigation } from "../../router/NavigationContext";
import { cn } from "../../utils/cn";

// ========================================
// SDSLink Props
// ========================================

export interface SDSLinkProps {
  /** 이동할 경로 */
  href: string;
  /** 자식 요소 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
  /** 현재 경로 대체 여부 */
  replace?: boolean;
  /** 타겟 */
  target?: string;
  /** rel 속성 */
  rel?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 클릭 핸들러 */
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  /** 프리페치 여부 (Next.js에서만 동작) */
  prefetch?: boolean;
  /** aria-label */
  "aria-label"?: string;
}

// ========================================
// SDSLink Component
// ========================================

/**
 * SDSLink - 라우터 중립적인 링크 컴포넌트
 *
 * @example
 * // 기본 사용
 * <SDSLink href="/users">사용자 목록</SDSLink>
 *
 * // replace 옵션
 * <SDSLink href="/login" replace>로그인</SDSLink>
 *
 * // 외부 링크 (새 탭)
 * <SDSLink href="https://example.com" target="_blank">External</SDSLink>
 */
export const SDSLink: React.FC<SDSLinkProps> = ({
  href,
  children,
  className,
  replace = false,
  target,
  rel,
  disabled = false,
  onClick,
  prefetch = false,
  "aria-label": ariaLabel,
}) => {
  const navigation = useNavigation();

  // Prefetch on mount if enabled (Next.js에서 사용)
  React.useEffect(() => {
    if (prefetch && navigation.prefetch) {
      navigation.prefetch(href);
    }
  }, [href, prefetch, navigation]);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // 사용자 정의 onClick 호출
      onClick?.(e);

      // 비활성화된 경우 무시
      if (disabled) {
        e.preventDefault();
        return;
      }

      // 외부 링크는 기본 동작 유지
      if (
        target === "_blank" ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {
        return;
      }

      // 수정자 키가 눌린 경우 기본 동작 유지 (새 탭 열기 등)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      // 기본 동작 방지 후 NavigationApi 사용
      e.preventDefault();

      if (replace) {
        navigation.replace(href);
      } else {
        navigation.push(href);
      }
    },
    [href, replace, onClick, target, disabled, navigation]
  );

  return (
    <a
      href={href}
      className={cn(
        // 기본 스타일 없음 - 사용처에서 스타일링
        disabled && "pointer-events-none opacity-60",
        className
      )}
      onClick={handleClick}
      target={target}
      rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    >
      {children}
    </a>
  );
};

// ========================================
// SDSNavLink (Active State 지원)
// ========================================

export interface SDSNavLinkProps extends SDSLinkProps {
  /** 활성 상태 클래스 */
  activeClassName?: string;
  /** 정확히 일치할 때만 활성화 */
  exact?: boolean;
}

/**
 * SDSNavLink - 활성 상태를 지원하는 네비게이션 링크
 *
 * @example
 * <SDSNavLink
 *   href="/users"
 *   className="text-gray-600"
 *   activeClassName="text-blue-600 font-bold"
 * >
 *   사용자
 * </SDSNavLink>
 */
export const SDSNavLink: React.FC<SDSNavLinkProps> = ({
  href,
  className,
  activeClassName,
  exact = false,
  ...props
}) => {
  const navigation = useNavigation();
  const currentPath = navigation.getCurrentPath();

  const isActive = exact
    ? currentPath === href
    : currentPath.startsWith(href) &&
      (href === "/" ? currentPath === "/" : true);

  return (
    <SDSLink
      href={href}
      className={cn(className, isActive && activeClassName)}
      {...props}
    />
  );
};
