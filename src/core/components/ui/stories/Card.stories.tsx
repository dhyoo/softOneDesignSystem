/**
 * SoftOne Design System(SDS) - Card Stories
 * 작성: SoftOne Frontend Team
 * 설명: Card 컴포넌트의 Storybook 문서.
 *      테스트/스토리 문서화를 통한 엔터프라이즈 품질 보장.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from "../Card";
import { Button } from "../Button";
import { Badge } from "../Badge";

const meta: Meta<typeof Card> = {
  title: "Core/UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 Card 컴포넌트입니다.

### 구성 요소
- **Card**: 카드 컨테이너
- **CardHeader**: 헤더 영역 (actions 슬롯 포함)
- **CardTitle**: 제목
- **CardBody**: 본문 영역
- **CardFooter**: 푸터 영역

### 사용법
\`\`\`tsx
import { Card, CardHeader, CardTitle, CardBody, CardFooter } from '@core/components/ui';

<Card>
  <CardHeader actions={<Button size="sm">Action</Button>}>
    <CardTitle>카드 제목</CardTitle>
  </CardHeader>
  <CardBody>
    카드 내용...
  </CardBody>
  <CardFooter>
    <Button>확인</Button>
  </CardFooter>
</Card>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    noPadding: {
      control: "boolean",
      description: "패딩 없이 사용",
    },
    hoverable: {
      control: "boolean",
      description: "호버 효과",
    },
    clickable: {
      control: "boolean",
      description: "클릭 가능",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 카드
 */
export const Default: Story = {
  args: {
    children: <CardBody>기본 카드 내용입니다.</CardBody>,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

/**
 * 제목이 있는 카드
 */
export const WithTitle: Story = {
  render: () => (
    <div className="w-80">
      <Card>
        <CardHeader>
          <CardTitle>카드 제목</CardTitle>
        </CardHeader>
        <CardBody>
          이것은 카드의 내용입니다. 다양한 정보를 표시할 수 있습니다.
        </CardBody>
      </Card>
    </div>
  ),
};

/**
 * 액션 버튼이 있는 카드
 */
export const WithActions: Story = {
  render: () => (
    <div className="w-96">
      <Card>
        <CardHeader
          actions={
            <>
              <Button variant="ghost" size="sm">
                편집
              </Button>
              <Button variant="primary" size="sm">
                저장
              </Button>
            </>
          }
        >
          <CardTitle>설정</CardTitle>
        </CardHeader>
        <CardBody>설정 내용이 여기에 표시됩니다.</CardBody>
      </Card>
    </div>
  ),
};

/**
 * Footer가 있는 카드
 */
export const WithFooter: Story = {
  render: () => (
    <div className="w-96">
      <Card>
        <CardHeader>
          <CardTitle>확인 필요</CardTitle>
        </CardHeader>
        <CardBody>이 작업을 진행하시겠습니까?</CardBody>
        <CardFooter>
          <Button variant="outline">취소</Button>
          <Button variant="primary">확인</Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

// ========================================
// Variants
// ========================================

/**
 * 호버 효과
 */
export const Hoverable: Story = {
  args: {
    hoverable: true,
    children: (
      <CardBody>마우스를 올려보세요. 그림자가 변합니다.</CardBody>
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

/**
 * 클릭 가능
 */
export const Clickable: Story = {
  args: {
    clickable: true,
    hoverable: true,
    onClick: () => alert("Card clicked!"),
    children: <CardBody>클릭 가능한 카드입니다.</CardBody>,
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

/**
 * 패딩 없음
 */
export const NoPadding: Story = {
  args: {
    noPadding: true,
    children: (
      <img
        src="https://via.placeholder.com/320x180"
        alt="Placeholder"
        className="rounded-lg"
      />
    ),
  },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};

// ========================================
// Complex Examples
// ========================================

/**
 * 통계 카드
 */
export const StatCard: Story = {
  render: () => (
    <div className="w-64">
      <Card>
        <CardBody>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">총 사용자</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600">+12%</span>
            <span className="text-gray-500 ml-2">지난주 대비</span>
          </div>
        </CardBody>
      </Card>
    </div>
  ),
};

/**
 * 사용자 프로필 카드
 */
export const ProfileCard: Story = {
  render: () => (
    <div className="w-80">
      <Card>
        <CardBody>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-500"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">홍길동</h3>
              <p className="text-sm text-gray-500">hong@softone.co.kr</p>
              <Badge variant="success" className="mt-1">
                활성
              </Badge>
            </div>
          </div>
        </CardBody>
        <CardFooter>
          <Button variant="outline" size="sm" fullWidth>
            프로필 보기
          </Button>
        </CardFooter>
      </Card>
    </div>
  ),
};

/**
 * 그리드 카드 레이아웃
 */
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      {[
        { title: "사용자", value: "1,234", color: "blue" },
        { title: "주문", value: "567", color: "green" },
        { title: "매출", value: "₩12.3M", color: "purple" },
      ].map((item, i) => (
        <Card key={i} hoverable>
          <CardBody>
            <p className="text-sm text-gray-500">{item.title}</p>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  ),
};

