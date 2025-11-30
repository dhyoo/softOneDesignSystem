/**
 * SoftOne Design System - User Menu Policy Designer Page
 * 작성: SoftOne Frontend Team
 *
 * 이 파일은 사용자 단위(User Menu Policy) 메뉴/기능 접근 권한을 정의/적용하기 위한 구현입니다.
 * Role/Grade 기반 RBAC 위에, 사용자별 예외 정책(허용/차단/기본 진입 페이지)을 오버레이합니다.
 *
 * 기능:
 *   - 사용자 검색 및 선택
 *   - 선택한 사용자의 Role/Grade 정보 표시
 *   - 허용/차단할 PermissionKey 편집
 *   - 허용/차단할 routeKey 편집
 *   - 기본 랜딩 페이지 선택
 *   - 정책 저장/삭제
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  User,
  Shield,
  Save,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  AlertTriangle,
  Home,
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
} from "lucide-react";

import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Input } from "@core/components/ui/Input";
import { Select } from "@core/components/ui/Select";
import { Checkbox } from "@core/components/ui/Checkbox";
import { Badge } from "@core/components/ui/Badge";
import { Tabs } from "@core/components/ui/Tabs";
import { ConfirmDialog } from "@core/components/ui/ConfirmDialog";
import { useToast } from "@core/hooks/useToast";

import { PERMISSION_KEYS, type PermissionKey } from "@core/auth/role.types";
import type {
  UserMenuPolicy,
  UserMenuPolicyInput,
} from "@core/auth/userMenuPolicy.types";
import {
  fetchUserMenuPolicy,
  saveUserMenuPolicy,
  deleteUserMenuPolicy,
  searchUsersForPolicy,
  fetchAllUserMenuPolicies,
} from "@core/api/userMenuPolicyApi";
import { menuTree } from "@core/router/menuConfig";
import type { MenuNode } from "@core/router/menu.types";
import {
  isMenuGroupNode,
  isPageNode,
  hasChildren,
} from "@core/router/menu.types";

// ========================================
// Types
// ========================================

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

interface PermissionCategory {
  id: string;
  label: string;
  permissions: { key: PermissionKey; label: string }[];
}

// ========================================
// Constants
// ========================================

/**
 * 권한을 카테고리별로 그룹화
 */
const PERMISSION_CATEGORIES: PermissionCategory[] = [
  {
    id: "menu",
    label: "메뉴 권한",
    permissions: Object.entries(PERMISSION_KEYS)
      .filter(([, value]) => value.startsWith("menu:"))
      .map(([key, value]) => ({ key: value, label: key })),
  },
  {
    id: "page",
    label: "페이지 권한",
    permissions: Object.entries(PERMISSION_KEYS)
      .filter(([, value]) => value.startsWith("page:"))
      .map(([key, value]) => ({ key: value, label: key })),
  },
  {
    id: "action",
    label: "액션 권한",
    permissions: Object.entries(PERMISSION_KEYS)
      .filter(([, value]) => value.startsWith("action:"))
      .map(([key, value]) => ({ key: value, label: key })),
  },
  {
    id: "pii",
    label: "개인정보 권한",
    permissions: Object.entries(PERMISSION_KEYS)
      .filter(([, value]) => value.startsWith("pii:"))
      .map(([key, value]) => ({ key: value, label: key })),
  },
];

/**
 * routeKey 추출
 */
function extractRouteKeys(nodes: MenuNode[]): string[] {
  const keys: string[] = [];

  function traverse(nodeList: MenuNode[]) {
    for (const node of nodeList) {
      if (isPageNode(node)) {
        keys.push(node.routeKey);
      } else if (isMenuGroupNode(node) && node.routeKey) {
        keys.push(node.routeKey);
      }
      if (hasChildren(node)) {
        traverse(node.children!);
      }
    }
  }

  traverse(nodes);
  return keys;
}

const ALL_ROUTE_KEYS = extractRouteKeys(menuTree);

// ========================================
// Sub Components
// ========================================

interface UserSearchProps {
  onSelect: (user: UserInfo) => void;
  selectedUserId?: string;
}

const UserSearch: React.FC<UserSearchProps> = ({
  onSelect,
  selectedUserId,
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    try {
      const users = await searchUsersForPolicy(query);
      setResults(users);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 300);
    return () => clearTimeout(timer);
  }, [handleSearch]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-softone-text-muted" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="사용자 검색 (이름, 이메일, ID)"
          className="pl-10"
        />
      </div>

      <div className="max-h-64 overflow-y-auto border border-softone-border rounded-lg divide-y divide-softone-border">
        {isLoading ? (
          <div className="p-4 text-center text-softone-text-muted">
            검색 중...
          </div>
        ) : results.length === 0 ? (
          <div className="p-4 text-center text-softone-text-muted">
            검색 결과가 없습니다
          </div>
        ) : (
          results.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelect(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-softone-surface-hover transition-colors text-left ${
                selectedUserId === user.id ? "bg-softone-primary-light" : ""
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-softone-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-softone-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-softone-text truncate">
                  {user.name}
                </div>
                <div className="text-sm text-softone-text-muted truncate">
                  {user.email}
                </div>
              </div>
              {selectedUserId === user.id && (
                <CheckCircle className="w-5 h-5 text-softone-primary shrink-0" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

interface PermissionEditorProps {
  title: string;
  description: string;
  selectedPermissions: PermissionKey[];
  onChange: (permissions: PermissionKey[]) => void;
  variant: "allowed" | "denied";
}

const PermissionEditor: React.FC<PermissionEditorProps> = ({
  title,
  description,
  selectedPermissions,
  onChange,
  variant,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["menu"])
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const togglePermission = (permission: PermissionKey) => {
    const isSelected = selectedPermissions.includes(permission);
    if (isSelected) {
      onChange(selectedPermissions.filter((p) => p !== permission));
    } else {
      onChange([...selectedPermissions, permission]);
    }
  };

  const toggleAllInCategory = (category: PermissionCategory) => {
    const categoryPerms = category.permissions.map((p) => p.key);
    const allSelected = categoryPerms.every((p) =>
      selectedPermissions.includes(p)
    );

    if (allSelected) {
      onChange(selectedPermissions.filter((p) => !categoryPerms.includes(p)));
    } else {
      onChange([
        ...new Set([...selectedPermissions, ...categoryPerms]),
      ] as PermissionKey[]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-softone-text flex items-center gap-2">
            {variant === "allowed" ? (
              <Plus className="w-4 h-4 text-green-500" />
            ) : (
              <Minus className="w-4 h-4 text-red-500" />
            )}
            {title}
          </h4>
          <p className="text-sm text-softone-text-muted">{description}</p>
        </div>
        <Badge variant={variant === "allowed" ? "success" : "danger"} size="sm">
          {selectedPermissions.length}개 선택
        </Badge>
      </div>

      <div className="border border-softone-border rounded-lg divide-y divide-softone-border max-h-80 overflow-y-auto">
        {PERMISSION_CATEGORIES.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const selectedCount = category.permissions.filter((p) =>
            selectedPermissions.includes(p.key)
          ).length;

          return (
            <div key={category.id}>
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full p-3 flex items-center justify-between hover:bg-softone-surface-hover transition-colors"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">{category.label}</span>
                  {selectedCount > 0 && (
                    <Badge variant="primary" size="sm">
                      {selectedCount}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAllInCategory(category);
                  }}
                >
                  {category.permissions.every((p) =>
                    selectedPermissions.includes(p.key)
                  )
                    ? "모두 해제"
                    : "모두 선택"}
                </Button>
              </button>

              {isExpanded && (
                <div className="p-3 bg-softone-surface-secondary space-y-2">
                  {category.permissions.map((perm) => (
                    <label
                      key={perm.key}
                      className="flex items-center gap-2 cursor-pointer hover:bg-softone-surface-hover p-1.5 rounded"
                    >
                      <Checkbox
                        checked={selectedPermissions.includes(perm.key)}
                        onChange={() => togglePermission(perm.key)}
                      />
                      <span className="text-sm text-softone-text-secondary font-mono">
                        {perm.key}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface RouteKeyEditorProps {
  title: string;
  description: string;
  selectedRouteKeys: string[];
  onChange: (routeKeys: string[]) => void;
  variant: "allowed" | "denied";
}

const RouteKeyEditor: React.FC<RouteKeyEditorProps> = ({
  title,
  description,
  selectedRouteKeys,
  onChange,
  variant,
}) => {
  const [filter, setFilter] = useState("");

  const filteredRouteKeys = useMemo(() => {
    if (!filter) return ALL_ROUTE_KEYS;
    return ALL_ROUTE_KEYS.filter((key) =>
      key.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  const toggleRouteKey = (routeKey: string) => {
    const isSelected = selectedRouteKeys.includes(routeKey);
    if (isSelected) {
      onChange(selectedRouteKeys.filter((k) => k !== routeKey));
    } else {
      onChange([...selectedRouteKeys, routeKey]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-softone-text flex items-center gap-2">
            {variant === "allowed" ? (
              <Eye className="w-4 h-4 text-green-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-red-500" />
            )}
            {title}
          </h4>
          <p className="text-sm text-softone-text-muted">{description}</p>
        </div>
        <Badge variant={variant === "allowed" ? "success" : "danger"} size="sm">
          {selectedRouteKeys.length}개 선택
        </Badge>
      </div>

      <Input
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="routeKey 필터..."
        className="text-sm"
      />

      <div className="border border-softone-border rounded-lg max-h-64 overflow-y-auto divide-y divide-softone-border">
        {filteredRouteKeys.map((routeKey) => (
          <label
            key={routeKey}
            className="flex items-center gap-3 p-2.5 cursor-pointer hover:bg-softone-surface-hover transition-colors"
          >
            <Checkbox
              checked={selectedRouteKeys.includes(routeKey)}
              onChange={() => toggleRouteKey(routeKey)}
            />
            <span className="text-sm font-mono text-softone-text-secondary">
              {routeKey}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ========================================
// Main Component
// ========================================

export const UserMenuPolicyDesignerPage: React.FC = () => {
  const toast = useToast();

  // State
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [policy, setPolicy] = useState<UserMenuPolicyInput>({
    allowedPermissions: [],
    deniedPermissions: [],
    allowedRouteKeys: undefined,
    deniedRouteKeys: [],
    defaultLandingRouteKey: undefined,
    description: "",
    isActive: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [existingPolicies, setExistingPolicies] = useState<UserMenuPolicy[]>(
    []
  );
  const [useWhitelist, setUseWhitelist] = useState(false);

  // Load existing policies on mount
  useEffect(() => {
    fetchAllUserMenuPolicies().then(setExistingPolicies);
  }, []);

  // Load policy when user is selected
  useEffect(() => {
    if (selectedUser) {
      setIsLoading(true);
      fetchUserMenuPolicy(selectedUser.id)
        .then((loadedPolicy) => {
          if (loadedPolicy) {
            setPolicy({
              allowedPermissions: loadedPolicy.allowedPermissions || [],
              deniedPermissions: loadedPolicy.deniedPermissions || [],
              allowedRouteKeys: loadedPolicy.allowedRouteKeys,
              deniedRouteKeys: loadedPolicy.deniedRouteKeys || [],
              defaultLandingRouteKey: loadedPolicy.defaultLandingRouteKey,
              description: loadedPolicy.description || "",
              isActive: loadedPolicy.isActive ?? true,
            });
            setUseWhitelist(
              !!loadedPolicy.allowedRouteKeys &&
                loadedPolicy.allowedRouteKeys.length > 0
            );
          } else {
            // 정책 없음 - 초기화
            setPolicy({
              allowedPermissions: [],
              deniedPermissions: [],
              allowedRouteKeys: undefined,
              deniedRouteKeys: [],
              defaultLandingRouteKey: undefined,
              description: "",
              isActive: true,
            });
            setUseWhitelist(false);
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [selectedUser]);

  // Handlers
  const handleSelectUser = useCallback((user: UserInfo) => {
    setSelectedUser(user);
  }, []);

  const handleSave = useCallback(async () => {
    if (!selectedUser) return;

    setIsSaving(true);
    try {
      const policyToSave: UserMenuPolicyInput = {
        ...policy,
        allowedRouteKeys: useWhitelist ? policy.allowedRouteKeys : undefined,
      };

      const saved = await saveUserMenuPolicy(selectedUser.id, policyToSave);
      if (saved) {
        toast.success("정책이 저장되었습니다.");
        // Refresh existing policies
        const updated = await fetchAllUserMenuPolicies();
        setExistingPolicies(updated);
      } else {
        toast.error("정책 저장에 실패했습니다.");
      }
    } finally {
      setIsSaving(false);
    }
  }, [selectedUser, policy, useWhitelist, toast]);

  const handleDelete = useCallback(async () => {
    if (!selectedUser) return;

    const success = await deleteUserMenuPolicy(selectedUser.id);
    if (success) {
      toast.success("정책이 삭제되었습니다.");
      setPolicy({
        allowedPermissions: [],
        deniedPermissions: [],
        allowedRouteKeys: undefined,
        deniedRouteKeys: [],
        defaultLandingRouteKey: undefined,
        description: "",
        isActive: true,
      });
      setUseWhitelist(false);
      // Refresh existing policies
      const updated = await fetchAllUserMenuPolicies();
      setExistingPolicies(updated);
    } else {
      toast.error("정책 삭제에 실패했습니다.");
    }
    setShowDeleteConfirm(false);
  }, [selectedUser, toast]);

  // Computed
  const hasExistingPolicy = useMemo(() => {
    if (!selectedUser) return false;
    return existingPolicies.some((p) => p.userId === selectedUser.id);
  }, [selectedUser, existingPolicies]);

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="사용자 메뉴 정책 설정"
        subtitle="사용자별로 메뉴/기능 접근 권한을 커스터마이징합니다."
        icon={<Shield className="w-5 h-5 text-softone-primary" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: User Search */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="w-4 h-4" />
              사용자 선택
            </CardTitle>
          </CardHeader>
          <CardBody>
            <UserSearch
              onSelect={handleSelectUser}
              selectedUserId={selectedUser?.id}
            />

            {/* Existing policies summary */}
            <div className="mt-6 pt-6 border-t border-softone-border">
              <h4 className="text-sm font-medium text-softone-text mb-3">
                기존 정책 ({existingPolicies.length})
              </h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {existingPolicies.map((p) => (
                  <button
                    key={p.userId}
                    onClick={() =>
                      handleSelectUser({
                        id: p.userId,
                        name: p.userId,
                        email: "",
                      })
                    }
                    className={`w-full text-left p-2 rounded text-sm transition-colors ${
                      selectedUser?.id === p.userId
                        ? "bg-softone-primary-light text-softone-primary"
                        : "hover:bg-softone-surface-hover"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono">{p.userId}</span>
                      {p.isActive === false && (
                        <Badge variant="neutral" size="sm">
                          비활성
                        </Badge>
                      )}
                    </div>
                    {p.description && (
                      <div className="text-xs text-softone-text-muted mt-1 truncate">
                        {p.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Right: Policy Editor */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="w-4 h-4" />
                정책 설정
                {selectedUser && (
                  <Badge variant="primary" size="sm">
                    {selectedUser.name}
                  </Badge>
                )}
              </CardTitle>

              {selectedUser && (
                <div className="flex items-center gap-2">
                  {hasExistingPolicy && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(true)}
                      leftIcon={<Trash2 className="w-4 h-4" />}
                    >
                      삭제
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSave}
                    disabled={isSaving}
                    leftIcon={
                      isSaving ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )
                    }
                  >
                    저장
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardBody>
            {!selectedUser ? (
              <div className="py-12 text-center text-softone-text-muted">
                <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>왼쪽에서 사용자를 선택해주세요</p>
              </div>
            ) : isLoading ? (
              <div className="py-12 text-center text-softone-text-muted">
                <RefreshCw className="w-8 h-8 mx-auto mb-4 animate-spin" />
                <p>정책 로드 중...</p>
              </div>
            ) : (
              <Tabs defaultValue="permissions">
                <Tabs.List className="mb-6">
                  <Tabs.Trigger value="permissions">권한 설정</Tabs.Trigger>
                  <Tabs.Trigger value="routes">라우트 설정</Tabs.Trigger>
                  <Tabs.Trigger value="options">기타 옵션</Tabs.Trigger>
                </Tabs.List>

                {/* Permissions Tab */}
                <Tabs.Content value="permissions" className="space-y-6">
                  <PermissionEditor
                    title="추가 허용 권한"
                    description="Role/Grade 기반 권한 외에 추가로 부여할 권한"
                    selectedPermissions={policy.allowedPermissions || []}
                    onChange={(perms) =>
                      setPolicy((prev) => ({
                        ...prev,
                        allowedPermissions: perms,
                      }))
                    }
                    variant="allowed"
                  />

                  <PermissionEditor
                    title="차단 권한"
                    description="Role/Grade에서 부여된 권한이라도 차단할 권한"
                    selectedPermissions={policy.deniedPermissions || []}
                    onChange={(perms) =>
                      setPolicy((prev) => ({
                        ...prev,
                        deniedPermissions: perms,
                      }))
                    }
                    variant="denied"
                  />
                </Tabs.Content>

                {/* Routes Tab */}
                <Tabs.Content value="routes" className="space-y-6">
                  <div className="p-4 bg-softone-surface-secondary rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={useWhitelist}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setUseWhitelist(checked);
                          if (!checked) {
                            setPolicy((prev) => ({
                              ...prev,
                              allowedRouteKeys: undefined,
                            }));
                          }
                        }}
                      />
                      <div>
                        <div className="font-medium text-softone-text">
                          화이트리스트 모드 활성화
                        </div>
                        <div className="text-sm text-softone-text-muted">
                          활성화하면 허용된 routeKey만 접근 가능합니다
                        </div>
                      </div>
                    </label>
                  </div>

                  {useWhitelist && (
                    <RouteKeyEditor
                      title="허용 라우트 (화이트리스트)"
                      description="이 목록에 포함된 routeKey만 접근 가능"
                      selectedRouteKeys={policy.allowedRouteKeys || []}
                      onChange={(keys) =>
                        setPolicy((prev) => ({
                          ...prev,
                          allowedRouteKeys: keys,
                        }))
                      }
                      variant="allowed"
                    />
                  )}

                  <RouteKeyEditor
                    title="차단 라우트 (블랙리스트)"
                    description="권한이 있어도 접근 불가능한 routeKey"
                    selectedRouteKeys={policy.deniedRouteKeys || []}
                    onChange={(keys) =>
                      setPolicy((prev) => ({
                        ...prev,
                        deniedRouteKeys: keys,
                      }))
                    }
                    variant="denied"
                  />
                </Tabs.Content>

                {/* Options Tab */}
                <Tabs.Content value="options" className="space-y-6">
                  {/* Default Landing */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-softone-text">
                      <Home className="w-4 h-4 inline mr-1" />
                      기본 랜딩 페이지
                    </label>
                    <Select
                      value={policy.defaultLandingRouteKey || ""}
                      onChange={(e) =>
                        setPolicy((prev) => ({
                          ...prev,
                          defaultLandingRouteKey: e.target.value || undefined,
                        }))
                      }
                      options={[
                        { value: "", label: "기본값 (대시보드)" },
                        ...ALL_ROUTE_KEYS.map((key) => ({
                          value: key,
                          label: key,
                        })),
                      ]}
                    />
                    <p className="text-sm text-softone-text-muted">
                      로그인 후 처음 보여줄 페이지
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-softone-text">
                      정책 설명
                    </label>
                    <Input
                      value={policy.description || ""}
                      onChange={(e) =>
                        setPolicy((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="관리자용 메모"
                    />
                  </div>

                  {/* Active */}
                  <div className="p-4 bg-softone-surface-secondary rounded-lg">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={policy.isActive ?? true}
                        onChange={(e) =>
                          setPolicy((prev) => ({
                            ...prev,
                            isActive: e.target.checked,
                          }))
                        }
                      />
                      <div>
                        <div className="font-medium text-softone-text">
                          정책 활성화
                        </div>
                        <div className="text-sm text-softone-text-muted">
                          비활성화하면 Role/Grade 기본 권한만 적용됩니다
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Warning */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-800">
                        주의사항
                      </div>
                      <div className="text-sm text-yellow-700 mt-1">
                        정책 변경 후 해당 사용자가 다시 로그인해야 변경사항이
                        적용됩니다. 또는 사용자가 페이지를 새로고침해야 합니다.
                      </div>
                    </div>
                  </div>
                </Tabs.Content>
              </Tabs>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="정책 삭제"
        message={`"${selectedUser?.name}" 사용자의 메뉴 정책을 삭제하시겠습니까? 삭제 후에는 Role/Grade 기본 권한만 적용됩니다.`}
        confirmLabel="삭제"
        variant="danger"
      />
    </div>
  );
};

UserMenuPolicyDesignerPage.displayName = "UserMenuPolicyDesignerPage";

export default UserMenuPolicyDesignerPage;
