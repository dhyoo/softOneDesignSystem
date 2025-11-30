/**
 * SoftOne Design System - DialogStore Tests
 * Vitest tests for dialogStore
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useDialogStore } from "./dialogStore";

describe("dialogStore", () => {
  // 각 테스트 전에 스토어 초기화
  beforeEach(() => {
    useDialogStore.setState({ dialogs: [] });
  });

  // ========================================
  // openDialog 테스트
  // ========================================

  describe("openDialog", () => {
    it("다이얼로그를 추가함", () => {
      const { openDialog } = useDialogStore.getState();

      openDialog({
        type: "modal",
        title: "Test Modal",
      });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs).toHaveLength(1);
      expect(dialogs[0].title).toBe("Test Modal");
      expect(dialogs[0].type).toBe("modal");
    });

    it("자동으로 ID를 생성함", () => {
      const { openDialog } = useDialogStore.getState();

      openDialog({ type: "modal" });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs[0].id).toBeTruthy();
      expect(dialogs[0].id).toMatch(/^dialog-/);
    });

    it("커스텀 ID를 사용함", () => {
      const { openDialog } = useDialogStore.getState();

      openDialog({
        type: "modal",
        id: "custom-id",
      });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs[0].id).toBe("custom-id");
    });

    it("기본값을 설정함", () => {
      const { openDialog } = useDialogStore.getState();

      openDialog({ type: "modal" });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs[0].closeOnOverlayClick).toBe(true);
      expect(dialogs[0].closeOnEscape).toBe(true);
      expect(dialogs[0].showCloseButton).toBe(true);
      expect(dialogs[0].size).toBe("md");
      expect(dialogs[0].variant).toBe("default");
    });

    it("여러 다이얼로그를 스택에 추가함", () => {
      const { openDialog } = useDialogStore.getState();

      openDialog({ type: "modal", title: "First" });
      openDialog({ type: "confirm", title: "Second" });
      openDialog({ type: "drawer", title: "Third" });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs).toHaveLength(3);
      expect(dialogs[0].title).toBe("First");
      expect(dialogs[1].title).toBe("Second");
      expect(dialogs[2].title).toBe("Third");
    });

    it("생성된 ID를 반환함", () => {
      const { openDialog } = useDialogStore.getState();

      const id = openDialog({ type: "modal" });

      expect(id).toBeTruthy();
      expect(typeof id).toBe("string");
    });
  });

  // ========================================
  // closeDialog 테스트
  // ========================================

  describe("closeDialog", () => {
    it("ID로 특정 다이얼로그를 닫음", () => {
      const { openDialog, closeDialog } = useDialogStore.getState();

      openDialog({ type: "modal", id: "dialog-1", title: "First" });
      openDialog({ type: "modal", id: "dialog-2", title: "Second" });
      openDialog({ type: "modal", id: "dialog-3", title: "Third" });

      closeDialog("dialog-2");

      const { dialogs } = useDialogStore.getState();
      expect(dialogs).toHaveLength(2);
      expect(dialogs.find((d) => d.id === "dialog-2")).toBeUndefined();
    });

    it("ID 없이 호출하면 마지막 다이얼로그를 닫음", () => {
      const { openDialog, closeDialog } = useDialogStore.getState();

      openDialog({ type: "modal", id: "dialog-1", title: "First" });
      openDialog({ type: "modal", id: "dialog-2", title: "Second" });

      closeDialog();

      const { dialogs } = useDialogStore.getState();
      expect(dialogs).toHaveLength(1);
      expect(dialogs[0].id).toBe("dialog-1");
    });

    it("닫을 때 onCancel 콜백을 호출함", () => {
      const { openDialog, closeDialog } = useDialogStore.getState();
      const onCancel = vi.fn();

      openDialog({
        type: "confirm",
        id: "dialog-1",
        onCancel,
      });

      closeDialog("dialog-1");

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it("빈 스택에서 closeDialog 호출해도 에러 없음", () => {
      const { closeDialog } = useDialogStore.getState();

      expect(() => closeDialog()).not.toThrow();
    });
  });

  // ========================================
  // closeAll 테스트
  // ========================================

  describe("closeAll", () => {
    it("모든 다이얼로그를 닫음", () => {
      const { openDialog, closeAll } = useDialogStore.getState();

      openDialog({ type: "modal", title: "First" });
      openDialog({ type: "confirm", title: "Second" });
      openDialog({ type: "drawer", title: "Third" });

      closeAll();

      const { dialogs } = useDialogStore.getState();
      expect(dialogs).toHaveLength(0);
    });

    it("모든 다이얼로그의 onCancel을 호출함", () => {
      const { openDialog, closeAll } = useDialogStore.getState();
      const onCancel1 = vi.fn();
      const onCancel2 = vi.fn();

      openDialog({ type: "modal", onCancel: onCancel1 });
      openDialog({ type: "confirm", onCancel: onCancel2 });

      closeAll();

      expect(onCancel1).toHaveBeenCalledTimes(1);
      expect(onCancel2).toHaveBeenCalledTimes(1);
    });
  });

  // ========================================
  // updateDialog 테스트
  // ========================================

  describe("updateDialog", () => {
    it("특정 다이얼로그를 업데이트함", () => {
      const { openDialog, updateDialog } = useDialogStore.getState();

      openDialog({ type: "modal", id: "dialog-1", title: "Original" });

      updateDialog("dialog-1", { title: "Updated" });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs[0].title).toBe("Updated");
    });

    it("다른 다이얼로그에 영향을 주지 않음", () => {
      const { openDialog, updateDialog } = useDialogStore.getState();

      openDialog({ type: "modal", id: "dialog-1", title: "First" });
      openDialog({ type: "modal", id: "dialog-2", title: "Second" });

      updateDialog("dialog-1", { title: "Updated First" });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs[0].title).toBe("Updated First");
      expect(dialogs[1].title).toBe("Second");
    });
  });

  // ========================================
  // 다이얼로그 타입 테스트
  // ========================================

  describe("다이얼로그 타입", () => {
    it("modal 타입 다이얼로그 추가", () => {
      const { openDialog } = useDialogStore.getState();

      openDialog({ type: "modal", title: "Modal" });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs[0].type).toBe("modal");
    });

    it("confirm 타입 다이얼로그 추가", () => {
      const { openDialog } = useDialogStore.getState();

      openDialog({
        type: "confirm",
        title: "Confirm",
        message: "Are you sure?",
        confirmLabel: "Yes",
        cancelLabel: "No",
      });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs[0].type).toBe("confirm");
      expect(dialogs[0].message).toBe("Are you sure?");
    });

    it("drawer 타입 다이얼로그 추가", () => {
      const { openDialog } = useDialogStore.getState();

      openDialog({
        type: "drawer",
        title: "Drawer",
        width: "500px",
        position: "right",
      });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs[0].type).toBe("drawer");
      expect(dialogs[0].width).toBe("500px");
    });

    it("form 타입 다이얼로그 추가", () => {
      const { openDialog } = useDialogStore.getState();
      const onSubmit = vi.fn();

      openDialog({
        type: "form",
        title: "Form Dialog",
        formKey: "userCreate",
        initialValues: { name: "" },
        onSubmit,
      });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs[0].type).toBe("form");
      expect(dialogs[0].formKey).toBe("userCreate");
      expect(dialogs[0].initialValues).toEqual({ name: "" });
    });
  });

  // ========================================
  // Selector Hooks 테스트
  // ========================================

  describe("Selector Hooks", () => {
    it("다이얼로그 개수를 반환함", () => {
      const { openDialog } = useDialogStore.getState();

      expect(useDialogStore.getState().dialogs.length).toBe(0);

      openDialog({ type: "modal" });
      openDialog({ type: "confirm", message: "" });

      expect(useDialogStore.getState().dialogs.length).toBe(2);
    });
  });

  // ========================================
  // 콜백 테스트
  // ========================================

  describe("콜백 처리", () => {
    it("confirm onConfirm 콜백이 설정됨", () => {
      const { openDialog } = useDialogStore.getState();
      const onConfirm = vi.fn();

      openDialog({
        type: "confirm",
        message: "Test",
        onConfirm,
      });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs[0].onConfirm).toBe(onConfirm);
    });

    it("form onSubmit 콜백이 설정됨", () => {
      const { openDialog } = useDialogStore.getState();
      const onSubmit = vi.fn();

      openDialog({
        type: "form",
        onSubmit,
      });

      const { dialogs } = useDialogStore.getState();
      expect(dialogs[0].onSubmit).toBe(onSubmit);
    });
  });
});
