/**
 * SoftOne Design System - Articles Feature Index
 * 작성: SoftOne Frontend Team
 * 설명: 게시글/공지사항 관리 Feature 모듈 통합 export.
 */

// Pages
export { ArticleCreatePage } from "./pages/ArticleCreatePage";

// UI Components
export { ArticleForm } from "./ui/ArticleForm";

// API
export {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  ARTICLE_QUERY_KEYS,
} from "./api/articleApi";

// Types
export type {
  Article,
  ArticleStatus,
  ArticleCategory,
  ArticleListParams,
  ArticleListResponse,
  ArticleFormData,
  CreateArticleRequest,
  UpdateArticleRequest,
} from "./model/article.types";

export {
  ARTICLE_STATUS_META,
  ARTICLE_CATEGORY_META,
  DEFAULT_ARTICLE_FORM,
} from "./model/article.types";

