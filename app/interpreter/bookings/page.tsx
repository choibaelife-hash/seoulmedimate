import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Calendar, MapPin, ArrowRight, Clock } from 'lucide-react'

export default async function InterpreterBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/interpreter/login')

  const { data: interpreter } = await supabase
    .from('interpreters').select('id').eq('user_id', user.id).single()
  if (!interpreter) redirect('/interpreter/login')

  const today = new Date().toISOString().split('T')[0]

  const { data: upcoming } = await supabase
    .from('bookings')
    .select('*, hospitals(name, address)')
    .eq('interpreter_id', interpreter.id)
    .in('status', ['confirmed', 'pending'])
    .gte('visit_date', today)
    .order('visit_date', { ascending: true })

  const { data: past } = await supabase
    .from('bookings')
    .select('*, hospitals(name, address)')
    .eq('interpreter_id', interpreter.id)
    .lt('visit_date', today)
    .order('visit_date', { ascending: false })
    .limit(10)

  const next = upcoming?.[0]

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#1a3a5c] mb-1">예약 관리</h1>
      <p className="text-sm text-gray-500 mb-8">배정된 동행 통역 예약 일정을 확인합니다.</p>

      {/* 다음 예약 하이라이트 */}
      {next && (
        <div className="bg-[#1a3a5c] rounded-2xl p-6 text-white mb-8">
          <p className="text-white/60 text-xs font-medium mb-2">📅 다음 예약</p>
          <p className="text-xl font-bold">{next.hospitals?.name}</p>
          <p className="text-white/70 text-sm mt-1">{next.hospitals?.address}</p>
          <div className="flex items-center gap-3 mt-4">
            <span className="bg-white/20 rounded-lg px-3 py-1.5 text-sm font-semibold">
              {next.visit_date} · {next.visit_time?.slice(0, 5)}
            </span>
            <span className="text-white/60 text-sm">{next.duration_hours}시간</span>
            <span className="ml-auto text-green-300 font-bold">€{(next.interpreter_fee ?? 0).toFixed(0)}</span>
          </div>
        </div>
      )}

      {/* 예정 예약 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-[#1a3a5c] mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          예정 예약 <span className="text-[#2e86c1] bg-blue-50 text-xs px-2 py-0.5 rounded-full">{upcoming?.length ?? 0}</span>
        </h2>
        {!upcoming?.length ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
            예정된 예약이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <Link key={b.id} href={`/interpreter/bookings/${b.id}`}
                className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-[#2e86c1] hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-[#2e86c1]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a3a5c]">{b.hospitals?.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{b.visit_date} · {b.visit_time?.slice(0, 5)} · {b.duration_hours}h</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />{b.hospitals?.address}
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-green-700">€{(b.interpreter_fee ?? 0).toFixed(0)}</p>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 과거 예약 */}
      {!!past?.length && (
        <section>
          <h2 className="text-base font-semibold text-gray-400 mb-3">지난 예약</h2>
          <div className="space-y-2">
            {past.map((b) => (
              <Link key={b.id} href={`/interpreter/bookings/${b.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl hover:border-gray-300 transition-colors opacity-70 hover:opacity-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">{b.hospitals?.name}</p>
                  <p className="text-xs text-gray-400">{b.visit_date} · {b.duration_hours}h</p>
                </div>
                <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">완료</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
