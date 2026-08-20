'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'

const locales = ['en', 'ko', 'de', 'fr', 'es', 'it', 'pl', 'pt'] as const

const localeInfo: Record<string, { name: string; flag: string }> = {
  en: { name: 'English',    flag: '🇬🇧' },
  ko: { name: '한국어',      flag: '🇰🇷' },
  de: { name: 'Deutsch',    flag: '🇩🇪' },
  fr: { name: 'Français',   flag: '🇫🇷' },
  es: { name: 'Español',    flag: '🇪🇸' },
  it: { name: 'Italiano',   flag: '🇮🇹' },
  pl: { name: 'Polski',     flag: '🇵🇱' },
  pt: { name: 'Português',  flag: '🇵🇹' },
}

interface NavbarProps {
  locale: string
  user?: { email?: string } | null
}

export default function Navbar({ locale, user }: NavbarProps) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const switchLocale = (newLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setLangOpen(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push(`/${locale}/auth/login`)
    router.refresh()
  }

  const current = localeInfo[locale] ?? localeInfo['en']

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-brand-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}`} className="flex items-center gap-2 font-bold text-xl text-brand-600">
            <span className="text-2xl">🏥</span> SeoulMediMate
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <Link href={`/${locale}/hospitals`} className="text-sm text-gray-600 hover:text-brand-600 transition-colors">
              {t('hospitals')}
            </Link>
            <Link href={`/${locale}/inquiry/new`} className="text-sm text-gray-600 hover:text-brand-600 transition-colors">
              {t('inquiry')}
            </Link>
            {user && (
              <Link href={`/${locale}/dashboard`} className="text-sm text-gray-600 hover:text-brand-600 transition-colors">
                {t('dashboard')}
              </Link>
            )}

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-brand-600 px-3 py-2 rounded-xl hover:bg-brand-50 transition-all border border-gray-200 hover:border-brand-200"
              >
                <span className="text-base leading-none">{current.flag}</span>
                <span className="font-medium">{current.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              <div className={`absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 transition-all duration-200 origin-top-right ${
                langOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1 pointer-events-none'
              }`}>
                {locales.map(l => (
                  <button
                    key={l}
                    onClick={() => switchLocale(l)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      l === locale
                        ? 'text-brand-700 font-semibold bg-brand-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base leading-none">{localeInfo[l].flag}</span>
                    <span>{localeInfo[l].name}</span>
                    {l === locale && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-brand-600 transition-colors"
              >
                {t('logout')}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href={`/${locale}/auth/login`}
                  className="text-sm text-gray-700 hover:text-brand-600 px-4 py-2 rounded-xl hover:bg-brand-50 transition-colors font-medium border border-gray-200 hover:border-brand-200"
                >
                  {t('login')}
                </Link>
                <Link
                  href={`/${locale}/auth/signup`}
                  className="bg-brand-600 text-white text-sm px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors font-medium shadow-sm"
                >
                  {t('signup')}
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-brand-100 py-3 space-y-1">
            <Link href={`/${locale}/hospitals`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 rounded-xl" onClick={() => setMenuOpen(false)}>
              {t('hospitals')}
            </Link>
            <Link href={`/${locale}/inquiry/new`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 rounded-xl" onClick={() => setMenuOpen(false)}>
              {t('inquiry')}
            </Link>
            {user ? (
              <>
                <Link href={`/${locale}/dashboard`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-50 rounded-xl" onClick={() => setMenuOpen(false)}>
                  {t('dashboard')}
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl">
                  {t('logout')}
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 py-2">
                <Link href={`/${locale}/auth/login`} className="flex-1 text-center px-4 py-2 text-sm border border-gray-200 text-gray-700 rounded-xl hover:bg-brand-50 font-medium" onClick={() => setMenuOpen(false)}>
                  {t('login')}
                </Link>
                <Link href={`/${locale}/auth/signup`} className="flex-1 text-center px-4 py-2 text-sm bg-brand-600 text-white rounded-xl hover:bg-brand-700 font-medium" onClick={() => setMenuOpen(false)}>
                  {t('signup')}
                </Link>
              </div>
            )}
            <div className="px-4 py-2">
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Language</p>
              <div className="grid grid-cols-2 gap-1.5">
                {locales.map(l => (
                  <button
                    key={l}
                    onClick={() => { switchLocale(l); setMenuOpen(false) }}
                    className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition-colors ${
                      l === locale
                        ? 'bg-brand-100 text-brand-700 font-semibold'
                        : 'bg-gray-50 text-gray-600 hover:bg-brand-50'
                    }`}
                  >
                    <span>{localeInfo[l].flag}</span>
                    <span>{localeInfo[l].name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
