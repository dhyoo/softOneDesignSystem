/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 *
 * 스펙 기반 API Playground 지원:
 *   API 요청/응답 데이터를 시각적으로 표시하는 JSON 뷰어.
 *   Request Preview, Response 확인 등에 활용.
 *
 * JsonViewer Component
 * - JSON 데이터를 포맷팅하여 표시
 * - 복사 기능 제공
 * - 접기/펼치기 지원
 *
 * @example
 * <JsonViewer
 *   data={{ name: "test", value: 123 }}
 *   title="Response"
 * />
 */

import React, { useState, useCallback } from "react";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardBody } from "./Card";
import { Button } from "./Button";
import { cn } from "../../utils/classUtils";

// ========================================
// Types
// ========================================

export interface JsonViewerProps {
  /** 표시할 데이터 */
  data: unknown;
  /** 제목 */
  title?: string;
  /** 초기 접힘 상태 */
  collapsed?: boolean;
  /** 최대 높이 (스크롤) */
  maxHeight?: number | string;
  /** 추가 클래스 */
  className?: string;
  /** 카드 없이 렌더링 */
  noCard?: boolean;
}

// ========================================
// JsonViewer Component
// ========================================

export const JsonViewer: React.FC<JsonViewerProps> = ({
  data,
  title,
  collapsed: initialCollapsed = false,
  maxHeight = 400,
  className,
  noCard = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(initialCollapsed);
  const [isCopied, setIsCopied] = useState(false);

  // JSON 문자열 생성
  const jsonString = React.useMemo(() => {
    try {
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  }, [data]);

  // 복사 핸들러
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [jsonString]);

  // 접기/펼치기 토글
  const toggleCollapse = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  // JSON 내용 렌더링
  const content = (
    <div
      className={cn(
        "relative font-mono text-sm",
        isCollapsed && "max-h-[100px] overflow-hidden"
      )}
      style={{
        maxHeight: isCollapsed ? 100 : maxHeight,
        overflow: "auto",
      }}
    >
      <pre
        className={cn(
          "p-4 rounded-md overflow-x-auto whitespace-pre-wrap break-words",
          "bg-softone-gray-800 text-softone-gray-100"
        )}
      >
        <code>{jsonString}</code>
      </pre>

      {/* 접힘 상태 그라디언트 오버레이 */}
      {isCollapsed && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-softone-gray-800 to-transparent" />
      )}
    </div>
  );

  // 카드 없이 렌더링
  if (noCard) {
    return (
      <div className={className}>
        {/* 헤더 (타이틀 있을 때만) */}
        {title && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-softone-text">
              {title}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                leftIcon={
                  isCopied ? (
                    <Check className="w-4 h-4 text-softone-success" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )
                }
              >
                {isCopied ? "복사됨" : "복사"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapse}
                leftIcon={
                  isCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )
                }
              >
                {isCollapsed ? "펼치기" : "접기"}
              </Button>
            </div>
          </div>
        )}
        {content}
      </div>
    );
  }

  // 카드로 감싸서 렌더링
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between py-3">
        <CardTitle className="text-sm">{title || "JSON"}</CardTitle>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            leftIcon={
              isCopied ? (
                <Check className="w-4 h-4 text-softone-success" />
              ) : (
                <Copy className="w-4 h-4" />
              )
            }
          >
            {isCopied ? "복사됨" : "복사"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            leftIcon={
              isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )
            }
          >
            {isCollapsed ? "펼치기" : "접기"}
          </Button>
        </div>
      </CardHeader>
      <CardBody className="p-0">{content}</CardBody>
    </Card>
  );
};

JsonViewer.displayName = "JsonViewer";
