/**
 * SoftOne Design System(SDS) - Class Utility
 * 작성: SoftOne Frontend Team
 * 설명: Tailwind CSS 클래스 병합 유틸리티.
 *      clsx + tailwind-merge를 조합하여 조건부 클래스와 충돌 해결을 처리합니다.
 *      테스트/스토리 문서화를 통한 엔터프라이즈 품질 보장.
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
 *
 * // 배열 형태
 * cn(['base-class', condition && 'conditional-class'])
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * 조건에 따라 클래스를 적용하는 헬퍼
 *
 * @example
 * conditionalClass(isActive, 'bg-blue-500', 'bg-gray-200')
 * // isActive가 true면 'bg-blue-500', false면 'bg-gray-200'
 */
export function conditionalClass(
  condition: boolean,
  trueClass: string,
  falseClass: string = ""
): string {
  return condition ? trueClass : falseClass;
}

/**
 * variant와 size 매핑을 위한 헬퍼
 *
 * @example
 * const buttonVariants = variantClass({
 *   primary: 'bg-blue-500 text-white',
 *   secondary: 'bg-gray-500 text-white',
 * });
 * buttonVariants('primary') // => 'bg-blue-500 text-white'
 */
export function variantClass<T extends string>(
  variants: Record<T, string>
): (variant: T) => string {
  return (variant) => variants[variant] ?? "";
}
