/**
 * SoftOne Design System - FormDialog Stories
 * Storybook stories for FormDialog component
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { z } from "zod";
import { Controller } from "react-hook-form";
import { FormDialog, type FormFieldConfig } from "../FormDialog";
import { Button } from "../Button";
import { Input } from "../Input";
import { Select } from "../Select";
import { FormFieldWrapper } from "../FormFieldWrapper";

const meta: Meta<typeof FormDialog> = {
  title: "Dialog/FormDialog",
  component: FormDialog,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
FormDialog는 React Hook Form + Zod 기반의 폼을 내부에 가진 모달입니다.

## 특징
- Zod 스키마 기반 유효성 검사
- 자동 필드 생성 (fields prop) 또는 커스텀 렌더링 (children)
- 제출 중 로딩 상태 자동 처리
- 사용자 생성/수정 등 폼 모달에 적합
        `,
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FormDialog>;

// ========================================
// Schema Definitions
// ========================================

const userSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
  email: z.string().email("올바른 이메일을 입력하세요"),
  role: z.string().min(1, "역할을 선택하세요"),
  department: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

// ========================================
// Interactive Story - Custom Render
// ========================================

const CustomRenderDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<UserFormValues | null>(
    null
  );

  return (
    <div className="space-y-4 min-w-[400px]">
      <Button onClick={() => setIsOpen(true)}>사용자 생성 (커스텀 렌더)</Button>

      {submittedData && (
        <pre className="p-4 bg-softone-bg rounded text-sm">
          {JSON.stringify(submittedData, null, 2)}
        </pre>
      )}

      <FormDialog<UserFormValues>
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="새 사용자 등록"
        size="md"
        schema={userSchema}
        defaultValues={{
          name: "",
          email: "",
          role: "",
          department: "",
        }}
        onSubmit={async (values) => {
          // API 호출 시뮬레이션
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setSubmittedData(values);
          console.log("제출된 데이터:", values);
        }}
      >
        {({ control, errors, isSubmitting }) => (
          <div className="space-y-4">
            <FormFieldWrapper
              label="이름"
              errorMessage={errors.name?.message}
              required
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="이름을 입력하세요"
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="이메일"
              errorMessage={errors.email?.message}
              required
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="이메일을 입력하세요"
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="역할"
              errorMessage={errors.role?.message}
              required
            >
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "", label: "선택하세요" },
                      { value: "ADMIN", label: "관리자" },
                      { value: "USER", label: "일반 사용자" },
                      { value: "VIEWER", label: "뷰어" },
                    ]}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="부서" description="선택 사항입니다">
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="부서를 입력하세요"
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormFieldWrapper>
          </div>
        )}
      </FormDialog>
    </div>
  );
};

export const CustomRender: Story = {
  render: () => <CustomRenderDemo />,
};

// ========================================
// Auto Generated Fields
// ========================================

const AutoGeneratedDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  const fields: FormFieldConfig<UserFormValues>[] = [
    {
      name: "name",
      label: "이름",
      type: "text",
      placeholder: "이름을 입력하세요",
    },
    {
      name: "email",
      label: "이메일",
      type: "email",
      placeholder: "이메일을 입력하세요",
    },
    {
      name: "role",
      label: "역할",
      type: "select",
      options: [
        { value: "", label: "선택하세요" },
        { value: "ADMIN", label: "관리자" },
        { value: "USER", label: "일반 사용자" },
      ],
    },
    {
      name: "department",
      label: "부서",
      type: "text",
      placeholder: "부서를 입력하세요",
      description: "선택 사항입니다",
    },
  ];

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)}>사용자 생성 (자동 필드)</Button>

      <FormDialog<UserFormValues>
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="새 사용자 등록"
        schema={userSchema}
        fields={fields}
        defaultValues={{
          name: "",
          email: "",
          role: "",
          department: "",
        }}
        onSubmit={async (values) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("제출된 데이터:", values);
          alert("저장되었습니다!");
        }}
      />
    </div>
  );
};

export const AutoGenerated: Story = {
  render: () => <AutoGeneratedDemo />,
};

// ========================================
// Edit Mode
// ========================================

const EditModeDemo = () => {
  const [isOpen, setIsOpen] = useState(true);

  const existingUser = {
    name: "홍길동",
    email: "hong@example.com",
    role: "ADMIN",
    department: "개발팀",
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)}>사용자 수정</Button>

      <FormDialog<UserFormValues>
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="사용자 정보 수정"
        size="md"
        schema={userSchema}
        defaultValues={existingUser}
        submitLabel="수정"
        onSubmit={async (values) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("수정된 데이터:", values);
        }}
      >
        {({ control, errors, isSubmitting }) => (
          <div className="space-y-4">
            <FormFieldWrapper
              label="이름"
              errorMessage={errors.name?.message}
              required
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled={isSubmitting} />
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="이메일"
              errorMessage={errors.email?.message}
              required
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="email" disabled={isSubmitting} />
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="역할"
              errorMessage={errors.role?.message}
              required
            >
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={[
                      { value: "ADMIN", label: "관리자" },
                      { value: "USER", label: "일반 사용자" },
                      { value: "VIEWER", label: "뷰어" },
                    ]}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="부서">
              <Controller
                name="department"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled={isSubmitting} />
                )}
              />
            </FormFieldWrapper>
          </div>
        )}
      </FormDialog>
    </div>
  );
};

export const EditMode: Story = {
  render: () => <EditModeDemo />,
};

// ========================================
// Large Form
// ========================================

const productSchema = z.object({
  name: z.string().min(1, "상품명을 입력하세요"),
  sku: z.string().min(1, "SKU를 입력하세요"),
  price: z.number().min(0, "가격은 0 이상이어야 합니다"),
  stock: z.number().min(0, "재고는 0 이상이어야 합니다"),
  category: z.string().min(1, "카테고리를 선택하세요"),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const LargeFormDemo = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-4">
      <Button onClick={() => setIsOpen(true)}>상품 등록</Button>

      <FormDialog<ProductFormValues>
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="새 상품 등록"
        size="lg"
        schema={productSchema}
        defaultValues={{
          name: "",
          sku: "",
          price: 0,
          stock: 0,
          category: "",
          description: "",
        }}
        onSubmit={async (values) => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("상품 데이터:", values);
        }}
      >
        {({ control, errors, isSubmitting }) => (
          <div className="grid grid-cols-2 gap-4">
            <FormFieldWrapper
              label="상품명"
              errorMessage={errors.name?.message}
              required
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled={isSubmitting} />
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="SKU"
              errorMessage={errors.sku?.message}
              required
            >
              <Controller
                name="sku"
                control={control}
                render={({ field }) => (
                  <Input {...field} disabled={isSubmitting} />
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="가격"
              errorMessage={errors.price?.message}
              required
            >
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="재고"
              errorMessage={errors.stock?.message}
              required
            >
              <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormFieldWrapper>

            <div className="col-span-2">
              <FormFieldWrapper
                label="카테고리"
                errorMessage={errors.category?.message}
                required
              >
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { value: "", label: "선택하세요" },
                        { value: "electronics", label: "전자제품" },
                        { value: "clothing", label: "의류" },
                        { value: "food", label: "식품" },
                      ]}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </FormFieldWrapper>
            </div>

            <div className="col-span-2">
              <FormFieldWrapper label="설명">
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full px-3 py-2 rounded-lg border border-softone-border focus:border-softone-primary focus:ring-2 focus:ring-softone-primary/20 focus:outline-none min-h-[100px]"
                      disabled={isSubmitting}
                    />
                  )}
                />
              </FormFieldWrapper>
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
};

export const LargeForm: Story = {
  render: () => <LargeFormDemo />,
};
