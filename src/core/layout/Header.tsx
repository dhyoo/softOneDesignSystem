/**
 * SoftOne Design System(SDS) - Header Component
 * 작성: SoftOne Frontend Team
 * 설명: Admin 상단 헤더 컴포넌트.
 *      사이드바 토글, 검색, 알림, 사용자 메뉴 등을 포함합니다.
 */

import React from "react";
import { Menu, Search, Bell, User, LogOut, Settings } from "lucide-react";
import { cn } from "../utils/classUtils";
import { useUIStore } from "../store/uiStore";
import { useAuth } from "../hooks/useAuth";
import { useNavigation } from "../router/NavigationContext";

// ========================================
// Header Types
// ========================================

export interface HeaderProps {
  /** 사용자 이름 */
  userName?: string;
  /** 사용자 이메일 */
  userEmail?: string;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// Header Component
// ========================================

export const Header: React.FC<HeaderProps> = ({
  userName,
  userEmail,
  className,
}) => {
  const { toggleSidebar } = useUIStore();
  const { user, logout } = useAuth();
  const navigation = useNavigation();
  const [showUserMenu, setShowUserMenu] = React.useState(false);

  // 로그아웃 처리
  const handleLogout = React.useCallback(() => {
    setShowUserMenu(false);
    logout();
    // 상태 업데이트 후 리다이렉트
    setTimeout(() => {
      navigation.replace("/auth/login");
    }, 0);
  }, [logout, navigation]);

  // 사용자 정보 (props 우선, 없으면 store에서)
  const displayName = userName || user?.name || "사용자";
  const displayEmail = userEmail || user?.email || "user@softone.co.kr";

  return (
    <header
      className={cn(
        "sticky top-0 h-header bg-softone-surface border-b border-softone-border z-10",
        "flex items-center justify-between px-4 lg:px-6",
        className
      )}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-softone-surface-hover transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-softone-text-secondary" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-softone-bg rounded-lg border border-softone-border">
          <Search className="w-4 h-4 text-softone-text-muted" />
          <input
            type="text"
            placeholder="검색..."
            className="bg-transparent border-none outline-none text-sm w-48 lg:w-64 placeholder:text-softone-text-muted"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button
          className="relative p-2 rounded-lg hover:bg-softone-surface-hover transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-softone-text-secondary" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-softone-danger rounded-full" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-softone-surface-hover transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-softone-primary flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-sm font-medium text-softone-text">
                {displayName}
              </div>
              <div className="text-xs text-softone-text-muted">
                {displayEmail}
              </div>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              {/* 백드롭 */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-softone-surface border border-softone-border rounded-lg shadow-lg py-2 sds-animate-scale-in z-20">
                <div className="px-4 py-2 border-b border-softone-border">
                  <div className="text-sm font-medium text-softone-text">
                    {displayName}
                  </div>
                  <div className="text-xs text-softone-text-muted">
                    {displayEmail}
                  </div>
                  {user?.roles && user.roles.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.roles.map((role) => (
                        <span
                          key={role}
                          className="px-1.5 py-0.5 text-xs bg-softone-primary-light text-softone-primary rounded"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-softone-text-secondary hover:bg-softone-surface-hover transition-colors"
                  onClick={() => navigation.push("/settings")}
                >
                  <Settings className="w-4 h-4" />
                  설정
                </button>
                <button
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                  로그아웃
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

Header.displayName = "Header";

export default Header;
