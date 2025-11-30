/**
 * SoftOne Design System(SDS) - Label Stories
 * 작성: SoftOne Frontend Team
 * 설명: Label 및 FormField 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Label, FormField } from "../Label";
import { Input } from "../Input";
import { Select } from "../Select";

const meta: Meta<typeof Label> = {
  title: "Core/UI/Label",
  component: Label,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 Label 및 FormField 컴포넌트입니다.

### Label
- 폼 필드용 라벨 컴포넌트
- 필수 표시(*) 지원
- disabled 스타일 지원

### FormField
- Label + Input + Error를 감싸는 Wrapper
- 에러/도움말 메시지 표시

### 사용법
\`\`\`tsx
import { Label, FormField } from '@core/components/ui';

<Label required>이메일</Label>

<FormField label="이메일" required error="필수 입력">
  <Input />
</FormField>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    required: {
      control: "boolean",
      description: "필수 표시",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 스타일",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Label Stories
// ========================================

/**
 * 기본 Label
 */
export const Default: Story = {
  args: {
    children: "라벨",
  },
};

/**
 * 필수 표시
 */
export const Required: Story = {
  args: {
    children: "이메일",
    required: true,
  },
};

/**
 * 비활성화
 */
export const Disabled: Story = {
  args: {
    children: "비활성화된 라벨",
    disabled: true,
  },
};

/**
 * 모든 상태
 */
export const AllLabelStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Label>기본 라벨</Label>
      <Label required>필수 라벨</Label>
      <Label disabled>비활성화 라벨</Label>
      <Label required disabled>필수 + 비활성화</Label>
    </div>
  ),
};

// ========================================
// FormField Stories
// ========================================

/**
 * FormField 기본
 */
export const FormFieldDefault: Story = {
  render: () => (
    <div className="w-80">
      <FormField label="이름" htmlFor="name">
        <Input id="name" placeholder="이름을 입력하세요" fullWidth />
      </FormField>
    </div>
  ),
};

/**
 * FormField 필수
 */
export const FormFieldRequired: Story = {
  render: () => (
    <div className="w-80">
      <FormField label="이메일" htmlFor="email" required>
        <Input id="email" type="email" placeholder="이메일" fullWidth />
      </FormField>
    </div>
  ),
};

/**
 * FormField 도움말
 */
export const FormFieldWithHelper: Story = {
  render: () => (
    <div className="w-80">
      <FormField
        label="비밀번호"
        htmlFor="password"
        required
        helperText="8자 이상, 영문/숫자/특수문자 조합"
      >
        <Input id="password" type="password" placeholder="비밀번호" fullWidth />
      </FormField>
    </div>
  ),
};

/**
 * FormField 에러
 */
export const FormFieldWithError: Story = {
  render: () => (
    <div className="w-80">
      <FormField
        label="이메일"
        htmlFor="email-error"
        required
        error="올바른 이메일 형식이 아닙니다"
      >
        <Input
          id="email-error"
          type="email"
          defaultValue="invalid-email"
          error
          fullWidth
        />
      </FormField>
    </div>
  ),
};

/**
 * FormField with Select
 */
export const FormFieldWithSelect: Story = {
  render: () => (
    <div className="w-80">
      <FormField label="국가" htmlFor="country" required>
        <Select
          id="country"
          options={[
            { value: "kr", label: "한국" },
            { value: "us", label: "미국" },
            { value: "jp", label: "일본" },
          ]}
          placeholder="국가 선택"
          fullWidth
        />
      </FormField>
    </div>
  ),
};

// ========================================
// Complex Examples
// ========================================

/**
 * 폼 예시
 */
export const FormExample: Story = {
  render: () => (
    <div className="w-96 p-6 border rounded-lg space-y-4">
      <h2 className="text-xl font-bold">회원가입</h2>

      <FormField label="이름" htmlFor="signup-name" required>
        <Input id="signup-name" placeholder="홍길동" fullWidth />
      </FormField>

      <FormField
        label="이메일"
        htmlFor="signup-email"
        required
        helperText="인증 메일이 발송됩니다"
      >
        <Input
          id="signup-email"
          type="email"
          placeholder="example@email.com"
          fullWidth
        />
      </FormField>

      <FormField
        label="비밀번호"
        htmlFor="signup-password"
        required
        helperText="8자 이상"
      >
        <Input
          id="signup-password"
          type="password"
          placeholder="비밀번호"
          fullWidth
        />
      </FormField>

      <FormField
        label="비밀번호 확인"
        htmlFor="signup-confirm"
        required
        error="비밀번호가 일치하지 않습니다"
      >
        <Input
          id="signup-confirm"
          type="password"
          placeholder="비밀번호 확인"
          error
          fullWidth
        />
      </FormField>

      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        가입하기
      </button>
    </div>
  ),
};

/**
 * 인라인 폼
 */
export const InlineFormExample: Story = {
  render: () => (
    <div className="w-[600px] p-6 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">검색</h2>
      <div className="grid grid-cols-3 gap-4">
        <FormField label="이름" htmlFor="search-name">
          <Input id="search-name" placeholder="이름" fullWidth />
        </FormField>
        <FormField label="상태" htmlFor="search-status">
          <Select
            id="search-status"
            options={[
              { value: "", label: "전체" },
              { value: "ACTIVE", label: "활성" },
              { value: "INACTIVE", label: "비활성" },
            ]}
            fullWidth
          />
        </FormField>
        <FormField label="역할" htmlFor="search-role">
          <Select
            id="search-role"
            options={[
              { value: "", label: "전체" },
              { value: "ADMIN", label: "관리자" },
              { value: "USER", label: "사용자" },
            ]}
            fullWidth
          />
        </FormField>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
          초기화
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          검색
        </button>
      </div>
    </div>
  ),
};

/**
 * 모든 FormField 상태
 */
export const AllFormFieldStates: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">기본</h3>
        <FormField label="기본 필드">
          <Input placeholder="입력..." fullWidth />
        </FormField>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">필수</h3>
        <FormField label="필수 필드" required>
          <Input placeholder="입력..." fullWidth />
        </FormField>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">도움말</h3>
        <FormField label="도움말 필드" helperText="도움말 텍스트">
          <Input placeholder="입력..." fullWidth />
        </FormField>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">에러</h3>
        <FormField label="에러 필드" error="에러 메시지">
          <Input placeholder="입력..." error fullWidth />
        </FormField>
      </div>
    </div>
  ),
};

