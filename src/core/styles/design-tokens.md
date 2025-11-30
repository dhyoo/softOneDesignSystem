# SoftOne Design System - Design Tokens

## Overview

SDS는 CSS Variable 기반의 Design Token 시스템을 사용합니다.
이를 통해 런타임에 테마를 변경하고, 일관된 디자인 언어를 유지할 수 있습니다.

## Color Tokens

### Primary Colors (Blue)
| Token | CSS Variable | Default Value |
|-------|--------------|---------------|
| primary | `--softone-primary` | `#2563eb` |
| primary-50 | `--softone-primary-50` | `#eff6ff` |
| primary-100 | `--softone-primary-100` | `#dbeafe` |
| primary-500 | `--softone-primary-500` | `#3b82f6` |
| primary-700 | `--softone-primary-700` | `#1d4ed8` |

### Secondary Colors (Slate)
| Token | CSS Variable | Default Value |
|-------|--------------|---------------|
| secondary | `--softone-secondary` | `#475569` |
| secondary-50 | `--softone-secondary-50` | `#f8fafc` |
| secondary-500 | `--softone-secondary-500` | `#64748b` |

### Semantic Colors
| Token | CSS Variable | Usage |
|-------|--------------|-------|
| success | `--softone-success` | 성공 상태, 완료 표시 |
| warning | `--softone-warning` | 경고, 주의 표시 |
| danger/error | `--softone-danger` | 에러, 삭제 확인 |
| info | `--softone-info` | 정보 안내 |

## Typography Tokens

### Font Family
- **Sans**: Pretendard, system-ui
- **Mono**: JetBrains Mono, Consolas

### Font Sizes
| Token | Size | Line Height |
|-------|------|-------------|
| xs | 0.75rem (12px) | 1.5 |
| sm | 0.875rem (14px) | 1.5 |
| base | 1rem (16px) | 1.6 |
| lg | 1.125rem (18px) | 1.5 |
| xl | 1.25rem (20px) | 1.4 |
| 2xl | 1.5rem (24px) | 1.3 |

## Spacing Tokens

Tailwind 기본 스페이싱 시스템 사용:
- 1 = 0.25rem (4px)
- 2 = 0.5rem (8px)
- 4 = 1rem (16px)
- 6 = 1.5rem (24px)
- 8 = 2rem (32px)

## Layout Tokens

| Token | CSS Variable | Value |
|-------|--------------|-------|
| sidebar-width | `--softone-sidebar-width` | 260px |
| sidebar-collapsed | `--softone-sidebar-collapsed-width` | 64px |
| header-height | `--softone-header-height` | 64px |

## Z-Index Scale

| Layer | Value | Usage |
|-------|-------|-------|
| dropdown | 1000 | 드롭다운 메뉴 |
| sticky | 1020 | 고정 헤더/사이드바 |
| modal | 1030 | 모달 다이얼로그 |
| popover | 1040 | 팝오버, 툴팁 |
| toast | 1050 | 토스트 알림 |

## Usage in Components

```tsx
// Tailwind 클래스로 사용
<div className="bg-softone-primary text-white">
  Primary Button
</div>

// CSS Variable 직접 사용
<div style={{ backgroundColor: 'var(--softone-primary)' }}>
  Custom Style
</div>
```

## Theme Switching

```tsx
// Dark 모드 적용
document.documentElement.classList.add('dark');

// Light 모드로 복귀
document.documentElement.classList.remove('dark');
```

---

> **Note**: 이 문서는 Step 2에서 확장될 예정입니다.
> 추가될 내용: Animation Tokens, Breakpoints, Component-specific Tokens

