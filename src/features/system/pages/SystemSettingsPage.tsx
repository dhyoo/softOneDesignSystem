/**
 * SoftOne Design System - System Settings Page
 * 작성: SoftOne Frontend Team
 *
 * 이 파일에서는 Role/Grade 기반 PermissionKey를 사용하여
 * 메뉴/페이지/버튼/액션의 표시/비활성화/숨김을 제어합니다.
 *
 * 시스템 설정 페이지입니다.
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Settings,
  Save,
  RotateCcw,
  Globe,
  Bell,
  Shield,
  Database,
  Mail,
} from "lucide-react";

import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Input } from "@core/components/ui/Input";
import { Select } from "@core/components/ui/Select";
import { Checkbox } from "@core/components/ui/Checkbox";
import { FormFieldWrapper } from "@core/components/ui/FormFieldWrapper";
import { Tabs } from "@core/components/ui/Tabs";
import { useToast } from "@core/hooks/useToast";
import { PERMISSION_KEYS } from "@core/auth/role.types";

// ========================================
// Form Schema
// ========================================

const settingsSchema = z.object({
  // 일반 설정
  siteName: z.string().min(1, "사이트 이름을 입력하세요"),
  siteDescription: z.string().optional(),
  defaultLanguage: z.string(),
  timezone: z.string(),

  // 보안 설정
  sessionTimeout: z.number().min(5).max(1440),
  maxLoginAttempts: z.number().min(3).max(10),
  passwordMinLength: z.number().min(6).max(32),
  requireTwoFactor: z.boolean(),

  // 알림 설정
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  pushNotifications: z.boolean(),
  emailFrom: z.string().email().optional().or(z.literal("")),
  smtpHost: z.string().optional(),
  smtpPort: z.number().optional(),

  // 데이터 설정
  dataRetentionDays: z.number().min(30).max(3650),
  enableAuditLog: z.boolean(),
  backupSchedule: z.string(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

// ========================================
// Default Values
// ========================================

const defaultSettings: SettingsFormData = {
  siteName: "SoftOne Admin",
  siteDescription: "Enterprise Admin Dashboard",
  defaultLanguage: "ko",
  timezone: "Asia/Seoul",
  sessionTimeout: 30,
  maxLoginAttempts: 5,
  passwordMinLength: 8,
  requireTwoFactor: false,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  emailFrom: "noreply@softone.co.kr",
  smtpHost: "smtp.softone.co.kr",
  smtpPort: 587,
  dataRetentionDays: 365,
  enableAuditLog: true,
  backupSchedule: "daily",
};

// ========================================
// Component
// ========================================

export const SystemSettingsPage: React.FC = () => {
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultSettings,
  });

  const onSubmit = async (data: SettingsFormData) => {
    setIsSaving(true);
    try {
      // Mock API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Settings saved:", data);
      toast.success("시스템 설정이 저장되었습니다.");
    } catch {
      toast.error("설정 저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    reset(defaultSettings);
    toast.info("설정이 초기화되었습니다.");
  };

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="시스템 설정"
        subtitle="시스템 전체 설정을 관리합니다."
        icon={<Settings className="w-6 h-6 text-softone-primary" />}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!isDirty}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              초기화
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit(onSubmit)}
              loading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
              requiredPermission={PERMISSION_KEYS.ACTION_SYSTEM_SETTINGS_UPDATE}
              minRequiredGrade="TEAM_LEAD"
              showLockIconIfDisabled
            >
              저장
            </Button>
          </div>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="general">
          <Tabs.List className="mb-6">
            <Tabs.Trigger value="general">
              <Globe className="w-4 h-4 mr-2" />
              일반
            </Tabs.Trigger>
            <Tabs.Trigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              보안
            </Tabs.Trigger>
            <Tabs.Trigger value="notifications">
              <Bell className="w-4 h-4 mr-2" />
              알림
            </Tabs.Trigger>
            <Tabs.Trigger value="data">
              <Database className="w-4 h-4 mr-2" />
              데이터
            </Tabs.Trigger>
          </Tabs.List>

          {/* 일반 설정 */}
          <Tabs.Content value="general">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  일반 설정
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormFieldWrapper
                    label="사이트 이름"
                    required
                    errorMessage={errors.siteName?.message}
                  >
                    <Input
                      {...register("siteName")}
                      placeholder="사이트 이름"
                      error={!!errors.siteName}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper label="사이트 설명">
                    <Input
                      {...register("siteDescription")}
                      placeholder="사이트 설명"
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper label="기본 언어">
                    <Select
                      value={watch("defaultLanguage")}
                      onChange={(e) =>
                        setValue("defaultLanguage", e.target.value, {
                          shouldDirty: true,
                        })
                      }
                      options={[
                        { value: "ko", label: "한국어" },
                        { value: "en", label: "English" },
                        { value: "ja", label: "日本語" },
                        { value: "zh", label: "中文" },
                      ]}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper label="시간대">
                    <Select
                      value={watch("timezone")}
                      onChange={(e) =>
                        setValue("timezone", e.target.value, {
                          shouldDirty: true,
                        })
                      }
                      options={[
                        { value: "Asia/Seoul", label: "서울 (UTC+9)" },
                        { value: "Asia/Tokyo", label: "도쿄 (UTC+9)" },
                        { value: "America/New_York", label: "뉴욕 (UTC-5)" },
                        { value: "Europe/London", label: "런던 (UTC+0)" },
                      ]}
                    />
                  </FormFieldWrapper>
                </div>
              </CardBody>
            </Card>
          </Tabs.Content>

          {/* 보안 설정 */}
          <Tabs.Content value="security">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  보안 설정
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormFieldWrapper
                    label="세션 타임아웃 (분)"
                    errorMessage={errors.sessionTimeout?.message}
                  >
                    <Input
                      type="number"
                      {...register("sessionTimeout", { valueAsNumber: true })}
                      min={5}
                      max={1440}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    label="최대 로그인 시도 횟수"
                    errorMessage={errors.maxLoginAttempts?.message}
                  >
                    <Input
                      type="number"
                      {...register("maxLoginAttempts", { valueAsNumber: true })}
                      min={3}
                      max={10}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper
                    label="비밀번호 최소 길이"
                    errorMessage={errors.passwordMinLength?.message}
                  >
                    <Input
                      type="number"
                      {...register("passwordMinLength", {
                        valueAsNumber: true,
                      })}
                      min={6}
                      max={32}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper label="2단계 인증 필수">
                    <div className="pt-2">
                      <Checkbox
                        {...register("requireTwoFactor")}
                        label="2단계 인증 필수화"
                      />
                    </div>
                  </FormFieldWrapper>
                </div>
              </CardBody>
            </Card>
          </Tabs.Content>

          {/* 알림 설정 */}
          <Tabs.Content value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  알림 설정
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="space-y-3">
                  <Checkbox
                    {...register("emailNotifications")}
                    label="이메일 알림 사용"
                  />
                  <Checkbox
                    {...register("smsNotifications")}
                    label="SMS 알림 사용"
                  />
                  <Checkbox
                    {...register("pushNotifications")}
                    label="푸시 알림 사용"
                  />
                </div>

                <div className="pt-4 border-t border-softone-border">
                  <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    SMTP 설정
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <FormFieldWrapper label="발신 이메일">
                      <Input
                        {...register("emailFrom")}
                        type="email"
                        placeholder="noreply@example.com"
                      />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="SMTP 호스트">
                      <Input
                        {...register("smtpHost")}
                        placeholder="smtp.example.com"
                      />
                    </FormFieldWrapper>

                    <FormFieldWrapper label="SMTP 포트">
                      <Input
                        type="number"
                        {...register("smtpPort", { valueAsNumber: true })}
                        placeholder="587"
                      />
                    </FormFieldWrapper>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Tabs.Content>

          {/* 데이터 설정 */}
          <Tabs.Content value="data">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  데이터 설정
                </CardTitle>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormFieldWrapper
                    label="데이터 보관 기간 (일)"
                    errorMessage={errors.dataRetentionDays?.message}
                  >
                    <Input
                      type="number"
                      {...register("dataRetentionDays", {
                        valueAsNumber: true,
                      })}
                      min={30}
                      max={3650}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper label="백업 스케줄">
                    <Select
                      value={watch("backupSchedule")}
                      onChange={(e) =>
                        setValue("backupSchedule", e.target.value, {
                          shouldDirty: true,
                        })
                      }
                      options={[
                        { value: "hourly", label: "매시간" },
                        { value: "daily", label: "매일" },
                        { value: "weekly", label: "매주" },
                        { value: "monthly", label: "매월" },
                      ]}
                    />
                  </FormFieldWrapper>

                  <FormFieldWrapper label="감사 로그">
                    <div className="pt-2">
                      <Checkbox
                        {...register("enableAuditLog")}
                        label="감사 로그 활성화"
                      />
                    </div>
                  </FormFieldWrapper>
                </div>
              </CardBody>
            </Card>
          </Tabs.Content>
        </Tabs>
      </form>
    </div>
  );
};

SystemSettingsPage.displayName = "SystemSettingsPage";

export default SystemSettingsPage;
