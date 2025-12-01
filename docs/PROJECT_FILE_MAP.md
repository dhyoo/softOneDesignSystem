## SoftOne Design System 파일/폴더 지도 (쉽게 보는 MAP)

이 문서는 **“어떤 폴더에 뭐가 들어 있고, 각각이 무슨 역할을 하는지”**를  
지도로 보는 느낌으로 아주 쉽게 정리한 것입니다.

---

## 1. 프로젝트 루트 (맨 바깥)

- **`package.json`**  
  - 프로젝트의 **설정과 명령어 모음집**입니다.
  - 예: `npm run dev`, `npm run storybook`, `npm run test` 등이 여기 정의되어 있습니다.

- **`README.md`**  
  - 이 프로젝트가 **무슨 프로젝트인지, 어떻게 시작하는지** 정리된 설명서입니다.

- **`docs/` 폴더**  
  - `PROJECT_BOOT_SEQUENCE.md` : “프로젝트가 어떻게 켜지는지”를 설명하는 문서  
  - `FEATURE_SPECIFICATION.md` : 어떤 기능들을 만들지 정리한 문서  
  - `PROJECT_FILE_MAP.md` : 지금 보고 있는 **폴더/파일 지도**

- **`src/` 폴더**  
  - 실제 리액트 코드(프론트엔드 앱)가 들어 있는 **메인 소스 코드 폴더**입니다.

- **`backend-mock/` 폴더**  
  - 가짜 백엔드 서버(Express + SQLite)가 들어 있습니다.  
  - 프론트엔드가 **진짜 서버가 없는 상태에서도** API를 연습할 수 있게 도와줍니다.

- **`storybook-static/` 폴더**  
  - Storybook을 빌드했을 때 나오는 **정적 파일들**입니다.  
  - 자동 생성되는 결과물이라, 보통 직접 수정하지 않습니다.

---

## 2. `src/` – 프론트엔드 코드의 중심

`src` 폴더는 크게 네 덩어리로 나뉩니다.

- **`core/`** : 디자인 시스템 + 공통 로직 (버튼, 카드, 레이아웃, 스토어 등 “공용 레고 조각들”)  
- **`features/`** : 실제 화면/도메인 기능 (사용자 관리, 상품, 대시보드 등 “완성된 방들”)  
- **`shells/`** : 앱을 켜고, 라우터/레이아웃을 연결하는 진입점 (“집의 외벽 / 문”)  
- **`app/`** : 여러 Shell에서 공통으로 쓸 수 있는 엔트리 래퍼

추가로:

- **`assets/`** : 이미지 등 정적 리소스
- **`test/`** : 테스트 관련 설정

아래에서 하나씩 봅니다.

---

## 3. `src/app/` – 공통 App 래퍼

- **`AppEntry.tsx`**
  - React Query, 전역 에러 바운더리 등을 한 번에 감싸주는 **공통 껍데기 컴포넌트**입니다.
  - 나중에 SPA, Next.js 등 여러 런타임에서 **같은 방식으로** 쓸 수 있도록 설계됨.

---

## 4. `src/shells/` – 앱의 “겉껍데기”와 진입점

현재는 `spa/` 하나의 Shell이 있습니다.

- **`spa/main.tsx`**
  - 리액트 앱을 **실제로 켜는 엔트리 파일**입니다.
  - 하는 일:
    - AG Grid 모듈 등록 (표 기능 준비)
    - `#root` DOM 요소에 React 앱 연결 (`ReactDOM.createRoot(...)`)
    - `QueryClientProvider`, `BrowserRouter`, `SpaNavigationProvider`, `SpaAppShell` 등을 쌓아서  
      앱의 기본 구조를 구성
    - `ReactQueryDevtools` 같은 개발자 도구 연결

- **`spa/AppRouter.tsx`**
  - `"/users"`, `"/dashboard"` 같은 **URL과 페이지 컴포넌트**를 연결해 주는 **길 안내표**입니다.

- **`spa/SpaAppShell.tsx`**
  - 로그인 여부와 현재 URL을 보고:
    - 로그인 페이지 같은 공개 페이지는 **레이아웃 없이**,
    - 그 외 페이지는 `MainLayout`으로 감싸서  
      사이드바/헤더가 있는 관리자 화면 스타일로 보여줍니다.

- **`spa/SpaNavigationProvider.tsx`**
  - React Router의 `useNavigate`, `useLocation`을 감싸서  
    “어디서든 똑같은 인터페이스로 이동(push/replace/back)” 할 수 있게 도와줍니다.
  - 나중에 Next.js 같은 다른 런타임에서도 **인터페이스만 맞추면 교체 가능**하게 설계.

- **`spa/ProtectedRoute.tsx`**
  - “여기는 로그인한 사람만 들어올 수 있어요”를 담당하는 **문지기 컴포넌트**입니다.

- **`spa/RoleBasedRoute.tsx`**
  - “여기는 ADMIN만 들어올 수 있어요”처럼 **역할(Role)** 에 따라  
    접근을 허용하거나 막는 **보안 문**입니다.

- **`spa/ForbiddenPage.tsx`**
  - 권한이 없을 때 보여주는 “접근 금지” 페이지입니다.

---

## 5. `src/core/` – 디자인 시스템 + 공용 로직

### 5.1 `core/api/` – API/네트워크 관련

- **`httpClient.ts`**
  - Axios 기반 HTTP 클라이언트 설정 (베이스 URL, 공통 헤더 등).

- **`queryClient.ts`**
  - React Query의 `QueryClient` 설정 파일입니다.
  - 캐시 전략, 에러 핸들링 등 앱 전역 데이터 요청 규칙을 정합니다.

- **`userMenuPolicyApi.ts`**
  - 사용자 메뉴/권한과 관련된 API 호출 함수들을 모아둔 파일입니다.

- **`index.ts`**
  - 위 API 관련 모듈들을 한 번에 export 하는 허브 파일입니다.

### 5.2 `core/auth/` – 인증/권한 타입

- **`role.types.ts`**
  - `ADMIN`, `MANAGER`, `USER` 같은 **역할(Role)** 타입 정의.

- **`userMenuPolicy.types.ts`**
  - 사용자 메뉴 접근 정책 관련 타입 정의.

### 5.3 `core/components/error/`

- **`GlobalErrorBoundary.tsx`**
  - 리액트 앱에서 화면을 그리다가 큰 에러가 나도,  
    전체가 깨지지 않도록 잡아주는 **전역 에러 방지 울타리**입니다.

### 5.4 `core/components/layout/`

- **`PageHeader.tsx`**
  - 페이지 상단 타이틀/설명/버튼(액션)을 한 번에 보여주는 헤더 컴포넌트.

- **`index.ts`**
  - 레이아웃 관련 컴포넌트를 한 번에 export.

### 5.5 `core/components/navigation/`

- **`SDSLink.tsx`**
  - 리액트 라우터/다른 런타임과 상관없이 쓸 수 있게 추상화된 **공용 링크 컴포넌트**.

- **`SDSLink.stories.tsx`**
  - Storybook에서 SDSLink를 테스트/문서화하는 스토리 파일.

- **`SDSLink.test.tsx`**
  - SDSLink가 잘 동작하는지 확인하는 테스트 코드.

### 5.6 `core/components/ui/` – 디자인 시스템 UI 컴포넌트들

여기는 **버튼, 카드, 모달, 인풋, 테이블, 탭, 토스트 등**  
모든 화면에서 재사용되는 **“레고 블록”** 들이 모여 있습니다.

- 폼/입력 계열: `Input.tsx`, `Select.tsx`, `Checkbox.tsx`, `CheckboxGroup.tsx`, `Label.tsx`, `FormFieldWrapper.tsx`
- 버튼/배지: `Button.tsx`, `Badge.tsx`
- 레이아웃 카드: `Card.tsx`, `StatCard.tsx`
- 모달/다이얼로그: `BaseModal.tsx`, `Modal.tsx`, `FormDialog.tsx`, `ConfirmDialog.tsx`, `Drawer.tsx`, `DialogRoot.tsx`
- 리스트/표: `DataTable.tsx`, `Pagination.tsx`
- 캘린더: `CalendarWrapper.tsx`
- 파일 업로드: `FileUpload.tsx`
- 리치 텍스트 에디터: `RichTextEditor.tsx`, `RichTextEditorToolbar.tsx`, `RichTextViewer.tsx`
- 기타 유틸: `JsonViewer.tsx`, `Tabs.tsx`, `Tooltip.tsx`, `ToastContainer.tsx`, `TreeView.tsx`, `tree.types.ts`
- **`stories/` 폴더**: 위 컴포넌트들을 Storybook에서 보여주기 위한 스토리들.
- **`index.ts`**: 모든 UI 컴포넌트를 한 번에 export.

### 5.7 `core/hooks/`

- **`useAuth.ts`**
  - 로그인 정보, 토큰, 역할 등 **인증 상태를 읽고 변경하는 훅**입니다.

- **`useDialog.ts`**
  - 전역 다이얼로그(모달)를 열고 닫는 훅.

- **`usePermission.tsx`**
  - 현재 사용자에게 어떤 메뉴/기능이 허용되는지 체크하는 훅.

- **`useToast.ts`**
  - 전역 토스트 알림을 띄우는 훅.

- **`index.ts`**
  - 위 훅들을 한 번에 export.

### 5.8 `core/layout/`

- **`AuthLayout.tsx`**
  - 로그인/회원가입 같은 인증 페이지용 레이아웃.

- **`MainLayout.tsx`**
  - 사이드바, 헤더, 콘텐츠 영역이 있는 메인 레이아웃.

- **`Header.tsx`, `Sidebar.tsx`, `SidebarNew.tsx`, `Breadcrumbs.tsx`**
  - 상단/좌측 메뉴, 빵조각(페이지 위치 표시) 등 **공통 레이아웃 요소들**.

### 5.9 `core/router/`

- **`NavigationContext.tsx`**
  - `SpaNavigationProvider` 등에서 사용하는 **네비게이션 컨텍스트** 정의.

- **`menuConfig.ts`, `menu.types.ts`, `menuAccessUtils.ts`**
  - 왼쪽 메뉴 트리, 메뉴 타입, 어떤 역할이 어떤 메뉴를 볼 수 있는지 등의 로직.

- **`routeConfig.ts`**
  - 어떤 URL에 어떤 페이지 컴포넌트를 연결할지 정의해 둔 **라우트 설정표**.

- **`index.ts`, `navigation.types.ts`**
  - 라우터 관련 타입/함수를 모아서 export.

### 5.10 `core/store/` – Zustand 전역 상태

- **`authStore.ts`**
  - 로그인 상태, 토큰, 사용자 정보 등을 저장하는 전역 스토어.

- **`uiStore.ts`**
  - 사이드바 열림/닫힘, 다크모드 같은 UI 상태 관리.

- **`dialogStore.ts`, `toastStore.ts`, `menuStore.ts`**
  - 다이얼로그/토스트/메뉴 관련 전역 상태.

- **`dialogStore.test.ts`**
  - 다이얼로그 스토어 동작 테스트.

- **`index.ts`**
  - 모든 스토어 export.

### 5.11 `core/styles/`

- **`globals.css`**
  - Tailwind 기반 전역 스타일, 레이아웃/폰트/기본 스타일 정의.

- **`design-tokens.md`**
  - 색상, 간격, 타이포그래피 등 디자인 토큰 설명.

### 5.12 `core/utils/`

- **`cn.ts`, `classUtils.ts`**
  - 클래스 이름을 깔끔하게 합치기 위한 유틸.

- **`dateUtils.ts`, `dateUtils.test.ts`**
  - 날짜 포맷팅/계산 유틸 + 테스트.

- **`formatUtils.ts`, `formatUtils.test.ts`**
  - 숫자/문자열 포맷 유틸 + 테스트.

- **`enumUtils.ts`, `gradeUtils.ts`, `gridUtils.ts`, `fileUtils.ts`, `openapiUtils.ts`**
  - 각종 도메인/표/파일 처리/오픈API 관련 유틸 함수 모음.

- **`index.ts`**
  - 모든 유틸 export.

---

## 6. `src/features/` – 실제 기능(도메인) 모음

각 폴더는 “하나의 기능(도메인)”을 의미합니다.  
패턴은 거의 비슷합니다:

- `api/` : 이 기능에서 사용하는 API 호출
- `model/` : 타입 정의
- `pages/` : 실제 라우팅되는 페이지 컴포넌트
- `ui/` : 이 기능 전용 UI 컴포넌트
- `store/` : 이 기능 전용 상태 관리

### 6.1 `features/auth/` – 로그인/권한

- **`api/authApi.ts`** : 로그인/로그아웃, 토큰 발급 등 인증 API.
- **`pages/LoginPage.tsx`** : 로그인 화면 페이지.
- **`pages/RolePermissionDesignerPage.tsx`** : 역할/권한을 설계하는 페이지.
- **`pages/UserMenuPolicyDesignerPage.tsx`** : 사용자별 메뉴/권한 설정 페이지.
- **`ui/LoginForm.tsx`** : 로그인 폼 UI.

### 6.2 `features/users/` – 사용자 관리

- **`api/userApi.ts`** : 사용자 리스트 조회, 상세, 생성/수정 API.
- **`model/user.types.ts`** : 사용자 타입 정의.
- **`pages/UserListPage.tsx`, `UserListWithDialogPage.tsx`** : 사용자 목록 페이지들.
- **`ui/UserFilterForm.tsx`** : 사용자 필터 폼.
- **`ui/UserTable.tsx`** : 사용자 목록 테이블.
- **`ui/UserProfileImageUpload.tsx`** : 프로필 이미지 업로드 컴포넌트.

### 6.3 `features/products/` – 상품 관리

- **`model/product.types.ts`** : 상품 타입 정의.
- **`store/productStore.ts`** : 상품 상태 관리.
- **`pages/ProductCrudPage.tsx`** : 상품 등록/수정/목록까지 한 번에 처리하는 페이지.
- **`ui/ProductForm.tsx`** : 상품 등록/수정 폼.

### 6.4 `features/dashboard/` – 대시보드

- **`api/dashboardApi.ts`** : 대시보드용 통계/차트 데이터 API.
- **`pages/DashboardPage.tsx`** : 카드/차트 등으로 현황을 보여주는 메인 대시보드 페이지.

### 6.5 `features/articles/` – 게시글/공지

- **`api/articleApi.ts`** : 게시글 생성/조회 API.
- **`model/article.types.ts`** : 게시글 타입 정의.
- **`pages/ArticleCreatePage.tsx`** : 글 작성 페이지.
- **`ui/ArticleForm.tsx`** : 리치 텍스트 에디터를 포함한 글 작성 폼.

### 6.6 `features/schedules/` – 일정 관리

- **`api/scheduleApi.ts`** : 일정 관련 API.
- **`model/schedule.types.ts`** : 일정 타입 정의.
- **`pages/SchedulePage.tsx`** : FullCalendar 기반 일정 관리 화면.

### 6.7 `features/grid-samples/` – 그리드 샘플 모음

- **`api/gridSampleApi.ts`** : Grid 샘플에 사용하는 API.
- **`pages/*.tsx`** : AG Grid, TanStack Table 관련 다양한 예제 페이지들  
  (페이징, 그룹핑, 마스터-디테일, 트리 데이터, 폼 스타일 그리드 등).
- **`store/*.ts`** : 각 샘플에서 사용하는 그리드 상태 관리.

### 6.8 그 외 기능들

- **`features/notifications/`**
  - 알림 템플릿 관리 페이지 (`NotificationTemplatePage.tsx`).

- **`features/settings/`**
  - 메뉴 관리 페이지 (`MenuManagementPage.tsx`).

- **`features/system/`**
  - 시스템 설정 페이지 (`SystemSettingsPage.tsx`).

- **`features/dev/`**
  - 메뉴 트리 프리뷰 등 **개발 편의용 페이지**들.

- **`features/api-playground/`**
  - Swagger/OpenAPI를 불러와서, API를 실험해 보는 플레이그라운드.

---

## 7. `backend-mock/` – 가짜 백엔드 서버 구조

- **`server.ts`**
  - Express 서버를 켜고, `/api/health`, `/api/grid/*` 같은 엔드포인트를 등록합니다.

- **`routes/gridRoutes.ts`**
  - 그리드 관련 라우트 정의 (`/api/grid/users`, `/api/grid/orders`, `/api/grid/sales` 등).

- **`repositories/UserGridRepository.ts`**
  - SQLite에서 데이터를 읽어 그리드용 형식으로 변환하는 레이어.

- **`db/sqliteClient.ts`**
  - SQLite 데이터베이스 연결/종료 관리.

- **`package.json`, `tsconfig.json`**
  - 목 서버 전용 의존성/타입스크립트 설정.

---

## 8. 이 지도를 어떻게 쓰면 좋을까?

- “이 파일 뭐 하는 거지?” 싶을 때,
  - **폴더 이름 → 이 문서의 해당 섹션**을 찾아보면 대략적인 역할을 이해할 수 있습니다.
- 새로운 기능을 만들 때,
  - `features` 아래에 비슷한 패턴으로 `api/`, `model/`, `pages/`, `ui/`, `store/`를 만들면  
    **기존 코드와 잘 어울리는 구조**를 유지할 수 있습니다.

필요하다면, 특정 폴더(예: `features/products/`나 `core/components/ui/`)만 따로 더 자세히 파서  
“심화 버전 MAP”도 만들어 줄 수 있습니다.


