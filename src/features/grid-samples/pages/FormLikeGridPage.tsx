/**
 * SoftOne Design System - Form-Like Grid Page
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – Store Isolation 및 백엔드 Mock 연동을 통한 실제 운영 패턴 검증:
 *   엑셀 스타일의 그리드 편집 기능을 구현합니다.
 *
 *   핵심 기능:
 *   - 행 추가/삭제
 *   - Dirty Checking (변경 감지)
 *   - 변경된 셀/행 하이라이트
 *   - 일괄 저장 (Batch Save)
 */

import React, { useState, useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  CellValueChangedEvent,
  ValueFormatterParams,
  GridReadyEvent,
  RowClassParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
} from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { useToast } from "@core/hooks/useToast";
import { Table2, Plus, Trash2, Save, RotateCcw } from "lucide-react";

import { formatCellNumber, formatCellCurrency } from "@core/utils/gridUtils";

// ========================================
// Types
// ========================================

interface ProductRow {
  id: string;
  code: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  total: number;
  _isNew?: boolean;
  _isModified?: boolean;
  _isDeleted?: boolean;
  _originalData?: ProductRow;
}

// ========================================
// Mock Initial Data
// ========================================

const createInitialData = (): ProductRow[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `PRD-${String(i + 1).padStart(4, "0")}`,
    code: `CODE-${String(i + 1).padStart(3, "0")}`,
    name: `상품 ${i + 1}`,
    category: ["전자제품", "의류", "식품", "가구"][i % 4],
    price: Math.floor(Math.random() * 100000) + 10000,
    quantity: Math.floor(Math.random() * 100) + 1,
    total: 0,
  })).map((row) => ({
    ...row,
    total: row.price * row.quantity,
    _originalData: { ...row, total: row.price * row.quantity },
  }));
};

// ========================================
// FormLikeGridPage Component
// ========================================

export const FormLikeGridPage: React.FC = () => {
  const toast = useToast();
  const gridRef = useRef<AgGridReact<ProductRow>>(null);

  // 상태
  const [rowData, setRowData] = useState<ProductRow[]>(createInitialData);
  const [deletedRows, setDeletedRows] = useState<ProductRow[]>([]);

  // 변경 사항 계산
  const changesSummary = useMemo(() => {
    const newRows = rowData.filter((row) => row._isNew);
    const modifiedRows = rowData.filter(
      (row) => row._isModified && !row._isNew
    );
    return {
      newCount: newRows.length,
      modifiedCount: modifiedRows.length,
      deletedCount: deletedRows.length,
      hasChanges:
        newRows.length > 0 || modifiedRows.length > 0 || deletedRows.length > 0,
    };
  }, [rowData, deletedRows]);

  // 컬럼 정의
  const columnDefs: ColDef<ProductRow>[] = useMemo(
    () => [
      {
        headerCheckboxSelection: true,
        checkboxSelection: true,
        width: 50,
        pinned: "left",
        lockPosition: true,
      },
      {
        headerName: "상태",
        width: 80,
        cellRenderer: (params: { data: ProductRow }) => {
          if (params.data._isNew) {
            return (
              <Badge variant="success" size="sm">
                신규
              </Badge>
            );
          }
          if (params.data._isModified) {
            return (
              <Badge variant="warning" size="sm">
                수정
              </Badge>
            );
          }
          return (
            <Badge variant="neutral" size="sm">
              -
            </Badge>
          );
        },
        sortable: false,
        filter: false,
      },
      {
        field: "code",
        headerName: "코드",
        width: 120,
        editable: true,
      },
      {
        field: "name",
        headerName: "상품명",
        flex: 1,
        editable: true,
      },
      {
        field: "category",
        headerName: "카테고리",
        width: 120,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["전자제품", "의류", "식품", "가구", "화장품"],
        },
      },
      {
        field: "price",
        headerName: "단가",
        width: 130,
        editable: true,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellCurrency(params.value),
      },
      {
        field: "quantity",
        headerName: "수량",
        width: 100,
        editable: true,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellNumber(params.value),
      },
      {
        field: "total",
        headerName: "합계",
        width: 140,
        editable: false,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellCurrency(params.value),
        cellClass: "font-semibold text-green-600",
      },
    ],
    []
  );

  // 행 클래스 규칙
  const getRowClass = useCallback((params: RowClassParams<ProductRow>) => {
    if (params.data?._isNew) return "bg-green-50";
    if (params.data?._isModified) return "bg-yellow-50";
    return "";
  }, []);

  // 셀 값 변경 핸들러
  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent<ProductRow>) => {
      const { data } = event;
      if (!data) return;

      setRowData((prev) => {
        return prev.map((row) => {
          if (row.id !== data.id) return row;

          // 합계 재계산
          const updatedRow = {
            ...row,
            ...data,
            total: data.price * data.quantity,
          };

          // 변경 여부 확인 (신규가 아닌 경우만)
          if (!row._isNew && row._originalData) {
            const original = row._originalData;
            const isModified =
              updatedRow.code !== original.code ||
              updatedRow.name !== original.name ||
              updatedRow.category !== original.category ||
              updatedRow.price !== original.price ||
              updatedRow.quantity !== original.quantity;

            return {
              ...updatedRow,
              _isModified: isModified,
            };
          }

          return updatedRow;
        });
      });
    },
    []
  );

  // 행 추가
  const handleAddRow = useCallback(() => {
    const newRow: ProductRow = {
      id: `NEW-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      code: "",
      name: "",
      category: "전자제품",
      price: 0,
      quantity: 1,
      total: 0,
      _isNew: true,
    };

    setRowData((prev) => [newRow, ...prev]);
    toast.info("새 행이 추가되었습니다.");
  }, [toast]);

  // 선택된 행 삭제
  const handleDeleteSelected = useCallback(() => {
    const selectedNodes = gridRef.current?.api.getSelectedNodes();
    if (!selectedNodes || selectedNodes.length === 0) {
      toast.warning("삭제할 행을 선택해주세요.");
      return;
    }

    const selectedIds = selectedNodes.map((node) => node.data?.id);

    setRowData((prev) => {
      const toDelete = prev.filter((row) => selectedIds.includes(row.id));
      const remaining = prev.filter((row) => !selectedIds.includes(row.id));

      // 신규가 아닌 행만 deletedRows에 추가
      const toTrack = toDelete.filter((row) => !row._isNew);
      if (toTrack.length > 0) {
        setDeletedRows((old) => [...old, ...toTrack]);
      }

      return remaining;
    });

    toast.info(`${selectedNodes.length}개 행이 삭제되었습니다.`);
  }, [toast]);

  // 일괄 저장
  const handleBatchSave = useCallback(() => {
    const newRows = rowData.filter((row) => row._isNew);
    const modifiedRows = rowData.filter(
      (row) => row._isModified && !row._isNew
    );

    const payload = {
      created: newRows.map(
        ({ _isNew, _isModified, _originalData, ...rest }) => rest
      ),
      updated: modifiedRows.map(
        ({ _isNew, _isModified, _originalData, ...rest }) => rest
      ),
      deleted: deletedRows.map(
        ({ _isNew, _isModified, _originalData, ...rest }) => rest
      ),
    };

    console.log("Batch Save Payload:", payload);

    // 실제로는 API 호출
    // await httpClient.post('/api/products/batch', payload);

    // 성공 후 상태 초기화
    setRowData((prev) =>
      prev.map((row) => ({
        ...row,
        _isNew: false,
        _isModified: false,
        _originalData: { ...row, _isNew: false, _isModified: false },
      }))
    );
    setDeletedRows([]);

    toast.success(
      `저장 완료: 신규 ${newRows.length}건, 수정 ${modifiedRows.length}건, 삭제 ${deletedRows.length}건`
    );
  }, [rowData, deletedRows, toast]);

  // 초기화
  const handleReset = useCallback(() => {
    setRowData(createInitialData());
    setDeletedRows([]);
    toast.info("데이터가 초기화되었습니다.");
  }, [toast]);

  // 그리드 준비
  const onGridReady = useCallback((params: GridReadyEvent) => {
    params.api.sizeColumnsToFit();
  }, []);

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="Form-Like Grid (엑셀 스타일)"
        subtitle="행 추가/삭제, Dirty Checking, 일괄 저장 기능을 제공합니다."
        icon={<Table2 className="w-5 h-5 text-softone-primary" />}
      />

      {/* 설명 */}
      <Card>
        <CardBody className="text-sm text-softone-text-secondary">
          <p>
            <strong>Dirty Checking:</strong> 셀 값이 변경되면 해당 행이
            하이라이트되고, "일괄 저장" 시 변경된 데이터만 서버로 전송됩니다.
            신규/수정/삭제 변경사항을 추적합니다.
          </p>
        </CardBody>
      </Card>

      {/* 액션 바 */}
      <Card>
        <CardBody className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              onClick={handleAddRow}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              행 추가
            </Button>
            <Button
              variant="outline"
              onClick={handleDeleteSelected}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              선택 삭제
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              초기화
            </Button>
          </div>

          <div className="flex items-center gap-4">
            {/* 변경 사항 요약 */}
            <div className="flex items-center gap-3 text-sm">
              {changesSummary.newCount > 0 && (
                <Badge variant="success">신규: {changesSummary.newCount}</Badge>
              )}
              {changesSummary.modifiedCount > 0 && (
                <Badge variant="warning">
                  수정: {changesSummary.modifiedCount}
                </Badge>
              )}
              {changesSummary.deletedCount > 0 && (
                <Badge variant="danger">
                  삭제: {changesSummary.deletedCount}
                </Badge>
              )}
            </div>

            <Button
              variant="primary"
              onClick={handleBatchSave}
              disabled={!changesSummary.hasChanges}
              leftIcon={<Save className="w-4 h-4" />}
            >
              일괄 저장
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 그리드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            상품 목록
            <span className="text-xs font-normal text-softone-text-muted">
              (더블클릭으로 셀 편집)
            </span>
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="ag-theme-alpine" style={{ height: 500 }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                resizable: true,
              }}
              onGridReady={onGridReady}
              onCellValueChanged={onCellValueChanged}
              getRowClass={getRowClass}
              rowSelection="multiple"
              stopEditingWhenCellsLoseFocus
              singleClickEdit={false}
              animateRows
              getRowId={(params) => params.data.id}
            />
          </div>
        </CardBody>
      </Card>

      {/* 삭제 예정 목록 */}
      {deletedRows.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2 text-red-600">
              <Trash2 className="w-4 h-4" />
              삭제 예정 ({deletedRows.length}건)
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {deletedRows.map((row) => (
                <Badge key={row.id} variant="danger">
                  {row.code} - {row.name}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-softone-text-muted mt-2">
              * "일괄 저장" 시 서버에서 삭제됩니다.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

FormLikeGridPage.displayName = "FormLikeGridPage";
