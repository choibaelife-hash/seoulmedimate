'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Users, Calendar, ChevronRight, Globe, Phone, Clock, MapPin } from 'lucide-react'

type Interpreter = {
  id: string
  name: string
  email: string
  phone: string | null
  languages: string[]
  residence_country: string | null
  status: string
  booking_count: number
  upcoming_count: number
}

type CustomerBooking = {
  id: string
  visit_date: string
  visit_time: string | null
  duration_hours: number
  status: string
  interpreter_fee: number | null
  patient_name: string | null
  patient_email: string | null
  patient_phone: string | null
  hospital_name: string | null
}

export default function AdminInquiriesPage() {
  const supabase = createClient()
  const [interpreters, setInterpreters] = useState<Interpreter[]>([])
  const [selected, setSelected] = useState<Interpreter | null>(null)
  const [customers, setCustomers] = useState<CustomerBooking[]>([])
  const [loading, setLoading] = useState(true)
  const [customersLoading, setCustomersLoading] = useState(false)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: interps } = await supabase
        .from('interpreters')
        .select('id, name, email, phone, languages, residence_country, status')
        .order('name')

      if (!interps) { setLoading(false); return }

      const today = new Date().toISOString().split('T')[0]

      const withCounts = await Promise.all(
        interps.map(async (i) => {
          const [{ count: total }, { count: upcoming }] = await Promise.all([
            supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('interpreter_id', i.id),
            supabase.from('bookings').select('*', { count: 'exact', head: true })
              .eq('interpreter_id', i.id)
              .in('status', ['confirmed', 'pending'])
              .gte('visit_date', today),
          ])
          return { ...i, booking_count: total ?? 0, upcoming_count: upcoming ?? 0 }
        })
      )

      setInterpreters(withCounts)
      setLoading(false)
    }
    load()
  }, [])

  async function selectInterpreter(interp: Interpreter) {
    setSelected(interp)
    setCustomersLoading(true)
    setCustomers([])

    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, visit_date, visit_time, duration_hours, status, interpreter_fee, patient_name, patient_email, patient_phone, hospitals(name, address)')
      .eq('interpreter_id', interp.id)
      .order('visit_date', { ascending: false })

    setCustomers(
      (bookings ?? []).map((b: any) => ({
        id: b.id,
        visit_date: b.visit_date,
        visit_time: b.visit_time,
        duration_hours: b.duration_hours,
        status: b.status,
        interpreter_fee: b.interpreter_fee,
        patient_name: b.patient_name,
        patient_email: b.patient_email,
        patient_phone: b.patient_phone,
        hospital_name: b.hospitals?.name ?? null,
      }))
    )
    setCustomersLoading(false)
  }

  const statusColor = (s: string) => ({
    confirmed: 'bg-green-900 text-green-400',
    pending:   'bg-yellow-900 text-yellow-400',
    completed: 'bg-blue-900 text-blue-400',
    cancelled: 'bg-red-900 text-red-400',
  }[s] ?? 'bg-gray-800 text-gray-400')

  const statusLabel = (s: string) => ({
    confirmed: '확정', pending: '대기', completed: '완료', cancelled: '취소',
  }[s] ?? s)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">계약 관리</h1>
        <p className="text-sm text-gray-500 mt-1">통역사별 담당 고객 및 예약 현황을 확인합니다.</p>
      </div>

      <div className="flex gap-6">
        {/* 통역사 목록 */}
        <div className="w-64 flex-shrink-0">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3 px-1">
            통역사 ({interpreters.length}명)
          </p>
          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : interpreters.length === 0 ? (
            <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-8 text-center text-sm text-gray-600">
              등록된 통역사가 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {interpreters.map((interp) => (
                <button
                  key={interp.id}
                  onClick={() => selectInterpreter(interp)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected?.id === interp.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-semibold text-white text-sm">{interp.name}</p>
                    <ChevronRight className={`w-4 h-4 transition-colors ${selected?.id === interp.id ? 'text-blue-400' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(interp.languages ?? []).slice(0, 3).map((lang) => (
                      <span key={lang} className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-medium">{lang}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {interp.booking_count}건
                    </span>
                    {interp.upcoming_count > 0 && (
                      <span className="text-blue-400 font-medium">예정 {interp.upcoming_count}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 담당 고객 */}
        <div className="flex-1">
          {!selected ? (
            <div className="h-full flex items-center justify-center bg-gray-900 border border-dashed border-gray-800 rounded-xl min-h-[400px]">
              <div className="text-center text-gray-600">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">통역사를 선택하면 담당 고객 목록이 표시됩니다.</p>
              </div>
            </div>
          ) : (
            <div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mb-4 flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-xs mb-1">선택된 통역사</p>
                  <p className="text-xl font-bold text-white">{selected.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {(selected.languages ?? []).map((lang) => (
                      <span key={lang} className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{lang}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    {selected.email && <span className="text-gray-500 text-xs">{selected.email}</span>}
                    {selected.phone && (
                      <span className="flex items-center gap-1 text-gray-500 text-xs">
                        <Phone className="w-3 h-3" />{selected.phone}
                      </span>
                    )}
                    {selected.residence_country && (
                      <span className="flex items-center gap-1 text-gray-500 text-xs">
                        <Globe className="w-3 h-3" />{selected.residence_country}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{selected.booking_count}</p>
                  <p className="text-gray-600 text-xs mt-0.5">총 예약</p>
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <h2 className="font-semibold text-gray-200 text-sm">담당 고객 목록</h2>
                  <span className="ml-auto text-xs text-gray-600">{customers.length}건</span>
                </div>

                {customersLoading ? (
                  <div className="p-8 text-center text-sm text-gray-600">불러오는 중...</div>
                ) : customers.length === 0 ? (
                  <div className="p-10 text-center text-sm text-gray-600">배정된 예약이 없습니다.</div>
                ) : (
                  <div className="divide-y divide-gray-800">
                    {customers.map((c) => (
                      <div key={c.id} className="px-5 py-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-gray-200 text-sm">{c.patient_name ?? '이름 미기재'}</p>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor(c.status)}`}>
                                {statusLabel(c.status)}
                              </span>
                            </div>
                            {c.patient_email && <p className="text-xs text-gray-600 mb-1">{c.patient_email}</p>}
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-1">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {c.visit_date}{c.visit_time && ` · ${c.visit_time.slice(0, 5)}`}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />{c.duration_hours}시간
                              </span>
                              {c.hospital_name && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />{c.hospital_name}
                                </span>
                              )}
                            </div>
                          </div>
                          {c.interpreter_fee != null && (
                            <div className="text-right ml-4">
                              <p className="font-bold text-green-400 text-sm">€{Math.round(c.interpreter_fee)}</p>
                              <p className="text-xs text-gray-600 mt-0.5">통역료</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
