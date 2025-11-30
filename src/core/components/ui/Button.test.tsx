/**
 * SoftOne Design System(SDS) - Button 테스트
 * 작성: SoftOne Frontend Team
 * 설명: Button 컴포넌트의 단위 테스트.
 *      테스트/스토리 문서화를 통한 엔터프라이즈 품질 보장.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  // ========================================
  // 기본 렌더링
  // ========================================
  describe("렌더링", () => {
    it("버튼이 정상적으로 렌더링됩니다", () => {
      render(<Button>테스트 버튼</Button>);
      expect(screen.getByRole("button")).toHaveTextContent("테스트 버튼");
    });

    it("기본 type은 button입니다", () => {
      render(<Button>버튼</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "button");
    });

    it("type을 submit으로 설정할 수 있습니다", () => {
      render(<Button type="submit">제출</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
    });
  });

  // ========================================
  // Variant 스타일
  // ========================================
  describe("variant", () => {
    it("primary variant는 bg-softone-primary 클래스를 포함합니다", () => {
      render(<Button variant="primary">Primary</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-softone-primary");
    });

    it("outline variant는 border-softone-primary 클래스를 포함합니다", () => {
      render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole("button")).toHaveClass("border-softone-primary");
    });

    it("ghost variant는 bg-transparent 클래스를 포함합니다", () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole("button")).toHaveClass("bg-transparent");
    });
  });

  // ========================================
  // Size 스타일
  // ========================================
  describe("size", () => {
    it("sm size는 h-8 클래스를 포함합니다", () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-8");
    });

    it("md size는 h-10 클래스를 포함합니다", () => {
      render(<Button size="md">Medium</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-10");
    });

    it("lg size는 h-12 클래스를 포함합니다", () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole("button")).toHaveClass("h-12");
    });
  });

  // ========================================
  // 상태
  // ========================================
  describe("상태", () => {
    it("disabled 상태에서는 버튼이 비활성화됩니다", () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("loading 상태에서는 버튼이 비활성화됩니다", () => {
      render(<Button loading>Loading</Button>);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("loading 상태에서는 스피너가 표시됩니다", () => {
      render(<Button loading>Loading</Button>);
      // 스피너는 SVG로 렌더링되므로 animate-spin 클래스로 확인
      const spinner = screen
        .getByRole("button")
        .querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("fullWidth일 때 w-full 클래스를 포함합니다", () => {
      render(<Button fullWidth>Full Width</Button>);
      expect(screen.getByRole("button")).toHaveClass("w-full");
    });
  });

  // ========================================
  // 이벤트
  // ========================================
  describe("이벤트", () => {
    it("클릭 시 onClick 핸들러가 호출됩니다", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("disabled 상태에서는 onClick이 호출되지 않습니다", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      );

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("loading 상태에서는 onClick이 호출되지 않습니다", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} loading>
          Loading
        </Button>
      );

      fireEvent.click(screen.getByRole("button"));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // ========================================
  // 아이콘
  // ========================================
  describe("아이콘", () => {
    it("leftIcon이 렌더링됩니다", () => {
      render(
        <Button leftIcon={<span data-testid="left-icon">←</span>}>
          With Icon
        </Button>
      );
      expect(screen.getByTestId("left-icon")).toBeInTheDocument();
    });

    it("rightIcon이 렌더링됩니다", () => {
      render(
        <Button rightIcon={<span data-testid="right-icon">→</span>}>
          With Icon
        </Button>
      );
      expect(screen.getByTestId("right-icon")).toBeInTheDocument();
    });

    it("loading 상태에서는 아이콘이 숨겨집니다", () => {
      render(
        <Button
          loading
          leftIcon={<span data-testid="left-icon">←</span>}
        >
          Loading
        </Button>
      );
      expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
    });
  });

  // ========================================
  // className
  // ========================================
  describe("className", () => {
    it("추가 className이 적용됩니다", () => {
      render(<Button className="custom-class">Custom</Button>);
      expect(screen.getByRole("button")).toHaveClass("custom-class");
    });
  });
});

