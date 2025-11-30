/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 파일 업로드 컴포넌트.
 *      Drag & Drop + 클릭 업로드를 지원하며,
 *      fileUtils를 사용해 확장자/사이즈 검증을 수행합니다.
 *      React Hook Form Controller와 함께 사용할 수 있습니다.
 *
 * FileUpload Component
 * - Drag & Drop 지원
 * - 확장자/크기 검증
 * - 미리보기 및 에러 메시지 표시
 */

import React, { useState, useRef, useCallback } from "react";
import { Upload, X, File as FileIcon, Image as ImageIcon } from "lucide-react";
import { cn } from "../../utils/classUtils";
import {
  validateFile,
  formatFileSize,
  isImageFile,
  createPreviewUrl,
  revokePreviewUrl,
} from "../../utils/fileUtils";

// ========================================
// FileUpload Types
// ========================================

export interface SelectedFile {
  file: File;
  previewUrl?: string;
  error?: string;
}

export interface FileUploadProps {
  /** 라벨 */
  label?: string;
  /** 설명 */
  description?: string;
  /** 다중 파일 허용 */
  multiple?: boolean;
  /** 허용된 확장자 (예: ["jpg", "png", "pdf"]) */
  acceptExtensions?: string[];
  /** 최대 파일 크기 (MB) */
  maxSizeMb?: number;
  /** 파일 선택 콜백 */
  onFilesSelected?: (files: File[]) => void;
  /** 파일 제거 콜백 */
  onFileRemoved?: (file: File) => void;
  /** 에러 상태 */
  error?: boolean;
  /** 에러 메시지 */
  errorMessage?: string;
  /** 비활성화 */
  disabled?: boolean;
  /** 추가 클래스 */
  className?: string;
  /** 기존 선택된 파일 (제어 컴포넌트용) */
  value?: File[];
  /** 파일 변경 콜백 (제어 컴포넌트용) */
  onChange?: (files: File[]) => void;
}

// ========================================
// FileUpload Component
// ========================================

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  description,
  multiple = false,
  acceptExtensions = [],
  maxSizeMb,
  onFilesSelected,
  onFileRemoved,
  error = false,
  errorMessage,
  disabled = false,
  className,
  value,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);

  // 제어/비제어 컴포넌트 처리
  const isControlled = value !== undefined;
  const currentFiles: SelectedFile[] = isControlled
    ? value.map((file) => ({
        file,
        previewUrl: isImageFile(file) ? createPreviewUrl(file) : undefined,
        error: undefined,
      }))
    : selectedFiles;

  // Accept 속성 생성
  const acceptAttribute = acceptExtensions.length
    ? acceptExtensions.map((ext) => `.${ext}`).join(",")
    : undefined;

  // 파일 처리
  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const processed: SelectedFile[] = [];

      fileArray.forEach((file) => {
        const validation = validateFile(file, {
          allowedExtensions: acceptExtensions,
          maxSizeMb,
        });

        const selectedFile: SelectedFile = {
          file,
          previewUrl: isImageFile(file) ? createPreviewUrl(file) : undefined,
          error: validation.valid ? undefined : validation.error,
        };

        processed.push(selectedFile);
      });

      // 유효한 파일만 필터링
      const validFiles = processed
        .filter((sf) => !sf.error)
        .map((sf) => sf.file);

      if (isControlled && onChange) {
        onChange(multiple ? [...value!, ...validFiles] : validFiles);
      } else {
        setSelectedFiles((prev) =>
          multiple ? [...prev, ...processed] : processed
        );
      }

      if (onFilesSelected && validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    },
    [
      acceptExtensions,
      maxSizeMb,
      multiple,
      isControlled,
      value,
      onChange,
      onFilesSelected,
    ]
  );

  // 파일 제거
  const handleRemoveFile = useCallback(
    (index: number) => {
      const fileToRemove = currentFiles[index];

      // 미리보기 URL 해제
      if (fileToRemove.previewUrl) {
        revokePreviewUrl(fileToRemove.previewUrl);
      }

      if (isControlled && onChange) {
        const newFiles = value!.filter((_, i) => i !== index);
        onChange(newFiles);
      } else {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
      }

      if (onFileRemoved) {
        onFileRemoved(fileToRemove.file);
      }
    },
    [currentFiles, isControlled, value, onChange, onFileRemoved]
  );

  // 클릭 핸들러
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // 파일 입력 변경
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(event.target.files);
    }
    // 같은 파일 재선택 허용을 위해 value 초기화
    event.target.value = "";
  };

  // Drag & Drop 핸들러
  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (!disabled && event.dataTransfer.files) {
      processFiles(event.dataTransfer.files);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-softone-text">
          {label}
        </label>
      )}

      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "relative flex flex-col items-center justify-center",
          "border-2 border-dashed rounded-lg p-6 cursor-pointer",
          "transition-colors duration-200",
          // Normal state
          !isDragging &&
            !error &&
            "border-softone-border bg-softone-bg hover:border-softone-primary/50 hover:bg-softone-surface",
          // Dragging state
          isDragging && "border-softone-primary bg-softone-primary/5",
          // Error state
          error && "border-softone-danger bg-softone-danger/5",
          // Disabled state
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={acceptAttribute}
          onChange={handleFileChange}
          disabled={disabled}
          className="sr-only"
        />

        <Upload
          className={cn(
            "w-10 h-10 mb-3",
            isDragging ? "text-softone-primary" : "text-softone-text-muted"
          )}
        />

        <p className="text-sm font-medium text-softone-text">
          {isDragging
            ? "파일을 여기에 놓으세요"
            : "클릭하거나 파일을 드래그하세요"}
        </p>

        {description && (
          <p className="mt-1 text-xs text-softone-text-muted">{description}</p>
        )}

        {(acceptExtensions.length > 0 || maxSizeMb) && (
          <p className="mt-2 text-xs text-softone-text-muted">
            {acceptExtensions.length > 0 && (
              <span>허용 형식: {acceptExtensions.join(", ")}</span>
            )}
            {acceptExtensions.length > 0 && maxSizeMb && <span> · </span>}
            {maxSizeMb && <span>최대 {maxSizeMb}MB</span>}
          </p>
        )}
      </div>

      {/* Error Message */}
      {(errorMessage || error) && (
        <p className="text-sm text-softone-danger">
          {errorMessage || "파일 업로드에 문제가 있습니다."}
        </p>
      )}

      {/* Selected Files */}
      {currentFiles.length > 0 && (
        <ul className="space-y-2 mt-4">
          {currentFiles.map((sf, index) => (
            <li
              key={`${sf.file.name}-${index}`}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border",
                sf.error
                  ? "border-softone-danger bg-softone-danger/5"
                  : "border-softone-border bg-softone-surface"
              )}
            >
              {/* Preview / Icon */}
              {sf.previewUrl ? (
                <img
                  src={sf.previewUrl}
                  alt={sf.file.name}
                  className="w-10 h-10 rounded object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded bg-softone-bg flex items-center justify-center">
                  {isImageFile(sf.file) ? (
                    <ImageIcon className="w-5 h-5 text-softone-text-muted" />
                  ) : (
                    <FileIcon className="w-5 h-5 text-softone-text-muted" />
                  )}
                </div>
              )}

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-softone-text truncate">
                  {sf.file.name}
                </p>
                <p className="text-xs text-softone-text-muted">
                  {formatFileSize(sf.file.size)}
                </p>
                {sf.error && (
                  <p className="text-xs text-softone-danger mt-0.5">
                    {sf.error}
                  </p>
                )}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                className="p-1 rounded hover:bg-softone-surface-hover text-softone-text-muted hover:text-softone-danger transition-colors"
                aria-label="파일 제거"
              >
                <X className="w-4 h-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

FileUpload.displayName = "FileUpload";
