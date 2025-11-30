/**
 * SoftOne Design System - ag-Grid Aggregation & Grouping Page
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – 재사용 가능한 그리드 패턴 캡슐화:
 *   ag-Grid의 Grouping + Aggregation(합계/평균) 기능을 시연합니다.
 *   카테고리/지역별 매출 데이터를 그룹화하고 집계합니다.
 *
 * ※ 참고: ag-Grid의 rowGrouping, aggFunc 등은 Enterprise 버전 기능입니다.
 *   Community 버전에서는 직접 데이터를 그룹화하여 표시합니다.
 */

import React, { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ValueFormatterParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { PageHeader } from "@core/components/layout/PageHeader";
import { Card, CardBody } from "@core/components/ui/Card";
import { Select } from "@core/components/ui/Select";
import { Badge } from "@core/components/ui/Badge";
import { Button } from "@core/components/ui/Button";
import { FormFieldWrapper } from "@core/components/ui/FormFieldWrapper";
import { Table, RefreshCw, BarChart3 } from "lucide-react";

import { useAggregationDataQuery, type SalesData } from "../api/gridSampleApi";
import {
  formatCellNumber,
  formatCellCurrency,
  formatCellPercent,
  groupDataByField,
  calculateGroupAggregates,
} from "@core/utils/gridUtils";

// ========================================
// Types
// ========================================

type GroupByField = "category" | "region" | "status";

interface AggregatedRow {
  id: string;
  groupName: string;
  count: number;
  totalQuantity: number;
  totalAmount: number;
  avgMarginRate: number;
  isGroupRow?: boolean;
}

// ========================================
// Constants
// ========================================

const GROUP_OPTIONS = [
  { value: "category", label: "카테고리별" },
  { value: "region", label: "지역별" },
  { value: "status", label: "상태별" },
];

// ========================================
// AgAggregationGroupingPage Component
// ========================================

export const AgAggregationGroupingPage: React.FC = () => {
  const [groupBy, setGroupBy] = useState<GroupByField>("category");
  const [showDetails, setShowDetails] = useState(false);

  // 데이터 로딩
  const { data: salesData, isLoading, refetch } = useAggregationDataQuery();

  // 그룹화된 데이터 생성
  const aggregatedData = useMemo((): AggregatedRow[] => {
    if (!salesData) return [];

    const grouped = groupDataByField<SalesData>(salesData, groupBy);
    const aggregates = calculateGroupAggregates<SalesData>(grouped, [
      "quantity",
      "totalAmount",
      "marginRate",
    ]);

    return Object.entries(grouped).map(([groupName, items]) => {
      const agg = aggregates[groupName];
      return {
        id: groupName,
        groupName,
        count: items.length,
        totalQuantity: agg?.quantity?.sum ?? 0,
        totalAmount: agg?.totalAmount?.sum ?? 0,
        avgMarginRate: agg?.marginRate?.avg ?? 0,
        isGroupRow: true,
      };
    });
  }, [salesData, groupBy]);

  // 상세 데이터 (그룹 + 개별 행)
  const detailData = useMemo(() => {
    if (!salesData || !showDetails) return aggregatedData;

    const result: (AggregatedRow | SalesData)[] = [];
    const grouped = groupDataByField<SalesData>(salesData, groupBy);

    Object.entries(grouped).forEach(([groupName, items]) => {
      const aggregates = calculateGroupAggregates<SalesData>(
        { [groupName]: items },
        ["quantity", "totalAmount", "marginRate"]
      );
      const agg = aggregates[groupName];

      // 그룹 헤더 행
      result.push({
        id: `group-${groupName}`,
        groupName,
        count: items.length,
        totalQuantity: agg?.quantity?.sum ?? 0,
        totalAmount: agg?.totalAmount?.sum ?? 0,
        avgMarginRate: agg?.marginRate?.avg ?? 0,
        isGroupRow: true,
      });

      // 개별 행
      items.forEach((item) => result.push(item));
    });

    return result;
  }, [salesData, aggregatedData, showDetails, groupBy]);

  // 컬럼 정의 (집계 모드)
  const aggregatedColumns: ColDef<AggregatedRow>[] = useMemo(
    () => [
      {
        field: "groupName",
        headerName:
          GROUP_OPTIONS.find((o) => o.value === groupBy)?.label || "그룹",
        flex: 2,
        cellRenderer: (params: { value: string }) => (
          <span className="font-semibold text-softone-primary">
            {params.value}
          </span>
        ),
      },
      {
        field: "count",
        headerName: "건수",
        flex: 1,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellNumber(params.value, { suffix: "건" }),
      },
      {
        field: "totalQuantity",
        headerName: "총 수량",
        flex: 1,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellNumber(params.value),
      },
      {
        field: "totalAmount",
        headerName: "총 매출액",
        flex: 1.5,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellCurrency(params.value),
      },
      {
        field: "avgMarginRate",
        headerName: "평균 마진율",
        flex: 1,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellPercent(params.value),
        cellStyle: (params) => ({
          color:
            params.value >= 30
              ? "#16a34a"
              : params.value >= 20
              ? "#ca8a04"
              : "#dc2626",
          fontWeight: "bold",
        }),
      },
    ],
    [groupBy]
  );

  // 컬럼 정의 (상세 모드)
  const detailColumns: ColDef[] = useMemo(
    () => [
      {
        field: "groupName",
        headerName: "그룹/상품",
        flex: 2,
        valueGetter: (params) => {
          const data = params.data as AggregatedRow | SalesData;
          if ("isGroupRow" in data && data.isGroupRow) {
            return `▼ ${data.groupName} (${data.count}건)`;
          }
          return (data as SalesData).productName;
        },
        cellStyle: (params): Record<string, string> | null => {
          const data = params.data as AggregatedRow | SalesData;
          if ("isGroupRow" in data && data.isGroupRow) {
            return { fontWeight: "bold", backgroundColor: "#f3f4f6" };
          }
          return { paddingLeft: "24px" };
        },
      },
      {
        field: "quantity",
        headerName: "수량",
        flex: 1,
        type: "numericColumn",
        valueGetter: (params) => {
          const data = params.data as AggregatedRow | SalesData;
          if ("isGroupRow" in data && data.isGroupRow) {
            return data.totalQuantity;
          }
          return (data as SalesData).quantity;
        },
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellNumber(params.value),
      },
      {
        field: "totalAmount",
        headerName: "매출액",
        flex: 1.5,
        type: "numericColumn",
        valueGetter: (params) => {
          const data = params.data as AggregatedRow | SalesData;
          if ("isGroupRow" in data && data.isGroupRow) {
            return data.totalAmount;
          }
          return (data as SalesData).totalAmount;
        },
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellCurrency(params.value),
      },
      {
        field: "marginRate",
        headerName: "마진율",
        flex: 1,
        type: "numericColumn",
        valueGetter: (params) => {
          const data = params.data as AggregatedRow | SalesData;
          if ("isGroupRow" in data && data.isGroupRow) {
            return data.avgMarginRate;
          }
          return (data as SalesData).marginRate;
        },
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellPercent(params.value),
      },
    ],
    []
  );

  // 총 합계 계산
  const totalSummary = useMemo(() => {
    if (!aggregatedData.length) return null;

    return {
      totalCount: aggregatedData.reduce((sum, row) => sum + row.count, 0),
      totalQuantity: aggregatedData.reduce(
        (sum, row) => sum + row.totalQuantity,
        0
      ),
      totalAmount: aggregatedData.reduce(
        (sum, row) => sum + row.totalAmount,
        0
      ),
      avgMarginRate:
        aggregatedData.reduce((sum, row) => sum + row.avgMarginRate, 0) /
        aggregatedData.length,
    };
  }, [aggregatedData]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="그룹핑 & 집계 (Aggregation)"
        subtitle="ag-Grid의 데이터 그룹화 및 집계 기능을 시연합니다."
        icon={<BarChart3 className="w-5 h-5 text-softone-primary" />}
      />

      {/* ※ ag-Grid Enterprise 안내 */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
        ※ ag-Grid의 rowGroup, aggFunc 등 고급 기능은 Enterprise 버전에서
        제공됩니다. 이 예제는 Community 버전으로 직접 데이터를 그룹화하여
        구현했습니다.
      </div>

      {/* 필터 영역 */}
      <Card>
        <CardBody className="flex items-end gap-4 flex-wrap">
          <FormFieldWrapper label="그룹 기준" className="w-48">
            <Select
              options={GROUP_OPTIONS}
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value as GroupByField)}
              fullWidth
            />
          </FormFieldWrapper>

          <Button
            variant={showDetails ? "primary" : "outline"}
            onClick={() => setShowDetails(!showDetails)}
            leftIcon={<Table className="w-4 h-4" />}
          >
            {showDetails ? "집계만 보기" : "상세 보기"}
          </Button>

          <Button
            variant="outline"
            onClick={handleRefresh}
            loading={isLoading}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            새로고침
          </Button>
        </CardBody>
      </Card>

      {/* 총 합계 요약 */}
      {totalSummary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardBody className="text-center py-4">
              <div className="text-2xl font-bold text-softone-primary">
                {formatCellNumber(totalSummary.totalCount)}
              </div>
              <div className="text-sm text-softone-text-muted">총 건수</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <div className="text-2xl font-bold text-softone-text">
                {formatCellNumber(totalSummary.totalQuantity)}
              </div>
              <div className="text-sm text-softone-text-muted">총 수량</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <div className="text-2xl font-bold text-green-600">
                {formatCellCurrency(totalSummary.totalAmount)}
              </div>
              <div className="text-sm text-softone-text-muted">총 매출액</div>
            </CardBody>
          </Card>
          <Card>
            <CardBody className="text-center py-4">
              <div className="text-2xl font-bold text-blue-600">
                {formatCellPercent(totalSummary.avgMarginRate)}
              </div>
              <div className="text-sm text-softone-text-muted">평균 마진율</div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* 그리드 */}
      <Card>
        <CardBody className="p-0">
          <div className="ag-theme-alpine" style={{ height: 500 }}>
            <AgGridReact
              rowData={showDetails ? detailData : aggregatedData}
              columnDefs={showDetails ? detailColumns : aggregatedColumns}
              defaultColDef={{
                sortable: true,
                resizable: true,
              }}
              animateRows
              loading={isLoading}
              getRowId={(params) => params.data.id}
              rowSelection="single"
            />
          </div>
        </CardBody>
      </Card>

      {/* 그룹별 뱃지 */}
      <div className="flex flex-wrap gap-2">
        {aggregatedData.map((row) => (
          <Badge key={row.id} variant="neutral">
            {row.groupName}: {formatCellCurrency(row.totalAmount)}
          </Badge>
        ))}
      </div>
    </div>
  );
};

AgAggregationGroupingPage.displayName = "AgAggregationGroupingPage";
