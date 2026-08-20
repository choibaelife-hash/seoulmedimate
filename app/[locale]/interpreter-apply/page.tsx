'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ChevronDown,
  ChevronLeft,
  Check,
  Mail,
  Phone,
  Globe,
  User,
  Languages,
  Shield,
  Loader2,
  CheckCircle2,
} from 'lucide-react'

// ─── 상수 데이터 ───────────────────────────────────────────────
const ALLOWED_DOMAINS = [
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'yahoo.com',
  'yahoo.co.kr',
  'naver.com',
  'kakao.com',
  'daum.net',
  'icloud.com',
  'me.com',
  'proton.me',
  'protonmail.com',
  'gmx.com',
  'web.de',
  'orange.fr',
  'laposte.net',
  'wp.pl',
  'onet.pl',
  'libero.it',
  'tin.it',
]

const COUNTRIES = [
  { code: 'KR', name: '대한민국' },
  { code: 'DE', name: 'Germany (독일)' },
  { code: 'FR', name: 'France (프랑스)' },
  { code: 'IT', name: 'Italy (이탈리아)' },
  { code: 'ES', name: 'Spain (스페인)' },
  { code: 'PL', name: 'Poland (폴란드)' },
  { code: 'PT', name: 'Portugal (포르투갈)' },
  { code: 'NL', name: 'Netherlands (네덜란드)' },
  { code: 'BE', name: 'Belgium (벨기에)' },
  { code: 'AT', name: 'Austria (오스트리아)' },
  { code: 'CH', name: 'Switzerland (스위스)' },
  { code: 'GB', name: 'United Kingdom (영국)' },
  { code: 'US', name: 'United States (미국)' },
  { code: 'CA', name: 'Canada (캐나다)' },
  { code: 'AU', name: 'Australia (호주)' },
  { code: 'JP', name: 'Japan (일본)' },
  { code: 'CN', name: 'China (중국)' },
  { code: 'VN', name: 'Vietnam (베트남)' },
  { code: 'TH', name: 'Thailand (태국)' },
  { code: 'RU', name: 'Russia (러시아)' },
  { code: 'TR', name: 'Turkey (터키)' },
  { code: 'SE', name: 'Sweden (스웨덴)' },
  { code: 'NO', name: 'Norway (노르웨이)' },
  { code: 'DK', name: 'Denmark (덴마크)' },
  { code: 'FI', name: 'Finland (핀란드)' },
]

const PHONE_CODES = [
  { country: '🇰🇷 KR', code: '+82' },
  { country: '🇩🇪 DE', code: '+49' },
  { country: '🇫🇷 FR', code: '+33' },
  { country: '🇮🇹 IT', code: '+39' },
  { country: '🇪🇸 ES', code: '+34' },
  { country: '🇵🇱 PL', code: '+48' },
  { country: '🇵🇹 PT', code: '+351' },
  { country: '🇳🇱 NL', code: '+31' },
  { country: '🇧🇪 BE', code: '+32' },
  { country: '🇦🇹 AT', code: '+43' },
  { country: '🇨🇭 CH', code: '+41' },
  { country: '🇬🇧 GB', code: '+44' },
  { country: '🇺🇸 US', code: '+1' },
  { country: '🇨🇦 CA', code: '+1' },
  { country: '🇦🇺 AU', code: '+61' },
  { country: '🇯🇵 JP', code: '+81' },
  { country: '🇨🇳 CN', code: '+86' },
  { country: '🇻🇳 VN', code: '+84' },
  { country: '🇹🇭 TH', code: '+66' },
  { country: '🇷🇺 RU', code: '+7' },
  { country: '🇹🇷 TR', code: '+90' },
  { country: '🇸🇪 SE', code: '+46' },
  { country: '🇳🇴 NO', code: '+47' },
  { country: '🇩🇰 DK', code: '+45' },
  { country: '🇫🇮 FI', code: '+358' },
]

const LANGUAGES = ['한국어', '영어', '독일어', '프랑스어', '이탈리아어', '스페인어', '포르투갈어', '폴란드어', '네덜란드어', '러시아어', '중국어', '일본어', '베트남어', '태국어']

const DAYS = ['월', '화', '수', '목', '금', '토', '일']
const TIMES = [
  '오전 6시', '오전 8시', '오전 10시', '정오 12시',
  '오후 2시', '오후 4시', '오후 6시', '오후 8시', '오후 10시',
]

// ─── 메인 컴포넌트 ─────────────────────────────────────────────
export default function InterpreterApplyPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [apiError, setApiError] = useState('')

  // Step 1
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [nameTouched, setNameTouched] = useState(false)
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [country, setCountry] = useState('')
  const [countryOpen, setCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [phoneCode, setPhoneCode] = useState('+82')
  const [phoneCodeOpen, setPhoneCodeOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [koreanLevel, setKoreanLevel] = useState('')
  const [languages, setLanguagesState] = useState<string[]>([])
  // 언어별 레벨·경력: { '영어': { level: '전문 통역', years: '3' }, ... }
  const [languageDetails, setLanguageDetails] = useState<Record<string, { level: string; years: string }>>({})
  const [selfIntroduction, setSelfIntroduction] = useState('')

  const toggleLanguage = (lang: string) => {
    const isActive = languages.includes(lang)
    if (isActive) {
      setLanguagesState((prev) => prev.filter((l) => l !== lang))
      setLanguageDetails((prev) => {
        const next = { ...prev }
        delete next[lang]
        return next
      })
    } else {
      setLanguagesState((prev) => [...prev, lang])
      setLanguageDetails((prev) => ({ ...prev, [lang]: { level: '', years: '' } }))
    }
  }

  const setLangDetail = (lang: string, field: 'level' | 'years', value: string) => {
    setLanguageDetails((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }))
  }

  // Step 2
  // schedule[day][time] = boolean
  const [schedule, setSchedule] = useState<boolean[][]>(
    Array.from({ length: 7 }, () => Array(TIMES.length).fill(false))
  )
  const [isDragging, setIsDragging] = useState(false)
  const [dragValue, setDragValue] = useState(true)

  // Step 3
  const [agreePrivacy, setAgreePrivacy] = useState(false)

  // ── 이메일 검증 ──────────────────────────────────────────────
  const validateEmail = (val: string) => {
    const parts = val.split('@')
    if (parts.length !== 2) {
      setEmailError('올바른 이메일 형식을 입력해주세요.')
      return false
    }
    const domain = parts[1].toLowerCase()
    if (!ALLOWED_DOMAINS.includes(domain)) {
      setEmailError(`허용된 이메일 도메인이 아닙니다. (gmail, hotmail, naver, outlook 등)`)
      return false
    }
    setEmailError('')
    return true
  }

  // ── 스케줄 토글 ──────────────────────────────────────────────
  const toggleCell = (d: number, t: number, value?: boolean) => {
    setSchedule((prev) => {
      const next = prev.map((row) => [...row])
      next[d][t] = value !== undefined ? value : !next[d][t]
      return next
    })
  }

  const totalSelected = schedule.flat().filter(Boolean).length

  // ── 제출 ─────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true)
    setApiError('')
    try {
      const res = await fetch('/api/interpreter-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, country, phoneCode, phone, korean_level: koreanLevel, languages, schedule, language_details: languageDetails, self_introduction: selfIntroduction }),
      })
      const data = await res.json()
      if (!res.ok) {
        setApiError(data.error ?? '오류가 발생했습니다. 다시 시도해주세요.')
        setSubmitting(false)
        return
      }
    } catch (e: any) {
      setApiError(e.message ?? '네트워크 오류가 발생했습니다.')
      setSubmitting(false)
      return
    }
    setSubmitting(false)
    setDone(true)
  }

  // ── 완료 화면 ─────────────────────────────────────────────────
  if (done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">신청이 완료되었습니다!</h2>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            입력하신 이메일 및 연락처로 검토 후 회신드리겠습니다.<br />
            보통 3~5 영업일 내 연락드립니다.
          </p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                    step > s
                      ? 'bg-indigo-600 text-white'
                      : step === s
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s ? <Check className="w-4 h-4" /> : s}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${step >= s ? 'text-indigo-700' : 'text-gray-400'}`}>
                  {s === 1 ? '기본 정보' : s === 2 ? '활동 일정' : '최종 확인'}
                </span>
                {s < 3 && (
                  <div className={`flex-1 h-1 rounded-full mx-2 transition-all ${step > s ? 'bg-indigo-500' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* ══ STEP 1 ══════════════════════════════════════════════ */}
          {step === 1 && (
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">기본 정보 입력</h2>
                  <p className="text-sm text-gray-400">통역사 등록을 위한 기본 정보를 입력해주세요.</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* 이름 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    이름 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                      if (nameTouched) {
                        setNameError(e.target.value.trim() ? '' : '이름을 입력해주세요.')
                      }
                    }}
                    onBlur={() => {
                      setNameTouched(true)
                      if (!name.trim()) setNameError('이름을 입력해주세요.')
                    }}
                    placeholder="홍길동 / John Doe"
                    className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${nameError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  />
                  {nameError && <p className="mt-1.5 text-xs text-red-500">{nameError}</p>}
                </div>

                {/* 이메일 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    이메일 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        const val = e.target.value
                        if (val.includes('@') && val.split('@')[1]?.includes('.')) {
                          validateEmail(val)
                        } else if (emailError) {
                          setEmailError('')
                        }
                      }}
                      onBlur={() => email && validateEmail(email)}
                      placeholder="example@gmail.com"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${
                        emailError ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {emailError ? (
                    <p className="mt-1.5 text-xs text-red-500">{emailError}</p>
                  ) : (
                    <p className="mt-1.5 text-xs text-gray-400">
                      허용 도메인: gmail · hotmail · outlook · naver · kakao · yahoo · icloud 등
                    </p>
                  )}
                </div>

                {/* 거주 국가 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    거주 국가 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setCountryOpen(!countryOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className={country ? 'text-gray-900' : 'text-gray-400'}>
                          {country
                            ? COUNTRIES.find((c) => c.code === country)?.name
                            : '국가를 선택해주세요'}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${countryOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {countryOpen && (
                      <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-2 border-b border-gray-100">
                          <input
                            type="text"
                            placeholder="국가 검색..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-52 overflow-y-auto">
                          {filteredCountries.map((c) => (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => {
                                setCountry(c.code)
                                setCountryOpen(false)
                                setCountrySearch('')
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-50 transition-colors flex items-center justify-between ${
                                country === c.code ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                              }`}
                            >
                              {c.name}
                              {country === c.code && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                            </button>
                          ))}
                          {filteredCountries.length === 0 && (
                            <p className="px-4 py-3 text-sm text-gray-400">검색 결과가 없습니다.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 연락처 */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    연락처 <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    {/* 국가번호 선택 */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setPhoneCodeOpen(!phoneCodeOpen)}
                        className="flex items-center gap-1.5 px-3 py-3 border border-gray-200 rounded-xl text-sm bg-white whitespace-nowrap min-w-[88px] justify-between focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <span className="font-medium text-gray-800">{phoneCode}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${phoneCodeOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {phoneCodeOpen && (
                        <div className="absolute z-20 mt-1 left-0 w-44 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                          <div className="max-h-52 overflow-y-auto">
                            {PHONE_CODES.map((p) => (
                              <button
                                key={p.country + p.code}
                                type="button"
                                onClick={() => {
                                  setPhoneCode(p.code)
                                  setPhoneCodeOpen(false)
                                }}
                                className={`w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 flex items-center justify-between transition-colors ${
                                  phoneCode === p.code ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                                }`}
                              >
                                <span>{p.country}</span>
                                <span className="text-gray-400 text-xs">{p.code}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                          const raw = e.target.value
                          const cleaned = raw.replace(/[^0-9\s\-]/g, '')
                          setPhone(cleaned)
                          if (raw !== cleaned) {
                            setPhoneError('숫자만 입력 가능합니다.')
                          } else if (cleaned.replace(/[\s\-]/g, '').length > 0 && cleaned.replace(/[\s\-]/g, '').length < 7) {
                            setPhoneError('올바른 전화번호를 입력해주세요.')
                          } else {
                            setPhoneError('')
                          }
                        }}
                        placeholder="010 1234 5678"
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${phoneError ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                      />
                    </div>
                  </div>
                  {phoneError && <p className="mt-1.5 text-xs text-red-500">{phoneError}</p>}
                </div>

                {/* ── 한국어 수준 (별도 섹션) ─────────────────── */}
                <div className="border border-rose-100 bg-rose-50 rounded-xl p-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    🇰🇷 한국어 수준 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: '원어민 (한국인)', sub: '한국어 모국어' },
                      { value: '동시 통역 가능', sub: '실시간 동시 통역' },
                      { value: '전문 통역', sub: '의료·법률 전문 분야' },
                      { value: '비즈니스', sub: '업무·의료 기본 통역' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setKoreanLevel(opt.value)}
                        className={`text-left px-3 py-2.5 rounded-lg border text-sm transition-all ${
                          koreanLevel === opt.value
                            ? 'bg-rose-600 text-white border-rose-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-rose-300'
                        }`}
                      >
                        <div className="font-medium">{opt.value}</div>
                        <div className={`text-xs mt-0.5 ${koreanLevel === opt.value ? 'text-rose-100' : 'text-gray-400'}`}>{opt.sub}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── 통역 가능 언어 (한국어 제외) ─────────── */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    통역 가능 언어 <span className="text-red-400">*</span>
                    <span className="ml-1.5 text-xs text-gray-400 font-normal">(복수 선택 가능)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.filter((l) => l !== '한국어').map((lang) => {
                      const active = languages.includes(lang)
                      return (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                            active
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          {active && <Check className="w-3 h-3 inline mr-1" />}
                          {lang}
                        </button>
                      )
                    })}
                  </div>

                  {/* 언어별 레벨·경력 */}
                  {languages.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <p className="text-xs text-gray-500 font-medium">선택한 언어별 수준 및 통역 경력을 입력해주세요</p>
                      {languages.map((lang) => {
                        const detail = languageDetails[lang] ?? { level: '', years: '' }
                        return (
                          <div key={lang} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                            <span className="text-sm font-semibold w-20 flex-shrink-0 text-indigo-700">{lang}</span>
                            <select
                              value={detail.level}
                              onChange={(e) => setLangDetail(lang, 'level', e.target.value)}
                              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
                            >
                              <option value="">수준 선택</option>
                              <option value="원어민 (Native)">원어민 (Native) — 모국어 수준</option>
                              <option value="동시 통역 가능">동시 통역 가능 — 실시간 동시 통역</option>
                              <option value="전문 통역">전문 통역 — 의료·법률 전문 분야</option>
                              <option value="비즈니스">비즈니스 수준 — 업무·의료 기본 통역</option>
                            </select>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <input
                                type="number"
                                min="0"
                                max="50"
                                placeholder="0"
                                value={detail.years}
                                onChange={(e) => setLangDetail(lang, 'years', e.target.value)}
                                className="w-14 px-2 py-2 border border-gray-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              />
                              <span className="text-xs text-gray-400">년</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 자기소개 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  자기소개
                </label>
                <textarea
                  rows={4}
                  placeholder="통역 경험, 전문 분야, 자격증 등 간략히 소개해주세요."
                  value={selfIntroduction}
                  onChange={(e) => setSelfIntroduction(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <button
                onClick={() => {
                  if (!name || !email || !country || !phone || languages.length === 0) return
                  if (!validateEmail(email)) return
                  setStep(2)
                }}
                disabled={!name || !email || !country || !phone || languages.length === 0}
                className="mt-8 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음 단계 →
              </button>
            </div>
          )}

          {/* ══ STEP 2 ══════════════════════════════════════════════ */}
          {step === 2 && (
            <div className="p-8">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> 이전
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Languages className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">활동 가능 일정</h2>
                  <p className="text-sm text-gray-400">현장 통역이 가능한 요일과 시간대를 선택해주세요.</p>
                </div>
              </div>

              {/* 선택된 셀 수 */}
              <div className="mb-5 flex items-center gap-2">
                <span className="text-sm text-gray-500">선택됨:</span>
                <span className={`text-sm font-bold ${totalSelected > 0 ? 'text-indigo-700' : 'text-gray-400'}`}>
                  {totalSelected}개 시간대
                </span>
                {totalSelected > 0 && (
                  <button
                    onClick={() => setSchedule(Array.from({ length: 7 }, () => Array(TIMES.length).fill(false)))}
                    className="ml-auto text-xs text-gray-400 hover:text-red-500 transition-colors"
                  >
                    전체 초기화
                  </button>
                )}
              </div>

              {/* 잔디 격자 */}
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  {/* 요일 헤더 */}
                  <div className="flex mb-1.5 ml-20">
                    {DAYS.map((d) => (
                      <div key={d} className="w-10 text-center text-xs font-semibold text-gray-500">
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* 시간대 행들 */}
                  {TIMES.map((time, t) => (
                    <div key={time} className="flex items-center mb-1.5">
                      {/* 시간 라벨 */}
                      <div className="w-20 text-right pr-3 text-xs text-gray-400 font-medium flex-shrink-0">
                        {time}
                      </div>
                      {/* 요일 셀들 */}
                      {DAYS.map((_, d) => {
                        const active = schedule[d][t]
                        return (
                          <div
                            key={d}
                            className="w-10 flex justify-center"
                            onMouseDown={() => {
                              setIsDragging(true)
                              const newVal = !schedule[d][t]
                              setDragValue(newVal)
                              toggleCell(d, t, newVal)
                            }}
                            onMouseEnter={() => {
                              if (isDragging) toggleCell(d, t, dragValue)
                            }}
                            onMouseUp={() => setIsDragging(false)}
                          >
                            <div
                              className={`w-7 h-7 rounded-md cursor-pointer transition-all select-none border ${
                                active
                                  ? 'bg-indigo-500 border-indigo-600 shadow-sm scale-105'
                                  : 'bg-gray-100 border-gray-200 hover:bg-indigo-100 hover:border-indigo-300'
                              }`}
                            />
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* 범례 */}
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-gray-100 border border-gray-200" />
                  <span>활동 불가</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded bg-indigo-500 border border-indigo-600" />
                  <span>활동 가능</span>
                </div>
                <span className="ml-auto text-gray-300">클릭하거나 드래그해서 선택</span>
              </div>

              <button
                onClick={() => setStep(3)}
                disabled={totalSelected === 0}
                className="mt-8 w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                다음 단계 →
              </button>
            </div>
          )}

          {/* ══ STEP 3 ══════════════════════════════════════════════ */}
          {step === 3 && (
            <div className="p-8">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> 이전
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">최종 확인 및 동의</h2>
                  <p className="text-sm text-gray-400">신청 내용을 확인하고 동의 후 제출해주세요.</p>
                </div>
              </div>

              {/* 신청 요약 */}
              <div className="bg-indigo-50 rounded-xl p-5 mb-6 space-y-2.5 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="font-medium w-16 text-gray-500">이름</span>
                  <span className="font-semibold text-gray-900">{name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="font-medium w-16 text-gray-500">이메일</span>
                  <span className="text-gray-900">{email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Globe className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="font-medium w-16 text-gray-500">거주국가</span>
                  <span className="text-gray-900">{COUNTRIES.find((c) => c.code === country)?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="font-medium w-16 text-gray-500">연락처</span>
                  <span className="text-gray-900">{phoneCode} {phone}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-700">
                  <Languages className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                  <span className="font-medium w-16 text-gray-500">언어</span>
                  <span className="text-gray-900">{languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Check className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                  <span className="font-medium w-16 text-gray-500">일정</span>
                  <span className="text-gray-900">{totalSelected}개 시간대 선택</span>
                </div>
              </div>

              {/* 회신 안내 */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800 font-semibold mb-1">📬 검토 후 회신드립니다</p>
                <p className="text-xs text-blue-600 leading-relaxed">
                  신청해주신 내용을 SeoulMediMate 운영팀에서 검토한 뒤,
                  입력하신 <strong>이메일</strong> 및 <strong>연락처</strong>로
                  3~5 영업일 내 회신드립니다.
                </p>
              </div>

              {/* 동의 체크박스 */}
              <div className="space-y-3 mb-7">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div
                    onClick={() => setAgreePrivacy(!agreePrivacy)}
                    className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                      agreePrivacy
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-gray-300 group-hover:border-indigo-400'
                    }`}
                  >
                    {agreePrivacy && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      개인정보 수집 및 이용 동의 <span className="text-red-400">(필수)</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                      수집 항목: 이름, 이메일, 연락처, 거주국가, 통역언어, 활동일정<br />
                      수집 목적: 통역사 등록 심사 및 서비스 연락<br />
                      보유 기간: 심사 완료 후 3년 또는 서비스 탈퇴 시 삭제
                    </p>
                  </div>
                </label>

              </div>

              {apiError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700 mb-2">
                  ⚠️ {apiError}
                </div>
              )}

              <button
                onClick={handleSubmit}
                disabled={!agreePrivacy || submitting}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    제출 중...
                  </>
                ) : (
                  '통역사 신청 완료 →'
                )}
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          이미 계정이 있으신가요?{' '}
          <a href="/interpreter/login" className="text-indigo-600 font-medium hover:underline">
            통역사 로그인
          </a>
        </p>
      </div>
    </div>
  )
}
