import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// shadcn/ui 표준 cn 함수
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 날짜 포맷 (예약 표시용)
export function formatVisitDate(date: string, locale: string): string {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 금액 포맷 (유로)
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

// 취소 가능 여부 체크
export function getCancellationStatus(visitDate: string, visitTime: string): {
  canCancel: boolean
  refundPercent: number
  hoursUntilVisit: number
} {
  const visitDateTime = new Date(`${visitDate}T${visitTime}`)
  const now = new Date()
  const hoursUntilVisit = (visitDateTime.getTime() - now.getTime()) / (1000 * 60 * 60)

  if (hoursUntilVisit >= 72) return { canCancel: true, refundPercent: 100, hoursUntilVisit }
  if (hoursUntilVisit >= 48) return { canCancel: true, refundPercent: 50, hoursUntilVisit }
  return { canCancel: false, refundPercent: 0, hoursUntilVisit }
}

// 언어 코드 → 국가명
export function getLanguageName(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(code) ?? code
  } catch {
    return code
  }
}

// 슬러그 생성
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
