/**
 * SoftOne Design System - UI Components Module
 * Core UI Component exports
 *
 * Step 4: 리스트 화면 표준화 - Select, Pagination, DataTable
 * Step 5: 고급 UI - Modal, StatCard, CalendarWrapper, FileUpload
 * Step 6: 콘텐츠 에디터 - RichTextEditor, RichTextViewer
 * Step 7: 고급 공통 - CheckboxGroup, FormFieldWrapper, TreeView, Tabs, Accordion, Toast
 */

// Button
export {
  Button,
  type ButtonProps,
  type ButtonVariant,
  type ButtonSize,
} from "./Button";

// Badge
export {
  Badge,
  EnumBadge,
  type BadgeProps,
  type BadgeVariant,
  type EnumBadgeProps,
} from "./Badge";

// Card
export {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
  type CardProps,
  type CardHeaderProps,
  type CardTitleProps,
  type CardBodyProps,
  type CardFooterProps,
} from "./Card";

// Input
export { Input, type InputProps, type InputSize } from "./Input";

// Label
export { Label, FormField, type LabelProps, type FormFieldProps } from "./Label";

// Checkbox
export { Checkbox, type CheckboxProps, type CheckboxSize } from "./Checkbox";

// CheckboxGroup (Step 7)
export {
  CheckboxGroup,
  type CheckboxGroupProps,
  type CheckboxOption,
} from "./CheckboxGroup";

// Select
export { Select, type SelectProps, type SelectOption, type SelectSize } from "./Select";

// Pagination
export {
  Pagination,
  PaginationInfo,
  type PaginationProps,
  type PaginationInfoProps,
} from "./Pagination";

// DataTable
export {
  DataTable,
  type DataTableProps,
  type DataTableColumn,
} from "./DataTable";

// Modal (Legacy - use BaseModal for new code)
export { Modal, type ModalProps, type ModalSize } from "./Modal";

// Dialog System (Step 10)
export { BaseModal, type BaseModalProps, type ModalRole } from "./BaseModal";
export { ConfirmDialog, type ConfirmDialogProps } from "./ConfirmDialog";
export { Drawer, type DrawerProps, type DrawerPosition } from "./Drawer";
export {
  FormDialog,
  type FormDialogProps,
  type FormFieldConfig,
  type FormFieldType,
  type FormDialogRenderProps,
} from "./FormDialog";
export { DialogRoot, type DialogRootProps, type FormRendererProps } from "./DialogRoot";

// StatCard
export {
  StatCard,
  type StatCardProps,
  type StatCardVariant,
  type StatCardTrend,
} from "./StatCard";

// CalendarWrapper
export {
  CalendarWrapper,
  type CalendarWrapperProps,
  type ScheduleEvent,
} from "./CalendarWrapper";

// FileUpload
export {
  FileUpload,
  type FileUploadProps,
  type SelectedFile,
} from "./FileUpload";

// RichTextEditor (Step 6)
export {
  RichTextEditor,
  RichTextEditorToolbar,
  type RichTextEditorProps,
} from "./RichTextEditor";

export {
  type RichTextEditorToolbarProps,
  type ToolbarButtonConfig,
} from "./RichTextEditorToolbar";

// RichTextViewer (Step 6)
export { RichTextViewer, type RichTextViewerProps } from "./RichTextViewer";

// FormFieldWrapper (Step 7)
export { FormFieldWrapper, type FormFieldWrapperProps } from "./FormFieldWrapper";

// TreeView (Step 7)
export { TreeView, type TreeNode, type TreeViewProps } from "./TreeView";
export type { CheckState, CheckStateMap } from "./tree.types";

// Tabs (Step 7)
export {
  Tabs,
  type TabsProps,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
} from "./Tabs";

// Accordion (Step 7)
export {
  Accordion,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
} from "./Accordion";

// ToastContainer (Step 7)
export { ToastContainer, type ToastContainerProps } from "./ToastContainer";

// JsonViewer (Step 8)
export { JsonViewer, type JsonViewerProps } from "./JsonViewer";

// Tooltip
export {
  Tooltip,
  type TooltipProps,
  type TooltipPosition,
  type TooltipAlign,
} from "./Tooltip";
