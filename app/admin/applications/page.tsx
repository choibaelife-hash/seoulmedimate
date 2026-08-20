'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Building2, Languages, Clock, RefreshCw, AlertTriangle, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'

const LANG_LABELS: Record<string, string> = {
  en: '영어', ko: '한국어', fr: '프랑스어', de: '독일어',
  es: '스페인어', it: '이탈리아어', pl: '폴란드어', pt: '포르투갈어',
  zh: '중국어', ja: '일본어', ru: '러시아어', ar: '아랍어',
}

const statusConfig: Record<string, { label: string; color: string }> = {
  pending:  { label: '검토대기', color: 'bg-amber-900 text-amber-300' },
  approved: { label: '승인완료', color: 'bg-green-900 text-green-300' },
  rejected: { label: '반려',     color: 'bg-red-900 text-red-300' },
}

function formatAvailability(av: any): string {
  if (!av) return '미기재'
  try {
    const parsed = typeof av === 'string' ? JSON.parse(av) : av
    if (Array.isArray(parsed)) {
      const count = parsed.flat().filter(Boolean).length
      return count > 0 ? `${count}개 슬롯 선택됨` : '미기재'
    }
  } catch {}
  return typeof av === 'string' ? av : '미기재'
}

export default function ApplicationsPage() {
  const [tab, setTab] = useState('interpreter')
  const [interpreters, setInterpreters] = useState<any[]>([])
  const [hospitals, setHospitals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dbErrors, setDbErrors] = useState<{ interpreters?: string; hospitals?: string }>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggleExpanded = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/applications-list')
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      const d = await res.json()
      setInterpreters(d.interpreters ?? [])
      setHospitals(d.hospitals ?? [])
      setDbErrors(d.errors?.interpreters || d.errors?.hospitals ? d.errors : {})
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('tab') === 'hospital') setTab('hospital')
    fetchData()
  }, [fetchData])

  const handleAction = async (id: string, type: 'interpreter' | 'hospital', action: 'approve' | 'reject') => {
    const key = `${action}-${id}`
    setActionLoading(key)
    try {
      const formData = new FormData()
      formData.append('id', id)
      formData.append('type', type)
      const endpoint = action === 'approve'
        ? '/api/admin/applications/approve'
        : '/api/admin/applications/reject'
      const res = await fetch(endpoint, { method: 'POST', body: formData })
      if (res.ok || res.redirected) {
        const updatedStatus = action === 'approve' ? 'approved' : 'rejected'
        if (type === 'interpreter') {
          setInterpreters(prev => prev.map(a => a.id === id ? { ...a, status: updatedStatus } : a))
        } else {
          setHospitals(prev => prev.map(a => a.id === id ? { ...a, status: updatedStatus } : a))
        }
      } else {
        alert(`오류가 발생했습니다: ${await res.text()}`)
      }
    } catch (e: any) {
      alert(`오류: ${e.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string, type: 'interpreter' | 'hospital', name: string) => {
    if (!confirm(`"${name}" 신청을 완전히 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return
    const key = `delete-${id}`
    setActionLoading(key)
    try {
      const formData = new FormData()
      formData.append('id', id)
      formData.append('type', type)
      const res = await fetch('/api/admin/applications/delete', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.ok) {
        if (type === 'interpreter') {
          setInterpreters(prev => prev.filter(a => a.id !== id))
        } else {
          setHospitals(prev => prev.filter(a => a.id !== id))
        }
        setExpanded(prev => { const next = new Set(prev); next.delete(id); return next })
      } else {
        alert(`삭제 오류: ${data.error}`)
      }
    } catch (e: any) {
      alert(`오류: ${e.message}`)
    } finally {
      setActionLoading(null)
    }
  }

  const pendingInterpreters = interpreters.filter(a => a.status === 'pending').length
  const pendingHospitals = hospitals.filter(a => a.status === 'pending').length

  return (
    <div className="p-8 bg-gray-950 min-h-screen">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">제휴 의뢰</h1>
          <p className="text-sm text-gray-400 mt-1">통역사 · 병원 신규 제휴 신청 관리</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      {(dbErrors.interpreters || dbErrors.hospitals) && (
        <div className="bg-amber-900/20 border border-amber-700 rounded-xl p-4 mb-4 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-300">
            <p className="font-medium mb-1">데이터베이스 오류</p>
            {dbErrors.interpreters && <p>통역사: {dbErrors.interpreters}</p>}
            {dbErrors.hospitals && <p>병원: {dbErrors.hospitals}</p>}
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 text-red-400 text-sm mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          API 오류: {error}
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('interpreter')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
            tab === 'interpreter' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600'
          }`}>
          <Languages className="w-4 h-4" />
          통역사
          {pendingInterpreters > 0 && <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingInterpreters}</span>}
        </button>
        <button onClick={() => setTab('hospital')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors border ${
            tab === 'hospital' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600'
          }`}>
          <Building2 className="w-4 h-4" />
          병원
          {pendingHospitals > 0 && <span className="bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingHospitals}</span>}
        </button>
      </div>

      {loading && <div className="text-gray-500 text-sm py-8 text-center">불러오는 중...</div>}

      {/* ── 통역사 탭 ── */}
      {tab === 'interpreter' && !loading && (
        <div className="space-y-3">
          {interpreters.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-dashed border-gray-700 p-12 text-center text-gray-500 text-sm">
              {dbErrors.interpreters ? '테이블 조회 오류 (위 오류 메시지 확인)' : '신청 내역이 없습니다'}
            </div>
          ) : interpreters.map((app) => {
            const isOpen = expanded.has(app.id)
            const displayName = app.name ?? '이름 없음'
            return (
              <div key={app.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
                  onClick={() => toggleExpanded(app.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-white text-sm">{displayName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[app.status]?.color ?? 'bg-gray-800 text-gray-400'}`}>
                        {statusConfig[app.status]?.label ?? app.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                      <span>{app.email}</span>
                      {app.phone && <><span>·</span><span>{app.phone}</span></>}
                      {(app.residence_country || app.country) && <><span>·</span><span>거주: {app.residence_country ?? app.country}</span></>}
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(app.created_at).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4" onClick={e => e.stopPropagation()}>
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(app.id, 'interpreter', 'approve')}
                          disabled={!!actionLoading}
                          className="flex items-center gap-1 text-xs bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          {actionLoading === `approve-${app.id}` ? '처리중...' : '승인'}
                        </button>
                        <button
                          onClick={() => handleAction(app.id, 'interpreter', 'reject')}
                          disabled={!!actionLoading}
                          className="flex items-center gap-1 text-xs bg-orange-700 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          {actionLoading === `reject-${app.id}` ? '처리중...' : '반려'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(app.id, 'interpreter', displayName)}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1 text-xs bg-red-900 hover:bg-red-800 text-red-300 hover:text-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                      title="데이터 완전 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {actionLoading === `delete-${app.id}` ? '삭제중...' : '삭제'}
                    </button>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-gray-500" />
                      : <ChevronDown className="w-4 h-4 text-gray-500" />
                    }
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-gray-800 pt-4 space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {app.korean_level && (
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1">한국어 수준</div>
                          <div className="text-xs text-white font-medium">{app.korean_level}</div>
                        </div>
                      )}
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">통역 언어</div>
                        <div className="text-xs text-white font-medium">
                          {app.languages?.length > 0
                            ? app.languages.map((l: string) => LANG_LABELS[l] ?? l).join(', ')
                            : '미기재'}
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">가용 스케줄</div>
                        <div className="text-xs text-white font-medium">{formatAvailability(app.availability)}</div>
                      </div>
                    </div>

                    {app.language_details && Object.keys(app.language_details).length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(app.language_details as Record<string, { level: string; years: string }>).map(([lang, detail]) => (
                          <div key={lang} className="bg-gray-800 rounded-lg p-2.5 flex items-center justify-between">
                            <span className="text-xs text-gray-300 font-medium">{lang}</span>
                            <div className="text-right">
                              <div className="text-xs text-blue-400">{detail.level || '레벨 미기재'}</div>
                              {detail.years && <div className="text-xs text-gray-500">경력 {detail.years}년</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {app.self_introduction && (
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">자기소개</div>
                        <p className="text-xs text-gray-300 leading-relaxed">{app.self_introduction}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── 병원 탭 ── */}
      {tab === 'hospital' && !loading && (
        <div className="space-y-3">
          {hospitals.length === 0 ? (
            <div className="bg-gray-900 rounded-xl border border-dashed border-gray-700 p-12 text-center text-gray-500 text-sm">
              {dbErrors.hospitals ? '테이블 조회 오류 (위 오류 메시지 확인)' : '신청 내역이 없습니다'}
            </div>
          ) : hospitals.map((app) => {
            const isOpen = expanded.has(app.id)
            const displayName = app.hospital_name ?? '병원명 없음'
            return (
              <div key={app.id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors">
                <div
                  className="flex items-center justify-between px-5 py-4 cursor-pointer select-none"
                  onClick={() => toggleExpanded(app.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      <span className="font-semibold text-white text-sm">{displayName}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusConfig[app.status]?.color ?? 'bg-gray-800 text-gray-400'}`}>
                        {statusConfig[app.status]?.label ?? app.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                      {app.address && <span>{app.address}</span>}
                      <span>·</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(app.created_at).toLocaleDateString('ko-KR')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-4" onClick={e => e.stopPropagation()}>
                    {app.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleAction(app.id, 'hospital', 'approve')}
                          disabled={!!actionLoading}
                          className="flex items-center gap-1 text-xs bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          {actionLoading === `approve-${app.id}` ? '처리중...' : '승인'}
                        </button>
                        <button
                          onClick={() => handleAction(app.id, 'hospital', 'reject')}
                          disabled={!!actionLoading}
                          className="flex items-center gap-1 text-xs bg-orange-700 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          {actionLoading === `reject-${app.id}` ? '처리중...' : '반려'}
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDelete(app.id, 'hospital', displayName)}
                      disabled={!!actionLoading}
                      className="flex items-center gap-1 text-xs bg-red-900 hover:bg-red-800 text-red-300 hover:text-red-200 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-60"
                      title="데이터 완전 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {actionLoading === `delete-${app.id}` ? '삭제중...' : '삭제'}
                    </button>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4 text-gray-500" />
                      : <ChevronDown className="w-4 h-4 text-gray-500" />
                    }
                  </div>
                </div>

                {isOpen && (
                  <div className="px-5 pb-5 border-t border-gray-800 pt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">담당자</div>
                        <div className="text-xs text-white font-medium">{app.contact_name}{app.contact_position && ` (${app.contact_position})`}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{app.contact_phone}</div>
                        <div className="text-xs text-gray-400">{app.contact_email}</div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">제공 언어</div>
                        <div className="text-xs text-white font-medium">
                          {(app.languages ?? []).map((l: string) => LANG_LABELS[l] ?? l).join(', ') || '미기재'}
                        </div>
                        {app.specialties && (
                          <>
                            <div className="text-xs text-gray-500 mt-2 mb-1">진료과목</div>
                            <div className="text-xs text-gray-400">{app.specialties}</div>
                          </>
                        )}
                      </div>
                    </div>

                    {(app.website_url || app.naver_map_url) && (
                      <div className="flex gap-3">
                        {app.website_url && <a href={app.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 hover:underline">홈페이지 →</a>}
                        {app.naver_map_url && <a href={app.naver_map_url} target="_blank" rel="noopener noreferrer" className="text-xs text-green-400 hover:underline">네이버 지도 →</a>}
                      </div>
                    )}

                    {app.description && (
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="text-xs text-gray-500 mb-1">병원 소개</div>
                        <p className="text-xs text-gray-300 leading-relaxed">{app.description}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
