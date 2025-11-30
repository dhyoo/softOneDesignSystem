/**
 * SoftOne Design System - ag-Grid Pivot Chart Playground Page
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – 재사용 가능한 그리드 패턴 캡슐화:
 *   그리드에서 선택한 데이터를 Recharts 차트로 시각화합니다.
 *   - 그리드 행 선택 시 차트 데이터 업데이트
 *   - 카테고리별/지역별 집계 데이터 차트화
 *   - 좌측 그리드 + 우측 차트 레이아웃
 */

import React, { useState, useMemo, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  SelectionChangedEvent,
  ValueFormatterParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { FormFieldWrapper } from "@core/components/ui/FormFieldWrapper";
import { Select } from "@core/components/ui/Select";
import {
  PieChartIcon,
  BarChart3,
  LineChartIcon,
  RefreshCw,
} from "lucide-react";

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

type GroupField = "category" | "region" | "status";
type ChartType = "bar" | "pie" | "line";

interface ChartDataPoint {
  name: string;
  value: number;
  amount: number;
  count: number;
  avgMargin: number;
  [key: string]: string | number;
}

// ========================================
// Constants
// ========================================

const GROUP_OPTIONS = [
  { value: "category", label: "카테고리별" },
  { value: "region", label: "지역별" },
  { value: "status", label: "상태별" },
];

const CHART_COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#10b981",
  "#f97316",
  "#6366f1",
];

// ========================================
// AgPivotChartPlaygroundPage Component
// ========================================

export const AgPivotChartPlaygroundPage: React.FC = () => {
  // 상태
  const [groupField, setGroupField] = useState<GroupField>("category");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [selectedRows, setSelectedRows] = useState<SalesData[]>([]);

  // 데이터 로딩
  const { data: salesData, isLoading, refetch } = useAggregationDataQuery();

  // 그리드 컬럼 정의
  const columnDefs: ColDef<SalesData>[] = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 50,
        pinned: "left",
      },
      {
        field: "id",
        headerName: "ID",
        width: 100,
        cellClass: "font-mono text-xs text-softone-text-muted",
      },
      {
        field: "productName",
        headerName: "상품명",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "category",
        headerName: "카테고리",
        width: 100,
      },
      {
        field: "region",
        headerName: "지역",
        width: 80,
      },
      {
        field: "totalAmount",
        headerName: "매출액",
        width: 120,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellCurrency(params.value),
      },
      {
        field: "marginRate",
        headerName: "마진율",
        width: 90,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellPercent(params.value),
      },
      {
        field: "status",
        headerName: "상태",
        width: 80,
        cellRenderer: (params: { value: string }) => {
          const variant =
            params.value === "COMPLETED"
              ? "success"
              : params.value === "PENDING"
              ? "warning"
              : "danger";
          return (
            <Badge variant={variant} size="sm">
              {params.value}
            </Badge>
          );
        },
      },
    ],
    []
  );

  // 차트 데이터 생성
  const chartData = useMemo((): ChartDataPoint[] => {
    const dataSource = selectedRows.length > 0 ? selectedRows : salesData || [];
    if (dataSource.length === 0) return [];

    const grouped = groupDataByField<SalesData>(dataSource, groupField);
    const aggregates = calculateGroupAggregates<SalesData>(grouped, [
      "totalAmount",
      "marginRate",
    ]);

    return Object.entries(grouped).map(([name, items]) => {
      const agg = aggregates[name];
      return {
        name,
        value: agg?.totalAmount?.sum ?? 0,
        amount: agg?.totalAmount?.sum ?? 0,
        count: items.length,
        avgMargin: agg?.marginRate?.avg ?? 0,
      };
    });
  }, [salesData, selectedRows, groupField]);

  // 선택 변경 핸들러
  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent<SalesData>) => {
      const selected = event.api.getSelectedRows();
      setSelectedRows(selected);
    },
    []
  );

  // 전체 선택 해제
  const handleClearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  // 총 합계
  const totalSummary = useMemo(() => {
    const dataSource = selectedRows.length > 0 ? selectedRows : salesData || [];
    return {
      count: dataSource.length,
      totalAmount: dataSource.reduce((sum, item) => sum + item.totalAmount, 0),
      avgMargin:
        dataSource.length > 0
          ? dataSource.reduce((sum, item) => sum + item.marginRate, 0) /
            dataSource.length
          : 0,
    };
  }, [salesData, selectedRows]);

  // 커스텀 툴팁
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { name: string; value: number }[];
    label?: string;
  }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white p-3 border border-softone-border rounded shadow-lg">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm">
            {entry.name}: {formatCellCurrency(entry.value)}
          </p>
        ))}
      </div>
    );
  };

  // 차트 렌더링
  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-softone-text-muted">
          데이터를 선택하거나 로드해주세요.
        </div>
      );
    }

    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                tickFormatter={(value) =>
                  formatCellNumber(value / 1000000) + "M"
                }
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="amount" name="매출액" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        );

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
                outerRadius={150}
                fill="#8884d8"
                dataKey="amount"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => formatCellCurrency(value)}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) =>
                  formatCellNumber(value / 1000000) + "M"
                }
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="amount"
                name="매출액"
                stroke="#2563eb"
                strokeWidth={2}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="avgMargin"
                name="평균 마진율"
                stroke="#16a34a"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="그리드 + 차트 연동"
        subtitle="그리드에서 선택한 데이터를 다양한 차트로 시각화합니다."
        icon={<BarChart3 className="w-5 h-5 text-softone-primary" />}
      />

      {/* 컨트롤 영역 */}
      <Card>
        <CardBody className="flex items-end justify-between flex-wrap gap-4">
          <div className="flex items-end gap-4">
            <FormFieldWrapper label="그룹 기준" className="w-40">
              <Select
                options={GROUP_OPTIONS}
                value={groupField}
                onChange={(e) => setGroupField(e.target.value as GroupField)}
                fullWidth
              />
            </FormFieldWrapper>

            <Button
              variant="outline"
              onClick={() => refetch()}
              loading={isLoading}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              새로고침
            </Button>

            {selectedRows.length > 0 && (
              <Button variant="ghost" onClick={handleClearSelection}>
                선택 해제 ({selectedRows.length}건)
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-softone-text-muted mr-2">
              차트 유형:
            </span>
            <Button
              variant={chartType === "bar" ? "primary" : "outline"}
              size="sm"
              onClick={() => setChartType("bar")}
            >
              <BarChart3 className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === "pie" ? "primary" : "outline"}
              size="sm"
              onClick={() => setChartType("pie")}
            >
              <PieChartIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={chartType === "line" ? "primary" : "outline"}
              size="sm"
              onClick={() => setChartType("line")}
            >
              <LineChartIcon className="w-4 h-4" />
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 요약 정보 */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardBody className="text-center py-4">
            <div className="text-2xl font-bold text-softone-primary">
              {formatCellNumber(totalSummary.count)}
            </div>
            <div className="text-sm text-softone-text-muted">
              {selectedRows.length > 0 ? "선택된 건수" : "전체 건수"}
            </div>
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
              {formatCellPercent(totalSummary.avgMargin)}
            </div>
            <div className="text-sm text-softone-text-muted">평균 마진율</div>
          </CardBody>
        </Card>
      </div>

      {/* 그리드 + 차트 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 좌측: 그리드 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              매출 데이터
              {selectedRows.length > 0 && (
                <Badge variant="primary" className="ml-2">
                  {selectedRows.length}건 선택됨
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardBody className="p-0">
            <div className="ag-theme-alpine" style={{ height: 500 }}>
              <AgGridReact
                rowData={salesData}
                columnDefs={columnDefs}
                defaultColDef={{
                  sortable: true,
                  filter: true,
                  resizable: true,
                }}
                rowSelection="multiple"
                onSelectionChanged={onSelectionChanged}
                animateRows
                loading={isLoading}
                getRowId={(params) => params.data.id}
              />
            </div>
          </CardBody>
        </Card>

        {/* 우측: 차트 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              {chartType === "bar" && <BarChart3 className="w-4 h-4" />}
              {chartType === "pie" && <PieChartIcon className="w-4 h-4" />}
              {chartType === "line" && <LineChartIcon className="w-4 h-4" />}
              {GROUP_OPTIONS.find((o) => o.value === groupField)?.label} 차트
            </CardTitle>
          </CardHeader>
          <CardBody>{renderChart()}</CardBody>
        </Card>
      </div>

      {/* 차트 데이터 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">집계 데이터</CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-softone-bg border-b border-softone-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  {GROUP_OPTIONS.find(
                    (o) => o.value === groupField
                  )?.label?.replace("별", "")}
                </th>
                <th className="px-4 py-3 text-right font-semibold">건수</th>
                <th className="px-4 py-3 text-right font-semibold">매출액</th>
                <th className="px-4 py-3 text-right font-semibold">
                  평균 마진율
                </th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row, index) => (
                <tr
                  key={row.name}
                  className="border-b border-softone-border hover:bg-softone-surface-hover"
                >
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      />
                      {row.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatCellNumber(row.count)}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-green-600">
                    {formatCellCurrency(row.amount)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {formatCellPercent(row.avgMargin)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

AgPivotChartPlaygroundPage.displayName = "AgPivotChartPlaygroundPage";
