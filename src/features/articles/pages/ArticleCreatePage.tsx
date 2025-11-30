/**
 * SoftOne Design System - Article Create Page
 * 작성: SoftOne Frontend Team
 * 설명: 게시글 작성 페이지.
 *      PageHeader + ArticleForm 조합으로 콘텐츠 작성 패턴을 보여줍니다.
 *
 * ArticleCreatePage Component
 * - useCreateArticleMutation 사용
 * - 성공 시 목록 페이지로 이동
 */

import React from "react";
import { FileText } from "lucide-react";
import { PageHeader } from "@core/components/layout/PageHeader";
import { useNavigation } from "@core/router/NavigationContext";
import { ArticleForm } from "../ui/ArticleForm";
import { useCreateArticleMutation } from "../api/articleApi";
import type { ArticleFormData } from "../model/article.types";

// ========================================
// ArticleCreatePage Component
// ========================================

export const ArticleCreatePage: React.FC = () => {
  const navigation = useNavigation();
  const { mutate: createArticle, isPending } = useCreateArticleMutation();

  // 폼 제출 핸들러
  const handleSubmit = (data: ArticleFormData) => {
    createArticle(data, {
      onSuccess: (article) => {
        console.log("[ArticleCreatePage] 게시글 생성 성공:", article);

        // Step 7 이후: Toast 알림 추가
        // toast.success('게시글이 저장되었습니다.');

        // 목록 페이지로 이동
        navigation.push("/articles");
      },
      onError: (error) => {
        console.error("[ArticleCreatePage] 게시글 생성 실패:", error);

        // Step 7 이후: Toast 알림 추가
        // toast.error('게시글 저장에 실패했습니다.');
      },
    });
  };

  // 취소 핸들러
  const handleCancel = () => {
    // 변경 사항이 있으면 확인 대화상자 표시 권장
    if (window.confirm("작성 중인 내용이 있습니다. 취소하시겠습니까?")) {
      navigation.push("/articles");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="게시글 작성"
        subtitle="새로운 게시글을 작성합니다."
        icon={<FileText className="w-5 h-5 text-softone-primary" />}
      />

      {/* Article Form */}
      <ArticleForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={isPending}
        isEditMode={false}
      />
    </div>
  );
};

ArticleCreatePage.displayName = "ArticleCreatePage";

export default ArticleCreatePage;

