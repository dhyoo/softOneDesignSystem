/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 리치 텍스트 HTML 뷰어 컴포넌트.
 *      에디터에서 작성된 HTML 콘텐츠를 안전하게 표시합니다.
 *
 * RichTextViewer Component
 * - dangerouslySetInnerHTML 사용
 * - XSS 방지를 위한 sanitize 권장 (주석 안내)
 *
 * ⚠️ 보안 주의:
 * 사용자 입력 HTML을 렌더링할 때는 반드시 서버 측에서 sanitize 처리하거나,
 * DOMPurify 같은 라이브러리를 사용하여 XSS 공격을 방지해야 합니다.
 *
 * @example
 * // DOMPurify 사용 예시
 * import DOMPurify from 'dompurify';
 * const cleanHtml = DOMPurify.sanitize(dirtyHtml);
 * <RichTextViewer html={cleanHtml} />
 */

import React from "react";
import { cn } from "../../utils/classUtils";

// ========================================
// Types
// ========================================

export interface RichTextViewerProps {
  /** 렌더링할 HTML 문자열 */
  html: string;
  /** 추가 클래스 */
  className?: string;
}

// ========================================
// Prose Styles
// ========================================

const proseStyles = `
  .sds-prose h1 {
    font-size: 1.875rem;
    font-weight: 700;
    line-height: 1.3;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
    color: var(--sds-color-text, #1f2937);
  }

  .sds-prose h2 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.35;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--sds-color-text, #1f2937);
  }

  .sds-prose h3 {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.4;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    color: var(--sds-color-text, #1f2937);
  }

  .sds-prose p {
    margin-bottom: 0.75rem;
    color: var(--sds-color-text, #1f2937);
  }

  .sds-prose ul,
  .sds-prose ol {
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .sds-prose ul {
    list-style-type: disc;
  }

  .sds-prose ol {
    list-style-type: decimal;
  }

  .sds-prose li {
    margin-bottom: 0.25rem;
    color: var(--sds-color-text, #1f2937);
  }

  .sds-prose blockquote {
    border-left: 3px solid var(--sds-color-border, #e5e7eb);
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0.75rem;
    color: var(--sds-color-text-secondary, #6b7280);
    font-style: italic;
  }

  .sds-prose code {
    background-color: var(--sds-color-bg, #f3f4f6);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: ui-monospace, monospace;
    font-size: 0.875em;
  }

  .sds-prose pre {
    background-color: var(--sds-color-bg, #f3f4f6);
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 0.75rem;
    overflow-x: auto;
  }

  .sds-prose pre code {
    background: none;
    padding: 0;
  }

  .sds-prose a {
    color: var(--sds-color-primary, #3b82f6);
    text-decoration: underline;
  }

  .sds-prose a:hover {
    color: var(--sds-color-primary-dark, #2563eb);
  }

  .sds-prose hr {
    border: none;
    border-top: 1px solid var(--sds-color-border, #e5e7eb);
    margin: 1.5rem 0;
  }

  .sds-prose img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
  }

  .sds-prose strong {
    font-weight: 600;
  }

  .sds-prose em {
    font-style: italic;
  }
`;

// ========================================
// RichTextViewer Component
// ========================================

export const RichTextViewer: React.FC<RichTextViewerProps> = ({
  html,
  className,
}) => {
  // ⚠️ 보안 주의:
  // 신뢰할 수 없는 HTML을 렌더링할 때는 반드시 sanitize 처리가 필요합니다.
  // 서버에서 sanitize된 HTML을 받거나, 클라이언트에서 DOMPurify를 사용하세요.
  //
  // 예시:
  // import DOMPurify from 'dompurify';
  // const cleanHtml = DOMPurify.sanitize(html);

  if (!html) {
    return (
      <div className={cn("text-softone-text-muted", className)}>
        내용이 없습니다.
      </div>
    );
  }

  return (
    <>
      <style>{proseStyles}</style>
      <div
        className={cn("sds-prose", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
};

RichTextViewer.displayName = "RichTextViewer";

