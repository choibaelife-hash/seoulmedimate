import { createClient as createSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Clock, CheckCircle, MessageSquare, Calendar, ArrowRight } from 'lucide-react'

export default async function InterpreterHomePage() {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/interpreter/login')

  const { data: interpreter } = await supabase
    .from('interpreters')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const [{ data: inquiries }, { data: bookings }] = await Promise.all([
    supabase.from('inquiries').select('id, status, created_at, language')
      .eq('interpreter_id', interpreter?.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('bookings').select('id, status, visit_date, visit_time, hospitals(name)')
      .eq('interpreter_id', interpreter?.id)
      .order('visit_date', { ascending: true })
      .limit(5),
  ])

  const activeInquiries = (inquiries ?? []).filter((i: any) => i.status !== 'completed').length
  const completedCount = interpreter?.completed_count ?? 0
  const upcomingBookings = (bookings ?? []).filter((b: any) => b.status !== 'cancelled').length

  const stats = [
    { label: '진행 중 계약', value: activeInquiries, icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10' },
    { label: '완료 건수',    value: completedCount,  icon: CheckCircle,   color: 'text-green-400 bg-green-500/10' },
    { label: '예정 예약',    value: upcomingBookings, icon: Calendar,     color: 'text-purple-400 bg-purple-500/10' },
    { label: '대기 중',      value: (inquiries ?? []).filter((i: any) => i.status === 'pending').length, icon: Clock, color: 'text-amber-400 bg-amber-500/10' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">{user.email}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 계약 관리 */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              <h2 className="font-semibold text-gray-200">최근 계약</h2>
            </div>
            <Link href="/interpreter/contracts" className="text-xs text-blue-400 hover:text-blue-300">전체 보기 →</Link>
          </div>
          <div className="divide-y divide-gray-800">
            {(inquiries ?? []).length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-600 text-sm">아직 계약이 없습니다.</div>
            ) : (inquiries ?? []).map((inq: any) => (
              <Link key={inq.id} href={`/interpreter/inquiries/${inq.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-800/50 transition-colors">
                <div>
                  <p className="text-sm text-gray-200 font-medium uppercase">{inq.language}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{new Date(inq.created_at).toLocaleDateString('ko-KR')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    inq.status === 'completed'  ? 'bg-green-900/50 text-green-400' :
                    inq.status === 'processing' ? 'bg-blue-900/50 text-blue-400'  :
                                                  'bg-yellow-900/50 text-yellow-400'
                  }`}>{inq.status}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 예약 관리 */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <h2 className="font-semibold text-gray-200">예정 예약</h2>
            </div>
            <Link href="/interpreter/bookings" className="text-xs text-blue-400 hover:text-blue-300">전체 보기 →</Link>
          </div>
          <div className="divide-y divide-gray-800">
            {(bookings ?? []).length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-600 text-sm">예정된 예약이 없습니다.</div>
            ) : (bookings ?? []).map((bk: any) => (
              <Link key={bk.id} href={`/interpreter/bookings/${bk.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-800/50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-200">{bk.hospitals?.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{bk.visit_date} {bk.visit_time}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  bk.status === 'confirmed' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'
                }`}>{bk.status}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
