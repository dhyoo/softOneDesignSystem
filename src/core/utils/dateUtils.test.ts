/**
 * SoftOne Design System(SDS) - dateUtils 테스트
 * 작성: SoftOne Frontend Team
 * 설명: 날짜 유틸리티 함수의 단위 테스트.
 *      테스트/스토리 문서화를 통한 엔터프라이즈 품질 보장.
 */

import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatRelative,
  formatDateRange,
  isValidDate,
  isSameDay,
  isToday,
} from "./dateUtils";

describe("dateUtils", () => {
  // ========================================
  // formatDate
  // ========================================
  describe("formatDate", () => {
    it("Date 객체를 기본 형식(YYYY-MM-DD)으로 포맷합니다", () => {
      const date = new Date(2024, 0, 15); // 2024-01-15
      expect(formatDate(date)).toBe("2024-01-15");
    });

    it("문자열 날짜를 포맷합니다", () => {
      expect(formatDate("2024-01-15")).toBe("2024-01-15");
    });

    it("timestamp를 포맷합니다", () => {
      const timestamp = new Date(2024, 0, 15).getTime();
      expect(formatDate(timestamp)).toBe("2024-01-15");
    });

    it("커스텀 형식으로 포맷합니다", () => {
      const date = new Date(2024, 0, 15);
      expect(formatDate(date, "YYYY년 MM월 DD일")).toBe("2024년 01월 15일");
    });

    it("null 값은 빈 문자열을 반환합니다", () => {
      expect(formatDate(null)).toBe("");
    });

    it("undefined 값은 빈 문자열을 반환합니다", () => {
      expect(formatDate(undefined)).toBe("");
    });

    it("유효하지 않은 날짜는 빈 문자열을 반환합니다", () => {
      expect(formatDate("invalid-date")).toBe("");
    });
  });

  // ========================================
  // formatDateTime
  // ========================================
  describe("formatDateTime", () => {
    it("Date 객체를 날짜+시간 형식(YYYY-MM-DD HH:mm)으로 포맷합니다", () => {
      const date = new Date(2024, 0, 15, 14, 30);
      expect(formatDateTime(date)).toBe("2024-01-15 14:30");
    });

    it("ISO 문자열을 포맷합니다", () => {
      expect(formatDateTime("2024-01-15T14:30:00")).toBe("2024-01-15 14:30");
    });

    it("커스텀 형식으로 포맷합니다", () => {
      const date = new Date(2024, 0, 15, 14, 30);
      expect(formatDateTime(date, "YYYY.MM.DD HH:mm:ss")).toBe(
        "2024.01.15 14:30:00"
      );
    });

    it("null 값은 빈 문자열을 반환합니다", () => {
      expect(formatDateTime(null)).toBe("");
    });
  });

  // ========================================
  // formatRelative
  // ========================================
  describe("formatRelative", () => {
    it("1분 미만은 '방금 전'을 반환합니다", () => {
      const now = Date.now();
      expect(formatRelative(now - 30000)).toBe("방금 전");
    });

    it("1분 이상은 'N분 전'을 반환합니다", () => {
      const now = Date.now();
      expect(formatRelative(now - 5 * 60 * 1000)).toBe("5분 전");
    });

    it("1시간 이상은 'N시간 전'을 반환합니다", () => {
      const now = Date.now();
      expect(formatRelative(now - 3 * 60 * 60 * 1000)).toBe("3시간 전");
    });

    it("1일 이상은 'N일 전'을 반환합니다", () => {
      const now = Date.now();
      expect(formatRelative(now - 2 * 24 * 60 * 60 * 1000)).toBe("2일 전");
    });

    it("null 값은 빈 문자열을 반환합니다", () => {
      expect(formatRelative(null)).toBe("");
    });
  });

  // ========================================
  // formatDateRange
  // ========================================
  describe("formatDateRange", () => {
    it("날짜 범위를 포맷합니다", () => {
      const start = new Date(2024, 0, 1);
      const end = new Date(2024, 0, 31);
      expect(formatDateRange(start, end)).toBe("2024.01.01 ~ 2024.01.31");
    });

    it("시작 날짜만 있으면 시작 날짜만 반환합니다", () => {
      const start = new Date(2024, 0, 1);
      expect(formatDateRange(start, null)).toBe("2024.01.01");
    });

    it("종료 날짜만 있으면 종료 날짜만 반환합니다", () => {
      const end = new Date(2024, 0, 31);
      expect(formatDateRange(null, end)).toBe("2024.01.31");
    });

    it("둘 다 없으면 빈 문자열을 반환합니다", () => {
      expect(formatDateRange(null, null)).toBe("");
    });
  });

  // ========================================
  // isValidDate
  // ========================================
  describe("isValidDate", () => {
    it("유효한 Date 객체는 true를 반환합니다", () => {
      expect(isValidDate(new Date())).toBe(true);
    });

    it("유효한 문자열 날짜는 true를 반환합니다", () => {
      expect(isValidDate("2024-01-15")).toBe(true);
    });

    it("유효한 timestamp는 true를 반환합니다", () => {
      expect(isValidDate(Date.now())).toBe(true);
    });

    it("유효하지 않은 문자열은 false를 반환합니다", () => {
      expect(isValidDate("invalid")).toBe(false);
    });

    it("null은 false를 반환합니다", () => {
      expect(isValidDate(null)).toBe(false);
    });

    it("undefined는 false를 반환합니다", () => {
      expect(isValidDate(undefined)).toBe(false);
    });
  });

  // ========================================
  // isSameDay
  // ========================================
  describe("isSameDay", () => {
    it("같은 날짜는 true를 반환합니다", () => {
      const date1 = new Date(2024, 0, 15, 10, 0);
      const date2 = new Date(2024, 0, 15, 20, 0);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it("다른 날짜는 false를 반환합니다", () => {
      const date1 = new Date(2024, 0, 15);
      const date2 = new Date(2024, 0, 16);
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  // ========================================
  // isToday
  // ========================================
  describe("isToday", () => {
    it("오늘 날짜는 true를 반환합니다", () => {
      expect(isToday(new Date())).toBe(true);
    });

    it("어제 날짜는 false를 반환합니다", () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });
  });
});
