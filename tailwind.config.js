/**
 * SoftOne Design System - Tailwind Configuration
 * CSS Variable 기반 Design Token 시스템
 *
 * 엔터프라이즈 Admin UI에서 일관된 디자인 언어를 보장하는
 * SDS Design Token을 정의합니다.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      /**
       * SDS Color System
       * CSS Variable을 사용하여 런타임에 테마 변경 가능
       * 실제 색상값은 globals.css의 :root에서 정의
       */
      colors: {
        softone: {
          // Primary Colors (Blue)
          primary: "var(--softone-primary)",
          "primary-hover": "var(--softone-primary-hover)",
          "primary-light": "var(--softone-primary-light)",

          // Secondary Colors (Slate)
          secondary: "var(--softone-secondary)",
          "secondary-hover": "var(--softone-secondary-hover)",

          // Semantic Colors
          success: "var(--softone-success)",
          "success-light": "var(--softone-success-light)",
          warning: "var(--softone-warning)",
          "warning-light": "var(--softone-warning-light)",
          danger: "var(--softone-danger)",
          "danger-light": "var(--softone-danger-light)",
          info: "var(--softone-info)",
          "info-light": "var(--softone-info-light)",

          // Background & Surface
          bg: "var(--softone-bg)",
          surface: "var(--softone-surface)",
          "surface-hover": "var(--softone-surface-hover)",

          // Text
          text: "var(--softone-text)",
          "text-secondary": "var(--softone-text-secondary)",
          "text-muted": "var(--softone-text-muted)",

          // Border
          border: "var(--softone-border)",
          "border-hover": "var(--softone-border-hover)",

          // Sidebar
          "sidebar-bg": "var(--softone-sidebar-bg)",
          "sidebar-text": "var(--softone-sidebar-text)",
          "sidebar-hover": "var(--softone-sidebar-hover)",
          "sidebar-active": "var(--softone-sidebar-active)",
        },
      },

      /**
       * SDS Font Family
       * Pretendard를 기본 폰트로 사용
       */
      fontFamily: {
        softone: [
          "Pretendard",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans KR",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Consolas",
          "Monaco",
          "monospace",
        ],
      },

      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.5" }],
        sm: ["0.875rem", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.5" }],
        xl: ["1.25rem", { lineHeight: "1.4" }],
        "2xl": ["1.5rem", { lineHeight: "1.3" }],
        "3xl": ["1.875rem", { lineHeight: "1.2" }],
        "4xl": ["2.25rem", { lineHeight: "1.1" }],
      },

      borderRadius: {
        DEFAULT: "0.375rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
      },

      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },

      transitionDuration: {
        fast: "150ms",
        normal: "200ms",
        slow: "300ms",
      },

      zIndex: {
        dropdown: "1000",
        sticky: "1020",
        modal: "1030",
        popover: "1040",
        toast: "1050",
      },

      // Layout
      width: {
        sidebar: "260px",
        "sidebar-collapsed": "64px",
      },

      height: {
        header: "64px",
      },

      spacing: {
        sidebar: "260px",
        "sidebar-collapsed": "64px",
        header: "64px",
      },
    },
  },
  plugins: [],
};
