# SoftOne Design System (SDS)

Production-Ready Admin UI Framework

## 🚀 Quick Start

```bash
# 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 테스트 실행
npm run test

# Storybook 실행
npm run storybook
```

## 📁 프로젝트 구조

```
src/
├── shells/               # Runtime-specific shells
│   └── spa/              # Vite + React Router SPA Shell
│       ├── main.tsx
│       ├── SpaAppShell.tsx
│       ├── SpaNavigationProvider.tsx
│       ├── AppRouter.tsx
│       ├── ProtectedRoute.tsx      # 인증 필요 라우트 보호
│       └── RoleBasedRoute.tsx      # 역할 기반 접근 제어
│
├── core/                 # SDS Core (Runtime 중립)
│   ├── api/              # HTTP Client, Query Client
│   ├── components/
│   │   ├── error/        # Error Boundary
│   │   ├── layout/       # PageHeader
│   │   ├── navigation/   # SDSLink
│   │   └── ui/           # Button, Badge, Card, Input, Modal, StatCard, Calendar, FileUpload, DataTable, Pagination, RichTextEditor
│   ├── hooks/            # useAuth, useRequireAuth, useRoleCheck
│   ├── layout/           # MainLayout, Sidebar, Header, AuthLayout
│   ├── router/           # NavigationContext, routeConfig
│   ├── store/            # uiStore, authStore
│   ├── styles/           # globals.css, design-tokens
│   └── utils/            # cn, date, format, enum, file
│
└── features/             # Domain Features
    ├── auth/             # 인증 기능
    ├── dashboard/        # 대시보드 (통계, 차트)
    ├── grid-samples/     # AG Grid, TanStack Table 예제
    ├── schedules/        # 일정 관리 (FullCalendar)
    ├── users/            # 사용자 관리
    └── articles/         # 게시글/공지사항 (RichTextEditor)
```

## 🏗️ Architecture

### 3-Layer Architecture

1. **SDS Core** (`src/core`)

   - Runtime 중립적인 코어 모듈
   - Design Tokens, UI Components, Utils
   - Auth Store, Hooks

2. **Features** (`src/features`)

   - 도메인별 기능 모듈
   - Core만 의존

3. **Shells** (`src/shells`)
   - Runtime-specific 진입점
   - ProtectedRoute, RoleBasedRoute

## 🔐 인증 & 인가

### Auth Store

```tsx
import { useAuth } from "@core/hooks/useAuth";

const { user, roles, isAuthenticated, login, logout, hasRole } = useAuth();

// 로그인
login({ user, accessToken });

// 역할 체크
if (hasRole("ADMIN")) {
  // Admin만 접근 가능한 로직
}
```

### Protected Routes

```tsx
// 인증 필요
<ProtectedRoute>
  <DashboardPage />
</ProtectedRoute>

// 역할 필요
<RoleBasedRoute allowedRoles={["ADMIN", "MANAGER"]}>
  <UserManagementPage />
</RoleBasedRoute>
```

### 테스트 계정

| 역할   | 아이디  | 비밀번호   |
| ------ | ------- | ---------- |
| 관리자 | admin   | admin123   |
| 매니저 | manager | manager123 |
| 사용자 | user    | user123    |

## 🧩 Core UI Components

### Form Components

```tsx
import { Input, Label, FormField, Checkbox } from "@core/components/ui";

<FormField label="이메일" required error={errors.email?.message}>
  <Input
    type="email"
    placeholder="이메일을 입력하세요"
    error={!!errors.email}
    fullWidth
    {...register("email")}
  />
</FormField>

<Checkbox label="로그인 상태 유지" {...register("rememberMe")} />
```

### Button

```tsx
<Button variant="primary" size="md">Primary</Button>
<Button variant="outline" leftIcon={<Plus />}>Add</Button>
<Button variant="ghost" loading>Loading</Button>
```

### Badge

```tsx
<Badge variant="success">활성</Badge>
<EnumBadge meta={getEnumMeta(USER_STATUS, 'ACTIVE')} />
```

### Card

```tsx
<Card>
  <CardHeader actions={<Button size="sm">편집</Button>}>
    <CardTitle>카드 제목</CardTitle>
  </CardHeader>
  <CardBody>카드 내용...</CardBody>
  <CardFooter>
    <Button variant="outline">취소</Button>
    <Button variant="primary">확인</Button>
  </CardFooter>
</Card>
```

## 📊 List Components (Step 4)

### DataTable

```tsx
import { DataTable, type DataTableColumn } from "@core/components/ui";

const columns: DataTableColumn<User>[] = [
  { key: "name", header: "이름" },
  { key: "email", header: "이메일" },
  {
    key: "status",
    header: "상태",
    render: (row) => (
      <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
    ),
  },
];

<DataTable
  columns={columns}
  data={users}
  rowKey={(row) => row.id}
  loading={isLoading}
  emptyMessage="데이터가 없습니다"
  striped
  hoverable
  onRowClick={(row) => navigate(`/users/${row.id}`)}
/>;
```

### Pagination

```tsx
import { Pagination, PaginationInfo } from "@core/components/ui";

<div className="flex justify-between">
  <PaginationInfo page={1} pageSize={10} total={100} />
  <Pagination
    page={page}
    pageSize={10}
    total={total}
    onChange={(newPage) => setPage(newPage)}
  />
</div>;
```

### Select

```tsx
import { Select, type SelectOption } from "@core/components/ui";

const options: SelectOption[] = [
  { value: "", label: "전체" },
  { value: "ACTIVE", label: "활성" },
  { value: "PENDING", label: "대기" },
];

<Select
  options={options}
  value={status}
  onChange={(e) => setStatus(e.target.value)}
  fullWidth
/>;
```

## 👥 User Management Feature

### 리스트 조회 (TanStack Query)

```tsx
import { useUserListQuery } from "@features/users";

const { data, isLoading } = useUserListQuery({
  page: 1,
  pageSize: 10,
  status: "ACTIVE",
  keyword: "김",
});

// data: { data: User[], total: number, page: number, pageSize: number }
```

### 페이지 구성 패턴

```tsx
// 표준 리스트 페이지 구성
<div>
  <PageHeader title="사용자 관리" actions={<Button>사용자 등록</Button>} />
  <UserFilterForm
    values={filters}
    onChange={setFilters}
    onSearch={handleSearch}
  />
  <Card>
    <CardBody className="p-0">
      <UserTable data={data} loading={isLoading} onRowClick={handleRowClick} />
    </CardBody>
  </Card>
  <Pagination
    page={page}
    pageSize={pageSize}
    total={total}
    onChange={setPage}
  />
</div>
```

## 🎨 Step 5 Components

### Modal

```tsx
import { Modal } from "@core/components/ui";

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="확인"
  footer={
    <>
      <Button variant="outline" onClick={handleClose}>
        취소
      </Button>
      <Button variant="primary" onClick={handleConfirm}>
        확인
      </Button>
    </>
  }
>
  <p>모달 내용입니다.</p>
</Modal>;
```

### StatCard

```tsx
import { StatCard } from "@core/components/ui";

<StatCard
  title="전체 사용자"
  value={1234}
  icon={<Users className="w-5 h-5" />}
  variant="primary"
  trend={{ value: "+12%", direction: "up", label: "지난달 대비" }}
/>;
```

### CalendarWrapper

```tsx
import { CalendarWrapper } from "@core/components/ui";

<CalendarWrapper
  events={events}
  onEventClick={(event) => console.log(event)}
  onDateSelect={(start, end) => console.log(start, end)}
  height={600}
/>;
```

### FileUpload

```tsx
import { FileUpload } from "@core/components/ui";

<FileUpload
  label="파일 업로드"
  description="최대 5MB"
  acceptExtensions={["jpg", "png", "pdf"]}
  maxSizeMb={5}
  multiple
  onFilesSelected={(files) => console.log(files)}
/>;
```

### PageHeader

```tsx
import { PageHeader } from "@core/components/layout";

<PageHeader
  title="페이지 제목"
  subtitle="페이지 설명"
  icon={<Users className="w-5 h-5 text-softone-primary" />}
  actions={<Button>액션</Button>}
/>;
```

## ✍️ Step 6: Rich Text Editor

### RichTextEditor

```tsx
import { RichTextEditor } from "@core/components/ui";

// 기본 사용
<RichTextEditor
  value={content}
  onChange={(html) => setContent(html)}
  placeholder="내용을 입력하세요..."
  minHeight={300}
/>;

// React Hook Form + Controller
<Controller
  name="contentHtml"
  control={control}
  render={({ field }) => (
    <RichTextEditor
      value={field.value}
      onChange={field.onChange}
      error={!!errors.contentHtml}
    />
  )}
/>;
```

### RichTextViewer

```tsx
import { RichTextViewer } from "@core/components/ui";

// ⚠️ XSS 방지를 위해 서버에서 sanitize 필요
<RichTextViewer html={sanitizedHtml} />;
```

### Article Form 패턴

```tsx
import { ArticleForm } from "@features/articles";
import { useCreateArticleMutation } from "@features/articles";

const { mutate, isPending } = useCreateArticleMutation();

<ArticleForm
  onSubmit={(data) => mutate(data)}
  onCancel={() => navigation.push("/articles")}
  loading={isPending}
/>;
```

## 📋 Implementation Status

### Step 1 ✅

- [x] Vite + React + TypeScript 설정
- [x] Navigation 추상화 (NavigationApi, SDSLink)
- [x] Global Error Boundary
- [x] Zustand + React Query 설정

### Step 2 ✅

- [x] Tailwind Design Token 확장
- [x] Core Utils (cn, date, format, enum)
- [x] SDS UI Kit (Button, Badge, Card)
- [x] Sidebar 네비게이션

### Step 3 ✅

- [x] Auth Store & useAuth Hook
- [x] Form Components (Input, Label, Checkbox)
- [x] Login Feature (React Hook Form + Zod)
- [x] ProtectedRoute & RoleBasedRoute
- [x] 역할 기반 메뉴 필터링

### Step 4 ✅

- [x] List UI Components (Select, DataTable, Pagination)
- [x] User Management Feature
- [x] UserFilterForm, UserTable 패턴 표준화
- [x] TanStack Query 기반 데이터 조회

### Step 5 ✅

- [x] Modal, StatCard, CalendarWrapper, FileUpload
- [x] PageHeader 레이아웃 컴포넌트
- [x] fileUtils (파일 검증 유틸리티)
- [x] Dashboard Feature (Recharts 차트)
- [x] Grid Samples (AG Grid, TanStack Table)
- [x] Schedule Feature (FullCalendar)

### Step 6 ✅ (현재)

- [x] RichTextEditor (Tiptap 기반)
- [x] RichTextEditorToolbar, RichTextViewer
- [x] Article Feature (게시글/공지사항)
- [x] RHF + Controller + Editor 통합 패턴

### Step 7 (Next)

- [ ] Toast Notification
- [ ] Global Loading Indicator
- [ ] Error Handling 패턴

## 📝 Scripts

```bash
npm run dev           # 개발 서버
npm run build         # 프로덕션 빌드
npm run test          # Vitest 실행
npm run storybook     # Storybook 실행
npm run lint          # ESLint 실행
```

## 🔧 Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

---

© 2024 SoftOne. All Rights Reserved.
