/**
 * SoftOne Design System - Tree Data Grid Page
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – Store Isolation 및 백엔드 Mock 연동을 통한 실제 운영 패턴 검증:
 *   ag-Grid 또는 TanStack Table의 Tree/Expanded 기능을 사용하여
 *   조직도와 같은 계층형 데이터를 표현합니다.
 *
 *   핵심 기능:
 *   - 부서 > 팀 > 사용자 계층 구조
 *   - Expand/Collapse 토글
 *   - Level별 Indent 표시
 */

import React, { useState, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel,
  flexRender,
  createColumnHelper,
  type ExpandedState,
} from "@tanstack/react-table";
import {
  ChevronRight,
  ChevronDown,
  Building2,
  Users,
  User,
  FolderTree,
  Expand,
  Shrink,
} from "lucide-react";

import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { cn } from "@core/utils/classUtils";

// ========================================
// Types
// ========================================

interface TreeNode {
  id: string;
  name: string;
  type: "department" | "team" | "member";
  memberCount?: number;
  position?: string;
  email?: string;
  status?: "ACTIVE" | "INACTIVE";
  subRows?: TreeNode[];
}

// ========================================
// Mock Data
// ========================================

const treeData: TreeNode[] = [
  {
    id: "dept-1",
    name: "개발본부",
    type: "department",
    memberCount: 25,
    subRows: [
      {
        id: "team-1-1",
        name: "프론트엔드팀",
        type: "team",
        memberCount: 8,
        subRows: [
          {
            id: "member-1-1-1",
            name: "김철수",
            type: "member",
            position: "팀장",
            email: "kim@softone.com",
            status: "ACTIVE",
          },
          {
            id: "member-1-1-2",
            name: "이영희",
            type: "member",
            position: "선임",
            email: "lee@softone.com",
            status: "ACTIVE",
          },
          {
            id: "member-1-1-3",
            name: "박민수",
            type: "member",
            position: "사원",
            email: "park@softone.com",
            status: "ACTIVE",
          },
        ],
      },
      {
        id: "team-1-2",
        name: "백엔드팀",
        type: "team",
        memberCount: 10,
        subRows: [
          {
            id: "member-1-2-1",
            name: "정대리",
            type: "member",
            position: "팀장",
            email: "jung@softone.com",
            status: "ACTIVE",
          },
          {
            id: "member-1-2-2",
            name: "최과장",
            type: "member",
            position: "과장",
            email: "choi@softone.com",
            status: "INACTIVE",
          },
        ],
      },
      {
        id: "team-1-3",
        name: "DevOps팀",
        type: "team",
        memberCount: 7,
        subRows: [
          {
            id: "member-1-3-1",
            name: "강엔지니어",
            type: "member",
            position: "팀장",
            email: "kang@softone.com",
            status: "ACTIVE",
          },
        ],
      },
    ],
  },
  {
    id: "dept-2",
    name: "디자인본부",
    type: "department",
    memberCount: 12,
    subRows: [
      {
        id: "team-2-1",
        name: "UX팀",
        type: "team",
        memberCount: 6,
        subRows: [
          {
            id: "member-2-1-1",
            name: "윤디자이너",
            type: "member",
            position: "팀장",
            email: "yoon@softone.com",
            status: "ACTIVE",
          },
        ],
      },
      {
        id: "team-2-2",
        name: "UI팀",
        type: "team",
        memberCount: 6,
        subRows: [
          {
            id: "member-2-2-1",
            name: "한아티스트",
            type: "member",
            position: "팀장",
            email: "han@softone.com",
            status: "ACTIVE",
          },
        ],
      },
    ],
  },
  {
    id: "dept-3",
    name: "경영지원본부",
    type: "department",
    memberCount: 8,
    subRows: [
      {
        id: "team-3-1",
        name: "인사팀",
        type: "team",
        memberCount: 4,
        subRows: [
          {
            id: "member-3-1-1",
            name: "임HR",
            type: "member",
            position: "팀장",
            email: "lim@softone.com",
            status: "ACTIVE",
          },
        ],
      },
      {
        id: "team-3-2",
        name: "재무팀",
        type: "team",
        memberCount: 4,
        subRows: [
          {
            id: "member-3-2-1",
            name: "조회계사",
            type: "member",
            position: "팀장",
            email: "jo@softone.com",
            status: "ACTIVE",
          },
        ],
      },
    ],
  },
];

// ========================================
// Column Helper
// ========================================

const columnHelper = createColumnHelper<TreeNode>();

// ========================================
// TreeDataGridPage Component
// ========================================

export const TreeDataGridPage: React.FC = () => {
  const [expanded, setExpanded] = useState<ExpandedState>({});

  // 컬럼 정의
  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "조직/이름",
        cell: ({ row, getValue }) => {
          const depth = row.depth;
          const canExpand = row.getCanExpand();
          const isExpanded = row.getIsExpanded();
          const nodeType = row.original.type;

          const Icon =
            nodeType === "department"
              ? Building2
              : nodeType === "team"
              ? Users
              : User;

          return (
            <div
              className="flex items-center gap-2"
              style={{ paddingLeft: `${depth * 24}px` }}
            >
              {canExpand ? (
                <button
                  onClick={row.getToggleExpandedHandler()}
                  className="p-1 rounded hover:bg-softone-surface-hover"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <span className="w-6" />
              )}
              <Icon
                className={cn(
                  "w-4 h-4",
                  nodeType === "department" && "text-blue-500",
                  nodeType === "team" && "text-green-500",
                  nodeType === "member" && "text-gray-500"
                )}
              />
              <span
                className={cn(
                  nodeType === "department" && "font-bold",
                  nodeType === "team" && "font-semibold"
                )}
              >
                {getValue()}
              </span>
            </div>
          );
        },
      }),
      columnHelper.accessor("type", {
        header: "구분",
        cell: ({ getValue }) => {
          const type = getValue();
          const labels = {
            department: "본부",
            team: "팀",
            member: "구성원",
          };
          const variants: Record<string, "primary" | "success" | "neutral"> = {
            department: "primary",
            team: "success",
            member: "neutral",
          };
          return (
            <Badge variant={variants[type]} size="sm">
              {labels[type]}
            </Badge>
          );
        },
      }),
      columnHelper.accessor("memberCount", {
        header: "인원수",
        cell: ({ getValue, row }) => {
          const count = getValue();
          if (row.original.type === "member") return "-";
          return count ? `${count}명` : "-";
        },
      }),
      columnHelper.accessor("position", {
        header: "직급",
        cell: ({ getValue, row }) => {
          if (row.original.type !== "member") return "-";
          return getValue() || "-";
        },
      }),
      columnHelper.accessor("email", {
        header: "이메일",
        cell: ({ getValue, row }) => {
          if (row.original.type !== "member") return "-";
          return getValue() || "-";
        },
      }),
      columnHelper.accessor("status", {
        header: "상태",
        cell: ({ getValue, row }) => {
          if (row.original.type !== "member") return "-";
          const status = getValue();
          return status ? (
            <Badge variant={status === "ACTIVE" ? "success" : "neutral"}>
              {status === "ACTIVE" ? "재직" : "휴직"}
            </Badge>
          ) : (
            "-"
          );
        },
      }),
    ],
    []
  );

  // 테이블 인스턴스
  const table = useReactTable({
    data: treeData,
    columns,
    state: {
      expanded,
    },
    onExpandedChange: setExpanded,
    getSubRows: (row) => row.subRows,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  // 전체 펼치기/접기
  const handleExpandAll = useCallback(() => {
    table.toggleAllRowsExpanded(true);
  }, [table]);

  const handleCollapseAll = useCallback(() => {
    table.toggleAllRowsExpanded(false);
  }, [table]);

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="Tree Data Grid (계층형 데이터)"
        subtitle="조직도와 같은 계층 구조 데이터를 트리 형태로 표현합니다."
        icon={<FolderTree className="w-5 h-5 text-softone-primary" />}
      />

      {/* 설명 */}
      <Card>
        <CardBody className="text-sm text-softone-text-secondary">
          <p>
            <strong>@tanstack/react-table</strong>의 Expanded Row 기능을
            사용하여 계층형 데이터를 표현합니다. 각 노드를 클릭하여
            하위 항목을 펼치거나 접을 수 있습니다.
          </p>
        </CardBody>
      </Card>

      {/* 컨트롤 */}
      <Card>
        <CardBody className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={handleExpandAll}
            leftIcon={<Expand className="w-4 h-4" />}
          >
            전체 펼치기
          </Button>
          <Button
            variant="outline"
            onClick={handleCollapseAll}
            leftIcon={<Shrink className="w-4 h-4" />}
          >
            전체 접기
          </Button>
          <span className="text-sm text-softone-text-muted ml-auto">
            총 {table.getExpandedRowModel().rows.length}개 항목 표시 중
          </span>
        </CardBody>
      </Card>

      {/* 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">조직도</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-softone-bg border-b border-softone-border">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-4 py-3 text-left font-semibold text-softone-text"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
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
                    "hover:bg-softone-surface-hover transition-colors",
                    row.original.type === "department" && "bg-blue-50/30",
                    row.original.type === "team" && "bg-green-50/30"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
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
        </CardBody>
      </Card>

      {/* 범례 */}
      <Card>
        <CardBody className="flex items-center gap-6">
          <span className="text-sm font-medium">범례:</span>
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-500" />
            <span className="text-sm">본부</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-sm">팀</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            <span className="text-sm">구성원</span>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

TreeDataGridPage.displayName = "TreeDataGridPage";

