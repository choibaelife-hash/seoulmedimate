'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AlertCircle, CheckCircle2, Loader2, Building2 } from 'lucide-react'
import Link from 'next/link'

const SPECIALTIES = ['내과', '외과', '정형외과', '피부과', '성형외과', '치과', '한방', '산부인과', '소아과', '안과', '이비인후과', '비뇨기과', '신경과', '정신건강의학과']

export default function HospitalOnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [userEmail, setUserEmail] = useState('')
  const [loading, setLoading] = useState(true)

  const [hospitalName, setHospitalName] = useState('')
  const [address, setAddress] = useState('')
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [foreignExp, setForeignExp] = useState<boolean | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/hospital/signup'); return }
      setUserEmail(user.email || '')
      setLoading(false)
    }
    getUser()
  }, [])

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (foreignExp === null) { setError('외국인 환자 진료 경험을 선택해주세요.'); return }
    setSubmitting(true)
    const res = await fetch('/api/hospital-apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hospital_name: hospitalName,
        address,
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: userEmail,
        languages: ['한국어', '영어'],
        specialties: selectedSpecialties,
        has_foreign_patient_experience: foreignExp,
      }),
    })
    if (!res.ok) { setError('제출 중 오류가 발생했습니다. 다시 시도해주세요.'); setSubmitting(false); return }
    setDone(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1a3a5c]" />
      </div>
    )
  }

  if (done) {
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

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1a3a5c] rounded-2xl mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">병원 정보 입력</h1>
          <p className="text-sm text-gray-500 mt-1">제휴 신청을 완료해주세요</p>
          {userEmail && <p className="text-xs text-gray-400 mt-1">{userEmail}</p>}
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-5 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
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
                      selectedSpecialties.includes(s) ? 'bg-[#1a3a5c] text-white border-[#1a3a5c]' : 'bg-white text-gray-600 border-gray-300 hover:border-[#1a3a5c]'
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
            <button type="submit" disabled={submitting}
              className="w-full bg-[#1a3a5c] text-white py-3 rounded-lg font-semibold hover:bg-[#0f2540] transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> 제출 중...</> : '제휴 신청 완료하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
