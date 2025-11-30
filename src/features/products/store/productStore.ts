/**
 * SoftOne Design System - Product Store
 * 상품 관리를 위한 Zustand 전역 상태
 *
 * 기능:
 *   - 상품 CRUD 상태 관리
 *   - 필터 및 정렬 상태
 *   - 선택/편집 모드 상태
 *   - 모달/다이얼로그 상태
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import type {
  Product,
  ProductFormData,
  ProductFilter,
  ProductCategory,
  ProductStatus,
} from "../model/product.types";
import { DEFAULT_PRODUCT_FILTER } from "../model/product.types";

// ========================================
// Types
// ========================================

interface ProductState {
  // 상품 목록
  products: Product[];
  isLoading: boolean;
  error: string | null;

  // 필터
  filter: ProductFilter;

  // 선택된 상품
  selectedProduct: Product | null;

  // 모달 상태
  isFormModalOpen: boolean;
  isDeleteModalOpen: boolean;
  isDetailModalOpen: boolean;
  formMode: "create" | "edit";

  // 페이지네이션
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

interface ProductActions {
  // 데이터 로딩
  setProducts: (products: Product[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // CRUD
  addProduct: (product: Product) => void;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // 선택
  selectProduct: (product: Product | null) => void;

  // 필터
  setFilter: (filter: Partial<ProductFilter>) => void;
  resetFilter: () => void;

  // 모달
  openCreateModal: () => void;
  openEditModal: (product: Product) => void;
  openDeleteModal: (product: Product) => void;
  openDetailModal: (product: Product) => void;
  closeModal: () => void;

  // 페이지네이션
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotal: (total: number) => void;

  // 유틸리티
  getFilteredProducts: () => Product[];
  reset: () => void;
}

// ========================================
// Initial State
// ========================================

const initialState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
  filter: DEFAULT_PRODUCT_FILTER,
  selectedProduct: null,
  isFormModalOpen: false,
  isDeleteModalOpen: false,
  isDetailModalOpen: false,
  formMode: "create",
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
};

// ========================================
// Store
// ========================================

export const useProductStore = create<ProductState & ProductActions>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      // ========================================
      // 데이터 로딩
      // ========================================

      setProducts: (products) =>
        set(
          (state) => {
            state.products = products;
            state.pagination.total = products.length;
          },
          false,
          "setProducts"
        ),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),

      // ========================================
      // CRUD
      // ========================================

      addProduct: (product) =>
        set(
          (state) => {
            state.products.unshift(product);
            state.pagination.total += 1;
          },
          false,
          "addProduct"
        ),

      updateProduct: (id, data) =>
        set(
          (state) => {
            const index = state.products.findIndex((p) => p.id === id);
            if (index !== -1) {
              state.products[index] = {
                ...state.products[index],
                ...data,
                updatedAt: new Date().toISOString(),
              };
            }
          },
          false,
          "updateProduct"
        ),

      deleteProduct: (id) =>
        set(
          (state) => {
            const index = state.products.findIndex((p) => p.id === id);
            if (index !== -1) {
              state.products.splice(index, 1);
              state.pagination.total -= 1;
            }
            if (state.selectedProduct?.id === id) {
              state.selectedProduct = null;
            }
          },
          false,
          "deleteProduct"
        ),

      // ========================================
      // 선택
      // ========================================

      selectProduct: (product) =>
        set((state) => {
          state.selectedProduct = product;
        }),

      // ========================================
      // 필터
      // ========================================

      setFilter: (filter) =>
        set((state) => {
          state.filter = { ...state.filter, ...filter };
          state.pagination.page = 1; // 필터 변경 시 첫 페이지로
        }),

      resetFilter: () =>
        set((state) => {
          state.filter = DEFAULT_PRODUCT_FILTER;
          state.pagination.page = 1;
        }),

      // ========================================
      // 모달
      // ========================================

      openCreateModal: () =>
        set((state) => {
          state.formMode = "create";
          state.selectedProduct = null;
          state.isFormModalOpen = true;
        }),

      openEditModal: (product) =>
        set((state) => {
          state.formMode = "edit";
          state.selectedProduct = product;
          state.isFormModalOpen = true;
        }),

      openDeleteModal: (product) =>
        set((state) => {
          state.selectedProduct = product;
          state.isDeleteModalOpen = true;
        }),

      openDetailModal: (product) =>
        set((state) => {
          state.selectedProduct = product;
          state.isDetailModalOpen = true;
        }),

      closeModal: () =>
        set((state) => {
          state.isFormModalOpen = false;
          state.isDeleteModalOpen = false;
          state.isDetailModalOpen = false;
        }),

      // ========================================
      // 페이지네이션
      // ========================================

      setPage: (page) =>
        set((state) => {
          state.pagination.page = page;
        }),

      setPageSize: (pageSize) =>
        set((state) => {
          state.pagination.pageSize = pageSize;
          state.pagination.page = 1;
        }),

      setTotal: (total) =>
        set((state) => {
          state.pagination.total = total;
        }),

      // ========================================
      // 유틸리티
      // ========================================

      getFilteredProducts: () => {
        const { products, filter } = get();
        let filtered = [...products];

        // 키워드 검색
        if (filter.keyword) {
          const keyword = filter.keyword.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(keyword) ||
              p.code.toLowerCase().includes(keyword) ||
              p.description.toLowerCase().includes(keyword)
          );
        }

        // 카테고리 필터
        if (filter.category) {
          filtered = filtered.filter((p) => p.category === filter.category);
        }

        // 상태 필터
        if (filter.status) {
          filtered = filtered.filter((p) => p.status === filter.status);
        }

        // 가격 범위 필터
        if (filter.minPrice !== null) {
          filtered = filtered.filter((p) => p.price >= filter.minPrice!);
        }
        if (filter.maxPrice !== null) {
          filtered = filtered.filter((p) => p.price <= filter.maxPrice!);
        }

        return filtered;
      },

      reset: () => set(initialState),
    })),
    { name: "product-store" }
  )
);

// ========================================
// Mock Data Generator
// ========================================

const categories: ProductCategory[] = [
  "ELECTRONICS",
  "CLOTHING",
  "FOOD",
  "FURNITURE",
  "COSMETICS",
  "SPORTS",
  "BOOKS",
  "TOYS",
];

const statuses: ProductStatus[] = [
  "ACTIVE",
  "INACTIVE",
  "OUT_OF_STOCK",
  "DISCONTINUED",
];

const units = ["EA", "BOX", "SET", "KG", "L", "M"];

export function generateMockProducts(count: number = 50): Product[] {
  const products: Product[] = [];

  for (let i = 0; i < count; i++) {
    const price = Math.floor(Math.random() * 500000) + 10000;
    const costPrice = Math.floor(price * (0.4 + Math.random() * 0.3));

    products.push({
      id: `PRD-${String(i + 1).padStart(6, "0")}`,
      code: `CODE-${String(i + 1).padStart(4, "0")}`,
      name: `상품 ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price,
      costPrice,
      stock: Math.floor(Math.random() * 500),
      minStock: Math.floor(Math.random() * 30) + 10,
      unit: units[Math.floor(Math.random() * units.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      description: `상품 ${i + 1}에 대한 상세 설명입니다. 이 상품은 고품질의 재료로 제작되었습니다.`,
      imageUrl: "",
      tags: ["신상품", "베스트", "추천"].slice(
        0,
        Math.floor(Math.random() * 3) + 1
      ),
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  return products;
}

