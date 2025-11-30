/**
 * SoftOne Design System - Storybook Main Configuration
 * Component Documentation & Visual Testing
 */
import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  // 스토리 파일 경로 패턴
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  // Storybook Addons
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
  ],

  // React + Vite 프레임워크
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  // Vite 빌더 옵션
  viteFinal: async (config) => {
    // Path alias 설정
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": "/src",
        "@core": "/src/core",
        "@features": "/src/features",
        "@shells": "/src/shells",
        "@app": "/src/app",
      };
    }
    return config;
  },

  // 정적 디렉토리
  staticDirs: ["../public"],

  // TypeScript 설정
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};

export default config;
