/**
 * SoftOne Design System(SDS) - Auth Layout
 * 작성: SoftOne Frontend Team
 * 설명: 로그인/회원가입 등 인증 페이지용 레이아웃.
 *      중앙 정렬된 카드 형태의 심플한 레이아웃입니다.
 */

import React from "react";
import { cn } from "../utils/classUtils";

// ========================================
// Auth Layout Types
// ========================================

export interface AuthLayoutProps {
  /** 페이지 내용 */
  children: React.ReactNode;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// Auth Layout Component
// ========================================

/**
 * AuthLayout - 인증 페이지용 레이아웃
 *
 * @example
 * <AuthLayout>
 *   <LoginForm />
 * </AuthLayout>
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center",
        "bg-gradient-to-br from-softone-bg via-softone-surface to-softone-primary-light",
        "p-4",
        className
      )}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-softone-primary">
            SoftOne Admin
          </h1>
          <p className="text-softone-text-secondary mt-2">
            Enterprise Admin UI Framework
          </p>
        </div>

        {/* Content */}
        {children}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-softone-text-muted">
          © {new Date().getFullYear()} SoftOne. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

AuthLayout.displayName = "AuthLayout";

export default AuthLayout;

