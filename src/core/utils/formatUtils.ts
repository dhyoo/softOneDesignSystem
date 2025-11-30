/**
 * SoftOne Design System(SDS) - Format Utility
 * 작성: SoftOne Frontend Team
 * 설명: 숫자, 통화, 전화번호 등 데이터 포맷팅 유틸리티.
 *      테스트/스토리 문서화를 통한 엔터프라이즈 품질 보장.
 */

/**
 * 숫자에 천단위 콤마 추가
 *
 * @param value - 숫자 또는 문자열
 * @returns 콤마가 추가된 문자열
 *
 * @example
 * formatNumberWithComma(1234567) // '1,234,567'
 * formatNumberWithComma('1234567.89') // '1,234,567.89'
 * formatNumberWithComma(null) // ''
 */
export function formatNumberWithComma(
  value: number | string | null | undefined
): string {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(num)) {
    return "";
  }

  // 정수부와 소수부 분리
  const parts = num.toString().split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  // 정수부에 콤마 추가
  const formattedInteger = integerPart?.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 소수부가 있으면 합치기
  return decimalPart
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger ?? "";
}

/**
 * 통화 포맷팅
 *
 * @param value - 금액
 * @param currency - 통화 기호 (기본: '원')
 * @param position - 통화 위치 ('prefix' | 'suffix')
 * @returns 포맷된 통화 문자열
 *
 * @example
 * formatCurrency(10000) // '10,000원'
 * formatCurrency(10000, '$', 'prefix') // '$10,000'
 * formatCurrency(10000, '₩') // '10,000₩'
 */
export function formatCurrency(
  value: number | string | null | undefined,
  currency: string = "원",
  position: "prefix" | "suffix" = "suffix"
): string {
  const formatted = formatNumberWithComma(value);

  if (!formatted) return "";

  if (position === "prefix") {
    return `${currency}${formatted}`;
  }

  return `${formatted}${currency}`;
}

/**
 * 전화번호 포맷팅
 *
 * @param phone - 전화번호 (숫자만)
 * @returns 포맷된 전화번호
 *
 * @example
 * formatPhoneNumber('01012345678') // '010-1234-5678'
 * formatPhoneNumber('0212345678') // '02-1234-5678'
 */
export function formatPhoneNumber(phone: string | null | undefined): string {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  // 휴대폰 (010, 011, 016, 017, 018, 019)
  if (/^01[016789]/.test(cleaned)) {
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
  }

  // 서울 (02)
  if (cleaned.startsWith("02")) {
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    if (cleaned.length === 9) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
    }
  }

  // 지역번호 (031~064)
  if (/^0[3-6][1-4]/.test(cleaned)) {
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
  }

  return phone;
}

/**
 * 사업자등록번호 포맷팅
 *
 * @param bizNo - 사업자등록번호 (숫자만)
 * @returns 포맷된 사업자등록번호
 *
 * @example
 * formatBusinessNumber('1234567890') // '123-45-67890'
 */
export function formatBusinessNumber(bizNo: string | null | undefined): string {
  if (!bizNo) return "";

  const cleaned = bizNo.replace(/\D/g, "");

  if (cleaned.length !== 10) return bizNo;

  return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3");
}

/**
 * 퍼센트 포맷팅
 *
 * @param value - 비율 (0~1 또는 0~100)
 * @param decimals - 소수점 자릿수
 * @param isDecimal - value가 0~1 범위인지 여부
 *
 * @example
 * formatPercent(0.1234) // '12.34%'
 * formatPercent(12.34, 1, false) // '12.3%'
 */
export function formatPercent(
  value: number | null | undefined,
  decimals: number = 2,
  isDecimal: boolean = true
): string {
  if (value === null || value === undefined) return "";

  const percent = isDecimal ? value * 100 : value;
  return `${percent.toFixed(decimals)}%`;
}

/**
 * 파일 크기 포맷팅
 *
 * @param bytes - 바이트 수
 * @returns 포맷된 파일 크기
 *
 * @example
 * formatFileSize(1024) // '1 KB'
 * formatFileSize(1048576) // '1 MB'
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}

/**
 * 문자열 자르기 (말줄임)
 *
 * @param text - 원본 문자열
 * @param maxLength - 최대 길이
 * @param suffix - 말줄임 표시 (기본: '...')
 *
 * @example
 * truncateText('Hello World', 5) // 'Hello...'
 */
export function truncateText(
  text: string | null | undefined,
  maxLength: number,
  suffix: string = "..."
): string {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength) + suffix;
}
