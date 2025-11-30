/**
 * SoftOne Design System(SDS) - Checkbox Stories
 * 작성: SoftOne Frontend Team
 * 설명: Checkbox 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "../Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Core/UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 Checkbox 컴포넌트입니다.

### 특징
- **size**: sm, md, lg 크기 지원
- **indeterminate**: 부분 선택 상태 지원
- **error**: 에러 상태 표시
- **forwardRef**: React Hook Form 연동 가능

### 사용법
\`\`\`tsx
import { Checkbox } from '@core/components/ui';

<Checkbox
  label="이용약관에 동의합니다"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "체크박스 크기",
    },
    checked: {
      control: "boolean",
      description: "체크 상태",
    },
    indeterminate: {
      control: "boolean",
      description: "부분 선택 상태",
    },
    error: {
      control: "boolean",
      description: "에러 상태",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    label: {
      control: "text",
      description: "라벨 텍스트",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 Checkbox
 */
export const Default: Story = {
  args: {
    label: "체크박스",
  },
};

/**
 * 체크된 상태
 */
export const Checked: Story = {
  args: {
    label: "선택됨",
    checked: true,
  },
};

/**
 * 라벨 없이
 */
export const WithoutLabel: Story = {
  args: {
    checked: false,
  },
};

// ========================================
// Size Variants
// ========================================

/**
 * 모든 크기
 */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Checkbox size="sm" label="Small" />
      <Checkbox size="md" label="Medium" />
      <Checkbox size="lg" label="Large" />
    </div>
  ),
};

/**
 * Small Checkbox
 */
export const Small: Story = {
  args: {
    size: "sm",
    label: "Small checkbox",
  },
};

/**
 * Large Checkbox
 */
export const Large: Story = {
  args: {
    size: "lg",
    label: "Large checkbox",
  },
};

// ========================================
// State Variants
// ========================================

/**
 * 부분 선택 상태 (Indeterminate)
 */
export const Indeterminate: Story = {
  args: {
    label: "일부 선택됨",
    indeterminate: true,
  },
};

/**
 * 에러 상태
 */
export const Error: Story = {
  args: {
    label: "필수 항목입니다",
    error: true,
  },
};

/**
 * 비활성화 상태
 */
export const Disabled: Story = {
  args: {
    label: "비활성화됨",
    disabled: true,
  },
};

/**
 * 비활성화 + 체크됨
 */
export const DisabledChecked: Story = {
  args: {
    label: "비활성화 (체크됨)",
    disabled: true,
    checked: true,
  },
};

// ========================================
// Interactive Examples
// ========================================

/**
 * 인터랙티브 토글
 */
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    
    return (
      <div className="space-y-4">
        <Checkbox
          label={checked ? "선택됨" : "선택 안됨"}
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <p className="text-sm text-gray-500">
          현재 상태: {checked ? "checked" : "unchecked"}
        </p>
      </div>
    );
  },
};

/**
 * 전체 선택 예시
 */
export const SelectAllExample: Story = {
  render: () => {
    const [items, setItems] = useState([
      { id: 1, label: "항목 1", checked: true },
      { id: 2, label: "항목 2", checked: true },
      { id: 3, label: "항목 3", checked: false },
    ]);
    
    const allChecked = items.every((item) => item.checked);
    const someChecked = items.some((item) => item.checked);
    const indeterminate = someChecked && !allChecked;
    
    const handleSelectAll = (checked: boolean) => {
      setItems(items.map((item) => ({ ...item, checked })));
    };
    
    const handleItemChange = (id: number, checked: boolean) => {
      setItems(
        items.map((item) =>
          item.id === id ? { ...item, checked } : item
        )
      );
    };
    
    return (
      <div className="space-y-4">
        <Checkbox
          label="전체 선택"
          checked={allChecked}
          indeterminate={indeterminate}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        <div className="pl-6 space-y-2 border-l-2 border-gray-200">
          {items.map((item) => (
            <Checkbox
              key={item.id}
              label={item.label}
              checked={item.checked}
              onChange={(e) => handleItemChange(item.id, e.target.checked)}
            />
          ))}
        </div>
      </div>
    );
  },
};

// ========================================
// Showcase
// ========================================

/**
 * 모든 상태 조합
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">기본 상태</h3>
        <div className="flex flex-wrap gap-6">
          <Checkbox label="미선택" />
          <Checkbox label="선택됨" checked />
          <Checkbox label="부분 선택" indeterminate />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">에러 상태</h3>
        <div className="flex flex-wrap gap-6">
          <Checkbox label="에러" error />
          <Checkbox label="에러 (선택)" error checked />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">비활성화</h3>
        <div className="flex flex-wrap gap-6">
          <Checkbox label="비활성화" disabled />
          <Checkbox label="비활성화 (선택)" disabled checked />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">크기</h3>
        <div className="flex items-center gap-6">
          <Checkbox size="sm" label="Small" checked />
          <Checkbox size="md" label="Medium" checked />
          <Checkbox size="lg" label="Large" checked />
        </div>
      </div>
    </div>
  ),
};

/**
 * 이용약관 예시
 */
export const TermsExample: Story = {
  render: () => {
    const [terms, setTerms] = useState({
      all: false,
      terms: false,
      privacy: false,
      marketing: false,
    });
    
    const handleAllChange = (checked: boolean) => {
      setTerms({
        all: checked,
        terms: checked,
        privacy: checked,
        marketing: checked,
      });
    };
    
    const handleItemChange = (key: keyof typeof terms, checked: boolean) => {
      const newTerms = { ...terms, [key]: checked };
      newTerms.all = newTerms.terms && newTerms.privacy && newTerms.marketing;
      setTerms(newTerms);
    };
    
    const someChecked = terms.terms || terms.privacy || terms.marketing;
    
    return (
      <div className="space-y-4 p-4 border rounded-lg w-80">
        <Checkbox
          label="전체 동의"
          checked={terms.all}
          indeterminate={someChecked && !terms.all}
          onChange={(e) => handleAllChange(e.target.checked)}
        />
        <hr />
        <div className="space-y-3">
          <Checkbox
            label="이용약관 동의 (필수)"
            checked={terms.terms}
            onChange={(e) => handleItemChange("terms", e.target.checked)}
          />
          <Checkbox
            label="개인정보 처리방침 동의 (필수)"
            checked={terms.privacy}
            onChange={(e) => handleItemChange("privacy", e.target.checked)}
          />
          <Checkbox
            label="마케팅 정보 수신 동의 (선택)"
            checked={terms.marketing}
            onChange={(e) => handleItemChange("marketing", e.target.checked)}
          />
        </div>
      </div>
    );
  },
};

