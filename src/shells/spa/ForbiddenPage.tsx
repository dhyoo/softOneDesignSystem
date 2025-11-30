/**
 * SoftOne Design System - Forbidden Page (403)
 * 작성: SoftOne Frontend Team
 *
 * 권한이 없는 페이지에 접근했을 때 표시되는 페이지입니다.
 */

import React from "react";
import { ShieldX, ArrowLeft, Home } from "lucide-react";
import { Button } from "@core/components/ui/Button";
import { Card, CardBody } from "@core/components/ui/Card";
import { useNavigation } from "@core/router/NavigationContext";
import type { PermissionKey } from "@core/auth/role.types";

// ========================================
// Types
// ========================================

export interface ForbiddenPageProps {
  /** 필요한 권한 목록 (표시용) */
  requiredPermissions?: PermissionKey[];
  /** 커스텀 메시지 */
  message?: string;
}

// ========================================
// ForbiddenPage Component
// ========================================

export const ForbiddenPage: React.FC<ForbiddenPageProps> = ({
  requiredPermissions,
  message,
}) => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.back();
  };

  const handleGoHome = () => {
    navigation.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6">
      <Card className="max-w-lg w-full text-center shadow-lg">
        <CardBody className="py-12">
          {/* 아이콘 */}
          <div className="mx-auto w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <ShieldX className="w-10 h-10 text-red-600" />
          </div>

          {/* 제목 */}
          <h1 className="text-3xl font-bold text-softone-text mb-2">
            접근 권한이 없습니다
          </h1>
          <p className="text-lg text-softone-text-secondary mb-6">
            {message || "이 페이지에 접근할 수 있는 권한이 없습니다."}
          </p>

          {/* 필요한 권한 표시 */}
          {requiredPermissions && requiredPermissions.length > 0 && (
            <div className="mb-8">
              <p className="text-sm text-softone-text-muted mb-3">
                필요한 권한:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {requiredPermissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-3 py-1 bg-softone-primary-light text-softone-primary rounded-full text-sm font-medium"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleGoBack}
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              이전 페이지
            </Button>
            <Button
              variant="primary"
              onClick={handleGoHome}
              leftIcon={<Home className="w-4 h-4" />}
            >
              대시보드로 이동
            </Button>
          </div>

          {/* 도움말 */}
          <p className="mt-8 text-sm text-softone-text-muted">
            권한이 필요한 경우 관리자에게 문의하세요.
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

ForbiddenPage.displayName = "ForbiddenPage";

export default ForbiddenPage;
