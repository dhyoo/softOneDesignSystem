/**
 * SoftOne Design System - Product CRUD Page
 * 상품 관리 CRUD 화면
 *
 * 기능:
 *   - 상품 목록 조회 (DataTable)
 *   - 상품 등록 (Modal + Form)
 *   - 상품 수정 (Modal + Form)
 *   - 상품 삭제 (ConfirmDialog)
 *   - 상품 상세 보기 (Drawer)
 *   - 필터 및 검색
 */

import React, { useEffect, useCallback, useMemo, useRef } from "react";
import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { Input } from "@core/components/ui/Input";
import { Select } from "@core/components/ui/Select";
import { DataTable } from "@core/components/ui/DataTable";
import { Pagination } from "@core/components/ui/Pagination";
import { BaseModal } from "@core/components/ui/BaseModal";
import { ConfirmDialog } from "@core/components/ui/ConfirmDialog";
import { Drawer } from "@core/components/ui/Drawer";
import { useToast } from "@core/hooks/useToast";
import { formatCellCurrency, formatCellDate } from "@core/utils/gridUtils";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import type { Product, ProductFormData } from "../model/product.types";
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_STATUS_LABELS,
} from "../model/product.types";
import { useProductStore, generateMockProducts } from "../store/productStore";
import { ProductForm } from "../ui/ProductForm";

// ========================================
// ProductCrudPage Component
// ========================================

export const ProductCrudPage: React.FC = () => {
  const toast = useToast();

  // Store
  const {
    products,
    isLoading,
    filter,
    selectedProduct,
    isFormModalOpen,
    isDeleteModalOpen,
    isDetailModalOpen,
    formMode,
    pagination,
    setProducts,
    setLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    setFilter,
    resetFilter,
    openCreateModal,
    openEditModal,
    openDeleteModal,
    openDetailModal,
    closeModal,
    setPage,
    setPageSize,
    getFilteredProducts,
  } = useProductStore();

  // StrictMode 중복 방지용 ref
  const isDataLoadedRef = useRef(false);
  const loadingRef = useRef(false);

  const loadData = useCallback(() => {
    // 이미 로딩 중이면 중복 실행 방지
    if (loadingRef.current) return;
    loadingRef.current = true;

    setLoading(true);
    setTimeout(() => {
      const mockProducts = generateMockProducts(100);
      setProducts(mockProducts);
      setLoading(false);
      loadingRef.current = false;
      toast.success("상품 데이터가 로드되었습니다.");
    }, 500);
  }, [setProducts, setLoading, toast]);

  // 초기 데이터 로드
  useEffect(() => {
    if (products.length === 0 && !isDataLoadedRef.current) {
      isDataLoadedRef.current = true;
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 필터된 상품 목록
  const filteredProducts = useMemo(
    () => getFilteredProducts(),
    [getFilteredProducts, products, filter]
  );

  // 페이지네이션된 상품 목록
  const paginatedProducts = useMemo(() => {
    const start = (pagination.page - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredProducts.slice(start, end);
  }, [filteredProducts, pagination.page, pagination.pageSize]);

  // 총 페이지 수
  const totalPages = Math.ceil(filteredProducts.length / pagination.pageSize);

  // ========================================
  // CRUD 핸들러
  // ========================================

  const handleCreateProduct = useCallback(
    (data: ProductFormData) => {
      const newProduct: Product = {
        ...data,
        id: `PRD-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addProduct(newProduct);
      closeModal();
      toast.success("상품이 등록되었습니다.");
    },
    [addProduct, closeModal, toast]
  );

  const handleUpdateProduct = useCallback(
    (data: ProductFormData) => {
      if (!selectedProduct) return;
      updateProduct(selectedProduct.id, data);
      closeModal();
      toast.success("상품이 수정되었습니다.");
    },
    [selectedProduct, updateProduct, closeModal, toast]
  );

  const handleDeleteProduct = useCallback(() => {
    if (!selectedProduct) return;
    deleteProduct(selectedProduct.id);
    closeModal();
    toast.success("상품이 삭제되었습니다.");
  }, [selectedProduct, deleteProduct, closeModal, toast]);

  const handleFormSubmit = useCallback(
    (data: ProductFormData) => {
      if (formMode === "create") {
        handleCreateProduct(data);
      } else {
        handleUpdateProduct(data);
      }
    },
    [formMode, handleCreateProduct, handleUpdateProduct]
  );

  // ========================================
  // 상태 아이콘/배지
  // ========================================

  const getStatusBadge = (status: Product["status"]) => {
    const config: Record<
      Product["status"],
      {
        variant: "success" | "warning" | "danger" | "neutral";
        icon: React.ReactNode;
      }
    > = {
      ACTIVE: {
        variant: "success",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      INACTIVE: {
        variant: "neutral",
        icon: <Clock className="w-3 h-3" />,
      },
      OUT_OF_STOCK: {
        variant: "warning",
        icon: <AlertTriangle className="w-3 h-3" />,
      },
      DISCONTINUED: {
        variant: "danger",
        icon: <XCircle className="w-3 h-3" />,
      },
    };
    const { variant, icon } = config[status];
    return (
      <Badge variant={variant} size="sm" className="flex items-center gap-1">
        {icon}
        {PRODUCT_STATUS_LABELS[status]}
      </Badge>
    );
  };

  // ========================================
  // 테이블 컬럼
  // ========================================

  const columns = useMemo(
    () => [
      {
        key: "code",
        header: "상품코드",
        width: "120px",
        render: (product: Product) => (
          <span className="font-mono text-xs">{product.code}</span>
        ),
      },
      {
        key: "name",
        header: "상품명",
        render: (product: Product) => (
          <div>
            <div className="font-medium">{product.name}</div>
            <div className="text-xs text-softone-text-muted truncate max-w-xs">
              {product.description}
            </div>
          </div>
        ),
      },
      {
        key: "category",
        header: "카테고리",
        width: "100px",
        render: (product: Product) => (
          <Badge variant="neutral" size="sm">
            {PRODUCT_CATEGORY_LABELS[product.category]}
          </Badge>
        ),
      },
      {
        key: "price",
        header: "판매가",
        width: "120px",
        align: "right" as const,
        render: (product: Product) => (
          <span className="font-medium">
            {formatCellCurrency(product.price)}
          </span>
        ),
      },
      {
        key: "stock",
        header: "재고",
        width: "80px",
        align: "right" as const,
        render: (product: Product) => (
          <span
            className={
              product.stock <= product.minStock
                ? "text-red-600 font-medium"
                : ""
            }
          >
            {product.stock.toLocaleString()} {product.unit}
          </span>
        ),
      },
      {
        key: "status",
        header: "상태",
        width: "110px",
        render: (product: Product) => getStatusBadge(product.status),
      },
      {
        key: "createdAt",
        header: "등록일",
        width: "100px",
        render: (product: Product) => (
          <span className="text-sm text-softone-text-muted">
            {formatCellDate(product.createdAt)}
          </span>
        ),
      },
      {
        key: "actions",
        header: "",
        width: "120px",
        render: (product: Product) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openDetailModal(product)}
              className="p-1"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditModal(product)}
              className="p-1"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openDeleteModal(product)}
              className="p-1 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ),
      },
    ],
    [openDetailModal, openEditModal, openDeleteModal]
  );

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="상품 관리"
        subtitle="상품을 등록, 수정, 삭제하고 재고를 관리합니다."
        icon={<Package className="w-5 h-5 text-softone-primary" />}
        actions={
          <Button
            variant="primary"
            onClick={openCreateModal}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            상품 등록
          </Button>
        }
      />

      {/* 필터 영역 */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-end gap-4">
            {/* 검색 */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-softone-text mb-1">
                검색
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-softone-text-muted" />
                <Input
                  value={filter.keyword}
                  onChange={(e) => setFilter({ keyword: e.target.value })}
                  placeholder="상품명, 코드로 검색..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* 카테고리 */}
            <div className="w-40">
              <label className="block text-sm font-medium text-softone-text mb-1">
                카테고리
              </label>
              <Select
                value={filter.category}
                onChange={(e) =>
                  setFilter({
                    category: e.target.value as Product["category"] | "",
                  })
                }
                options={[{ value: "", label: "전체" }, ...PRODUCT_CATEGORIES]}
              />
            </div>

            {/* 상태 */}
            <div className="w-32">
              <label className="block text-sm font-medium text-softone-text mb-1">
                상태
              </label>
              <Select
                value={filter.status}
                onChange={(e) =>
                  setFilter({
                    status: e.target.value as Product["status"] | "",
                  })
                }
                options={[{ value: "", label: "전체" }, ...PRODUCT_STATUSES]}
              />
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetFilter}>
                <X className="w-4 h-4 mr-1" />
                초기화
              </Button>
              <Button variant="outline" onClick={loadData}>
                <RefreshCw className="w-4 h-4 mr-1" />
                새로고침
              </Button>
            </div>
          </div>

          {/* 필터 결과 */}
          <div className="mt-4 flex items-center gap-4 text-sm text-softone-text-muted">
            <span>
              검색 결과: <strong>{filteredProducts.length}</strong>건
            </span>
            {(filter.keyword || filter.category || filter.status) && (
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span>필터 적용 중</span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* 상품 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            상품 목록
            <Badge variant="neutral" size="sm">
              {filteredProducts.length}건
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <DataTable
            data={paginatedProducts}
            columns={columns}
            loading={isLoading}
            emptyMessage="등록된 상품이 없습니다."
            striped
            hoverable
          />
        </CardBody>
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-softone-text-muted">페이지당</span>
              <Select
                value={String(pagination.pageSize)}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="w-20"
                options={[
                  { value: "10", label: "10" },
                  { value: "20", label: "20" },
                  { value: "50", label: "50" },
                  { value: "100", label: "100" },
                ]}
              />
            </div>
            <Pagination
              page={pagination.page}
              total={totalPages}
              pageSize={pagination.pageSize}
              onChange={setPage}
            />
          </div>
        )}
      </Card>

      {/* 등록/수정 모달 */}
      <BaseModal
        isOpen={isFormModalOpen}
        onClose={closeModal}
        title={formMode === "create" ? "상품 등록" : "상품 수정"}
        size="lg"
      >
        <ProductForm
          product={selectedProduct}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </BaseModal>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteProduct}
        title="상품 삭제"
        message={
          selectedProduct
            ? `"${selectedProduct.name}" 상품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
            : ""
        }
        confirmText="삭제"
        confirmVariant="danger"
      />

      {/* 상세 보기 Drawer */}
      <Drawer
        isOpen={isDetailModalOpen}
        onClose={closeModal}
        title="상품 상세"
        size="md"
      >
        {selectedProduct && (
          <div className="space-y-6">
            {/* 기본 정보 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">기본 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-softone-text-muted">
                    상품코드
                  </div>
                  <div className="font-mono">{selectedProduct.code}</div>
                </div>
                <div>
                  <div className="text-xs text-softone-text-muted">상태</div>
                  <div>{getStatusBadge(selectedProduct.status)}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-softone-text-muted">상품명</div>
                  <div className="font-medium text-lg">
                    {selectedProduct.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-softone-text-muted">
                    카테고리
                  </div>
                  <div>{PRODUCT_CATEGORY_LABELS[selectedProduct.category]}</div>
                </div>
                <div>
                  <div className="text-xs text-softone-text-muted">단위</div>
                  <div>{selectedProduct.unit}</div>
                </div>
              </div>
            </div>

            {/* 가격 정보 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">가격 정보</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-softone-text-muted">판매가</div>
                  <div className="font-bold text-lg text-softone-primary">
                    {formatCellCurrency(selectedProduct.price)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-softone-text-muted">원가</div>
                  <div>{formatCellCurrency(selectedProduct.costPrice)}</div>
                </div>
                <div>
                  <div className="text-xs text-softone-text-muted">마진</div>
                  <div className="text-green-600">
                    {formatCellCurrency(
                      selectedProduct.price - selectedProduct.costPrice
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 재고 정보 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">재고 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-softone-text-muted">
                    현재 재고
                  </div>
                  <div
                    className={`font-bold text-lg ${
                      selectedProduct.stock <= selectedProduct.minStock
                        ? "text-red-600"
                        : ""
                    }`}
                  >
                    {selectedProduct.stock.toLocaleString()}{" "}
                    {selectedProduct.unit}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-softone-text-muted">
                    최소 재고
                  </div>
                  <div>
                    {selectedProduct.minStock.toLocaleString()}{" "}
                    {selectedProduct.unit}
                  </div>
                </div>
              </div>
              {selectedProduct.stock <= selectedProduct.minStock && (
                <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm">
                    재고가 최소 수량 이하입니다. 발주가 필요합니다.
                  </span>
                </div>
              )}
            </div>

            {/* 설명 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">상품 설명</h3>
              <p className="text-sm text-softone-text-secondary">
                {selectedProduct.description || "설명이 없습니다."}
              </p>
            </div>

            {/* 태그 */}
            {selectedProduct.tags.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold border-b pb-2">태그</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.tags.map((tag) => (
                    <Badge key={tag} variant="info" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* 날짜 정보 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold border-b pb-2">
                등록/수정 정보
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-softone-text-muted">등록일</div>
                  <div>{formatCellDate(selectedProduct.createdAt)}</div>
                </div>
                <div>
                  <div className="text-xs text-softone-text-muted">수정일</div>
                  <div>{formatCellDate(selectedProduct.updatedAt)}</div>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="primary"
                onClick={() => {
                  closeModal();
                  openEditModal(selectedProduct);
                }}
                leftIcon={<Edit className="w-4 h-4" />}
                className="flex-1"
              >
                수정
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  closeModal();
                  openDeleteModal(selectedProduct);
                }}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                삭제
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

ProductCrudPage.displayName = "ProductCrudPage";
