/**
 * SoftOne Design System - Grade Utilities
 * 작성: SoftOne Frontend Team
 *
 * 직급(Grade) 기반 권한 검사 유틸리티 함수들입니다.
 * 직급 순위에 따라 액션 실행 가능 여부를 판단합니다.
 *
 * 직급 순위: EXECUTIVE > TEAM_LEAD > SENIOR > JUNIOR > INTERN
 */

import { Grade, GRADE_RANK, GRADES } from "../auth/role.types";

// ========================================
// 직급 비교 함수
// ========================================

/**
 * 두 직급을 비교합니다.
 * @returns 양수: grade1 > grade2, 음수: grade1 < grade2, 0: 동일
 */
export function compareGrades(
  grade1: Grade | null,
  grade2: Grade | null
): number {
  const rank1 = grade1 ? GRADE_RANK[grade1] : 0;
  const rank2 = grade2 ? GRADE_RANK[grade2] : 0;
  return rank1 - rank2;
}

/**
 * 주어진 직급이 최소 요구 직급 이상인지 확인합니다.
 */
export function meetsMinimumGrade(
  grade: Grade | null,
  minRequiredGrade: Grade
): boolean {
  if (!grade) return false;
  return GRADE_RANK[grade] >= GRADE_RANK[minRequiredGrade];
}

/**
 * 액션이 직급에 의해 비활성화되어야 하는지 확인합니다.
 * minRequiredGrade보다 낮으면 true를 반환합니다.
 */
export function isActionDisabledByGrade(
  grade: Grade | null,
  minRequiredGrade: Grade
): boolean {
  return !meetsMinimumGrade(grade, minRequiredGrade);
}

// ========================================
// 직급 정보 함수
// ========================================

/**
 * 직급의 한글 라벨을 반환합니다.
 */
export function getGradeLabel(grade: Grade | null): string {
  if (!grade) return "미지정";

  const labels: Record<Grade, string> = {
    EXECUTIVE: "임원",
    TEAM_LEAD: "팀장",
    SENIOR: "선임",
    JUNIOR: "주니어",
    INTERN: "인턴",
  };

  return labels[grade] || grade;
}

/**
 * 직급의 순위를 반환합니다.
 */
export function getGradeRank(grade: Grade | null): number {
  if (!grade) return 0;
  return GRADE_RANK[grade];
}

/**
 * 모든 직급 목록을 순위 순으로 반환합니다.
 */
export function getGradesSortedByRank(): Grade[] {
  return [...GRADES].sort((a, b) => GRADE_RANK[b] - GRADE_RANK[a]);
}

/**
 * 직급 선택을 위한 옵션 배열을 반환합니다.
 */
export function getGradeOptions(): {
  value: Grade;
  label: string;
  rank: number;
}[] {
  return getGradesSortedByRank().map((grade) => ({
    value: grade,
    label: getGradeLabel(grade),
    rank: GRADE_RANK[grade],
  }));
}

// ========================================
// 직급 기반 권한 헬퍼
// ========================================

/**
 * 특정 직급 이상의 사용자만 볼 수 있는 콘텐츠인지 확인합니다.
 */
export function canViewContent(
  userGrade: Grade | null,
  minViewGrade: Grade
): boolean {
  return meetsMinimumGrade(userGrade, minViewGrade);
}

/**
 * 특정 직급 이상의 사용자만 수정할 수 있는지 확인합니다.
 */
export function canEditContent(
  userGrade: Grade | null,
  minEditGrade: Grade
): boolean {
  return meetsMinimumGrade(userGrade, minEditGrade);
}

/**
 * 특정 직급 이상의 사용자만 삭제할 수 있는지 확인합니다.
 */
export function canDeleteContent(
  userGrade: Grade | null,
  minDeleteGrade: Grade
): boolean {
  return meetsMinimumGrade(userGrade, minDeleteGrade);
}
