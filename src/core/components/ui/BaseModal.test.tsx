/**
 * SoftOne Design System - BaseModal Tests
 * Vitest tests for BaseModal component
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BaseModal } from "./BaseModal";
import { Button } from "./Button";

describe("BaseModal", () => {
  // 각 테스트 후 body 정리
  afterEach(() => {
    document.body.innerHTML = "";
  });

  // ========================================
  // 기본 렌더링 테스트
  // ========================================

  describe("렌더링", () => {
    it("isOpen이 false일 때 렌더링되지 않음", () => {
      render(
        <BaseModal isOpen={false} onClose={() => {}}>
          <p>Modal Content</p>
        </BaseModal>
      );

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("isOpen이 true일 때 렌더링됨", () => {
      render(
        <BaseModal isOpen={true} onClose={() => {}}>
          <p>Modal Content</p>
        </BaseModal>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Modal Content")).toBeInTheDocument();
    });

    it("title이 있을 때 헤더에 표시됨", () => {
      render(
        <BaseModal isOpen={true} onClose={() => {}} title="Test Modal">
          <p>Content</p>
        </BaseModal>
      );

      expect(screen.getByText("Test Modal")).toBeInTheDocument();
    });

    it("footer가 있을 때 표시됨", () => {
      render(
        <BaseModal
          isOpen={true}
          onClose={() => {}}
          footer={<Button>확인</Button>}
        >
          <p>Content</p>
        </BaseModal>
      );

      expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
    });
  });

  // ========================================
  // 접근성 테스트
  // ========================================

  describe("접근성", () => {
    it("role=dialog 속성이 있음", () => {
      render(
        <BaseModal isOpen={true} onClose={() => {}}>
          <p>Content</p>
        </BaseModal>
      );

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("aria-modal=true 속성이 있음", () => {
      render(
        <BaseModal isOpen={true} onClose={() => {}}>
          <p>Content</p>
        </BaseModal>
      );

      expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    });

    it("title이 있을 때 aria-labelledby가 설정됨", () => {
      render(
        <BaseModal isOpen={true} onClose={() => {}} title="Test Title">
          <p>Content</p>
        </BaseModal>
      );

      const dialog = screen.getByRole("dialog");
      const labelledBy = dialog.getAttribute("aria-labelledby");
      expect(labelledBy).toBeTruthy();

      const titleElement = document.getElementById(labelledBy!);
      expect(titleElement).toHaveTextContent("Test Title");
    });

    it("role=alertdialog로 변경 가능", () => {
      render(
        <BaseModal isOpen={true} onClose={() => {}} role="alertdialog">
          <p>Content</p>
        </BaseModal>
      );

      expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    });
  });

  // ========================================
  // ESC 키 테스트
  // ========================================

  describe("ESC 키 닫기", () => {
    it("ESC 키를 누르면 onClose가 호출됨", async () => {
      const handleClose = vi.fn();
      render(
        <BaseModal isOpen={true} onClose={handleClose}>
          <p>Content</p>
        </BaseModal>
      );

      const dialog = screen.getByRole("dialog");
      fireEvent.keyDown(dialog, { key: "Escape" });

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("closeOnEscape=false일 때 ESC로 닫히지 않음", async () => {
      const handleClose = vi.fn();
      render(
        <BaseModal isOpen={true} onClose={handleClose} closeOnEscape={false}>
          <p>Content</p>
        </BaseModal>
      );

      const dialog = screen.getByRole("dialog");
      fireEvent.keyDown(dialog, { key: "Escape" });

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  // ========================================
  // 오버레이 클릭 테스트
  // ========================================

  describe("오버레이 클릭 닫기", () => {
    it("오버레이를 클릭하면 onClose가 호출됨", async () => {
      const handleClose = vi.fn();
      render(
        <BaseModal isOpen={true} onClose={handleClose}>
          <p>Content</p>
        </BaseModal>
      );

      // 오버레이는 aria-hidden="true"인 div
      const overlay = document.querySelector('[aria-hidden="true"]');
      expect(overlay).toBeInTheDocument();

      fireEvent.click(overlay!);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("closeOnOverlayClick=false일 때 오버레이 클릭으로 닫히지 않음", async () => {
      const handleClose = vi.fn();
      render(
        <BaseModal
          isOpen={true}
          onClose={handleClose}
          closeOnOverlayClick={false}
        >
          <p>Content</p>
        </BaseModal>
      );

      const overlay = document.querySelector('[aria-hidden="true"]');
      fireEvent.click(overlay!);

      expect(handleClose).not.toHaveBeenCalled();
    });

    it("모달 내용 클릭 시 닫히지 않음", async () => {
      const handleClose = vi.fn();
      render(
        <BaseModal isOpen={true} onClose={handleClose}>
          <p>Click me</p>
        </BaseModal>
      );

      fireEvent.click(screen.getByText("Click me"));

      expect(handleClose).not.toHaveBeenCalled();
    });
  });

  // ========================================
  // 닫기 버튼 테스트
  // ========================================

  describe("닫기 버튼", () => {
    it("닫기 버튼 클릭 시 onClose가 호출됨", async () => {
      const handleClose = vi.fn();
      render(
        <BaseModal isOpen={true} onClose={handleClose} title="Test">
          <p>Content</p>
        </BaseModal>
      );

      const closeButton = screen.getByRole("button", { name: "닫기" });
      fireEvent.click(closeButton);

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("hideCloseButton=true일 때 닫기 버튼이 없음", () => {
      render(
        <BaseModal
          isOpen={true}
          onClose={() => {}}
          title="Test"
          hideCloseButton
        >
          <p>Content</p>
        </BaseModal>
      );

      expect(
        screen.queryByRole("button", { name: "닫기" })
      ).not.toBeInTheDocument();
    });
  });

  // ========================================
  // 크기 테스트
  // ========================================

  describe("크기 변형", () => {
    it.each(["sm", "md", "lg", "xl", "full"] as const)(
      "%s 크기가 적용됨",
      (size) => {
        render(
          <BaseModal isOpen={true} onClose={() => {}} size={size}>
            <p>Content</p>
          </BaseModal>
        );

        const dialog = screen.getByRole("dialog");
        // 각 크기에 해당하는 클래스가 있는지 확인
        expect(dialog.className).toMatch(/max-w-/);
      }
    );
  });

  // ========================================
  // 스크롤 방지 테스트
  // ========================================

  describe("스크롤 방지", () => {
    it("모달이 열리면 body 스크롤이 비활성화됨", () => {
      render(
        <BaseModal isOpen={true} onClose={() => {}}>
          <p>Content</p>
        </BaseModal>
      );

      expect(document.body.style.overflow).toBe("hidden");
    });
  });
});
