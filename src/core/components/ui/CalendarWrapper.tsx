/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: FullCalendar React 래핑 컴포넌트.
 *      일정 관리 기능을 위한 재사용 가능한 캘린더 패턴입니다.
 *
 * CalendarWrapper Component
 * - FullCalendar 기본 설정 캡슐화
 * - SDS 테마에 맞는 스타일링
 * - 이벤트 클릭/선택 콜백
 */

import React, { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg, DateSelectArg } from "@fullcalendar/core";
import { cn } from "../../utils/classUtils";

// ========================================
// Types
// ========================================

export interface ScheduleEvent {
  /** 이벤트 ID */
  id: string;
  /** 이벤트 제목 */
  title: string;
  /** 시작 일시 */
  start: string | Date;
  /** 종료 일시 */
  end?: string | Date;
  /** 종일 이벤트 여부 */
  allDay?: boolean;
  /** 배경 색상 */
  backgroundColor?: string;
  /** 테두리 색상 */
  borderColor?: string;
  /** 텍스트 색상 */
  textColor?: string;
  /** 이벤트 설명 */
  description?: string;
  /** 장소 */
  location?: string;
  /** 카테고리 */
  category?: string;
  /** 생성자 */
  createdBy?: string;
  /** 추가 데이터 */
  extendedProps?: Record<string, unknown>;
}

export interface CalendarWrapperProps {
  /** 이벤트 목록 */
  events: ScheduleEvent[];
  /** 이벤트 클릭 핸들러 */
  onEventClick?: (event: ScheduleEvent) => void;
  /** 날짜 선택 핸들러 */
  onDateSelect?: (start: Date, end: Date) => void;
  /** 초기 보기 모드 */
  initialView?: "dayGridMonth" | "timeGridWeek" | "timeGridDay";
  /** 헤더 툴바 표시 여부 */
  showHeader?: boolean;
  /** 높이 */
  height?: string | number;
  /** 로딩 상태 */
  loading?: boolean;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// CalendarWrapper Component
// ========================================

export const CalendarWrapper: React.FC<CalendarWrapperProps> = ({
  events,
  onEventClick,
  onDateSelect,
  initialView = "dayGridMonth",
  showHeader = true,
  height = "auto",
  loading = false,
  className,
}) => {
  const calendarRef = useRef<FullCalendar>(null);

  // 이벤트 클릭 핸들러
  const handleEventClick = (info: EventClickArg) => {
    if (onEventClick) {
      const event: ScheduleEvent = {
        id: info.event.id,
        title: info.event.title,
        start: info.event.start ?? new Date(),
        end: info.event.end ?? undefined,
        allDay: info.event.allDay,
        backgroundColor: info.event.backgroundColor,
        borderColor: info.event.borderColor,
        textColor: info.event.textColor,
        description: info.event.extendedProps?.description as string,
        extendedProps: info.event.extendedProps as Record<string, unknown>,
      };
      onEventClick(event);
    }
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (info: DateSelectArg) => {
    if (onDateSelect) {
      onDateSelect(info.start, info.end);
    }
  };

  return (
    <div
      className={cn(
        "sds-calendar bg-softone-surface rounded-lg border border-softone-border overflow-hidden",
        loading && "opacity-50 pointer-events-none",
        className
      )}
    >
      {/* Custom Calendar Styles */}
      <style>{`
        .sds-calendar .fc {
          font-family: var(--sds-font-family, inherit);
        }

        .sds-calendar .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--sds-color-text);
        }

        .sds-calendar .fc-button {
          background-color: var(--sds-color-surface);
          border-color: var(--sds-color-border);
          color: var(--sds-color-text);
          font-weight: 500;
          padding: 0.5rem 1rem;
          transition: all 0.2s;
        }

        .sds-calendar .fc-button:hover {
          background-color: var(--sds-color-surface-hover);
          border-color: var(--sds-color-border-hover);
        }

        .sds-calendar .fc-button-primary:not(:disabled).fc-button-active,
        .sds-calendar .fc-button-primary:not(:disabled):active {
          background-color: var(--sds-color-primary);
          border-color: var(--sds-color-primary);
          color: white;
        }

        .sds-calendar .fc-daygrid-day-number,
        .sds-calendar .fc-col-header-cell-cushion {
          color: var(--sds-color-text);
          text-decoration: none;
        }

        .sds-calendar .fc-daygrid-day.fc-day-today {
          background-color: var(--sds-color-primary-light) !important;
        }

        .sds-calendar .fc-daygrid-day-top {
          padding: 0.5rem;
        }

        .sds-calendar .fc-event {
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .sds-calendar .fc-event:hover {
          opacity: 0.85;
        }

        .sds-calendar .fc-daygrid-event-dot {
          display: none;
        }

        .sds-calendar .fc-h-event {
          border: none;
        }

        .sds-calendar .fc-scrollgrid {
          border-color: var(--sds-color-border);
        }

        .sds-calendar .fc-scrollgrid td,
        .sds-calendar .fc-scrollgrid th {
          border-color: var(--sds-color-border);
        }

        .sds-calendar .fc-col-header {
          background-color: var(--sds-color-bg);
        }

        .sds-calendar .fc-col-header-cell {
          padding: 0.75rem;
          font-weight: 600;
          color: var(--sds-color-text-secondary);
        }

        .sds-calendar .fc-toolbar {
          padding: 1rem;
          margin-bottom: 0 !important;
          border-bottom: 1px solid var(--sds-color-border);
        }

        .sds-calendar .fc-view-harness {
          background-color: var(--sds-color-surface);
        }
      `}</style>

      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        events={events}
        eventClick={handleEventClick}
        select={handleDateSelect}
        selectable={!!onDateSelect}
        height={height}
        locale="ko"
        headerToolbar={
          showHeader
            ? {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }
            : false
        }
        buttonText={{
          today: "오늘",
          month: "월",
          week: "주",
          day: "일",
        }}
        dayMaxEvents={3}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
        slotLabelFormat={{
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false,
        }}
        allDayText="종일"
        noEventsText="일정이 없습니다"
      />
    </div>
  );
};

CalendarWrapper.displayName = "CalendarWrapper";
