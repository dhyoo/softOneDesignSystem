/**
 * SoftOne Design System(SDS) - TreeView Stories
 * 작성: SoftOne Frontend Team
 * 설명: TreeView 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Folder, File, Users, Building, User } from "lucide-react";
import { TreeView, type TreeNode } from "../TreeView";

const meta: Meta<typeof TreeView> = {
  title: "Core/UI/TreeView",
  component: TreeView,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 TreeView 컴포넌트입니다.

### 특징
- **재귀 렌더링**: 깊은 트리 구조 지원
- **Controlled/Uncontrolled**: 두 가지 모드 지원
- **선택/확장**: selectedIds, expandedIds 관리
- **3-state 체크박스**: checkable 옵션으로 부모/자식 동기화
- **A11y**: role="tree", role="treeitem" 적용

### 사용법
\`\`\`tsx
import { TreeView } from '@core/components/ui';

const nodes = [
  { id: '1', label: '폴더 1', children: [
    { id: '1-1', label: '파일 1' },
  ]},
];

<TreeView
  nodes={nodes}
  checkable
  checkedIds={checked}
  onCheckedIdsChange={setChecked}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    checkable: {
      control: "boolean",
      description: "체크박스 표시",
    },
    multiSelect: {
      control: "boolean",
      description: "다중 선택 허용",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Sample Data
// ========================================

const fileSystemNodes: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: <Folder className="w-4 h-4 text-yellow-500" />,
    children: [
      {
        id: "src-components",
        label: "components",
        icon: <Folder className="w-4 h-4 text-yellow-500" />,
        children: [
          { id: "src-components-button", label: "Button.tsx", icon: <File className="w-4 h-4 text-blue-500" /> },
          { id: "src-components-input", label: "Input.tsx", icon: <File className="w-4 h-4 text-blue-500" /> },
          { id: "src-components-modal", label: "Modal.tsx", icon: <File className="w-4 h-4 text-blue-500" /> },
        ],
      },
      {
        id: "src-utils",
        label: "utils",
        icon: <Folder className="w-4 h-4 text-yellow-500" />,
        children: [
          { id: "src-utils-format", label: "format.ts", icon: <File className="w-4 h-4 text-green-500" /> },
          { id: "src-utils-validation", label: "validation.ts", icon: <File className="w-4 h-4 text-green-500" /> },
        ],
      },
      { id: "src-app", label: "App.tsx", icon: <File className="w-4 h-4 text-blue-500" /> },
      { id: "src-main", label: "main.tsx", icon: <File className="w-4 h-4 text-blue-500" /> },
    ],
  },
  {
    id: "public",
    label: "public",
    icon: <Folder className="w-4 h-4 text-yellow-500" />,
    children: [
      { id: "public-index", label: "index.html", icon: <File className="w-4 h-4 text-orange-500" /> },
      { id: "public-favicon", label: "favicon.ico", icon: <File className="w-4 h-4 text-purple-500" /> },
    ],
  },
  { id: "package", label: "package.json", icon: <File className="w-4 h-4 text-green-500" /> },
  { id: "readme", label: "README.md", icon: <File className="w-4 h-4 text-gray-500" /> },
];

const organizationNodes: TreeNode[] = [
  {
    id: "company",
    label: "SoftOne 주식회사",
    icon: <Building className="w-4 h-4 text-blue-600" />,
    children: [
      {
        id: "dev-team",
        label: "개발팀",
        icon: <Users className="w-4 h-4 text-green-600" />,
        children: [
          { id: "dev-1", label: "홍길동 (팀장)", icon: <User className="w-4 h-4 text-gray-600" /> },
          { id: "dev-2", label: "김철수", icon: <User className="w-4 h-4 text-gray-600" /> },
          { id: "dev-3", label: "이영희", icon: <User className="w-4 h-4 text-gray-600" /> },
        ],
      },
      {
        id: "design-team",
        label: "디자인팀",
        icon: <Users className="w-4 h-4 text-purple-600" />,
        children: [
          { id: "design-1", label: "박민수 (팀장)", icon: <User className="w-4 h-4 text-gray-600" /> },
          { id: "design-2", label: "최수진", icon: <User className="w-4 h-4 text-gray-600" /> },
        ],
      },
      {
        id: "sales-team",
        label: "영업팀",
        icon: <Users className="w-4 h-4 text-orange-600" />,
        children: [
          { id: "sales-1", label: "정대리 (팀장)", icon: <User className="w-4 h-4 text-gray-600" /> },
        ],
      },
    ],
  },
];

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 TreeView
 */
export const Default: Story = {
  render: () => (
    <div className="w-80">
      <TreeView nodes={fileSystemNodes} />
    </div>
  ),
};

/**
 * 초기 확장
 */
export const WithDefaultExpanded: Story = {
  render: () => (
    <div className="w-80">
      <TreeView
        nodes={fileSystemNodes}
        defaultExpandedIds={["src", "src-components"]}
      />
    </div>
  ),
};

// ========================================
// Selection
// ========================================

/**
 * 단일 선택
 */
export const SingleSelect: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    
    return (
      <div className="w-80 space-y-4">
        <TreeView
          nodes={fileSystemNodes}
          selectedIds={selected}
          onSelectIdsChange={setSelected}
          defaultExpandedIds={["src"]}
        />
        <p className="text-sm text-gray-500">
          선택됨: {selected[0] || "없음"}
        </p>
      </div>
    );
  },
};

/**
 * 다중 선택
 */
export const MultiSelect: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    
    return (
      <div className="w-80 space-y-4">
        <TreeView
          nodes={fileSystemNodes}
          selectedIds={selected}
          onSelectIdsChange={setSelected}
          multiSelect
          defaultExpandedIds={["src"]}
        />
        <p className="text-sm text-gray-500">
          선택됨: {selected.length > 0 ? selected.join(", ") : "없음"}
        </p>
      </div>
    );
  },
};

// ========================================
// Checkable
// ========================================

/**
 * 체크박스 (3-state)
 */
export const Checkable: Story = {
  render: () => {
    const [checked, setChecked] = useState<string[]>([]);
    
    return (
      <div className="w-80 space-y-4">
        <TreeView
          nodes={fileSystemNodes}
          checkable
          checkedIds={checked}
          onCheckedIdsChange={setChecked}
          defaultExpandedIds={["src", "src-components"]}
        />
        <div className="text-sm text-gray-500">
          <p>체크됨 ({checked.length}개):</p>
          <p className="text-xs">{checked.join(", ") || "없음"}</p>
        </div>
      </div>
    );
  },
};

/**
 * 체크박스 기본값
 */
export const CheckableWithDefault: Story = {
  render: () => {
    const [checked, setChecked] = useState<string[]>([
      "src-components-button",
      "src-components-input",
    ]);
    
    return (
      <div className="w-80 space-y-4">
        <TreeView
          nodes={fileSystemNodes}
          checkable
          checkedIds={checked}
          onCheckedIdsChange={setChecked}
          defaultExpandedIds={["src", "src-components"]}
        />
        <div className="text-sm text-gray-500">
          체크됨: {checked.length}개
        </div>
      </div>
    );
  },
};

// ========================================
// With Disabled
// ========================================

/**
 * 비활성화된 노드
 */
export const WithDisabledNodes: Story = {
  render: () => {
    const nodesWithDisabled: TreeNode[] = [
      {
        id: "folder1",
        label: "폴더 1",
        children: [
          { id: "file1", label: "파일 1" },
          { id: "file2", label: "파일 2 (비활성)", disabled: true },
          { id: "file3", label: "파일 3" },
        ],
      },
      {
        id: "folder2",
        label: "폴더 2 (비활성)",
        disabled: true,
        children: [
          { id: "file4", label: "파일 4" },
        ],
      },
    ];
    
    return (
      <div className="w-80">
        <TreeView
          nodes={nodesWithDisabled}
          defaultExpandedIds={["folder1"]}
        />
      </div>
    );
  },
};

// ========================================
// Real-world Examples
// ========================================

/**
 * 조직도
 */
export const OrganizationChart: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    
    return (
      <div className="w-96 space-y-4">
        <h3 className="font-semibold">조직도</h3>
        <TreeView
          nodes={organizationNodes}
          selectedIds={selected}
          onSelectIdsChange={setSelected}
          defaultExpandedIds={["company", "dev-team"]}
        />
        {selected.length > 0 && (
          <p className="text-sm text-gray-500">
            선택된 구성원: {selected[0]}
          </p>
        )}
      </div>
    );
  },
};

/**
 * 권한 설정
 */
export const PermissionSettings: Story = {
  render: () => {
    const [checked, setChecked] = useState<string[]>(["users-view", "reports-view"]);
    
    const permissionNodes: TreeNode[] = [
      {
        id: "users",
        label: "사용자 관리",
        children: [
          { id: "users-view", label: "조회" },
          { id: "users-create", label: "생성" },
          { id: "users-edit", label: "수정" },
          { id: "users-delete", label: "삭제" },
        ],
      },
      {
        id: "products",
        label: "상품 관리",
        children: [
          { id: "products-view", label: "조회" },
          { id: "products-create", label: "생성" },
          { id: "products-edit", label: "수정" },
          { id: "products-delete", label: "삭제" },
        ],
      },
      {
        id: "reports",
        label: "리포트",
        children: [
          { id: "reports-view", label: "조회" },
          { id: "reports-export", label: "내보내기" },
        ],
      },
      {
        id: "settings",
        label: "시스템 설정",
        disabled: true,
        children: [
          { id: "settings-general", label: "일반 설정" },
          { id: "settings-security", label: "보안 설정" },
        ],
      },
    ];
    
    return (
      <div className="w-80 space-y-4 p-4 border rounded-lg">
        <h3 className="font-semibold">권한 설정</h3>
        <p className="text-xs text-gray-500">
          부여할 권한을 선택하세요
        </p>
        <TreeView
          nodes={permissionNodes}
          checkable
          checkedIds={checked}
          onCheckedIdsChange={setChecked}
          defaultExpandedIds={["users", "reports"]}
        />
        <div className="pt-4 border-t">
          <p className="text-sm text-gray-600">
            선택된 권한: {checked.length}개
          </p>
        </div>
      </div>
    );
  },
};

/**
 * 파일 탐색기
 */
export const FileExplorer: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(["src"]);
    const [selected, setSelected] = useState<string[]>([]);
    
    return (
      <div className="w-80 border rounded-lg">
        <div className="px-3 py-2 border-b bg-gray-50 text-sm font-medium">
          탐색기
        </div>
        <TreeView
          nodes={fileSystemNodes}
          selectedIds={selected}
          onSelectIdsChange={setSelected}
          expandedIds={expanded}
          onExpandedIdsChange={setExpanded}
          className="border-0 rounded-none"
        />
      </div>
    );
  },
};

// ========================================
// Showcase
// ========================================

/**
 * Controlled 모드 데모
 */
export const ControlledDemo: Story = {
  render: () => {
    const [expanded, setExpanded] = useState<string[]>(["src"]);
    const [selected, setSelected] = useState<string[]>([]);
    const [checked, setChecked] = useState<string[]>([]);
    
    return (
      <div className="flex gap-8">
        <div className="w-80">
          <TreeView
            nodes={fileSystemNodes}
            selectedIds={selected}
            onSelectIdsChange={setSelected}
            expandedIds={expanded}
            onExpandedIdsChange={setExpanded}
            checkable
            checkedIds={checked}
            onCheckedIdsChange={setChecked}
          />
        </div>
        <div className="w-60 space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">확장된 노드</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(expanded, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">선택된 노드</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(selected, null, 2)}
            </pre>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">체크된 노드</h4>
            <pre className="text-xs bg-gray-100 p-2 rounded max-h-32 overflow-auto">
              {JSON.stringify(checked, null, 2)}
            </pre>
          </div>
          <div className="flex gap-2">
            <button
              className="px-2 py-1 text-xs border rounded"
              onClick={() => setExpanded([])}
            >
              모두 접기
            </button>
            <button
              className="px-2 py-1 text-xs border rounded"
              onClick={() => setChecked([])}
            >
              체크 해제
            </button>
          </div>
        </div>
      </div>
    );
  },
};

