/**
 * SoftOne Design System - Global State Management Demo Page
 * 작성: SoftOne Frontend Team
 *
 * Zustand 전역 상태 관리 데모:
 *   - 장바구니 (Cart) - persist 미들웨어 (로컬스토리지 저장)
 *   - UI 설정 (Preferences) - persist 미들웨어
 *   - 알림 (Notifications) - immer 미들웨어
 *   - 다중 Store 연동 패턴
 *   - devtools 연동
 */

import React, { useCallback } from "react";
import { PageHeader } from "@core/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
} from "@core/components/ui/Card";
import { Button } from "@core/components/ui/Button";
import { Badge } from "@core/components/ui/Badge";
import { Input } from "@core/components/ui/Input";
import { Select } from "@core/components/ui/Select";
import { Checkbox } from "@core/components/ui/Checkbox";
import { useToast } from "@core/hooks/useToast";
import { formatCellCurrency } from "@core/utils/gridUtils";
import {
  Database,
  ShoppingCart,
  Settings,
  Bell,
  Plus,
  Minus,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Check,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

import {
  useCartStore,
  usePreferencesStore,
  useNotificationsStore,
  mockDemoProducts,
  type Notification,
} from "../store/globalStateDemoStore";

// ========================================
// GlobalStateDemoPage Component
// ========================================

export const GlobalStateDemoPage: React.FC = () => {
  const toast = useToast();

  // Cart Store
  const cartStore = useCartStore();
  const {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = cartStore;

  // Preferences Store
  const preferencesStore = usePreferencesStore();
  const {
    preferences,
    setTheme,
    setGridDensity,
    setLanguage,
    setTablePageSize,
    setShowNotifications,
    toggleSidebar,
    resetPreferences,
  } = preferencesStore;

  // Notifications Store
  const notificationsStore = useNotificationsStore();
  const {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAllNotifications,
    getUnreadCount,
  } = notificationsStore;

  // ========================================
  // 핸들러
  // ========================================

  const handleAddToCart = useCallback(
    (product: (typeof mockDemoProducts)[0]) => {
      addItem(product);
      addNotification({
        type: "success",
        title: "장바구니 추가",
        message: `${product.name}이(가) 장바구니에 추가되었습니다.`,
      });
      toast.success(`${product.name} 추가됨`);
    },
    [addItem, addNotification, toast]
  );

  const handleRemoveFromCart = useCallback(
    (itemId: string, itemName: string) => {
      removeItem(itemId);
      addNotification({
        type: "info",
        title: "장바구니에서 제거",
        message: `${itemName}이(가) 장바구니에서 제거되었습니다.`,
      });
    },
    [removeItem, addNotification]
  );

  const handleClearCart = useCallback(() => {
    const count = getTotalItems();
    clearCart();
    addNotification({
      type: "warning",
      title: "장바구니 비우기",
      message: `${count}개 상품이 장바구니에서 제거되었습니다.`,
    });
    toast.warning("장바구니가 비워졌습니다.");
  }, [clearCart, getTotalItems, addNotification, toast]);

  const handleThemeChange = useCallback(
    (theme: "light" | "dark" | "system") => {
      setTheme(theme);
      addNotification({
        type: "info",
        title: "테마 변경",
        message: `테마가 "${theme}"으로 변경되었습니다.`,
      });
    },
    [setTheme, addNotification]
  );

  const handleAddTestNotification = useCallback(
    (type: Notification["type"]) => {
      const messages: Record<Notification["type"], { title: string; message: string }> = {
        info: { title: "정보 알림", message: "시스템 정보 메시지입니다." },
        success: { title: "성공 알림", message: "작업이 성공적으로 완료되었습니다." },
        warning: { title: "경고 알림", message: "주의가 필요한 상황입니다." },
        error: { title: "오류 알림", message: "오류가 발생했습니다. 확인해주세요." },
      };
      addNotification({ type, ...messages[type] });
    },
    [addNotification]
  );

  // ========================================
  // 알림 아이콘
  // ========================================
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 sds-animate-fade-in">
      <PageHeader
        title="전역 상태 관리 데모"
        subtitle="Zustand를 활용한 다중 Store 패턴과 persist/immer 미들웨어 사용 예제입니다."
        icon={<Database className="w-5 h-5 text-softone-primary" />}
      />

      {/* Store 상태 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-blue-600">장바구니</div>
              <div className="text-2xl font-bold text-blue-800">
                {getTotalItems()}개
              </div>
              <div className="text-sm text-blue-600">
                {formatCellCurrency(getTotalPrice())}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-purple-600">UI 설정</div>
              <div className="text-lg font-bold text-purple-800">
                {preferences.theme === "dark" ? "다크 모드" : 
                 preferences.theme === "light" ? "라이트 모드" : "시스템"}
              </div>
              <div className="text-sm text-purple-600">
                {preferences.language.toUpperCase()} | {preferences.gridDensity}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
          <CardBody className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center relative">
              <Bell className="w-6 h-6 text-white" />
              {getUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {getUnreadCount()}
                </span>
              )}
            </div>
            <div>
              <div className="text-sm text-amber-600">알림</div>
              <div className="text-2xl font-bold text-amber-800">
                {notifications.length}개
              </div>
              <div className="text-sm text-amber-600">
                읽지 않음: {getUnreadCount()}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 장바구니 Store */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-blue-500" />
              장바구니 Store
              <Badge variant="info" size="sm">
                persist + immer
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* 상품 목록 */}
            <div>
              <div className="text-sm font-medium mb-2">상품 추가</div>
              <div className="grid grid-cols-2 gap-2">
                {mockDemoProducts.map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    className="justify-start"
                  >
                    <span className="mr-2">{product.imageUrl}</span>
                    <span className="truncate">{product.name}</span>
                    <span className="ml-auto text-xs text-softone-text-muted">
                      {formatCellCurrency(product.price)}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            {/* 장바구니 내용 */}
            <div>
              <div className="text-sm font-medium mb-2">장바구니 내용</div>
              {cartItems.length === 0 ? (
                <div className="text-center py-4 text-softone-text-muted">
                  장바구니가 비어있습니다.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                    >
                      <span>{item.imageUrl}</span>
                      <span className="flex-1 text-sm truncate">{item.name}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-6 h-6 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-6 h-6 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <span className="text-sm font-medium w-20 text-right">
                        {formatCellCurrency(item.price * item.quantity)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFromCart(item.id, item.name)}
                        className="w-6 h-6 p-0 text-red-500"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardBody>
          <CardFooter className="flex justify-between items-center border-t">
            <div>
              <span className="text-sm text-softone-text-muted">총액:</span>
              <span className="ml-2 text-lg font-bold">
                {formatCellCurrency(getTotalPrice())}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCart}
              disabled={cartItems.length === 0}
            >
              장바구니 비우기
            </Button>
          </CardFooter>
        </Card>

        {/* UI 설정 Store */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-500" />
              UI 설정 Store
              <Badge variant="info" size="sm">
                persist
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* 테마 */}
            <div>
              <div className="text-sm font-medium mb-2">테마</div>
              <div className="flex gap-2">
                <Button
                  variant={preferences.theme === "light" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("light")}
                  leftIcon={<Sun className="w-4 h-4" />}
                >
                  라이트
                </Button>
                <Button
                  variant={preferences.theme === "dark" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("dark")}
                  leftIcon={<Moon className="w-4 h-4" />}
                >
                  다크
                </Button>
                <Button
                  variant={preferences.theme === "system" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => handleThemeChange("system")}
                  leftIcon={<Monitor className="w-4 h-4" />}
                >
                  시스템
                </Button>
              </div>
            </div>

            {/* 그리드 밀도 */}
            <div>
              <div className="text-sm font-medium mb-2">그리드 밀도</div>
              <Select
                value={preferences.gridDensity}
                onChange={(e) =>
                  setGridDensity(
                    e.target.value as "compact" | "normal" | "comfortable"
                  )
                }
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="comfortable">Comfortable</option>
              </Select>
            </div>

            {/* 언어 */}
            <div>
              <div className="text-sm font-medium mb-2">언어</div>
              <Select
                value={preferences.language}
                onChange={(e) =>
                  setLanguage(e.target.value as "ko" | "en" | "ja")
                }
              >
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="ja">日本語</option>
              </Select>
            </div>

            {/* 페이지 사이즈 */}
            <div>
              <div className="text-sm font-medium mb-2">테이블 페이지 사이즈</div>
              <Select
                value={String(preferences.tablePageSize)}
                onChange={(e) => setTablePageSize(Number(e.target.value))}
              >
                <option value="10">10개</option>
                <option value="20">20개</option>
                <option value="50">50개</option>
                <option value="100">100개</option>
              </Select>
            </div>

            {/* 알림 표시 */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="showNotifications"
                checked={preferences.showNotifications}
                onChange={(e) => setShowNotifications(e.target.checked)}
              />
              <label htmlFor="showNotifications" className="text-sm">
                알림 표시
              </label>
            </div>

            {/* 사이드바 토글 */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="sidebarCollapsed"
                checked={preferences.sidebarCollapsed}
                onChange={() => toggleSidebar()}
              />
              <label htmlFor="sidebarCollapsed" className="text-sm">
                사이드바 접기
              </label>
            </div>
          </CardBody>
          <CardFooter className="border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={resetPreferences}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              설정 초기화
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* 알림 Store */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              알림 Store
              <Badge variant="info" size="sm">
                immer
              </Badge>
              {getUnreadCount() > 0 && (
                <Badge variant="danger" size="sm">
                  {getUnreadCount()} 읽지 않음
                </Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                leftIcon={<Check className="w-4 h-4" />}
              >
                모두 읽음
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllNotifications}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                모두 삭제
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {/* 테스트 알림 추가 */}
          <div className="mb-4">
            <div className="text-sm font-medium mb-2">테스트 알림 추가</div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddTestNotification("info")}
                leftIcon={<Info className="w-4 h-4 text-blue-500" />}
              >
                Info
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddTestNotification("success")}
                leftIcon={<CheckCircle className="w-4 h-4 text-green-500" />}
              >
                Success
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddTestNotification("warning")}
                leftIcon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
              >
                Warning
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddTestNotification("error")}
                leftIcon={<AlertCircle className="w-4 h-4 text-red-500" />}
              >
                Error
              </Button>
            </div>
          </div>

          {/* 알림 목록 */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-softone-text-muted">
                알림이 없습니다.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border ${
                    notification.read
                      ? "bg-gray-50 border-gray-200"
                      : "bg-white border-gray-300 shadow-sm"
                  }`}
                >
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">
                        {notification.title}
                      </span>
                      {!notification.read && (
                        <Badge variant="info" size="sm">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-softone-text-muted truncate">
                      {notification.message}
                    </p>
                    <span className="text-xs text-softone-text-muted">
                      {new Date(notification.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="w-6 h-6 p-0"
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNotification(notification.id)}
                      className="w-6 h-6 p-0 text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardBody>
      </Card>

      {/* Store 상태 JSON */}
      <Card className="bg-slate-50">
        <CardHeader>
          <CardTitle className="text-sm">🔍 Store 상태 (Redux DevTools에서도 확인 가능)</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-xs font-semibold mb-1 text-blue-600">
                Cart Store
              </div>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                {JSON.stringify({ items: cartItems, total: getTotalPrice() }, null, 2)}
              </pre>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1 text-purple-600">
                Preferences Store
              </div>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                {JSON.stringify(preferences, null, 2)}
              </pre>
            </div>
            <div>
              <div className="text-xs font-semibold mb-1 text-amber-600">
                Notifications Store
              </div>
              <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-32">
                {JSON.stringify(
                  {
                    count: notifications.length,
                    unread: getUnreadCount(),
                    latest: notifications[0],
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

GlobalStateDemoPage.displayName = "GlobalStateDemoPage";

