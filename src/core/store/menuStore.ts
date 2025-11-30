/**
 * SoftOne Design System - Menu Store
 * 동적 메뉴 관리를 위한 Zustand Store
 *
 * 기능:
 *   - API에서 메뉴 데이터 로드
 *   - 사용자 역할 기반 메뉴 필터링
 *   - 메뉴 상태 관리 (열림/닫힘, 선택)
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

// ========================================
// Types
// ========================================

/** 메뉴 아이템 */
export interface MenuItem {
  /** 메뉴 고유 ID */
  id: string;
  /** 부모 메뉴 ID (null이면 최상위) */
  parentId: string | null;
  /** 메뉴 라벨 */
  label: string;
  /** URL 경로 */
  path: string;
  /** 아이콘 이름 (lucide-react) */
  icon?: string;
  /** 접근 가능한 역할 (빈 배열 = 모두 허용) */
  roles: string[];
  /** 메뉴 순서 */
  order: number;
  /** 메뉴 그룹 */
  group?: string;
  /** 메뉴에서 숨김 */
  hideInMenu?: boolean;
  /** 배지 텍스트 */
  badge?: string;
  /** 배지 색상 */
  badgeColor?: "primary" | "success" | "warning" | "danger";
  /** 활성화 여부 */
  isActive: boolean;
  /** 하위 메뉴 */
  children?: MenuItem[];
}

/** 메뉴 그룹 */
export interface MenuGroup {
  id: string;
  label: string;
  order: number;
}

/** Store State */
interface MenuState {
  // 메뉴 데이터
  allMenus: MenuItem[];
  filteredMenus: MenuItem[];
  menuGroups: MenuGroup[];

  // 상태
  isLoading: boolean;
  error: string | null;
  isLoaded: boolean;

  // UI 상태
  expandedMenuIds: Set<string>;
  activeMenuId: string | null;
}

/** 메뉴 생성/수정용 폼 데이터 */
export interface MenuFormData {
  label: string;
  path: string;
  parentId: string | null;
  icon?: string;
  roles: string[];
  order: number;
  group?: string;
  hideInMenu?: boolean;
  badge?: string;
  badgeColor?: "primary" | "success" | "warning" | "danger";
  isActive: boolean;
}

/** Store Actions */
interface MenuActions {
  // 데이터 로드
  loadMenus: () => Promise<void>;
  setMenus: (menus: MenuItem[]) => void;
  setMenuGroups: (groups: MenuGroup[]) => void;

  // CRUD
  addMenu: (menu: MenuFormData) => MenuItem;
  updateMenu: (id: string, data: Partial<MenuFormData>) => void;
  deleteMenu: (id: string) => void;
  moveMenu: (id: string, newParentId: string | null, newOrder: number) => void;

  // 그룹 CRUD
  addMenuGroup: (group: Omit<MenuGroup, "id">) => MenuGroup;
  updateMenuGroup: (id: string, data: Partial<MenuGroup>) => void;
  deleteMenuGroup: (id: string) => void;

  // 필터링
  filterMenusByRole: (roles: string[]) => void;

  // UI 상태
  expandMenu: (menuId: string) => void;
  collapseMenu: (menuId: string) => void;
  toggleMenu: (menuId: string) => void;
  setActiveMenu: (menuId: string | null) => void;
  expandAll: () => void;
  collapseAll: () => void;

  // 유틸리티
  getMenuByPath: (path: string) => MenuItem | null;
  getMenuById: (id: string) => MenuItem | null;
  getBreadcrumb: (path: string) => MenuItem[];
  getParentMenus: () => MenuItem[];
  reset: () => void;
}

// ========================================
// Initial State
// ========================================

const initialState: MenuState = {
  allMenus: [],
  filteredMenus: [],
  menuGroups: [],
  isLoading: false,
  error: null,
  isLoaded: false,
  expandedMenuIds: new Set(),
  activeMenuId: null,
};

// ========================================
// Store
// ========================================

export const useMenuStore = create<MenuState & MenuActions>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ========================================
      // 데이터 로드
      // ========================================

      loadMenus: async () => {
        set({ isLoading: true, error: null });

        try {
          // Mock API 호출 (실제로는 httpClient.get('/api/menus') 사용)
          const { menus, groups } = await fetchMenusFromApi();

          set({
            allMenus: menus,
            filteredMenus: menus,
            menuGroups: groups,
            isLoading: false,
            isLoaded: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "메뉴 로드 실패",
          });
        }
      },

      setMenus: (menus) => {
        set({ allMenus: menus, filteredMenus: menus });
      },

      setMenuGroups: (groups) => {
        set({ menuGroups: groups });
      },

      // ========================================
      // 필터링
      // ========================================

      filterMenusByRole: (userRoles) => {
        const { allMenus } = get();

        const filterMenu = (menu: MenuItem): MenuItem | null => {
          // 역할 체크 (빈 배열이면 모두 허용)
          if (menu.roles.length > 0) {
            const hasRole = menu.roles.some((role) => userRoles.includes(role));
            if (!hasRole) return null;
          }

          // 숨김 메뉴 제외
          if (menu.hideInMenu) return null;

          // 하위 메뉴 필터링
          const filteredChildren = menu.children
            ?.map(filterMenu)
            .filter((m): m is MenuItem => m !== null);

          return {
            ...menu,
            children: filteredChildren?.length ? filteredChildren : undefined,
          };
        };

        const filtered = allMenus
          .map(filterMenu)
          .filter((m): m is MenuItem => m !== null);

        set({ filteredMenus: filtered });
      },

      // ========================================
      // UI 상태
      // ========================================

      expandMenu: (menuId) => {
        set((state) => {
          const newSet = new Set(state.expandedMenuIds);
          newSet.add(menuId);
          return { expandedMenuIds: newSet };
        });
      },

      collapseMenu: (menuId) => {
        set((state) => {
          const newSet = new Set(state.expandedMenuIds);
          newSet.delete(menuId);
          return { expandedMenuIds: newSet };
        });
      },

      toggleMenu: (menuId) => {
        const { expandedMenuIds } = get();
        if (expandedMenuIds.has(menuId)) {
          get().collapseMenu(menuId);
        } else {
          get().expandMenu(menuId);
        }
      },

      setActiveMenu: (menuId) => {
        set({ activeMenuId: menuId });
      },

      expandAll: () => {
        const { allMenus } = get();
        const allIds = new Set<string>();

        const collectIds = (menus: MenuItem[]) => {
          menus.forEach((menu) => {
            if (menu.children?.length) {
              allIds.add(menu.id);
              collectIds(menu.children);
            }
          });
        };

        collectIds(allMenus);
        set({ expandedMenuIds: allIds });
      },

      collapseAll: () => {
        set({ expandedMenuIds: new Set() });
      },

      // ========================================
      // CRUD
      // ========================================

      addMenu: (menuData) => {
        const newMenu: MenuItem = {
          ...menuData,
          id: `menu-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          children: undefined,
        };

        set((state) => {
          const newMenus = [...state.allMenus];

          if (menuData.parentId) {
            // 부모 메뉴 찾아서 children에 추가
            const addToParent = (menus: MenuItem[]): boolean => {
              for (let i = 0; i < menus.length; i++) {
                if (menus[i].id === menuData.parentId) {
                  menus[i] = {
                    ...menus[i],
                    children: [...(menus[i].children || []), newMenu],
                  };
                  return true;
                }
                const childMenus = menus[i].children;
                if (childMenus && addToParent(childMenus)) {
                  return true;
                }
              }
              return false;
            };
            addToParent(newMenus);
          } else {
            // 최상위 메뉴로 추가
            newMenus.push(newMenu);
          }

          return {
            allMenus: newMenus,
            filteredMenus: newMenus,
          };
        });

        return newMenu;
      },

      updateMenu: (id, data) => {
        set((state) => {
          const updateInMenus = (menus: MenuItem[]): MenuItem[] => {
            return menus.map((menu) => {
              if (menu.id === id) {
                return { ...menu, ...data };
              }
              if (menu.children) {
                return {
                  ...menu,
                  children: updateInMenus(menu.children),
                };
              }
              return menu;
            });
          };

          const newMenus = updateInMenus(state.allMenus);
          return {
            allMenus: newMenus,
            filteredMenus: newMenus,
          };
        });
      },

      deleteMenu: (id) => {
        set((state) => {
          const deleteFromMenus = (menus: MenuItem[]): MenuItem[] => {
            return menus
              .filter((menu) => menu.id !== id)
              .map((menu) => {
                if (menu.children) {
                  return {
                    ...menu,
                    children: deleteFromMenus(menu.children),
                  };
                }
                return menu;
              });
          };

          const newMenus = deleteFromMenus(state.allMenus);
          return {
            allMenus: newMenus,
            filteredMenus: newMenus,
          };
        });
      },

      moveMenu: (id, newParentId, newOrder) => {
        set((state) => {
          let menuToMove: MenuItem | null = null;

          // 먼저 메뉴를 찾아서 제거
          const removeMenu = (menus: MenuItem[]): MenuItem[] => {
            return menus
              .filter((menu) => {
                if (menu.id === id) {
                  menuToMove = { ...menu };
                  return false;
                }
                return true;
              })
              .map((menu) => {
                if (menu.children) {
                  return {
                    ...menu,
                    children: removeMenu(menu.children),
                  };
                }
                return menu;
              });
          };

          const newMenus = removeMenu(state.allMenus);

          if (!menuToMove) return state;

          // 새 위치에 메뉴 추가 (null check 후 타입 단언)
          const foundMenu = menuToMove as MenuItem;
          const movedMenu: MenuItem = {
            ...foundMenu,
            order: newOrder,
            parentId: newParentId,
          };

          if (newParentId) {
            const addToParent = (menus: MenuItem[]): boolean => {
              for (let i = 0; i < menus.length; i++) {
                if (menus[i].id === newParentId) {
                  const children = [...(menus[i].children || []), movedMenu];
                  children.sort((a, b) => a.order - b.order);
                  menus[i] = { ...menus[i], children };
                  return true;
                }
                const childMenus = menus[i].children;
                if (childMenus && addToParent(childMenus)) {
                  return true;
                }
              }
              return false;
            };
            addToParent(newMenus);
          } else {
            newMenus.push(movedMenu);
            newMenus.sort((a, b) => a.order - b.order);
          }

          return {
            allMenus: newMenus,
            filteredMenus: newMenus,
          };
        });
      },

      // ========================================
      // 그룹 CRUD
      // ========================================

      addMenuGroup: (groupData) => {
        const newGroup: MenuGroup = {
          ...groupData,
          id: `group-${Date.now()}`,
        };

        set((state) => ({
          menuGroups: [...state.menuGroups, newGroup].sort(
            (a, b) => a.order - b.order
          ),
        }));

        return newGroup;
      },

      updateMenuGroup: (id, data) => {
        set((state) => ({
          menuGroups: state.menuGroups
            .map((group) => (group.id === id ? { ...group, ...data } : group))
            .sort((a, b) => a.order - b.order),
        }));
      },

      deleteMenuGroup: (id) => {
        set((state) => ({
          menuGroups: state.menuGroups.filter((group) => group.id !== id),
        }));
      },

      // ========================================
      // 유틸리티
      // ========================================

      getMenuByPath: (path) => {
        const { allMenus } = get();

        const findMenu = (menus: MenuItem[]): MenuItem | null => {
          for (const menu of menus) {
            if (menu.path === path) return menu;
            if (menu.children) {
              const found = findMenu(menu.children);
              if (found) return found;
            }
          }
          return null;
        };

        return findMenu(allMenus);
      },

      getMenuById: (id) => {
        const { allMenus } = get();

        const findMenu = (menus: MenuItem[]): MenuItem | null => {
          for (const menu of menus) {
            if (menu.id === id) return menu;
            if (menu.children) {
              const found = findMenu(menu.children);
              if (found) return found;
            }
          }
          return null;
        };

        return findMenu(allMenus);
      },

      getBreadcrumb: (path) => {
        const { allMenus } = get();
        const breadcrumb: MenuItem[] = [];

        const findPath = (
          menus: MenuItem[],
          parents: MenuItem[] = []
        ): boolean => {
          for (const menu of menus) {
            if (menu.path === path) {
              breadcrumb.push(...parents, menu);
              return true;
            }
            if (menu.children) {
              if (findPath(menu.children, [...parents, menu])) {
                return true;
              }
            }
          }
          return false;
        };

        findPath(allMenus);
        return breadcrumb;
      },

      getParentMenus: () => {
        const { allMenus } = get();
        // 최상위 메뉴들만 반환 (하위 메뉴의 부모가 될 수 있는 것들)
        return allMenus.filter((menu) => !menu.parentId);
      },

      reset: () => {
        set(initialState);
      },
    }),
    { name: "menu-store" }
  )
);

// ========================================
// Mock API
// ========================================

interface MenuApiResponse {
  menus: MenuItem[];
  groups: MenuGroup[];
}

async function fetchMenusFromApi(): Promise<MenuApiResponse> {
  // 실제로는 httpClient.get('/api/menus') 사용
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        menus: generateMockMenus(),
        groups: [
          { id: "main", label: "", order: 0 },
          { id: "management", label: "관리", order: 10 },
          { id: "data", label: "데이터", order: 20 },
          { id: "samples", label: "예시", order: 45 },
          { id: "tools", label: "개발자 도구", order: 50 },
          { id: "system", label: "시스템", order: 100 },
        ],
      });
    }, 300);
  });
}

function generateMockMenus(): MenuItem[] {
  return [
    // 대시보드
    {
      id: "dashboard",
      parentId: null,
      label: "대시보드",
      path: "/dashboard",
      icon: "LayoutDashboard",
      roles: [], // 모든 인증된 사용자
      order: 1,
      group: "main",
      isActive: true,
    },
    // 사용자 관리
    {
      id: "users",
      parentId: null,
      label: "사용자 관리",
      path: "/users",
      icon: "Users",
      roles: ["ADMIN", "MANAGER"],
      order: 10,
      group: "management",
      isActive: true,
      children: [
        {
          id: "users-list",
          parentId: "users",
          label: "사용자 목록",
          path: "/users",
          roles: ["ADMIN", "MANAGER"],
          order: 1,
          isActive: true,
          hideInMenu: true,
        },
        {
          id: "users-dialog-sample",
          parentId: "users",
          label: "사용자 CRUD (Dialog)",
          path: "/users/dialog-sample",
          roles: ["ADMIN", "MANAGER"],
          order: 2,
          isActive: true,
        },
      ],
    },
    // 일정 관리
    {
      id: "schedules",
      parentId: null,
      label: "일정 관리",
      path: "/schedules",
      icon: "Calendar",
      roles: [],
      order: 20,
      group: "management",
      isActive: true,
    },
    // 그리드 샘플
    {
      id: "grid-samples",
      parentId: null,
      label: "그리드 샘플",
      path: "/grid-samples",
      icon: "Table",
      roles: [],
      order: 30,
      group: "data",
      badge: "Lab",
      badgeColor: "primary",
      isActive: true,
      children: [
        {
          id: "grid-ag-basic",
          parentId: "grid-samples",
          label: "AG Grid 기본",
          path: "/grid-samples/ag-basic",
          roles: [],
          order: 1,
          isActive: true,
        },
        {
          id: "grid-tanstack-basic",
          parentId: "grid-samples",
          label: "TanStack Table 기본",
          path: "/grid-samples/tanstack-basic",
          roles: [],
          order: 2,
          isActive: true,
        },
        {
          id: "grid-ag-aggregation-grouping",
          parentId: "grid-samples",
          label: "그룹핑 & 집계",
          path: "/grid-samples/ag-aggregation-grouping",
          roles: [],
          order: 3,
          isActive: true,
        },
        {
          id: "grid-tanstack-role-based",
          parentId: "grid-samples",
          label: "역할 기반 컬럼",
          path: "/grid-samples/tanstack-role-based",
          roles: [],
          order: 4,
          isActive: true,
        },
        {
          id: "grid-ag-editing-validation",
          parentId: "grid-samples",
          label: "인라인 편집",
          path: "/grid-samples/ag-editing-validation",
          roles: [],
          order: 5,
          isActive: true,
        },
        {
          id: "grid-ag-infinite-scroll",
          parentId: "grid-samples",
          label: "무한 스크롤",
          path: "/grid-samples/ag-infinite-scroll",
          roles: [],
          order: 6,
          isActive: true,
        },
        {
          id: "grid-ag-pivot-chart",
          parentId: "grid-samples",
          label: "차트 연동",
          path: "/grid-samples/ag-pivot-chart",
          roles: [],
          order: 7,
          isActive: true,
        },
        {
          id: "grid-multi-tabs",
          parentId: "grid-samples",
          label: "Multi-Grid Tabs",
          path: "/grid-samples/multi-grid-tabs",
          roles: [],
          order: 8,
          isActive: true,
        },
        {
          id: "grid-tree-data",
          parentId: "grid-samples",
          label: "Tree Data",
          path: "/grid-samples/tree-data-grid",
          roles: [],
          order: 9,
          isActive: true,
        },
        {
          id: "grid-form-like",
          parentId: "grid-samples",
          label: "Form-Like Grid",
          path: "/grid-samples/form-like-grid",
          roles: [],
          order: 10,
          isActive: true,
        },
        {
          id: "grid-filter-playground",
          parentId: "grid-samples",
          label: "Filter Playground",
          path: "/grid-samples/tanstack-filter-playground",
          roles: [],
          order: 11,
          isActive: true,
        },
        {
          id: "grid-master-detail",
          parentId: "grid-samples",
          label: "멀티그리드 연동",
          path: "/grid-samples/master-detail",
          roles: [],
          order: 12,
          badge: "New",
          badgeColor: "success",
          isActive: true,
        },
        {
          id: "global-state-demo",
          parentId: "grid-samples",
          label: "전역 상태 관리",
          path: "/grid-samples/global-state-demo",
          roles: [],
          order: 13,
          badge: "New",
          badgeColor: "success",
          isActive: true,
        },
        {
          id: "grid-row-detail-modal",
          parentId: "grid-samples",
          label: "그리드 행 상세 모달",
          path: "/grid-samples/row-detail-modal",
          roles: [],
          order: 14,
          isActive: true,
        },
      ],
    },
    // 게시물 관리
    {
      id: "articles",
      parentId: null,
      label: "게시물 관리",
      path: "/articles",
      icon: "FileText",
      roles: [],
      order: 40,
      group: "data",
      isActive: true,
      children: [
        {
          id: "articles-create",
          parentId: "articles",
          label: "게시글 작성",
          path: "/articles/new",
          roles: ["ADMIN"],
          order: 1,
          isActive: true,
        },
      ],
    },
    // 상품 관리
    {
      id: "products",
      parentId: null,
      label: "상품 관리",
      path: "/products",
      icon: "Package",
      roles: [],
      order: 45,
      group: "data",
      badge: "CRUD",
      badgeColor: "success",
      isActive: true,
    },
    // 개발자 도구
    {
      id: "dev-tools",
      parentId: null,
      label: "개발자 도구",
      path: "/tools",
      icon: "Code2",
      roles: ["ADMIN", "DEV"],
      order: 50,
      group: "tools",
      isActive: true,
      children: [
        {
          id: "swagger-playground",
          parentId: "dev-tools",
          label: "Swagger Playground",
          path: "/tools/swagger-playground",
          icon: "Globe",
          roles: ["ADMIN", "DEV"],
          order: 1,
          isActive: true,
        },
      ],
    },
    // 설정
    {
      id: "settings",
      parentId: null,
      label: "설정",
      path: "/settings",
      icon: "Settings",
      roles: ["ADMIN"],
      order: 100,
      group: "system",
      isActive: true,
    },
    // 도움말
    {
      id: "help",
      parentId: null,
      label: "도움말",
      path: "/help",
      icon: "HelpCircle",
      roles: [],
      order: 110,
      group: "system",
      isActive: true,
    },
  ];
}

// ========================================
// Selectors
// ========================================

export const selectFilteredMenus = (state: MenuState) => state.filteredMenus;
export const selectMenuGroups = (state: MenuState) => state.menuGroups;
export const selectIsLoading = (state: MenuState) => state.isLoading;
export const selectIsLoaded = (state: MenuState) => state.isLoaded;
export const selectExpandedMenuIds = (state: MenuState) =>
  state.expandedMenuIds;
export const selectActiveMenuId = (state: MenuState) => state.activeMenuId;
