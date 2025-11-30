/**
 * SoftOne Design System(SDS) - Enum Utility
 * 작성: SoftOne Frontend Team
 * 설명: Enum ↔ SelectOption 변환 및 메타데이터 관리 유틸리티.
 *      Badge, Select, Table 등에서 상태값을 일관되게 표시하기 위해 사용합니다.
 *      테스트/스토리 문서화를 통한 엔터프라이즈 품질 보장.
 */

/**
 * Enum 메타데이터 타입
 */
export interface EnumMeta {
  value: string;
  label: string;
  color?: "primary" | "success" | "warning" | "danger" | "neutral" | "info";
  icon?: string;
}

/**
 * Enum Map 타입 (key: value, value: EnumMeta)
 */
export type EnumMap = Record<string, EnumMeta>;

/**
 * Enum Map에서 메타데이터 가져오기
 *
 * @param enumMap - Enum Map 객체
 * @param value - 조회할 값
 * @returns EnumMeta 또는 기본값
 *
 * @example
 * const status = getEnumMeta(USER_STATUS, 'ACTIVE');
 * // { value: 'ACTIVE', label: '활성', color: 'success' }
 */
export function getEnumMeta(
  enumMap: EnumMap,
  value: string | null | undefined
): EnumMeta {
  if (!value || !enumMap[value]) {
    return {
      value: value ?? "",
      label: value ?? "-",
      color: "neutral",
    };
  }

  return enumMap[value];
}

/**
 * Enum Map에서 label만 가져오기
 */
export function getEnumLabel(
  enumMap: EnumMap,
  value: string | null | undefined
): string {
  return getEnumMeta(enumMap, value).label;
}

/**
 * Enum Map에서 color만 가져오기
 */
export function getEnumColor(
  enumMap: EnumMap,
  value: string | null | undefined
): EnumMeta["color"] {
  return getEnumMeta(enumMap, value).color;
}

/**
 * Enum Map을 Select Options 배열로 변환
 *
 * @param enumMap - Enum Map 객체
 * @returns SelectOption 배열
 *
 * @example
 * enumMapToOptions(USER_STATUS)
 * // [{ value: 'ACTIVE', label: '활성' }, { value: 'INACTIVE', label: '비활성' }, ...]
 */
export function enumMapToOptions(
  enumMap: EnumMap
): Array<{ value: string; label: string }> {
  return Object.values(enumMap).map(({ value, label }) => ({ value, label }));
}

/**
 * Enum 값 배열을 Enum Map으로 변환
 *
 * @param values - Enum 값 배열
 * @param labelMap - 값 → 라벨 매핑 객체
 * @param colorMap - 값 → 색상 매핑 객체 (선택)
 */
export function createEnumMap(
  values: string[],
  labelMap: Record<string, string>,
  colorMap?: Record<string, EnumMeta["color"]>
): EnumMap {
  const enumMap: EnumMap = {};

  for (const value of values) {
    enumMap[value] = {
      value,
      label: labelMap[value] ?? value,
      color: colorMap?.[value] ?? "neutral",
    };
  }

  return enumMap;
}

// ========================================
// 공통 Enum Map 정의
// ========================================

/**
 * 사용자 상태
 */
export const USER_STATUS: EnumMap = {
  ACTIVE: {
    value: "ACTIVE",
    label: "활성",
    color: "success",
  },
  INACTIVE: {
    value: "INACTIVE",
    label: "비활성",
    color: "danger",
  },
  PENDING: {
    value: "PENDING",
    label: "대기",
    color: "warning",
  },
  SUSPENDED: {
    value: "SUSPENDED",
    label: "정지",
    color: "neutral",
  },
};

/**
 * 역할
 */
export const USER_ROLE: EnumMap = {
  ADMIN: {
    value: "ADMIN",
    label: "관리자",
    color: "primary",
  },
  MANAGER: {
    value: "MANAGER",
    label: "매니저",
    color: "info",
  },
  USER: {
    value: "USER",
    label: "일반 사용자",
    color: "neutral",
  },
};

/**
 * 공통 상태 (Yes/No)
 */
export const YES_NO: EnumMap = {
  Y: {
    value: "Y",
    label: "예",
    color: "success",
  },
  N: {
    value: "N",
    label: "아니오",
    color: "neutral",
  },
};

/**
 * 사용 여부
 */
export const USE_YN: EnumMap = {
  Y: {
    value: "Y",
    label: "사용",
    color: "success",
  },
  N: {
    value: "N",
    label: "미사용",
    color: "neutral",
  },
};

/**
 * 처리 상태
 */
export const PROCESS_STATUS: EnumMap = {
  PENDING: {
    value: "PENDING",
    label: "대기",
    color: "warning",
  },
  IN_PROGRESS: {
    value: "IN_PROGRESS",
    label: "진행중",
    color: "info",
  },
  COMPLETED: {
    value: "COMPLETED",
    label: "완료",
    color: "success",
  },
  FAILED: {
    value: "FAILED",
    label: "실패",
    color: "danger",
  },
  CANCELLED: {
    value: "CANCELLED",
    label: "취소",
    color: "neutral",
  },
};
