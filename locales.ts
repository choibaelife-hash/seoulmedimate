// 지원 언어 단일 소스. middleware / i18n / [locale] layout / Navbar 가 모두 여기서 가져간다.
// 서버 전용 모듈을 import 하지 않으므로 Edge 미들웨어와 클라이언트 컴포넌트 양쪽에서 안전하다.
export const locales = ['en', 'ko', 'de', 'fr', 'es', 'it', 'pl', 'pt'] as const
export type Locale = typeof locales[number]

export const defaultLocale: Locale = 'en'

export const localeInfo: Record<Locale, { name: string; flag: string }> = {
  en: { name: 'English',   flag: '🇬🇧' },
  ko: { name: '한국어',     flag: '🇰🇷' },
  de: { name: 'Deutsch',   flag: '🇩🇪' },
  fr: { name: 'Français',  flag: '🇫🇷' },
  es: { name: 'Español',   flag: '🇪🇸' },
  it: { name: 'Italiano',  flag: '🇮🇹' },
  pl: { name: 'Polski',    flag: '🇵🇱' },
  pt: { name: 'Português', flag: '🇵🇹' },
}
