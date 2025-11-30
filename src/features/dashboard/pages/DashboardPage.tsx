/**
 * SoftOne Design System - Dashboard Page
 * 작성: SoftOne Frontend Team
 * 설명: 대시보드 메인 페이지.
 *      StatCard, Recharts를 활용한 통계 및 차트 표시 패턴입니다.
 *
 * DashboardPage Component
 * - PageHeader + StatCards + Charts 조합
 * - TanStack Query로 데이터 로딩
 */

import React from "react";
import {
  Users,
  UserCheck,
  Eye,
  UserPlus,
  Clock,
  DollarSign,
  LayoutDashboard,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardBody, CardHeader, CardTitle } from "@core/components/ui/Card";
import { StatCard } from "@core/components/ui/StatCard";
import { PageHeader } from "@core/components/layout/PageHeader";
import { useDashboardStatsQuery, useDashboardChartQuery } from "../api/dashboardApi";

// ========================================
// Chart Colors
// ========================================

const CHART_COLORS = [
  "#3B82F6", // blue
  "#10B981", // green
  "#F59E0B", // amber
  "#EF4444", // red
  "#8B5CF6", // violet
  "#EC4899", // pink
  "#06B6D4", // cyan
  "#84CC16", // lime
];

// ========================================
// Format Utilities
// ========================================

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number): string => {
  return value.toLocaleString("ko-KR");
};

// ========================================
// DashboardPage Component
// ========================================

export const DashboardPage: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery();
  const { data: chartData, isLoading: chartLoading } = useDashboardChartQuery();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="대시보드"
        subtitle="SoftOne Admin UI Framework에 오신 것을 환영합니다."
        icon={<LayoutDashboard className="w-5 h-5 text-softone-primary" />}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="전체 사용자"
          value={formatNumber(stats?.totalUsers ?? 0)}
          icon={<Users className="w-5 h-5" />}
          variant="primary"
          trend={{
            value: "+12%",
            direction: "up",
            label: "지난달 대비",
          }}
          loading={statsLoading}
        />
        <StatCard
          title="활성 사용자"
          value={formatNumber(stats?.activeUsers ?? 0)}
          icon={<UserCheck className="w-5 h-5" />}
          variant="success"
          trend={{
            value: "+8%",
            direction: "up",
            label: "지난주 대비",
          }}
          loading={statsLoading}
        />
        <StatCard
          title="오늘 방문"
          value={formatNumber(stats?.todayVisits ?? 0)}
          icon={<Eye className="w-5 h-5" />}
          variant="default"
          loading={statsLoading}
        />
        <StatCard
          title="신규 가입"
          value={formatNumber(stats?.newSignups ?? 0)}
          icon={<UserPlus className="w-5 h-5" />}
          variant="success"
          trend={{
            value: "+5",
            direction: "up",
            label: "어제 대비",
          }}
          loading={statsLoading}
        />
        <StatCard
          title="승인 대기"
          value={formatNumber(stats?.pendingApprovals ?? 0)}
          icon={<Clock className="w-5 h-5" />}
          variant="warning"
          loading={statsLoading}
        />
        <StatCard
          title="총 매출"
          value={formatCurrency(stats?.totalRevenue ?? 0)}
          icon={<DollarSign className="w-5 h-5" />}
          variant="primary"
          trend={{
            value: "+15%",
            direction: "up",
            label: "지난달 대비",
          }}
          loading={statsLoading}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle>사용자 증가 추이</CardTitle>
          </CardHeader>
          <CardBody>
            {chartLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-softone-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData?.userGrowth ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="현재"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="previousValue"
                    name="이전"
                    stroke="#9CA3AF"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ fill: "#9CA3AF", r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        {/* Visits by Day Chart */}
        <Card>
          <CardHeader>
            <CardTitle>요일별 방문 현황</CardTitle>
          </CardHeader>
          <CardBody>
            {chartLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-softone-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData?.visitsByDay ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    axisLine={{ stroke: "#e5e7eb" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    name="방문 수"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users by Department Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>부서별 사용자 분포</CardTitle>
          </CardHeader>
          <CardBody>
            {chartLoading ? (
              <div className="h-64 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-softone-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={chartData?.usersByDepartment as Array<{ name: string; value: number; [key: string]: unknown }> ?? []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {(chartData?.usersByDepartment ?? []).map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        {/* Implementation Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>구현 현황</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-softone-text mb-3">
                  Step 1-2 ✅
                </h3>
                <ul className="space-y-1.5 text-sm text-softone-text-secondary">
                  <li>✓ Vite + React + TypeScript</li>
                  <li>✓ Navigation 추상화</li>
                  <li>✓ Tailwind Design Token</li>
                  <li>✓ Core Utils & UI Kit</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-softone-text mb-3">
                  Step 3-4 ✅
                </h3>
                <ul className="space-y-1.5 text-sm text-softone-text-secondary">
                  <li>✓ Auth Store & Hooks</li>
                  <li>✓ Protected/RoleBasedRoute</li>
                  <li>✓ DataTable & Pagination</li>
                  <li>✓ User Management</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-medium text-softone-text mb-3">
                  Step 5 ✅
                </h3>
                <ul className="space-y-1.5 text-sm text-softone-text-secondary">
                  <li>✓ Modal & StatCard</li>
                  <li>✓ FileUpload & Utils</li>
                  <li>✓ Dashboard with Charts</li>
                  <li>✓ Calendar & Grid Samples</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

DashboardPage.displayName = "DashboardPage";

export default DashboardPage;

