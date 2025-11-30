/**
 * SoftOne Design System - Schedule Page
 * 작성: SoftOne Frontend Team
 * 설명: 일정 관리 메인 페이지.
 *      CalendarWrapper와 Modal을 활용한 일정 조회 패턴입니다.
 *
 * SchedulePage Component
 * - PageHeader + CalendarWrapper + Modal 조합
 * - 이벤트 클릭 시 상세 정보 모달 표시
 */

import React, { useState, useMemo } from "react";
import { Calendar, MapPin, Clock, Tag, User } from "lucide-react";

import { CalendarWrapper, type ScheduleEvent } from "@core/components/ui/CalendarWrapper";
import { Modal } from "@core/components/ui/Modal";
import { Badge } from "@core/components/ui/Badge";
import { Button } from "@core/components/ui/Button";
import { PageHeader } from "@core/components/layout/PageHeader";
import { formatDateTime, formatDate } from "@core/utils/dateUtils";

import { useScheduleEventsQuery } from "../api/scheduleApi";
import { SCHEDULE_CATEGORY_META } from "../model/schedule.types";

// ========================================
// SchedulePage Component
// ========================================

export const SchedulePage: React.FC = () => {
  const { data, isLoading } = useScheduleEventsQuery();
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 이벤트 클릭 핸들러
  const handleEventClick = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // 캘린더용 이벤트 변환
  const calendarEvents = useMemo<ScheduleEvent[]>(() => {
    if (!data?.events) return [];

    return data.events.map((event) => ({
      ...event,
      extendedProps: {
        description: event.description,
        location: event.location,
        category: event.category,
        createdBy: event.createdBy,
      },
    }));
  }, [data?.events]);

  // 카테고리 뱃지 렌더링
  const getCategoryBadge = (category?: string) => {
    if (!category) return null;
    const meta = SCHEDULE_CATEGORY_META[category as keyof typeof SCHEDULE_CATEGORY_META];
    if (!meta) return null;

    return (
      <Badge
        variant="neutral"
        style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
      >
        {meta.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="일정 관리"
        subtitle="팀 일정을 조회하고 관리합니다."
        icon={<Calendar className="w-5 h-5 text-softone-primary" />}
        actions={
          <Button variant="primary" onClick={() => console.log("일정 추가")}>
            일정 추가
          </Button>
        }
      />

      {/* Calendar */}
      <CalendarWrapper
        events={calendarEvents}
        onEventClick={handleEventClick}
        loading={isLoading}
        height={700}
      />

      {/* Event Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedEvent?.title || "일정 상세"}
        size="md"
        footer={
          <>
            <Button variant="outline" onClick={handleCloseModal}>
              닫기
            </Button>
            <Button variant="primary" onClick={() => console.log("편집")}>
              편집
            </Button>
          </>
        }
      >
        {selectedEvent && (
          <div className="space-y-4">
            {/* Category */}
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-softone-text-muted" />
              {getCategoryBadge(selectedEvent.category)}
            </div>

            {/* Time */}
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-softone-text-muted mt-0.5" />
              <div>
                {selectedEvent.allDay ? (
                  <span className="text-softone-text">
                    {formatDate(selectedEvent.start)} (종일)
                  </span>
                ) : (
                  <div className="text-softone-text">
                    <div>{formatDateTime(selectedEvent.start)}</div>
                    {selectedEvent.end && (
                      <div className="text-softone-text-muted">
                        ~ {formatDateTime(selectedEvent.end)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            {selectedEvent.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-softone-text-muted" />
                <span className="text-softone-text">{selectedEvent.location}</span>
              </div>
            )}

            {/* Created By */}
            {selectedEvent.createdBy && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-softone-text-muted" />
                <span className="text-softone-text-secondary">
                  {selectedEvent.createdBy}
                </span>
              </div>
            )}

            {/* Description */}
            {selectedEvent.description && (
              <div className="pt-4 border-t border-softone-border">
                <h4 className="text-sm font-medium text-softone-text mb-2">
                  설명
                </h4>
                <p className="text-sm text-softone-text-secondary whitespace-pre-wrap">
                  {selectedEvent.description}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(SCHEDULE_CATEGORY_META).map(([key, meta]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: meta.color }}
            />
            <span className="text-sm text-softone-text-secondary">
              {meta.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

SchedulePage.displayName = "SchedulePage";

export default SchedulePage;

