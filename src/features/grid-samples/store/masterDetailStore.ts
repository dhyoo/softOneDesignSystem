/**
 * SoftOne Design System - Master-Detail Grid Store
 * 작성: SoftOne Frontend Team
 *
 * 멀티 그리드 연동을 위한 Zustand 전역 상태 관리:
 *   - 마스터 그리드 선택 상태
 *   - 디테일 그리드 데이터 연동
 *   - 필터/정렬 상태 공유
 *   - 선택된 아이템 관리
 */

import { create } from "zustand";
import { devtools, subscribeWithSelector } from "zustand/middleware";

// ========================================
// Types
// ========================================

/** 카테고리 (마스터) */
export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  totalRevenue: number;
  status: "ACTIVE" | "INACTIVE";
}

/** 상품 (디테일) */
export interface Product {
  id: string;
  categoryId: string;
  name: string;
  code: string;
  price: number;
  stock: number;
  status: "AVAILABLE" | "OUT_OF_STOCK" | "DISCONTINUED";
  createdAt: string;
}

/** 주문 (연관 데이터) */
export interface Order {
  id: string;
  productId: string;
  customerName: string;
  quantity: number;
  totalPrice: number;
  orderDate: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
}

/** 필터 상태 */
export interface FilterState {
  searchKeyword: string;
  statusFilter: string[];
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

/** Store State */
interface MasterDetailState {
  // 마스터 그리드 상태
  categories: Category[];
  selectedCategory: Category | null;

  // 디테일 그리드 상태
  products: Product[];
  selectedProducts: Product[];

  // 연관 데이터
  orders: Order[];
  selectedOrder: Order | null;

  // 필터 상태 (전역)
  globalFilter: FilterState;

  // 로딩 상태
  isLoadingCategories: boolean;
  isLoadingProducts: boolean;
  isLoadingOrders: boolean;

  // 요약 통계
  summary: {
    totalCategories: number;
    totalProducts: number;
    totalOrders: number;
    selectedProductsValue: number;
  };
}

/** Store Actions */
interface MasterDetailActions {
  // 마스터 그리드 액션
  setCategories: (categories: Category[]) => void;
  selectCategory: (category: Category | null) => void;

  // 디테일 그리드 액션
  setProducts: (products: Product[]) => void;
  selectProduct: (product: Product) => void;
  deselectProduct: (productId: string) => void;
  toggleProductSelection: (product: Product) => void;
  selectAllProducts: () => void;
  clearProductSelection: () => void;

  // 주문 액션
  setOrders: (orders: Order[]) => void;
  selectOrder: (order: Order | null) => void;

  // 필터 액션
  setGlobalFilter: (filter: Partial<FilterState>) => void;
  resetGlobalFilter: () => void;

  // 로딩 상태
  setLoadingCategories: (loading: boolean) => void;
  setLoadingProducts: (loading: boolean) => void;
  setLoadingOrders: (loading: boolean) => void;

  // 데이터 초기화
  resetAll: () => void;

  // 파생 데이터 계산
  getProductsByCategory: (categoryId: string) => Product[];
  getOrdersByProduct: (productId: string) => Order[];
  getFilteredProducts: () => Product[];
}

// ========================================
// Initial State
// ========================================

const initialFilterState: FilterState = {
  searchKeyword: "",
  statusFilter: [],
  dateRange: {
    start: null,
    end: null,
  },
};

const initialState: MasterDetailState = {
  categories: [],
  selectedCategory: null,
  products: [],
  selectedProducts: [],
  orders: [],
  selectedOrder: null,
  globalFilter: initialFilterState,
  isLoadingCategories: false,
  isLoadingProducts: false,
  isLoadingOrders: false,
  summary: {
    totalCategories: 0,
    totalProducts: 0,
    totalOrders: 0,
    selectedProductsValue: 0,
  },
};

// ========================================
// Store
// ========================================

export const useMasterDetailStore = create<
  MasterDetailState & MasterDetailActions
>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      ...initialState,

      // ========================================
      // 마스터 그리드 액션
      // ========================================

      setCategories: (categories) =>
        set(
          (state) => ({
            categories,
            summary: {
              ...state.summary,
              totalCategories: categories.length,
            },
          }),
          false,
          "setCategories"
        ),

      selectCategory: (category) =>
        set(
          {
            selectedCategory: category,
            // 카테고리 변경 시 상품 선택 초기화
            selectedProducts: [],
            selectedOrder: null,
          },
          false,
          "selectCategory"
        ),

      // ========================================
      // 디테일 그리드 액션
      // ========================================

      setProducts: (products) =>
        set(
          (state) => ({
            products,
            summary: {
              ...state.summary,
              totalProducts: products.length,
            },
          }),
          false,
          "setProducts"
        ),

      selectProduct: (product) =>
        set(
          (state) => {
            const exists = state.selectedProducts.some(
              (p) => p.id === product.id
            );
            if (exists) return state;

            const newSelected = [...state.selectedProducts, product];
            return {
              selectedProducts: newSelected,
              summary: {
                ...state.summary,
                selectedProductsValue: newSelected.reduce(
                  (sum, p) => sum + p.price * p.stock,
                  0
                ),
              },
            };
          },
          false,
          "selectProduct"
        ),

      deselectProduct: (productId) =>
        set(
          (state) => {
            const newSelected = state.selectedProducts.filter(
              (p) => p.id !== productId
            );
            return {
              selectedProducts: newSelected,
              summary: {
                ...state.summary,
                selectedProductsValue: newSelected.reduce(
                  (sum, p) => sum + p.price * p.stock,
                  0
                ),
              },
            };
          },
          false,
          "deselectProduct"
        ),

      toggleProductSelection: (product) =>
        set(
          (state) => {
            const exists = state.selectedProducts.some(
              (p) => p.id === product.id
            );
            const newSelected = exists
              ? state.selectedProducts.filter((p) => p.id !== product.id)
              : [...state.selectedProducts, product];

            return {
              selectedProducts: newSelected,
              summary: {
                ...state.summary,
                selectedProductsValue: newSelected.reduce(
                  (sum, p) => sum + p.price * p.stock,
                  0
                ),
              },
            };
          },
          false,
          "toggleProductSelection"
        ),

      selectAllProducts: () =>
        set(
          (state) => {
            const categoryId = state.selectedCategory?.id;
            const productsToSelect = categoryId
              ? state.products.filter((p) => p.categoryId === categoryId)
              : state.products;

            return {
              selectedProducts: productsToSelect,
              summary: {
                ...state.summary,
                selectedProductsValue: productsToSelect.reduce(
                  (sum, p) => sum + p.price * p.stock,
                  0
                ),
              },
            };
          },
          false,
          "selectAllProducts"
        ),

      clearProductSelection: () =>
        set(
          (state) => ({
            selectedProducts: [],
            summary: {
              ...state.summary,
              selectedProductsValue: 0,
            },
          }),
          false,
          "clearProductSelection"
        ),

      // ========================================
      // 주문 액션
      // ========================================

      setOrders: (orders) =>
        set(
          (state) => ({
            orders,
            summary: {
              ...state.summary,
              totalOrders: orders.length,
            },
          }),
          false,
          "setOrders"
        ),

      selectOrder: (order) =>
        set({ selectedOrder: order }, false, "selectOrder"),

      // ========================================
      // 필터 액션
      // ========================================

      setGlobalFilter: (filter) =>
        set(
          (state) => ({
            globalFilter: {
              ...state.globalFilter,
              ...filter,
            },
          }),
          false,
          "setGlobalFilter"
        ),

      resetGlobalFilter: () =>
        set({ globalFilter: initialFilterState }, false, "resetGlobalFilter"),

      // ========================================
      // 로딩 상태
      // ========================================

      setLoadingCategories: (loading) =>
        set({ isLoadingCategories: loading }, false, "setLoadingCategories"),

      setLoadingProducts: (loading) =>
        set({ isLoadingProducts: loading }, false, "setLoadingProducts"),

      setLoadingOrders: (loading) =>
        set({ isLoadingOrders: loading }, false, "setLoadingOrders"),

      // ========================================
      // 초기화
      // ========================================

      resetAll: () => set(initialState, false, "resetAll"),

      // ========================================
      // 파생 데이터
      // ========================================

      getProductsByCategory: (categoryId) => {
        const { products } = get();
        return products.filter((p) => p.categoryId === categoryId);
      },

      getOrdersByProduct: (productId) => {
        const { orders } = get();
        return orders.filter((o) => o.productId === productId);
      },

      getFilteredProducts: () => {
        const { products, globalFilter, selectedCategory } = get();
        let filtered = products;

        // 카테고리 필터
        if (selectedCategory) {
          filtered = filtered.filter(
            (p) => p.categoryId === selectedCategory.id
          );
        }

        // 키워드 검색
        if (globalFilter.searchKeyword) {
          const keyword = globalFilter.searchKeyword.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(keyword) ||
              p.code.toLowerCase().includes(keyword)
          );
        }

        // 상태 필터
        if (globalFilter.statusFilter.length > 0) {
          filtered = filtered.filter((p) =>
            globalFilter.statusFilter.includes(p.status)
          );
        }

        return filtered;
      },
    })),
    { name: "master-detail-store" }
  )
);

// ========================================
// Selectors (성능 최적화)
// ========================================

export const selectCategories = (state: MasterDetailState) => state.categories;
export const selectSelectedCategory = (state: MasterDetailState) =>
  state.selectedCategory;
export const selectProducts = (state: MasterDetailState) => state.products;
export const selectSelectedProducts = (state: MasterDetailState) =>
  state.selectedProducts;
export const selectOrders = (state: MasterDetailState) => state.orders;
export const selectGlobalFilter = (state: MasterDetailState) =>
  state.globalFilter;
export const selectSummary = (state: MasterDetailState) => state.summary;
export const selectIsLoading = (state: MasterDetailState) =>
  state.isLoadingCategories || state.isLoadingProducts || state.isLoadingOrders;

// ========================================
// Mock Data Generator
// ========================================

export function generateMockCategories(): Category[] {
  const categoryNames = [
    "전자제품",
    "의류",
    "식품",
    "가구",
    "화장품",
    "스포츠",
    "도서",
    "완구",
  ];

  return categoryNames.map((name, index) => ({
    id: `CAT-${String(index + 1).padStart(3, "0")}`,
    name,
    description: `${name} 카테고리입니다.`,
    productCount: Math.floor(Math.random() * 50) + 10,
    totalRevenue: Math.floor(Math.random() * 10000000) + 1000000,
    status: Math.random() > 0.2 ? "ACTIVE" : "INACTIVE",
  }));
}

export function generateMockProducts(categories: Category[]): Product[] {
  const products: Product[] = [];
  let productIndex = 1;

  categories.forEach((category) => {
    const count = Math.floor(Math.random() * 10) + 5;
    for (let i = 0; i < count; i++) {
      const statuses: Product["status"][] = [
        "AVAILABLE",
        "OUT_OF_STOCK",
        "DISCONTINUED",
      ];
      products.push({
        id: `PRD-${String(productIndex).padStart(5, "0")}`,
        categoryId: category.id,
        name: `${category.name} 상품 ${i + 1}`,
        code: `CODE-${String(productIndex).padStart(4, "0")}`,
        price: Math.floor(Math.random() * 100000) + 10000,
        stock: Math.floor(Math.random() * 100),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
        ).toISOString(),
      });
      productIndex++;
    }
  });

  return products;
}

export function generateMockOrders(products: Product[]): Order[] {
  const orders: Order[] = [];
  let orderIndex = 1;

  products.slice(0, 30).forEach((product) => {
    const orderCount = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < orderCount; i++) {
      const quantity = Math.floor(Math.random() * 10) + 1;
      const statuses: Order["status"][] = ["PENDING", "COMPLETED", "CANCELLED"];
      orders.push({
        id: `ORD-${String(orderIndex).padStart(6, "0")}`,
        productId: product.id,
        customerName: `고객 ${orderIndex}`,
        quantity,
        totalPrice: product.price * quantity,
        orderDate: new Date(
          Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
        ).toISOString(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
      orderIndex++;
    }
  });

  return orders;
}
