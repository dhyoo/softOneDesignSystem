/**
 * SoftOne Design System - Swagger Playground Page
 * 작성: SoftOne Frontend Team
 *
 * 스펙 기반(Meta-driven) API Playground:
 *   Swagger/OpenAPI URL을 입력받아 스펙을 로드하고,
 *   엔드포인트 선택 → 파라미터 입력 → API 실행 → 결과 확인까지
 *   전 과정을 하나의 페이지에서 제공.
 *
 * 중복 업무 감소:
 *   - API 폼/파라미터 하드코딩 불필요
 *   - 새 API 추가 시 스펙 URL만 입력하면 자동 폼 생성
 *   - Request/Response 미리보기로 디버깅 편의성 향상
 */

import React, { useState, useMemo, useCallback } from "react";
import axios, { AxiosError } from "axios";
import {
  Globe,
  Loader2,
  AlertCircle,
  Server,
  Code,
  FileJson,
  RefreshCw,
} from "lucide-react";

import { PageHeader } from "@core/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "@core/components/ui/Card";
import { Input } from "@core/components/ui/Input";
import { Select } from "@core/components/ui/Select";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { Tabs } from "@core/components/ui/Tabs";
import { JsonViewer } from "@core/components/ui/JsonViewer";
import { useToast } from "@core/hooks/useToast";

import { useOpenApiSpecQuery } from "../api/swaggerLoader";
import { EndpointSelector } from "../ui/EndpointSelector";
import { ApiParamForm } from "../ui/ApiParamForm";
import type {
  ApiOperationMeta,
  ApiRequestPayload,
  ApiRequestResult,
  RequestPreview,
} from "../model/openapi.types";
import { HTTP_METHOD_VARIANTS } from "../model/openapi.types";

// ========================================
// Sample Swagger URLs
// ========================================

const SAMPLE_SWAGGER_URLS = [
  {
    label: "Petstore (OpenAPI 3.0)",
    value: "https://petstore3.swagger.io/api/v3/openapi.json",
  },
  {
    label: "Petstore (Swagger 2.0)",
    value: "https://petstore.swagger.io/v2/swagger.json",
  },
  {
    label: "JSONPlaceholder",
    value: "https://jsonplaceholder.typicode.com/swagger.json",
  },
];

// ========================================
// SwaggerPlaygroundPage Component
// ========================================

export const SwaggerPlaygroundPage: React.FC = () => {
  const toast = useToast();

  // State
  const [swaggerUrl, setSwaggerUrl] = useState("");
  const [inputUrl, setInputUrl] = useState("");
  const [selectedOperationId, setSelectedOperationId] = useState<string>("");
  const [selectedServer, setSelectedServer] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [requestResult, setRequestResult] = useState<ApiRequestResult | null>(null);
  const [requestPreview, setRequestPreview] = useState<RequestPreview | null>(null);

  // 스펙 로딩
  const {
    data: specData,
    isLoading: isLoadingSpec,
    error: specError,
    refetch: refetchSpec,
  } = useOpenApiSpecQuery(swaggerUrl || null);

  // 선택된 Operation
  const selectedOperation = useMemo(() => {
    if (!specData || !selectedOperationId) return null;
    return specData.operations.find((op) => op.id === selectedOperationId) || null;
  }, [specData, selectedOperationId]);

  // 서버 옵션
  const serverOptions = useMemo(() => {
    if (!specData?.servers.length) return [];
    return specData.servers.map((s) => ({
      value: s.url,
      label: s.description || s.url,
    }));
  }, [specData]);

  // URL 로드
  const handleLoadSpec = useCallback(() => {
    if (!inputUrl.trim()) {
      toast.warning("Swagger URL을 입력해주세요.");
      return;
    }

    setSwaggerUrl(inputUrl.trim());
    setSelectedOperationId("");
    setRequestResult(null);
    setRequestPreview(null);
  }, [inputUrl, toast]);

  // 샘플 URL 선택
  const handleSelectSample = useCallback((url: string) => {
    setInputUrl(url);
    setSwaggerUrl(url);
    setSelectedOperationId("");
    setRequestResult(null);
    setRequestPreview(null);
  }, []);

  // Operation 선택
  const handleSelectOperation = useCallback((operationId: string) => {
    setSelectedOperationId(operationId);
    setRequestResult(null);
    setRequestPreview(null);
  }, []);

  // 서버 선택 (첫 로드 시 자동 선택)
  React.useEffect(() => {
    if (specData?.servers.length && !selectedServer) {
      setSelectedServer(specData.servers[0].url);
    }
  }, [specData, selectedServer]);

  // Request Preview 생성
  const buildRequestPreview = useCallback(
    (operation: ApiOperationMeta, payload: ApiRequestPayload): RequestPreview => {
      const baseUrl = selectedServer || "";
      let path = operation.path;

      // Path 파라미터 치환
      for (const [key, value] of Object.entries(payload.pathParams)) {
        if (value !== undefined && value !== null && value !== "") {
          path = path.replace(`{${key}}`, encodeURIComponent(String(value)));
        }
      }

      // Query 파라미터 추가
      const queryEntries = Object.entries(payload.queryParams).filter(
        ([, value]) => value !== undefined && value !== null && value !== ""
      );
      const queryString = queryEntries.length
        ? "?" + queryEntries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&")
        : "";

      // 헤더 구성
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      for (const [key, value] of Object.entries(payload.headerParams)) {
        if (value !== undefined && value !== null && value !== "") {
          headers[key] = String(value);
        }
      }

      return {
        url: baseUrl + path + queryString,
        method: operation.method,
        headers,
        body: payload.body || null,
      };
    },
    [selectedServer]
  );

  // API 실행
  const handleExecuteApi = useCallback(
    async (payload: ApiRequestPayload) => {
      if (!selectedOperation) return;

      const preview = buildRequestPreview(selectedOperation, payload);
      setRequestPreview(preview);
      setIsExecuting(true);
      setRequestResult(null);

      const startTime = Date.now();

      try {
        const response = await axios({
          method: preview.method.toLowerCase(),
          url: preview.url,
          headers: preview.headers,
          data: preview.body,
          timeout: 30000,
          validateStatus: () => true, // 모든 상태 코드 허용
        });

        const duration = Date.now() - startTime;

        // 응답 헤더 추출
        const responseHeaders: Record<string, string> = {};
        for (const [key, value] of Object.entries(response.headers)) {
          if (typeof value === "string") {
            responseHeaders[key] = value;
          }
        }

        setRequestResult({
          success: response.status >= 200 && response.status < 300,
          status: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
          data: response.data,
          duration,
        });

        if (response.status >= 200 && response.status < 300) {
          toast.success(`요청 성공 (${response.status})`, { duration: 3000 });
        } else {
          toast.warning(`응답: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        const duration = Date.now() - startTime;
        const axiosError = error as AxiosError;

        setRequestResult({
          success: false,
          status: axiosError.response?.status || 0,
          statusText: axiosError.message,
          headers: {},
          data: axiosError.response?.data || null,
          duration,
          error: axiosError.message,
        });

        toast.error(`요청 실패: ${axiosError.message}`);
      } finally {
        setIsExecuting(false);
      }
    },
    [selectedOperation, buildRequestPreview, toast]
  );

  return (
    <div className="space-y-6 sds-animate-fade-in">
      {/* 페이지 헤더 */}
      <PageHeader
        title="Swagger Playground"
        subtitle="OpenAPI 스펙을 로드하여 API를 테스트합니다."
        icon={<Globe className="w-5 h-5 text-softone-primary" />}
      />

      {/* Swagger URL 입력 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <FileJson className="w-4 h-4" />
            OpenAPI Specification URL
          </CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          {/* URL 입력 */}
          <div className="flex gap-2">
            <Input
              placeholder="https://example.com/api-docs/swagger.json"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLoadSpec()}
              className="flex-1"
            />
            <Button
              onClick={handleLoadSpec}
              loading={isLoadingSpec}
              disabled={!inputUrl.trim()}
            >
              로드
            </Button>
            {swaggerUrl && (
              <Button
                variant="outline"
                onClick={() => refetchSpec()}
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                새로고침
              </Button>
            )}
          </div>

          {/* 샘플 URL */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-softone-text-muted">샘플:</span>
            {SAMPLE_SWAGGER_URLS.map((sample) => (
              <Button
                key={sample.value}
                variant="ghost"
                size="sm"
                onClick={() => handleSelectSample(sample.value)}
              >
                {sample.label}
              </Button>
            ))}
          </div>

          {/* 에러 표시 */}
          {specError && (
            <div className="flex items-center gap-2 p-3 bg-softone-danger/10 text-softone-danger rounded-md">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="text-sm">
                스펙 로딩 실패: {specError.message}
              </span>
            </div>
          )}

          {/* 스펙 정보 */}
          {specData && (
            <div className="flex items-center justify-between p-3 bg-softone-bg rounded-md">
              <div>
                <div className="font-medium text-softone-text">
                  {specData.info.title}
                </div>
                <div className="text-sm text-softone-text-secondary">
                  v{specData.info.version} • {specData.operations.length}개 엔드포인트
                </div>
              </div>
              <Badge variant="info">{specData.version}</Badge>
            </div>
          )}

          {/* 서버 선택 */}
          {serverOptions.length > 1 && (
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-softone-text-muted" />
              <Select
                options={serverOptions}
                value={selectedServer}
                onChange={(e) => setSelectedServer(e.target.value)}
                className="flex-1"
              />
            </div>
          )}
        </CardBody>
      </Card>

      {/* 메인 콘텐츠 */}
      {specData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 좌측: 엔드포인트 목록 */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Endpoints</CardTitle>
            </CardHeader>
            <EndpointSelector
              operations={specData.operations}
              selectedOperationId={selectedOperationId}
              onChange={handleSelectOperation}
              groupByTag
              searchable
              maxHeight={600}
            />
          </Card>

          {/* 우측: 파라미터 폼 및 결과 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 선택된 엔드포인트 정보 */}
            {selectedOperation ? (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={HTTP_METHOD_VARIANTS[selectedOperation.method]}>
                        {selectedOperation.method}
                      </Badge>
                      <code className="text-sm font-mono">
                        {selectedOperation.path}
                      </code>
                    </div>
                    {selectedOperation.operationId && (
                      <span className="text-xs text-softone-text-muted">
                        {selectedOperation.operationId}
                      </span>
                    )}
                  </CardHeader>
                  {selectedOperation.summary && (
                    <CardBody className="pt-0 text-sm text-softone-text-secondary">
                      {selectedOperation.summary}
                    </CardBody>
                  )}
                </Card>

                {/* 파라미터 폼 */}
                <ApiParamForm
                  operation={selectedOperation}
                  onSubmit={handleExecuteApi}
                  loading={isExecuting}
                />

                {/* Request/Response 탭 */}
                {(requestPreview || requestResult) && (
                  <Tabs defaultValue="request">
                    <Tabs.List>
                      <Tabs.Trigger value="request">
                        <Code className="w-4 h-4 mr-1" />
                        Request Preview
                      </Tabs.Trigger>
                      <Tabs.Trigger value="response">
                        Response
                        {requestResult && (
                          <Badge
                            variant={requestResult.success ? "success" : "danger"}
                            size="sm"
                            className="ml-2"
                          >
                            {requestResult.status}
                          </Badge>
                        )}
                      </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="request">
                      {requestPreview && (
                        <div className="space-y-4 mt-4">
                          <JsonViewer
                            data={{
                              method: requestPreview.method,
                              url: requestPreview.url,
                              headers: requestPreview.headers,
                            }}
                            title="Request Info"
                          />
                          {!!requestPreview.body && (
                            <JsonViewer
                              data={requestPreview.body as Record<string, unknown>}
                              title="Request Body"
                            />
                          )}
                        </div>
                      )}
                    </Tabs.Content>

                    <Tabs.Content value="response">
                      {isExecuting ? (
                        <div className="flex items-center justify-center py-12">
                          <Loader2 className="w-8 h-8 text-softone-primary animate-spin" />
                        </div>
                      ) : requestResult ? (
                        <div className="space-y-4 mt-4">
                          {/* 상태 정보 */}
                          <div className="flex items-center gap-4 p-3 bg-softone-bg rounded-md">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-softone-text-muted">Status:</span>
                              <Badge variant={requestResult.success ? "success" : "danger"}>
                                {requestResult.status} {requestResult.statusText}
                              </Badge>
                            </div>
                            <div className="text-sm text-softone-text-muted">
                              Duration: {requestResult.duration}ms
                            </div>
                          </div>

                          {/* 에러 메시지 */}
                          {requestResult.error && (
                            <div className="p-3 bg-softone-danger/10 text-softone-danger rounded-md text-sm">
                              {requestResult.error}
                            </div>
                          )}

                          {/* 응답 헤더 */}
                          {Object.keys(requestResult.headers).length > 0 && (
                            <JsonViewer
                              data={requestResult.headers}
                              title="Response Headers"
                              collapsed
                            />
                          )}

                          {/* 응답 데이터 */}
                          <JsonViewer
                            data={requestResult.data as Record<string, unknown>}
                            title="Response Body"
                            maxHeight={500}
                          />
                        </div>
                      ) : (
                        <div className="py-12 text-center text-softone-text-muted">
                          API를 실행하면 결과가 여기에 표시됩니다.
                        </div>
                      )}
                    </Tabs.Content>
                  </Tabs>
                )}
              </>
            ) : (
              <Card>
                <CardBody className="py-16 text-center text-softone-text-muted">
                  <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>왼쪽에서 테스트할 엔드포인트를 선택하세요.</p>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* 로딩 중 */}
      {isLoadingSpec && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-softone-primary animate-spin" />
          <span className="ml-2 text-softone-text-muted">스펙 로딩 중...</span>
        </div>
      )}
    </div>
  );
};

SwaggerPlaygroundPage.displayName = "SwaggerPlaygroundPage";

