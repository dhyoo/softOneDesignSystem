/**
 * SoftOne Design System(SDS) - Accordion Stories
 * 작성: SoftOne Frontend Team
 * 설명: Accordion 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Accordion } from "../Accordion";

const meta: Meta<typeof Accordion> = {
  title: "Core/UI/Accordion",
  component: Accordion,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 Accordion 컴포넌트입니다.

### 특징
- **Compound Pattern**: Accordion, Accordion.Item, Accordion.Trigger, Accordion.Content
- **type**: single(하나만 열림) / multiple(여러 개 열림) 지원
- **Controlled/Uncontrolled**: 두 가지 모드 지원
- **A11y**: aria-expanded, aria-controls 적용

### 사용법
\`\`\`tsx
import { Accordion } from '@core/components/ui';

<Accordion type="single" defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>섹션 1</Accordion.Trigger>
    <Accordion.Content>내용 1</Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>섹션 2</Accordion.Trigger>
    <Accordion.Content>내용 2</Accordion.Content>
  </Accordion.Item>
</Accordion>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["single", "multiple"],
      description: "아코디언 타입",
    },
    collapsible: {
      control: "boolean",
      description: "모두 닫기 가능 (single 모드)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 Accordion (Single)
 */
export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion type="single" defaultValue="item-1">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>첫 번째 섹션</Accordion.Trigger>
          <Accordion.Content>
            첫 번째 섹션의 내용입니다. 이 내용은 사용자가 트리거를 클릭하면 표시됩니다.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>두 번째 섹션</Accordion.Trigger>
          <Accordion.Content>
            두 번째 섹션의 내용입니다. 다양한 콘텐츠를 담을 수 있습니다.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>세 번째 섹션</Accordion.Trigger>
          <Accordion.Content>
            세 번째 섹션의 내용입니다. 아코디언은 공간을 효율적으로 사용합니다.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

// ========================================
// Type Variants
// ========================================

/**
 * Multiple 타입 (여러 개 동시 열기)
 */
export const Multiple: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion type="multiple" defaultValue={["item-1", "item-2"]}>
        <Accordion.Item value="item-1">
          <Accordion.Trigger>첫 번째 섹션</Accordion.Trigger>
          <Accordion.Content>
            Multiple 타입에서는 여러 섹션을 동시에 열 수 있습니다.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>두 번째 섹션</Accordion.Trigger>
          <Accordion.Content>
            이 섹션도 동시에 열려 있을 수 있습니다.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>세 번째 섹션</Accordion.Trigger>
          <Accordion.Content>
            클릭하여 열어보세요.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

/**
 * 닫기 불가능 (collapsible=false)
 */
export const NotCollapsible: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion type="single" defaultValue="item-1" collapsible={false}>
        <Accordion.Item value="item-1">
          <Accordion.Trigger>항상 하나는 열려 있음</Accordion.Trigger>
          <Accordion.Content>
            collapsible=false로 설정하면 항상 하나의 섹션이 열려 있습니다.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Trigger>두 번째 섹션</Accordion.Trigger>
          <Accordion.Content>
            다른 섹션을 클릭하면 이 섹션이 열리고 이전 섹션이 닫힙니다.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

// ========================================
// State Variants
// ========================================

/**
 * 비활성화된 아이템
 */
export const WithDisabledItem: Story = {
  render: () => (
    <div className="w-[400px]">
      <Accordion type="single" defaultValue="item-1">
        <Accordion.Item value="item-1">
          <Accordion.Trigger>활성화된 섹션</Accordion.Trigger>
          <Accordion.Content>
            이 섹션은 정상적으로 작동합니다.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-2" disabled>
          <Accordion.Trigger>비활성화된 섹션</Accordion.Trigger>
          <Accordion.Content>
            이 내용은 표시되지 않습니다.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Trigger>활성화된 섹션</Accordion.Trigger>
          <Accordion.Content>
            이 섹션도 정상적으로 작동합니다.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

/**
 * Controlled 모드
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | string[]>("item-1");
    
    return (
      <div className="w-[400px] space-y-4">
        <Accordion type="single" value={value} onValueChange={setValue}>
          <Accordion.Item value="item-1">
            <Accordion.Trigger>첫 번째 섹션</Accordion.Trigger>
            <Accordion.Content>
              Controlled 모드에서 상태를 외부에서 관리합니다.
            </Accordion.Content>
          </Accordion.Item>
          <Accordion.Item value="item-2">
            <Accordion.Trigger>두 번째 섹션</Accordion.Trigger>
            <Accordion.Content>
              두 번째 섹션 내용입니다.
            </Accordion.Content>
          </Accordion.Item>
        </Accordion>
        <p className="text-sm text-gray-500">
          현재 열린 섹션: {value || "없음"}
        </p>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 text-sm border rounded"
            onClick={() => setValue("item-1")}
          >
            섹션 1 열기
          </button>
          <button
            className="px-3 py-1 text-sm border rounded"
            onClick={() => setValue("item-2")}
          >
            섹션 2 열기
          </button>
          <button
            className="px-3 py-1 text-sm border rounded"
            onClick={() => setValue("")}
          >
            모두 닫기
          </button>
        </div>
      </div>
    );
  },
};

// ========================================
// Complex Examples
// ========================================

/**
 * FAQ 예시
 */
export const FAQExample: Story = {
  render: () => (
    <div className="w-[500px]">
      <h2 className="text-xl font-bold mb-4">자주 묻는 질문</h2>
      <Accordion type="single" collapsible>
        <Accordion.Item value="q1">
          <Accordion.Trigger>
            SDS는 무엇인가요?
          </Accordion.Trigger>
          <Accordion.Content>
            SDS(SoftOne Design System)는 엔터프라이즈 애플리케이션을 위한
            일관된 UI 컴포넌트 라이브러리입니다. React, TypeScript, Tailwind CSS를
            기반으로 구축되었습니다.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="q2">
          <Accordion.Trigger>
            어떻게 설치하나요?
          </Accordion.Trigger>
          <Accordion.Content>
            npm 또는 yarn을 통해 설치할 수 있습니다:
            <pre className="mt-2 p-2 bg-gray-100 rounded text-sm">
              npm install @softone/design-system
            </pre>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="q3">
          <Accordion.Trigger>
            커스터마이징이 가능한가요?
          </Accordion.Trigger>
          <Accordion.Content>
            네, SDS는 Tailwind CSS 기반으로 구축되어 테마와 스타일을
            쉽게 커스터마이징할 수 있습니다. CSS 변수를 통해 색상,
            간격 등을 조정할 수 있습니다.
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="q4">
          <Accordion.Trigger>
            접근성을 지원하나요?
          </Accordion.Trigger>
          <Accordion.Content>
            네, 모든 컴포넌트는 WAI-ARIA 가이드라인을 준수하며,
            키보드 네비게이션과 스크린 리더를 지원합니다.
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

/**
 * 설정 패널 예시
 */
export const SettingsPanelExample: Story = {
  render: () => (
    <div className="w-[400px] border rounded-lg">
      <div className="p-4 border-b">
        <h3 className="font-semibold">앱 설정</h3>
      </div>
      <Accordion type="multiple" defaultValue={["general"]}>
        <Accordion.Item value="general">
          <Accordion.Trigger>일반</Accordion.Trigger>
          <Accordion.Content>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm">언어</span>
                <select className="px-2 py-1 border rounded text-sm">
                  <option>한국어</option>
                  <option>English</option>
                </select>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm">시간대</span>
                <select className="px-2 py-1 border rounded text-sm">
                  <option>Seoul (GMT+9)</option>
                  <option>New York (GMT-5)</option>
                </select>
              </label>
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="notifications">
          <Accordion.Trigger>알림</Accordion.Trigger>
          <Accordion.Content>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">이메일 알림</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">푸시 알림</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm">SMS 알림</span>
              </label>
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="privacy">
          <Accordion.Trigger>개인정보</Accordion.Trigger>
          <Accordion.Content>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">프로필 공개</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span className="text-sm">활동 기록 저장</span>
              </label>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

/**
 * 필터 패널 예시
 */
export const FilterPanelExample: Story = {
  render: () => (
    <div className="w-[300px] border rounded-lg p-2">
      <h3 className="px-2 py-2 font-semibold text-sm">필터</h3>
      <Accordion type="multiple" defaultValue={["category", "price"]}>
        <Accordion.Item value="category">
          <Accordion.Trigger>카테고리</Accordion.Trigger>
          <Accordion.Content>
            <div className="space-y-1">
              {["전자기기", "의류", "식품", "가구", "도서"].map((cat) => (
                <label key={cat} className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="price">
          <Accordion.Trigger>가격대</Accordion.Trigger>
          <Accordion.Content>
            <div className="space-y-1">
              {["~10,000원", "10,000~50,000원", "50,000~100,000원", "100,000원~"].map(
                (price) => (
                  <label key={price} className="flex items-center gap-2">
                    <input type="radio" name="price" />
                    <span className="text-sm">{price}</span>
                  </label>
                )
              )}
            </div>
          </Accordion.Content>
        </Accordion.Item>
        <Accordion.Item value="brand">
          <Accordion.Trigger>브랜드</Accordion.Trigger>
          <Accordion.Content>
            <div className="space-y-1">
              {["삼성", "LG", "Apple", "Sony", "기타"].map((brand) => (
                <label key={brand} className="flex items-center gap-2">
                  <input type="checkbox" />
                  <span className="text-sm">{brand}</span>
                </label>
              ))}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  ),
};

