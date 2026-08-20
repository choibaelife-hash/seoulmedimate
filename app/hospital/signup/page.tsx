'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, Building2 } from 'lucide-react'
import Link from 'next/link'

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

const SPECIALTIES = ['내과', '외과', '정형외과', '피부과', '성형외과', '치과', '한방', '산부인과', '소아과', '안과', '이비인후과', '비뇨기과', '신경과', '정신건강의학과']

export default function HospitalSignupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [step, setStep] = useState<'auth' | 'survey' | 'done'>('auth')
  const [signedUpEmail, setSignedUpEmail] = useState('')

  // Auth step
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [authError, setAuthError] = useState('')

  // Survey step
  const [hospitalName, setHospitalName] = useState('')
  const [address, setAddress] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [foreignExp, setForeignExp] = useState<boolean | null>(null)
  const [surveyLoading, setSurveyLoading] = useState(false)
  const [surveyError, setSurveyError] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    if (password !== confirm) { setAuthError('비밀번호가 일치하지 않습니다.'); return }
    if (password.length < 6) { setAuthError('비밀번호는 6자 이상이어야 합니다.'); return }
    setAuthLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setAuthError(error.message); setAuthLoading(false); return }
    setSignedUpEmail(email)
    setAuthLoading(false)
    setStep('survey')
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/hospital/onboarding` },
    })
  }

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const handleSurvey = async (e: React.FormEvent) => {
    e.preventDefault()
    setSurveyError('')
    if (foreignExp === null) { setSurveyError('외국인 환자 진료 경험을 선택해주세요.'); return }
    setSurveyLoading(true)
    const res = await fetch('/api/hospital-apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hospital_name: hospitalName,
        address,
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: signedUpEmail,
        languages: ['한국어', '영어'],
        specialties: selectedSpecialties,
        has_foreign_patient_experience: foreignExp,
      }),
    })
    if (!res.ok) { setSurveyError('제출 중 오류가 발생했습니다. 다시 시도해주세요.'); setSurveyLoading(false); return }
    setStep('done')
  }

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">제휴 신청이 완료되었습니다!</h2>
            <p className="text-gray-500 mb-2">담당자 검토 후 승인 이메일을 보내드립니다.</p>
            <p className="text-gray-400 text-sm mb-6">승인 완료 후 로그인하시면 병원 포털을 이용하실 수 있습니다.</p>
            <Link href="/hospital/login" className="inline-block bg-[#1a3a5c] text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-[#0f2540] transition-colors">
              로그인 페이지로 이동
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'survey') {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1a3a5c] rounded-2xl mb-4">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#1a3a5c]">병원 정보 입력</h1>
            <p className="text-sm text-gray-500 mt-1">제휴 신청을 완료해주세요</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            {surveyError && (
              <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{surveyError}
              </div>
            )}
            <form onSubmit={handleSurvey} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">병원명 <span className="text-red-500">*</span></label>
                <input value={hospitalName} onChange={e => setHospitalName(e.target.value)} required placeholder="○○병원"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">주소 <span className="text-red-500">*</span></label>
                <input value={address} onChange={e => setAddress(e.target.value)} required placeholder="서울특별시 강남구 ..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">담당자 이름 <span className="text-red-500">*</span></label>
                <input value={contactName} onChange={e => setContactName(e.target.value)} required placeholder="홍길동"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">담당자 연락처 <span className="text-red-500">*</span></label>
                <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} required placeholder="02-0000-0000"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">진료 과목 <span className="text-gray-400 font-normal">(해당 항목 선택)</span></label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map(s => (
                    <button key={s} type="button" onClick={() => toggleSpecialty(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        selectedSpecialties.includes(s)
                          ? 'bg-[#1a3a5c] text-white border-[#1a3a5c]'
                          : 'bg-white text-gray-600 border-gray-300 hover:border-[#1a3a5c]'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">외국인 환자 진료 경험 <span className="text-red-500">*</span></label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setForeignExp(true)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${foreignExp === true ? 'bg-[#1a3a5c] text-white border-[#1a3a5c]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#1a3a5c]'}`}>
                    있음
                  </button>
                  <button type="button" onClick={() => setForeignExp(false)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${foreignExp === false ? 'bg-[#1a3a5c] text-white border-[#1a3a5c]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#1a3a5c]'}`}>
                    없음
                  </button>
                </div>
              </div>
              <button type="submit" disabled={surveyLoading}
                className="w-full bg-[#1a3a5c] text-white py-3 rounded-lg font-semibold hover:bg-[#0f2540] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
                {surveyLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> 제출 중...</> : '제휴 신청 완료하기'}
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Step: auth
  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1a3a5c] rounded-2xl mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">병원 제휴 등록</h1>
          <p className="text-sm text-gray-500 mt-1">SeoulMediMate 파트너 병원으로 등록하기</p>
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
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="hospital@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="6자 이상"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호 확인</label>
              <div className="relative">
                <input type={showConfirm ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="••••••••"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={authLoading || googleLoading}
              className="w-full bg-[#1a3a5c] text-white py-3 rounded-lg font-semibold hover:bg-[#0f2540] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {authLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> 처리 중...</> : '다음 단계 (병원 정보 입력)'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            이미 계정이 있으신가요?{' '}
            <Link href="/hospital/login" className="text-[#2e86c1] hover:underline font-medium">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
