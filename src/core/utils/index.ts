/**
 * SoftOne Design System - Utils Module
 * Utility Function exports
 *
 * Step 5: fileUtils 추가 - 파일 업로드 관련 유틸리티
 */

// Class Utilities (cn function)
export { cn, conditionalClass, variantClass } from "./classUtils";

// Date Utilities
export {
  formatDate,
  formatDateTime,
  formatRelative,
  formatDateRange,
  isValidDate,
  isSameDay,
  isToday,
  addDays,
  addMonths,
} from "./dateUtils";

// Format Utilities
export {
  formatNumberWithComma,
  formatCurrency,
  formatPhoneNumber,
  formatBusinessNumber,
  formatPercent,
  formatFileSize,
  truncateText,
} from "./formatUtils";

// Enum Utilities
export {
  getEnumMeta,
  getEnumLabel,
  getEnumColor,
  enumMapToOptions,
  createEnumMap,
  type EnumMeta,
  type EnumMap,
  // Common Enum Maps
  USER_STATUS,
  USER_ROLE,
  YES_NO,
  USE_YN,
  PROCESS_STATUS,
} from "./enumUtils";

// File Utilities (Step 5)
export {
  formatFileSize as formatFileSizeUtil,
  getFileExtension,
  isAllowedExtension,
  isUnderMaxSize,
  mbToBytes,
  isImageFile,
  isDocumentFile,
  createPreviewUrl,
  revokePreviewUrl,
  validateFile,
  type FileValidationResult,
} from "./fileUtils";
