/**
 * SoftOne Design System - Common Grid UI Store
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – 재사용 가능한 그리드 패턴 캡슐화:
 *   Grid Samples 전역 UI 상태를 Zustand로 관리합니다.
 *   - 필터 패널 토글
 *   - 차트 패널 토글
 *   - 선택된 행 상태 등
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ========================================
// Types
// ========================================

interface CommonGridUiState {
  /** 필터 패널 열림 여부 */
  isFilterPanelOpen: boolean;
  /** 차트 패널 열림 여부 */
  isChartPanelOpen: boolean;
  /** 사이드 패널 너비 */
  sidePanelWidth: number;
  /** 현재 선택된 그리드 탭 */
  selectedGridTab: string | null;
  /** 밀도 설정 */
  gridDensity: "compact" | "normal" | "comfortable";
}

interface CommonGridUiActions {
  /** 필터 패널 토글 */
  toggleFilterPanel: () => void;
  /** 필터 패널 열기/닫기 */
  setFilterPanelOpen: (open: boolean) => void;
  /** 차트 패널 토글 */
  toggleChartPanel: () => void;
  /** 차트 패널 열기/닫기 */
  setChartPanelOpen: (open: boolean) => void;
  /** 사이드 패널 너비 설정 */
  setSidePanelWidth: (width: number) => void;
  /** 선택된 그리드 탭 설정 */
  setSelectedGridTab: (tab: string | null) => void;
  /** 그리드 밀도 설정 */
  setGridDensity: (density: "compact" | "normal" | "comfortable") => void;
  /** 상태 초기화 */
  resetState: () => void;
}

// ========================================
// Initial State
// ========================================

const initialState: CommonGridUiState = {
  isFilterPanelOpen: false,
  isChartPanelOpen: true,
  sidePanelWidth: 400,
  selectedGridTab: null,
  gridDensity: "normal",
};

// ========================================
// Store
// ========================================

export const useCommonGridUiStore = create<CommonGridUiState & CommonGridUiActions>()(
  devtools(
    (set) => ({
      ...initialState,

      toggleFilterPanel: () =>
        set((state) => ({ isFilterPanelOpen: !state.isFilterPanelOpen })),

      setFilterPanelOpen: (open) =>
        set({ isFilterPanelOpen: open }),

      toggleChartPanel: () =>
        set((state) => ({ isChartPanelOpen: !state.isChartPanelOpen })),

      setChartPanelOpen: (open) =>
        set({ isChartPanelOpen: open }),

      setSidePanelWidth: (width) =>
        set({ sidePanelWidth: width }),

      setSelectedGridTab: (tab) =>
        set({ selectedGridTab: tab }),

      setGridDensity: (density) =>
        set({ gridDensity: density }),

      resetState: () =>
        set(initialState),
    }),
    { name: "common-grid-ui-store" }
  )
);

// ========================================
// Selector Hooks
// ========================================

/**
 * 필터 패널 상태 선택자
 */
export const useFilterPanelState = () =>
  useCommonGridUiStore((state) => ({
    isOpen: state.isFilterPanelOpen,
    toggle: state.toggleFilterPanel,
    setOpen: state.setFilterPanelOpen,
  }));

/**
 * 차트 패널 상태 선택자
 */
export const useChartPanelState = () =>
  useCommonGridUiStore((state) => ({
    isOpen: state.isChartPanelOpen,
    toggle: state.toggleChartPanel,
    setOpen: state.setChartPanelOpen,
  }));

/**
 * 그리드 밀도 상태 선택자
 */
export const useGridDensityState = () =>
  useCommonGridUiStore((state) => ({
    density: state.gridDensity,
    setDensity: state.setGridDensity,
  }));

