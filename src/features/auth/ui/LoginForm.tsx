/**
 * SoftOne Design System(SDS) - Login Form
 * 작성: SoftOne Frontend Team
 *
 * 이 파일에서는 Role/Grade 기반 PermissionKey를 사용하여
 * 메뉴/페이지/버튼/액션의 표시/비활성화/숨김을 제어합니다.
 *
 * 로그인 폼 컴포넌트.
 * React Hook Form + Zod 유효성 검사를 사용하고,
 * SDS UI Kit 컴포넌트만 사용합니다.
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "react-router-dom";
import { LogIn, Eye, EyeOff, AlertCircle } from "lucide-react";

import { Button } from "@core/components/ui/Button";
import { Input } from "@core/components/ui/Input";
import { FormField } from "@core/components/ui/Label";
import { Checkbox } from "@core/components/ui/Checkbox";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
} from "@core/components/ui/Card";
import { Badge } from "@core/components/ui/Badge";
import { useNavigation } from "@core/router/NavigationContext";
import { useAuth } from "@core/hooks/useAuth";
import {
  login as loginApi,
  getTestAccounts,
  type AuthError,
} from "../api/authApi";

// ========================================
// Form Schema
// ========================================

const loginSchema = z.object({
  username: z.string().min(1, "아이디를 입력하세요"),
  password: z.string().min(1, "비밀번호를 입력하세요"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ========================================
// Login Form Component
// ========================================

export const LoginForm: React.FC = () => {
  const navigation = useNavigation();
  const location = useLocation();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTestAccounts, setShowTestAccounts] = useState(false);

  // 로그인 전 페이지 경로 (ProtectedRoute에서 전달)
  const from = (location.state as { from?: string })?.from || "/dashboard";

  // 테스트 계정 목록
  const testAccounts = getTestAccounts();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // API 호출
      const response = await loginApi({
        username: data.username,
        password: data.password,
      });

      // authStore에 로그인 정보 저장 (role, grade 포함)
      login({
        user: response.user,
        accessToken: response.accessToken,
        role: response.role,
        grade: response.grade,
      });

      // 원래 가려던 페이지 또는 대시보드로 이동
      navigation.push(from);
    } catch (err) {
      const authError = err as AuthError;
      setError(authError.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 테스트 계정 빠른 입력
  const fillTestAccount = (username: string, password: string) => {
    setValue("username", username);
    setValue("password", password);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">로그인</CardTitle>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-softone-danger-light text-softone-danger rounded-lg text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Username Field */}
          <FormField
            label="아이디"
            htmlFor="username"
            required
            error={errors.username?.message}
          >
            <Input
              id="username"
              placeholder="아이디를 입력하세요"
              error={!!errors.username}
              fullWidth
              disabled={isLoading}
              {...register("username")}
            />
          </FormField>

          {/* Password Field */}
          <FormField
            label="비밀번호"
            htmlFor="password"
            required
            error={errors.password?.message}
          >
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
              error={!!errors.password}
              fullWidth
              disabled={isLoading}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-softone-text-muted hover:text-softone-text transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              {...register("password")}
            />
          </FormField>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <Checkbox
              id="rememberMe"
              label="로그인 상태 유지"
              disabled={isLoading}
              {...register("rememberMe")}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isLoading}
            leftIcon={!isLoading ? <LogIn className="w-4 h-4" /> : undefined}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>

          {/* Test Accounts Section */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowTestAccounts(!showTestAccounts)}
              className="w-full text-center text-xs text-softone-primary hover:text-softone-primary-hover transition-colors"
            >
              {showTestAccounts ? "테스트 계정 숨기기 ▲" : "테스트 계정 보기 ▼"}
            </button>

            {showTestAccounts && (
              <div className="mt-3 p-3 bg-softone-bg rounded-lg">
                <p className="text-xs text-softone-text-muted text-center mb-3">
                  클릭하면 자동 입력됩니다
                </p>
                <div className="space-y-2">
                  {testAccounts.map((account) => (
                    <button
                      key={account.username}
                      type="button"
                      onClick={() =>
                        fillTestAccount(account.username, account.password)
                      }
                      className="w-full flex items-center justify-between p-2 bg-white rounded-lg hover:bg-softone-surface-hover transition-colors text-left"
                    >
                      <div>
                        <div className="text-sm font-medium text-softone-text">
                          {account.description}
                        </div>
                        <div className="text-xs text-softone-text-muted">
                          {account.username} / {account.password}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="primary" size="sm">
                          {account.role}
                        </Badge>
                        <Badge variant="info" size="sm">
                          {account.grade}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

LoginForm.displayName = "LoginForm";
