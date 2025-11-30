/**
 * SoftOne Design System - User Grid Store
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – Store Isolation 및 백엔드 Mock 연동을 통한 실제 운영 패턴 검증:
 *   Multi-Grid 환경에서 각 그리드가 독립적인 상태를 유지하도록 Store를 분리합니다.
 *   이 스토어는 "사용자" 그리드 전용이며, orderGridStore와 상태 간섭이 없습니다.
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  PaginationState,
  SortState,
  FilterState,
} from "@core/model/grid.types";

// ========================================
// Types
// ========================================

export interface UserGridData {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  createdAt: string;
}

interface UserGridState {
  // 페이지네이션
  pagination: PaginationState;
  // 정렬
  sorts: SortState[];
  // 필터
  filters: FilterState[];
  // 선택된 행
  selectedIds: string[];
  // 로딩 상태
  isLoading: boolean;
}

interface UserGridActions {
  // 페이지네이션
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setPagination: (pagination: Partial<PaginationState>) => void;
  // 정렬
  setSorts: (sorts: SortState[]) => void;
  addSort: (sort: SortState) => void;
  removeSort: (field: string) => void;
  clearSorts: () => void;
  // 필터
  setFilters: (filters: FilterState[]) => void;
  addFilter: (filter: FilterState) => void;
  removeFilter: (field: string) => void;
  clearFilters: () => void;
  // 선택
  setSelectedIds: (ids: string[]) => void;
  toggleSelection: (id: string) => void;
  clearSelection: () => void;
  // 로딩
  setLoading: (loading: boolean) => void;
  // 리셋
  resetState: () => void;
}

// ========================================
// Initial State
// ========================================

const initialState: UserGridState = {
  pagination: {
    page: 1,
    pageSize: 20,
    total: 0,
  },
  sorts: [],
  filters: [],
  selectedIds: [],
  isLoading: false,
};

// ========================================
// Store
// ========================================

export const useUserGridStore = create<UserGridState & UserGridActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // 페이지네이션 액션
      setPage: (page) =>
        set((state) => ({
          pagination: { ...state.pagination, page },
        })),

      setPageSize: (pageSize) =>
        set((state) => ({
          pagination: { ...state.pagination, pageSize, page: 1 },
        })),

      setPagination: (pagination) =>
        set((state) => ({
          pagination: { ...state.pagination, ...pagination },
        })),

      // 정렬 액션
      setSorts: (sorts) => set({ sorts }),

      addSort: (sort) =>
        set((state) => {
          const existing = state.sorts.findIndex((s) => s.field === sort.field);
          if (existing >= 0) {
            const newSorts = [...state.sorts];
            newSorts[existing] = sort;
            return { sorts: newSorts };
          }
          return { sorts: [...state.sorts, sort] };
        }),

      removeSort: (field) =>
        set((state) => ({
          sorts: state.sorts.filter((s) => s.field !== field),
        })),

      clearSorts: () => set({ sorts: [] }),

      // 필터 액션
      setFilters: (filters) =>
        set({
          filters,
          pagination: { ...get().pagination, page: 1 },
        }),

      addFilter: (filter) =>
        set((state) => {
          const existing = state.filters.findIndex(
            (f) => f.field === filter.field
          );
          if (existing >= 0) {
            const newFilters = [...state.filters];
            newFilters[existing] = filter;
            return {
              filters: newFilters,
              pagination: { ...state.pagination, page: 1 },
            };
          }
          return {
            filters: [...state.filters, filter],
            pagination: { ...state.pagination, page: 1 },
          };
        }),

      removeFilter: (field) =>
        set((state) => ({
          filters: state.filters.filter((f) => f.field !== field),
          pagination: { ...state.pagination, page: 1 },
        })),

      clearFilters: () =>
        set((state) => ({
          filters: [],
          pagination: { ...state.pagination, page: 1 },
        })),

      // 선택 액션
      setSelectedIds: (ids) => set({ selectedIds: ids }),

      toggleSelection: (id) =>
        set((state) => {
          const isSelected = state.selectedIds.includes(id);
          return {
            selectedIds: isSelected
              ? state.selectedIds.filter((i) => i !== id)
              : [...state.selectedIds, id],
          };
        }),

      clearSelection: () => set({ selectedIds: [] }),

      // 로딩 액션
      setLoading: (isLoading) => set({ isLoading }),

      // 리셋
      resetState: () => set(initialState),
    }),
    { name: "user-grid-store" }
  )
);

// ========================================
// Selector Hooks
// ========================================

export const useUserGridPagination = () =>
  useUserGridStore((state) => state.pagination);

export const useUserGridSorts = () => useUserGridStore((state) => state.sorts);

export const useUserGridFilters = () =>
  useUserGridStore((state) => state.filters);

export const useUserGridSelection = () =>
  useUserGridStore((state) => ({
    selectedIds: state.selectedIds,
    toggleSelection: state.toggleSelection,
    clearSelection: state.clearSelection,
  }));

