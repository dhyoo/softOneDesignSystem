/**
 * SoftOne Design System - Endpoint Selector
 * 작성: SoftOne Frontend Team
 *
 * 스펙 기반(Meta-driven) API Playground 지원:
 *   OpenAPI 스펙에서 파싱된 엔드포인트 목록을 표시하고,
 *   사용자가 테스트할 엔드포인트를 선택할 수 있게 함.
 *
 * 중복 업무 감소:
 *   엔드포인트 목록 UI, 메서드별 색상, 검색/필터링을 캡슐화하여
 *   개발자가 직접 구현할 필요 없음.
 */

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Input } from "@core/components/ui/Input";
import { Badge } from "@core/components/ui/Badge";
import { cn } from "@core/utils/classUtils";
import type { ApiOperationMeta } from "@core/utils/openapiUtils";
import {
  HTTP_METHOD_VARIANTS,
  groupOperationsByTag,
} from "../model/openapi.types";

// ========================================
// Types
// ========================================

export interface EndpointSelectorProps {
  /** 엔드포인트 목록 */
  operations: ApiOperationMeta[];
  /** 선택된 Operation ID */
  selectedOperationId?: string;
  /** 선택 변경 핸들러 */
  onChange: (operationId: string) => void;
  /** 태그별 그룹화 여부 */
  groupByTag?: boolean;
  /** 검색 가능 여부 */
  searchable?: boolean;
  /** 최대 높이 */
  maxHeight?: number | string;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// EndpointSelector Component
// ========================================

export const EndpointSelector: React.FC<EndpointSelectorProps> = ({
  operations,
  selectedOperationId,
  onChange,
  groupByTag = true,
  searchable = true,
  maxHeight = 500,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // 검색 필터링
  const filteredOperations = useMemo(() => {
    if (!searchQuery.trim()) return operations;

    const query = searchQuery.toLowerCase();
    return operations.filter(
      (op) =>
        op.path.toLowerCase().includes(query) ||
        op.method.toLowerCase().includes(query) ||
        op.summary?.toLowerCase().includes(query) ||
        op.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [operations, searchQuery]);

  // 태그별 그룹화
  const groupedOperations = useMemo(() => {
    if (!groupByTag) return { "All Endpoints": filteredOperations };
    return groupOperationsByTag(filteredOperations);
  }, [filteredOperations, groupByTag]);

  // 태그 정렬 (default를 마지막으로)
  const sortedTags = useMemo(() => {
    const tags = Object.keys(groupedOperations);
    return tags.sort((a, b) => {
      if (a === "default") return 1;
      if (b === "default") return -1;
      return a.localeCompare(b);
    });
  }, [groupedOperations]);

  return (
    <div className={cn("flex flex-col", className)}>
      {/* 검색 */}
      {searchable && (
        <div className="p-3 border-b border-softone-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-softone-text-muted" />
            <Input
              placeholder="경로, 메서드, 태그로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>
        </div>
      )}

      {/* 엔드포인트 목록 */}
      <div className="flex-1 overflow-y-auto" style={{ maxHeight }}>
        {filteredOperations.length === 0 ? (
          <div className="p-4 text-center text-softone-text-muted">
            {searchQuery ? "검색 결과가 없습니다." : "엔드포인트가 없습니다."}
          </div>
        ) : (
          sortedTags.map((tag) => (
            <div key={tag}>
              {/* 태그 헤더 */}
              {groupByTag && (
                <div className="px-3 py-2 bg-softone-bg text-xs font-semibold text-softone-text-secondary uppercase tracking-wider sticky top-0">
                  {tag} ({groupedOperations[tag].length})
                </div>
              )}

              {/* 엔드포인트 아이템들 */}
              {groupedOperations[tag].map((operation) => (
                <button
                  key={operation.id}
                  type="button"
                  onClick={() => onChange(operation.id)}
                  className={cn(
                    "w-full text-left px-3 py-2.5 border-b border-softone-border",
                    "hover:bg-softone-surface-hover transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-softone-primary",
                    selectedOperationId === operation.id &&
                      "bg-softone-primary/5 border-l-4 border-l-softone-primary"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {/* HTTP 메서드 뱃지 */}
                    <Badge
                      variant={
                        HTTP_METHOD_VARIANTS[operation.method] || "neutral"
                      }
                      size="sm"
                      className="shrink-0 font-mono text-xs min-w-[60px] justify-center"
                    >
                      {operation.method}
                    </Badge>

                    {/* 경로 및 요약 */}
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm text-softone-text truncate">
                        {operation.path}
                      </div>
                      {operation.summary && (
                        <div className="text-xs text-softone-text-muted truncate mt-0.5">
                          {operation.summary}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ))
        )}
      </div>

      {/* 하단 정보 */}
      <div className="px-3 py-2 border-t border-softone-border bg-softone-bg text-xs text-softone-text-muted">
        총 {operations.length}개 엔드포인트
        {searchQuery && ` (검색 결과: ${filteredOperations.length}개)`}
      </div>
    </div>
  );
};

EndpointSelector.displayName = "EndpointSelector";
