/**
 * SoftOne Design System(SDS) - Login Page
 * 작성: SoftOne Frontend Team
 * 설명: 로그인 페이지.
 *      AuthLayout 안에 LoginForm을 배치합니다.
 */

import React from "react";
import { Navigate } from "react-router-dom";
import { AuthLayout } from "@core/layout/AuthLayout";
import { useAuth } from "@core/hooks/useAuth";
import { LoginForm } from "../ui/LoginForm";

// ========================================
// Login Page Component
// ========================================

/**
 * LoginPage - 로그인 페이지
 *
 * 이미 로그인된 사용자는 대시보드로 리다이렉트됩니다.
 */
export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // 이미 로그인된 경우 대시보드로 리다이렉트
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
};

LoginPage.displayName = "LoginPage";

export default LoginPage;

