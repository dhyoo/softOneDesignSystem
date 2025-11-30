/**
 * SoftOne Design System(SDS) - FormFieldWrapper Stories
 * 작성: SoftOne Frontend Team
 * 설명: FormFieldWrapper 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { FormFieldWrapper } from "../FormFieldWrapper";
import { Input } from "../Input";
import { Select } from "../Select";
import { Checkbox } from "../Checkbox";

const meta: Meta<typeof FormFieldWrapper> = {
  title: "Core/UI/FormFieldWrapper",
  component: FormFieldWrapper,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 FormFieldWrapper 컴포넌트입니다.

### 특징
- **Label + Input + Error 일관된 레이아웃** 제공
- **필수 표시(*)**: required prop으로 자동 표시
- **에러 스타일**: errorMessage prop으로 자동 적용
- **설명 텍스트**: description prop 지원
- **A11y**: htmlFor, aria-describedby 자동 연결

### 사용법
\`\`\`tsx
import { FormFieldWrapper, Input } from '@core/components/ui';

<FormFieldWrapper
  label="이메일"
  required
  errorMessage={errors.email?.message}
>
  <Input {...register('email')} error={!!errors.email} />
</FormFieldWrapper>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "필드 라벨",
    },
    required: {
      control: "boolean",
      description: "필수 필드 여부",
    },
    description: {
      control: "text",
      description: "필드 설명",
    },
    errorMessage: {
      control: "text",
      description: "에러 메시지",
    },
    hideLabel: {
      control: "boolean",
      description: "라벨 숨김 (스크린 리더용)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 FormFieldWrapper
 */
export const Default: Story = {
  render: () => (
    <div className="w-80">
      <FormFieldWrapper label="이름">
        <Input placeholder="이름을 입력하세요" fullWidth />
      </FormFieldWrapper>
    </div>
  ),
};

/**
 * 필수 필드
 */
export const Required: Story = {
  render: () => (
    <div className="w-80">
      <FormFieldWrapper label="이메일" required>
        <Input type="email" placeholder="이메일을 입력하세요" fullWidth />
      </FormFieldWrapper>
    </div>
  ),
};

/**
 * 설명 포함
 */
export const WithDescription: Story = {
  render: () => (
    <div className="w-80">
      <FormFieldWrapper
        label="비밀번호"
        required
        description="8자 이상, 영문/숫자/특수문자 조합"
      >
        <Input type="password" placeholder="비밀번호" fullWidth />
      </FormFieldWrapper>
    </div>
  ),
};

/**
 * 에러 상태
 */
export const WithError: Story = {
  render: () => (
    <div className="w-80">
      <FormFieldWrapper
        label="이메일"
        required
        errorMessage="올바른 이메일 형식이 아닙니다."
      >
        <Input
          type="email"
          placeholder="이메일"
          defaultValue="invalid-email"
          error
          fullWidth
        />
      </FormFieldWrapper>
    </div>
  ),
};

/**
 * 라벨 숨김 (시각적으로만)
 */
export const HiddenLabel: Story = {
  render: () => (
    <div className="w-80">
      <FormFieldWrapper label="검색어" hideLabel>
        <Input placeholder="검색어를 입력하세요" fullWidth />
      </FormFieldWrapper>
      <p className="text-xs text-gray-500 mt-2">
        * 라벨이 시각적으로 숨겨졌지만 스크린 리더에서는 읽힙니다.
      </p>
    </div>
  ),
};

// ========================================
// With Different Inputs
// ========================================

/**
 * Input과 함께
 */
export const WithInput: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <FormFieldWrapper label="이름" required>
        <Input placeholder="이름" fullWidth />
      </FormFieldWrapper>
      <FormFieldWrapper label="이메일" required description="업무용 이메일">
        <Input type="email" placeholder="example@company.com" fullWidth />
      </FormFieldWrapper>
      <FormFieldWrapper label="전화번호">
        <Input type="tel" placeholder="010-0000-0000" fullWidth />
      </FormFieldWrapper>
    </div>
  ),
};

/**
 * Select와 함께
 */
export const WithSelect: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <FormFieldWrapper label="국가" required>
        <Select
          options={[
            { value: "kr", label: "한국" },
            { value: "us", label: "미국" },
            { value: "jp", label: "일본" },
          ]}
          placeholder="국가 선택"
          fullWidth
        />
      </FormFieldWrapper>
      <FormFieldWrapper label="상태">
        <Select
          options={[
            { value: "ACTIVE", label: "활성" },
            { value: "INACTIVE", label: "비활성" },
          ]}
          placeholder="상태 선택"
          fullWidth
        />
      </FormFieldWrapper>
    </div>
  ),
};

/**
 * Checkbox와 함께
 */
export const WithCheckbox: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <FormFieldWrapper label="알림 설정">
        <div className="space-y-2">
          <Checkbox label="이메일 알림" />
          <Checkbox label="푸시 알림" />
          <Checkbox label="SMS 알림" />
        </div>
      </FormFieldWrapper>
    </div>
  ),
};

// ========================================
// Form Examples
// ========================================

/**
 * 회원가입 폼 예시
 */
export const SignUpFormExample: Story = {
  render: () => (
    <div className="w-96 p-6 border rounded-lg space-y-4">
      <h2 className="text-xl font-bold">회원가입</h2>
      
      <FormFieldWrapper label="이름" required>
        <Input placeholder="홍길동" fullWidth />
      </FormFieldWrapper>
      
      <FormFieldWrapper
        label="이메일"
        required
        description="인증 메일이 발송됩니다"
      >
        <Input type="email" placeholder="example@email.com" fullWidth />
      </FormFieldWrapper>
      
      <FormFieldWrapper
        label="비밀번호"
        required
        description="8자 이상, 영문/숫자/특수문자 조합"
      >
        <Input type="password" placeholder="비밀번호" fullWidth />
      </FormFieldWrapper>
      
      <FormFieldWrapper
        label="비밀번호 확인"
        required
        errorMessage="비밀번호가 일치하지 않습니다"
      >
        <Input type="password" placeholder="비밀번호 확인" error fullWidth />
      </FormFieldWrapper>
      
      <FormFieldWrapper label="역할">
        <Select
          options={[
            { value: "USER", label: "일반 사용자" },
            { value: "MANAGER", label: "매니저" },
          ]}
          placeholder="역할 선택"
          fullWidth
        />
      </FormFieldWrapper>
      
      <div className="pt-4">
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          가입하기
        </button>
      </div>
    </div>
  ),
};

/**
 * 프로필 수정 폼 예시
 */
export const ProfileEditFormExample: Story = {
  render: () => (
    <div className="w-96 p-6 border rounded-lg space-y-4">
      <h2 className="text-xl font-bold">프로필 수정</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <FormFieldWrapper label="성" required>
          <Input defaultValue="홍" fullWidth />
        </FormFieldWrapper>
        <FormFieldWrapper label="이름" required>
          <Input defaultValue="길동" fullWidth />
        </FormFieldWrapper>
      </div>
      
      <FormFieldWrapper label="이메일" required>
        <Input
          type="email"
          defaultValue="hong@company.com"
          fullWidth
        />
      </FormFieldWrapper>
      
      <FormFieldWrapper label="전화번호">
        <Input
          type="tel"
          defaultValue="010-1234-5678"
          fullWidth
        />
      </FormFieldWrapper>
      
      <FormFieldWrapper label="자기소개" description="500자 이내">
        <textarea
          className="w-full px-3 py-2 border rounded-lg resize-none h-24"
          placeholder="자기소개를 입력하세요"
        />
      </FormFieldWrapper>
      
      <div className="flex gap-2 pt-4">
        <button className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">
          취소
        </button>
        <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          저장
        </button>
      </div>
    </div>
  ),
};

/**
 * 모든 상태 조합
 */
export const AllStates: Story = {
  render: () => (
    <div className="w-80 space-y-6">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">기본</h3>
        <FormFieldWrapper label="기본 필드">
          <Input placeholder="입력..." fullWidth />
        </FormFieldWrapper>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">필수</h3>
        <FormFieldWrapper label="필수 필드" required>
          <Input placeholder="입력..." fullWidth />
        </FormFieldWrapper>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">설명 포함</h3>
        <FormFieldWrapper label="설명 필드" description="도움말 텍스트">
          <Input placeholder="입력..." fullWidth />
        </FormFieldWrapper>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">에러</h3>
        <FormFieldWrapper label="에러 필드" errorMessage="필수 입력 항목입니다">
          <Input placeholder="입력..." error fullWidth />
        </FormFieldWrapper>
      </div>
    </div>
  ),
};

