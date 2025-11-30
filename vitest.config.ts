/**
 * SoftOne Design System - Vitest Configuration
 * Unit & Integration Testing Configuration
 */
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // jsdom 환경에서 DOM API 사용
    environment: "jsdom",

    // Jest 호환 글로벌 API 사용 (describe, it, expect 등)
    globals: true,

    // 테스트 셋업 파일
    setupFiles: ["./src/test/setup.ts"],

    // 테스트 파일 패턴
    include: ["src/**/*.{test,spec}.{ts,tsx}"],

    // 커버리지 설정
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.stories.{ts,tsx}",
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/test/**/*",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@core": path.resolve(__dirname, "./src/core"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@shells": path.resolve(__dirname, "./src/shells"),
      "@app": path.resolve(__dirname, "./src/app"),
    },
  },
});
