/**
 * SoftOne Design System - SDSLink Tests
 * SDSLink 컴포넌트 유닛 테스트
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SDSLink } from "./SDSLink";
import { NavigationProvider, type NavigationApi } from "../../router/NavigationContext";

// Mock Navigation API
const createMockNavigation = (): NavigationApi => ({
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  getCurrentPath: () => "/",
  getQueryParams: () => new URLSearchParams(),
});

// Test Wrapper
const TestWrapper = ({
  children,
  navigation,
}: {
  children: React.ReactNode;
  navigation: NavigationApi;
}) => (
  <NavigationProvider navigation={navigation}>{children}</NavigationProvider>
);

describe("SDSLink", () => {
  it("렌더링이 정상적으로 됩니다", () => {
    const mockNav = createMockNavigation();

    render(
      <TestWrapper navigation={mockNav}>
        <SDSLink href="/users">사용자</SDSLink>
      </TestWrapper>
    );

    expect(screen.getByText("사용자")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/users");
  });

  it("클릭 시 navigation.push가 호출됩니다", () => {
    const mockNav = createMockNavigation();

    render(
      <TestWrapper navigation={mockNav}>
        <SDSLink href="/users">사용자</SDSLink>
      </TestWrapper>
    );

    fireEvent.click(screen.getByText("사용자"));

    expect(mockNav.push).toHaveBeenCalledWith("/users");
    expect(mockNav.push).toHaveBeenCalledTimes(1);
  });

  it("replace 옵션이 있으면 navigation.replace가 호출됩니다", () => {
    const mockNav = createMockNavigation();

    render(
      <TestWrapper navigation={mockNav}>
        <SDSLink href="/login" replace>
          로그인
        </SDSLink>
      </TestWrapper>
    );

    fireEvent.click(screen.getByText("로그인"));

    expect(mockNav.replace).toHaveBeenCalledWith("/login");
    expect(mockNav.push).not.toHaveBeenCalled();
  });

  it("disabled 상태에서는 클릭이 무시됩니다", () => {
    const mockNav = createMockNavigation();

    render(
      <TestWrapper navigation={mockNav}>
        <SDSLink href="/admin" disabled>
          관리자
        </SDSLink>
      </TestWrapper>
    );

    fireEvent.click(screen.getByText("관리자"));

    expect(mockNav.push).not.toHaveBeenCalled();
  });

  it("외부 링크는 기본 동작을 유지합니다", () => {
    const mockNav = createMockNavigation();

    render(
      <TestWrapper navigation={mockNav}>
        <SDSLink href="https://example.com" target="_blank">
          외부 링크
        </SDSLink>
      </TestWrapper>
    );

    const link = screen.getByText("외부 링크");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("className이 적용됩니다", () => {
    const mockNav = createMockNavigation();

    render(
      <TestWrapper navigation={mockNav}>
        <SDSLink href="/test" className="custom-class">
          테스트
        </SDSLink>
      </TestWrapper>
    );

    expect(screen.getByText("테스트")).toHaveClass("custom-class");
  });

  it("onClick 핸들러가 호출됩니다", () => {
    const mockNav = createMockNavigation();
    const handleClick = vi.fn();

    render(
      <TestWrapper navigation={mockNav}>
        <SDSLink href="/test" onClick={handleClick}>
          테스트
        </SDSLink>
      </TestWrapper>
    );

    fireEvent.click(screen.getByText("테스트"));

    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(mockNav.push).toHaveBeenCalled();
  });
});

