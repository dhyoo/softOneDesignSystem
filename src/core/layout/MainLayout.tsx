/**
 * SoftOne Design System(SDS) - Main Layout Component
 * 작성: SoftOne Frontend Team
 * 설명: Admin 메인 레이아웃 (Header + Sidebar + Content).
 *      SDS UI Kit 스타일을 적용한 엔터프라이즈 레이아웃입니다.
 *      Step 7: ToastContainer를 포함하여 전역 알림 지원.
 */

import React from "react";
import { cn } from "../utils/classUtils";
import { useUIStore } from "../store/uiStore";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ToastContainer } from "../components/ui/ToastContainer";
import { DialogRoot } from "../components/ui/DialogRoot";

// ========================================
// MainLayout Types
// ========================================

export interface MainLayoutProps {
  /** 페이지 내용 */
  children: React.ReactNode;
  /** 현재 사용자 역할 (Sidebar에서 useAuth로 직접 가져옴) */
  userRoles?: string[];
  /** 사용자 이름 */
  userName?: string;
  /** 사용자 이메일 */
  userEmail?: string;
  /** 동적 메뉴 사용 여부 (DB에서 메뉴 로드) */
  useDynamicMenu?: boolean;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// MainLayout Component
// ========================================

/**
 * MainLayout - Admin 메인 레이아웃
 *
 * @example
 * <MainLayout>
 *   <DashboardPage />
 * </MainLayout>
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  userName,
  userEmail,
  useDynamicMenu = false,
  className,
}) => {
  const { isSidebarCollapsed } = useUIStore();

  return (
    <div className="flex min-h-screen bg-softone-bg">
      {/* Toast Container - 전역 알림 */}
      <ToastContainer position="top-right" />

      {/* Dialog Root - 전역 다이얼로그 (Step 10) */}
      <DialogRoot />

      {/* Sidebar - 동적 메뉴 또는 정적 메뉴 */}
      <Sidebar useDynamicMenu={useDynamicMenu} />

      {/* Main Content Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarCollapsed ? "ml-16" : "ml-sidebar"
        )}
      >
        {/* Header */}
        <Header userName={userName} userEmail={userEmail} />

        {/* Page Content */}
        <main className={cn("flex-1 p-6", className)}>{children}</main>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-softone-border text-center text-sm text-softone-text-muted">
          © {new Date().getFullYear()} SoftOne. All Rights Reserved.
        </footer>
      </div>
    </div>
  );
};

MainLayout.displayName = "MainLayout";

export default MainLayout;
