import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

export const locales = ['en', 'ko', 'de', 'fr', 'es', 'it', 'pl', 'pt'] as const
export type Locale = typeof locales[number]

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pl: 'Polski',
  pt: 'Português',
}

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  ko: '🇰🇷',
  de: '🇩🇪',
  fr: '🇫🇷',
  es: '🇪🇸',
  it: '🇮🇹',
  pl: '🇵🇱',
  pt: '🇵🇹',
}

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound()

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Europe/London',
    now: new Date(),
  }
})
