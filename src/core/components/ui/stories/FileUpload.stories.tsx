/**
 * SoftOne Design System(SDS) - FileUpload Stories
 * 작성: SoftOne Frontend Team
 * 설명: FileUpload 컴포넌트의 Storybook 문서.
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FileUpload } from "../FileUpload";

const meta: Meta<typeof FileUpload> = {
  title: "Core/UI/FileUpload",
  component: FileUpload,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
SoftOne Design System의 FileUpload 컴포넌트입니다.

### 특징
- **Drag & Drop**: 파일 드래그 앤 드롭 지원
- **클릭 업로드**: 클릭하여 파일 선택
- **검증**: 확장자, 파일 크기 검증
- **미리보기**: 이미지 파일 미리보기 지원
- **Controlled/Uncontrolled**: 두 가지 모드 지원

### 사용법
\`\`\`tsx
import { FileUpload } from '@core/components/ui';

<FileUpload
  label="첨부파일"
  acceptExtensions={['jpg', 'png', 'pdf']}
  maxSizeMb={10}
  onFilesSelected={(files) => console.log(files)}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    multiple: {
      control: "boolean",
      description: "다중 파일 허용",
    },
    disabled: {
      control: "boolean",
      description: "비활성화 상태",
    },
    error: {
      control: "boolean",
      description: "에러 상태",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ========================================
// Basic Stories
// ========================================

/**
 * 기본 FileUpload
 */
export const Default: Story = {
  render: () => (
    <div className="w-96">
      <FileUpload
        label="파일 업로드"
        description="파일을 드래그하거나 클릭하여 업로드하세요"
        onFilesSelected={(files) => console.log("Selected:", files)}
      />
    </div>
  ),
};

/**
 * 확장자 제한
 */
export const WithExtensionLimit: Story = {
  render: () => (
    <div className="w-96">
      <FileUpload
        label="이미지 업로드"
        acceptExtensions={["jpg", "jpeg", "png", "gif"]}
        onFilesSelected={(files) => console.log("Selected:", files)}
      />
    </div>
  ),
};

/**
 * 파일 크기 제한
 */
export const WithSizeLimit: Story = {
  render: () => (
    <div className="w-96">
      <FileUpload
        label="문서 업로드"
        acceptExtensions={["pdf", "doc", "docx"]}
        maxSizeMb={5}
        onFilesSelected={(files) => console.log("Selected:", files)}
      />
    </div>
  ),
};

/**
 * 다중 파일
 */
export const Multiple: Story = {
  render: () => (
    <div className="w-96">
      <FileUpload
        label="여러 파일 업로드"
        multiple
        acceptExtensions={["jpg", "png", "pdf"]}
        maxSizeMb={10}
        onFilesSelected={(files) => console.log("Selected:", files)}
      />
    </div>
  ),
};

// ========================================
// State Variants
// ========================================

/**
 * 비활성화
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-96">
      <FileUpload
        label="업로드 비활성화"
        disabled
        description="현재 업로드할 수 없습니다"
      />
    </div>
  ),
};

/**
 * 에러 상태
 */
export const WithError: Story = {
  render: () => (
    <div className="w-96">
      <FileUpload
        label="파일 업로드"
        error
        errorMessage="파일 업로드에 실패했습니다. 다시 시도해주세요."
      />
    </div>
  ),
};

// ========================================
// Interactive Examples
// ========================================

/**
 * Controlled 모드
 */
export const Controlled: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    
    return (
      <div className="w-96 space-y-4">
        <FileUpload
          label="파일 업로드"
          multiple
          acceptExtensions={["jpg", "png", "gif", "pdf"]}
          maxSizeMb={5}
          value={files}
          onChange={setFiles}
        />
        <div className="text-sm text-gray-500">
          선택된 파일: {files.length}개
        </div>
      </div>
    );
  },
};

/**
 * 이미지 미리보기
 */
export const ImagePreview: Story = {
  render: () => (
    <div className="w-96">
      <FileUpload
        label="이미지 업로드"
        description="이미지를 업로드하면 미리보기가 표시됩니다"
        acceptExtensions={["jpg", "jpeg", "png", "gif", "webp"]}
        maxSizeMb={10}
        onFilesSelected={(files) => console.log("Selected:", files)}
      />
    </div>
  ),
};

// ========================================
// Real-world Examples
// ========================================

/**
 * 프로필 이미지 업로드
 */
export const ProfileImageUpload: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    
    return (
      <div className="w-96 p-4 border rounded-lg space-y-4">
        <h3 className="font-semibold">프로필 이미지</h3>
        <FileUpload
          acceptExtensions={["jpg", "jpeg", "png"]}
          maxSizeMb={2}
          value={files}
          onChange={setFiles}
        />
        <p className="text-xs text-gray-500">
          * JPG, PNG 파일만 가능하며, 최대 2MB까지 업로드할 수 있습니다.
        </p>
      </div>
    );
  },
};

/**
 * 문서 첨부
 */
export const DocumentAttachment: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    
    return (
      <div className="w-96 p-4 border rounded-lg space-y-4">
        <h3 className="font-semibold">첨부 문서</h3>
        <FileUpload
          multiple
          acceptExtensions={["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"]}
          maxSizeMb={20}
          value={files}
          onChange={setFiles}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>PDF, Word, Excel, PowerPoint</span>
          <span>최대 20MB</span>
        </div>
      </div>
    );
  },
};

/**
 * 폼 내 파일 업로드
 */
export const InFormExample: Story = {
  render: () => {
    const [files, setFiles] = useState<File[]>([]);
    
    return (
      <div className="w-[500px] p-6 border rounded-lg space-y-4">
        <h2 className="text-xl font-bold">문의하기</h2>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium">제목</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded"
            placeholder="문의 제목을 입력하세요"
          />
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium">내용</label>
          <textarea
            className="w-full px-3 py-2 border rounded h-24"
            placeholder="문의 내용을 입력하세요"
          />
        </div>
        
        <FileUpload
          label="첨부파일"
          multiple
          acceptExtensions={["jpg", "png", "pdf", "doc", "docx"]}
          maxSizeMb={10}
          value={files}
          onChange={setFiles}
        />
        
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          문의 등록
        </button>
      </div>
    );
  },
};

// ========================================
// Showcase
// ========================================

/**
 * 모든 상태 조합
 */
export const AllStates: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">기본</h3>
        <FileUpload
          acceptExtensions={["jpg", "png"]}
          maxSizeMb={5}
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">라벨 + 설명</h3>
        <FileUpload
          label="파일 업로드"
          description="클릭하거나 드래그하세요"
          acceptExtensions={["jpg", "png"]}
          maxSizeMb={5}
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">에러 상태</h3>
        <FileUpload
          label="파일 업로드"
          error
          errorMessage="파일 업로드 실패"
        />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-700">비활성화</h3>
        <FileUpload
          label="파일 업로드"
          disabled
        />
      </div>
    </div>
  ),
};

