/**
 * SoftOne Design System(SDS) - File Utility
 * 작성: SoftOne Frontend Team
 * 설명: 파일 업로드 관련 유틸리티 함수.
 *      FileUpload 컴포넌트와 함께 사용하여 일관된 파일 처리를 제공합니다.
 *
 * File Utils
 * - formatFileSize: 파일 크기 포맷팅
 * - isAllowedExtension: 확장자 검증
 * - isUnderMaxSize: 파일 크기 검증
 * - getFileExtension: 확장자 추출
 */

// ========================================
// File Size Formatting
// ========================================

/**
 * 바이트를 읽기 쉬운 형식으로 변환
 *
 * @param bytes - 바이트 수
 * @param decimals - 소수점 자릿수 (기본: 2)
 * @returns 포맷된 문자열 (예: "1.5 MB")
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1234567) // "1.18 MB"
 * formatFileSize(0) // "0 Bytes"
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${size} ${sizes[i]}`;
}

// ========================================
// Extension Utilities
// ========================================

/**
 * 파일명에서 확장자 추출
 *
 * @param fileName - 파일명
 * @returns 소문자 확장자 (점 제외)
 *
 * @example
 * getFileExtension("document.pdf") // "pdf"
 * getFileExtension("image.PNG") // "png"
 * getFileExtension("noextension") // ""
 */
export function getFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  if (lastDot === -1 || lastDot === fileName.length - 1) {
    return "";
  }
  return fileName.slice(lastDot + 1).toLowerCase();
}

/**
 * 파일 확장자가 허용된 목록에 있는지 확인
 *
 * @param fileName - 파일명
 * @param allowedExtensions - 허용된 확장자 배열 (예: ["jpg", "png", "pdf"])
 * @returns 허용된 확장자인지 여부
 *
 * @example
 * isAllowedExtension("photo.jpg", ["jpg", "png", "gif"]) // true
 * isAllowedExtension("document.pdf", ["jpg", "png"]) // false
 * isAllowedExtension("image.PNG", ["png"]) // true (대소문자 무시)
 */
export function isAllowedExtension(
  fileName: string,
  allowedExtensions: string[]
): boolean {
  if (!allowedExtensions.length) return true;

  const extension = getFileExtension(fileName);
  const normalizedAllowed = allowedExtensions.map((ext) =>
    ext.toLowerCase().replace(/^\./, "")
  );

  return normalizedAllowed.includes(extension);
}

// ========================================
// Size Validation
// ========================================

/**
 * 파일이 최대 크기 이하인지 확인
 *
 * @param file - File 객체
 * @param maxSizeBytes - 최대 크기 (바이트)
 * @returns 크기가 허용 범위 내인지 여부
 *
 * @example
 * isUnderMaxSize(file, 5 * 1024 * 1024) // 5MB 이하인지 확인
 */
export function isUnderMaxSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes;
}

/**
 * MB를 바이트로 변환
 *
 * @param mb - 메가바이트
 * @returns 바이트
 *
 * @example
 * mbToBytes(5) // 5242880
 */
export function mbToBytes(mb: number): number {
  return mb * 1024 * 1024;
}

// ========================================
// File Type Utilities
// ========================================

/**
 * 파일의 MIME 타입이 이미지인지 확인
 *
 * @param file - File 객체
 * @returns 이미지 파일인지 여부
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/**
 * 파일의 MIME 타입이 문서인지 확인
 *
 * @param file - File 객체
 * @returns 문서 파일인지 여부
 */
export function isDocumentFile(file: File): boolean {
  const documentTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "text/plain",
    "text/csv",
  ];
  return documentTypes.includes(file.type);
}

// ========================================
// File Preview
// ========================================

/**
 * 파일의 미리보기 URL 생성 (이미지용)
 *
 * @param file - File 객체
 * @returns Blob URL (사용 후 URL.revokeObjectURL 호출 필요)
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * 미리보기 URL 해제
 *
 * @param url - createPreviewUrl로 생성된 URL
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}

// ========================================
// Validation Result
// ========================================

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * 파일 유효성 종합 검사
 *
 * @param file - File 객체
 * @param options - 검사 옵션
 * @returns 유효성 검사 결과
 */
export function validateFile(
  file: File,
  options: {
    allowedExtensions?: string[];
    maxSizeMb?: number;
  }
): FileValidationResult {
  const { allowedExtensions = [], maxSizeMb } = options;

  // 확장자 검사
  if (allowedExtensions.length > 0) {
    if (!isAllowedExtension(file.name, allowedExtensions)) {
      return {
        valid: false,
        error: `허용되지 않는 파일 형식입니다. (허용: ${allowedExtensions.join(
          ", "
        )})`,
      };
    }
  }

  // 크기 검사
  if (maxSizeMb !== undefined) {
    const maxSizeBytes = mbToBytes(maxSizeMb);
    if (!isUnderMaxSize(file, maxSizeBytes)) {
      return {
        valid: false,
        error: `파일 크기가 ${maxSizeMb}MB를 초과합니다. (현재: ${formatFileSize(
          file.size
        )})`,
      };
    }
  }

  return { valid: true };
}
