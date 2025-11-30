/**
 * SoftOne Design System - Article API
 * 작성: SoftOne Frontend Team
 * 설명: 게시글/공지사항 API 및 TanStack Query 훅.
 *      Mock 데이터로 API 동작을 시뮬레이션합니다.
 *
 * Article API
 * - createArticle: 게시글 생성
 * - useCreateArticleMutation: 생성 Mutation 훅
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  Article,
  ArticleListParams,
  ArticleListResponse,
  CreateArticleRequest,
  UpdateArticleRequest,
} from "../model/article.types";

// ========================================
// Mock Data
// ========================================

const MOCK_ARTICLES: Article[] = [
  {
    id: "art-001",
    title: "SDS Framework 1.0 출시 안내",
    contentHtml:
      "<h2>SDS Framework 1.0이 출시되었습니다</h2><p>새로운 기능과 개선사항을 확인해보세요.</p>",
    status: "PUBLISHED",
    category: "NOTICE",
    authorId: "admin-1",
    authorName: "관리자",
    viewCount: 156,
    createdAt: "2024-11-25T09:00:00Z",
    publishedAt: "2024-11-25T10:00:00Z",
  },
  {
    id: "art-002",
    title: "12월 시스템 점검 안내",
    contentHtml:
      "<p>12월 15일 새벽 2시부터 6시까지 시스템 점검이 예정되어 있습니다.</p>",
    status: "DRAFT",
    category: "NOTICE",
    authorId: "admin-1",
    authorName: "관리자",
    viewCount: 0,
    createdAt: "2024-11-28T14:00:00Z",
  },
  {
    id: "art-003",
    title: "자주 묻는 질문 - 로그인 관련",
    contentHtml:
      "<h3>Q: 비밀번호를 잊어버렸어요</h3><p>A: 로그인 페이지에서 '비밀번호 찾기'를 클릭하세요.</p>",
    status: "PUBLISHED",
    category: "FAQ",
    authorId: "admin-1",
    authorName: "관리자",
    viewCount: 89,
    createdAt: "2024-11-20T11:00:00Z",
    publishedAt: "2024-11-20T11:30:00Z",
  },
];

// ========================================
// API Functions
// ========================================

/**
 * 게시글 목록 조회
 */
export const getArticles = async (
  params: ArticleListParams
): Promise<ArticleListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let articles = [...MOCK_ARTICLES];

      // 상태 필터
      if (params.status) {
        articles = articles.filter((a) => a.status === params.status);
      }

      // 카테고리 필터
      if (params.category) {
        articles = articles.filter((a) => a.category === params.category);
      }

      // 키워드 검색
      if (params.keyword) {
        const keyword = params.keyword.toLowerCase();
        articles = articles.filter(
          (a) =>
            a.title.toLowerCase().includes(keyword) ||
            a.contentHtml.toLowerCase().includes(keyword)
        );
      }

      const total = articles.length;
      const start = (params.page - 1) * params.pageSize;
      const end = start + params.pageSize;
      const paginatedArticles = articles.slice(start, end);

      resolve({
        data: paginatedArticles,
        total,
        page: params.page,
        pageSize: params.pageSize,
      });
    }, 500);
  });
};

/**
 * 게시글 상세 조회
 */
export const getArticleById = async (id: string): Promise<Article | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const article = MOCK_ARTICLES.find((a) => a.id === id);
      resolve(article || null);
    }, 300);
  });
};

/**
 * 게시글 생성
 */
export const createArticle = async (
  payload: CreateArticleRequest
): Promise<Article> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newArticle: Article = {
        id: `art-${Date.now()}`,
        title: payload.title,
        contentHtml: payload.contentHtml,
        status: payload.status,
        category: payload.category,
        authorId: "admin-1",
        authorName: "관리자",
        viewCount: 0,
        createdAt: new Date().toISOString(),
        publishedAt:
          payload.status === "PUBLISHED" ? new Date().toISOString() : undefined,
      };

      // Mock: 실제로는 서버에 저장
      MOCK_ARTICLES.unshift(newArticle);

      console.log("[Mock] Article created:", newArticle);
      resolve(newArticle);
    }, 800);
  });
};

/**
 * 게시글 수정
 */
export const updateArticle = async (
  payload: UpdateArticleRequest
): Promise<Article> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_ARTICLES.findIndex((a) => a.id === payload.id);

      if (index === -1) {
        reject(new Error("게시글을 찾을 수 없습니다."));
        return;
      }

      const updatedArticle: Article = {
        ...MOCK_ARTICLES[index],
        ...payload,
        updatedAt: new Date().toISOString(),
        publishedAt:
          payload.status === "PUBLISHED" && !MOCK_ARTICLES[index].publishedAt
            ? new Date().toISOString()
            : MOCK_ARTICLES[index].publishedAt,
      };

      MOCK_ARTICLES[index] = updatedArticle;

      console.log("[Mock] Article updated:", updatedArticle);
      resolve(updatedArticle);
    }, 600);
  });
};

/**
 * 게시글 삭제
 */
export const deleteArticle = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = MOCK_ARTICLES.findIndex((a) => a.id === id);

      if (index === -1) {
        reject(new Error("게시글을 찾을 수 없습니다."));
        return;
      }

      MOCK_ARTICLES.splice(index, 1);
      console.log("[Mock] Article deleted:", id);
      resolve();
    }, 500);
  });
};

// ========================================
// Query Keys
// ========================================

export const ARTICLE_QUERY_KEYS = {
  all: ["articles"] as const,
  lists: () => [...ARTICLE_QUERY_KEYS.all, "list"] as const,
  list: (params: ArticleListParams) =>
    [...ARTICLE_QUERY_KEYS.lists(), params] as const,
  details: () => [...ARTICLE_QUERY_KEYS.all, "detail"] as const,
  detail: (id: string) => [...ARTICLE_QUERY_KEYS.details(), id] as const,
};

// ========================================
// TanStack Query Hooks
// ========================================

/**
 * 게시글 생성 Mutation 훅
 *
 * @example
 * const { mutate, isPending } = useCreateArticleMutation();
 *
 * const handleSubmit = (data: ArticleFormData) => {
 *   mutate(data, {
 *     onSuccess: (article) => {
 *       console.log('Created:', article);
 *       navigation.push('/articles');
 *     },
 *     onError: (error) => {
 *       console.error('Failed:', error);
 *     },
 *   });
 * };
 */
export const useCreateArticleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      // 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEYS.lists() });
    },
  });
};

/**
 * 게시글 수정 Mutation 훅
 */
export const useUpdateArticleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateArticle,
    onSuccess: (article) => {
      // 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({
        queryKey: ARTICLE_QUERY_KEYS.detail(article.id),
      });
    },
  });
};

/**
 * 게시글 삭제 Mutation 훅
 */
export const useDeleteArticleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ARTICLE_QUERY_KEYS.lists() });
    },
  });
};
