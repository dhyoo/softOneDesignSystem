/**
 * SoftOne Design System - cn Utility
 * Tailwind CSS 클래스 병합 유틸리티
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSS 클래스를 병합하는 유틸리티 함수
 *
 * clsx로 조건부 클래스를 처리하고,
 * tailwind-merge로 충돌하는 클래스를 해결합니다.
 *
 * @example
 * // 기본 사용
 * cn('px-2 py-1', 'px-4') // => 'py-1 px-4'
 *
 * // 조건부 클래스
 * cn('text-red-500', isActive && 'text-blue-500')
 *
 * // 객체 형태
 * cn({ 'bg-white': isLight, 'bg-black': isDark })
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
