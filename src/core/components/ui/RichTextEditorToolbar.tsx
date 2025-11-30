/**
 * SoftOne Design System(SDS) - Core UI Component
 * 작성: SoftOne Frontend Team
 * 설명: 리치 텍스트 에디터 툴바 컴포넌트.
 *      퍼블리셔가 버튼 구성을 쉽게 변경할 수 있도록 설계되었습니다.
 *      SDS Button 컴포넌트를 재사용하여 일관된 UI를 제공합니다.
 *
 * RichTextEditorToolbar Component
 * - Tiptap Editor와 연동
 * - Bold, Italic, Heading, List, Link 버튼
 * - 커스텀 버튼 추가 가능
 */

import React from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Unlink,
  Undo,
  Redo,
  Quote,
  Code,
  Minus,
} from "lucide-react";
import { cn } from "../../utils/classUtils";

// ========================================
// Types
// ========================================

export interface ToolbarButtonConfig {
  /** 버튼 아이콘 */
  icon: React.ReactNode;
  /** 버튼 제목 (툴팁) */
  title: string;
  /** 클릭 핸들러 */
  action: () => void;
  /** 활성 상태 체크 */
  isActive?: () => boolean;
  /** 비활성화 상태 */
  disabled?: boolean;
}

export interface RichTextEditorToolbarProps {
  /** Tiptap Editor 인스턴스 */
  editor: Editor | null;
  /** 추가 클래스 */
  className?: string;
  /** 커스텀 버튼 설정 (기본 버튼 대신 사용) */
  customButtons?: ToolbarButtonConfig[];
  /** 표시할 버튼 그룹 (기본: 모든 그룹) */
  enabledGroups?: ("format" | "heading" | "list" | "insert" | "history")[];
}

// ========================================
// Toolbar Button Component
// ========================================

interface ToolbarButtonProps {
  icon: React.ReactNode;
  title: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon,
  title,
  onClick,
  isActive = false,
  disabled = false,
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={cn(
      "p-2 rounded transition-colors",
      "hover:bg-softone-surface-hover",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      isActive && "bg-softone-primary/10 text-softone-primary"
    )}
  >
    {icon}
  </button>
);

// ========================================
// Toolbar Divider
// ========================================

const ToolbarDivider: React.FC = () => (
  <div className="w-px h-6 bg-softone-border mx-1" />
);

// ========================================
// RichTextEditorToolbar Component
// ========================================

export const RichTextEditorToolbar: React.FC<RichTextEditorToolbarProps> = ({
  editor,
  className,
  customButtons,
  enabledGroups = ["format", "heading", "list", "insert", "history"],
}) => {
  if (!editor) {
    return null;
  }

  // Link 삽입 핸들러
  const handleSetLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL을 입력하세요:", previousUrl);

    if (url === null) {
      return; // 취소됨
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  // 커스텀 버튼이 제공되면 해당 버튼만 렌더링
  if (customButtons) {
    return (
      <div
        className={cn(
          "flex items-center flex-wrap gap-1 p-2",
          "border-b border-softone-border bg-softone-bg",
          className
        )}
      >
        {customButtons.map((btn, index) => (
          <ToolbarButton
            key={index}
            icon={btn.icon}
            title={btn.title}
            onClick={btn.action}
            isActive={btn.isActive?.()}
            disabled={btn.disabled}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center flex-wrap gap-1 p-2",
        "border-b border-softone-border bg-softone-bg",
        className
      )}
    >
      {/* Format Group */}
      {enabledGroups.includes("format") && (
        <>
          <ToolbarButton
            icon={<Bold className="w-4 h-4" />}
            title="굵게 (Ctrl+B)"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
          />
          <ToolbarButton
            icon={<Italic className="w-4 h-4" />}
            title="기울임 (Ctrl+I)"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
          />
          <ToolbarButton
            icon={<Code className="w-4 h-4" />}
            title="코드"
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
          />
          <ToolbarDivider />
        </>
      )}

      {/* Heading Group */}
      {enabledGroups.includes("heading") && (
        <>
          <ToolbarButton
            icon={<Heading1 className="w-4 h-4" />}
            title="제목 1"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
          />
          <ToolbarButton
            icon={<Heading2 className="w-4 h-4" />}
            title="제목 2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
          />
          <ToolbarButton
            icon={<Heading3 className="w-4 h-4" />}
            title="제목 3"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
          />
          <ToolbarDivider />
        </>
      )}

      {/* List Group */}
      {enabledGroups.includes("list") && (
        <>
          <ToolbarButton
            icon={<List className="w-4 h-4" />}
            title="글머리 기호 목록"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
          />
          <ToolbarButton
            icon={<ListOrdered className="w-4 h-4" />}
            title="번호 매기기 목록"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
          />
          <ToolbarButton
            icon={<Quote className="w-4 h-4" />}
            title="인용구"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
          />
          <ToolbarDivider />
        </>
      )}

      {/* Insert Group */}
      {enabledGroups.includes("insert") && (
        <>
          <ToolbarButton
            icon={<Link className="w-4 h-4" />}
            title="링크 삽입"
            onClick={handleSetLink}
            isActive={editor.isActive("link")}
          />
          <ToolbarButton
            icon={<Unlink className="w-4 h-4" />}
            title="링크 제거"
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
          />
          <ToolbarButton
            icon={<Minus className="w-4 h-4" />}
            title="구분선"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          />
          <ToolbarDivider />
        </>
      )}

      {/* History Group */}
      {enabledGroups.includes("history") && (
        <>
          <ToolbarButton
            icon={<Undo className="w-4 h-4" />}
            title="실행 취소 (Ctrl+Z)"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          />
          <ToolbarButton
            icon={<Redo className="w-4 h-4" />}
            title="다시 실행 (Ctrl+Y)"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          />
        </>
      )}
    </div>
  );
};

RichTextEditorToolbar.displayName = "RichTextEditorToolbar";
