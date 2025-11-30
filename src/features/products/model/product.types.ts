/**
 * SoftOne Design System - Product Types
 * 상품 도메인 타입 정의
 */

// ========================================
// Product Entity
// ========================================

export interface Product {
  id: string;
  code: string;
  name: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  status: ProductStatus;
  description: string;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ========================================
// Enums
// ========================================

export type ProductCategory =
  | "ELECTRONICS"
  | "CLOTHING"
  | "FOOD"
  | "FURNITURE"
  | "COSMETICS"
  | "SPORTS"
  | "BOOKS"
  | "TOYS"
  | "OTHER";

export type ProductStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "OUT_OF_STOCK"
  | "DISCONTINUED";

// ========================================
// Form Types
// ========================================

export interface ProductFormData {
  code: string;
  name: string;
  category: ProductCategory;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: string;
  status: ProductStatus;
  description: string;
  imageUrl?: string;
  tags: string[];
}

export type CreateProductPayload = ProductFormData;

export type UpdateProductPayload = Partial<ProductFormData>;

// ========================================
// Filter Types
// ========================================

export interface ProductFilter {
  keyword: string;
  category: ProductCategory | "";
  status: ProductStatus | "";
  minPrice: number | null;
  maxPrice: number | null;
}

// ========================================
// Enum Labels
// ========================================

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  ELECTRONICS: "전자제품",
  CLOTHING: "의류",
  FOOD: "식품",
  FURNITURE: "가구",
  COSMETICS: "화장품",
  SPORTS: "스포츠",
  BOOKS: "도서",
  TOYS: "완구",
  OTHER: "기타",
};

export const PRODUCT_STATUS_LABELS: Record<ProductStatus, string> = {
  ACTIVE: "판매중",
  INACTIVE: "판매중지",
  OUT_OF_STOCK: "품절",
  DISCONTINUED: "단종",
};

export const PRODUCT_CATEGORIES = Object.entries(PRODUCT_CATEGORY_LABELS).map(
  ([value, label]) => ({ value: value as ProductCategory, label })
);

export const PRODUCT_STATUSES = Object.entries(PRODUCT_STATUS_LABELS).map(
  ([value, label]) => ({ value: value as ProductStatus, label })
);

// ========================================
// Default Values
// ========================================

export const DEFAULT_PRODUCT_FILTER: ProductFilter = {
  keyword: "",
  category: "",
  status: "",
  minPrice: null,
  maxPrice: null,
};

export const DEFAULT_PRODUCT_FORM: ProductFormData = {
  code: "",
  name: "",
  category: "OTHER",
  price: 0,
  costPrice: 0,
  stock: 0,
  minStock: 10,
  unit: "EA",
  status: "ACTIVE",
  description: "",
  imageUrl: "",
  tags: [],
};

