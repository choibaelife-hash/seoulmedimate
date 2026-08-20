import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowRight, Mic, MessageSquare, Building2, Star, Shield, Clock } from 'lucide-react'

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  return <HomeContent locale={locale} />
}

function HomeContent({ locale }: { locale: string }) {
  const t = useTranslations('home')

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🇰🇷 Korean Medical Care Platform
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            {t('hero_title')}
          </h1>
          <p className="text-xl text-brand-100 max-w-2xl mx-auto mb-10">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/${locale}/inquiry/new`}
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors text-lg shadow-lg"
            >
              {t('hero_cta')}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href={`/${locale}/hospitals`}
              className="inline-flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors text-lg"
            >
              Find Hospitals
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">{t('how_it_works')}</h2>
          <p className="text-center text-gray-500 mb-16">Simple, fast, and reliable</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Mic, step: '01', title: t('step1_title'), desc: t('step1_desc'), color: 'text-brand-600 bg-brand-50' },
              { icon: MessageSquare, step: '02', title: t('step2_title'), desc: t('step2_desc'), color: 'text-emerald-600 bg-emerald-50' },
              { icon: Building2, step: '03', title: t('step3_title'), desc: t('step3_desc'), color: 'text-violet-600 bg-violet-50' },
            ].map(({ icon: Icon, step, title, desc, color }) => (
              <div key={step} className="text-center">
                <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8" />
                </div>
                <div className="text-sm font-bold text-gray-400 mb-2">{step}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                <p className="text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-16 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Certified Interpreters', desc: 'All interpreters are medically certified and background-checked.' },
              { icon: Clock, title: 'Fast Response', desc: 'Receive expert advice within hours, not days.' },
              { icon: Star, title: '8 Languages Supported', desc: 'English, Korean, German, French, Spanish, Italian, Polish & Portuguese.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-brand-100">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-brand-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-brand-100 mb-8">Submit your inquiry today and receive expert medical guidance in your language.</p>
          <Link
            href={`/${locale}/inquiry/new`}
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-8 py-4 rounded-xl hover:bg-brand-50 transition-colors"
          >
            Get Expert Advice <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 통역사 & 병원 파트너 섹션 */}
      <section className="py-16 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">파트너 모집</p>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">SeoulMediMate와 함께 성장하세요</h2>
          <p className="text-gray-500 mb-10">외국어에 능통한 통역사, 외국인 환자 유치를 원하는 병원을 환영합니다</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/interpreter/signup"
              className="inline-flex items-center gap-2 bg-brand-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-brand-700 transition-colors shadow-md"
            >
              통역사 등록하기
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/hospital/signup"
              className="inline-flex items-center gap-2 border border-gray-300 text-gray-500 font-medium px-8 py-4 rounded-xl hover:border-gray-400 hover:text-gray-700 transition-colors text-sm"
            >
              병원 제휴 문의
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-6">
          <div>
            <div className="font-bold text-white text-xl mb-2">🏥 SeoulMediMate</div>
            <p className="text-sm">Korean Medical Care in Your Language</p>
          </div>
          <div className="flex gap-8 text-sm">
            <Link href={`/${locale}/hospitals`} className="hover:text-white transition-colors">Hospitals</Link>
            <Link href={`/${locale}/inquiry/new`} className="hover:text-white transition-colors">Get Advice</Link>
            <Link href={`/${locale}/auth/login`} className="hover:text-white transition-colors">Login</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-gray-800">
          <p className="text-xs text-center">© 2025 SeoulMediMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
