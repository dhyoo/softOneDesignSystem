/**
 * SoftOne Design System - ag-Grid Editing & Validation Page
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – 재사용 가능한 그리드 패턴 캡슐화:
 *   ag-Grid의 인라인 셀 편집 및 유효성 검증 기능을 시연합니다.
 *   - 셀 더블클릭으로 편집 모드 진입
 *   - 값 범위 검증 (수량 0~1000, 가격 0~10,000,000)
 *   - 유효성 오류 시 스타일 변경 (빨간 배경)
 *   - 변경된 행 추적 및 일괄 저장
 */

import React, { useState, useCallback, useMemo, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  CellValueChangedEvent,
  CellClassRules,
  ValueFormatterParams,
  GridReadyEvent,
  GridApi,
  ValueParserParams,
  ICellRendererParams,
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
import {
  Edit3,
  Save,
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

import { useProductDataQuery, type ProductData } from "../api/gridSampleApi";
import { formatCellNumber, formatCellCurrency } from "@core/utils/gridUtils";

// ========================================
// Types
// ========================================

interface EditableProductData extends ProductData {
  _errors: Record<string, string>;
  _isModified: boolean;
  _originalData: ProductData;
}

interface RowChange {
  rowId: string;
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

// ========================================
// Validation Rules
// ========================================

interface ValidationRule {
  min?: number;
  max?: number;
  required?: boolean;
  message?: string;
}

const VALIDATION_RULES: Record<string, ValidationRule> = {
  price: {
    min: 0,
    max: 10000000,
    required: true,
    message: "가격은 0 ~ 10,000,000 사이여야 합니다",
  },
  quantity: {
    min: 0,
    max: 1000,
    required: true,
    message: "수량은 0 ~ 1,000 사이여야 합니다",
  },
  discount: {
    min: 0,
    max: 100,
    message: "할인율은 0 ~ 100% 사이여야 합니다",
  },
  name: {
    required: true,
    message: "상품명은 필수입니다",
  },
};

/**
 * 값 유효성 검증
 */
function validateValue(
  field: string,
  value: unknown
): { valid: boolean; message: string | null } {
  const rule = VALIDATION_RULES[field];
  if (!rule) return { valid: true, message: null };

  // 필수 체크
  if (
    rule.required &&
    (value === null || value === undefined || value === "")
  ) {
    return {
      valid: false,
      message: rule.message || `${field}은(는) 필수입니다`,
    };
  }

  // 숫자 범위 체크
  if (typeof value === "number" || !isNaN(Number(value))) {
    const numValue = Number(value);

    if (rule.min !== undefined && numValue < rule.min) {
      return { valid: false, message: rule.message || `최소값: ${rule.min}` };
    }

    if (rule.max !== undefined && numValue > rule.max) {
      return { valid: false, message: rule.message || `최대값: ${rule.max}` };
    }
  }

  return { valid: true, message: null };
}

// ========================================
// Custom Cell Editors
// ========================================

// 숫자 입력용 Value Parser
const numberValueParser = (params: ValueParserParams) => {
  const value = params.newValue;
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const parsed = Number(value);
  return isNaN(parsed) ? params.oldValue : parsed;
};

// ========================================
// AgEditingValidationPage Component
// ========================================

export const AgEditingValidationPage: React.FC = () => {
  const toast = useToast();
  const gridRef = useRef<AgGridReact<EditableProductData>>(null);
  const gridApiRef = useRef<GridApi<EditableProductData> | null>(null);

  // 데이터 로딩
  const { data: rawData, isLoading, refetch } = useProductDataQuery();

  // 로컬 상태
  const [rowData, setRowData] = useState<EditableProductData[]>([]);
  const [changes, setChanges] = useState<RowChange[]>([]);

  // 에러가 있는 행 개수
  const errorCount = useMemo(() => {
    return rowData.filter((row) => Object.keys(row._errors).length > 0).length;
  }, [rowData]);

  // 수정된 행 개수
  const modifiedCount = useMemo(() => {
    return rowData.filter((row) => row._isModified).length;
  }, [rowData]);

  // 데이터 초기화
  React.useEffect(() => {
    if (rawData && rawData.length > 0) {
      const enhancedData: EditableProductData[] = rawData.map((item) => ({
        ...item,
        _errors: {},
        _isModified: false,
        _originalData: { ...item },
      }));
      setRowData(enhancedData);
      setChanges([]);
    }
  }, [rawData]);

  // 셀 값 변경 핸들러
  const onCellValueChanged = useCallback(
    (event: CellValueChangedEvent<EditableProductData>) => {
      const { data, colDef, newValue, oldValue } = event;
      if (!data || !colDef.field) return;

      const field = colDef.field;

      // 값이 실제로 변경되었는지 확인
      if (oldValue === newValue) return;

      // 유효성 검증
      const validation = validateValue(field, newValue);

      // 행 데이터 업데이트
      setRowData((prev) => {
        return prev.map((row) => {
          if (row.id !== data.id) return row;

          const newErrors = { ...row._errors };
          if (!validation.valid && validation.message) {
            newErrors[field] = validation.message;
          } else {
            delete newErrors[field];
          }

          // 원본과 비교하여 수정 여부 결정
          const original = row._originalData;
          const currentValue =
            field in original
              ? original[field as keyof ProductData]
              : undefined;
          const isFieldModified = currentValue !== newValue;

          // 다른 필드의 수정 여부도 확인
          const otherFieldsModified = Object.keys(original).some((key) => {
            if (key === field || key.startsWith("_")) return false;
            return (
              row[key as keyof EditableProductData] !==
              original[key as keyof ProductData]
            );
          });

          const isModified = isFieldModified || otherFieldsModified;

          return {
            ...row,
            [field]: newValue,
            _errors: newErrors,
            _isModified: isModified,
          };
        });
      });

      // 변경 기록 추가
      setChanges((prev) => {
        // 같은 행, 같은 필드의 기존 변경 제거
        const filtered = prev.filter(
          (c) => !(c.rowId === data.id && c.field === field)
        );

        // 원본과 다른 경우에만 변경 기록 추가
        const original = data._originalData;
        const originalValue =
          field in original ? original[field as keyof ProductData] : undefined;

        if (originalValue !== newValue) {
          filtered.push({
            rowId: data.id,
            field,
            oldValue: originalValue,
            newValue,
          });
        }

        return filtered;
      });

      // 에러 토스트
      if (!validation.valid && validation.message) {
        toast.warning(validation.message);
      }

      // 그리드 새로고침 (스타일 업데이트)
      setTimeout(() => {
        gridApiRef.current?.refreshCells({
          rowNodes: [event.node!],
          force: true,
        });
      }, 0);
    },
    [toast]
  );

  // 셀 클래스 규칙 - 에러 스타일
  const errorCellClassRules: CellClassRules<EditableProductData> = useMemo(
    () => ({
      "bg-red-100 border-red-400 border-2": (params) => {
        if (!params.data || !params.colDef?.field) return false;
        return !!params.data._errors[params.colDef.field];
      },
      "bg-amber-50": (params) => {
        if (!params.data || !params.colDef?.field) return false;
        const field = params.colDef.field;
        if (params.data._errors[field]) return false;

        // 원본과 비교
        const original = params.data._originalData;
        const originalValue =
          field in original ? original[field as keyof ProductData] : undefined;
        return (
          params.data[field as keyof EditableProductData] !== originalValue
        );
      },
    }),
    []
  );

  // 상태 아이콘 렌더러
  const StatusIconRenderer = useCallback(
    (params: ICellRendererParams<EditableProductData>) => {
      if (!params.data) return null;

      const hasError = Object.keys(params.data._errors).length > 0;
      const isModified = params.data._isModified;

      if (hasError) {
        return (
          <div className="flex items-center justify-center h-full">
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
        );
      }

      if (isModified) {
        return (
          <div className="flex items-center justify-center h-full">
            <Edit3 className="w-4 h-4 text-amber-500" />
          </div>
        );
      }

      return (
        <div className="flex items-center justify-center h-full">
          <CheckCircle className="w-4 h-4 text-green-500" />
        </div>
      );
    },
    []
  );

  // 상태 Badge 렌더러
  const StatusBadgeRenderer = useCallback(
    (params: ICellRendererParams<EditableProductData>) => {
      if (!params.value) return null;
      return (
        <Badge variant={params.value === "ACTIVE" ? "success" : "neutral"}>
          {params.value === "ACTIVE" ? "활성" : "비활성"}
        </Badge>
      );
    },
    []
  );

  // 컬럼 정의
  const columnDefs: ColDef<EditableProductData>[] = useMemo(
    () => [
      {
        headerName: "",
        width: 50,
        cellRenderer: StatusIconRenderer,
        sortable: false,
        filter: false,
        pinned: "left",
      },
      {
        field: "id",
        headerName: "ID",
        width: 130,
        editable: false,
        cellClass: "text-softone-text-muted font-mono text-xs",
      },
      {
        field: "code",
        headerName: "상품코드",
        width: 120,
        editable: false,
      },
      {
        field: "name",
        headerName: "상품명",
        flex: 1,
        minWidth: 150,
        editable: true,
        cellClassRules: errorCellClassRules,
        headerTooltip: "필수 입력",
      },
      {
        field: "category",
        headerName: "카테고리",
        width: 120,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: [
            "전자제품",
            "의류",
            "식품",
            "가구",
            "화장품",
            "스포츠",
            "도서",
            "완구",
          ],
        },
        cellClassRules: errorCellClassRules,
      },
      {
        field: "price",
        headerName: "가격",
        width: 130,
        editable: true,
        type: "numericColumn",
        valueParser: numberValueParser,
        valueFormatter: (params: ValueFormatterParams) =>
          params.value != null ? formatCellCurrency(params.value) : "",
        cellClassRules: errorCellClassRules,
        headerTooltip: "0 ~ 10,000,000 원 (필수)",
      },
      {
        field: "quantity",
        headerName: "수량",
        width: 100,
        editable: true,
        type: "numericColumn",
        valueParser: numberValueParser,
        valueFormatter: (params: ValueFormatterParams) =>
          params.value != null ? formatCellNumber(params.value) : "",
        cellClassRules: errorCellClassRules,
        headerTooltip: "0 ~ 1,000 (필수)",
      },
      {
        field: "discount",
        headerName: "할인율(%)",
        width: 110,
        editable: true,
        type: "numericColumn",
        valueParser: numberValueParser,
        valueFormatter: (params: ValueFormatterParams) =>
          params.value != null ? `${params.value}%` : "",
        cellClassRules: errorCellClassRules,
        headerTooltip: "0 ~ 100%",
      },
      {
        field: "status",
        headerName: "상태",
        width: 100,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: {
          values: ["ACTIVE", "INACTIVE"],
        },
        cellRenderer: StatusBadgeRenderer,
        cellClassRules: errorCellClassRules,
      },
    ],
    [errorCellClassRules, StatusIconRenderer, StatusBadgeRenderer]
  );

  // 기본 컬럼 설정
  const defaultColDef = useMemo<ColDef<EditableProductData>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  // 저장 핸들러
  const handleSave = useCallback(() => {
    if (errorCount > 0) {
      toast.error(
        `${errorCount}개의 행에 유효성 오류가 있습니다. 수정 후 저장해주세요.`
      );
      return;
    }

    if (modifiedCount === 0) {
      toast.info("변경된 데이터가 없습니다.");
      return;
    }

    // 변경된 행만 추출
    const modifiedRows = rowData.filter((row) => row._isModified);
    console.log("저장할 데이터:", modifiedRows);
    console.log("변경 내역:", changes);

    // 저장 성공 시뮬레이션
    toast.success(`${modifiedRows.length}건의 데이터가 저장되었습니다.`);

    // 상태 초기화 - 원본 데이터 업데이트
    setRowData((prev) =>
      prev.map((row) => ({
        ...row,
        _isModified: false,
        _originalData: {
          id: row.id,
          code: row.code,
          name: row.name,
          category: row.category,
          price: row.price,
          quantity: row.quantity,
          discount: row.discount,
          status: row.status,
          description: row.description,
        },
      }))
    );
    setChanges([]);

    // 그리드 새로고침
    gridApiRef.current?.refreshCells({ force: true });
  }, [errorCount, modifiedCount, rowData, changes, toast]);

  // 초기화 핸들러
  const handleReset = useCallback(() => {
    refetch();
    toast.info("데이터가 초기화되었습니다.");
  }, [refetch, toast]);

  // 그리드 준비 완료
  const onGridReady = useCallback(
    (params: GridReadyEvent<EditableProductData>) => {
      gridApiRef.current = params.api;
      params.api.sizeColumnsToFit();
    },
    []
  );

  // 고유 행 ID
  const getRowId = useCallback(
    (params: { data: EditableProductData }) => params.data.id,
    []
  );

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="인라인 편집 & 유효성 검증"
        subtitle="셀을 더블클릭하여 편집하고, 입력 값의 유효성을 실시간으로 검증합니다."
        icon={<Edit3 className="w-5 h-5 text-softone-primary" />}
      />

      {/* 유효성 검증 규칙 안내 */}
      <Card className="bg-blue-50 border-blue-200">
        <CardBody className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <div className="font-semibold text-blue-900">유효성 검증 규칙</div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">상품명: 필수</Badge>
              <Badge variant="info">가격: 0 ~ 10,000,000 (필수)</Badge>
              <Badge variant="info">수량: 0 ~ 1,000 (필수)</Badge>
              <Badge variant="info">할인율: 0 ~ 100%</Badge>
            </div>
            <div className="text-sm text-blue-700 mt-2">
              💡 셀을 <strong>더블클릭</strong>하여 편집 모드로 진입합니다. 숫자
              컬럼은 직접 입력, 카테고리/상태는 드롭다운으로 선택합니다.
            </div>
          </div>
        </CardBody>
      </Card>

      {/* 상태 표시 및 액션 */}
      <Card>
        <CardBody className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span>
                수정됨: <strong>{modifiedCount}</strong>건
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              <span>
                오류: <strong>{errorCount}</strong>건
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span>
                정상:{" "}
                <strong>{rowData.length - modifiedCount - errorCount}</strong>건
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              초기화
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={modifiedCount === 0 || errorCount > 0}
              leftIcon={<Save className="w-4 h-4" />}
            >
              저장 ({modifiedCount}건)
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* 그리드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            상품 데이터 편집
            <span className="text-xs font-normal text-softone-text-muted">
              (셀 더블클릭으로 편집)
            </span>
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="ag-theme-alpine" style={{ height: 500 }}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              onCellValueChanged={onCellValueChanged}
              singleClickEdit={false}
              stopEditingWhenCellsLoseFocus
              animateRows
              loading={isLoading}
              getRowId={getRowId}
              rowSelection="single"
              enableCellTextSelection
              ensureDomOrder
            />
          </div>
        </CardBody>
      </Card>

      {/* 변경 내역 미리보기 */}
      {changes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              변경 내역 ({changes.length}건)
            </CardTitle>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium">행 ID</th>
                    <th className="text-left py-2 px-3 font-medium">필드</th>
                    <th className="text-left py-2 px-3 font-medium">이전 값</th>
                    <th className="text-left py-2 px-3 font-medium">새 값</th>
                  </tr>
                </thead>
                <tbody>
                  {changes.map((change, index) => (
                    <tr
                      key={index}
                      className="border-b last:border-0 hover:bg-gray-50"
                    >
                      <td className="py-2 px-3 font-mono text-xs">
                        {change.rowId}
                      </td>
                      <td className="py-2 px-3">{change.field}</td>
                      <td className="py-2 px-3 text-red-600 line-through">
                        {String(change.oldValue ?? "-")}
                      </td>
                      <td className="py-2 px-3 text-green-600 font-medium">
                        {String(change.newValue ?? "-")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      )}

      {/* 에러 목록 */}
      {errorCount > 0 && (
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-sm flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              유효성 오류 목록
            </CardTitle>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2">
              {rowData
                .filter((row) => Object.keys(row._errors).length > 0)
                .map((row) => (
                  <li key={row.id} className="text-sm">
                    <span className="font-mono text-xs text-gray-500">
                      {row.id}
                    </span>
                    <span className="mx-2">→</span>
                    {Object.entries(row._errors).map(([field, error]) => (
                      <Badge key={field} variant="danger" className="mr-2">
                        {field}: {error}
                      </Badge>
                    ))}
                  </li>
                ))}
            </ul>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

AgEditingValidationPage.displayName = "AgEditingValidationPage";
