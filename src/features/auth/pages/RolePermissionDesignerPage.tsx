/**
 * SoftOne Design System - Role Permission Designer Page
 * 작성: SoftOne Frontend Team
 *
 * 이 파일에서는 Role/Grade 기반 PermissionKey를 사용하여
 * 메뉴/페이지/버튼/액션의 표시/비활성화/숨김을 제어합니다.
 *
 * 역할(Role)별 권한(Permission) 관리를 위한 디자이너 페이지입니다.
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Shield,
  Save,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Users,
  Settings,
  Lock,
  Eye,
} from "lucide-react";

import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { Checkbox } from "@core/components/ui/Checkbox";
import { Input } from "@core/components/ui/Input";
import { useToast } from "@core/hooks/useToast";
import { cn } from "@core/utils/classUtils";
import {
  ROLES,
  PERMISSION_KEYS,
  ROLE_PERMISSION_MAP,
  type Role,
  type PermissionKey,
} from "@core/auth/role.types";

// ========================================
// Types
// ========================================

interface PermissionCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  permissions: {
    key: PermissionKey;
    label: string;
    description: string;
  }[];
}

// ========================================
// Permission Categories
// ========================================

const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: "menu",
    label: "메뉴 접근 권한",
    icon: <Eye className="w-4 h-4" />,
    permissions: [
      {
        key: PERMISSION_KEYS.MENU_DASHBOARD_VIEW,
        label: "대시보드",
        description: "대시보드 메뉴 접근",
      },
      {
        key: PERMISSION_KEYS.MENU_USERS_VIEW,
        label: "사용자 관리",
        description: "사용자 관리 메뉴 접근",
      },
      {
        key: PERMISSION_KEYS.MENU_AUTH_VIEW,
        label: "권한 관리",
        description: "권한 관리 메뉴 접근",
      },
      {
        key: PERMISSION_KEYS.MENU_SYSTEM_VIEW,
        label: "시스템 설정",
        description: "시스템 설정 메뉴 접근",
      },
      {
        key: PERMISSION_KEYS.MENU_GRID_SAMPLES_VIEW,
        label: "그리드 샘플",
        description: "그리드 샘플 메뉴 접근",
      },
      {
        key: PERMISSION_KEYS.MENU_NOTIFICATIONS_VIEW,
        label: "알림",
        description: "알림 메뉴 접근",
      },
      {
        key: PERMISSION_KEYS.MENU_PRODUCTS_VIEW,
        label: "상품 관리",
        description: "상품 관리 메뉴 접근",
      },
    ],
  },
  {
    id: "page",
    label: "페이지 접근 권한",
    icon: <Eye className="w-4 h-4" />,
    permissions: [
      {
        key: PERMISSION_KEYS.PAGE_DASHBOARD_VIEW,
        label: "대시보드 페이지",
        description: "대시보드 페이지 조회",
      },
      {
        key: PERMISSION_KEYS.PAGE_USERS_LIST_VIEW,
        label: "사용자 목록",
        description: "사용자 목록 페이지 조회",
      },
      {
        key: PERMISSION_KEYS.PAGE_USERS_DETAIL_VIEW,
        label: "사용자 상세",
        description: "사용자 상세 페이지 조회",
      },
      {
        key: PERMISSION_KEYS.PAGE_AUTH_ROLE_DESIGNER_VIEW,
        label: "권한 디자이너",
        description: "역할/권한 디자이너 페이지 조회",
      },
      {
        key: PERMISSION_KEYS.PAGE_SYSTEM_SETTINGS_VIEW,
        label: "시스템 설정 페이지",
        description: "시스템 설정 페이지 조회",
      },
      {
        key: PERMISSION_KEYS.PAGE_GRID_SAMPLES_VIEW,
        label: "그리드 샘플 페이지",
        description: "그리드 샘플 페이지 조회",
      },
    ],
  },
  {
    id: "users",
    label: "사용자 관리 액션",
    icon: <Users className="w-4 h-4" />,
    permissions: [
      {
        key: PERMISSION_KEYS.ACTION_USERS_CREATE,
        label: "사용자 생성",
        description: "새 사용자를 생성할 수 있음",
      },
      {
        key: PERMISSION_KEYS.ACTION_USERS_UPDATE,
        label: "사용자 수정",
        description: "사용자 정보를 수정할 수 있음",
      },
      {
        key: PERMISSION_KEYS.ACTION_USERS_DELETE,
        label: "사용자 삭제",
        description: "사용자를 삭제할 수 있음",
      },
      {
        key: PERMISSION_KEYS.ACTION_USERS_GRANT_ROLE,
        label: "역할 부여",
        description: "사용자에게 역할을 부여할 수 있음",
      },
      {
        key: PERMISSION_KEYS.ACTION_USERS_EXPORT,
        label: "사용자 내보내기",
        description: "사용자 목록을 내보낼 수 있음",
      },
    ],
  },
  {
    id: "auth",
    label: "권한 관리 액션",
    icon: <Lock className="w-4 h-4" />,
    permissions: [
      {
        key: PERMISSION_KEYS.ACTION_AUTH_ROLE_CREATE,
        label: "역할 생성",
        description: "새 역할을 생성할 수 있음",
      },
      {
        key: PERMISSION_KEYS.ACTION_AUTH_ROLE_UPDATE,
        label: "역할 수정",
        description: "역할을 수정할 수 있음",
      },
      {
        key: PERMISSION_KEYS.ACTION_AUTH_ROLE_DELETE,
        label: "역할 삭제",
        description: "역할을 삭제할 수 있음",
      },
      {
        key: PERMISSION_KEYS.ACTION_AUTH_PERMISSION_ASSIGN,
        label: "권한 할당",
        description: "역할에 권한을 할당할 수 있음",
      },
    ],
  },
  {
    id: "system",
    label: "시스템 설정 액션",
    icon: <Settings className="w-4 h-4" />,
    permissions: [
      {
        key: PERMISSION_KEYS.ACTION_SYSTEM_SETTINGS_UPDATE,
        label: "시스템 설정 수정",
        description: "시스템 설정을 수정할 수 있음",
      },
      {
        key: PERMISSION_KEYS.ACTION_SYSTEM_MENU_UPDATE,
        label: "메뉴 설정 수정",
        description: "메뉴 설정을 수정할 수 있음",
      },
    ],
  },
  {
    id: "pii",
    label: "개인정보(PII) 권한",
    icon: <Shield className="w-4 h-4" />,
    permissions: [
      {
        key: PERMISSION_KEYS.PII_VIEW_FULL,
        label: "전체 개인정보 조회",
        description: "마스킹 없이 전체 개인정보를 조회할 수 있음",
      },
      {
        key: PERMISSION_KEYS.PII_VIEW_PARTIAL,
        label: "부분 개인정보 조회",
        description: "마스킹된 개인정보를 조회할 수 있음",
      },
      {
        key: PERMISSION_KEYS.PII_EXPORT,
        label: "개인정보 내보내기",
        description: "개인정보를 내보낼 수 있음",
      },
      {
        key: PERMISSION_KEYS.PII_DOWNLOAD,
        label: "개인정보 다운로드",
        description: "개인정보를 다운로드할 수 있음",
      },
    ],
  },
];

// ========================================
// Role Labels
// ========================================

const ROLE_LABELS: Record<Role, string> = {
  SYSTEM_ADMIN: "시스템 관리자",
  ORG_ADMIN: "조직 관리자",
  MANAGER: "매니저",
  STAFF: "일반 직원",
  GUEST: "게스트",
};

// ========================================
// Component
// ========================================

export const RolePermissionDesignerPage: React.FC = () => {
  const toast = useToast();
  const [selectedRole, setSelectedRole] = useState<Role>("SYSTEM_ADMIN");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(PERMISSION_CATEGORIES.map((c) => c.id))
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // 현재 선택된 역할의 권한 목록 (로컬 상태로 관리)
  const [rolePermissions, setRolePermissions] = useState<
    Record<Role, PermissionKey[]>
  >(() => ({ ...ROLE_PERMISSION_MAP }));

  // 현재 역할의 권한 목록
  const currentPermissions = rolePermissions[selectedRole] || [];

  // 카테고리 토글
  const toggleCategory = useCallback((categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  }, []);

  // 권한 토글
  const togglePermission = useCallback(
    (permission: PermissionKey) => {
      setRolePermissions((prev) => {
        const current = prev[selectedRole] || [];
        const updated = current.includes(permission)
          ? current.filter((p) => p !== permission)
          : [...current, permission];
        return { ...prev, [selectedRole]: updated };
      });
    },
    [selectedRole]
  );

  // 카테고리 전체 선택/해제
  const toggleCategoryAll = useCallback(
    (category: PermissionCategory) => {
      const categoryPermissions = category.permissions.map((p) => p.key);
      const allSelected = categoryPermissions.every((p) =>
        currentPermissions.includes(p)
      );

      setRolePermissions((prev) => {
        const current = prev[selectedRole] || [];
        let updated: PermissionKey[];

        if (allSelected) {
          // 전체 해제
          updated = current.filter((p) => !categoryPermissions.includes(p));
        } else {
          // 전체 선택
          updated = [...new Set([...current, ...categoryPermissions])];
        }

        return { ...prev, [selectedRole]: updated };
      });
    },
    [selectedRole, currentPermissions]
  );

  // 검색 필터링
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return PERMISSION_CATEGORIES;

    const query = searchQuery.toLowerCase();
    return PERMISSION_CATEGORIES.map((category) => ({
      ...category,
      permissions: category.permissions.filter(
        (p) =>
          p.label.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.key.toLowerCase().includes(query)
      ),
    })).filter((category) => category.permissions.length > 0);
  }, [searchQuery]);

  // 저장
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("권한 설정이 저장되었습니다.");
    } catch {
      toast.error("권한 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 초기화
  const handleReset = () => {
    setRolePermissions({ ...ROLE_PERMISSION_MAP });
    toast.info("권한 설정이 초기화되었습니다.");
  };

  // 통계
  const stats = useMemo(() => {
    const totalPermissions = Object.values(PERMISSION_KEYS).length;
    const assignedPermissions = currentPermissions.length;
    const percentage = Math.round(
      (assignedPermissions / totalPermissions) * 100
    );
    return { totalPermissions, assignedPermissions, percentage };
  }, [currentPermissions]);

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="역할 / 권한 디자이너"
        subtitle="역할별 권한을 설정하고 관리합니다."
        icon={<Shield className="w-6 h-6 text-softone-primary" />}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              초기화
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              loading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              requiredPermission={PERMISSION_KEYS.ACTION_AUTH_ROLE_UPDATE}
              minRequiredGrade="TEAM_LEAD"
              showLockIconIfDisabled
            >
              저장
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* 역할 선택 사이드바 */}
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">역할 목록</CardTitle>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y divide-softone-border">
                {ROLES.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-left transition-colors",
                      selectedRole === role
                        ? "bg-softone-primary-light text-softone-primary"
                        : "hover:bg-softone-surface-hover"
                    )}
                  >
                    <div>
                      <div className="font-medium">{ROLE_LABELS[role]}</div>
                      <div className="text-xs text-softone-text-muted">
                        {role}
                      </div>
                    </div>
                    <Badge
                      variant={selectedRole === role ? "primary" : "neutral"}
                      size="sm"
                    >
                      {(rolePermissions[role] || []).length}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* 통계 카드 */}
          <Card className="mt-4">
            <CardBody>
              <div className="text-center">
                <div className="text-3xl font-bold text-softone-primary">
                  {stats.percentage}%
                </div>
                <div className="text-sm text-softone-text-muted mt-1">
                  {stats.assignedPermissions} / {stats.totalPermissions} 권한
                </div>
                <div className="mt-3 h-2 bg-softone-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-softone-primary transition-all duration-300"
                    style={{ width: `${stats.percentage}%` }}
                  />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* 권한 설정 영역 */}
        <div className="col-span-9">
          {/* 검색 */}
          <div className="mb-4">
            <Input
              placeholder="권한 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
            />
          </div>

          {/* 권한 카테고리 */}
          <div className="space-y-4">
            {filteredCategories.map((category) => {
              const isExpanded = expandedCategories.has(category.id);
              const categoryPermissions = category.permissions.map(
                (p) => p.key
              );
              const selectedCount = categoryPermissions.filter((p) =>
                currentPermissions.includes(p)
              ).length;
              const allSelected = selectedCount === categoryPermissions.length;

              return (
                <Card key={category.id}>
                  <CardHeader
                    className="cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        {category.icon}
                        <CardTitle className="text-sm">
                          {category.label}
                        </CardTitle>
                        <Badge variant="neutral" size="sm">
                          {selectedCount} / {category.permissions.length}
                        </Badge>
                      </div>
                      <Checkbox
                        checked={allSelected}
                        onChange={() => toggleCategoryAll(category)}
                        onClick={(e) => e.stopPropagation()}
                        label="전체"
                      />
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardBody className="pt-0">
                      <div className="grid grid-cols-2 gap-3">
                        {category.permissions.map((permission) => {
                          const isChecked = currentPermissions.includes(
                            permission.key
                          );
                          return (
                            <div
                              key={permission.key}
                              className={cn(
                                "flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer",
                                isChecked
                                  ? "border-softone-primary bg-softone-primary-light/30"
                                  : "border-softone-border hover:bg-softone-surface-hover"
                              )}
                              onClick={() => togglePermission(permission.key)}
                            >
                              <Checkbox
                                checked={isChecked}
                                onChange={() =>
                                  togglePermission(permission.key)
                                }
                              />
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {permission.label}
                                </div>
                                <div className="text-xs text-softone-text-muted mt-0.5">
                                  {permission.description}
                                </div>
                                <code className="text-xs text-softone-primary bg-softone-primary-light px-1.5 py-0.5 rounded mt-1 inline-block">
                                  {permission.key}
                                </code>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardBody>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

RolePermissionDesignerPage.displayName = "RolePermissionDesignerPage";

export default RolePermissionDesignerPage;
