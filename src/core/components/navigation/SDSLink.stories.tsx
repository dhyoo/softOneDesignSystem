/**
 * SoftOne Design System - SDSLink Stories
 * SDSLink 컴포넌트 Storybook 문서
 */
import type { Meta, StoryObj } from "@storybook/react";
import { SDSLink, SDSNavLink } from "./SDSLink";
import { NavigationProvider, type NavigationApi } from "../../router/NavigationContext";

// Mock Navigation API for Storybook
const mockNavigation: NavigationApi = {
  push: (path) => console.log(`[Mock] Navigate to: ${path}`),
  replace: (path) => console.log(`[Mock] Replace with: ${path}`),
  back: () => console.log("[Mock] Go back"),
  forward: () => console.log("[Mock] Go forward"),
  getCurrentPath: () => "/dashboard",
  getQueryParams: () => new URLSearchParams(),
};

const meta: Meta<typeof SDSLink> = {
  title: "Core/Navigation/SDSLink",
  component: SDSLink,
  decorators: [
    (Story) => (
      <NavigationProvider navigation={mockNavigation}>
        <Story />
      </NavigationProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 링크
 */
export const Default: Story = {
  args: {
    href: "/users",
    children: "사용자 목록으로 이동",
  },
};

/**
 * 스타일이 적용된 링크
 */
export const Styled: Story = {
  args: {
    href: "/dashboard",
    children: "대시보드",
    className: "text-blue-600 hover:text-blue-800 underline font-medium",
  },
};

/**
 * 비활성화된 링크
 */
export const Disabled: Story = {
  args: {
    href: "/admin",
    children: "관리자 페이지 (비활성화)",
    disabled: true,
    className: "text-gray-400",
  },
};

/**
 * 외부 링크 (새 탭)
 */
export const External: Story = {
  args: {
    href: "https://softone.co.kr",
    children: "SoftOne 홈페이지",
    target: "_blank",
    className: "text-blue-600 hover:text-blue-800 underline",
  },
};

/**
 * 버튼 스타일 링크
 */
export const ButtonStyle: Story = {
  args: {
    href: "/users/create",
    children: "새 사용자 등록",
    className:
      "inline-flex items-center px-4 py-2 bg-softone-primary text-white rounded-lg hover:bg-blue-700 transition-colors",
  },
};

/**
 * SDSNavLink - 활성 상태 표시
 */
export const NavLinkActive: StoryObj<typeof SDSNavLink> = {
  render: () => (
    <nav className="flex gap-4">
      <SDSNavLink
        href="/dashboard"
        className="text-gray-600"
        activeClassName="text-blue-600 font-bold"
      >
        대시보드
      </SDSNavLink>
      <SDSNavLink
        href="/users"
        className="text-gray-600"
        activeClassName="text-blue-600 font-bold"
      >
        사용자
      </SDSNavLink>
      <SDSNavLink
        href="/settings"
        className="text-gray-600"
        activeClassName="text-blue-600 font-bold"
      >
        설정
      </SDSNavLink>
    </nav>
  ),
};

