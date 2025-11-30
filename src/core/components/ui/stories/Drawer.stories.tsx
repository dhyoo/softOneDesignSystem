/**
 * SoftOne Design System - Drawer Stories
 * Storybook stories for Drawer component
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Drawer, type DrawerPosition } from "../Drawer";
import { Button } from "../Button";

const meta: Meta<typeof Drawer> = {
  title: "Dialog/Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
Drawer는 화면 측면에서 슬라이드 인되는 사이드 패널입니다.

## 특징
- 왼쪽/오른쪽 위치 선택
- 커스텀 너비 지원
- 포커스 트랩 및 ESC 닫기
- 상세 보기, 필터, 설정 패널에 적합
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

// ========================================
// Interactive Story
// ========================================

const InteractiveDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<DrawerPosition>("right");
  const [width, setWidth] = useState("400px");

  return (
    <div className="p-8 space-y-4">
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={position === "right" ? "primary" : "secondary"}
          onClick={() => {
            setPosition("right");
            setIsOpen(true);
          }}
        >
          오른쪽 Drawer
        </Button>
        <Button
          variant={position === "left" ? "primary" : "secondary"}
          onClick={() => {
            setPosition("left");
            setIsOpen(true);
          }}
        >
          왼쪽 Drawer
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["300px", "400px", "500px", "50%"].map((w) => (
          <Button
            key={w}
            variant={width === w ? "primary" : "secondary"}
            size="sm"
            onClick={() => {
              setWidth(w);
              setIsOpen(true);
            }}
          >
            {w}
          </Button>
        ))}
      </div>

      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${position === "right" ? "오른쪽" : "왼쪽"} Drawer`}
        position={position}
        width={width}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              저장
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-softone-text-secondary">
            이것은 {position} 위치의 Drawer입니다.
          </p>
          <p className="text-softone-text-secondary">너비: {width}</p>
          <div className="p-4 bg-softone-bg rounded-lg">
            <h4 className="font-medium text-softone-text mb-2">상세 정보</h4>
            <p className="text-sm text-softone-text-secondary">
              Drawer는 메인 콘텐츠를 가리지 않으면서 추가 정보를 표시하는 데
              적합합니다.
            </p>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

// ========================================
// User Detail Drawer
// ========================================

const UserDetailDrawer = () => {
  const [isOpen, setIsOpen] = useState(true);

  const user = {
    id: "1",
    name: "홍길동",
    email: "hong@example.com",
    role: "관리자",
    department: "개발팀",
    phone: "010-1234-5678",
    joinDate: "2023-01-15",
    status: "활성",
  };

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>사용자 상세 보기</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="사용자 상세 정보"
        width="450px"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              닫기
            </Button>
            <Button variant="primary">수정</Button>
          </>
        }
      >
        <div className="space-y-6">
          {/* 프로필 헤더 */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-softone-primary flex items-center justify-center text-white text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-softone-text">
                {user.name}
              </h3>
              <p className="text-softone-text-secondary">{user.role}</p>
            </div>
          </div>

          {/* 상세 정보 */}
          <div className="space-y-4">
            {[
              { label: "이메일", value: user.email },
              { label: "부서", value: user.department },
              { label: "연락처", value: user.phone },
              { label: "입사일", value: user.joinDate },
              { label: "상태", value: user.status },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between py-2 border-b border-softone-border"
              >
                <span className="text-softone-text-secondary">
                  {item.label}
                </span>
                <span className="text-softone-text font-medium">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export const UserDetail: Story = {
  render: () => <UserDetailDrawer />,
};

// ========================================
// Filter Panel Drawer
// ========================================

const FilterPanelDrawer = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="p-8">
      <Button onClick={() => setIsOpen(true)}>필터 패널 열기</Button>
      <Drawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="필터"
        position="left"
        width="320px"
        footer={
          <>
            <Button variant="ghost" onClick={() => {}}>
              초기화
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              적용
            </Button>
          </>
        }
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-softone-text mb-2">
              상태
            </label>
            <div className="space-y-2">
              {["전체", "활성", "비활성", "대기중"].map((status) => (
                <label key={status} className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-softone-text-secondary">{status}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-softone-text mb-2">
              날짜 범위
            </label>
            <div className="space-y-2">
              <input
                type="date"
                className="w-full px-3 py-2 rounded border border-softone-border"
              />
              <input
                type="date"
                className="w-full px-3 py-2 rounded border border-softone-border"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-softone-text mb-2">
              정렬
            </label>
            <select className="w-full px-3 py-2 rounded border border-softone-border">
              <option>최신순</option>
              <option>오래된순</option>
              <option>이름순</option>
            </select>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export const FilterPanel: Story = {
  render: () => <FilterPanelDrawer />,
};
