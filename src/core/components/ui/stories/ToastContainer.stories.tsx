/**
 * SoftOne Design System(SDS) - ToastContainer Stories
 * 작성: SoftOne Frontend Team
 * 설명: ToastContainer 및 useToast 훅의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { ToastContainer } from "../ToastContainer";
import { useToast } from "../../../hooks/useToast";
import { useToastStore } from "../../../store/toastStore";
import { Button } from "../Button";

const meta: Meta<typeof ToastContainer> = {
  title: "Core/UI/ToastContainer",
  component: ToastContainer,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
SoftOne Design System의 Toast 시스템입니다.

### 구성 요소
- **ToastContainer**: App 루트에서 렌더링하는 토스트 컨테이너
- **useToast**: 토스트를 표시하는 훅
- **toastStore**: Zustand 기반 상태 관리

### 사용법
\`\`\`tsx
// App.tsx에서 ToastContainer 렌더링
<ToastContainer position="top-right" />

// 컴포넌트에서 useToast 사용
const { success, error, warning, info } = useToast();

success("저장되었습니다");
error("오류가 발생했습니다");
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "select",
      options: ["top-right", "top-left", "bottom-right", "bottom-left", "top-center", "bottom-center"],
      description: "토스트 위치",
    },
    maxToasts: {
      control: { type: "number", min: 1, max: 10 },
      description: "최대 표시 개수",
    },
  },
  decorators: [
    (Story) => {
      // 스토리 변경 시 토스트 초기화
      const { clearAll } = useToastStore();
      useEffect(() => {
        return () => clearAll();
      }, [clearAll]);
      
      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Helper Component
// ========================================

const ToastDemo = () => {
  const toast = useToast();
  
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="primary"
        onClick={() => toast.success("성공적으로 저장되었습니다.")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("오류가 발생했습니다. 다시 시도해주세요.")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("주의: 이 작업은 되돌릴 수 없습니다.")}
      >
        Warning
      </Button>
      <Button
        variant="ghost"
        onClick={() => toast.info("새로운 업데이트가 있습니다.")}
      >
        Info
      </Button>
    </div>
  );
};

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 사용법
 */
export const Default: Story = {
  render: () => (
    <div className="p-8">
      <ToastContainer />
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Toast 데모</h2>
        <p className="text-gray-600">
          버튼을 클릭하여 다양한 토스트를 표시해보세요.
        </p>
        <ToastDemo />
      </div>
    </div>
  ),
};

// ========================================
// Position Variants
// ========================================

/**
 * 위치: 상단 우측 (기본)
 */
export const TopRight: Story = {
  render: () => (
    <div className="p-8">
      <ToastContainer position="top-right" />
      <div className="space-y-4">
        <h3 className="font-bold">position="top-right"</h3>
        <ToastDemo />
      </div>
    </div>
  ),
};

/**
 * 위치: 상단 좌측
 */
export const TopLeft: Story = {
  render: () => (
    <div className="p-8">
      <ToastContainer position="top-left" />
      <div className="space-y-4">
        <h3 className="font-bold">position="top-left"</h3>
        <ToastDemo />
      </div>
    </div>
  ),
};

/**
 * 위치: 하단 우측
 */
export const BottomRight: Story = {
  render: () => (
    <div className="p-8">
      <ToastContainer position="bottom-right" />
      <div className="space-y-4">
        <h3 className="font-bold">position="bottom-right"</h3>
        <ToastDemo />
      </div>
    </div>
  ),
};

/**
 * 위치: 상단 중앙
 */
export const TopCenter: Story = {
  render: () => (
    <div className="p-8">
      <ToastContainer position="top-center" />
      <div className="space-y-4">
        <h3 className="font-bold">position="top-center"</h3>
        <ToastDemo />
      </div>
    </div>
  ),
};

// ========================================
// Toast Types
// ========================================

/**
 * 모든 토스트 타입
 */
export const AllTypes: Story = {
  render: () => {
    const ToastTypesDemo = () => {
      const toast = useToast();
      
      const showAllToasts = () => {
        toast.success("작업이 성공적으로 완료되었습니다.");
        setTimeout(() => toast.error("오류가 발생했습니다."), 200);
        setTimeout(() => toast.warning("주의가 필요합니다."), 400);
        setTimeout(() => toast.info("새로운 정보가 있습니다."), 600);
      };
      
      return (
        <div className="space-y-4">
          <Button onClick={showAllToasts}>
            모든 타입 표시
          </Button>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast.success("Success!")}>
              Success
            </Button>
            <Button variant="outline" onClick={() => toast.error("Error!")}>
              Error
            </Button>
            <Button variant="outline" onClick={() => toast.warning("Warning!")}>
              Warning
            </Button>
            <Button variant="outline" onClick={() => toast.info("Info!")}>
              Info
            </Button>
          </div>
        </div>
      );
    };
    
    return (
      <div className="p-8">
        <ToastContainer />
        <ToastTypesDemo />
      </div>
    );
  },
};

// ========================================
// With Title
// ========================================

/**
 * 타이틀 포함
 */
export const WithTitle: Story = {
  render: () => {
    const ToastWithTitleDemo = () => {
      const toast = useToast();
      
      return (
        <div className="space-y-4">
          <Button
            onClick={() =>
              toast.success("프로필이 성공적으로 저장되었습니다.", {
                title: "저장 완료",
              })
            }
          >
            Success with Title
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.", {
                title: "연결 오류",
              })
            }
          >
            Error with Title
          </Button>
        </div>
      );
    };
    
    return (
      <div className="p-8">
        <ToastContainer />
        <ToastWithTitleDemo />
      </div>
    );
  },
};

// ========================================
// Max Toasts
// ========================================

/**
 * 최대 개수 제한
 */
export const MaxToasts: Story = {
  render: () => {
    const MaxToastsDemo = () => {
      const toast = useToast();
      let counter = 0;
      
      const addMultipleToasts = () => {
        for (let i = 0; i < 10; i++) {
          setTimeout(() => {
            counter++;
            toast.info(`토스트 #${counter}`);
          }, i * 100);
        }
      };
      
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            maxToasts=3으로 설정됨. 10개의 토스트를 추가해도 3개만 표시됩니다.
          </p>
          <Button onClick={addMultipleToasts}>
            10개 토스트 추가
          </Button>
        </div>
      );
    };
    
    return (
      <div className="p-8">
        <ToastContainer maxToasts={3} />
        <MaxToastsDemo />
      </div>
    );
  },
};

// ========================================
// Real-world Examples
// ========================================

/**
 * CRUD 작업 예시
 */
export const CrudOperations: Story = {
  render: () => {
    const CrudDemo = () => {
      const toast = useToast();
      
      const handleCreate = () => {
        toast.success("새 항목이 생성되었습니다.", { title: "생성 완료" });
      };
      
      const handleUpdate = () => {
        toast.success("변경사항이 저장되었습니다.", { title: "수정 완료" });
      };
      
      const handleDelete = () => {
        toast.success("항목이 삭제되었습니다.", { title: "삭제 완료" });
      };
      
      const handleError = () => {
        toast.error("권한이 없습니다. 관리자에게 문의하세요.", {
          title: "권한 오류",
        });
      };
      
      return (
        <div className="space-y-4">
          <h3 className="font-bold">CRUD 작업</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleCreate}>생성</Button>
            <Button variant="outline" onClick={handleUpdate}>수정</Button>
            <Button variant="outline" onClick={handleDelete}>삭제</Button>
            <Button variant="outline" onClick={handleError}>에러</Button>
          </div>
        </div>
      );
    };
    
    return (
      <div className="p-8">
        <ToastContainer />
        <CrudDemo />
      </div>
    );
  },
};

/**
 * 폼 제출 예시
 */
export const FormSubmission: Story = {
  render: () => {
    const FormDemo = () => {
      const toast = useToast();
      
      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("폼이 성공적으로 제출되었습니다.", {
          title: "제출 완료",
        });
      };
      
      const handleValidationError = () => {
        toast.error("필수 항목을 모두 입력해주세요.", {
          title: "유효성 검사 실패",
        });
      };
      
      return (
        <form onSubmit={handleSubmit} className="w-80 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">이름</label>
            <input className="w-full px-3 py-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">이메일</label>
            <input className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="flex gap-2">
            <Button type="submit">제출</Button>
            <Button type="button" variant="outline" onClick={handleValidationError}>
              유효성 에러
            </Button>
          </div>
        </form>
      );
    };
    
    return (
      <div className="p-8">
        <ToastContainer />
        <FormDemo />
      </div>
    );
  },
};

/**
 * 비동기 작업 예시
 */
export const AsyncOperation: Story = {
  render: () => {
    const AsyncDemo = () => {
      const toast = useToast();
      
      const handleAsync = async () => {
        toast.info("데이터를 불러오는 중...");
        
        // 시뮬레이션
        await new Promise((resolve) => setTimeout(resolve, 2000));
        
        toast.success("데이터를 성공적으로 불러왔습니다.");
      };
      
      const handleAsyncError = async () => {
        toast.info("처리 중...");
        
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        toast.error("요청 처리 중 오류가 발생했습니다.");
      };
      
      return (
        <div className="space-y-4">
          <h3 className="font-bold">비동기 작업</h3>
          <div className="flex gap-2">
            <Button onClick={handleAsync}>성공 시뮬레이션</Button>
            <Button variant="outline" onClick={handleAsyncError}>
              실패 시뮬레이션
            </Button>
          </div>
        </div>
      );
    };
    
    return (
      <div className="p-8">
        <ToastContainer />
        <AsyncDemo />
      </div>
    );
  },
};

