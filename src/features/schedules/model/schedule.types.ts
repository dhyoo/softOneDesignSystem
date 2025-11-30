/**
 * SoftOne Design System - Schedule Types
 * 작성: SoftOne Frontend Team
 * 설명: 일정 관리 도메인 타입 정의.
 *      CalendarWrapper와 함께 사용됩니다.
 *
 * Schedule Types
 * - ScheduleEvent: 일정 이벤트
 * - ScheduleCategory: 일정 카테고리
 */

// ========================================
// Schedule Event
// ========================================

export interface ScheduleEvent {
  /** 이벤트 ID */
  id: string;
  /** 이벤트 제목 */
  title: string;
  /** 시작 일시 (ISO 8601) */
  start: string;
  /** 종료 일시 (ISO 8601) */
  end?: string;
  /** 종일 이벤트 여부 */
  allDay?: boolean;
  /** 이벤트 설명 */
  description?: string;
  /** 장소 */
  location?: string;
  /** 카테고리 */
  category?: ScheduleCategory;
  /** 배경 색상 */
  backgroundColor?: string;
  /** 테두리 색상 */
  borderColor?: string;
  /** 텍스트 색상 */
  textColor?: string;
  /** 생성자 ID */
  createdBy?: string;
  /** 생성일 */
  createdAt?: string;
  /** 수정일 */
  updatedAt?: string;
}

// ========================================
// Schedule Category
// ========================================

export type ScheduleCategory =
  | "MEETING"
  | "TASK"
  | "EVENT"
  | "REMINDER"
  | "HOLIDAY"
  | "OTHER";

export const SCHEDULE_CATEGORY_META: Record<
  ScheduleCategory,
  { label: string; color: string }
> = {
  MEETING: { label: "회의", color: "#3B82F6" }, // blue
  TASK: { label: "업무", color: "#10B981" }, // green
  EVENT: { label: "이벤트", color: "#F59E0B" }, // amber
  REMINDER: { label: "알림", color: "#8B5CF6" }, // violet
  HOLIDAY: { label: "휴일", color: "#EF4444" }, // red
  OTHER: { label: "기타", color: "#6B7280" }, // gray
};

// ========================================
// API Request/Response Types
// ========================================

export interface ScheduleListParams {
  start?: string;
  end?: string;
  category?: ScheduleCategory;
}

export interface ScheduleListResponse {
  events: ScheduleEvent[];
  total: number;
}

export interface ScheduleFormData {
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  description?: string;
  location?: string;
  category: ScheduleCategory;
}
