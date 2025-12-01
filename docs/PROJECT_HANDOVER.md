# SoftOne Design System - 프로젝트 인수인계 문서

> **마지막 업데이트**: 2024년 11월 30일  
> **GitHub**: https://github.com/dhyoo/softOneDesignSystem  
> **담당자**: SoftOne Frontend Team

---

## 🎯 프로젝트 개요

**SoftOne Design System(SDS)**은 기업용 관리자 어드민 프레임워크를 위한 종합 디자인 시스템입니다.

### 기술 스택

- **프레임워크**: React 18 + TypeScript + Vite
- **스타일링**: Tailwind CSS + CSS Variables
- **상태 관리**: Zustand (클라이언트) + TanStack Query v5 (서버)
- **폼 관리**: React Hook Form + Zod v4
- **라우팅**: React Router v6
- **그리드**: ag-Grid + @tanstack/react-table
- **차트**: Recharts
- **문서화**: Storybook
- **테스트**: Vitest
- **Mock 백엔드**: Express + better-sqlite3

---

## ✅ 완료된 작업 (Step별)

### Step 8: Swagger/OpenAPI Playground

| 파일                                                          | 설명                    |
| ------------------------------------------------------------- | ----------------------- |
| `src/core/utils/openapiUtils.ts`                              | OpenAPI v3 파서         |
| `src/core/components/ui/JsonViewer.tsx`                       | JSON 데이터 뷰어        |
| `src/features/api-playground/api/swaggerLoader.ts`            | 스펙 로드 API           |
| `src/features/api-playground/ui/EndpointSelector.tsx`         | 엔드포인트 선택 UI      |
| `src/features/api-playground/ui/ApiParamForm.tsx`             | 파라미터 폼 (RHF + Zod) |
| `src/features/api-playground/pages/SwaggerPlaygroundPage.tsx` | 메인 페이지             |

**라우트**: `/tools/swagger-playground`

---

### Step 9-1 & 9-2: Grid Samples Lab

#### Part 1: 기본 패턴 (5개)

| 페이지         | 파일                                | 설명                         |
| -------------- | ----------------------------------- | ---------------------------- |
| 집계 & 그룹화  | `AgAggregationGroupingPage.tsx`     | ag-Grid 그룹화 + sum/average |
| 역할 기반 컬럼 | `TanStackRoleBasedGridPage.tsx`     | 역할별 컬럼 표시/숨김        |
| 인라인 편집    | `AgEditingValidationPage.tsx`       | 셀 편집 + 유효성 검사        |
| 무한 스크롤    | `InfiniteScrollVirtualGridPage.tsx` | 10k+ rows 지원               |
| 피벗 & 차트    | `AgPivotChartPlaygroundPage.tsx`    | 선택 → 차트 시각화           |

#### Part 2: 고급 패턴 (5개)

| 페이지              | 파일                               | 설명                          |
| ------------------- | ---------------------------------- | ----------------------------- |
| 멀티 그리드 탭      | `MultiGridTabsPage.tsx`            | 탭별 독립 Zustand 스토어      |
| 트리 데이터         | `TreeDataGridPage.tsx`             | 계층형 데이터 (조직도)        |
| 폼 스타일           | `FormLikeGridPage.tsx`             | 행 추가/삭제 + Dirty Checking |
| 필터 플레이그라운드 | `TanStackFilterPlaygroundPage.tsx` | URL QueryString 동기화        |
| 마스터-디테일       | `MultiGridMasterDetailPage.tsx`    | 상호 연결된 멀티 그리드       |

#### 공통 파일

| 파일                                                   | 설명                                    |
| ------------------------------------------------------ | --------------------------------------- |
| `src/core/model/grid.types.ts`                         | PaginationState, SortState, FilterState |
| `src/core/utils/gridUtils.ts`                          | formatCellNumber, formatCellDate 등     |
| `src/features/grid-samples/store/userGridStore.ts`     | 사용자 그리드 스토어                    |
| `src/features/grid-samples/store/orderGridStore.ts`    | 주문 그리드 스토어                      |
| `src/features/grid-samples/store/masterDetailStore.ts` | 마스터-디테일 스토어                    |

---

### Step 10: Dialog & Popup System

| 파일                                       | 설명                                  |
| ------------------------------------------ | ------------------------------------- |
| `src/core/store/dialogStore.ts`            | 전역 다이얼로그 상태 관리             |
| `src/core/hooks/useDialog.ts`              | openModal, openConfirm, openDrawer 훅 |
| `src/core/components/ui/DialogRoot.tsx`    | 전역 다이얼로그 컨테이너              |
| `src/core/components/ui/BaseModal.tsx`     | 기본 모달 (A11y: focus trap, ESC)     |
| `src/core/components/ui/ConfirmDialog.tsx` | 확인/취소 다이얼로그                  |
| `src/core/components/ui/Drawer.tsx`        | 사이드 패널                           |
| `src/core/components/ui/FormDialog.tsx`    | 폼 + 모달                             |

---

### Step 12: RBAC System (Role/Grade 기반 권한)

| 파일                                | 설명                                            |
| ----------------------------------- | ----------------------------------------------- |
| `src/core/auth/role.types.ts`       | Role, Grade, PermissionKey, ROLE_PERMISSION_MAP |
| `src/core/utils/gradeUtils.ts`      | 직급 관련 유틸리티                              |
| `src/core/hooks/usePermission.tsx`  | hasPermission, PermissionGuard                  |
| `src/core/router/menu.types.ts`     | MenuNode 타입 (4-Depth)                         |
| `src/core/router/menuConfig.ts`     | 메뉴 트리 정의                                  |
| `src/shells/spa/ProtectedRoute.tsx` | 인증/권한 라우트 가드                           |
| `src/shells/spa/ForbiddenPage.tsx`  | 403 페이지                                      |

#### Role 정의

```typescript
ROLES = ["SYSTEM_ADMIN", "ORG_ADMIN", "MANAGER", "STAFF", "GUEST"];
```

#### Grade 정의

```typescript
GRADES = ["EXECUTIVE", "TEAM_LEAD", "SENIOR", "JUNIOR", "INTERN"];
```

---

### User Menu Policy System

| 파일                                                     | 설명                                     |
| -------------------------------------------------------- | ---------------------------------------- |
| `src/core/auth/userMenuPolicy.types.ts`                  | UserMenuPolicy 인터페이스                |
| `src/core/router/menuAccessUtils.ts`                     | buildAccessContext 함수                  |
| `src/core/api/userMenuPolicyApi.ts`                      | 정책 CRUD API (Mock)                     |
| `src/core/store/authStore.ts`                            | userMenuPolicy, accessibleRouteKeys 필드 |
| `src/core/layout/Sidebar.tsx`                            | filteredMenuTree 기반 렌더링             |
| `src/core/layout/Breadcrumbs.tsx`                        | accessibleRouteKeys 기반 필터링          |
| `src/features/auth/pages/UserMenuPolicyDesignerPage.tsx` | 정책 관리 UI                             |

**라우트**: `/auth/user-menu-policy`

#### UserMenuPolicy 구조

```typescript
interface UserMenuPolicy {
  userId: string;
  allowedPermissions?: PermissionKey[]; // 추가 허용
  deniedPermissions?: PermissionKey[]; // 차단
  allowedRouteKeys?: string[]; // 화이트리스트
  deniedRouteKeys?: string[]; // 블랙리스트
  defaultLandingRouteKey?: string; // 초기 진입 페이지
}
```

---

### 기타 기능

| 기능            | 파일                                            | 설명                                       |
| --------------- | ----------------------------------------------- | ------------------------------------------ |
| 상품 CRUD       | `src/features/products/`                        | ProductCrudPage, ProductForm, productStore |
| 일정 관리       | `src/features/schedules/`                       | CalendarWrapper 활용                       |
| 사용자 관리     | `src/features/users/`                           | UserListPage, UserListWithDialogPage       |
| 게시글          | `src/features/articles/`                        | RichTextEditor 활용                        |
| 메뉴 관리       | `src/features/settings/MenuManagementPage.tsx`  | 동적 메뉴 CRUD                             |
| Menu Playground | `src/features/dev/pages/MenuPlaygroundPage.tsx` | 권한 시뮬레이터                            |

---

## 🐛 해결된 이슈

### 1. Zod v4 API 변경

**문제**: `z.enum({ required_error: "..." })` 오류

**해결**: Zod v4에서는 다음과 같이 변경:

```typescript
// Before (Zod v3)
z.enum(["A", "B"], { required_error: "필수입니다" });

// After (Zod v4)
z.enum(["A", "B"], "필수입니다");
```

### 2. React StrictMode 이중 실행

**문제**: useEffect가 두 번 실행되어 토스트 메시지 중복

**해결**: useRef로 실행 여부 추적

```typescript
const isDataLoadedRef = useRef(false);

useEffect(() => {
  if (isDataLoadedRef.current) return;
  isDataLoadedRef.current = true;
  // 데이터 로드 로직
}, []);
```

### 3. usePermission.ts → usePermission.tsx

**문제**: JSX 사용 파일에서 `.ts` 확장자 오류

**해결**: PermissionGuard 컴포넌트 포함으로 `.tsx`로 변경

---

## 📁 주요 디렉토리 구조

```
softoneDesignSystem/
├── src/
│   ├── core/                    # 핵심 공통 모듈
│   │   ├── api/                 # httpClient, queryClient
│   │   ├── auth/                # role.types, userMenuPolicy.types
│   │   ├── components/ui/       # 40+ UI 컴포넌트
│   │   ├── hooks/               # useAuth, usePermission, useDialog, useToast
│   │   ├── layout/              # Sidebar, Header, Breadcrumbs
│   │   ├── router/              # routeConfig, menuConfig, menuAccessUtils
│   │   ├── store/               # authStore, uiStore, toastStore, dialogStore
│   │   └── utils/               # gridUtils, gradeUtils, openapiUtils
│   │
│   ├── features/                # 도메인별 기능
│   │   ├── api-playground/      # Swagger Playground
│   │   ├── auth/                # 로그인, 권한 관리
│   │   ├── dashboard/           # 대시보드
│   │   ├── dev/                 # 개발자 도구 (Menu Playground)
│   │   ├── grid-samples/        # 그리드 샘플 9개
│   │   ├── products/            # 상품 CRUD
│   │   ├── settings/            # 메뉴 관리
│   │   └── users/               # 사용자 관리
│   │
│   └── shells/spa/              # SPA 라우터, 진입점
│
├── backend-mock/                # Express + SQLite Mock 서버
├── docs/                        # 문서
│   ├── FEATURE_SPECIFICATION.md # 전체 기능 정의서
│   └── PROJECT_HANDOVER.md      # 이 문서
└── .storybook/                  # Storybook 설정
```

---

## 🚀 실행 방법

### 개발 서버

```bash
cd softoneDesignSystem
npm install
npm run dev
```

### Storybook

```bash
npm run storybook
```

### 동시 실행 (App + Storybook)

```bash
npm run dev:all
```

### Mock 백엔드

```bash
cd backend-mock
npm install
npm run dev
```

---

## 📋 향후 작업 목록 (Pending)

1. **백엔드 실제 연동**

   - Mock API → 실제 API 교체
   - `USE_MOCK_API = false` 설정

2. **테스트 보강**

   - Vitest 단위 테스트 추가
   - Storybook 인터랙션 테스트

3. **추가 기능**

   - 다국어 지원 (i18n)
   - 다크 모드 토글
   - PWA 지원

4. **성능 최적화**
   - 코드 스플리팅 개선
   - 번들 사이즈 최적화

---

## 🔑 로그인 테스트 계정

| 역할         | 이메일                 | 비밀번호 | 권한             |
| ------------ | ---------------------- | -------- | ---------------- |
| SYSTEM_ADMIN | admin@softone.co.kr    | admin123 | 전체             |
| ORG_ADMIN    | orgadmin@softone.co.kr | admin123 | 조직 관리        |
| MANAGER      | manager@softone.co.kr  | admin123 | 사용자/상품 관리 |
| STAFF        | staff@softone.co.kr    | admin123 | 기본             |
| GUEST        | guest@softone.co.kr    | admin123 | 대시보드만       |

---

## 📝 작업 재개 시 참고사항

### 새 PC에서 시작할 때

```bash
# 1. 클론
git clone https://github.com/dhyoo/softOneDesignSystem.git
cd softOneDesignSystem

# 2. 의존성 설치
npm install

# 3. 개발 서버 시작
npm run dev
```

### AI 어시스턴트에게 컨텍스트 제공

대화 시작 시 다음을 전달:

```
[프로젝트 컨텍스트]
- GitHub: https://github.com/dhyoo/softOneDesignSystem
- 문서: docs/FEATURE_SPECIFICATION.md, docs/PROJECT_HANDOVER.md
- 완료: Step 8 (Swagger), Step 9 (Grid), Step 10 (Dialog), Step 12 (RBAC), User Menu Policy
- 기술: React 18, TypeScript, Zustand, TanStack Query, Zod v4, ag-Grid
```

### 주의사항

1. **Zod v4 문법** 사용 (required_error → 직접 string 전달)
2. **Tabs 컴포넌트**: `Tabs.List`, `Tabs.Trigger`, `Tabs.Content` (Compound Pattern)
3. **Checkbox/Select**: `onChange` 사용 (onCheckedChange/onValueChange 아님)
4. **ConfirmDialog**: `confirmLabel` prop 사용

---

## 변경 이력

| 날짜       | 작업 내용                                   |
| ---------- | ------------------------------------------- |
| 2024-11-30 | User Menu Policy 시스템 완성                |
| 2024-11-30 | 기능 정의서 (FEATURE_SPECIFICATION.md) 작성 |
| 2024-11-30 | GitHub 초기 푸시 완료                       |

---

_이 문서는 다른 PC에서 동일한 컨텍스트로 작업을 이어가기 위한 인수인계 문서입니다._
