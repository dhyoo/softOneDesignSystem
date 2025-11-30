/**
 * SoftOne Design System - Storybook Preview Configuration
 * 글로벌 스타일 및 Decorator 설정
 */
import React from "react";
import type { Preview } from "@storybook/react";
import "../src/core/styles/globals.css";

const preview: Preview = {
  parameters: {
    // 자동 생성 컨트롤 설정
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    // 배경색 옵션
    backgrounds: {
      default: "softone-light",
      values: [
        {
          name: "softone-light",
          value: "#ffffff",
        },
        {
          name: "softone-dark",
          value: "#0f172a",
        },
        {
          name: "softone-gray",
          value: "#f9fafb",
        },
      ],
    },

    // 뷰포트 설정
    viewport: {
      viewports: {
        mobile: {
          name: "Mobile",
          styles: { width: "375px", height: "667px" },
        },
        tablet: {
          name: "Tablet",
          styles: { width: "768px", height: "1024px" },
        },
        desktop: {
          name: "Desktop",
          styles: { width: "1280px", height: "800px" },
        },
        wide: {
          name: "Wide Desktop",
          styles: { width: "1920px", height: "1080px" },
        },
      },
    },

    // 액션 로깅
    actions: { argTypesRegex: "^on[A-Z].*" },
  },

  // 글로벌 Decorator
  decorators: [
    (Story) => (
      <div className="font-sans text-softone-text">
        <Story />
      </div>
    ),
  ],

  // 글로벌 Args 타입
  argTypes: {
    // 공통 Props 문서화
  },
};

export default preview;
