/**
 * SoftOne Design System - User Profile Image Upload
 * 작성: SoftOne Frontend Team
 * 설명: React Hook Form + Controller + FileUpload 조합 예제.
 *      파일 업로드 패턴을 도메인 기능에 적용하는 방법을 보여줍니다.
 *
 * UserProfileImageUpload Component
 * - FileUpload 컴포넌트와 React Hook Form 통합
 * - httpClient를 통한 업로드 (Mock)
 * - 업로드 진행률 표시 가능 (주석 참조)
 */

import React, { useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { FileUpload } from "@core/components/ui/FileUpload";
import { Button } from "@core/components/ui/Button";
// import { httpClient } from "@core/api/httpClient"; // 실제 업로드 시 사용
import { formatFileSize } from "@core/utils/fileUtils";

// ========================================
// Types
// ========================================

export interface UserProfileImageUploadProps {
  /** React Hook Form Control */
  control: Control<{ avatar?: File[] }>;
  /** 필드 이름 */
  name?: "avatar";
  /** 사용자 ID (업로드 시 사용) */
  userId?: string;
  /** 현재 프로필 이미지 URL */
  currentImageUrl?: string;
  /** 업로드 완료 콜백 */
  onUploadComplete?: (url: string) => void;
  /** 에러 콜백 */
  onError?: (error: string) => void;
}

// ========================================
// UserProfileImageUpload Component
// ========================================

export const UserProfileImageUpload: React.FC<UserProfileImageUploadProps> = ({
  control,
  name = "avatar",
  userId,
  currentImageUrl,
  onUploadComplete,
  onError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentImageUrl || null
  );

  /**
   * 파일 업로드 처리
   *
   * @example axios onUploadProgress 사용법
   * ```typescript
   * const response = await httpClient.post(
   *   `/api/users/${userId}/avatar`,
   *   formData,
   *   {
   *     headers: {
   *       'Content-Type': 'multipart/form-data',
   *     },
   *     onUploadProgress: (progressEvent) => {
   *       const percentCompleted = Math.round(
   *         (progressEvent.loaded * 100) / (progressEvent.total || 1)
   *       );
   *       setUploadProgress(percentCompleted);
   *     },
   *   }
   * );
   * ```
   */
  const handleUpload = async (files: File[]) => {
    if (!files.length || !userId) return;

    const file = files[0];
    setIsUploading(true);
    setUploadProgress(0);

    // 로컬 프리뷰 생성
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append("avatar", file);

      // Mock 업로드 시뮬레이션
      // 실제 구현에서는 httpClient.post 사용
      await new Promise<void>((resolve) => {
        // 진행률 시뮬레이션
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              resolve();
              return 100;
            }
            return prev + 20;
          });
        }, 200);
      });

      // 업로드 성공
      const mockResponseUrl = `https://api.softone.co.kr/avatars/${userId}-${Date.now()}.jpg`;
      onUploadComplete?.(mockResponseUrl);

      console.log("[Mock] Avatar uploaded:", {
        userId,
        fileName: file.name,
        fileSize: formatFileSize(file.size),
        responseUrl: mockResponseUrl,
      });
    } catch (error) {
      console.error("[Avatar Upload Error]", error);
      onError?.(error instanceof Error ? error.message : "업로드 실패");

      // 프리뷰 제거
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
        setPreviewUrl(currentImageUrl || null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current/Preview Image */}
      {previewUrl && (
        <div className="flex items-center gap-4">
          <img
            src={previewUrl}
            alt="프로필 이미지"
            className="w-20 h-20 rounded-full object-cover border-2 border-softone-border"
          />
          <div>
            <p className="text-sm font-medium text-softone-text">
              현재 프로필 이미지
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPreviewUrl(null)}
              className="mt-1"
            >
              이미지 제거
            </Button>
          </div>
        </div>
      )}

      {/* File Upload with React Hook Form */}
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <FileUpload
            label="프로필 이미지 업로드"
            description="프로필에 표시될 이미지를 선택하세요."
            acceptExtensions={["jpg", "jpeg", "png", "gif", "webp"]}
            maxSizeMb={5}
            multiple={false}
            value={value}
            onChange={(files) => {
              onChange(files);
              if (files.length > 0) {
                handleUpload(files);
              }
            }}
            error={!!error}
            errorMessage={error?.message}
            disabled={isUploading}
          />
        )}
      />

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-softone-text-secondary">업로드 중...</span>
            <span className="text-softone-text font-medium">
              {uploadProgress}%
            </span>
          </div>
          <div className="h-2 bg-softone-bg rounded-full overflow-hidden">
            <div
              className="h-full bg-softone-primary transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Usage Guide */}
      <div className="text-xs text-softone-text-muted">
        <p>• 지원 형식: JPG, PNG, GIF, WebP</p>
        <p>• 최대 크기: 5MB</p>
        <p>• 권장 크기: 400x400px 이상</p>
      </div>
    </div>
  );
};

UserProfileImageUpload.displayName = "UserProfileImageUpload";
