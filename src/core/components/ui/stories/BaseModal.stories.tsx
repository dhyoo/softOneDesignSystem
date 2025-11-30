/**
 * SoftOne Design System - BaseModal Stories
 * Storybook stories for BaseModal component
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { BaseModal, type ModalSize } from "../BaseModal";
import { Button } from "../Button";

const meta: Meta<typeof BaseModal> = {
  title: "Dialog/BaseModal",
  component: BaseModal,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
BaseModal은 모든 모달/다이얼로그의 기반이 되는 컴포넌트입니다.

## 특징
- 포커스 트랩 (Tab 키 순환)
- ESC 키로 닫기
- 오버레이 클릭으로 닫기
- 다양한 크기 지원
- 접근성(A11y) 준수
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BaseModal>;

// ========================================
// Interactive Story
// ========================================

const InteractiveDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [size, setSize] = useState<ModalSize>("md");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {(["sm", "md", "lg", "xl", "full"] as ModalSize[]).map((s) => (
          <Button
            key={s}
            variant={size === s ? "primary" : "secondary"}
            onClick={() => {
              setSize(s);
              setIsOpen(true);
            }}
          >
            {s.toUpperCase()} 모달
          </Button>
        ))}
      </div>

      <BaseModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${size.toUpperCase()} 크기 모달`}
        size={size}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              확인
            </Button>
          </>
        }
      >
        <p className="text-softone-text-secondary">
          이것은 {size.toUpperCase()} 크기의 BaseModal입니다.
        </p>
        <p className="text-softone-text-secondary mt-2">
          ESC 키를 누르거나 배경을 클릭하여 닫을 수 있습니다.
        </p>
      </BaseModal>
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

// ========================================
// Size Variants
// ========================================

export const SmallModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Small 모달 열기</Button>
        <BaseModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Small Modal"
          size="sm"
        >
          <p>작은 크기의 모달입니다.</p>
        </BaseModal>
      </>
    );
  },
};

export const LargeModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>Large 모달 열기</Button>
        <BaseModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Large Modal"
          size="lg"
        >
          <p>큰 크기의 모달입니다. 더 많은 콘텐츠를 담을 수 있습니다.</p>
        </BaseModal>
      </>
    );
  },
};

// ========================================
// With Long Content
// ========================================

export const WithScrollableContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>스크롤 모달 열기</Button>
        <BaseModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="긴 콘텐츠가 있는 모달"
          size="md"
          footer={
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              확인
            </Button>
          }
        >
          <div className="space-y-4">
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} className="text-softone-text-secondary">
                이것은 {i + 1}번째 단락입니다. 모달 내용이 길 때 스크롤이
                가능합니다.
              </p>
            ))}
          </div>
        </BaseModal>
      </>
    );
  },
};

// ========================================
// Without Header
// ========================================

export const WithoutHeader: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>헤더 없는 모달</Button>
        <BaseModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          hideHeader
          size="sm"
        >
          <div className="text-center py-4">
            <p className="text-softone-text mb-4">
              헤더가 없는 간단한 모달입니다.
            </p>
            <Button variant="primary" onClick={() => setIsOpen(false)}>
              닫기
            </Button>
          </div>
        </BaseModal>
      </>
    );
  },
};

// ========================================
// Alert Dialog Role
// ========================================

export const AlertDialogRole: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Alert Dialog 열기
        </Button>
        <BaseModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="경고"
          role="alertdialog"
          size="sm"
          closeOnOverlayClick={false}
          footer={
            <>
              <Button variant="secondary" onClick={() => setIsOpen(false)}>
                취소
              </Button>
              <Button variant="danger" onClick={() => setIsOpen(false)}>
                삭제
              </Button>
            </>
          }
        >
          <p className="text-softone-text-secondary">
            이 작업은 되돌릴 수 없습니다. 정말 삭제하시겠습니까?
          </p>
        </BaseModal>
      </>
    );
  },
};
