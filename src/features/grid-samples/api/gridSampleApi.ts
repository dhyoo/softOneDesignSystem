/**
 * SoftOne Design System - Grid Sample API
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – Store Isolation 및 백엔드 Mock 연동을 통한 실제 운영 패턴 검증:
 *   Mock API 함수들을 제공하여 그리드 샘플에서 사용합니다.
 *
 *   환경에 따른 동작:
 *   - VITE_USE_MOCK_API=true: 실제 Mock 서버(http://localhost:3001) 호출
 *   - 기본: setTimeout 기반 클라이언트 Mock
 *
 *   실제 백엔드 연결 시:
 *   httpClient.get('/api/grid/...') 형태로 호출하면 됩니다.
 */

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { httpClient } from "@core/api/httpClient";
import type { GridDataResponse, PaginationState } from "@core/model/grid.types";

// ========================================
// Configuration
// ========================================

/**
 * Mock 서버 사용 여부
 * .env에서 VITE_USE_MOCK_API=true로 설정하면 실제 Mock 서버 호출
 */
const USE_MOCK_SERVER = import.meta.env.VITE_USE_MOCK_API === "true";

// ========================================
// Types
// ========================================

/** 매출 데이터 */
export interface SalesData {
  id: string;
  productName: string;
  category: string;
  region: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  cost: number;
  margin: number;
  marginRate: number;
  salesDate: string;
  status: "COMPLETED" | "PENDING" | "CANCELLED";
}

/** 재고 데이터 */
export interface InventoryData {
  id: string;
  productCode: string;
  productName: string;
  category: string;
  warehouse: string;
  quantity: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  totalValue: number;
  lastUpdated: string;
  status: "NORMAL" | "LOW" | "EXCESS" | "OUT_OF_STOCK";
}

/** 상품 데이터 (편집용) */
export interface ProductData {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  discount: number;
  status: "ACTIVE" | "INACTIVE";
  description: string;
}

// ========================================
// Mock Data Generators
// ========================================

const categories = [
  "전자제품",
  "의류",
  "식품",
  "가구",
  "화장품",
  "스포츠",
  "도서",
  "완구",
];
const regions = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
];
const warehouses = ["본사창고", "서울물류", "부산물류", "대전물류", "광주물류"];

function generateSalesData(count: number, startIndex: number = 0): SalesData[] {
  const data: SalesData[] = [];

  for (let i = 0; i < count; i++) {
    const quantity = Math.floor(Math.random() * 100) + 1;
    const unitPrice = Math.floor(Math.random() * 100000) + 10000;
    const totalAmount = quantity * unitPrice;
    const cost = Math.floor(totalAmount * (0.5 + Math.random() * 0.3));
    const margin = totalAmount - cost;
    const marginRate = (margin / totalAmount) * 100;

    data.push({
      id: `SALE-${String(startIndex + i + 1).padStart(6, "0")}`,
      productName: `상품 ${startIndex + i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      quantity,
      unitPrice,
      totalAmount,
      cost,
      margin,
      marginRate: parseFloat(marginRate.toFixed(2)),
      salesDate: new Date(
        Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      status: ["COMPLETED", "PENDING", "CANCELLED"][
        Math.floor(Math.random() * 3)
      ] as SalesData["status"],
    });
  }

  return data;
}

function generateInventoryData(count: number): InventoryData[] {
  const data: InventoryData[] = [];

  for (let i = 0; i < count; i++) {
    const quantity = Math.floor(Math.random() * 1000);
    const minStock = Math.floor(Math.random() * 50) + 10;
    const maxStock = minStock + Math.floor(Math.random() * 500) + 100;
    const unitPrice = Math.floor(Math.random() * 50000) + 5000;

    let status: InventoryData["status"] = "NORMAL";
    if (quantity === 0) status = "OUT_OF_STOCK";
    else if (quantity < minStock) status = "LOW";
    else if (quantity > maxStock) status = "EXCESS";

    data.push({
      id: `INV-${String(i + 1).padStart(6, "0")}`,
      productCode: `PRD-${String(i + 1).padStart(5, "0")}`,
      productName: `상품 ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      warehouse: warehouses[Math.floor(Math.random() * warehouses.length)],
      quantity,
      minStock,
      maxStock,
      unitPrice,
      totalValue: quantity * unitPrice,
      lastUpdated: new Date(
        Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
      ).toISOString(),
      status,
    });
  }

  return data;
}

function generateProductData(count: number): ProductData[] {
  const data: ProductData[] = [];

  for (let i = 0; i < count; i++) {
    data.push({
      id: `PRD-${String(i + 1).padStart(6, "0")}`,
      code: `CODE-${String(i + 1).padStart(4, "0")}`,
      name: `상품명 ${i + 1}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      price: Math.floor(Math.random() * 100000) + 10000,
      quantity: Math.floor(Math.random() * 500) + 1,
      discount: Math.floor(Math.random() * 30),
      status: Math.random() > 0.2 ? "ACTIVE" : "INACTIVE",
      description: `상품 ${i + 1}에 대한 설명입니다.`,
    });
  }

  return data;
}

// ========================================
// Mock API Functions
// ========================================

/**
 * 매출 데이터 조회 (페이징)
 */
export async function fetchSalesData(
  params: PaginationState & { categoryFilter?: string }
): Promise<GridDataResponse<SalesData>> {
  const { page, pageSize, categoryFilter } = params;

  return new Promise((resolve) => {
    setTimeout(() => {
      let allData = generateSalesData(500);

      // 카테고리 필터
      if (categoryFilter && categoryFilter !== "all") {
        allData = allData.filter((item) => item.category === categoryFilter);
      }

      const total = allData.length;
      const startIndex = (page - 1) * pageSize;
      const data = allData.slice(startIndex, startIndex + pageSize);

      resolve({
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      });
    }, 500);
  });
}

/**
 * 재고 데이터 조회 (페이징)
 */
export async function fetchInventoryData(
  params: PaginationState
): Promise<GridDataResponse<InventoryData>> {
  const { page, pageSize } = params;

  return new Promise((resolve) => {
    setTimeout(() => {
      const allData = generateInventoryData(300);
      const total = allData.length;
      const startIndex = (page - 1) * pageSize;
      const data = allData.slice(startIndex, startIndex + pageSize);

      resolve({
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      });
    }, 500);
  });
}

/**
 * 상품 데이터 조회 (편집용)
 */
export async function fetchProductData(): Promise<ProductData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateProductData(50));
    }, 300);
  });
}

/**
 * 대용량 데이터 조회 (무한 스크롤용)
 */
export async function fetchLargeDataset(
  pageParam: number,
  pageSize: number = 100
): Promise<{
  data: SalesData[];
  nextPage: number | null;
  total: number;
}> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const total = 10000;
      const startIndex = pageParam * pageSize;
      const hasMore = startIndex + pageSize < total;

      resolve({
        data: generateSalesData(pageSize, startIndex),
        nextPage: hasMore ? pageParam + 1 : null,
        total,
      });
    }, 300);
  });
}

/**
 * 집계 데이터 조회 (그룹핑/피벗용)
 */
export async function fetchAggregationData(): Promise<SalesData[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateSalesData(200));
    }, 400);
  });
}

// ========================================
// React Query Hooks
// ========================================

/**
 * 매출 데이터 쿼리 훅
 */
export function useSalesDataQuery(
  params: PaginationState & { categoryFilter?: string }
) {
  return useQuery({
    queryKey: ["sales-data", params],
    queryFn: () => fetchSalesData(params),
    staleTime: 30000,
  });
}

/**
 * 재고 데이터 쿼리 훅
 */
export function useInventoryDataQuery(params: PaginationState) {
  return useQuery({
    queryKey: ["inventory-data", params],
    queryFn: () => fetchInventoryData(params),
    staleTime: 30000,
  });
}

/**
 * 상품 데이터 쿼리 훅
 */
export function useProductDataQuery() {
  return useQuery({
    queryKey: ["product-data"],
    queryFn: fetchProductData,
    staleTime: 60000,
  });
}

/**
 * 무한 스크롤 데이터 쿼리 훅
 */
export function useInfiniteScrollDataQuery(pageSize: number = 100) {
  return useInfiniteQuery({
    queryKey: ["infinite-scroll-data", pageSize],
    queryFn: ({ pageParam = 0 }) => fetchLargeDataset(pageParam, pageSize),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 60000,
  });
}

/**
 * 집계 데이터 쿼리 훅
 */
export function useAggregationDataQuery() {
  return useQuery({
    queryKey: ["aggregation-data"],
    queryFn: fetchAggregationData,
    staleTime: 60000,
  });
}

// ========================================
// Step 9-2: Multi-Grid용 API (Store Isolation)
// ========================================

import type { UserGridData } from "../store/userGridStore";
import type { OrderGridData } from "../store/orderGridStore";

/**
 * 사용자 그리드 데이터 조회
 * Mock 서버 사용 시: GET /api/grid/users
 */
export async function fetchUserGridData(params: {
  page: number;
  pageSize: number;
  keyword?: string;
}): Promise<GridDataResponse<UserGridData>> {
  if (USE_MOCK_SERVER) {
    const response = await httpClient.get<GridDataResponse<UserGridData>>(
      "/api/grid/users",
      { params }
    );
    return response.data;
  }

  // 클라이언트 Mock
  return new Promise((resolve) => {
    setTimeout(() => {
      const departments = [
        "개발팀",
        "디자인팀",
        "마케팅팀",
        "영업팀",
        "인사팀",
      ];
      const positions = ["사원", "대리", "과장", "차장", "부장"];
      const statuses = ["ACTIVE", "INACTIVE", "PENDING"] as const;

      let allData: UserGridData[] = Array.from({ length: 200 }, (_, i) => ({
        id: `USER-${String(i + 1).padStart(4, "0")}`,
        name: `사용자${i + 1}`,
        email: `user${i + 1}@softone.com`,
        department: departments[Math.floor(Math.random() * departments.length)],
        position: positions[Math.floor(Math.random() * positions.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createdAt: new Date(
          Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)
        ).toISOString(),
      }));

      // 키워드 필터
      if (params.keyword) {
        const kw = params.keyword.toLowerCase();
        allData = allData.filter(
          (u) =>
            u.name.toLowerCase().includes(kw) ||
            u.email.toLowerCase().includes(kw)
        );
      }

      const total = allData.length;
      const { page, pageSize } = params;
      const startIndex = (page - 1) * pageSize;
      const data = allData.slice(startIndex, startIndex + pageSize);

      resolve({
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      });
    }, 300);
  });
}

/**
 * 주문 그리드 데이터 조회
 * Mock 서버 사용 시: GET /api/grid/orders
 */
export async function fetchOrderGridData(params: {
  page: number;
  pageSize: number;
  status?: string;
}): Promise<GridDataResponse<OrderGridData>> {
  if (USE_MOCK_SERVER) {
    const response = await httpClient.get<GridDataResponse<OrderGridData>>(
      "/api/grid/orders",
      { params }
    );
    return response.data;
  }

  // 클라이언트 Mock
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = ["노트북", "모니터", "키보드", "마우스", "의자", "책상"];
      const statuses = [
        "PENDING",
        "PROCESSING",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ] as const;

      let allData: OrderGridData[] = Array.from({ length: 300 }, (_, i) => ({
        id: `ORD-${String(i + 1).padStart(5, "0")}`,
        orderNo: `ORD-${Date.now()}-${i + 1}`,
        customerName: `고객${Math.floor(Math.random() * 50) + 1}`,
        productName: products[Math.floor(Math.random() * products.length)],
        quantity: Math.floor(Math.random() * 10) + 1,
        totalAmount: Math.floor(Math.random() * 500000) + 50000,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        orderDate: new Date(
          Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)
        ).toISOString(),
      }));

      // 상태 필터
      if (params.status) {
        allData = allData.filter((o) => o.status === params.status);
      }

      const total = allData.length;
      const { page, pageSize } = params;
      const startIndex = (page - 1) * pageSize;
      const data = allData.slice(startIndex, startIndex + pageSize);

      resolve({
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      });
    }, 300);
  });
}

/**
 * 사용자 그리드 데이터 쿼리 훅
 */
export function useUserGridDataQuery(params: {
  page: number;
  pageSize: number;
  keyword?: string;
}) {
  return useQuery({
    queryKey: ["user-grid-data", params],
    queryFn: () => fetchUserGridData(params),
    staleTime: 30000,
  });
}

/**
 * 주문 그리드 데이터 쿼리 훅
 */
export function useOrderGridDataQuery(params: {
  page: number;
  pageSize: number;
  status?: string;
}) {
  return useQuery({
    queryKey: ["order-grid-data", params],
    queryFn: () => fetchOrderGridData(params),
    staleTime: 30000,
  });
}
