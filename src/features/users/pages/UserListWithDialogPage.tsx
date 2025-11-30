/**
 * SoftOne Design System - UserListWithDialogPage (Step 10)
 * 작성: SoftOne Frontend Team
 *
 * [목적]
 * - Dialog 시스템(Modal, Confirm, Drawer, FormDialog)의 실제 사용 예시
 * - 행 클릭 → Drawer 상세 보기
 * - 삭제 버튼 → ConfirmDialog
 * - 생성 버튼 → FormDialog
 *
 * [A11y 고려]
 * - 모든 다이얼로그에 적절한 제목과 설명 제공
 * - 키보드로 모든 작업 가능
 */

import React, { useState, useMemo } from "react";
import { z } from "zod";
import { Controller } from "react-hook-form";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  flexRender,
} from "@tanstack/react-table";
import {
  Plus,
  Trash2,
  Eye,
  Edit,
  ChevronUp,
  ChevronDown,
  Users,
} from "lucide-react";

import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardBody,
  Button,
  Badge,
  Input,
  Select,
  Pagination,
  FormFieldWrapper,
  Drawer,
  ConfirmDialog,
  FormDialog,
} from "@core/components/ui";
import { useToast } from "@core/hooks/useToast";
import { cn } from "@core/utils/classUtils";

// ========================================
// Types
// ========================================

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER" | "VIEWER";
  department: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
  phone?: string;
}

// ========================================
// Mock Data
// ========================================

const generateUsers = (): User[] => {
  const roles: User["role"][] = ["ADMIN", "USER", "VIEWER"];
  const statuses: User["status"][] = ["ACTIVE", "INACTIVE", "PENDING"];
  const departments = ["개발팀", "디자인팀", "마케팅팀", "인사팀", "재무팀"];

  return Array.from({ length: 25 }, (_, i) => ({
    id: `user-${i + 1}`,
    name: `사용자 ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % 3],
    department: departments[i % 5],
    status: statuses[i % 3],
    createdAt: new Date(Date.now() - i * 86400000).toISOString().split("T")[0],
    phone: `010-${1000 + i}-${2000 + i}`,
  }));
};

// ========================================
// Form Schema
// ========================================

const userFormSchema = z.object({
  name: z.string().min(2, "이름은 2자 이상이어야 합니다"),
  email: z.string().email("올바른 이메일을 입력하세요"),
  role: z.enum(["ADMIN", "USER", "VIEWER"]),
  department: z.string().min(1, "부서를 입력하세요"),
  phone: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// ========================================
// Status Badge
// ========================================

const StatusBadge: React.FC<{ status: User["status"] }> = ({ status }) => {
  const variants: Record<User["status"], "success" | "danger" | "warning"> = {
    ACTIVE: "success",
    INACTIVE: "danger",
    PENDING: "warning",
  };
  const labels: Record<User["status"], string> = {
    ACTIVE: "활성",
    INACTIVE: "비활성",
    PENDING: "대기",
  };

  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
};

// ========================================
// Role Badge
// ========================================

const RoleBadge: React.FC<{ role: User["role"] }> = ({ role }) => {
  const variants: Record<User["role"], "info" | "neutral" | "warning"> = {
    ADMIN: "info",
    USER: "neutral",
    VIEWER: "warning",
  };

  return <Badge variant={variants[role]}>{role}</Badge>;
};

// ========================================
// User Detail Drawer Content
// ========================================

interface UserDetailProps {
  user: User;
  onEdit: () => void;
  onDelete: () => void;
}

const UserDetailContent: React.FC<UserDetailProps> = ({
  user,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-6">
      {/* 프로필 헤더 */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-softone-primary flex items-center justify-center text-white text-xl font-bold">
          {user.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-softone-text">
            {user.name}
          </h3>
          <div className="flex gap-2 mt-1">
            <RoleBadge role={user.role} />
            <StatusBadge status={user.status} />
          </div>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="space-y-3">
        {[
          { label: "이메일", value: user.email },
          { label: "부서", value: user.department },
          { label: "연락처", value: user.phone || "-" },
          { label: "가입일", value: user.createdAt },
        ].map((item) => (
          <div
            key={item.label}
            className="flex justify-between py-2 border-b border-softone-border"
          >
            <span className="text-softone-text-secondary">{item.label}</span>
            <span className="text-softone-text font-medium">{item.value}</span>
          </div>
        ))}
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2 pt-4">
        <Button variant="secondary" className="flex-1" onClick={onEdit}>
          <Edit className="w-4 h-4 mr-2" />
          수정
        </Button>
        <Button variant="danger" className="flex-1" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-2" />
          삭제
        </Button>
      </div>
    </div>
  );
};

// ========================================
// Main Page Component
// ========================================

export const UserListWithDialogPage: React.FC = () => {
  // ========================================
  // State
  // ========================================
  const [users, setUsers] = useState<User[]>(generateUsers);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const toast = useToast();

  // ========================================
  // Table Columns
  // ========================================

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "이름",
        cell: ({ row }) => (
          <div className="font-medium text-softone-text">
            {row.original.name}
          </div>
        ),
      },
      {
        accessorKey: "email",
        header: "이메일",
        cell: ({ row }) => (
          <span className="text-softone-text-secondary">
            {row.original.email}
          </span>
        ),
      },
      {
        accessorKey: "role",
        header: "역할",
        cell: ({ row }) => <RoleBadge role={row.original.role} />,
      },
      {
        accessorKey: "department",
        header: "부서",
      },
      {
        accessorKey: "status",
        header: "상태",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "createdAt",
        header: "가입일",
      },
      {
        id: "actions",
        header: "액션",
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleViewUser(row.original);
              }}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleEditUser(row.original);
              }}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(row.original);
                setIsConfirmOpen(true);
              }}
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  // ========================================
  // Table Instance
  // ========================================

  const table = useReactTable({
    data: users,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  // ========================================
  // Handlers
  // ========================================

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsFormOpen(true);
    setIsDrawerOpen(false);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      // API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 500));
      setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
      toast.success(`${selectedUser.name}님이 삭제되었습니다.`);
      setIsConfirmOpen(false);
      setIsDrawerOpen(false);
      setSelectedUser(null);
    } catch {
      toast.error("삭제에 실패했습니다.");
    }
  };

  const handleFormSubmit = async (values: UserFormValues) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (editingUser) {
        // 수정
        setUsers((prev) =>
          prev.map((u) => (u.id === editingUser.id ? { ...u, ...values } : u))
        );
        toast.success(`${values.name}님의 정보가 수정되었습니다.`);
      } else {
        // 생성
        const newUser: User = {
          id: `user-${Date.now()}`,
          ...values,
          status: "ACTIVE",
          createdAt: new Date().toISOString().split("T")[0],
        };
        setUsers((prev) => [newUser, ...prev]);
        toast.success(`${values.name}님이 등록되었습니다.`);
      }
    } catch {
      toast.error("저장에 실패했습니다.");
      throw new Error("저장 실패");
    }
  };

  // ========================================
  // Render
  // ========================================

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="사용자 관리 (Dialog 예시)"
        subtitle="Dialog 시스템을 활용한 사용자 CRUD 예시입니다."
        icon={<Users className="w-5 h-5 text-softone-primary" />}
        actions={
          <Button onClick={handleCreateUser}>
            <Plus className="w-4 h-4 mr-2" />
            사용자 추가
          </Button>
        }
      />

      {/* User Table */}
      <Card>
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="border-b border-softone-border bg-softone-bg"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className={cn(
                          "px-4 py-3 text-left text-sm font-medium text-softone-text",
                          header.column.getCanSort() &&
                            "cursor-pointer select-none"
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="text-softone-text-muted">
                              {header.column.getIsSorted() === "asc" ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : header.column.getIsSorted() === "desc" ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : null}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-softone-border",
                      "hover:bg-softone-surface-hover cursor-pointer",
                      "transition-colors"
                    )}
                    onClick={() => handleViewUser(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-3 text-sm text-softone-text"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-softone-border">
            <span className="text-sm text-softone-text-secondary">
              총 {users.length}명
            </span>
            <Pagination
              page={table.getState().pagination.pageIndex + 1}
              total={table.getPageCount()}
              pageSize={table.getState().pagination.pageSize}
              onChange={(page) => table.setPageIndex(page - 1)}
            />
          </div>
        </CardBody>
      </Card>

      {/* User Detail Drawer */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUser(null);
        }}
        title="사용자 상세 정보"
        width="450px"
      >
        {selectedUser && (
          <UserDetailContent
            user={selectedUser}
            onEdit={() => handleEditUser(selectedUser)}
            onDelete={() => {
              setIsConfirmOpen(true);
            }}
          />
        )}
      </Drawer>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="사용자 삭제"
        message={`${selectedUser?.name}님을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        variant="danger"
        confirmLabel="삭제"
        cancelLabel="취소"
        onConfirm={handleDeleteUser}
      />

      {/* Create/Edit Form Dialog */}
      <FormDialog<UserFormValues>
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingUser(null);
        }}
        title={editingUser ? "사용자 수정" : "새 사용자 등록"}
        size="md"
        schema={userFormSchema}
        defaultValues={
          editingUser
            ? {
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                department: editingUser.department,
                phone: editingUser.phone || "",
              }
            : {
                name: "",
                email: "",
                role: "USER",
                department: "",
                phone: "",
              }
        }
        submitLabel={editingUser ? "수정" : "등록"}
        onSubmit={handleFormSubmit}
      >
        {({ control, errors, isSubmitting }) => (
          <div className="space-y-4">
            <FormFieldWrapper
              label="이름"
              errorMessage={errors.name?.message}
              required
            >
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="이름을 입력하세요"
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormFieldWrapper>

            <FormFieldWrapper
              label="이메일"
              errorMessage={errors.email?.message}
              required
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="이메일을 입력하세요"
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-4">
              <FormFieldWrapper
                label="역할"
                errorMessage={errors.role?.message}
                required
              >
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={[
                        { value: "ADMIN", label: "관리자" },
                        { value: "USER", label: "일반 사용자" },
                        { value: "VIEWER", label: "뷰어" },
                      ]}
                      disabled={isSubmitting}
                    />
                  )}
                />
              </FormFieldWrapper>

              <FormFieldWrapper
                label="부서"
                errorMessage={errors.department?.message}
                required
              >
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="부서"
                      disabled={isSubmitting}
                    />
                  )}
                />
              </FormFieldWrapper>
            </div>

            <FormFieldWrapper label="연락처" description="선택 사항입니다">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    placeholder="010-0000-0000"
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormFieldWrapper>
          </div>
        )}
      </FormDialog>
    </div>
  );
};

export default UserListWithDialogPage;
