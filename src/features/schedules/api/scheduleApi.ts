/**
 * SoftOne Design System - Schedule API
 * 작성: SoftOne Frontend Team
 * 설명: 일정 관리 API 및 TanStack Query 훅.
 *      Mock 데이터로 실제 API 동작을 시뮬레이션합니다.
 *
 * Schedule API
 * - useScheduleEventsQuery: 일정 목록 조회
 */

import { useQuery } from "@tanstack/react-query";
import type {
  ScheduleEvent,
  ScheduleListParams,
  ScheduleListResponse,
} from "../model/schedule.types";

// ========================================
// Mock Data
// ========================================

const MOCK_EVENTS: ScheduleEvent[] = [
  {
    id: "evt-001",
    title: "주간 팀 회의",
    start: "2024-12-02T10:00:00",
    end: "2024-12-02T11:00:00",
    description: "주간 업무 현황 공유 및 이슈 논의",
    location: "회의실 A",
    category: "MEETING",
    backgroundColor: "#3B82F6",
    createdBy: "admin",
    createdAt: "2024-11-25T09:00:00",
  },
  {
    id: "evt-002",
    title: "프로젝트 마감",
    start: "2024-12-05",
    allDay: true,
    description: "SDS Phase 1 마감",
    category: "TASK",
    backgroundColor: "#10B981",
    createdBy: "manager",
    createdAt: "2024-11-20T14:00:00",
  },
  {
    id: "evt-003",
    title: "연말 워크샵",
    start: "2024-12-20T09:00:00",
    end: "2024-12-20T18:00:00",
    description: "2024년 회고 및 2025년 계획 수립",
    location: "외부 연수원",
    category: "EVENT",
    backgroundColor: "#F59E0B",
    createdBy: "admin",
    createdAt: "2024-11-15T10:00:00",
  },
  {
    id: "evt-004",
    title: "크리스마스",
    start: "2024-12-25",
    allDay: true,
    category: "HOLIDAY",
    backgroundColor: "#EF4444",
    createdAt: "2024-01-01T00:00:00",
  },
  {
    id: "evt-005",
    title: "코드 리뷰",
    start: "2024-12-03T14:00:00",
    end: "2024-12-03T15:00:00",
    description: "Feature 브랜치 코드 리뷰",
    location: "온라인",
    category: "MEETING",
    backgroundColor: "#3B82F6",
    createdBy: "developer",
    createdAt: "2024-11-28T09:00:00",
  },
  {
    id: "evt-006",
    title: "보고서 제출",
    start: "2024-12-10",
    allDay: true,
    description: "월간 실적 보고서 제출",
    category: "REMINDER",
    backgroundColor: "#8B5CF6",
    createdBy: "admin",
    createdAt: "2024-11-25T11:00:00",
  },
  {
    id: "evt-007",
    title: "디자인 리뷰",
    start: "2024-12-04T11:00:00",
    end: "2024-12-04T12:00:00",
    description: "새 기능 UI/UX 디자인 검토",
    location: "회의실 B",
    category: "MEETING",
    backgroundColor: "#3B82F6",
    createdBy: "designer",
    createdAt: "2024-11-27T15:00:00",
  },
  {
    id: "evt-008",
    title: "신년",
    start: "2025-01-01",
    allDay: true,
    category: "HOLIDAY",
    backgroundColor: "#EF4444",
    createdAt: "2024-01-01T00:00:00",
  },
  {
    id: "evt-009",
    title: "스프린트 회고",
    start: "2024-12-13T16:00:00",
    end: "2024-12-13T17:00:00",
    description: "스프린트 5 회고 미팅",
    location: "회의실 A",
    category: "MEETING",
    backgroundColor: "#3B82F6",
    createdBy: "manager",
    createdAt: "2024-12-01T09:00:00",
  },
  {
    id: "evt-010",
    title: "서버 점검",
    start: "2024-12-15T02:00:00",
    end: "2024-12-15T06:00:00",
    description: "정기 서버 점검 및 업데이트",
    category: "TASK",
    backgroundColor: "#10B981",
    createdBy: "admin",
    createdAt: "2024-12-05T10:00:00",
  },
];

// ========================================
// API Functions
// ========================================

/**
 * 일정 목록 조회
 */
export const getScheduleEvents = async (
  params?: ScheduleListParams
): Promise<ScheduleListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let events = [...MOCK_EVENTS];

      // 카테고리 필터
      if (params?.category) {
        events = events.filter((e) => e.category === params.category);
      }

      // 날짜 범위 필터 (간단한 구현)
      if (params?.start && params?.end) {
        const startDate = new Date(params.start);
        const endDate = new Date(params.end);
        events = events.filter((e) => {
          const eventStart = new Date(e.start);
          return eventStart >= startDate && eventStart <= endDate;
        });
      }

      resolve({
        events,
        total: events.length,
      });
    }, 500);
  });
};

/**
 * 일정 상세 조회
 */
export const getScheduleEventById = async (
  id: string
): Promise<ScheduleEvent | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const event = MOCK_EVENTS.find((e) => e.id === id);
      resolve(event || null);
    }, 300);
  });
};

// ========================================
// Query Keys
// ========================================

export const SCHEDULE_QUERY_KEYS = {
  all: ["schedules"] as const,
  list: (params?: ScheduleListParams) =>
    [...SCHEDULE_QUERY_KEYS.all, "list", params] as const,
  detail: (id: string) => [...SCHEDULE_QUERY_KEYS.all, "detail", id] as const,
};

// ========================================
// TanStack Query Hooks
// ========================================

/**
 * 일정 목록 조회 훅
 */
export const useScheduleEventsQuery = (params?: ScheduleListParams) => {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEYS.list(params),
    queryFn: () => getScheduleEvents(params),
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 일정 상세 조회 훅
 */
export const useScheduleEventDetailQuery = (id: string, enabled = true) => {
  return useQuery({
    queryKey: SCHEDULE_QUERY_KEYS.detail(id),
    queryFn: () => getScheduleEventById(id),
    enabled: enabled && !!id,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

