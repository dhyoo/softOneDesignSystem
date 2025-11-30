/**
 * SoftOne Design System - Navigation Types
 * 라우터 추상화를 위한 타입 정의
 *
 * Core/Features 레이어에서 직접 React Router나 Next Router를 사용하지 않고,
 * 이 인터페이스를 통해 라우팅 기능을 사용합니다.
 */

/**
 * Navigation API 인터페이스
 * SPA Shell에서는 React Router로, Next Shell에서는 next/navigation으로 구현
 */
export interface NavigationApi {
  /**
   * 새 경로로 이동 (history push)
   * @param path 이동할 경로
   */
  push(path: string): void;

  /**
   * 현재 경로를 대체 (history replace)
   * @param path 대체할 경로
   */
  replace(path: string): void;

  /**
   * 뒤로 가기
   */
  back(): void;

  /**
   * 앞으로 가기
   */
  forward(): void;

  /**
   * 현재 경로 가져오기
   * @returns 현재 pathname
   */
  getCurrentPath(): string;

  /**
   * 쿼리 파라미터 가져오기
   * @returns URLSearchParams 객체
   */
  getQueryParams(): URLSearchParams;

  /**
   * 경로 프리페치 (Next.js Shell에서 사용)
   * @param path 프리페치할 경로
   */
  prefetch?(path: string): void;
}

/**
 * 라우트 메타데이터
 * 메뉴/사이드바/브레드크럼/권한 체크에 사용
 */
export interface AppRouteMeta {
  /** 라우트 키 (고유 식별자) */
  key: string;

  /** URL 경로 */
  path: string;

  /** 메뉴에 표시될 라벨 */
  label: string;

  /** 메뉴 아이콘 (lucide-react 아이콘 이름) */
  icon?: string;

  /** 접근 가능한 역할 */
  roles?: string[];

  /** 메뉴에서 숨김 여부 */
  hideInMenu?: boolean;

  /** 메뉴 그룹 */
  group?: string;

  /** 하위 라우트 */
  children?: AppRouteMeta[];

  /** 브레드크럼 숨김 여부 */
  hideInBreadcrumb?: boolean;

  /** 메뉴 순서 */
  order?: number;

  /** 페이지 컴포넌트 (lazy import) - Shell에서 사용 */
  // element?: React.LazyExoticComponent<React.ComponentType>;
}

/**
 * 라우트 컨텍스트
 */
export interface RouteContext {
  /** 현재 경로 */
  pathname: string;

  /** 쿼리 파라미터 */
  query: Record<string, string>;

  /** 경로 파라미터 */
  params: Record<string, string>;
}
