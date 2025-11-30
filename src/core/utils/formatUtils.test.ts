/**
 * SoftOne Design System(SDS) - formatUtils 테스트
 * 작성: SoftOne Frontend Team
 * 설명: 포맷 유틸리티 함수의 단위 테스트.
 *      테스트/스토리 문서화를 통한 엔터프라이즈 품질 보장.
 */

import { describe, it, expect } from "vitest";
import {
  formatNumberWithComma,
  formatCurrency,
  formatPhoneNumber,
  formatBusinessNumber,
  formatPercent,
  formatFileSize,
  truncateText,
} from "./formatUtils";

describe("formatUtils", () => {
  // ========================================
  // formatNumberWithComma
  // ========================================
  describe("formatNumberWithComma", () => {
    it("숫자에 천단위 콤마를 추가합니다", () => {
      expect(formatNumberWithComma(1234567)).toBe("1,234,567");
    });

    it("문자열 숫자도 처리합니다", () => {
      expect(formatNumberWithComma("1234567")).toBe("1,234,567");
    });

    it("소수점이 있는 숫자를 처리합니다", () => {
      expect(formatNumberWithComma(1234567.89)).toBe("1,234,567.89");
    });

    it("0을 처리합니다", () => {
      expect(formatNumberWithComma(0)).toBe("0");
    });

    it("음수를 처리합니다", () => {
      expect(formatNumberWithComma(-1234567)).toBe("-1,234,567");
    });

    it("null은 빈 문자열을 반환합니다", () => {
      expect(formatNumberWithComma(null)).toBe("");
    });

    it("undefined는 빈 문자열을 반환합니다", () => {
      expect(formatNumberWithComma(undefined)).toBe("");
    });

    it("빈 문자열은 빈 문자열을 반환합니다", () => {
      expect(formatNumberWithComma("")).toBe("");
    });

    it("숫자가 아닌 문자열은 빈 문자열을 반환합니다", () => {
      expect(formatNumberWithComma("abc")).toBe("");
    });
  });

  // ========================================
  // formatCurrency
  // ========================================
  describe("formatCurrency", () => {
    it("기본값으로 '원'을 suffix로 붙입니다", () => {
      expect(formatCurrency(10000)).toBe("10,000원");
    });

    it("달러 prefix를 붙입니다", () => {
      expect(formatCurrency(10000, "$", "prefix")).toBe("$10,000");
    });

    it("커스텀 통화 suffix를 붙입니다", () => {
      expect(formatCurrency(10000, "₩")).toBe("10,000₩");
    });

    it("null은 빈 문자열을 반환합니다", () => {
      expect(formatCurrency(null)).toBe("");
    });

    it("0도 정상 처리합니다", () => {
      expect(formatCurrency(0)).toBe("0원");
    });
  });

  // ========================================
  // formatPhoneNumber
  // ========================================
  describe("formatPhoneNumber", () => {
    it("휴대폰 번호(11자리)를 포맷합니다", () => {
      expect(formatPhoneNumber("01012345678")).toBe("010-1234-5678");
    });

    it("휴대폰 번호(10자리)를 포맷합니다", () => {
      expect(formatPhoneNumber("0101234567")).toBe("010-123-4567");
    });

    it("서울 번호(10자리)를 포맷합니다", () => {
      expect(formatPhoneNumber("0212345678")).toBe("02-1234-5678");
    });

    it("서울 번호(9자리)를 포맷합니다", () => {
      expect(formatPhoneNumber("021234567")).toBe("02-123-4567");
    });

    it("지역번호(11자리)를 포맷합니다", () => {
      expect(formatPhoneNumber("03112345678")).toBe("031-1234-5678");
    });

    it("null은 빈 문자열을 반환합니다", () => {
      expect(formatPhoneNumber(null)).toBe("");
    });

    it("undefined는 빈 문자열을 반환합니다", () => {
      expect(formatPhoneNumber(undefined)).toBe("");
    });
  });

  // ========================================
  // formatBusinessNumber
  // ========================================
  describe("formatBusinessNumber", () => {
    it("사업자등록번호를 포맷합니다", () => {
      expect(formatBusinessNumber("1234567890")).toBe("123-45-67890");
    });

    it("10자리가 아니면 원본을 반환합니다", () => {
      expect(formatBusinessNumber("12345678")).toBe("12345678");
    });

    it("null은 빈 문자열을 반환합니다", () => {
      expect(formatBusinessNumber(null)).toBe("");
    });
  });

  // ========================================
  // formatPercent
  // ========================================
  describe("formatPercent", () => {
    it("소수를 퍼센트로 변환합니다 (0~1)", () => {
      expect(formatPercent(0.1234)).toBe("12.34%");
    });

    it("정수 퍼센트를 포맷합니다 (0~100)", () => {
      expect(formatPercent(12.34, 2, false)).toBe("12.34%");
    });

    it("소수점 자릿수를 조절합니다", () => {
      expect(formatPercent(0.1234, 1)).toBe("12.3%");
    });

    it("null은 빈 문자열을 반환합니다", () => {
      expect(formatPercent(null)).toBe("");
    });
  });

  // ========================================
  // formatFileSize
  // ========================================
  describe("formatFileSize", () => {
    it("바이트를 포맷합니다", () => {
      expect(formatFileSize(500)).toBe("500 B");
    });

    it("킬로바이트를 포맷합니다", () => {
      expect(formatFileSize(1024)).toBe("1 KB");
    });

    it("메가바이트를 포맷합니다", () => {
      expect(formatFileSize(1048576)).toBe("1 MB");
    });

    it("기가바이트를 포맷합니다", () => {
      expect(formatFileSize(1073741824)).toBe("1 GB");
    });

    it("0은 '0 B'를 반환합니다", () => {
      expect(formatFileSize(0)).toBe("0 B");
    });

    it("null은 '0 B'를 반환합니다", () => {
      expect(formatFileSize(null)).toBe("0 B");
    });
  });

  // ========================================
  // truncateText
  // ========================================
  describe("truncateText", () => {
    it("긴 텍스트를 자르고 말줄임을 추가합니다", () => {
      expect(truncateText("Hello World", 5)).toBe("Hello...");
    });

    it("짧은 텍스트는 그대로 반환합니다", () => {
      expect(truncateText("Hello", 10)).toBe("Hello");
    });

    it("커스텀 suffix를 사용합니다", () => {
      expect(truncateText("Hello World", 5, "…")).toBe("Hello…");
    });

    it("null은 빈 문자열을 반환합니다", () => {
      expect(truncateText(null, 5)).toBe("");
    });

    it("undefined는 빈 문자열을 반환합니다", () => {
      expect(truncateText(undefined, 5)).toBe("");
    });
  });
});

