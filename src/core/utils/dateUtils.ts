/**
 * SoftOne Design System(SDS) - Date Utility
 * 작성: SoftOne Frontend Team
 * 설명: Day.js 기반 날짜 포맷팅 및 조작 유틸리티.
 *      테스트/스토리 문서화를 통한 엔터프라이즈 품질 보장.
 */

import dayjs from "dayjs";
import "dayjs/locale/ko";

// 한국어 로케일 설정
dayjs.locale("ko");

/**
 * 날짜를 지정된 형식으로 포맷팅
 *
 * @param value - Date 객체, 문자열, 숫자(timestamp)
 * @param format - 출력 형식 (기본: 'YYYY-MM-DD')
 * @returns 포맷된 날짜 문자열
 *
 * @example
 * formatDate(new Date()) // '2024-01-15'
 * formatDate('2024-01-15', 'YYYY년 MM월 DD일') // '2024년 01월 15일'
 */
export function formatDate(
  value: Date | string | number | null | undefined,
  format: string = "YYYY-MM-DD"
): string {
  if (!value) return "";

  const date = dayjs(value);

  if (!date.isValid()) {
    console.warn("[SDS] Invalid date value:", value);
    return "";
  }

  return date.format(format);
}

/**
 * 날짜와 시간을 지정된 형식으로 포맷팅
 *
 * @param value - Date 객체, 문자열, 숫자(timestamp)
 * @param format - 출력 형식 (기본: 'YYYY-MM-DD HH:mm')
 * @returns 포맷된 날짜/시간 문자열
 *
 * @example
 * formatDateTime(new Date()) // '2024-01-15 14:30'
 * formatDateTime('2024-01-15T14:30:00', 'YYYY년 MM월 DD일 HH시 mm분') // '2024년 01월 15일 14시 30분'
 */
export function formatDateTime(
  value: Date | string | number | null | undefined,
  format: string = "YYYY-MM-DD HH:mm"
): string {
  return formatDate(value, format);
}

/**
 * 상대적 시간 표시 (예: '3일 전', '방금 전')
 *
 * @param value - Date 객체, 문자열, 숫자(timestamp)
 * @returns 상대적 시간 문자열
 *
 * @example
 * formatRelative(new Date(Date.now() - 60000)) // '1분 전'
 */
export function formatRelative(
  value: Date | string | number | null | undefined
): string {
  if (!value) return "";

  const date = dayjs(value);
  if (!date.isValid()) return "";

  const now = dayjs();
  const diffSeconds = now.diff(date, "second");
  const diffMinutes = now.diff(date, "minute");
  const diffHours = now.diff(date, "hour");
  const diffDays = now.diff(date, "day");

  if (diffSeconds < 60) return "방금 전";
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}개월 전`;

  return `${Math.floor(diffDays / 365)}년 전`;
}

/**
 * 날짜 범위 포맷팅
 *
 * @example
 * formatDateRange(startDate, endDate) // '2024.01.01 ~ 2024.01.31'
 */
export function formatDateRange(
  startDate: Date | string | number | null | undefined,
  endDate: Date | string | number | null | undefined,
  format: string = "YYYY.MM.DD"
): string {
  const start = formatDate(startDate, format);
  const end = formatDate(endDate, format);

  if (!start && !end) return "";
  if (!start) return end;
  if (!end) return start;

  return `${start} ~ ${end}`;
}

/**
 * 날짜가 유효한지 확인
 */
export function isValidDate(
  value: Date | string | number | null | undefined
): boolean {
  if (!value) return false;
  return dayjs(value).isValid();
}

/**
 * 두 날짜가 같은 날인지 확인
 */
export function isSameDay(
  date1: Date | string | number,
  date2: Date | string | number
): boolean {
  return dayjs(date1).isSame(dayjs(date2), "day");
}

/**
 * 날짜가 오늘인지 확인
 */
export function isToday(value: Date | string | number): boolean {
  return dayjs(value).isSame(dayjs(), "day");
}

/**
 * 날짜에 일수 더하기
 */
export function addDays(value: Date | string | number, days: number): Date {
  return dayjs(value).add(days, "day").toDate();
}

/**
 * 날짜에 월수 더하기
 */
export function addMonths(value: Date | string | number, months: number): Date {
  return dayjs(value).add(months, "month").toDate();
}
