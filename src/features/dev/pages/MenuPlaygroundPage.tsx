/**
 * SoftOne Design System - Menu Playground Page
 * 작성: SoftOne Frontend Team
 *
 * 이 파일은 RBAC 및 4 Depth 메뉴 구조를 시각적으로 설명하기 위한 Playground 용 샘플입니다.
 * 실제 로그인/권한과는 독립적으로 동작하며, 교육/데모/테스트 용도로만 사용됩니다.
 *
 * 이 페이지는 로그인 상태/실제 권한과 무관하게,
 * 메뉴/권한 구조를 시각적으로 설명하기 위한 Playground입니다.
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  Play,
  RotateCcw,
  Eye,
  EyeOff,
  Info,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
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
import { Select } from "@core/components/ui/Select";
import { Checkbox } from "@core/components/ui/Checkbox";
import { JsonViewer } from "@core/components/ui/JsonViewer";
import { useToast } from "@core/hooks/useToast";
import { cn } from "@core/utils/classUtils";

// Role/Permission 타입 및 매핑
import {
  ROLES,
  GRADES,
  PERMISSION_KEYS,
  ROLE_PERMISSION_MAP,
  GRADE_PERMISSION_BOOST,
  type Role,
  type Grade,
  type PermissionKey,
} from "@core/auth/role.types";

// 메뉴 트리
import { menuTree, getPathByRouteKey } from "@core/router/menuConfig";
import type {
  MenuNode,
  CategoryMenuNode,
  MenuGroupNode,
} from "@core/router/menu.types";
import {
  isPageNode,
  isMenuGroupNode,
  hasChildren,
} from "@core/router/menu.types";

// Preview 컴포넌트
import { MenuPreviewTree } from "../components/MenuPreviewTree";

// ========================================
// Constants
// ========================================

const ROLE_LABELS: Record<Role, string> = {
  SYSTEM_ADMIN: "시스템 관리자",
  ORG_ADMIN: "조직 관리자",
  MANAGER: "매니저",
  STAFF: "일반 직원",
  GUEST: "게스트",
};

const GRADE_LABELS: Record<Grade, string> = {
  EXECUTIVE: "임원",
  TEAM_LEAD: "팀장",
  SENIOR: "선임",
  JUNIOR: "주니어",
  INTERN: "인턴",
};

// 자주 사용되는 Extra Permission 옵션
const EXTRA_PERMISSION_OPTIONS: { key: PermissionKey; label: string }[] = [
  { key: PERMISSION_KEYS.PAGE_GRID_SAMPLES_VIEW, label: "그리드 샘플 조회" },
  {
    key: PERMISSION_KEYS.ACTION_DASHBOARD_OPS_VIEW,
    label: "운영 대시보드 조회",
  },
  { key: PERMISSION_KEYS.MENU_DOCS_SWAGGER_VIEW, label: "Swagger 문서 조회" },
  { key: PERMISSION_KEYS.ACTION_USERS_CREATE, label: "사용자 생성" },
  { key: PERMISSION_KEYS.ACTION_USERS_DELETE, label: "사용자 삭제" },
  { key: PERMISSION_KEYS.PII_VIEW_FULL, label: "전체 개인정보 조회" },
  { key: PERMISSION_KEYS.PII_EXPORT, label: "개인정보 내보내기" },
  {
    key: PERMISSION_KEYS.ACTION_SYSTEM_SETTINGS_UPDATE,
    label: "시스템 설정 수정",
  },
];

// ========================================
// Helper Functions
// ========================================

/**
 * Role과 Grade로 Permission 목록 계산
 */
function computeSimulatedPermissions(
  role: Role,
  grade: Grade,
  extraPermissions: PermissionKey[]
): PermissionKey[] {
  const rolePerms = ROLE_PERMISSION_MAP[role] || [];
  const gradeBoost = GRADE_PERMISSION_BOOST[grade] || [];
  const combined = new Set([...rolePerms, ...gradeBoost, ...extraPermissions]);
  return Array.from(combined);
}

/**
 * 메뉴 트리에서 접근 가능한 routeKey 추출
 */
function getAccessibleRouteKeys(
  nodes: MenuNode[],
  permissions: PermissionKey[]
): string[] {
  const keys: string[] = [];

  const traverse = (nodeList: MenuNode[]) => {
    nodeList.forEach((node) => {
      const hasPermission =
        !node.requiredPermissions ||
        node.requiredPermissions.length === 0 ||
        node.requiredPermissions.every((p) => permissions.includes(p));

      if (hasPermission) {
        if (isPageNode(node)) {
          keys.push(node.routeKey);
        }
        if (isMenuGroupNode(node) && node.routeKey) {
          keys.push(node.routeKey);
        }
      }

      if (hasChildren(node)) {
        traverse((node as CategoryMenuNode | MenuGroupNode).children!);
      }
    });
  };

  traverse(nodes);
  return keys;
}

// ========================================
// Component
// ========================================

export const MenuPlaygroundPage: React.FC = () => {
  const toast = useToast();

  // Control 상태
  const [selectedRole, setSelectedRole] = useState<Role>("STAFF");
  const [selectedGrade, setSelectedGrade] = useState<Grade>("JUNIOR");
  const [extraPermissions, setExtraPermissions] = useState<Set<PermissionKey>>(
    new Set()
  );
  const [showHiddenNodes, setShowHiddenNodes] = useState(true);
  const [selectedRouteKey, setSelectedRouteKey] = useState<
    string | undefined
  >();
  const [copied, setCopied] = useState(false);

  // 시뮬레이션된 권한 목록
  const [simulatedPermissions, setSimulatedPermissions] = useState<
    PermissionKey[]
  >(() => computeSimulatedPermissions(selectedRole, selectedGrade, []));

  // 접근 가능한 routeKey 목록
  const accessibleRouteKeys = useMemo(
    () => getAccessibleRouteKeys(menuTree, simulatedPermissions),
    [simulatedPermissions]
  );

  // Extra Permission 토글
  const toggleExtraPermission = useCallback((key: PermissionKey) => {
    setExtraPermissions((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  // 시뮬레이션 실행
  const handleSimulate = useCallback(() => {
    const permissions = computeSimulatedPermissions(
      selectedRole,
      selectedGrade,
      Array.from(extraPermissions)
    );
    setSimulatedPermissions(permissions);
    toast.success(
      `시뮬레이션 완료: ${ROLE_LABELS[selectedRole]} / ${GRADE_LABELS[selectedGrade]} (${permissions.length}개 권한)`
    );
  }, [selectedRole, selectedGrade, extraPermissions, toast]);

  // 초기화
  const handleReset = useCallback(() => {
    setSelectedRole("STAFF");
    setSelectedGrade("JUNIOR");
    setExtraPermissions(new Set());
    setSimulatedPermissions(computeSimulatedPermissions("STAFF", "JUNIOR", []));
    setSelectedRouteKey(undefined);
    toast.info("설정이 초기화되었습니다.");
  }, [toast]);

  // JSON 복사
  const handleCopyJson = useCallback(async () => {
    const data = {
      role: selectedRole,
      grade: selectedGrade,
      permissions: simulatedPermissions,
      accessibleRoutes: accessibleRouteKeys,
    };
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("JSON이 클립보드에 복사되었습니다.");
  }, [
    selectedRole,
    selectedGrade,
    simulatedPermissions,
    accessibleRouteKeys,
    toast,
  ]);

  // 선택된 routeKey의 경로 정보
  const selectedPath = selectedRouteKey
    ? getPathByRouteKey(selectedRouteKey)
    : null;

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="Menu / Permission Playground"
        subtitle="로그인 없이 Role/Grade/Permission 조합에 따라 메뉴 노출이 어떻게 달라지는지 시각적으로 확인하는 샘플입니다."
        icon={<Play className="w-6 h-6 text-softone-primary" />}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              초기화
            </Button>
            <Button
              variant="primary"
              onClick={handleSimulate}
              leftIcon={<Play className="w-4 h-4" />}
            >
              시뮬레이션
            </Button>
          </div>
        }
      />

      {/* 안내 메시지 */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 dark:text-blue-300">
          <strong>실제 로그인과 무관합니다.</strong> 여기서 선택한
          Role/Grade/Permissions만으로 우측 프리뷰의 메뉴 트리가 렌더링됩니다.
          실제 authStore는 변경되지 않습니다.
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 좌측: Control Panel */}
        <div className="col-span-4 space-y-4">
          {/* Role 선택 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Role (역할) 선택</CardTitle>
            </CardHeader>
            <CardBody>
              <Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as Role)}
                options={ROLES.map((role) => ({
                  value: role,
                  label: `${ROLE_LABELS[role]} (${role})`,
                }))}
              />
              <p className="text-xs text-softone-text-muted mt-2">
                {ROLE_PERMISSION_MAP[selectedRole]?.length || 0}개 기본 권한
              </p>
            </CardBody>
          </Card>

          {/* Grade 선택 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Grade (직급) 선택</CardTitle>
            </CardHeader>
            <CardBody>
              <Select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value as Grade)}
                options={GRADES.map((grade) => ({
                  value: grade,
                  label: `${GRADE_LABELS[grade]} (${grade})`,
                }))}
              />
              <p className="text-xs text-softone-text-muted mt-2">
                {GRADE_PERMISSION_BOOST[selectedGrade]?.length || 0}개 추가 권한
              </p>
            </CardBody>
          </Card>

          {/* Extra Permissions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Extra Permissions</CardTitle>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {EXTRA_PERMISSION_OPTIONS.map((option) => (
                  <label
                    key={option.key}
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-softone-surface-hover cursor-pointer"
                  >
                    <Checkbox
                      checked={extraPermissions.has(option.key)}
                      onChange={() => toggleExtraPermission(option.key)}
                    />
                    <div className="flex-1">
                      <div className="text-sm">{option.label}</div>
                      <code className="text-xs text-softone-text-muted">
                        {option.key}
                      </code>
                    </div>
                  </label>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* 표시 옵션 */}
          <Card>
            <CardBody>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={showHiddenNodes}
                  onChange={() => setShowHiddenNodes(!showHiddenNodes)}
                />
                <div className="flex items-center gap-2">
                  {showHiddenNodes ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                  <span className="text-sm">권한 없는 메뉴 표시</span>
                </div>
              </label>
              <p className="text-xs text-softone-text-muted mt-2 ml-6">
                활성화하면 권한이 없는 메뉴도 흐리게 표시됩니다.
              </p>
            </CardBody>
          </Card>
        </div>

        {/* 우측: Preview Panel */}
        <div className="col-span-8 space-y-4">
          {/* 상태 표시 */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="primary" size="md">
                    {ROLE_LABELS[selectedRole]}
                  </Badge>
                  <Badge variant="info" size="md">
                    {GRADE_LABELS[selectedGrade]}
                  </Badge>
                  <span className="text-sm text-softone-text-muted">
                    권한 {simulatedPermissions.length}개 활성화됨
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyJson}
                  leftIcon={
                    copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )
                  }
                >
                  {copied ? "복사됨!" : "JSON 복사"}
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* 메뉴 프리뷰 */}
          <Card className="overflow-hidden">
            <div className="h-[500px]">
              <MenuPreviewTree
                menuTree={menuTree}
                permissions={simulatedPermissions}
                title="Simulated Sidebar Preview"
                showHiddenNodes={showHiddenNodes}
                selectedRouteKey={selectedRouteKey}
                onSelectRouteKey={setSelectedRouteKey}
              />
            </div>
          </Card>

          {/* 선택된 Route 정보 */}
          {selectedRouteKey && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">선택된 페이지 정보</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-softone-text-muted">routeKey</div>
                    <code className="text-softone-primary">
                      {selectedRouteKey}
                    </code>
                  </div>
                  <div>
                    <div className="text-softone-text-muted">path</div>
                    <code className="text-softone-primary">
                      {selectedPath || "N/A"}
                    </code>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* JSON 뷰어 */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  활성 권한 ({simulatedPermissions.length}개)
                </CardTitle>
              </CardHeader>
              <CardBody className="p-0">
                <div className="max-h-48 overflow-auto p-4">
                  <div className="flex flex-wrap gap-1">
                    {simulatedPermissions.slice(0, 20).map((perm) => (
                      <code
                        key={perm}
                        className="text-xs bg-softone-primary-light text-softone-primary px-1.5 py-0.5 rounded"
                      >
                        {perm}
                      </code>
                    ))}
                    {simulatedPermissions.length > 20 && (
                      <span className="text-xs text-softone-text-muted">
                        +{simulatedPermissions.length - 20}개 더...
                      </span>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  접근 가능 페이지 ({accessibleRouteKeys.length}개)
                </CardTitle>
              </CardHeader>
              <CardBody className="p-0">
                <div className="max-h-48 overflow-auto p-4">
                  <div className="space-y-1">
                    {accessibleRouteKeys.map((key) => (
                      <div
                        key={key}
                        className={cn(
                          "text-xs px-2 py-1 rounded cursor-pointer transition-colors",
                          selectedRouteKey === key
                            ? "bg-softone-primary text-white"
                            : "bg-softone-bg hover:bg-softone-surface-hover"
                        )}
                        onClick={() => setSelectedRouteKey(key)}
                      >
                        {key}
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

MenuPlaygroundPage.displayName = "MenuPlaygroundPage";

export default MenuPlaygroundPage;
