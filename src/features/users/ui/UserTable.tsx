/**
 * SoftOne Design System - User Table
 * 작성: SoftOne Frontend Team
 * 설명: 리스트 화면 표준화를 위한 테이블 패턴.
 *      DataTable, Badge, formatDate/formatDateTime을 활용하여 일관된 UX를 제공합니다.
 *
 * UserTable Component
 * - DataTable 컴포넌트로 User 목록 렌더링
 * - Status 컬럼: Badge로 표시
 * - 날짜 컬럼: formatDate/formatDateTime 사용
 */

import React from "react";
import { DataTable, type DataTableColumn } from "@core/components/ui/DataTable";
import { Badge } from "@core/components/ui/Badge";
import { formatDate, formatDateTime } from "@core/utils/dateUtils";
import type { User, UserStatus } from "../model/user.types";
import { USER_STATUS_META } from "../model/user.types";

// ========================================
// Types
// ========================================

export interface UserTableProps {
  /** 사용자 목록 */
  data: User[];
  /** 로딩 상태 */
  loading?: boolean;
  /** 행 클릭 핸들러 */
  onRowClick?: (user: User) => void;
}

// ========================================
// Status Badge Renderer
// ========================================

const renderStatusBadge = (status: UserStatus): React.ReactNode => {
  const meta = USER_STATUS_META[status];
  if (!meta) {
    return <Badge variant="neutral">{status}</Badge>;
  }

  return <Badge variant={meta.variant}>{meta.label}</Badge>;
};

// ========================================
// Roles Renderer
// ========================================

const renderRoles = (roles: string[]): React.ReactNode => {
  if (!roles || roles.length === 0) {
    return <span className="text-softone-text-muted">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {roles.map((role) => (
        <Badge key={role} variant="info" size="sm">
          {role}
        </Badge>
      ))}
    </div>
  );
};

// ========================================
// Column Definitions
// ========================================

const USER_COLUMNS: DataTableColumn<User>[] = [
  {
    key: "name",
    header: "이름",
    width: 120,
    render: (row) => (
      <div className="font-medium text-softone-text">{row.name}</div>
    ),
  },
  {
    key: "email",
    header: "이메일",
    width: 200,
    render: (row) => (
      <span className="text-softone-text-secondary">{row.email}</span>
    ),
  },
  {
    key: "department",
    header: "부서",
    width: 100,
    render: (row) =>
      row.department || (
        <span className="text-softone-text-muted">-</span>
      ),
  },
  {
    key: "roles",
    header: "역할",
    width: 150,
    render: (row) => renderRoles(row.roles),
  },
  {
    key: "status",
    header: "상태",
    width: 80,
    align: "center",
    render: (row) => renderStatusBadge(row.status),
  },
  {
    key: "createdAt",
    header: "가입일",
    width: 150,
    render: (row) => (
      <span className="text-softone-text-secondary text-sm">
        {formatDate(row.createdAt)}
      </span>
    ),
  },
  {
    key: "lastLoginAt",
    header: "마지막 로그인",
    width: 170,
    render: (row) => (
      <span className="text-softone-text-secondary text-sm">
        {row.lastLoginAt
          ? formatDateTime(row.lastLoginAt)
          : "-"}
      </span>
    ),
  },
];

// ========================================
// UserTable Component
// ========================================

export const UserTable: React.FC<UserTableProps> = ({
  data,
  loading = false,
  onRowClick,
}) => {
  return (
    <DataTable<User>
      columns={USER_COLUMNS}
      data={data}
      rowKey={(row) => row.id}
      loading={loading}
      emptyMessage="등록된 사용자가 없습니다"
      striped
      hoverable
      bordered
      onRowClick={onRowClick}
    />
  );
};

UserTable.displayName = "UserTable";
