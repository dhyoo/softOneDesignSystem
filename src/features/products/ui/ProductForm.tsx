/**
 * SoftOne Design System - Product Form Component
 * React Hook Form + Zod 기반 상품 등록/수정 폼
 *
 * 기능:
 *   - 폼 유효성 검증 (Zod)
 *   - 실시간 에러 표시
 *   - 자동완성/포맷팅
 *   - 수정 모드 지원
 */

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { FormFieldWrapper } from "@core/components/ui/FormFieldWrapper";
import { Input } from "@core/components/ui/Input";
import { Select } from "@core/components/ui/Select";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { Save, X, Plus, Trash2 } from "lucide-react";

import type {
  Product,
  ProductFormData,
  ProductCategory,
  ProductStatus,
} from "../model/product.types";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  DEFAULT_PRODUCT_FORM,
} from "../model/product.types";

// ========================================
// Validation Schema
// ========================================

const productSchema = z.object({
  code: z
    .string()
    .min(1, "상품코드를 입력하세요")
    .max(20, "상품코드는 20자 이하로 입력하세요")
    .regex(/^[A-Z0-9-]+$/, "영문 대문자, 숫자, 하이픈만 사용 가능합니다"),
  name: z
    .string()
    .min(1, "상품명을 입력하세요")
    .max(100, "상품명은 100자 이하로 입력하세요"),
  category: z.enum(
    [
      "ELECTRONICS",
      "CLOTHING",
      "FOOD",
      "FURNITURE",
      "COSMETICS",
      "SPORTS",
      "BOOKS",
      "TOYS",
      "OTHER",
    ] as const,
    "카테고리를 선택하세요"
  ),
  price: z
    .number("가격을 입력하세요")
    .min(0, "가격은 0원 이상이어야 합니다")
    .max(100000000, "가격은 1억원 이하로 입력하세요"),
  costPrice: z
    .number("원가를 입력하세요")
    .min(0, "원가는 0원 이상이어야 합니다"),
  stock: z
    .number("재고를 입력하세요")
    .min(0, "재고는 0개 이상이어야 합니다")
    .int("재고는 정수로 입력하세요"),
  minStock: z
    .number("최소재고를 입력하세요")
    .min(0, "최소재고는 0개 이상이어야 합니다")
    .int("최소재고는 정수로 입력하세요"),
  unit: z.string().min(1, "단위를 입력하세요"),
  status: z.enum(
    ["ACTIVE", "INACTIVE", "OUT_OF_STOCK", "DISCONTINUED"] as const,
    "상태를 선택하세요"
  ),
  description: z.string().max(1000, "설명은 1000자 이하로 입력하세요"),
  imageUrl: z
    .string()
    .url("올바른 URL을 입력하세요")
    .optional()
    .or(z.literal("")),
  tags: z.array(z.string()),
});

// ========================================
// Props
// ========================================

interface ProductFormProps {
  /** 수정할 상품 (없으면 등록 모드) */
  product?: Product | null;
  /** 폼 제출 핸들러 */
  onSubmit: (data: ProductFormData) => void;
  /** 취소 핸들러 */
  onCancel: () => void;
  /** 로딩 상태 */
  isLoading?: boolean;
}

// ========================================
// Component
// ========================================

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditMode = !!product;

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          code: product.code,
          name: product.name,
          category: product.category,
          price: product.price,
          costPrice: product.costPrice,
          stock: product.stock,
          minStock: product.minStock,
          unit: product.unit,
          status: product.status,
          description: product.description,
          imageUrl: product.imageUrl || "",
          tags: product.tags,
        }
      : DEFAULT_PRODUCT_FORM,
  });

  // 수정 모드일 때 폼 초기화
  useEffect(() => {
    if (product) {
      reset({
        code: product.code,
        name: product.name,
        category: product.category,
        price: product.price,
        costPrice: product.costPrice,
        stock: product.stock,
        minStock: product.minStock,
        unit: product.unit,
        status: product.status,
        description: product.description,
        imageUrl: product.imageUrl || "",
        tags: product.tags,
      });
    } else {
      reset(DEFAULT_PRODUCT_FORM);
    }
  }, [product, reset]);

  // 태그 상태
  const tags = watch("tags") || [];
  const [newTag, setNewTag] = React.useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setValue("tags", [...tags, newTag.trim()], { shouldDirty: true });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "tags",
      tags.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true }
    );
  };

  // 가격 계산
  const price = watch("price") || 0;
  const costPrice = watch("costPrice") || 0;
  const margin = price - costPrice;
  const marginRate = price > 0 ? ((margin / price) * 100).toFixed(1) : "0";

  const handleFormSubmit = (data: ProductFormData) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-softone-text border-b pb-2">
          기본 정보
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 상품코드 */}
          <FormFieldWrapper
            label="상품코드"
            required
            errorMessage={errors.code?.message}
          >
            <Input
              {...register("code")}
              placeholder="예: PRD-0001"
              disabled={isEditMode}
              className={isEditMode ? "bg-gray-100" : ""}
            />
          </FormFieldWrapper>

          {/* 상품명 */}
          <FormFieldWrapper
            label="상품명"
            required
            errorMessage={errors.name?.message}
          >
            <Input {...register("name")} placeholder="상품명을 입력하세요" />
          </FormFieldWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 카테고리 */}
          <FormFieldWrapper
            label="카테고리"
            required
            errorMessage={errors.category?.message}
          >
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="선택하세요"
                  options={PRODUCT_CATEGORIES}
                />
              )}
            />
          </FormFieldWrapper>

          {/* 상태 */}
          <FormFieldWrapper
            label="상태"
            required
            errorMessage={errors.status?.message}
          >
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select {...field} options={PRODUCT_STATUSES} />
              )}
            />
          </FormFieldWrapper>

          {/* 단위 */}
          <FormFieldWrapper
            label="단위"
            required
            errorMessage={errors.unit?.message}
          >
            <Select
              {...register("unit")}
              options={[
                { value: "EA", label: "EA (개)" },
                { value: "BOX", label: "BOX (박스)" },
                { value: "SET", label: "SET (세트)" },
                { value: "KG", label: "KG (킬로그램)" },
                { value: "L", label: "L (리터)" },
                { value: "M", label: "M (미터)" },
              ]}
            />
          </FormFieldWrapper>
        </div>
      </div>

      {/* 가격 정보 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-softone-text border-b pb-2">
          가격 정보
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 판매가 */}
          <FormFieldWrapper
            label="판매가 (원)"
            required
            errorMessage={errors.price?.message}
          >
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="0"
                />
              )}
            />
          </FormFieldWrapper>

          {/* 원가 */}
          <FormFieldWrapper
            label="원가 (원)"
            required
            errorMessage={errors.costPrice?.message}
          >
            <Controller
              name="costPrice"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="0"
                />
              )}
            />
          </FormFieldWrapper>

          {/* 마진 (계산값) */}
          <div>
            <label className="block text-sm font-medium text-softone-text mb-1">
              마진
            </label>
            <div className="h-10 px-3 flex items-center bg-gray-50 rounded-md border">
              <span className={margin >= 0 ? "text-green-600" : "text-red-600"}>
                {margin.toLocaleString()}원 ({marginRate}%)
              </span>
            </div>
          </div>

          {/* 재고 */}
          <FormFieldWrapper
            label="현재 재고"
            required
            errorMessage={errors.stock?.message}
          >
            <Controller
              name="stock"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="0"
                />
              )}
            />
          </FormFieldWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 최소재고 */}
          <FormFieldWrapper
            label="최소 재고"
            errorMessage={errors.minStock?.message}
            description="재고 부족 알림 기준"
          >
            <Controller
              name="minStock"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="10"
                />
              )}
            />
          </FormFieldWrapper>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-softone-text border-b pb-2">
          추가 정보
        </h3>

        {/* 설명 */}
        <FormFieldWrapper
          label="상품 설명"
          errorMessage={errors.description?.message}
        >
          <textarea
            {...register("description")}
            rows={3}
            className="w-full px-3 py-2 border border-softone-border rounded-md focus:outline-none focus:ring-2 focus:ring-softone-primary focus:border-transparent resize-none"
            placeholder="상품에 대한 설명을 입력하세요"
          />
        </FormFieldWrapper>

        {/* 이미지 URL */}
        <FormFieldWrapper
          label="이미지 URL"
          errorMessage={errors.imageUrl?.message}
        >
          <Input
            {...register("imageUrl")}
            placeholder="https://example.com/image.jpg"
          />
        </FormFieldWrapper>

        {/* 태그 */}
        <FormFieldWrapper label="태그">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="태그 입력 후 추가"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                추가
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="info"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </FormFieldWrapper>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading || (!isDirty && isEditMode)}
          leftIcon={<Save className="w-4 h-4" />}
        >
          {isLoading ? "저장 중..." : isEditMode ? "수정" : "등록"}
        </Button>
      </div>
    </form>
  );
};

ProductForm.displayName = "ProductForm";
