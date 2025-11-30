/**
 * SoftOne Design System - Menu Management Page
 * 메뉴 관리 CRUD 화면
 *
 * 기능:
 *   - 메뉴 트리 구조 표시
 *   - 메뉴 추가/수정/삭제
 *   - 역할 기반 권한 설정
 *   - 메뉴 순서 변경
 */

import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { Input } from "@core/components/ui/Input";
import { Select } from "@core/components/ui/Select";
import { Checkbox } from "@core/components/ui/Checkbox";
import { CheckboxGroup } from "@core/components/ui/CheckboxGroup";
import { FormFieldWrapper } from "@core/components/ui/FormFieldWrapper";
import { BaseModal } from "@core/components/ui/BaseModal";
import { ConfirmDialog } from "@core/components/ui/ConfirmDialog";
import { useToast } from "@core/hooks/useToast";
import {
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  ChevronDown,
  GripVertical,
  Eye,
  EyeOff,
  RefreshCw,
  Save,
  FolderTree,
  Layers,
} from "lucide-react";

import {
  useMenuStore,
  type MenuItem,
  type MenuFormData,
  type MenuGroup,
} from "@core/store/menuStore";
import { cn } from "@core/utils/classUtils";

// ========================================
// Constants
// ========================================

const AVAILABLE_ICONS = [
  { value: "", label: "아이콘 없음" },
  { value: "LayoutDashboard", label: "대시보드" },
  { value: "Users", label: "사용자" },
  { value: "Calendar", label: "캘린더" },
  { value: "Table", label: "테이블" },
  { value: "FileText", label: "문서" },
  { value: "Settings", label: "설정" },
  { value: "HelpCircle", label: "도움말" },
  { value: "Code2", label: "코드" },
  { value: "Globe", label: "글로브" },
  { value: "Package", label: "패키지" },
  { value: "ShoppingCart", label: "장바구니" },
  { value: "BarChart", label: "차트" },
  { value: "Database", label: "데이터베이스" },
  { value: "Lock", label: "보안" },
];

const AVAILABLE_ROLES = [
  { value: "ADMIN", label: "관리자" },
  { value: "MANAGER", label: "매니저" },
  { value: "USER", label: "일반 사용자" },
  { value: "DEV", label: "개발자" },
];

const BADGE_COLORS = [
  { value: "", label: "없음" },
  { value: "primary", label: "Primary (파란색)" },
  { value: "success", label: "Success (초록색)" },
  { value: "warning", label: "Warning (노란색)" },
  { value: "danger", label: "Danger (빨간색)" },
];

// ========================================
// Validation Schema
// ========================================

const menuSchema = z.object({
  label: z.string().min(1, "메뉴 이름을 입력하세요"),
  path: z
    .string()
    .min(1, "경로를 입력하세요")
    .startsWith("/", "경로는 /로 시작해야 합니다"),
  parentId: z.string().nullable(),
  icon: z.string().optional(),
  roles: z.array(z.string()),
  order: z.number().min(0, "순서는 0 이상이어야 합니다"),
  group: z.string().optional(),
  hideInMenu: z.boolean(),
  badge: z.string().optional(),
  badgeColor: z
    .enum(["primary", "success", "warning", "danger", ""])
    .optional(),
  isActive: z.boolean(),
});

type MenuFormValues = z.infer<typeof menuSchema>;

// ========================================
// Menu Tree Item Component
// ========================================

interface MenuTreeItemProps {
  menu: MenuItem;
  depth?: number;
  onEdit: (menu: MenuItem) => void;
  onDelete: (menu: MenuItem) => void;
  onToggle: (menu: MenuItem) => void;
}

const MenuTreeItem: React.FC<MenuTreeItemProps> = ({
  menu,
  depth = 0,
  onEdit,
  onDelete,
  onToggle,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = menu.children && menu.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-50 group",
          !menu.isActive && "opacity-50"
        )}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {/* Expand/Collapse */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        ) : (
          <span className="w-6" />
        )}

        {/* Drag Handle */}
        <GripVertical className="w-4 h-4 text-gray-300 cursor-grab" />

        {/* Menu Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{menu.label}</span>
            {menu.badge && (
              <Badge variant={menu.badgeColor || "primary"} size="sm">
                {menu.badge}
              </Badge>
            )}
            {menu.hideInMenu && <EyeOff className="w-3 h-3 text-gray-400" />}
            {!menu.isActive && (
              <Badge variant="neutral" size="sm">
                비활성
              </Badge>
            )}
          </div>
          <div className="text-xs text-gray-500 truncate">
            {menu.path}
            {menu.roles.length > 0 && (
              <span className="ml-2 text-blue-500">
                [{menu.roles.join(", ")}]
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggle(menu)}
            className="p-1"
            title={menu.isActive ? "비활성화" : "활성화"}
          >
            {menu.isActive ? (
              <Eye className="w-4 h-4 text-green-500" />
            ) : (
              <EyeOff className="w-4 h-4 text-gray-400" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(menu)}
            className="p-1"
          >
            <Edit className="w-4 h-4 text-blue-500" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(menu)}
            className="p-1"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {menu.children!.map((child) => (
            <MenuTreeItem
              key={child.id}
              menu={child}
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ========================================
// Menu Form Component
// ========================================

interface MenuFormProps {
  menu?: MenuItem | null;
  parentMenus: MenuItem[];
  menuGroups: MenuGroup[];
  onSubmit: (data: MenuFormData) => void;
  onCancel: () => void;
}

const MenuForm: React.FC<MenuFormProps> = ({
  menu,
  parentMenus,
  menuGroups,
  onSubmit,
  onCancel,
}) => {
  const isEditMode = !!menu;

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<MenuFormValues>({
    resolver: zodResolver(menuSchema),
    defaultValues: menu
      ? {
          label: menu.label,
          path: menu.path,
          parentId: menu.parentId,
          icon: menu.icon || "",
          roles: menu.roles,
          order: menu.order,
          group: menu.group || "",
          hideInMenu: menu.hideInMenu || false,
          badge: menu.badge || "",
          badgeColor: menu.badgeColor || "",
          isActive: menu.isActive,
        }
      : {
          label: "",
          path: "/",
          parentId: null,
          icon: "",
          roles: [],
          order: 0,
          group: "main",
          hideInMenu: false,
          badge: "",
          badgeColor: "",
          isActive: true,
        },
  });

  const selectedRoles = watch("roles");

  const handleFormSubmit = (data: MenuFormValues) => {
    onSubmit({
      ...data,
      icon: data.icon || undefined,
      group: data.group || undefined,
      badge: data.badge || undefined,
      badgeColor: data.badgeColor as MenuFormData["badgeColor"],
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 기본 정보 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">기본 정보</h3>

        <div className="grid grid-cols-2 gap-4">
          <FormFieldWrapper
            label="메뉴 이름"
            required
            errorMessage={errors.label?.message}
          >
            <Input {...register("label")} placeholder="메뉴 이름" />
          </FormFieldWrapper>

          <FormFieldWrapper
            label="경로"
            required
            errorMessage={errors.path?.message}
          >
            <Input {...register("path")} placeholder="/path" />
          </FormFieldWrapper>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormFieldWrapper label="부모 메뉴">
            <Controller
              name="parentId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value || null)}
                  options={[
                    { value: "", label: "최상위 메뉴" },
                    ...parentMenus
                      .filter((m) => m.id !== menu?.id)
                      .map((m) => ({ value: m.id, label: m.label })),
                  ]}
                />
              )}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="메뉴 그룹">
            <Controller
              name="group"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || ""}
                  options={[
                    { value: "", label: "없음" },
                    ...menuGroups.map((g) => ({
                      value: g.id,
                      label: g.label || g.id,
                    })),
                  ]}
                />
              )}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="아이콘">
            <Controller
              name="icon"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || ""}
                  options={AVAILABLE_ICONS}
                />
              )}
            />
          </FormFieldWrapper>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormFieldWrapper label="순서" errorMessage={errors.order?.message}>
            <Controller
              name="order"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </FormFieldWrapper>

          <FormFieldWrapper label="배지 텍스트">
            <Input {...register("badge")} placeholder="New, Beta 등" />
          </FormFieldWrapper>

          <FormFieldWrapper label="배지 색상">
            <Controller
              name="badgeColor"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || ""}
                  options={BADGE_COLORS}
                />
              )}
            />
          </FormFieldWrapper>
        </div>
      </div>

      {/* 권한 설정 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">
          권한 설정
          <span className="ml-2 font-normal text-gray-500">
            (비어있으면 모든 사용자 접근 가능)
          </span>
        </h3>

        <Controller
          name="roles"
          control={control}
          render={({ field }) => (
            <CheckboxGroup
              value={field.value}
              onChange={field.onChange}
              options={AVAILABLE_ROLES}
              direction="horizontal"
            />
          )}
        />

        {selectedRoles.length > 0 && (
          <div className="text-sm text-blue-600">
            선택된 역할: {selectedRoles.join(", ")}
          </div>
        )}
      </div>

      {/* 옵션 */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold border-b pb-2">옵션</h3>

        <div className="flex items-center gap-6">
          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <span className="text-sm">활성화</span>
              </label>
            )}
          />

          <Controller
            name="hideInMenu"
            control={control}
            render={({ field }) => (
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
                <span className="text-sm">메뉴에서 숨기기</span>
              </label>
            )}
          />
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button
          type="submit"
          variant="primary"
          leftIcon={<Save className="w-4 h-4" />}
        >
          {isEditMode ? "수정" : "추가"}
        </Button>
      </div>
    </form>
  );
};

// ========================================
// MenuManagementPage Component
// ========================================

export const MenuManagementPage: React.FC = () => {
  const toast = useToast();

  // Store
  const {
    allMenus,
    menuGroups,
    isLoading,
    isLoaded,
    loadMenus,
    addMenu,
    updateMenu,
    deleteMenu,
    getParentMenus,
  } = useMenuStore();

  // Local State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");

  // 초기 로드
  useEffect(() => {
    if (!isLoaded) {
      loadMenus();
    }
  }, [isLoaded, loadMenus]);

  // 부모 메뉴 목록
  const parentMenus = useMemo(
    () => getParentMenus(),
    [getParentMenus, allMenus]
  );

  // 핸들러
  const handleAddMenu = useCallback(() => {
    setSelectedMenu(null);
    setFormMode("create");
    setIsFormModalOpen(true);
  }, []);

  const handleEditMenu = useCallback((menu: MenuItem) => {
    setSelectedMenu(menu);
    setFormMode("edit");
    setIsFormModalOpen(true);
  }, []);

  const handleDeleteMenuClick = useCallback((menu: MenuItem) => {
    setSelectedMenu(menu);
    setIsDeleteModalOpen(true);
  }, []);

  const handleToggleMenu = useCallback(
    (menu: MenuItem) => {
      updateMenu(menu.id, { isActive: !menu.isActive });
      toast.info(
        `메뉴 "${menu.label}"이(가) ${
          !menu.isActive ? "활성화" : "비활성화"
        }되었습니다.`
      );
    },
    [updateMenu, toast]
  );

  const handleFormSubmit = useCallback(
    (data: MenuFormData) => {
      if (formMode === "create") {
        addMenu(data);
        toast.success("메뉴가 추가되었습니다.");
      } else if (selectedMenu) {
        updateMenu(selectedMenu.id, data);
        toast.success("메뉴가 수정되었습니다.");
      }
      setIsFormModalOpen(false);
      setSelectedMenu(null);
    },
    [formMode, selectedMenu, addMenu, updateMenu, toast]
  );

  const handleDeleteConfirm = useCallback(() => {
    if (selectedMenu) {
      deleteMenu(selectedMenu.id);
      toast.success("메뉴가 삭제되었습니다.");
    }
    setIsDeleteModalOpen(false);
    setSelectedMenu(null);
  }, [selectedMenu, deleteMenu, toast]);

  const handleRefresh = useCallback(() => {
    loadMenus();
    toast.info("메뉴가 새로고침되었습니다.");
  }, [loadMenus, toast]);

  // 통계
  const stats = useMemo(() => {
    let totalMenus = 0;
    let activeMenus = 0;
    let hiddenMenus = 0;

    const countMenus = (menus: MenuItem[]) => {
      menus.forEach((menu) => {
        totalMenus++;
        if (menu.isActive) activeMenus++;
        if (menu.hideInMenu) hiddenMenus++;
        if (menu.children) countMenus(menu.children);
      });
    };

    countMenus(allMenus);
    return { totalMenus, activeMenus, hiddenMenus };
  }, [allMenus]);

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="메뉴 관리"
        subtitle="사이드바 메뉴를 추가, 수정, 삭제하고 권한을 설정합니다."
        icon={<FolderTree className="w-5 h-5 text-softone-primary" />}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              새로고침
            </Button>
            <Button
              variant="primary"
              onClick={handleAddMenu}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              메뉴 추가
            </Button>
          </div>
        }
      />

      {/* 통계 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <Layers className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">전체 메뉴</div>
              <div className="text-2xl font-bold">{stats.totalMenus}</div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">활성 메뉴</div>
              <div className="text-2xl font-bold">{stats.activeMenus}</div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <EyeOff className="w-6 h-6 text-gray-600" />
            </div>
            <div>
              <div className="text-sm text-gray-500">숨겨진 메뉴</div>
              <div className="text-2xl font-bold">{stats.hiddenMenus}</div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* 메뉴 트리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderTree className="w-5 h-5" />
            메뉴 구조
          </CardTitle>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : allMenus.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              등록된 메뉴가 없습니다.
              <br />
              <Button
                variant="primary"
                className="mt-4"
                onClick={handleAddMenu}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                첫 메뉴 추가하기
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              {allMenus.map((menu) => (
                <MenuTreeItem
                  key={menu.id}
                  menu={menu}
                  onEdit={handleEditMenu}
                  onDelete={handleDeleteMenuClick}
                  onToggle={handleToggleMenu}
                />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* 그룹 관리 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" />
            메뉴 그룹
          </CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {menuGroups.map((group) => (
              <div
                key={group.id}
                className="p-3 bg-gray-50 rounded-lg border text-center"
              >
                <div className="font-medium">{group.label || "(메인)"}</div>
                <div className="text-xs text-gray-500">ID: {group.id}</div>
                <div className="text-xs text-gray-500">순서: {group.order}</div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* 폼 모달 */}
      <BaseModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={formMode === "create" ? "메뉴 추가" : "메뉴 수정"}
        size="lg"
      >
        <MenuForm
          menu={selectedMenu}
          parentMenus={parentMenus}
          menuGroups={menuGroups}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormModalOpen(false)}
        />
      </BaseModal>

      {/* 삭제 확인 */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="메뉴 삭제"
        message={
          selectedMenu
            ? `"${selectedMenu.label}" 메뉴를 삭제하시겠습니까?${
                selectedMenu.children && selectedMenu.children.length > 0
                  ? " 하위 메뉴도 함께 삭제됩니다."
                  : ""
              }`
            : ""
        }
        confirmLabel="삭제"
        variant="danger"
      />
    </div>
  );
};

MenuManagementPage.displayName = "MenuManagementPage";
