/**
 * SoftOne Design System - ConfirmDialog Stories
 * Storybook stories for ConfirmDialog component
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ConfirmDialog } from "../ConfirmDialog";
import { Button } from "../Button";
import type { DialogVariant } from "../../../store/dialogStore";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Dialog/ConfirmDialog",
  component: ConfirmDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
ConfirmDialog는 사용자에게 확인을 요청하는 다이얼로그입니다.

## 특징
- 다양한 variant (default, info, success, warning, danger)
- async onConfirm 지원 (로딩 상태 자동 처리)
- role="alertdialog"로 접근성 준수
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

// ========================================
// Interactive Story
// ========================================

const InteractiveDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [variant, setVariant] = useState<DialogVariant>("default");
  const [result, setResult] = useState<string>("");

  const variants: DialogVariant[] = [
    "default",
    "info",
    "success",
    "warning",
    "danger",
  ];

  return (
    <div className="space-y-4 min-w-[400px]">
      <div className="flex gap-2 flex-wrap">
        {variants.map((v) => (
          <Button
            key={v}
            variant={v === "danger" ? "danger" : "secondary"}
            onClick={() => {
              setVariant(v);
              setIsOpen(true);
            }}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </Button>
        ))}
      </div>

      {result && (
        <p className="text-softone-text-secondary p-2 bg-softone-bg rounded">
          결과: {result}
        </p>
      )}

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={`${variant.charAt(0).toUpperCase() + variant.slice(1)} 확인`}
        message={`이것은 ${variant} 스타일의 확인 다이얼로그입니다.`}
        variant={variant}
        onConfirm={() => {
          setResult("확인됨");
          setIsOpen(false);
        }}
        onCancel={() => {
          setResult("취소됨");
        }}
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};

// ========================================
// Danger Variant
// ========================================

export const DangerVariant: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          삭제 확인 열기
        </Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="삭제 확인"
          message="이 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
          variant="danger"
          confirmLabel="삭제"
          cancelLabel="취소"
          onConfirm={() => console.log("삭제됨")}
        />
      </>
    );
  },
};

// ========================================
// Warning Variant
// ========================================

export const WarningVariant: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>경고 확인 열기</Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="변경 확인"
          message="저장하지 않은 변경사항이 있습니다. 페이지를 떠나시겠습니까?"
          variant="warning"
          confirmLabel="페이지 떠나기"
          cancelLabel="머무르기"
        />
      </>
    );
  },
};

// ========================================
// Success Variant
// ========================================

export const SuccessVariant: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>성공 확인 열기</Button>
        <ConfirmDialog
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="저장 완료"
          message="변경사항이 성공적으로 저장되었습니다."
          variant="success"
          confirmLabel="확인"
          cancelLabel=""
        />
      </>
    );
  },
};

// ========================================
// Async Confirm
// ========================================

const AsyncConfirmDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState("");

  const handleConfirm = async () => {
    setStatus("처리 중...");
    // 2초 딜레이 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("완료!");
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)}>Async 작업 확인</Button>
      {status && <p className="text-softone-text-secondary">상태: {status}</p>}
      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="데이터 동기화"
        message="서버와 데이터를 동기화하시겠습니까? 이 작업은 몇 초가 걸릴 수 있습니다."
        variant="info"
        confirmLabel="동기화"
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export const AsyncConfirm: Story = {
  render: () => <AsyncConfirmDemo />,
};
