/**
 * SoftOne Design System(SDS) - Tabs Stories
 * 작성: SoftOne Frontend Team
 * 설명: Tabs 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { User, Settings, Bell, Shield } from "lucide-react";
import { Tabs } from "../Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Core/UI/Tabs",
  component: Tabs,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 Tabs 컴포넌트입니다.

### 특징
- **Compound Pattern**: Tabs, Tabs.List, Tabs.Trigger, Tabs.Content
- **Controlled/Uncontrolled**: 두 가지 모드 지원
- **orientation**: 가로/세로 배치 지원
- **A11y**: role="tablist", 키보드 네비게이션 지원

### 사용법
\`\`\`tsx
import { Tabs } from '@core/components/ui';

<Tabs defaultValue="profile">
  <Tabs.List>
    <Tabs.Trigger value="profile">프로필</Tabs.Trigger>
    <Tabs.Trigger value="settings">설정</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="profile">프로필 내용</Tabs.Content>
  <Tabs.Content value="settings">설정 내용</Tabs.Content>
</Tabs>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
      description: "탭 방향",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 Tabs
 */
export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Trigger value="profile">프로필</Tabs.Trigger>
          <Tabs.Trigger value="settings">설정</Tabs.Trigger>
          <Tabs.Trigger value="notifications">알림</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile">
          <div className="p-4">
            <h3 className="font-semibold">프로필</h3>
            <p className="text-sm text-gray-600 mt-2">
              사용자 프로필 정보를 수정할 수 있습니다.
            </p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="settings">
          <div className="p-4">
            <h3 className="font-semibold">설정</h3>
            <p className="text-sm text-gray-600 mt-2">
              시스템 설정을 변경할 수 있습니다.
            </p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="notifications">
          <div className="p-4">
            <h3 className="font-semibold">알림</h3>
            <p className="text-sm text-gray-600 mt-2">
              알림 설정을 관리할 수 있습니다.
            </p>
          </div>
        </Tabs.Content>
      </Tabs>
    </div>
  ),
};

// ========================================
// Orientation
// ========================================

/**
 * 세로 방향 (Vertical)
 */
export const Vertical: Story = {
  render: () => (
    <div className="w-[500px]">
      <Tabs defaultValue="profile" orientation="vertical">
        <Tabs.List>
          <Tabs.Trigger value="profile">프로필</Tabs.Trigger>
          <Tabs.Trigger value="settings">설정</Tabs.Trigger>
          <Tabs.Trigger value="security">보안</Tabs.Trigger>
          <Tabs.Trigger value="notifications">알림</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile">
          <div className="p-4">
            <h3 className="font-semibold">프로필</h3>
            <p className="text-sm text-gray-600 mt-2">
              사용자 프로필 정보를 수정할 수 있습니다.
            </p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="settings">
          <div className="p-4">
            <h3 className="font-semibold">설정</h3>
            <p className="text-sm text-gray-600 mt-2">
              시스템 설정을 변경할 수 있습니다.
            </p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="security">
          <div className="p-4">
            <h3 className="font-semibold">보안</h3>
            <p className="text-sm text-gray-600 mt-2">
              보안 설정을 관리할 수 있습니다.
            </p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="notifications">
          <div className="p-4">
            <h3 className="font-semibold">알림</h3>
            <p className="text-sm text-gray-600 mt-2">
              알림 설정을 관리할 수 있습니다.
            </p>
          </div>
        </Tabs.Content>
      </Tabs>
    </div>
  ),
};

// ========================================
// With Icons
// ========================================

/**
 * 아이콘 포함
 */
export const WithIcons: Story = {
  render: () => (
    <div className="w-[500px]">
      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Trigger value="profile">
            <User className="w-4 h-4 mr-2" />
            프로필
          </Tabs.Trigger>
          <Tabs.Trigger value="settings">
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Tabs.Trigger>
          <Tabs.Trigger value="security">
            <Shield className="w-4 h-4 mr-2" />
            보안
          </Tabs.Trigger>
          <Tabs.Trigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            알림
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile">
          <div className="p-4">
            <h3 className="font-semibold">프로필</h3>
            <p className="text-sm text-gray-600 mt-2">
              사용자 프로필 정보입니다.
            </p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="settings">
          <div className="p-4">
            <h3 className="font-semibold">설정</h3>
            <p className="text-sm text-gray-600 mt-2">시스템 설정입니다.</p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="security">
          <div className="p-4">
            <h3 className="font-semibold">보안</h3>
            <p className="text-sm text-gray-600 mt-2">보안 설정입니다.</p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="notifications">
          <div className="p-4">
            <h3 className="font-semibold">알림</h3>
            <p className="text-sm text-gray-600 mt-2">알림 설정입니다.</p>
          </div>
        </Tabs.Content>
      </Tabs>
    </div>
  ),
};

// ========================================
// State Variants
// ========================================

/**
 * 비활성화된 탭
 */
export const WithDisabledTab: Story = {
  render: () => (
    <div className="w-[400px]">
      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Trigger value="profile">프로필</Tabs.Trigger>
          <Tabs.Trigger value="settings">설정</Tabs.Trigger>
          <Tabs.Trigger value="admin" disabled>
            관리자 (비활성)
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="profile">
          <div className="p-4">
            <p className="text-sm text-gray-600">프로필 내용</p>
          </div>
        </Tabs.Content>
        <Tabs.Content value="settings">
          <div className="p-4">
            <p className="text-sm text-gray-600">설정 내용</p>
          </div>
        </Tabs.Content>
      </Tabs>
    </div>
  ),
};

/**
 * Controlled 모드
 */
export const Controlled: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState("profile");

    return (
      <div className="w-[400px] space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Trigger value="profile">프로필</Tabs.Trigger>
            <Tabs.Trigger value="settings">설정</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="profile">
            <div className="p-4">
              <p className="text-sm text-gray-600">프로필 내용</p>
            </div>
          </Tabs.Content>
          <Tabs.Content value="settings">
            <div className="p-4">
              <p className="text-sm text-gray-600">설정 내용</p>
            </div>
          </Tabs.Content>
        </Tabs>
        <p className="text-sm text-gray-500">현재 탭: {activeTab}</p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm border rounded"
            onClick={() => setActiveTab("profile")}
          >
            프로필로 이동
          </button>
          <button
            className="px-3 py-1 text-sm border rounded"
            onClick={() => setActiveTab("settings")}
          >
            설정으로 이동
          </button>
        </div>
      </div>
    );
  },
};

// ========================================
// Complex Examples
// ========================================

/**
 * 설정 페이지 예시
 */
export const SettingsPageExample: Story = {
  render: () => (
    <div className="w-[600px] border rounded-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">설정</h2>
        <p className="text-sm text-gray-500">
          계정 및 시스템 설정을 관리합니다.
        </p>
      </div>
      <Tabs defaultValue="account">
        <Tabs.List className="px-4 pt-2">
          <Tabs.Trigger value="account">계정</Tabs.Trigger>
          <Tabs.Trigger value="appearance">외관</Tabs.Trigger>
          <Tabs.Trigger value="notifications">알림</Tabs.Trigger>
          <Tabs.Trigger value="privacy">개인정보</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="account">
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">이름</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded"
                defaultValue="홍길동"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">이메일</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded"
                defaultValue="hong@example.com"
              />
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content value="appearance">
          <div className="p-4">
            <h3 className="font-semibold mb-2">테마 설정</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="theme" defaultChecked />
                라이트 모드
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="theme" />
                다크 모드
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="theme" />
                시스템 설정
              </label>
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content value="notifications">
          <div className="p-4">
            <h3 className="font-semibold mb-2">알림 설정</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                이메일 알림
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                푸시 알림
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                SMS 알림
              </label>
            </div>
          </div>
        </Tabs.Content>
        <Tabs.Content value="privacy">
          <div className="p-4">
            <h3 className="font-semibold mb-2">개인정보 설정</h3>
            <p className="text-sm text-gray-600">
              개인정보 보호 관련 설정을 관리합니다.
            </p>
          </div>
        </Tabs.Content>
      </Tabs>
    </div>
  ),
};

/**
 * 키보드 네비게이션 안내
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <div className="space-y-4 w-[500px]">
      <div className="p-4 bg-blue-50 rounded-lg text-sm">
        <h4 className="font-semibold mb-2">키보드 네비게이션</h4>
        <ul className="space-y-1 text-gray-700">
          <li>
            • <kbd className="px-1 bg-white rounded">←</kbd>{" "}
            <kbd className="px-1 bg-white rounded">→</kbd> : 탭 이동
          </li>
          <li>
            • <kbd className="px-1 bg-white rounded">Home</kbd> : 첫 번째 탭으로
          </li>
          <li>
            • <kbd className="px-1 bg-white rounded">End</kbd> : 마지막 탭으로
          </li>
          <li>
            • <kbd className="px-1 bg-white rounded">Enter</kbd> /{" "}
            <kbd className="px-1 bg-white rounded">Space</kbd> : 탭 활성화
          </li>
        </ul>
      </div>
      <Tabs defaultValue="tab1">
        <Tabs.List>
          <Tabs.Trigger value="tab1">탭 1</Tabs.Trigger>
          <Tabs.Trigger value="tab2">탭 2</Tabs.Trigger>
          <Tabs.Trigger value="tab3">탭 3</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="tab1">
          <div className="p-4">
            탭 1 내용 - 탭에 포커스 후 화살표 키를 사용해보세요.
          </div>
        </Tabs.Content>
        <Tabs.Content value="tab2">
          <div className="p-4">탭 2 내용</div>
        </Tabs.Content>
        <Tabs.Content value="tab3">
          <div className="p-4">탭 3 내용</div>
        </Tabs.Content>
      </Tabs>
    </div>
  ),
};
