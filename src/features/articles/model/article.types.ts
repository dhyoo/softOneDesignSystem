/**
 * SoftOne Design System - Article Types
 * 작성: SoftOne Frontend Team
 * 설명: 게시글/공지사항 도메인 타입 정의.
 *      RichTextEditor와 함께 사용되는 콘텐츠 관리 패턴입니다.
 *
 * Article Types
 * - Article: 게시글 엔티티
 * - ArticleStatus: 게시글 상태 (DRAFT, PUBLISHED)
 * - enumUtils와 연동하여 Badge 표시
 */

import type { BadgeVariant } from "@core/components/ui/Badge";

// ========================================
// Article Status Enum
// ========================================

export type ArticleStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

/**
 * 게시글 상태 메타데이터
 * enumUtils 패턴과 동일하게 레이블/색상 정의
 */
export const ARTICLE_STATUS_META: Record<
  ArticleStatus,
  { label: string; variant: BadgeVariant }
> = {
  DRAFT: { label: "임시저장", variant: "warning" },
  PUBLISHED: { label: "게시됨", variant: "success" },
  ARCHIVED: { label: "보관됨", variant: "neutral" },
};

// ========================================
// Article Entity
// ========================================

export interface Article {
  /** 게시글 ID */
  id: string;
  /** 제목 */
  title: string;
  /** HTML 본문 내용 */
  contentHtml: string;
  /** 상태 */
  status: ArticleStatus;
  /** 카테고리 */
  category?: ArticleCategory;
  /** 작성자 ID */
  authorId: string;
  /** 작성자 이름 */
  authorName?: string;
  /** 조회수 */
  viewCount: number;
  /** 생성일 */
  createdAt: string;
  /** 수정일 */
  updatedAt?: string;
  /** 게시일 */
  publishedAt?: string;
}

// ========================================
// Article Category
// ========================================

export type ArticleCategory = "NOTICE" | "NEWS" | "FAQ" | "GUIDE" | "ETC";

export const ARTICLE_CATEGORY_META: Record<
  ArticleCategory,
  { label: string; variant: BadgeVariant }
> = {
  NOTICE: { label: "공지사항", variant: "danger" },
  NEWS: { label: "뉴스", variant: "info" },
  FAQ: { label: "FAQ", variant: "primary" },
  GUIDE: { label: "가이드", variant: "success" },
  ETC: { label: "기타", variant: "neutral" },
};

// ========================================
// API Request/Response Types
// ========================================

/**
 * 게시글 목록 조회 파라미터
 */
export interface ArticleListParams {
  page: number;
  pageSize: number;
  status?: ArticleStatus;
  category?: ArticleCategory;
  keyword?: string;
}

/**
 * 게시글 목록 조회 응답
 */
export interface ArticleListResponse {
  data: Article[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 게시글 생성/수정 DTO
 */
export interface ArticleFormData {
  title: string;
  contentHtml: string;
  status: ArticleStatus;
  category?: ArticleCategory;
}

/**
 * 게시글 생성 요청
 */
export interface CreateArticleRequest {
  title: string;
  contentHtml: string;
  status: ArticleStatus;
  category?: ArticleCategory;
}

/**
 * 게시글 수정 요청
 */
export interface UpdateArticleRequest extends Partial<CreateArticleRequest> {
  id: string;
}

// ========================================
// Form Types
// ========================================

/**
 * 기본 폼 값
 */
export const DEFAULT_ARTICLE_FORM: ArticleFormData = {
  title: "",
  contentHtml: "",
  status: "DRAFT",
  category: undefined,
};

