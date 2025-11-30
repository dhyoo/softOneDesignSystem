/**
 * SoftOne Design System - AG Grid Basic Sample
 * 작성: SoftOne Frontend Team
 * 설명: AG Grid 기본 예제 페이지.
 *      엔터프라이즈 환경에서 ag-Grid 사용 패턴을 보여줍니다.
 *
 * AgBasicGridPage Component
 * - ag-Grid Community 버전 사용
 * - 필수 CSS import 포함
 * - Mock 데이터 사용
 */

import React, { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  GridReadyEvent,
  CellClickedEvent,
} from "ag-grid-community";
import { Table } from "lucide-react";

// AG Grid CSS
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { Card, CardBody } from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { PageHeader } from "@core/components/layout/PageHeader";

// ========================================
// Types
// ========================================

interface RowData {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
}

// ========================================
// Mock Data
// ========================================

const MOCK_DATA: RowData[] = [
  {
    id: "EMP001",
    name: "김철수",
    email: "chulsoo.kim@softone.co.kr",
    department: "개발팀",
    position: "시니어 개발자",
    salary: 7500,
    joinDate: "2020-03-15",
    status: "ACTIVE",
  },
  {
    id: "EMP002",
    name: "이영희",
    email: "younghee.lee@softone.co.kr",
    department: "마케팅팀",
    position: "마케팅 매니저",
    salary: 6800,
    joinDate: "2019-07-20",
    status: "ACTIVE",
  },
  {
    id: "EMP003",
    name: "박민수",
    email: "minsu.park@softone.co.kr",
    department: "영업팀",
    position: "영업 대리",
    salary: 5200,
    joinDate: "2022-01-10",
    status: "PENDING",
  },
  {
    id: "EMP004",
    name: "정수진",
    email: "sujin.jung@softone.co.kr",
    department: "인사팀",
    position: "인사 담당자",
    salary: 5000,
    joinDate: "2021-09-01",
    status: "ACTIVE",
  },
  {
    id: "EMP005",
    name: "최동현",
    email: "donghyun.choi@softone.co.kr",
    department: "개발팀",
    position: "주니어 개발자",
    salary: 4500,
    joinDate: "2023-02-15",
    status: "ACTIVE",
  },
  {
    id: "EMP006",
    name: "한지은",
    email: "jieun.han@softone.co.kr",
    department: "디자인팀",
    position: "UI 디자이너",
    salary: 5500,
    joinDate: "2021-04-20",
    status: "SUSPENDED",
  },
  {
    id: "EMP007",
    name: "오성민",
    email: "sungmin.oh@softone.co.kr",
    department: "QA팀",
    position: "QA 엔지니어",
    salary: 5800,
    joinDate: "2020-11-05",
    status: "ACTIVE",
  },
  {
    id: "EMP008",
    name: "강예진",
    email: "yejin.kang@softone.co.kr",
    department: "재무팀",
    position: "회계 담당자",
    salary: 5300,
    joinDate: "2022-06-01",
    status: "ACTIVE",
  },
];

// ========================================
// Status Badge Renderer
// ========================================

const StatusCellRenderer = (params: { value: string }) => {
  const statusMap: Record<
    string,
    { label: string; variant: "success" | "warning" | "danger" }
  > = {
    ACTIVE: { label: "활성", variant: "success" },
    PENDING: { label: "대기", variant: "warning" },
    SUSPENDED: { label: "정지", variant: "danger" },
  };

  const status = statusMap[params.value] || {
    label: params.value,
    variant: "neutral" as const,
  };

  return <Badge variant={status.variant}>{status.label}</Badge>;
};

// ========================================
// AgBasicGridPage Component
// ========================================

export const AgBasicGridPage: React.FC = () => {
  const [rowData] = useState<RowData[]>(MOCK_DATA);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);

  // Column Definitions
  const columnDefs = useMemo<ColDef<RowData>[]>(
    () => [
      {
        field: "id",
        headerName: "사원번호",
        width: 110,
        pinned: "left",
      },
      {
        field: "name",
        headerName: "이름",
        width: 120,
        filter: true,
        sortable: true,
      },
      {
        field: "email",
        headerName: "이메일",
        width: 220,
        filter: true,
      },
      {
        field: "department",
        headerName: "부서",
        width: 120,
        filter: true,
        sortable: true,
      },
      {
        field: "position",
        headerName: "직책",
        width: 140,
        filter: true,
      },
      {
        field: "salary",
        headerName: "연봉(만원)",
        width: 120,
        sortable: true,
        valueFormatter: (params) =>
          params.value ? `${params.value.toLocaleString()}만원` : "-",
      },
      {
        field: "joinDate",
        headerName: "입사일",
        width: 120,
        sortable: true,
      },
      {
        field: "status",
        headerName: "상태",
        width: 100,
        cellRenderer: StatusCellRenderer,
        filter: true,
      },
    ],
    []
  );

  // Default Column Definition
  const defaultColDef = useMemo<ColDef>(
    () => ({
      resizable: true,
      suppressMovable: false,
    }),
    []
  );

  // Grid Ready Handler
  const onGridReady = useCallback((params: GridReadyEvent) => {
    // 자동 크기 조정
    params.api.sizeColumnsToFit();
  }, []);

  // Cell Click Handler
  const onCellClicked = useCallback((event: CellClickedEvent<RowData>) => {
    if (event.data) {
      setSelectedRow(event.data);
    }
  }, []);

  // Export to CSV
  const handleExport = () => {
    // ag-Grid Enterprise 기능
    console.log("CSV Export - Enterprise 기능입니다.");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="AG Grid 기본 예제"
        subtitle="ag-Grid Community 버전을 사용한 기본적인 그리드 구현 예제입니다."
        icon={<Table className="w-5 h-5 text-softone-primary" />}
        actions={
          <Button variant="outline" onClick={handleExport}>
            CSV 내보내기
          </Button>
        }
      />

      {/* Grid */}
      <Card>
        <CardBody className="p-0">
          <div
            className="ag-theme-alpine"
            style={{ height: 500, width: "100%" }}
          >
            <AgGridReact<RowData>
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onCellClicked={onCellClicked}
              animateRows={true}
              rowSelection="single"
              pagination={true}
              paginationPageSize={10}
              domLayout="normal"
            />
          </div>
        </CardBody>
      </Card>

      {/* Selected Row Info */}
      {selectedRow && (
        <Card>
          <CardBody>
            <h3 className="text-sm font-medium text-softone-text mb-2">
              선택된 행 정보
            </h3>
            <pre className="text-xs text-softone-text-secondary bg-softone-bg p-3 rounded overflow-auto">
              {JSON.stringify(selectedRow, null, 2)}
            </pre>
          </CardBody>
        </Card>
      )}

      {/* Usage Guide */}
      <Card>
        <CardBody>
          <h3 className="text-sm font-medium text-softone-text mb-3">
            AG Grid 사용 가이드
          </h3>
          <ul className="space-y-2 text-sm text-softone-text-secondary">
            <li>
              • <strong>정렬</strong>: 컬럼 헤더 클릭
            </li>
            <li>
              • <strong>필터</strong>: 컬럼 헤더의 메뉴 아이콘 클릭
            </li>
            <li>
              • <strong>컬럼 리사이즈</strong>: 컬럼 헤더 경계 드래그
            </li>
            <li>
              • <strong>페이지네이션</strong>: 하단 페이지 네비게이션 사용
            </li>
            <li>
              • <strong>행 선택</strong>: 행 클릭 시 하단에 정보 표시
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
};

AgBasicGridPage.displayName = "AgBasicGridPage";

export default AgBasicGridPage;
