/**
 * SoftOne Design System - Dashboard API
 * 작성: SoftOne Frontend Team
 * 설명: 대시보드 통계 데이터 API 및 TanStack Query 훅.
 *      Mock 데이터로 실제 API 동작을 시뮬레이션합니다.
 *
 * Dashboard API
 * - useDashboardStatsQuery: 대시보드 통계 조회
 * - useDashboardChartQuery: 차트 데이터 조회
 */

import { useQuery } from "@tanstack/react-query";

// ========================================
// Types
// ========================================

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  todayVisits: number;
  newSignups: number;
  pendingApprovals: number;
  totalRevenue: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  previousValue?: number;
}

export interface DashboardChartData {
  userGrowth: ChartDataPoint[];
  visitsByDay: ChartDataPoint[];
  usersByDepartment: ChartDataPoint[];
}

// ========================================
// Mock Data
// ========================================

const MOCK_STATS: DashboardStats = {
  totalUsers: 1234,
  activeUsers: 892,
  todayVisits: 456,
  newSignups: 28,
  pendingApprovals: 15,
  totalRevenue: 12500000,
};

const MOCK_CHART_DATA: DashboardChartData = {
  userGrowth: [
    { name: "1월", value: 800, previousValue: 720 },
    { name: "2월", value: 850, previousValue: 800 },
    { name: "3월", value: 920, previousValue: 850 },
    { name: "4월", value: 980, previousValue: 920 },
    { name: "5월", value: 1050, previousValue: 980 },
    { name: "6월", value: 1120, previousValue: 1050 },
    { name: "7월", value: 1180, previousValue: 1120 },
    { name: "8월", value: 1234, previousValue: 1180 },
  ],
  visitsByDay: [
    { name: "월", value: 320 },
    { name: "화", value: 450 },
    { name: "수", value: 380 },
    { name: "목", value: 520 },
    { name: "금", value: 480 },
    { name: "토", value: 180 },
    { name: "일", value: 120 },
  ],
  usersByDepartment: [
    { name: "IT기획팀", value: 45 },
    { name: "개발팀", value: 120 },
    { name: "영업팀", value: 85 },
    { name: "마케팅팀", value: 65 },
    { name: "인사팀", value: 30 },
    { name: "재무팀", value: 25 },
    { name: "디자인팀", value: 35 },
    { name: "QA팀", value: 40 },
  ],
};

// ========================================
// API Functions
// ========================================

/**
 * 대시보드 통계 조회
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_STATS);
    }, 500);
  });
};

/**
 * 대시보드 차트 데이터 조회
 */
export const getDashboardChartData = async (): Promise<DashboardChartData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CHART_DATA);
    }, 700);
  });
};

// ========================================
// Query Keys
// ========================================

export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  stats: () => [...DASHBOARD_QUERY_KEYS.all, "stats"] as const,
  chart: () => [...DASHBOARD_QUERY_KEYS.all, "chart"] as const,
};

// ========================================
// TanStack Query Hooks
// ========================================

/**
 * 대시보드 통계 조회 훅
 */
export const useDashboardStatsQuery = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.stats(),
    queryFn: getDashboardStats,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 대시보드 차트 데이터 조회 훅
 */
export const useDashboardChartQuery = () => {
  return useQuery({
    queryKey: DASHBOARD_QUERY_KEYS.chart(),
    queryFn: getDashboardChartData,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

