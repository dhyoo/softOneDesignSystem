/**
 * SoftOne Design System - Article Form (Step 7 개선 버전)
 * 작성: SoftOne Frontend Team
 *
 * 중복 업무 감소:
 *   FormFieldWrapper로 Label + Input + Error 레이아웃 일관성 유지.
 *   useToast로 저장 성공/실패 시 전역 알림을 간편하게 표시.
 *   개발자는 비즈니스 로직에만 집중하고, UI 세부사항은 Core 컴포넌트에 위임.
 *
 * 설명: 게시글 생성/수정 폼 컴포넌트.
 *      RichTextEditor + React Hook Form + Zod + useToast 조합 패턴을 보여줍니다.
 *      이 패턴을 참고하여 다른 콘텐츠 관리 폼도 구현할 수 있습니다.
 *
 * ArticleForm Component
 * - React Hook Form으로 폼 상태 관리
 * - FormFieldWrapper로 일관된 폼 레이아웃
 * - Controller로 RichTextEditor 제어
 * - useToast로 저장 결과 알림
 */

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Card, CardHeader, CardTitle, CardBody } from "@core/components/ui/Card";
import { Input } from "@core/components/ui/Input";
import { FormFieldWrapper } from "@core/components/ui/FormFieldWrapper";
import { Select, type SelectOption } from "@core/components/ui/Select";
import { Button } from "@core/components/ui/Button";
import { RichTextEditor } from "@core/components/ui/RichTextEditor";
import { useToast } from "@core/hooks/useToast";
import { Save, Send, X } from "lucide-react";

import type {
  ArticleFormData,
  ArticleStatus,
  ArticleCategory,
} from "../model/article.types";
import {
  ARTICLE_STATUS_META,
  ARTICLE_CATEGORY_META,
  DEFAULT_ARTICLE_FORM,
} from "../model/article.types";

// ========================================
// Form Schema (Zod)
// ========================================

const articleSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요.")
    .max(200, "제목은 200자 이내로 입력해주세요."),
  contentHtml: z
    .string()
    .min(1, "내용을 입력해주세요.")
    .refine(
      (val) => val !== "<p></p>" && val.replace(/<[^>]*>/g, "").trim() !== "",
      "내용을 입력해주세요."
    ),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"] as const),
  category: z
    .enum(["NOTICE", "NEWS", "FAQ", "GUIDE", "ETC"] as const)
    .optional(),
});

type ArticleFormValues = z.infer<typeof articleSchema>;

// ========================================
// Types
// ========================================

export interface ArticleFormProps {
  /** 초기 폼 값 (수정 시 사용) */
  defaultValues?: Partial<ArticleFormData>;
  /** 폼 제출 핸들러 */
  onSubmit: (data: ArticleFormData) => Promise<void> | void;
  /** 취소 핸들러 */
  onCancel?: () => void;
  /** 로딩 상태 */
  loading?: boolean;
  /** 수정 모드 여부 */
  isEditMode?: boolean;
}

// ========================================
// Select Options
// ========================================

const STATUS_OPTIONS: SelectOption[] = Object.entries(ARTICLE_STATUS_META).map(
  ([value, meta]) => ({
    value,
    label: meta.label,
  })
);

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "", label: "카테고리 선택" },
  ...Object.entries(ARTICLE_CATEGORY_META).map(([value, meta]) => ({
    value,
    label: meta.label,
  })),
];

// ========================================
// ArticleForm Component
// ========================================

export const ArticleForm: React.FC<ArticleFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  loading = false,
  isEditMode = false,
}) => {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    watch,
  } = useForm<ArticleFormValues>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      ...DEFAULT_ARTICLE_FORM,
      ...defaultValues,
    },
  });

  const currentStatus = watch("status");

  // 공통 제출 핸들러 (Toast 알림 포함)
  const submitWithToast = async (data: ArticleFormValues, actionName: string) => {
    try {
      await onSubmit(data as ArticleFormData);
      toast.success(`게시글이 ${actionName}되었습니다.`);
    } catch (error) {
      toast.error(`게시글 ${actionName}에 실패했습니다.`, {
        title: "오류",
      });
      console.error(`Article ${actionName} failed:`, error);
    }
  };

  // 임시 저장 핸들러
  const handleSaveDraft = () => {
    handleSubmit((data) => {
      submitWithToast({ ...data, status: "DRAFT" }, "임시 저장");
    })();
  };

  // 게시 핸들러
  const handlePublish = () => {
    handleSubmit((data) => {
      submitWithToast({ ...data, status: "PUBLISHED" }, "게시");
    })();
  };

  // 일반 저장 핸들러
  const handleFormSubmit = (data: ArticleFormValues) => {
    submitWithToast(data, isEditMode ? "수정" : "저장");
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "게시글 수정" : "게시글 작성"}</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          {/* 제목 - FormFieldWrapper 사용 */}
          <FormFieldWrapper
            label="제목"
            required
            errorMessage={errors.title?.message}
          >
            <Input
              placeholder="게시글 제목을 입력하세요"
              error={!!errors.title}
              fullWidth
              {...register("title")}
            />
          </FormFieldWrapper>

          {/* 카테고리 & 상태 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormFieldWrapper label="카테고리">
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    options={CATEGORY_OPTIONS}
                    value={field.value || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value as ArticleCategory | undefined
                      )
                    }
                    fullWidth
                  />
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="상태">
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    options={STATUS_OPTIONS}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(e.target.value as ArticleStatus)
                    }
                    fullWidth
                  />
                )}
              />
            </FormFieldWrapper>
          </div>
        </CardBody>
      </Card>

      {/* 본문 내용 */}
      <Card>
        <CardHeader>
          <CardTitle>본문 내용</CardTitle>
        </CardHeader>
        <CardBody>
          <FormFieldWrapper
            label="내용"
            required
            errorMessage={errors.contentHtml?.message}
          >
            <Controller
              name="contentHtml"
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="게시글 내용을 입력하세요..."
                  minHeight={300}
                  error={!!errors.contentHtml}
                />
              )}
            />
          </FormFieldWrapper>
        </CardBody>
      </Card>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between">
        <div>
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={loading}
              leftIcon={<X className="w-4 h-4" />}
            >
              취소
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 임시 저장 */}
          {currentStatus !== "PUBLISHED" && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={loading || !isDirty}
              loading={loading && currentStatus === "DRAFT"}
              leftIcon={<Save className="w-4 h-4" />}
            >
              임시 저장
            </Button>
          )}

          {/* 게시 / 저장 */}
          <Button
            type="button"
            variant="primary"
            onClick={
              currentStatus === "PUBLISHED" || isEditMode
                ? handleSubmit(handleFormSubmit)
                : handlePublish
            }
            disabled={loading}
            loading={loading && currentStatus !== "DRAFT"}
            leftIcon={<Send className="w-4 h-4" />}
          >
            {isEditMode
              ? "저장"
              : currentStatus === "PUBLISHED"
                ? "게시"
                : "게시하기"}
          </Button>
        </div>
      </div>
    </form>
  );
};

ArticleForm.displayName = "ArticleForm";
