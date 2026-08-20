'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ChevronLeft } from 'lucide-react'

const LANGUAGES = [
  { value: 'en', label: '영어 🇬🇧' },
  { value: 'ko', label: '한국어 🇰🇷' },
  { value: 'fr', label: '프랑스어 🇫🇷' },
  { value: 'de', label: '독일어 🇩🇪' },
  { value: 'es', label: '스페인어 🇪🇸' },
  { value: 'it', label: '이탈리아어 🇮🇹' },
  { value: 'pl', label: '폴란드어 🇵🇱' },
  { value: 'pt', label: '포르투갈어 🇵🇹' },
]

const SPECIALTIES = [
  '성형외과', '피부과', '치과', '안과', '내과', '외과',
  '정형외과', '신경과', '산부인과', '소아과', '한방과', '재활의학과',
]

export default function HospitalApplyPage({ params }: { params: { locale: string } }) {
  const { locale } = params
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  function validateField(name: string, value: string) {
    if (['hospital_name', 'address', 'contact_name'].includes(name)) {
      return value.trim() ? '' : '필수 항목입니다.'
    }
    if (name === 'contact_phone') {
      if (!value.trim()) return '연락처를 입력해주세요.'
      if (/[^0-9\s\-\+]/.test(value)) return '숫자만 입력 가능합니다.'
      return ''
    }
    if (name === 'contact_email') {
      if (!value.trim()) return '이메일을 입력해주세요.'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return '올바른 이메일 형식을 입력해주세요.'
      return ''
    }
    return ''
  }

  function handleChange(name: string, value: string) {
    setForm(f => ({ ...f, [name]: value }))
    if (touched[name]) {
      setErrors(e => ({ ...e, [name]: validateField(name, value) }))
    }
  }

  function handleBlur(name: string, value: string) {
    setTouched(t => ({ ...t, [name]: true }))
    setErrors(e => ({ ...e, [name]: validateField(name, value) }))
  }

  const [form, setForm] = useState({
    hospital_name: '',
    address: '',
    website_url: '',
    naver_map_url: '',
    contact_name: '',
    contact_position: '',
    contact_phone: '',
    contact_email: '',
    languages: [] as string[],
    specialties: [] as string[],
    has_foreign_patient_experience: false,
    description: '',
  })

  function toggleLanguage(lang: string) {
    setForm(f => ({
      ...f,
      languages: f.languages.includes(lang)
        ? f.languages.filter(l => l !== lang)
        : [...f.languages, lang],
    }))
  }

  function toggleSpecialty(s: string) {
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(s)
        ? f.specialties.filter(x => x !== s)
        : [...f.specialties, s],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/hospital-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('신청 중 오류가 발생했습니다.')
      setSubmitted(true)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">제휴 신청 완료!</h1>
          <p className="text-gray-500 mb-2">병원 제휴 신청이 접수되었습니다.</p>
          <p className="text-sm text-gray-400 mb-8">담당자가 직접 연락드려 상세 조건을 안내해드립니다. 보통 1~2 영업일 내에 연락드립니다.</p>
          <Link href={`/${locale}`} className="inline-block bg-brand-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-brand-700 transition-colors">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href={`/${locale}`} className="flex items-center gap-1 text-gray-400 hover:text-gray-700 text-sm mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> 홈으로
        </Link>

        <div className="text-center mb-8">
          <div className="inline-block bg-violet-100 text-violet-700 text-sm font-medium px-4 py-1.5 rounded-full mb-3">
            병원 파트너십
          </div>
          <h1 className="text-3xl font-bold text-gray-900">병원 제휴 신청</h1>
          <p className="text-gray-500 mt-2">SeoulMediMate와 함께 외국인 환자 유치를 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 space-y-6">

          {/* 병원 기본 정보 */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">병원 정보</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">병원명 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.hospital_name}
                  onChange={e => handleChange('hospital_name', e.target.value)}
                  onBlur={e => handleBlur('hospital_name', e.target.value)}
                  placeholder="예: OO성형외과의원"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${errors.hospital_name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.hospital_name && <p className="mt-1 text-xs text-red-500">{errors.hospital_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">병원 주소 <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.address}
                  onChange={e => handleChange('address', e.target.value)}
                  onBlur={e => handleBlur('address', e.target.value)}
                  placeholder="예: 서울시 강남구 청담동 OO번지"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">홈페이지 URL</label>
                <input
                  type="url"
                  value={form.website_url}
                  onChange={e => setForm(f => ({ ...f, website_url: e.target.value }))}
                  placeholder="https://www.hospital.co.kr"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">네이버 지도 링크</label>
                <input
                  type="url"
                  value={form.naver_map_url}
                  onChange={e => setForm(f => ({ ...f, naver_map_url: e.target.value }))}
                  placeholder="https://map.naver.com/..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
            </div>
          </div>

          {/* 주요 진료과목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">주요 진료과목 <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-400 mb-3">복수 선택 가능</p>
            <div className="grid grid-cols-3 gap-2">
              {SPECIALTIES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecialty(s)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-colors
                    ${form.specialties.includes(s)
                      ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 제공 가능 언어 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">병원에서 제공 가능한 언어 <span className="text-red-500">*</span></label>
            <p className="text-xs text-gray-400 mb-3">외국인 환자 응대가 가능한 언어를 선택해주세요</p>
            <div className="grid grid-cols-2 gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => toggleLanguage(lang.value)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm transition-colors text-left
                    ${form.languages.includes(lang.value)
                      ? 'border-brand-500 bg-brand-50 text-brand-700 font-medium'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center
                    ${form.languages.includes(lang.value) ? 'bg-brand-600 border-brand-600' : 'border-gray-300'}`}>
                    {form.languages.includes(lang.value) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* 담당자 정보 */}
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">담당자 정보</h2>
            <p className="text-xs text-gray-400 mb-4">신청 접수 후 SeoulMediMate 담당자가 직접 연락드려 제휴 조건을 안내해드립니다.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">담당자 이름 <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={form.contact_name}
                    onChange={e => handleChange('contact_name', e.target.value)}
                    onBlur={e => handleBlur('contact_name', e.target.value)}
                    placeholder="홍길동"
                    className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${errors.contact_name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors.contact_name && <p className="mt-1 text-xs text-red-500">{errors.contact_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">직책</label>
                  <input
                    type="text"
                    value={form.contact_position}
                    onChange={e => setForm(f => ({ ...f, contact_position: e.target.value }))}
                    placeholder="원장 / 팀장 / 코디네이터"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">연락처 (통화 가능한 번호) <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  value={form.contact_phone}
                  onChange={e => handleChange('contact_phone', e.target.value)}
                  onBlur={e => handleBlur('contact_phone', e.target.value)}
                  placeholder="010-0000-0000"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${errors.contact_phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.contact_phone && <p className="mt-1 text-xs text-red-500">{errors.contact_phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일 <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={form.contact_email}
                  onChange={e => handleChange('contact_email', e.target.value)}
                  onBlur={e => handleBlur('contact_email', e.target.value)}
                  placeholder="contact@hospital.co.kr"
                  className={`w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 ${errors.contact_email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                {errors.contact_email && <p className="mt-1 text-xs text-red-500">{errors.contact_email}</p>}
              </div>
            </div>
          </div>

          {/* 추가 정보 */}
          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 cursor-pointer hover:border-gray-300 transition-colors">
              <input
                type="checkbox"
                checked={form.has_foreign_patient_experience}
                onChange={e => setForm(f => ({ ...f, has_foreign_patient_experience: e.target.checked }))}
                className="mt-0.5 text-brand-600 rounded"
              />
              <div>
                <div className="text-sm font-medium text-gray-700">외국인 환자 유치 경험이 있으신가요?</div>
                <div className="text-xs text-gray-400 mt-0.5">과거 외국인 환자 진료 또는 유치 활동 경험</div>
              </div>
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">병원 소개 / 추가 전달 사항</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={4}
                placeholder="병원의 특장점, 주요 시술, 외국인 환자 서비스 등 자유롭게 작성해주세요."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 resize-none"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || !form.hospital_name || !form.address || !form.contact_name || !form.contact_phone || !form.contact_email || form.languages.length === 0}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-base"
          >
            {loading ? '신청 중...' : '제휴 신청하기'}
          </button>

          <p className="text-xs text-gray-400 text-center">
            신청 후 영업일 기준 1~2일 내에 담당자가 연락드립니다
          </p>
        </form>
      </div>
    </div>
  )
}
