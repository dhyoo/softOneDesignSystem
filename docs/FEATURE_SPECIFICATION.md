# SoftOne Design System (SDS) 기능 정의서

> **작성일**: 2024년 11월  
> **버전**: 1.0.0  
> **작성**: SoftOne Frontend Team

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [아키텍처 구조](#2-아키텍처-구조)
3. [핵심 UI 컴포넌트](#3-핵심-ui-컴포넌트)
4. [인증/인가 시스템 (RBAC)](#4-인증인가-시스템-rbac)
5. [User Menu Policy 시스템](#5-user-menu-policy-시스템)
6. [메뉴/라우팅 시스템](#6-메뉴라우팅-시스템)
7. [Swagger/OpenAPI Playground](#7-swaggeropenapi-playground)
8. [Grid Samples Lab](#8-grid-samples-lab)
9. [Dialog & Popup 시스템](#9-dialog--popup-시스템)
10. [상태 관리](#10-상태-관리)
11. [API 및 Mock 시스템](#11-api-및-mock-시스템)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 목적

SoftOne Design System(SDS)은 기업용 관리자 어드민 프레임워크를 위한 종합 디자인 시스템입니다. React 기반의 모던 프론트엔드 기술 스택을 활용하여 일관된 UI/UX와 재사용 가능한 컴포넌트를 제공합니다.

### 1.2 기술 스택

| 분류            | 기술                                           |
| --------------- | ---------------------------------------------- |
| **프레임워크**  | React 18, TypeScript                           |
| **빌드 도구**   | Vite                                           |
| **스타일링**    | Tailwind CSS + CSS Variables                   |
| **상태 관리**   | Zustand (클라이언트), TanStack Query v5 (서버) |
| **폼 관리**     | React Hook Form + Zod                          |
| **라우팅**      | React Router v6                                |
| **그리드**      | ag-Grid, @tanstack/react-table                 |
| **차트**        | Recharts                                       |
| **문서화**      | Storybook                                      |
| **테스트**      | Vitest                                         |
| **Mock 백엔드** | Express + better-sqlite3                       |

### 1.3 디렉토리 구조

```
softoneDesignSystem/
├── src/
│   ├── core/                    # 핵심 공통 모듈
│   │   ├── api/                 # HTTP 클라이언트, API 유틸리티
│   │   ├── auth/                # 인증/인가 타입 정의
│   │   ├── components/          # 공용 UI 컴포넌트
│   │   │   ├── ui/              # 기본 UI 컴포넌트
│   │   │   ├── layout/          # 레이아웃 컴포넌트
│   │   │   └── navigation/      # 네비게이션 컴포넌트
│   │   ├── hooks/               # 커스텀 훅
│   │   ├── layout/              # 레이아웃 (Sidebar, Header, Breadcrumbs)
│   │   ├── router/              # 라우팅 설정, 메뉴 타입
│   │   ├── store/               # Zustand 스토어
│   │   └── utils/               # 유틸리티 함수
│   │
│   ├── features/                # 도메인별 기능 모듈
│   │   ├── api-playground/      # Swagger Playground
│   │   ├── articles/            # 게시글 관리
│   │   ├── auth/                # 인증 관련 페이지
│   │   ├── dashboard/           # 대시보드
│   │   ├── dev/                 # 개발자 도구
│   │   ├── grid-samples/        # 그리드 샘플 Lab
│   │   ├── notifications/       # 알림 관리
│   │   ├── products/            # 상품 관리
│   │   ├── settings/            # 설정
│   │   ├── system/              # 시스템 설정
│   │   └── users/               # 사용자 관리
│   │
│   ├── shells/                  # 앱 쉘 (SPA, SSR 등)
│   │   └── spa/                 # SPA 라우터, 진입점
│   │
│   └── styles/                  # 글로벌 스타일
│
├── backend-mock/                # Mock 백엔드 서버
│   ├── db/                      # SQLite 클라이언트
│   ├── repositories/            # 데이터 접근 계층
│   └── routes/                  # API 라우트
│
├── docs/                        # 문서
└── .storybook/                  # Storybook 설정
```

---

## 2. 아키텍처 구조

### 2.1 3-Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Shells Layer                          │
│  (SPA Shell, SSR Shell, Micro-frontend Shell)               │
├─────────────────────────────────────────────────────────────┤
│                       Features Layer                         │
│  (api-playground, grid-samples, users, products, auth...)   │
├─────────────────────────────────────────────────────────────┤
│                         Core Layer                           │
│  (components/ui, hooks, store, router, utils, api)          │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 의존성 규칙

1. **Core Layer**: 다른 레이어에 의존하지 않음
2. **Features Layer**: Core만 의존 가능, 다른 Feature에 의존 금지
3. **Shells Layer**: Core와 Features 모두 의존 가능

---

## 3. 핵심 UI 컴포넌트

### 3.1 기본 컴포넌트

| 컴포넌트   | 경로                              | 설명                                                             |
| ---------- | --------------------------------- | ---------------------------------------------------------------- |
| `Button`   | `core/components/ui/Button.tsx`   | 버튼 (variant, size, icon 지원)                                  |
| `Input`    | `core/components/ui/Input.tsx`    | 텍스트 입력 필드                                                 |
| `Select`   | `core/components/ui/Select.tsx`   | 드롭다운 선택                                                    |
| `Checkbox` | `core/components/ui/Checkbox.tsx` | 체크박스                                                         |
| `Badge`    | `core/components/ui/Badge.tsx`    | 배지 (variant: primary, success, warning, danger, info, neutral) |
| `Card`     | `core/components/ui/Card.tsx`     | 카드 컨테이너                                                    |
| `Tooltip`  | `core/components/ui/Tooltip.tsx`  | 툴팁                                                             |

### 3.2 복합 컴포넌트

| 컴포넌트     | 경로                                | 설명                            |
| ------------ | ----------------------------------- | ------------------------------- |
| `Tabs`       | `core/components/ui/Tabs.tsx`       | 탭 (Compound Component Pattern) |
| `Accordion`  | `core/components/ui/Accordion.tsx`  | 아코디언                        |
| `TreeView`   | `core/components/ui/TreeView.tsx`   | 트리 뷰                         |
| `DataTable`  | `core/components/ui/DataTable.tsx`  | 데이터 테이블                   |
| `Pagination` | `core/components/ui/Pagination.tsx` | 페이지네이션                    |

### 3.3 폼 컴포넌트

| 컴포넌트           | 경로                                      | 설명                             |
| ------------------ | ----------------------------------------- | -------------------------------- |
| `FormFieldWrapper` | `core/components/ui/FormFieldWrapper.tsx` | 폼 필드 래퍼 (라벨, 에러 메시지) |
| `CheckboxGroup`    | `core/components/ui/CheckboxGroup.tsx`    | 체크박스 그룹                    |

### 3.4 피드백 컴포넌트

| 컴포넌트         | 경로                                    | 설명                  |
| ---------------- | --------------------------------------- | --------------------- |
| `ToastContainer` | `core/components/ui/ToastContainer.tsx` | 토스트 알림 컨테이너  |
| `BaseModal`      | `core/components/ui/BaseModal.tsx`      | 기본 모달 (A11y 지원) |
| `ConfirmDialog`  | `core/components/ui/ConfirmDialog.tsx`  | 확인 다이얼로그       |
| `Drawer`         | `core/components/ui/Drawer.tsx`         | 사이드 드로어         |
| `FormDialog`     | `core/components/ui/FormDialog.tsx`     | 폼 다이얼로그         |

### 3.5 레이아웃 컴포넌트

| 컴포넌트      | 경로                                    | 설명          |
| ------------- | --------------------------------------- | ------------- |
| `PageHeader`  | `core/components/layout/PageHeader.tsx` | 페이지 헤더   |
| `Sidebar`     | `core/layout/Sidebar.tsx`               | 사이드바 메뉴 |
| `Header`      | `core/layout/Header.tsx`                | 상단 헤더     |
| `Breadcrumbs` | `core/layout/Breadcrumbs.tsx`           | 브레드크럼    |

### 3.6 특수 컴포넌트

| 컴포넌트          | 경로                                     | 설명               |
| ----------------- | ---------------------------------------- | ------------------ |
| `JsonViewer`      | `core/components/ui/JsonViewer.tsx`      | JSON 데이터 뷰어   |
| `RichTextEditor`  | `core/components/ui/RichTextEditor.tsx`  | 리치 텍스트 에디터 |
| `RichTextViewer`  | `core/components/ui/RichTextViewer.tsx`  | 리치 텍스트 뷰어   |
| `CalendarWrapper` | `core/components/ui/CalendarWrapper.tsx` | 캘린더 래퍼        |
| `FileUpload`      | `core/components/ui/FileUpload.tsx`      | 파일 업로드        |
| `StatCard`        | `core/components/ui/StatCard.tsx`        | 통계 카드          |

---

## 4. 인증/인가 시스템 (RBAC)

### 4.1 개요

Role/Grade 기반의 세분화된 권한 관리 시스템입니다.

### 4.2 역할 (Role) 정의

```typescript
// src/core/auth/role.types.ts
export const ROLES = [
  "SYSTEM_ADMIN", // 시스템 관리자 (전체 권한)
  "ORG_ADMIN", // 조직 관리자
  "MANAGER", // 관리자
  "STAFF", // 일반 직원
  "GUEST", // 게스트
] as const;

export type Role = (typeof ROLES)[number];
```

### 4.3 직급 (Grade) 정의

```typescript
export const GRADES = [
  "EXECUTIVE", // 임원 (Rank 5)
  "TEAM_LEAD", // 팀장 (Rank 4)
  "SENIOR", // 선임/과장 (Rank 3)
  "JUNIOR", // 주니어/대리 (Rank 2)
  "INTERN", // 인턴 (Rank 1)
] as const;

export type Grade = (typeof GRADES)[number];
```

### 4.4 권한 키 (PermissionKey) 구조

```typescript
// 권한 키 명명 규칙
type PermissionKeyPattern =
  | `menu:${string}:view` // 메뉴 조회 권한
  | `page:${string}:view` // 페이지 조회 권한
  | `action:${string}:${string}` // 액션 실행 권한
  | `pii:${string}`; // 개인정보 관련 권한

// 예시
PERMISSION_KEYS = {
  MENU_DASHBOARD_VIEW: "menu:dashboard:view",
  PAGE_USERS_LIST_VIEW: "page:users:list:view",
  ACTION_USERS_CREATE: "action:users:create",
  PII_VIEW_FULL: "pii:view-full",
};
```

### 4.5 Role별 Permission 매핑

| Role           | 권한 범위                                |
| -------------- | ---------------------------------------- |
| `SYSTEM_ADMIN` | 전체 권한                                |
| `ORG_ADMIN`    | 조직 관리 + 사용자 관리 + 권한 관리      |
| `MANAGER`      | 사용자 조회/생성 + 알림 관리 + 상품 관리 |
| `STAFF`        | 대시보드 + 그리드 샘플 + 게시글          |
| `GUEST`        | 대시보드 조회만 가능                     |

### 4.6 Grade별 Permission 보정

```typescript
// 직급에 따라 추가 권한 부여
GRADE_PERMISSION_BOOST = {
  EXECUTIVE: [PII_VIEW_FULL, PII_EXPORT, ACTION_DASHBOARD_STATS_EXPORT],
  TEAM_LEAD: [ACTION_USERS_GRANT_ROLE, PII_VIEW_FULL],
  SENIOR: [ACTION_USERS_CREATE, ACTION_USERS_UPDATE],
  JUNIOR: [],
  INTERN: [],
};
```

### 4.7 권한 체크 훅

```typescript
// src/core/hooks/usePermission.tsx
const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

// 단일 권한 체크
if (hasPermission("action:users:create")) {
  // 사용자 생성 가능
}

// 여러 권한 중 하나라도 있으면 통과
if (hasAnyPermission(["action:users:create", "action:users:update"])) {
  // 생성 또는 수정 가능
}

// 모든 권한이 있어야 통과
if (hasAllPermissions(["page:users:list:view", "action:users:export"])) {
  // 목록 조회 + 내보내기 모두 가능
}
```

### 4.8 PermissionGuard 컴포넌트

```tsx
<PermissionGuard requiredPermissions={["action:users:create"]} mode="all">
  <Button>사용자 생성</Button>
</PermissionGuard>

<PermissionGuard
  requiredPermissions={["action:users:create"]}
  fallback={<span>권한이 없습니다</span>}
>
  <Button>사용자 생성</Button>
</PermissionGuard>
```

---

## 5. User Menu Policy 시스템

### 5.1 개요

Role/Grade 기반 RBAC 위에 **사용자별 예외 정책**을 오버레이하는 시스템입니다.

### 5.2 UserMenuPolicy 인터페이스

```typescript
// src/core/auth/userMenuPolicy.types.ts
interface UserMenuPolicy {
  userId: string;

  // 권한 추가/차단
  allowedPermissions?: PermissionKey[]; // 추가 허용할 권한
  deniedPermissions?: PermissionKey[]; // 차단할 권한

  // 라우트 제어
  allowedRouteKeys?: string[]; // 화이트리스트 (이 목록만 허용)
  deniedRouteKeys?: string[]; // 블랙리스트 (이 목록 차단)

  // 초기 진입 페이지
  defaultLandingRouteKey?: string;

  // 메타데이터
  description?: string;
  isActive?: boolean;
  expiresAt?: string;
}
```

### 5.3 우선순위

```
1. deniedPermissions / deniedRouteKeys (최우선 차단)
2. allowedPermissions / allowedRouteKeys (추가 허용)
3. Role/Grade 기반 기본 권한
```

### 5.4 AccessContext 계산

```typescript
// src/core/router/menuAccessUtils.ts
interface AccessContext {
  finalPermissions: PermissionKey[]; // 최종 권한
  accessibleRouteKeys: string[]; // 접근 가능한 routeKey
  filteredMenuTree: MenuNode[]; // 필터링된 메뉴 트리
  defaultLandingRouteKey: string | null; // 기본 랜딩 페이지
}

const context = buildAccessContext({
  routes: routeConfig,
  menuTree: menuTree,
  basePermissions: computePermissions(role, grade),
  userMenuPolicy: policy,
});
```

### 5.5 로그인 후 초기 진입 페이지 결정

```
1. userMenuPolicy.defaultLandingRouteKey가 있고 접근 가능 → 해당 페이지
2. 위가 없으면 → accessibleRouteKeys[0] (첫 번째 접근 가능 페이지)
3. 접근 가능한 페이지가 없으면 → /forbidden
```

### 5.6 관리 화면

- **경로**: `/auth/user-menu-policy`
- **기능**:
  - 사용자 검색 및 선택
  - 허용/차단 PermissionKey 편집
  - 허용/차단 routeKey 편집 (화이트리스트/블랙리스트)
  - 기본 랜딩 페이지 선택
  - 정책 저장/삭제

---

## 6. 메뉴/라우팅 시스템

### 6.1 라우트 설정 (routeConfig)

```typescript
// src/core/router/routeConfig.ts
interface AppRouteMeta {
  key: string; // 고유 키
  path: string; // URL 경로
  label?: string; // 메뉴 라벨
  icon?: LucideIcon; // 아이콘
  routeKey?: string; // 권한 체크용 routeKey
  requiredPermissions?: PermissionKey[]; // 필요 권한
  roles?: string[]; // 허용 역할 (legacy)
  order?: number; // 정렬 순서
  group?: string; // 메뉴 그룹
  hideInMenu?: boolean; // 메뉴 숨김
  hideInBreadcrumb?: boolean; // 브레드크럼 숨김
  children?: AppRouteMeta[]; // 자식 라우트
}
```

### 6.2 메뉴 트리 (menuConfig)

```typescript
// src/core/router/menu.types.ts
type MenuNodeType = "category" | "menu" | "page" | "external";

interface CategoryMenuNode {
  type: "category";
  id: string;
  label: string;
  children: MenuNode[];
}

interface MenuGroupNode {
  type: "menu";
  id: string;
  label: string;
  icon?: LucideIcon;
  routeKey?: string;
  children?: MenuNode[];
}

interface PageMenuNode {
  type: "page";
  id: string;
  label: string;
  routeKey: string; // 필수: AppRoute.routeKey와 매핑
}

interface ExternalMenuNode {
  type: "external";
  id: string;
  label: string;
  href: string;
  target?: "_blank" | "_self";
}
```

### 6.3 4-Depth 메뉴 구조

```
Depth 1: Category (섹션 그룹)
  └── Depth 2: Menu (메뉴 그룹)
        └── Depth 3: Page/Menu (하위 메뉴)
              └── Depth 4: Page (최하위 화면)
```

### 6.4 Sidebar 메뉴 모드

```typescript
// Sidebar의 menuMode prop
type SidebarMenuMode = "filtered" | "static" | "dynamic";

// filtered: authStore.filteredMenuTree 사용 (권장, User Menu Policy 반영)
// static: 정적 routeConfig 사용
// dynamic: menuStore (동적 메뉴) 사용
```

---

## 7. Swagger/OpenAPI Playground

### 7.1 개요

OpenAPI 스펙을 기반으로 동적으로 API 테스트 UI를 생성하는 도구입니다.

### 7.2 주요 기능

| 기능             | 설명                                |
| ---------------- | ----------------------------------- |
| Swagger URL 입력 | OpenAPI 스펙 JSON 로드              |
| 엔드포인트 목록  | method + path + summary 표시        |
| 자동 폼 생성     | 파라미터/요청 본문 스키마 → 폼 변환 |
| API 호출 실행    | 입력값으로 실제 API 호출            |
| 요청/응답 표시   | JsonViewer로 결과 확인              |

### 7.3 파일 구조

```
src/features/api-playground/
├── api/
│   └── swaggerLoader.ts         # OpenAPI 스펙 로드 API
├── model/
│   └── openapi.types.ts         # OpenAPI 타입 정의
├── ui/
│   ├── EndpointSelector.tsx     # 엔드포인트 선택 UI
│   └── ApiParamForm.tsx         # 파라미터 폼 (RHF + Zod)
└── pages/
    └── SwaggerPlaygroundPage.tsx # 메인 페이지
```

### 7.4 OpenAPI 유틸리티

```typescript
// src/core/utils/openapiUtils.ts
interface ApiOperationMeta {
  id: string;
  method: HttpMethod;
  path: string;
  summary?: string;
  tags?: string[];
  parameters?: OpenApiFieldMeta[];
  requestBody?: OpenApiFieldMeta[];
}

interface OpenApiFieldMeta {
  name: string;
  type: "string" | "number" | "boolean" | "array" | "object";
  required: boolean;
  description?: string;
  enumValues?: string[];
}
```

---

## 8. Grid Samples Lab

### 8.1 개요

ag-Grid와 @tanstack/react-table을 활용한 다양한 그리드 패턴 샘플 모음입니다.

### 8.2 Part 1: 기본 패턴 (5개)

| 샘플                           | 라이브러리         | 설명                              |
| ------------------------------ | ------------------ | --------------------------------- |
| Aggregation & Grouping         | ag-Grid            | 그룹화 + 집계 (sum/average)       |
| Role-based Column Visibility   | TanStack Table     | 역할별 컬럼 표시/숨김             |
| Inline Editing & Validation    | ag-Grid            | 셀 편집 + 유효성 검사 + 배치 저장 |
| Infinite Scroll & Virtual Grid | ag-Grid            | 무한 스크롤 (10k+ rows)           |
| Pivot & Chart Integration      | ag-Grid + Recharts | 선택 데이터 → 차트 시각화         |

### 8.3 Part 2: 고급 패턴 (4개)

| 샘플                              | 설명                                      |
| --------------------------------- | ----------------------------------------- |
| Multi-Grid Tabs (Store Isolation) | 탭별 독립 Zustand 스토어                  |
| Tree Data Grid                    | 계층형 데이터 (조직도)                    |
| Form-like Grid                    | 행 추가/삭제 + Dirty Checking + 배치 저장 |
| Filter Playground (URL Sync)      | 필터/정렬/페이지네이션 ↔ URL 동기화       |

### 8.4 공통 타입

```typescript
// src/core/model/grid.types.ts
interface PaginationState {
  page: number;
  pageSize: number;
}

interface SortState {
  field: string;
  order: "asc" | "desc";
}

interface FilterState {
  field: string;
  operator: FilterOperator;
  value: any;
}

interface GridQueryParams {
  pagination?: PaginationState;
  sort?: SortState;
  filters?: FilterState[];
}
```

### 8.5 유틸리티 함수

```typescript
// src/core/utils/gridUtils.ts
formatCellNumber(value: number, options?: Intl.NumberFormatOptions): string
formatCellDate(value: Date | string, format?: string): string
getRowClassByStatus(status: string): string
buildQueryParamsFromGridState(state: GridState): GridQueryParams
```

### 8.6 Store 분리 패턴

```typescript
// 탭별 독립 스토어 예시
// src/features/grid-samples/store/userGridStore.ts
const useUserGridStore = create<UserGridState>()(...);

// src/features/grid-samples/store/orderGridStore.ts
const useOrderGridStore = create<OrderGridState>()(...);
```

---

## 9. Dialog & Popup 시스템

### 9.1 개요

전역 다이얼로그 상태 관리 + 다양한 다이얼로그 타입을 제공합니다.

### 9.2 다이얼로그 유형

| 유형       | 컴포넌트        | 용도                         |
| ---------- | --------------- | ---------------------------- |
| Modal      | `BaseModal`     | 기본 모달 (커스텀 콘텐츠)    |
| Confirm    | `ConfirmDialog` | 확인/취소 패턴               |
| Drawer     | `Drawer`        | 사이드 패널 (상세보기, 필터) |
| FormDialog | `FormDialog`    | 폼 + 모달 (생성/수정)        |

### 9.3 전역 다이얼로그 Store

```typescript
// src/core/store/dialogStore.ts
interface DialogState {
  dialogs: DialogOptions[];
  openDialog: (options: DialogOptions) => string;
  closeDialog: (id: string) => void;
  closeAll: () => void;
}
```

### 9.4 useDialog 훅

```typescript
// src/core/hooks/useDialog.ts
const { openModal, openConfirm, openDrawer, openFormDialog, closeDialog } =
  useDialog();

// 확인 다이얼로그
openConfirm({
  title: "삭제 확인",
  message: "정말 삭제하시겠습니까?",
  onConfirm: () => handleDelete(),
});

// 폼 다이얼로그
openFormDialog({
  title: "사용자 생성",
  render: (close) => <UserForm onSuccess={close} />,
});
```

### 9.5 접근성 (A11y)

| 기능        | 구현                                 |
| ----------- | ------------------------------------ |
| ARIA        | `role="dialog"`, `aria-modal="true"` |
| Focus Trap  | 모달 내부로 포커스 제한              |
| ESC 닫기    | Escape 키로 닫기                     |
| 키보드 탐색 | Tab 순환                             |

---

## 10. 상태 관리

### 10.1 Zustand 스토어 목록

| 스토어                 | 경로                                                  | 용도                              |
| ---------------------- | ----------------------------------------------------- | --------------------------------- |
| `authStore`            | `core/store/authStore.ts`                             | 인증 상태, 권한, User Menu Policy |
| `uiStore`              | `core/store/uiStore.ts`                               | UI 상태 (사이드바 접힘 등)        |
| `toastStore`           | `core/store/toastStore.ts`                            | 토스트 알림 관리                  |
| `dialogStore`          | `core/store/dialogStore.ts`                           | 다이얼로그 관리                   |
| `menuStore`            | `core/store/menuStore.ts`                             | 동적 메뉴 관리                    |
| `productStore`         | `features/products/store/productStore.ts`             | 상품 CRUD                         |
| `userGridStore`        | `features/grid-samples/store/userGridStore.ts`        | 사용자 그리드 상태                |
| `orderGridStore`       | `features/grid-samples/store/orderGridStore.ts`       | 주문 그리드 상태                  |
| `masterDetailStore`    | `features/grid-samples/store/masterDetailStore.ts`    | 마스터-디테일 상태                |
| `globalStateDemoStore` | `features/grid-samples/store/globalStateDemoStore.ts` | 글로벌 상태 데모                  |

### 10.2 authStore 상세

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  role: Role | null;
  grade: Grade | null;
  basePermissions: PermissionKey[];
  permissions: PermissionKey[]; // 최종 권한 (RBAC + Policy)
  userMenuPolicy: UserMenuPolicy | null;
  accessibleRouteKeys: string[];
  filteredMenuTree: MenuNode[];
  defaultLandingRouteKey: string | null;
  isAuthLoading: boolean;
  isPolicyLoading: boolean;
}

interface AuthActions {
  login: (payload) => void;
  logout: () => void;
  updateRoleAndGrade: (role, grade) => void;
  setUserMenuPolicy: (policy) => void;
  recomputeAccessContext: () => void;
}

interface AuthGetters {
  isAuthenticated: () => boolean;
  hasPermission: (permission) => boolean;
  hasAnyPermission: (permissions) => boolean;
  hasAllPermissions: (permissions) => boolean;
  canAccessRoute: (routeKey) => boolean;
  isFullyLoaded: () => boolean;
}
```

### 10.3 Zustand 미들웨어 활용

```typescript
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

const useStore = create<State>()(
  devtools(
    persist(
      immer((set, get) => ({
        // ...
      })),
      {
        name: "store-key",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
```

---

## 11. API 및 Mock 시스템

### 11.1 HTTP 클라이언트

```typescript
// src/core/api/httpClient.ts
import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 인터셉터: 토큰 자동 첨부
httpClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 11.2 Mock 백엔드 구조

```
backend-mock/
├── server.ts                    # Express 앱 (포트 3001)
├── db/
│   └── sqliteClient.ts          # better-sqlite3 클라이언트
├── repositories/
│   └── UserGridRepository.ts    # SQL 쿼리 (페이징/정렬/필터)
└── routes/
    └── gridRoutes.ts            # API 라우트 정의
```

### 11.3 Mock API 응답 형식

```typescript
// 목록 조회 응답
interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 단일 조회/수정 응답
interface SingleResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
}
```

### 11.4 User Menu Policy API

```typescript
// src/core/api/userMenuPolicyApi.ts
fetchUserMenuPolicy(userId: string): Promise<UserMenuPolicy | null>
saveUserMenuPolicy(userId: string, input: UserMenuPolicyInput): Promise<UserMenuPolicy | null>
deleteUserMenuPolicy(userId: string): Promise<boolean>
fetchAllUserMenuPolicies(): Promise<UserMenuPolicy[]>
searchUsersForPolicy(query: string): Promise<UserInfo[]>
```

---

## 부록: 라우트 목록

### 메인 라우트

| 경로                     | 라벨             | 권한             |
| ------------------------ | ---------------- | ---------------- |
| `/dashboard`             | 대시보드         | 모든 인증 사용자 |
| `/users`                 | 사용자 관리      | ADMIN, MANAGER   |
| `/auth/user-menu-policy` | 사용자 메뉴 정책 | ADMIN            |
| `/schedules`             | 일정 관리        | 모든 인증 사용자 |
| `/products`              | 상품 관리        | 권한에 따라      |
| `/articles`              | 게시글           | 모든 인증 사용자 |

### 그리드 샘플

| 경로                              | 라벨                |
| --------------------------------- | ------------------- |
| `/grid-samples/aggregation`       | 집계 & 그룹화       |
| `/grid-samples/role-based`        | 역할 기반 컬럼      |
| `/grid-samples/editing`           | 인라인 편집         |
| `/grid-samples/infinite`          | 무한 스크롤         |
| `/grid-samples/pivot-chart`       | 피벗 & 차트         |
| `/grid-samples/multi-grid-tabs`   | 멀티 그리드 탭      |
| `/grid-samples/tree-data`         | 트리 데이터         |
| `/grid-samples/form-like`         | 폼 스타일 그리드    |
| `/grid-samples/filter-playground` | 필터 플레이그라운드 |
| `/grid-samples/master-detail`     | 마스터-디테일       |

### 개발자 도구

| 경로                        | 라벨               |
| --------------------------- | ------------------ |
| `/tools/swagger-playground` | Swagger Playground |
| `/dev/menu-playground`      | Menu Playground    |

---

## 변경 이력

| 버전  | 날짜    | 변경 내용      |
| ----- | ------- | -------------- |
| 1.0.0 | 2024-11 | 초기 문서 작성 |

---

_이 문서는 SoftOne Design System의 공식 기능 정의서입니다._
