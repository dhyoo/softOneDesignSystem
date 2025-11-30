/**
 * SoftOne Design System - DialogRoot Component (Step 10)
 * 작성: SoftOne Frontend Team
 *
 * [목적]
 * - 전역 DialogContainer 역할
 * - dialogStore.dialogs 배열을 순회하며 각각을 적절한 타입의 Dialog로 렌더링
 * - App.tsx 또는 MainLayout 내부에서 한 번만 렌더링
 *
 * [A11y 고려]
 * - 각 다이얼로그 타입에 맞는 컴포넌트가 접근성 처리
 * - 다중 다이얼로그 시 z-index 스택 관리
 *
 * [사용법]
 * // MainLayout.tsx 또는 App.tsx에서
 * <DialogRoot />
 *
 * // 커스텀 폼 렌더러 등록 (선택)
 * <DialogRoot
 *   formRenderers={{
 *     userCreate: UserCreateForm,
 *     userEdit: UserEditForm,
 *   }}
 * />
 */

import React, { useMemo } from "react";
import {
  useDialogStore,
  type DialogOptions,
  type DialogType,
} from "../../store/dialogStore";
import { BaseModal } from "./BaseModal";
import { ConfirmDialog } from "./ConfirmDialog";
import { Drawer } from "./Drawer";
import { FormDialog } from "./FormDialog";

// ========================================
// Types
// ========================================

export interface FormRendererProps {
  dialog: DialogOptions;
  onClose: () => void;
}

export type FormRenderer = React.FC<FormRendererProps>;

export interface DialogRootProps {
  /**
   * formKey에 따른 커스텀 폼 렌더러 맵
   * @example
   * formRenderers={{
   *   userCreate: ({ dialog, onClose }) => <UserCreateForm onClose={onClose} />,
   *   userEdit: ({ dialog, onClose }) => <UserEditForm user={dialog.payload} onClose={onClose} />,
   * }}
   */
  formRenderers?: Record<string, FormRenderer>;
}

// ========================================
// Individual Dialog Renderers
// ========================================

interface DialogItemProps {
  dialog: DialogOptions;
  onClose: () => void;
  formRenderers?: Record<string, FormRenderer>;
}

const ModalDialogItem: React.FC<DialogItemProps> = ({ dialog, onClose }) => {
  return (
    <BaseModal
      isOpen={true}
      onClose={onClose}
      title={dialog.title}
      size={dialog.size}
      closeOnOverlayClick={dialog.closeOnOverlayClick}
      closeOnEscape={dialog.closeOnEscape}
      hideCloseButton={!dialog.showCloseButton}
      dialogId={dialog.id}
    >
      {dialog.content}
    </BaseModal>
  );
};

const ConfirmDialogItem: React.FC<DialogItemProps> = ({ dialog, onClose }) => {
  const handleConfirm = async () => {
    if (dialog.onConfirm) {
      await dialog.onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    dialog.onCancel?.();
    onClose();
  };

  return (
    <ConfirmDialog
      isOpen={true}
      onClose={handleCancel}
      title={dialog.title}
      message={dialog.message ?? ""}
      confirmLabel={dialog.confirmLabel}
      cancelLabel={dialog.cancelLabel}
      variant={dialog.variant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
};

const DrawerDialogItem: React.FC<DialogItemProps> = ({ dialog, onClose }) => {
  return (
    <Drawer
      isOpen={true}
      onClose={onClose}
      title={dialog.title}
      width={dialog.width}
      position={dialog.position}
      closeOnOverlayClick={dialog.closeOnOverlayClick}
      closeOnEscape={dialog.closeOnEscape}
      hideCloseButton={!dialog.showCloseButton}
      drawerId={dialog.id}
    >
      {dialog.content}
    </Drawer>
  );
};

const FormDialogItem: React.FC<DialogItemProps> = ({
  dialog,
  onClose,
  formRenderers,
}) => {
  // formKey가 있고 해당 렌더러가 있으면 커스텀 렌더러 사용
  if (dialog.formKey && formRenderers?.[dialog.formKey]) {
    const CustomFormRenderer = formRenderers[dialog.formKey];
    return <CustomFormRenderer dialog={dialog} onClose={onClose} />;
  }

  // 기본 FormDialog 렌더링
  const handleSubmit = async (values: Record<string, unknown>) => {
    if (dialog.onSubmit) {
      await dialog.onSubmit(values);
    }
    onClose();
  };

  const handleCancel = () => {
    dialog.onCancel?.();
    onClose();
  };

  return (
    <FormDialog
      isOpen={true}
      onClose={handleCancel}
      title={dialog.title}
      size={dialog.size}
      defaultValues={dialog.initialValues}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    >
      {() => (
        <div className="text-softone-text-secondary text-center py-8">
          <p>폼 내용이 정의되지 않았습니다.</p>
          <p className="text-sm mt-2">
            formRenderers 또는 content props를 사용하세요.
          </p>
        </div>
      )}
    </FormDialog>
  );
};

// ========================================
// Dialog Type Renderer Map
// ========================================

const dialogRenderers: Record<DialogType, React.FC<DialogItemProps>> = {
  modal: ModalDialogItem,
  confirm: ConfirmDialogItem,
  drawer: DrawerDialogItem,
  form: FormDialogItem,
};

// ========================================
// DialogRoot Component
// ========================================

export const DialogRoot: React.FC<DialogRootProps> = ({ formRenderers }) => {
  const dialogs = useDialogStore((state) => state.dialogs);
  const closeDialog = useDialogStore((state) => state.closeDialog);

  // 다이얼로그 렌더링
  const renderedDialogs = useMemo(() => {
    return dialogs.map((dialog) => {
      const DialogRenderer = dialogRenderers[dialog.type];

      if (!DialogRenderer) {
        console.warn(`[DialogRoot] Unknown dialog type: ${dialog.type}`);
        return null;
      }

      const handleClose = () => {
        closeDialog(dialog.id);
      };

      return (
        <DialogRenderer
          key={dialog.id}
          dialog={dialog}
          onClose={handleClose}
          formRenderers={formRenderers}
        />
      );
    });
  }, [dialogs, closeDialog, formRenderers]);

  // 다이얼로그가 없으면 아무것도 렌더링하지 않음
  if (dialogs.length === 0) {
    return null;
  }

  return <>{renderedDialogs}</>;
};

DialogRoot.displayName = "DialogRoot";

export default DialogRoot;
