'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, Languages } from 'lucide-react'
import Link from 'next/link'

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const LANGUAGES = [
  { code: 'en', label: '영어' }, { code: 'de', label: '독일어' },
  { code: 'fr', label: '프랑스어' }, { code: 'es', label: '스페인어' },
  { code: 'it', label: '이탈리아어' }, { code: 'pl', label: '폴란드어' },
  { code: 'pt', label: '포르투갈어' }, { code: 'zh', label: '중국어' },
  { code: 'ja', label: '일본어' }, { code: 'ru', label: '러시아어' },
  { code: 'ar', label: '아랍어' },
]

const PHONE_CODES = [
  { code: '+82',  label: '+82 🇰🇷 한국' },
  { code: '+1',   label: '+1  🇺🇸 미국/캐나다' },
  { code: '+44',  label: '+44 🇬🇧 영국' },
  { code: '+49',  label: '+49 🇩🇪 독일' },
  { code: '+33',  label: '+33 🇫🇷 프랑스' },
  { code: '+34',  label: '+34 🇪🇸 스페인' },
  { code: '+39',  label: '+39 🇮🇹 이탈리아' },
  { code: '+48',  label: '+48 🇵🇱 폴란드' },
  { code: '+351', label: '+351 🇵🇹 포르투갈' },
  { code: '+86',  label: '+86 🇨🇳 중국' },
  { code: '+81',  label: '+81 🇯🇵 일본' },
  { code: '+7',   label: '+7  🇷🇺 러시아' },
  { code: '+966', label: '+966 🇸🇦 사우디' },
  { code: '+971', label: '+971 🇦🇪 UAE' },
  { code: '+61',  label: '+61 🇦🇺 호주' },
]

const DAYS = ['월', '화', '수', '목', '금', '토', '일']
const TIMES = ['오전', '오후', '저녁']
const KOREAN_LEVELS = ['원어민 수준', '상급 (비즈니스)', '중급 (일상 가능)', '초급', '없음']
const LANG_LEVELS = ['원어민', 'C2', 'C1', 'B2', 'B1', 'A2', 'A1']

function ScheduleGrid({
  schedule,
  setSchedule,
}: {
  schedule: boolean[][]
  setSchedule: React.Dispatch<React.SetStateAction<boolean[][]>>
}) {
  const isDragging = useRef(false)
  const dragValue = useRef(false)

  useEffect(() => {
    const stop = () => { isDragging.current = false }
    window.addEventListener('mouseup', stop)
    return () => window.removeEventListener('mouseup', stop)
  }, [])

  const activate = (di: number, ti: number, newVal: boolean) => {
    setSchedule(prev => {
      const next = prev.map(r => [...r])
      next[di][ti] = newVal
      return next
    })
  }

  return (
    <div className="select-none" onDragStart={e => e.preventDefault()}>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr>
            <th className="pb-1.5 w-10" />
            {TIMES.map(t => (
              <th key={t} className="pb-1.5 text-gray-500 font-medium text-center">{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS.map((day, di) => (
            <tr key={day}>
              <td className="pr-2 text-gray-500 font-medium text-center py-0.5">{day}</td>
              {TIMES.map((_, ti) => (
                <td key={ti} className="p-0.5">
                  <div
                    className={`h-7 rounded cursor-pointer transition-colors border ${
                      schedule[di][ti]
                        ? 'bg-[#1a3a5c] border-[#1a3a5c]'
                        : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                    }`}
                    onMouseDown={() => {
                      isDragging.current = true
                      dragValue.current = !schedule[di][ti]
                      activate(di, ti, dragValue.current)
                    }}
                    onMouseEnter={() => {
                      if (isDragging.current) activate(di, ti, dragValue.current)
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-1.5">클릭하거나 드래그해서 가능한 시간대를 선택하세요</p>
    </div>
  )
}

function SurveyForm({ signedUpEmail }: { signedUpEmail: string }) {
  const [name, setName] = useState('')
  const [phoneCode, setPhoneCode] = useState('+82')
  const [phone, setPhone] = useState('')
  const [nationality, setNationality] = useState('')
  const [koreanLevel, setKoreanLevel] = useState('')
  const [selectedLangs, setSelectedLangs] = useState<string[]>([])
  const [langDetails, setLangDetails] = useState<Record<string, { level: string; years: string }>>({})
  const [schedule, setSchedule] = useState<boolean[][]>(DAYS.map(() => TIMES.map(() => false)))
  const [intro, setIntro] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const toggleLang = (code: string) => {
    setSelectedLangs(prev => {
      if (prev.includes(code)) {
        const d = { ...langDetails }; delete d[code]; setLangDetails(d)
        return prev.filter(l => l !== code)
      }
      setLangDetails(d => ({ ...d, [code]: { level: '', years: '' } }))
      return [...prev, code]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!koreanLevel) { setError('한국어 수준을 선택해주세요.'); return }
    if (selectedLangs.length === 0) { setError('구사 언어를 하나 이상 선택해주세요.'); return }
    setLoading(true)
    const res = await fetch('/api/interpreter-apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email: signedUpEmail,
        phoneCode,
        phone,
        residence_country: nationality,
        korean_level: koreanLevel,
        languages: selectedLangs,
        language_details: langDetails,
        availability: schedule,
        self_introduction: intro,
      }),
    })
    if (!res.ok) { setError('제출 중 오류가 발생했습니다. 다시 시도해주세요.'); setLoading(false); return }
    setDone(true)
  }

  if (done) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="w-14 h-14 text-green-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">신청이 완료되었습니다!</h2>
        <p className="text-gray-500 text-sm mb-1">검토 후 승인 이메일을 발송해 드리겠습니다.</p>
        <p className="text-gray-400 text-sm mb-6">승인 완료 후 로그인하시면 포털을 이용하실 수 있습니다.</p>
        <Link href="/interpreter/login" className="inline-block bg-[#1a3a5c] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#0f2540] transition-colors">
          로그인 페이지로 이동
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
        </div>
      )}

      {/* 기본 정보 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">이름 <span className="text-red-500">*</span></label>
          <input value={name} onChange={e => setName(e.target.value)} required placeholder="홍길동"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">전화번호 <span className="text-red-500">*</span></label>
          <div className="flex gap-2">
            <select value={phoneCode} onChange={e => setPhoneCode(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent bg-white w-40 flex-shrink-0">
              {PHONE_CODES.map(({ code, label }) => (
                <option key={code} value={code}>{label}</option>
              ))}
            </select>
            <input value={phone} onChange={e => setPhone(e.target.value)} required placeholder="10-0000-0000"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">국적 <span className="text-red-500">*</span></label>
          <input value={nationality} onChange={e => setNationality(e.target.value)} required placeholder="한국"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
        </div>
      </div>

      {/* 한국어 수준 — 강조 버튼 그룹 */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <label className="block text-sm font-semibold text-blue-900 mb-3">
          한국어 수준 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-2">
          {KOREAN_LEVELS.map(level => (
            <button
              key={level}
              type="button"
              onClick={() => setKoreanLevel(level)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                koreanLevel === level
                  ? 'bg-[#1a3a5c] text-white border-[#1a3a5c] shadow-sm'
                  : 'bg-white text-gray-700 border-blue-200 hover:border-[#1a3a5c] hover:text-[#1a3a5c]'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* 구사 언어 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">구사 언어 <span className="text-red-500">*</span></label>
        <div className="flex flex-wrap gap-2 mb-3">
          {LANGUAGES.map(({ code, label }) => (
            <button key={code} type="button" onClick={() => toggleLang(code)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedLangs.includes(code)
                  ? 'bg-[#1a3a5c] text-white border-[#1a3a5c]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}>
              {label}
            </button>
          ))}
        </div>
        {selectedLangs.length > 0 && (
          <div className="space-y-2">
            {selectedLangs.map(code => {
              const label = LANGUAGES.find(l => l.code === code)?.label ?? code
              return (
                <div key={code} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-sm font-medium text-gray-700 w-20 flex-shrink-0">{label}</span>
                  <select
                    value={langDetails[code]?.level ?? ''}
                    onChange={e => setLangDetails(d => ({ ...d, [code]: { ...d[code], level: e.target.value } }))}
                    className="flex-1 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a3a5c]">
                    <option value="">수준 선택</option>
                    {LANG_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <input type="number" min="0" max="50"
                    value={langDetails[code]?.years ?? ''}
                    onChange={e => setLangDetails(d => ({ ...d, [code]: { ...d[code], years: e.target.value } }))}
                    placeholder="경력(년)"
                    className="w-24 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#1a3a5c]" />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 가용 스케줄 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">가용 스케줄</label>
        <ScheduleGrid schedule={schedule} setSchedule={setSchedule} />
      </div>

      {/* 자기소개 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">간단 자기소개</label>
        <textarea value={intro} onChange={e => setIntro(e.target.value)} rows={3}
          placeholder="경력, 전문 분야, 의료통역 경험 등을 간략히 적어주세요"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent resize-none" />
      </div>

      <button type="submit" disabled={loading}
        className="w-full bg-[#1a3a5c] text-white py-3 rounded-lg font-semibold hover:bg-[#0f2540] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
        {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> 제출 중...</> : '신청 완료하기'}
      </button>
    </form>
  )
}

export default function InterpreterSignupPage() {
  const supabase = createClient()
  const [step, setStep] = useState<'auth' | 'survey'>('auth')
  const [signedUpEmail, setSignedUpEmail] = useState('')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    if (password !== confirm) { setAuthError('비밀번호가 일치하지 않습니다.'); return }
    if (password.length < 6) { setAuthError('비밀번호는 6자 이상이어야 합니다.'); return }
    setAuthLoading(true)
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) { setAuthError(data.error || '회원가입 중 오류가 발생했습니다.'); setAuthLoading(false); return }
    setSignedUpEmail(email)
    setAuthLoading(false)
    setStep('survey')
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/interpreter/onboarding')}` },
    })
  }

  if (step === 'survey') {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1a3a5c] rounded-2xl mb-4">
              <Languages className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a3a5c]">통역사 정보 입력</h1>
            <p className="text-sm text-gray-500 mt-1">간단한 정보를 입력하고 신청을 완료해주세요</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <SurveyForm signedUpEmail={signedUpEmail} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1a3a5c] rounded-2xl mb-4">
            <Languages className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">통역사 등록</h1>
          <p className="text-sm text-gray-500 mt-1">SeoulMediMate 통역사로 등록하기</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {authError && (
            <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{authError}
            </div>
          )}
          <button onClick={handleGoogle} disabled={googleLoading || authLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium mb-6 disabled:opacity-50">
            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
            Google로 계속하기
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">또는</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="interpreter@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="6자 이상"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={authLoading || googleLoading}
              className="w-full bg-[#1a3a5c] text-white py-3 rounded-lg font-semibold hover:bg-[#0f2540] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {authLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> 처리 중...</> : '다음 단계 (정보 입력)'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            이미 계정이 있으신가요?{' '}
            <Link href="/interpreter/login" className="text-[#2e86c1] hover:underline font-medium">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
