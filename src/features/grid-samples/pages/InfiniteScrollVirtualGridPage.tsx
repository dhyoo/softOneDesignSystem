/**
 * SoftOne Design System - Infinite Scroll Virtual Grid Page
 * 작성: SoftOne Frontend Team
 *
 * Grid Samples Lab – 재사용 가능한 그리드 패턴 캡슐화:
 *   ag-Grid의 Infinite Row Model을 사용하여 대용량 데이터(1만 건 이상)를
 *   가상 스크롤링으로 효율적으로 표시합니다.
 *
 *   - 서버 사이드 페이징 시뮬레이션
 *   - 스크롤 시 자동 데이터 로딩
 *   - 로딩 중 인디케이터 표시
 */

import React, { useCallback, useMemo, useRef, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type {
  ColDef,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
  ValueFormatterParams,
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
import { FormFieldWrapper } from "@core/components/ui/FormFieldWrapper";
import { Select } from "@core/components/ui/Select";
import { Loader2, Database, RefreshCw, Infinity } from "lucide-react";

import { fetchLargeDataset, type SalesData } from "../api/gridSampleApi";
import {
  formatCellNumber,
  formatCellCurrency,
  formatCellPercent,
  formatCellDate,
} from "@core/utils/gridUtils";

// ========================================
// Constants
// ========================================

const TOTAL_ROWS = 10000;
const CACHE_BLOCK_SIZES = [50, 100, 200, 500];

// ========================================
// InfiniteScrollVirtualGridPage Component
// ========================================

export const InfiniteScrollVirtualGridPage: React.FC = () => {
  const gridRef = useRef<AgGridReact<SalesData>>(null);

  // 상태
  const [cacheBlockSize, setCacheBlockSize] = useState(100);
  const [loadedRows, setLoadedRows] = useState(0);
  const [isLoadingChunk, setIsLoadingChunk] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  // 컬럼 정의
  const columnDefs: ColDef<SalesData>[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 140,
        cellClass: "font-mono text-xs text-softone-text-muted",
      },
      {
        field: "productName",
        headerName: "상품명",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "category",
        headerName: "카테고리",
        width: 120,
        cellRenderer: (params: { value: string }) => (
          <Badge variant="neutral" size="sm">
            {params.value}
          </Badge>
        ),
      },
      {
        field: "region",
        headerName: "지역",
        width: 100,
      },
      {
        field: "quantity",
        headerName: "수량",
        width: 100,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellNumber(params.value),
      },
      {
        field: "unitPrice",
        headerName: "단가",
        width: 120,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellCurrency(params.value),
      },
      {
        field: "totalAmount",
        headerName: "매출액",
        width: 140,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellCurrency(params.value),
        cellClass: "font-semibold text-green-600",
      },
      {
        field: "marginRate",
        headerName: "마진율",
        width: 100,
        type: "numericColumn",
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellPercent(params.value),
        cellStyle: (params) => ({
          color:
            params.value >= 30
              ? "#16a34a"
              : params.value >= 20
              ? "#ca8a04"
              : "#dc2626",
        }),
      },
      {
        field: "status",
        headerName: "상태",
        width: 100,
        cellRenderer: (params: { value: string }) => {
          const variant =
            params.value === "COMPLETED"
              ? "success"
              : params.value === "PENDING"
              ? "warning"
              : "danger";
          const label =
            params.value === "COMPLETED"
              ? "완료"
              : params.value === "PENDING"
              ? "대기"
              : "취소";
          return <Badge variant={variant}>{label}</Badge>;
        },
      },
      {
        field: "salesDate",
        headerName: "판매일",
        width: 120,
        valueFormatter: (params: ValueFormatterParams) =>
          formatCellDate(params.value),
      },
    ],
    []
  );

  // 데이터소스 생성
  const createDatasource = useCallback((): IDatasource => {
    return {
      getRows: async (params: IGetRowsParams) => {
        setIsLoadingChunk(true);

        const pageNumber = Math.floor(params.startRow / cacheBlockSize);
        console.log(
          `[Infinite Scroll] Loading page ${pageNumber}, rows ${params.startRow}-${params.endRow}`
        );

        try {
          const result = await fetchLargeDataset(pageNumber, cacheBlockSize);

          // 로드된 행 수 업데이트
          const newLoadedRows = Math.min(params.endRow, TOTAL_ROWS);
          setLoadedRows(newLoadedRows);
          setLoadCount((prev) => prev + 1);

          // 마지막 행 계산
          const lastRow = result.nextPage === null ? result.total : -1;

          params.successCallback(result.data, lastRow);
        } catch (error) {
          console.error("Failed to load data:", error);
          params.failCallback();
        } finally {
          setIsLoadingChunk(false);
        }
      },
    };
  }, [cacheBlockSize]);

  // 그리드 준비 완료
  const onGridReady = useCallback(
    (params: GridReadyEvent) => {
      params.api.setGridOption("datasource", createDatasource());
    },
    [createDatasource]
  );

  // 캐시 블록 사이즈 변경
  const handleCacheBlockSizeChange = useCallback((newSize: number) => {
    setCacheBlockSize(newSize);
    setLoadedRows(0);
    setLoadCount(0);

    // 그리드 새로고침
    if (gridRef.current?.api) {
      gridRef.current.api.setGridOption("cacheBlockSize", newSize);
      gridRef.current.api.setGridOption("datasource", {
        getRows: async (params: IGetRowsParams) => {
          setIsLoadingChunk(true);

          const pageNumber = Math.floor(params.startRow / newSize);

          try {
            const result = await fetchLargeDataset(pageNumber, newSize);
            const newLoadedRows = Math.min(params.endRow, TOTAL_ROWS);
            setLoadedRows(newLoadedRows);
            setLoadCount((prev) => prev + 1);

            const lastRow = result.nextPage === null ? result.total : -1;
            params.successCallback(result.data, lastRow);
          } catch (error) {
            params.failCallback();
          } finally {
            setIsLoadingChunk(false);
          }
        },
      });
    }
  }, []);

  // 새로고침
  const handleRefresh = useCallback(() => {
    setLoadedRows(0);
    setLoadCount(0);

    if (gridRef.current?.api) {
      gridRef.current.api.purgeInfiniteCache();
    }
  }, []);

  // 진행률 계산
  const progressPercent = Math.round((loadedRows / TOTAL_ROWS) * 100);

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="무한 스크롤 가상화 그리드"
        subtitle="1만 건 이상의 대용량 데이터를 가상 스크롤링으로 효율적으로 표시합니다."
        icon={<Infinity className="w-5 h-5 text-softone-primary" />}
      />

      {/* 설명 */}
      <Card>
        <CardBody className="text-sm text-softone-text-secondary">
          <p>
            <strong>ag-Grid Infinite Row Model</strong>을 사용하여 서버 사이드
            페이징을 시뮬레이션합니다. 스크롤하면 자동으로 다음 데이터 청크를
            로드합니다.
          </p>
        </CardBody>
      </Card>

      {/* 설정 및 상태 */}
      <Card>
        <CardBody className="flex items-end justify-between flex-wrap gap-4">
          <div className="flex items-end gap-4">
            <FormFieldWrapper label="캐시 블록 크기" className="w-40">
              <Select
                options={CACHE_BLOCK_SIZES.map((size) => ({
                  value: String(size),
                  label: `${size}행`,
                }))}
                value={String(cacheBlockSize)}
                onChange={(e) =>
                  handleCacheBlockSizeChange(Number(e.target.value))
                }
                fullWidth
              />
            </FormFieldWrapper>

            <Button
              variant="outline"
              onClick={handleRefresh}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              새로고침
            </Button>
          </div>

          <div className="flex items-center gap-6">
            {/* 로드 카운트 */}
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-softone-text-muted" />
              <span className="text-sm">
                API 호출: <strong>{loadCount}회</strong>
              </span>
            </div>

            {/* 로딩 인디케이터 */}
            {isLoadingChunk && (
              <div className="flex items-center gap-2 text-softone-primary">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">청크 로딩 중...</span>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* 진행 상태 */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              로드된 데이터: {formatCellNumber(loadedRows)} /{" "}
              {formatCellNumber(TOTAL_ROWS)}
            </span>
            <Badge variant={progressPercent === 100 ? "success" : "primary"}>
              {progressPercent}%
            </Badge>
          </div>
          <div className="w-full bg-softone-bg rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-softone-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </CardBody>
      </Card>

      {/* 그리드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            대용량 매출 데이터
            <span className="text-xs font-normal text-softone-text-muted">
              (총 {formatCellNumber(TOTAL_ROWS)}건)
            </span>
          </CardTitle>
        </CardHeader>
        <CardBody className="p-0">
          <div className="ag-theme-alpine" style={{ height: 600 }}>
            <AgGridReact
              ref={gridRef}
              columnDefs={columnDefs}
              defaultColDef={{
                sortable: true,
                resizable: true,
              }}
              rowModelType="infinite"
              cacheBlockSize={cacheBlockSize}
              cacheOverflowSize={2}
              maxConcurrentDatasourceRequests={1}
              infiniteInitialRowCount={100}
              maxBlocksInCache={10}
              onGridReady={onGridReady}
              animateRows
              rowSelection="single"
            />
          </div>
        </CardBody>
      </Card>

      {/* 성능 팁 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">성능 최적화 팁</CardTitle>
        </CardHeader>
        <CardBody className="text-sm text-softone-text-secondary space-y-2">
          <p>
            • <strong>캐시 블록 크기:</strong> 네트워크 지연과 메모리 사용량을
            고려하여 조절
          </p>
          <p>
            • <strong>maxBlocksInCache:</strong> 메모리 관리를 위해 캐시된 블록
            수 제한
          </p>
          <p>
            • <strong>서버 인덱싱:</strong> 실제 환경에서는 DB 인덱스 최적화
            필수
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

InfiniteScrollVirtualGridPage.displayName = "InfiniteScrollVirtualGridPage";
