/**
 * SoftOne Design System - User List Page
 * 작성: SoftOne Frontend Team
 * 설명: 리스트 화면 표준화를 위한 페이지 패턴.
 *      이 패턴을 참고하여 다른 도메인(상품, 주문 등)의 리스트 페이지도 구현합니다.
 *
 * UserListPage Component
 * - PageHeader + FilterForm + Table + Pagination 조합
 * - 필터/페이지 상태 관리
 * - useUserListQuery로 데이터 로딩
 */

import React, { useState, useCallback } from "react";
import { Card, CardBody } from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Pagination, PaginationInfo } from "@core/components/ui/Pagination";
import { UserPlus, Users } from "lucide-react";
import { useNavigation } from "@core/router/NavigationContext";
import { useUserListQuery } from "../api/userApi";
import { UserFilterForm } from "../ui/UserFilterForm";
import { UserTable } from "../ui/UserTable";
import type {
  User,
  UserFilterFormValues,
  UserListParams,
} from "../model/user.types";
import {
  DEFAULT_USER_FILTER,
  DEFAULT_USER_PAGINATION,
} from "../model/user.types";

// ========================================
// PageHeader Component (Inline)
// ========================================

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  icon,
  actions,
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-softone-primary/10 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-softone-text">{title}</h1>
        {description && (
          <p className="text-sm text-softone-text-secondary mt-0.5">
            {description}
          </p>
        )}
      </div>
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

// ========================================
// UserListPage Component
// ========================================

export const UserListPage: React.FC = () => {
  const navigation = useNavigation();

  // 필터 상태
  const [filters, setFilters] = useState<UserFilterFormValues>(DEFAULT_USER_FILTER);

  // 페이지네이션 상태
  const [pagination, setPagination] = useState(DEFAULT_USER_PAGINATION);

  // 검색용 파라미터 (검색 버튼 클릭 시에만 업데이트)
  const [searchParams, setSearchParams] = useState<UserListParams>({
    ...DEFAULT_USER_PAGINATION,
    ...DEFAULT_USER_FILTER,
  });

  // 데이터 조회
  const { data, isLoading, isFetching } = useUserListQuery(searchParams);

  // 검색 실행
  const handleSearch = useCallback(() => {
    const newParams: UserListParams = {
      page: 1, // 검색 시 첫 페이지로
      pageSize: pagination.pageSize,
      keyword: filters.keyword || undefined,
      status: filters.status || undefined,
    };
    setSearchParams(newParams);
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [filters, pagination.pageSize]);

  // 필터 초기화
  const handleReset = useCallback(() => {
    setFilters(DEFAULT_USER_FILTER);
    setPagination(DEFAULT_USER_PAGINATION);
    setSearchParams({
      ...DEFAULT_USER_PAGINATION,
      ...DEFAULT_USER_FILTER,
    });
  }, []);

  // 페이지 변경
  const handlePageChange = useCallback(
    (newPage: number) => {
      setPagination((prev) => ({ ...prev, page: newPage }));
      setSearchParams((prev) => ({ ...prev, page: newPage }));
    },
    []
  );

  // 행 클릭
  const handleRowClick = useCallback(
    (user: User) => {
      navigation.push(`/users/${user.id}`);
    },
    [navigation]
  );

  // 사용자 등록 페이지로 이동
  const handleCreateUser = useCallback(() => {
    navigation.push("/users/create");
  }, [navigation]);

  return (
    <div className="p-6">
      {/* Page Header */}
      <PageHeader
        title="사용자 관리"
        description="시스템에 등록된 사용자를 조회하고 관리합니다."
        icon={<Users className="w-5 h-5 text-softone-primary" />}
        actions={
          <Button
            variant="primary"
            leftIcon={<UserPlus className="w-4 h-4" />}
            onClick={handleCreateUser}
          >
            사용자 등록
          </Button>
        }
      />

      {/* Filter Form */}
      <UserFilterForm
        values={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        loading={isFetching}
      />

      {/* Data Table Card */}
      <Card>
        <CardBody className="p-0">
          <UserTable
            data={data?.data ?? []}
            loading={isLoading}
            onRowClick={handleRowClick}
          />
        </CardBody>
      </Card>

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <PaginationInfo
            page={searchParams.page}
            pageSize={searchParams.pageSize}
            total={data.total}
          />
          <Pagination
            page={searchParams.page}
            pageSize={searchParams.pageSize}
            total={data.total}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

UserListPage.displayName = "UserListPage";

