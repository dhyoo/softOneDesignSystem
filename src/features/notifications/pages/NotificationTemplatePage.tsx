/**
 * SoftOne Design System - Notification Template Page
 * 작성: SoftOne Frontend Team
 *
 * 이 파일에서는 Role/Grade 기반 PermissionKey를 사용하여
 * 메뉴/페이지/버튼/액션의 표시/비활성화/숨김을 제어합니다.
 *
 * 알림 템플릿 관리 페이지입니다.
 */

import React, { useState, useMemo } from "react";
import {
  Bell,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Mail,
  MessageSquare,
  Smartphone,
  Search,
} from "lucide-react";

import { PageHeader } from "@core/components/layout/PageHeader";
import { Card, CardBody } from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { Input } from "@core/components/ui/Input";
import { Select } from "@core/components/ui/Select";
import { DataTable, DataTableColumn } from "@core/components/ui/DataTable";
import { BaseModal } from "@core/components/ui/BaseModal";
import { ConfirmDialog } from "@core/components/ui/ConfirmDialog";
import { useToast } from "@core/hooks/useToast";
import { PERMISSION_KEYS } from "@core/auth/role.types";

// ========================================
// Types
// ========================================

type NotificationType = "email" | "sms" | "push";
type TemplateStatus = "active" | "draft" | "archived";

interface NotificationTemplate {
  id: string;
  name: string;
  type: NotificationType;
  subject: string;
  content: string;
  status: TemplateStatus;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

// ========================================
// Mock Data
// ========================================

const MOCK_TEMPLATES: NotificationTemplate[] = [
  {
    id: "1",
    name: "가입 환영 이메일",
    type: "email",
    subject: "{{userName}}님, SoftOne에 오신 것을 환영합니다!",
    content:
      "안녕하세요 {{userName}}님,\n\nSoftOne에 가입해 주셔서 감사합니다...",
    status: "active",
    variables: ["userName", "email", "signupDate"],
    createdAt: "2024-01-15",
    updatedAt: "2024-03-10",
  },
  {
    id: "2",
    name: "비밀번호 재설정",
    type: "email",
    subject: "비밀번호 재설정 안내",
    content:
      "비밀번호 재설정 링크: {{resetLink}}\n\n이 링크는 24시간 후 만료됩니다.",
    status: "active",
    variables: ["userName", "resetLink", "expiryTime"],
    createdAt: "2024-01-20",
    updatedAt: "2024-02-28",
  },
  {
    id: "3",
    name: "주문 완료 알림",
    type: "sms",
    subject: "",
    content:
      "[SoftOne] {{userName}}님, 주문이 완료되었습니다. 주문번호: {{orderNumber}}",
    status: "active",
    variables: ["userName", "orderNumber"],
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
  },
  {
    id: "4",
    name: "신규 메시지 푸시",
    type: "push",
    subject: "새 메시지가 도착했습니다",
    content: "{{senderName}}님이 메시지를 보냈습니다.",
    status: "active",
    variables: ["senderName", "messagePreview"],
    createdAt: "2024-02-15",
    updatedAt: "2024-02-15",
  },
  {
    id: "5",
    name: "이벤트 초대 이메일",
    type: "email",
    subject: "{{eventName}} 이벤트에 초대합니다",
    content:
      "안녕하세요,\n\n{{eventName}} 이벤트에 초대합니다.\n일시: {{eventDate}}",
    status: "draft",
    variables: ["userName", "eventName", "eventDate", "eventLocation"],
    createdAt: "2024-03-01",
    updatedAt: "2024-03-05",
  },
];

// ========================================
// Helper Components
// ========================================

const TypeIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
  const icons: Record<NotificationType, React.ReactNode> = {
    email: <Mail className="w-4 h-4" />,
    sms: <MessageSquare className="w-4 h-4" />,
    push: <Smartphone className="w-4 h-4" />,
  };
  return <>{icons[type]}</>;
};

const TypeBadge: React.FC<{ type: NotificationType }> = ({ type }) => {
  const variants: Record<NotificationType, "primary" | "info" | "success"> = {
    email: "primary",
    sms: "info",
    push: "success",
  };
  const labels: Record<NotificationType, string> = {
    email: "이메일",
    sms: "SMS",
    push: "푸시",
  };
  return (
    <Badge variant={variants[type]} size="sm">
      <TypeIcon type={type} />
      <span className="ml-1">{labels[type]}</span>
    </Badge>
  );
};

const StatusBadge: React.FC<{ status: TemplateStatus }> = ({ status }) => {
  const variants: Record<TemplateStatus, "success" | "warning" | "neutral"> = {
    active: "success",
    draft: "warning",
    archived: "neutral",
  };
  const labels: Record<TemplateStatus, string> = {
    active: "활성",
    draft: "초안",
    archived: "보관",
  };
  return (
    <Badge variant={variants[status]} size="sm">
      {labels[status]}
    </Badge>
  );
};

// ========================================
// Component
// ========================================

export const NotificationTemplatePage: React.FC = () => {
  const toast = useToast();
  const [templates, setTemplates] = useState(MOCK_TEMPLATES);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] =
    useState<NotificationTemplate | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 필터링
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        !searchQuery ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !typeFilter || template.type === typeFilter;
      const matchesStatus = !statusFilter || template.status === statusFilter;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [templates, searchQuery, typeFilter, statusFilter]);

  // 테이블 컬럼
  const columns: DataTableColumn<NotificationTemplate>[] = [
    {
      key: "name",
      header: "템플릿 이름",
      render: (row) => <div className="font-medium">{row.name}</div>,
    },
    {
      key: "type",
      header: "유형",
      render: (row) => <TypeBadge type={row.type} />,
    },
    {
      key: "status",
      header: "상태",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "variables",
      header: "변수",
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.variables.slice(0, 3).map((v: string) => (
            <code
              key={v}
              className="text-xs bg-softone-bg px-1.5 py-0.5 rounded"
            >
              {`{{${v}}}`}
            </code>
          ))}
          {row.variables.length > 3 && (
            <span className="text-xs text-softone-text-muted">
              +{row.variables.length - 3}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "updatedAt",
      header: "수정일",
      render: (row) => (
        <span className="text-softone-text-muted">{row.updatedAt}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTemplate(row);
              setIsPreviewOpen(true);
            }}
            leftIcon={<Eye className="w-4 h-4" />}
          >
            미리보기
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Edit className="w-4 h-4" />}
            requiredPermission={
              PERMISSION_KEYS.ACTION_NOTIFICATIONS_TEMPLATE_UPDATE
            }
          >
            수정
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Copy className="w-4 h-4" />}
            onClick={() => {
              toast.success("템플릿이 복제되었습니다.");
            }}
            requiredPermission={
              PERMISSION_KEYS.ACTION_NOTIFICATIONS_TEMPLATE_CREATE
            }
          >
            복제
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600"
            onClick={() => {
              setSelectedTemplate(row);
              setIsDeleteOpen(true);
            }}
            leftIcon={<Trash2 className="w-4 h-4" />}
            requiredPermission={
              PERMISSION_KEYS.ACTION_NOTIFICATIONS_TEMPLATE_DELETE
            }
            hideIfNoPermission
          />
        </div>
      ),
    },
  ];

  // 삭제 처리
  const handleDelete = () => {
    if (selectedTemplate) {
      setTemplates((prev) => prev.filter((t) => t.id !== selectedTemplate.id));
      toast.success("템플릿이 삭제되었습니다.");
      setIsDeleteOpen(false);
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="알림 템플릿"
        subtitle="이메일, SMS, 푸시 알림 템플릿을 관리합니다."
        icon={<Bell className="w-6 h-6 text-softone-primary" />}
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus className="w-4 h-4" />}
            requiredPermission={
              PERMISSION_KEYS.ACTION_NOTIFICATIONS_TEMPLATE_CREATE
            }
          >
            새 템플릿
          </Button>
        }
      />

      {/* 필터 영역 */}
      <Card>
        <CardBody className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                placeholder="템플릿 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftElement={<Search className="w-4 h-4" />}
              />
            </div>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: "", label: "모든 유형" },
                { value: "email", label: "이메일" },
                { value: "sms", label: "SMS" },
                { value: "push", label: "푸시" },
              ]}
            />
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: "", label: "모든 상태" },
                { value: "active", label: "활성" },
                { value: "draft", label: "초안" },
                { value: "archived", label: "보관" },
              ]}
            />
          </div>
        </CardBody>
      </Card>

      {/* 템플릿 테이블 */}
      <Card>
        <CardBody className="p-0">
          <DataTable
            data={filteredTemplates}
            columns={columns}
            rowKey={(row) => row.id}
          />
        </CardBody>
      </Card>

      {/* 미리보기 모달 */}
      <BaseModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="템플릿 미리보기"
        size="lg"
      >
        {selectedTemplate && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <TypeBadge type={selectedTemplate.type} />
              <StatusBadge status={selectedTemplate.status} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
            </div>
            {selectedTemplate.subject && (
              <div>
                <div className="text-xs text-softone-text-muted mb-1">제목</div>
                <div className="p-3 bg-softone-bg rounded-lg">
                  {selectedTemplate.subject}
                </div>
              </div>
            )}
            <div>
              <div className="text-xs text-softone-text-muted mb-1">내용</div>
              <div className="p-3 bg-softone-bg rounded-lg whitespace-pre-wrap">
                {selectedTemplate.content}
              </div>
            </div>
            <div>
              <div className="text-xs text-softone-text-muted mb-1">
                사용 가능한 변수
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTemplate.variables.map((v) => (
                  <code
                    key={v}
                    className="px-2 py-1 bg-softone-primary-light text-softone-primary rounded text-sm"
                  >
                    {`{{${v}}}`}
                  </code>
                ))}
              </div>
            </div>
          </div>
        )}
      </BaseModal>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="템플릿 삭제"
        message={`"${selectedTemplate?.name}" 템플릿을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        variant="danger"
      />
    </div>
  );
};

NotificationTemplatePage.displayName = "NotificationTemplatePage";

export default NotificationTemplatePage;
