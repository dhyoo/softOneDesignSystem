/**
 * SoftOne Design System - Role/Grade/Permission Types
 * 작성: SoftOne Frontend Team
 *
 * 이 파일에서는 Role/Grade 기반 PermissionKey를 정의합니다.
 * PermissionKey는 실제 API 권한 코드와도 정렬될 수 있으며,
 * 프론트/백엔드가 공유하는 계약으로 확장 가능합니다.
 *
 * 권한 체계:
 *   - Role (역할): 사용자의 시스템 내 역할
 *   - Grade (직급): 조직 내 직급/직책
 *   - PermissionKey: 메뉴/페이지/액션 레벨 권한 키
 */

// ========================================
// Role (역할) 정의
// ========================================

export const ROLES = [
  "SYSTEM_ADMIN", // 시스템 관리자 (전체 권한)
  "ORG_ADMIN", // 조직 관리자
  "MANAGER", // 관리자
  "STAFF", // 일반 직원
  "GUEST", // 게스트
] as const;

export type Role = (typeof ROLES)[number];

// ========================================
// Grade (직급/직책) 정의
// ========================================

export const GRADES = [
  "EXECUTIVE", // 임원
  "TEAM_LEAD", // 팀장
  "SENIOR", // 선임/과장
  "JUNIOR", // 주니어/대리
  "INTERN", // 인턴
] as const;

export type Grade = (typeof GRADES)[number];

// 직급 순위 (높을수록 상위 직급)
export const GRADE_RANK: Record<Grade, number> = {
  EXECUTIVE: 5,
  TEAM_LEAD: 4,
  SENIOR: 3,
  JUNIOR: 2,
  INTERN: 1,
};

// ========================================
// PermissionKey (권한 키) 정의
// ========================================

/**
 * 권한 키 명명 규칙:
 *   - menu:{영역}:{하위영역}:view - 메뉴 조회 권한
 *   - page:{영역}:{하위영역}:view - 페이지 조회 권한
 *   - action:{영역}:{액션명} - 액션 실행 권한
 *   - pii:{타입} - 개인정보 관련 권한
 */
export const PERMISSION_KEYS = {
  // ========================================
  // 메뉴 권한
  // ========================================
  MENU_DASHBOARD_VIEW: "menu:dashboard:view",
  MENU_DASHBOARD_OPS_VIEW: "menu:dashboard:ops:view",
  MENU_USERS_VIEW: "menu:users:view",
  MENU_AUTH_VIEW: "menu:auth:view",
  MENU_SYSTEM_VIEW: "menu:system:view",
  MENU_SYSTEM_SETTINGS_VIEW: "menu:system:settings:view",
  MENU_GRID_SAMPLES_VIEW: "menu:grid-samples:view",
  MENU_NOTIFICATIONS_VIEW: "menu:notifications:view",
  MENU_DOCS_VIEW: "menu:docs:view",
  MENU_DOCS_SWAGGER_VIEW: "menu:docs:swagger:view",
  MENU_SHOWCASE_VIEW: "menu:showcase:view",
  MENU_PRODUCTS_VIEW: "menu:products:view",
  MENU_ARTICLES_VIEW: "menu:articles:view",
  MENU_SCHEDULES_VIEW: "menu:schedules:view",
  MENU_DEV_TOOLS_VIEW: "menu:dev-tools:view",

  // ========================================
  // 페이지 권한
  // ========================================
  PAGE_DASHBOARD_VIEW: "page:dashboard:view",
  PAGE_DASHBOARD_OPS_VIEW: "page:dashboard:ops:view",
  PAGE_USERS_LIST_VIEW: "page:users:list:view",
  PAGE_USERS_DETAIL_VIEW: "page:users:detail:view",
  PAGE_AUTH_ROLE_DESIGNER_VIEW: "page:auth:role-designer:view",
  PAGE_SYSTEM_SETTINGS_VIEW: "page:system:settings:view",
  PAGE_GRID_SAMPLES_VIEW: "page:grid-samples:view",
  PAGE_NOTIFICATIONS_TEMPLATES_VIEW: "page:notifications:templates:view",
  PAGE_PRODUCTS_VIEW: "page:products:view",
  PAGE_ARTICLES_VIEW: "page:articles:view",
  PAGE_SCHEDULES_VIEW: "page:schedules:view",
  PAGE_SWAGGER_PLAYGROUND_VIEW: "page:swagger-playground:view",
  PAGE_MENU_MANAGEMENT_VIEW: "page:menu-management:view",

  // ========================================
  // 액션 권한 - 사용자
  // ========================================
  ACTION_USERS_CREATE: "action:users:create",
  ACTION_USERS_UPDATE: "action:users:update",
  ACTION_USERS_DELETE: "action:users:delete",
  ACTION_USERS_GRANT_ROLE: "action:users:grant-role",
  ACTION_USERS_EXPORT: "action:users:export",

  // ========================================
  // 액션 권한 - 인증/권한
  // ========================================
  ACTION_AUTH_ROLE_CREATE: "action:auth:role:create",
  ACTION_AUTH_ROLE_UPDATE: "action:auth:role:update",
  ACTION_AUTH_ROLE_DELETE: "action:auth:role:delete",
  ACTION_AUTH_PERMISSION_ASSIGN: "action:auth:permission:assign",

  // ========================================
  // 액션 권한 - 시스템
  // ========================================
  ACTION_SYSTEM_SETTINGS_UPDATE: "action:system:settings:update",
  ACTION_SYSTEM_MENU_UPDATE: "action:system:menu:update",

  // ========================================
  // 액션 권한 - 대시보드
  // ========================================
  ACTION_DASHBOARD_OPS_VIEW: "action:dashboard:ops:view",
  ACTION_DASHBOARD_STATS_EXPORT: "action:dashboard:stats:export",

  // ========================================
  // 액션 권한 - 알림
  // ========================================
  ACTION_NOTIFICATIONS_TEMPLATE_CREATE: "action:notifications:template:create",
  ACTION_NOTIFICATIONS_TEMPLATE_UPDATE: "action:notifications:template:update",
  ACTION_NOTIFICATIONS_TEMPLATE_DELETE: "action:notifications:template:delete",
  ACTION_NOTIFICATIONS_SEND: "action:notifications:send",

  // ========================================
  // 액션 권한 - 상품
  // ========================================
  ACTION_PRODUCTS_CREATE: "action:products:create",
  ACTION_PRODUCTS_UPDATE: "action:products:update",
  ACTION_PRODUCTS_DELETE: "action:products:delete",

  // ========================================
  // 액션 권한 - 게시글
  // ========================================
  ACTION_ARTICLES_CREATE: "action:articles:create",
  ACTION_ARTICLES_UPDATE: "action:articles:update",
  ACTION_ARTICLES_DELETE: "action:articles:delete",

  // ========================================
  // 개인정보(PII) 권한
  // ========================================
  PII_VIEW_FULL: "pii:view-full", // 전체 개인정보 조회
  PII_VIEW_PARTIAL: "pii:view-partial", // 마스킹된 개인정보 조회
  PII_EXPORT: "pii:export", // 개인정보 내보내기
  PII_DOWNLOAD: "pii:download", // 개인정보 다운로드
} as const;

export type PermissionKey =
  (typeof PERMISSION_KEYS)[keyof typeof PERMISSION_KEYS];

// ========================================
// Role별 Permission 매핑
// ========================================

export const ROLE_PERMISSION_MAP: Record<Role, PermissionKey[]> = {
  // 시스템 관리자: 전체 권한
  SYSTEM_ADMIN: Object.values(PERMISSION_KEYS),

  // 조직 관리자
  ORG_ADMIN: [
    // 메뉴
    PERMISSION_KEYS.MENU_DASHBOARD_VIEW,
    PERMISSION_KEYS.MENU_DASHBOARD_OPS_VIEW,
    PERMISSION_KEYS.MENU_USERS_VIEW,
    PERMISSION_KEYS.MENU_AUTH_VIEW,
    PERMISSION_KEYS.MENU_SYSTEM_VIEW,
    PERMISSION_KEYS.MENU_SYSTEM_SETTINGS_VIEW,
    PERMISSION_KEYS.MENU_GRID_SAMPLES_VIEW,
    PERMISSION_KEYS.MENU_NOTIFICATIONS_VIEW,
    PERMISSION_KEYS.MENU_PRODUCTS_VIEW,
    PERMISSION_KEYS.MENU_ARTICLES_VIEW,
    PERMISSION_KEYS.MENU_SCHEDULES_VIEW,
    // 페이지
    PERMISSION_KEYS.PAGE_DASHBOARD_VIEW,
    PERMISSION_KEYS.PAGE_DASHBOARD_OPS_VIEW,
    PERMISSION_KEYS.PAGE_USERS_LIST_VIEW,
    PERMISSION_KEYS.PAGE_USERS_DETAIL_VIEW,
    PERMISSION_KEYS.PAGE_AUTH_ROLE_DESIGNER_VIEW,
    PERMISSION_KEYS.PAGE_SYSTEM_SETTINGS_VIEW,
    PERMISSION_KEYS.PAGE_GRID_SAMPLES_VIEW,
    PERMISSION_KEYS.PAGE_NOTIFICATIONS_TEMPLATES_VIEW,
    PERMISSION_KEYS.PAGE_PRODUCTS_VIEW,
    PERMISSION_KEYS.PAGE_ARTICLES_VIEW,
    PERMISSION_KEYS.PAGE_SCHEDULES_VIEW,
    // 액션 - 사용자
    PERMISSION_KEYS.ACTION_USERS_CREATE,
    PERMISSION_KEYS.ACTION_USERS_UPDATE,
    PERMISSION_KEYS.ACTION_USERS_DELETE,
    PERMISSION_KEYS.ACTION_USERS_GRANT_ROLE,
    // 액션 - 권한
    PERMISSION_KEYS.ACTION_AUTH_ROLE_CREATE,
    PERMISSION_KEYS.ACTION_AUTH_ROLE_UPDATE,
    // 액션 - 시스템
    PERMISSION_KEYS.ACTION_SYSTEM_SETTINGS_UPDATE,
    PERMISSION_KEYS.ACTION_SYSTEM_MENU_UPDATE,
    // 액션 - 대시보드
    PERMISSION_KEYS.ACTION_DASHBOARD_OPS_VIEW,
    // 액션 - 알림
    PERMISSION_KEYS.ACTION_NOTIFICATIONS_TEMPLATE_CREATE,
    PERMISSION_KEYS.ACTION_NOTIFICATIONS_TEMPLATE_UPDATE,
    // 액션 - 상품
    PERMISSION_KEYS.ACTION_PRODUCTS_CREATE,
    PERMISSION_KEYS.ACTION_PRODUCTS_UPDATE,
    PERMISSION_KEYS.ACTION_PRODUCTS_DELETE,
    // 개인정보
    PERMISSION_KEYS.PII_VIEW_FULL,
    PERMISSION_KEYS.PII_EXPORT,
  ],

  // 관리자
  MANAGER: [
    // 메뉴
    PERMISSION_KEYS.MENU_DASHBOARD_VIEW,
    PERMISSION_KEYS.MENU_USERS_VIEW,
    PERMISSION_KEYS.MENU_GRID_SAMPLES_VIEW,
    PERMISSION_KEYS.MENU_NOTIFICATIONS_VIEW,
    PERMISSION_KEYS.MENU_PRODUCTS_VIEW,
    PERMISSION_KEYS.MENU_ARTICLES_VIEW,
    PERMISSION_KEYS.MENU_SCHEDULES_VIEW,
    // 페이지
    PERMISSION_KEYS.PAGE_DASHBOARD_VIEW,
    PERMISSION_KEYS.PAGE_USERS_LIST_VIEW,
    PERMISSION_KEYS.PAGE_USERS_DETAIL_VIEW,
    PERMISSION_KEYS.PAGE_GRID_SAMPLES_VIEW,
    PERMISSION_KEYS.PAGE_NOTIFICATIONS_TEMPLATES_VIEW,
    PERMISSION_KEYS.PAGE_PRODUCTS_VIEW,
    PERMISSION_KEYS.PAGE_ARTICLES_VIEW,
    PERMISSION_KEYS.PAGE_SCHEDULES_VIEW,
    // 액션 - 사용자
    PERMISSION_KEYS.ACTION_USERS_CREATE,
    PERMISSION_KEYS.ACTION_USERS_UPDATE,
    // 액션 - 알림
    PERMISSION_KEYS.ACTION_NOTIFICATIONS_TEMPLATE_CREATE,
    PERMISSION_KEYS.ACTION_NOTIFICATIONS_TEMPLATE_UPDATE,
    // 액션 - 상품
    PERMISSION_KEYS.ACTION_PRODUCTS_CREATE,
    PERMISSION_KEYS.ACTION_PRODUCTS_UPDATE,
    // 개인정보
    PERMISSION_KEYS.PII_VIEW_PARTIAL,
  ],

  // 일반 직원
  STAFF: [
    // 메뉴
    PERMISSION_KEYS.MENU_DASHBOARD_VIEW,
    PERMISSION_KEYS.MENU_GRID_SAMPLES_VIEW,
    PERMISSION_KEYS.MENU_ARTICLES_VIEW,
    PERMISSION_KEYS.MENU_SCHEDULES_VIEW,
    // 페이지
    PERMISSION_KEYS.PAGE_DASHBOARD_VIEW,
    PERMISSION_KEYS.PAGE_GRID_SAMPLES_VIEW,
    PERMISSION_KEYS.PAGE_ARTICLES_VIEW,
    PERMISSION_KEYS.PAGE_SCHEDULES_VIEW,
    // 액션
    PERMISSION_KEYS.ACTION_ARTICLES_CREATE,
    // 개인정보
    PERMISSION_KEYS.PII_VIEW_PARTIAL,
  ],

  // 게스트
  GUEST: [
    PERMISSION_KEYS.MENU_DASHBOARD_VIEW,
    PERMISSION_KEYS.PAGE_DASHBOARD_VIEW,
  ],
};

// ========================================
// Grade별 추가 Permission (직급 보정)
// ========================================

export const GRADE_PERMISSION_BOOST: Record<Grade, PermissionKey[]> = {
  // 임원: 전체 조회 + 내보내기 권한 추가
  EXECUTIVE: [
    PERMISSION_KEYS.PII_VIEW_FULL,
    PERMISSION_KEYS.PII_EXPORT,
    PERMISSION_KEYS.ACTION_DASHBOARD_STATS_EXPORT,
    PERMISSION_KEYS.ACTION_USERS_EXPORT,
  ],

  // 팀장: 팀원 관리 권한 추가
  TEAM_LEAD: [
    PERMISSION_KEYS.ACTION_USERS_GRANT_ROLE,
    PERMISSION_KEYS.PII_VIEW_FULL,
  ],

  // 선임: 일부 관리 권한 추가
  SENIOR: [
    PERMISSION_KEYS.ACTION_USERS_CREATE,
    PERMISSION_KEYS.ACTION_USERS_UPDATE,
  ],

  // 주니어: 기본 권한
  JUNIOR: [],

  // 인턴: 기본 권한
  INTERN: [],
};

// ========================================
// 헬퍼 함수
// ========================================

/**
 * Role과 Grade를 기반으로 최종 Permission 배열을 계산합니다.
 */
export function computePermissions(
  role: Role | null,
  grade: Grade | null
): PermissionKey[] {
  if (!role) return [];

  const rolePermissions = ROLE_PERMISSION_MAP[role] || [];
  const gradeBoost = grade ? GRADE_PERMISSION_BOOST[grade] || [] : [];

  // 중복 제거하여 합침
  return [...new Set([...rolePermissions, ...gradeBoost])];
}

/**
 * 권한 키가 유효한지 확인합니다.
 */
export function isValidPermissionKey(key: string): key is PermissionKey {
  return Object.values(PERMISSION_KEYS).includes(key as PermissionKey);
}
