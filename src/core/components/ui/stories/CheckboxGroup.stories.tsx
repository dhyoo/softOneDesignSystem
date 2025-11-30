/**
 * SoftOne Design System(SDS) - CheckboxGroup Stories
 * 작성: SoftOne Frontend Team
 * 설명: CheckboxGroup 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { CheckboxGroup, type CheckboxOption } from "../CheckboxGroup";

const meta: Meta<typeof CheckboxGroup> = {
  title: "Core/UI/CheckboxGroup",
  component: CheckboxGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 CheckboxGroup 컴포넌트입니다.

### 특징
- **다중 선택**: 여러 항목을 동시에 선택 가능
- **Controlled/Uncontrolled**: 두 가지 모드 지원
- **direction**: 세로/가로 배치 지원
- **A11y**: role="group" 및 aria-labelledby 적용

### 사용법
\`\`\`tsx
import { CheckboxGroup } from '@core/components/ui';

const options = [
  { value: 'apple', label: '사과' },
  { value: 'banana', label: '바나나' },
];

<CheckboxGroup
  options={options}
  value={selected}
  onChange={setSelected}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    direction: {
      control: "select",
      options: ["vertical", "horizontal"],
      description: "배치 방향",
    },
    disabled: {
      control: "boolean",
      description: "전체 비활성화",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Sample Options
// ========================================

const fruitOptions: CheckboxOption[] = [
  { value: "apple", label: "사과" },
  { value: "banana", label: "바나나" },
  { value: "orange", label: "오렌지" },
  { value: "grape", label: "포도" },
];

const statusOptions: CheckboxOption[] = [
  { value: "ACTIVE", label: "활성" },
  { value: "INACTIVE", label: "비활성" },
  { value: "PENDING", label: "대기중" },
  { value: "SUSPENDED", label: "정지" },
];

const permissionOptions: CheckboxOption[] = [
  { value: "read", label: "읽기" },
  { value: "write", label: "쓰기" },
  { value: "delete", label: "삭제" },
  { value: "admin", label: "관리자", disabled: true },
];

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 CheckboxGroup (세로)
 */
export const Default: Story = {
  args: {
    options: fruitOptions,
    defaultValue: ["apple"],
  },
};

/**
 * 가로 배치
 */
export const Horizontal: Story = {
  args: {
    options: fruitOptions,
    direction: "horizontal",
    defaultValue: ["apple", "banana"],
  },
};

// ========================================
// State Variants
// ========================================

/**
 * 전체 비활성화
 */
export const Disabled: Story = {
  args: {
    options: fruitOptions,
    disabled: true,
    defaultValue: ["apple"],
  },
};

/**
 * 일부 옵션 비활성화
 */
export const WithDisabledOptions: Story = {
  args: {
    options: permissionOptions,
    defaultValue: ["read", "write"],
  },
};

/**
 * 기본값 없음
 */
export const NoDefaultValue: Story = {
  args: {
    options: statusOptions,
  },
};

// ========================================
// Interactive Examples
// ========================================

/**
 * Controlled 모드
 */
export const Controlled: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["apple"]);
    
    return (
      <div className="space-y-4">
        <CheckboxGroup
          options={fruitOptions}
          value={selected}
          onChange={setSelected}
        />
        <div className="text-sm text-gray-500">
          선택됨: {selected.length > 0 ? selected.join(", ") : "없음"}
        </div>
      </div>
    );
  },
};

/**
 * 상태 필터 예시
 */
export const StatusFilter: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(["ACTIVE", "PENDING"]);
    
    return (
      <div className="p-4 border rounded-lg space-y-4 w-80">
        <h3 className="font-semibold">상태 필터</h3>
        <CheckboxGroup
          options={statusOptions}
          value={selected}
          onChange={setSelected}
          label="상태 선택"
        />
        <div className="text-sm text-gray-500 pt-2 border-t">
          {selected.length}개 상태 선택됨
        </div>
      </div>
    );
  },
};

/**
 * 권한 설정 예시
 */
export const PermissionSettings: Story = {
  render: () => {
    const [permissions, setPermissions] = useState<string[]>(["read"]);
    
    return (
      <div className="p-4 border rounded-lg space-y-4 w-80">
        <h3 className="font-semibold">권한 설정</h3>
        <CheckboxGroup
          options={permissionOptions}
          value={permissions}
          onChange={setPermissions}
          direction="horizontal"
        />
        <p className="text-xs text-gray-400">
          * 관리자 권한은 슈퍼 관리자만 부여할 수 있습니다.
        </p>
      </div>
    );
  },
};

// ========================================
// Showcase
// ========================================

/**
 * 방향 비교
 */
export const DirectionComparison: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">세로 배치 (vertical)</h3>
        <CheckboxGroup
          options={fruitOptions}
          direction="vertical"
          defaultValue={["apple"]}
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">가로 배치 (horizontal)</h3>
        <CheckboxGroup
          options={fruitOptions}
          direction="horizontal"
          defaultValue={["apple"]}
        />
      </div>
    </div>
  ),
};

/**
 * 폼 예시
 */
export const FormExample: Story = {
  render: () => {
    const [interests, setInterests] = useState<string[]>([]);
    const [notifications, setNotifications] = useState<string[]>(["email"]);
    
    const interestOptions: CheckboxOption[] = [
      { value: "tech", label: "기술" },
      { value: "design", label: "디자인" },
      { value: "business", label: "비즈니스" },
      { value: "marketing", label: "마케팅" },
    ];
    
    const notificationOptions: CheckboxOption[] = [
      { value: "email", label: "이메일" },
      { value: "sms", label: "SMS" },
      { value: "push", label: "푸시 알림" },
    ];
    
    return (
      <div className="space-y-6 p-4 border rounded-lg w-96">
        <h2 className="text-lg font-bold">알림 설정</h2>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">관심 분야</label>
          <CheckboxGroup
            options={interestOptions}
            value={interests}
            onChange={setInterests}
            direction="horizontal"
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium">알림 수단</label>
          <CheckboxGroup
            options={notificationOptions}
            value={notifications}
            onChange={setNotifications}
            direction="horizontal"
          />
        </div>
        
        <div className="text-sm text-gray-500 pt-4 border-t">
          <p>관심 분야: {interests.join(", ") || "선택 안됨"}</p>
          <p>알림 수단: {notifications.join(", ") || "선택 안됨"}</p>
        </div>
      </div>
    );
  },
};

