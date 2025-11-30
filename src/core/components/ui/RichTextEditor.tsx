/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: Tiptap 기반 리치 텍스트 에디터 컴포넌트.
 *      React Hook Form과 통합하여 폼에서 사용할 수 있습니다.
 *      퍼블리셔가 스타일과 툴바를 쉽게 변경할 수 있도록 설계되었습니다.
 *
 * RichTextEditor Component
 * - Tiptap StarterKit + Link + Placeholder 확장
 * - SDS Design Token 기반 스타일링
 * - onChange 콜백으로 HTML 내용 전달
 */

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "../../utils/classUtils";
import { RichTextEditorToolbar } from "./RichTextEditorToolbar";

// ========================================
// Types
// ========================================

export interface RichTextEditorProps {
  /** 에디터 HTML 값 */
  value?: string;
  /** 값 변경 핸들러 */
  onChange?: (html: string) => void;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
  /** 최소 높이 (px) */
  minHeight?: number;
  /** 비활성화 상태 */
  disabled?: boolean;
  /** 에러 상태 */
  error?: boolean;
  /** 읽기 전용 */
  readOnly?: boolean;
  /** 툴바 표시 여부 */
  showToolbar?: boolean;
  /** 추가 클래스 */
  className?: string;
  /** 에디터 영역 추가 클래스 */
  editorClassName?: string;
}

// ========================================
// Editor Styles
// ========================================

const editorStyles = `
  .ProseMirror {
    outline: none;
    min-height: inherit;
    padding: 1rem;
  }

  .ProseMirror p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: var(--sds-color-text-muted, #9ca3af);
    pointer-events: none;
    height: 0;
  }

  .ProseMirror h1 {
    font-size: 1.875rem;
    font-weight: 700;
    line-height: 1.3;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .ProseMirror h2 {
    font-size: 1.5rem;
    font-weight: 600;
    line-height: 1.35;
    margin-top: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .ProseMirror h3 {
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.4;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
  }

  .ProseMirror p {
    margin-bottom: 0.75rem;
  }

  .ProseMirror ul,
  .ProseMirror ol {
    padding-left: 1.5rem;
    margin-bottom: 0.75rem;
  }

  .ProseMirror ul {
    list-style-type: disc;
  }

  .ProseMirror ol {
    list-style-type: decimal;
  }

  .ProseMirror li {
    margin-bottom: 0.25rem;
  }

  .ProseMirror blockquote {
    border-left: 3px solid var(--sds-color-border, #e5e7eb);
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    margin-bottom: 0.75rem;
    color: var(--sds-color-text-secondary, #6b7280);
    font-style: italic;
  }

  .ProseMirror code {
    background-color: var(--sds-color-bg, #f3f4f6);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    font-family: ui-monospace, monospace;
    font-size: 0.875em;
  }

  .ProseMirror pre {
    background-color: var(--sds-color-bg, #f3f4f6);
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 0.75rem;
    overflow-x: auto;
  }

  .ProseMirror pre code {
    background: none;
    padding: 0;
  }

  .ProseMirror a {
    color: var(--sds-color-primary, #3b82f6);
    text-decoration: underline;
    cursor: pointer;
  }

  .ProseMirror a:hover {
    color: var(--sds-color-primary-dark, #2563eb);
  }

  .ProseMirror hr {
    border: none;
    border-top: 1px solid var(--sds-color-border, #e5e7eb);
    margin: 1.5rem 0;
  }

  .ProseMirror img {
    max-width: 100%;
    height: auto;
    border-radius: 0.5rem;
  }

  .ProseMirror:focus {
    outline: none;
  }
`;

// ========================================
// RichTextEditor Component
// ========================================

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = "",
  onChange,
  placeholder = "내용을 입력하세요...",
  minHeight = 200,
  disabled = false,
  error = false,
  readOnly = false,
  showToolbar = true,
  className,
  editorClassName,
}) => {
  // Tiptap Editor 인스턴스 생성
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-softone-primary underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    editable: !disabled && !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // value prop 변경 시 에디터 내용 동기화
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  // disabled/readOnly 변경 시 editable 상태 업데이트
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled && !readOnly);
    }
  }, [disabled, readOnly, editor]);

  return (
    <div
      className={cn(
        "rounded-lg border overflow-hidden",
        "transition-colors duration-200",
        // Normal state
        !error && "border-softone-border",
        !error &&
          "focus-within:border-softone-primary focus-within:ring-2 focus-within:ring-softone-primary/20",
        // Error state
        error && "border-softone-danger focus-within:ring-softone-danger/20",
        // Disabled state
        disabled && "opacity-60 cursor-not-allowed bg-softone-bg",
        className
      )}
    >
      {/* Inject Editor Styles */}
      <style>{editorStyles}</style>

      {/* Toolbar */}
      {showToolbar && !readOnly && <RichTextEditorToolbar editor={editor} />}

      {/* Editor Content */}
      <div
        className={cn("bg-softone-surface text-softone-text", editorClassName)}
        style={{ minHeight }}
      >
        <EditorContent editor={editor} className="h-full" />
      </div>
    </div>
  );
};

RichTextEditor.displayName = "RichTextEditor";

// ========================================
// Re-export Toolbar
// ========================================

export { RichTextEditorToolbar } from "./RichTextEditorToolbar";
