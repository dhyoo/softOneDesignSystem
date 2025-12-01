## SoftOne Design System이 켜지는 과정 (아주 쉽게 설명)

이 문서는 **“이 프로젝트가 어떻게 켜지는지”**를  
코딩을 잘 모르는 사람, 심지어 **초등학생도 이해할 수 있는 수준**으로 설명합니다.

중간중간에 **리액트(React)가 무엇인지, 어떻게 동작하는지**도 같이 설명할게요.

---

## 1. 준비하기 – 설치

- **한 줄 요약**: “게임 깔 듯이, 이 프로젝트가 쓸 도구들을 먼저 깔아 줍니다.”

- 프로젝트 폴더에서 아래 명령을 한 번만 실행합니다.

```bash
npm install
```

- 이 명령을 실행하면:
  - 버튼, 표, 차트 같은 **UI 라이브러리**
  - 리액트(React), 리액트 라우터(페이지 이동을 도와주는 도구)
  - 테스트, 빌드 도구들  
    이런 것들이 자동으로 설치됩니다.

---

## 2. 리액트(React) 아주 기초 설명

- **리액트는 무엇일까요?**

  - 웹 페이지를 **레고 블록처럼 조각조각 나누어서** 만드는 방법입니다.
  - 이 레고 한 조각을 **컴포넌트(component)** 라고 부릅니다.

- **컴포넌트 예시**

  - 버튼 하나, 카드 하나, 헤더 바, 메뉴 등
  - 각각을 작은 파일로 나누어 만들고,
  - 나중에 **조합해서** 큰 화면(페이지)을 만듭니다.

- **리액트 앱이 켜질 때 하는 일**
  1. HTML 안에 `<div id="root"></div>` 라는 **빈 상자**가 있습니다.
  2. 리액트가 이 상자를 찾아서
  3. 우리가 만든 컴포넌트들을 이 상자 안에 **그려 줍니다(렌더링)**.

이 프로젝트에서 그 역할을 하는 파일이 바로  
`src/shells/spa/main.tsx` 입니다.

---

## 3. 개발 서버 켜기 – 화면 보기

### 3.1 개발 서버 실행 (브라우저에서 앱 보기)

- **명령어**

```bash
npm run dev
```

- 이걸 실행하면:
  - Vite라는 도구가 **개발용 웹 서버**를 켭니다.
  - 보통 `http://localhost:5173` 주소에서 화면을 볼 수 있습니다.
  - 코드를 고치면 **자동으로 새로고침 + 화면만 살짝 교체**해 줍니다.
    - 이걸 **HMR(뜨거운 모듈 교체, Hot Module Replacement)** 라고 부르는데,
    - “전체 새로고침”이 아니라 “바뀐 부분만 갈아 끼우기”라고 생각하면 됩니다.

### 3.2 `main.tsx` 안에서 일어나는 일 (조금 더 자세히)

`src/shells/spa/main.tsx`는 **“앱을 실제로 켜는 스위치이자, 전체 무대 감독”** 같은 역할을 합니다.  
하나씩 천천히 뜯어서 볼게요.

#### 3.2.1 AG Grid 모듈 등록 – “표 도구 설치하기”

- 코드 맨 위에서 이렇게 합니다.

```ts
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
```

- 의미:
  - “우리 프로젝트에서 표(그리드)를 보여줄 건데,  
    AG Grid라는 도구의 기능들을 전부 쓸 수 있게 준비해 둔다”는 뜻입니다.
  - 마치 게임에서 “이제부터 마법사 직업도 선택할 수 있게 DLC를 설치합니다” 같은 준비 단계입니다.

#### 3.2.2 리액트 앱을 켤 ‘root’ 찾기 – “무대 위치 정하기”

```ts
ReactDOM.createRoot(document.getElementById("root")!);
```

- HTML 파일(`index.html`) 안에는 대략 이런 코드가 있습니다.

```html
<div id="root"></div>
```

- 이 `<div id="root">`는 **“리액트가 그림을 그릴 빈 캔버스”** 입니다.
- `createRoot(...)`는 “이 상자에다가 우리 앱을 그릴 준비를 해!” 라고 말하는 함수입니다.

#### 3.2.3 리액트 트리 렌더링 – “무대에 조명/음향/배우 올리기”

`main.tsx`에서 실제로 그리는 구조는 이렇게 생겼습니다.

```tsx
ReactDOM.createRoot(#root).render(
  <React.StrictMode>
    <QueryClientProvider>
      <BrowserRouter>
        <SpaNavigationProvider>
          <SpaAppShell /> {/* 실제 화면들 */}
        </SpaNavigationProvider>
      </BrowserRouter>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
```

각 층을 비유로 정리하면:

- `React.StrictMode`  
  → 개발 중에 이상한 패턴을 잡아주는 **안전 모드**
- `QueryClientProvider`  
  → 서버에서 데이터(예: 사용자 목록)를 가져오고,  
   다시 사용할 수 있게 **캐싱(보관)** 해 주는 “데이터 관리실”
- `BrowserRouter`  
  → 주소창(`/users`, `/dashboard` 등)에 따라  
   어떤 화면을 보여줄지 정해 주는 “길 안내 센터”
- `SpaNavigationProvider`  
  → “앞으로 어느 런타임이든(Next.js/SPA 등) **똑같은 방식으로 이동하도록**  
   네비게이션을 하나의 인터페이스로 묶어주는 어댑터”
- `SpaAppShell`  
  → 실제 화면의 **뼈대**:
  - 로그인 페이지처럼 레이아웃 없이 보여줄지,
  - 사이드바/헤더가 있는 메인 레이아웃을 쓸지,
  - 어떤 페이지를 보여줄지 결정하는 **최상위 껍데기**
- `ReactQueryDevtools`  
  → 개발자가 “지금 어떤 API를 불렀지?”, “캐시에 뭐가 들었지?”를  
   한 눈에 볼 수 있게 해주는 **개발자용 대시보드**

#### 3.2.4 `SpaAppShell` 안에서 실제로 벌어지는 일

`SpaAppShell`은 “로그인 했는지, 어떤 페이지인지” 에 따라  
어떤 레이아웃으로 감쌀지 결정합니다.

- 로그인 화면 같은 **공개 페이지** (`/auth/login` 등)
  - 사이드바/헤더 없이 **페이지 내용만** 보여줍니다.
  - 그래도 `GlobalErrorBoundary`로 감싸서, 큰 에러가 나도  
    “앱 전체가 하얗게 죽지 않게” 막아 줍니다.
- 로그인한 **일반 화면들**
  - `MainLayout` 안에 `AppRouter`를 넣어서,
  - 왼쪽에 메뉴, 위에 헤더, 오른쪽에 본문이 나오는  
    **관리자 페이지 스타일 레이아웃**으로 감쌉니다.
  - 이때 `useAuth()`로 가져온 `user`, `roles` 정보를 사용해서  
    헤더에 이름/이메일을 보여주거나, 메뉴를 역할에 따라 다르게 구성합니다.

정리하면, `main.tsx` → `SpaAppShell` 까지 이어지는 흐름은:

- **`main.tsx`**:
  - “리액트 앱을 어디에 그릴지” 정하고
  - “데이터/라우터/네비게이션/개발도구” 같은 **필수 인프라**를 설치한 뒤
  - **최상위 껍데기(`SpaAppShell`)를 올려놓는 역할**
- **`SpaAppShell`**:
  - “지금 URL과 로그인 상태를 보고,  
    어떤 레이아웃으로 어떤 페이지를 보여줄지” 결정하는 **무대 연출가** 역할

---

## 4. `AppEntry` – 공통으로 감싸주는 껍데기

`src/app/AppEntry.tsx`는 **“공통 포장지”** 같은 역할을 합니다.

- 하는 일:
  - `QueryClientProvider` 로 서버 데이터 관리 준비
  - `GlobalErrorBoundary` 로 큰 에러가 나도 앱이 완전히 죽지 않게 잡아줌
  - `ReactQueryDevtools` 로 개발할 때 상태를 볼 수 있게 해줌

예를 들어, 이런 식으로 씁니다.

```tsx
<AppEntry>
  {/* 여기 안에 BrowserRouter, Layout, Router 등이 들어갑니다 */}
</AppEntry>
```

- 지금 SPA에서는 `main.tsx`에서 직접 비슷한 구성을 하고 있지만,
- 나중에 Next.js 같은 다른 환경에서도 **같은 껍데기(AppEntry)** 를 재사용할 수 있게 설계되어 있습니다.

---

## 5. Storybook – 컴포넌트 전시장 켜기

이 프로젝트에는 버튼, 카드, 모달 같은 **디자인 시스템 컴포넌트**가 많이 있습니다.  
이걸 한눈에 보고, 눌러보고, 상태를 바꿔보는 **전시장**이 바로 **Storybook** 입니다.

- **실행 명령**

```bash
npm run storybook
```

- 실행 후:
  - 보통 `http://localhost:6006` 주소에서 Storybook을 볼 수 있습니다.
  - `src/core/components/ui` 아래에 있는 컴포넌트들이  
    “이름, 상태, 예제 코드” 와 함께 스토리로 정리되어 있습니다.

### 5.1 앱과 Storybook을 같이 켜고 싶을 때

```bash
npm run dev:all
```

- 이 명령은 한 번에 **두 개를 같이 켭니다.**
  - 앱: `http://localhost:5173`
  - Storybook: `http://localhost:6006`

---

## 6. 백엔드 모의 서버(Backend Mock) – 가짜 서버 켜기

실제 서버(백엔드)가 아직 없거나,  
테스트만 해보고 싶을 때 쓰는 **가짜 서버**가 있습니다.  
이 프로젝트에서는 `backend-mock/server.ts` 가 그 역할을 합니다.

- 왜 필요할까요?

  - “사용자 목록 주세요”, “주문 목록 주세요” 같은 요청을
  - 진짜 서버처럼 연습해 보기 위해서입니다.

- 이 서버는:
  - `GET /api/health` : 서버가 살아 있는지 체크
  - `GET /api/grid/users` : 사용자 표 데이터
  - `GET /api/grid/orders` : 주문 표 데이터
  - `GET /api/grid/sales` : 매출 표 데이터  
    등을 제공합니다.

### 6.1 가짜 서버 켜는 방법

프로젝트 루트 기준으로:

```bash
cd backend-mock
npx ts-node server.ts
```

- 그러면 보통 `http://localhost:3001` 에서 서버가 켜집니다.
- 프론트엔드에서는 `.env` 파일에 있는 `VITE_API_BASE_URL` 등을 사용해서  
  “어느 서버로 요청을 보낼지” 정합니다.

---

## 7. 전체 흐름 – 보통 이렇게 켭니다

실제로 개발할 때는 보통 아래 순서대로 합니다.

1. **도구 설치**
   - `npm install`
2. **(선택) 가짜 서버 켜기**
   - API까지 함께 보고 싶다면:
   - `cd backend-mock && npx ts-node server.ts`
3. **프론트엔드 앱 켜기**
   - `npm run dev`
   - 브라우저에서 `http://localhost:5173` 접속
4. **(선택) Storybook 켜기**
   - `npm run storybook`
   - 브라우저에서 `http://localhost:6006` 접속
5. **(선택) 둘 다 한 번에 켜기**
   - `npm run dev:all`

---

## 8. 빌드, 미리보기, 테스트

개발이 어느 정도 끝났다면, 아래 명령들을 사용합니다.

- **배포용 파일 만들기 (빌드)**

```bash
npm run build
```

- **빌드된 결과를 로컬에서 미리 보기**

```bash
npm run preview
```

- **테스트와 코드 검사**

```bash
npm run test   # 자동 테스트 실행
npm run lint   # 코드 스타일 / 문법 검사
```

여기까지 읽으면,

- “리액트가 어떤 식으로 화면을 그리는지”
- “이 프로젝트가 어떤 순서로 켜지는지”
- “앱 / Storybook / 가짜 서버를 각각 어떻게 켜는지”
  를 큰 그림으로 이해할 수 있습니다.
