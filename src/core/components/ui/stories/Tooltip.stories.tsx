/**
 * SoftOne Design System(SDS) - Tooltip Stories
 * 작성: SoftOne Frontend Team
 * 설명: Tooltip 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Info, HelpCircle, Settings, AlertCircle } from "lucide-react";
import { Tooltip } from "../Tooltip";
import { Button } from "../Button";

const meta: Meta<typeof Tooltip> = {
  title: "Core/UI/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 Tooltip 컴포넌트입니다.

### 특징
- **위치**: top, bottom, left, right 지원
- **정렬**: start, center, end 지원
- **딜레이**: 표시/숨김 딜레이 설정 가능
- **A11y**: role="tooltip", aria-describedby 적용

### 사용법
\`\`\`tsx
import { Tooltip } from '@core/components/ui';

<Tooltip content="도움말 텍스트">
  <Button>호버하세요</Button>
</Tooltip>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top", "bottom", "left", "right"],
      description: "툴팁 위치",
    },
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "정렬",
    },
    delayShow: {
      control: { type: "number", min: 0, max: 1000 },
      description: "표시 딜레이 (ms)",
    },
    delayHide: {
      control: { type: "number", min: 0, max: 1000 },
      description: "숨김 딜레이 (ms)",
    },
    disabled: {
      control: "boolean",
      description: "비활성화",
    },
    maxWidth: {
      control: { type: "number", min: 100, max: 500 },
      description: "최대 너비",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 Tooltip
 */
export const Default: Story = {
  render: () => (
    <Tooltip content="이것은 툴팁입니다">
      <Button>호버하세요</Button>
    </Tooltip>
  ),
};

/**
 * 긴 텍스트
 */
export const LongText: Story = {
  render: () => (
    <Tooltip content="이것은 매우 긴 툴팁 텍스트입니다. 최대 너비가 설정되어 있어서 자동으로 줄바꿈됩니다.">
      <Button>긴 텍스트</Button>
    </Tooltip>
  ),
};

// ========================================
// Position Variants
// ========================================

/**
 * 모든 위치
 */
export const AllPositions: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-16 py-16">
      <Tooltip content="위쪽 툴팁" position="top">
        <Button variant="outline">Top</Button>
      </Tooltip>

      <div className="flex items-center gap-32">
        <Tooltip content="왼쪽 툴팁" position="left">
          <Button variant="outline">Left</Button>
        </Tooltip>

        <Tooltip content="오른쪽 툴팁" position="right">
          <Button variant="outline">Right</Button>
        </Tooltip>
      </div>

      <Tooltip content="아래쪽 툴팁" position="bottom">
        <Button variant="outline">Bottom</Button>
      </Tooltip>
    </div>
  ),
};

/**
 * Top 위치
 */
export const PositionTop: Story = {
  render: () => (
    <Tooltip content="위쪽에 표시됩니다" position="top">
      <Button>Top</Button>
    </Tooltip>
  ),
};

/**
 * Bottom 위치
 */
export const PositionBottom: Story = {
  render: () => (
    <Tooltip content="아래쪽에 표시됩니다" position="bottom">
      <Button>Bottom</Button>
    </Tooltip>
  ),
};

/**
 * Left 위치
 */
export const PositionLeft: Story = {
  render: () => (
    <Tooltip content="왼쪽에 표시됩니다" position="left">
      <Button>Left</Button>
    </Tooltip>
  ),
};

/**
 * Right 위치
 */
export const PositionRight: Story = {
  render: () => (
    <Tooltip content="오른쪽에 표시됩니다" position="right">
      <Button>Right</Button>
    </Tooltip>
  ),
};

// ========================================
// Alignment
// ========================================

/**
 * 정렬 옵션
 */
export const Alignment: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex gap-4">
        <Tooltip content="시작 정렬" position="bottom" align="start">
          <Button variant="outline" className="w-32">
            Start
          </Button>
        </Tooltip>
        <Tooltip content="중앙 정렬" position="bottom" align="center">
          <Button variant="outline" className="w-32">
            Center
          </Button>
        </Tooltip>
        <Tooltip content="끝 정렬" position="bottom" align="end">
          <Button variant="outline" className="w-32">
            End
          </Button>
        </Tooltip>
      </div>
    </div>
  ),
};

// ========================================
// Delay Options
// ========================================

/**
 * 딜레이 없음
 */
export const NoDelay: Story = {
  render: () => (
    <Tooltip content="즉시 표시됩니다" delayShow={0}>
      <Button>딜레이 없음</Button>
    </Tooltip>
  ),
};

/**
 * 긴 딜레이
 */
export const LongDelay: Story = {
  render: () => (
    <Tooltip content="0.5초 후 표시됩니다" delayShow={500}>
      <Button>500ms 딜레이</Button>
    </Tooltip>
  ),
};

/**
 * 숨김 딜레이
 */
export const HideDelay: Story = {
  render: () => (
    <Tooltip content="마우스를 떼도 잠시 유지됩니다" delayHide={300}>
      <Button>숨김 딜레이</Button>
    </Tooltip>
  ),
};

// ========================================
// With Icons
// ========================================

/**
 * 아이콘 트리거
 */
export const WithIconTrigger: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Tooltip content="도움말 정보입니다">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <HelpCircle className="w-5 h-5 text-gray-500" />
        </button>
      </Tooltip>

      <Tooltip content="정보를 확인하세요">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Info className="w-5 h-5 text-blue-500" />
        </button>
      </Tooltip>

      <Tooltip content="설정을 변경할 수 있습니다">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Settings className="w-5 h-5 text-gray-500" />
        </button>
      </Tooltip>

      <Tooltip content="주의가 필요합니다">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <AlertCircle className="w-5 h-5 text-yellow-500" />
        </button>
      </Tooltip>
    </div>
  ),
};

// ========================================
// Rich Content
// ========================================

/**
 * 리치 컨텐츠
 */
export const RichContent: Story = {
  render: () => (
    <Tooltip
      content={
        <div className="space-y-1">
          <div className="font-semibold">사용자 정보</div>
          <div className="text-gray-300 text-xs">
            이름: 홍길동
            <br />
            이메일: hong@example.com
            <br />
            역할: 관리자
          </div>
        </div>
      }
      maxWidth={200}
    >
      <Button>리치 컨텐츠</Button>
    </Tooltip>
  ),
};

/**
 * 단축키 표시
 */
export const WithShortcut: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip
        content={
          <div className="flex items-center gap-2">
            <span>저장</span>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">⌘S</kbd>
          </div>
        }
      >
        <Button>저장</Button>
      </Tooltip>

      <Tooltip
        content={
          <div className="flex items-center gap-2">
            <span>복사</span>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">⌘C</kbd>
          </div>
        }
      >
        <Button variant="outline">복사</Button>
      </Tooltip>

      <Tooltip
        content={
          <div className="flex items-center gap-2">
            <span>붙여넣기</span>
            <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">⌘V</kbd>
          </div>
        }
      >
        <Button variant="outline">붙여넣기</Button>
      </Tooltip>
    </div>
  ),
};

// ========================================
// States
// ========================================

/**
 * 비활성화
 */
export const Disabled: Story = {
  render: () => (
    <div className="flex gap-4">
      <Tooltip content="이 툴팁은 표시됩니다">
        <Button>활성화</Button>
      </Tooltip>

      <Tooltip content="이 툴팁은 표시되지 않습니다" disabled>
        <Button variant="outline">비활성화</Button>
      </Tooltip>
    </div>
  ),
};

// ========================================
// Real-world Examples
// ========================================

/**
 * 폼 필드 도움말
 */
export const FormFieldHelp: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <label className="text-sm font-medium">비밀번호</label>
          <Tooltip
            content="8자 이상, 영문/숫자/특수문자를 포함해야 합니다."
            position="right"
          >
            <button className="text-gray-400 hover:text-gray-600">
              <HelpCircle className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded"
          placeholder="비밀번호 입력"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <label className="text-sm font-medium">API 키</label>
          <Tooltip
            content={
              <div>
                <div className="font-medium">API 키 사용법</div>
                <ul className="mt-1 text-xs text-gray-300 list-disc pl-3">
                  <li>외부에 노출하지 마세요</li>
                  <li>서버 측에서만 사용하세요</li>
                  <li>주기적으로 교체하세요</li>
                </ul>
              </div>
            }
            position="right"
            maxWidth={220}
          >
            <button className="text-gray-400 hover:text-gray-600">
              <Info className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded font-mono text-sm"
          placeholder="sk-..."
        />
      </div>
    </div>
  ),
};

/**
 * 툴바 버튼
 */
export const ToolbarButtons: Story = {
  render: () => (
    <div className="flex items-center gap-1 p-2 bg-gray-100 rounded-lg">
      <Tooltip content="굵게 (⌘B)" delayShow={300}>
        <button className="p-2 hover:bg-white rounded font-bold">B</button>
      </Tooltip>
      <Tooltip content="기울임 (⌘I)" delayShow={300}>
        <button className="p-2 hover:bg-white rounded italic">I</button>
      </Tooltip>
      <Tooltip content="밑줄 (⌘U)" delayShow={300}>
        <button className="p-2 hover:bg-white rounded underline">U</button>
      </Tooltip>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <Tooltip content="왼쪽 정렬" delayShow={300}>
        <button className="p-2 hover:bg-white rounded">≡</button>
      </Tooltip>
      <Tooltip content="가운데 정렬" delayShow={300}>
        <button className="p-2 hover:bg-white rounded">≡</button>
      </Tooltip>
      <Tooltip content="오른쪽 정렬" delayShow={300}>
        <button className="p-2 hover:bg-white rounded">≡</button>
      </Tooltip>
    </div>
  ),
};

/**
 * 테이블 셀 줄임
 */
export const TruncatedText: Story = {
  render: () => (
    <div className="w-64">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="px-3 py-2 text-left text-sm border">이름</th>
            <th className="px-3 py-2 text-left text-sm border">설명</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-3 py-2 text-sm border">항목 1</td>
            <td className="px-3 py-2 text-sm border">
              <Tooltip content="이것은 매우 긴 설명 텍스트입니다. 전체 내용을 보려면 호버하세요.">
                <span className="block truncate cursor-help">
                  이것은 매우 긴 설명...
                </span>
              </Tooltip>
            </td>
          </tr>
          <tr>
            <td className="px-3 py-2 text-sm border">항목 2</td>
            <td className="px-3 py-2 text-sm border">
              <Tooltip content="두 번째 항목의 상세 설명입니다. 추가 정보가 여기에 표시됩니다.">
                <span className="block truncate cursor-help">
                  두 번째 항목의 상세...
                </span>
              </Tooltip>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  ),
};

// ========================================
// Showcase
// ========================================

/**
 * 모든 옵션 조합
 */
export const Showcase: Story = {
  render: () => (
    <div className="space-y-12 p-8">
      <div>
        <h3 className="text-sm font-semibold mb-4">위치</h3>
        <div className="flex gap-4">
          <Tooltip content="Top" position="top">
            <Button variant="outline" size="sm">Top</Button>
          </Tooltip>
          <Tooltip content="Bottom" position="bottom">
            <Button variant="outline" size="sm">Bottom</Button>
          </Tooltip>
          <Tooltip content="Left" position="left">
            <Button variant="outline" size="sm">Left</Button>
          </Tooltip>
          <Tooltip content="Right" position="right">
            <Button variant="outline" size="sm">Right</Button>
          </Tooltip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">딜레이</h3>
        <div className="flex gap-4">
          <Tooltip content="즉시" delayShow={0}>
            <Button variant="outline" size="sm">0ms</Button>
          </Tooltip>
          <Tooltip content="기본" delayShow={200}>
            <Button variant="outline" size="sm">200ms</Button>
          </Tooltip>
          <Tooltip content="느림" delayShow={500}>
            <Button variant="outline" size="sm">500ms</Button>
          </Tooltip>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4">최대 너비</h3>
        <div className="flex gap-4">
          <Tooltip
            content="좁은 툴팁입니다. 최대 너비가 150px로 설정되어 있습니다."
            maxWidth={150}
          >
            <Button variant="outline" size="sm">150px</Button>
          </Tooltip>
          <Tooltip
            content="기본 너비 툴팁입니다. 최대 너비가 250px로 설정되어 있습니다."
            maxWidth={250}
          >
            <Button variant="outline" size="sm">250px</Button>
          </Tooltip>
          <Tooltip
            content="넓은 툴팁입니다. 최대 너비가 400px로 설정되어 있어 더 많은 내용을 표시할 수 있습니다."
            maxWidth={400}
          >
            <Button variant="outline" size="sm">400px</Button>
          </Tooltip>
        </div>
      </div>
    </div>
  ),
};

