import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Users, MessageSquare, Calendar, FileCheck, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: userCount },
    { count: inquiryCount },
    { count: bookingCount },
    { count: interpreterPending },
    { count: hospitalPending },
    { data: recentInquiries },
  ] = await Promise.all([
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('interpreter_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('hospital_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('inquiries')
      .select('id, language, status, created_at, raw_text, transcribed_text')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const partnerPending = (interpreterPending ?? 0) + (hospitalPending ?? 0)

  const stats = [
    { label: '전체 고객',  value: userCount ?? 0,    icon: Users,        color: 'text-blue-400 bg-blue-500/10',   href: null },
    { label: '총 문의',    value: inquiryCount ?? 0,  icon: MessageSquare, color: 'text-purple-400 bg-purple-500/10', href: null },
    { label: '총 예약',    value: bookingCount ?? 0,  icon: Calendar,     color: 'text-green-400 bg-green-500/10', href: null },
    { label: '제휴 대기',  value: partnerPending,     icon: FileCheck,    color: 'text-amber-400 bg-amber-500/10', href: '/admin/applications' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">SeoulMediMate 전체 현황을 한눈에 확인합니다.</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {stats.map((s) => {
          const card = (
            <div className={`bg-gray-900 rounded-xl border p-5 transition-all ${
              s.href
                ? 'border-gray-700 hover:border-amber-500/50 hover:bg-gray-800 cursor-pointer'
                : 'border-gray-800'
            }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              {s.href && partnerPending > 0 && (
                <p className="text-xs text-amber-400 mt-2 font-medium">클릭하여 확인 →</p>
              )}
            </div>
          )
          return s.href ? (
            <Link key={s.label} href={s.href}>{card}</Link>
          ) : (
            <div key={s.label}>{card}</div>
          )
        })}
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold text-gray-200">최근 문의</h2>
        </div>
        <div className="divide-y divide-gray-800">
          {recentInquiries?.length ? recentInquiries.map((inq) => (
            <div key={inq.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-200 line-clamp-1">
                  {inq.transcribed_text ?? inq.raw_text ?? '음성 문의'}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {inq.language?.toUpperCase()} · {new Date(inq.created_at).toLocaleDateString('ko-KR')}
                </p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                inq.status === 'answered'   ? 'bg-green-900 text-green-400' :
                inq.status === 'processing' ? 'bg-blue-900 text-blue-400'  :
                                              'bg-yellow-900 text-yellow-400'
              }`}>
                {inq.status}
              </span>
            </div>
          )) : (
            <div className="px-6 py-10 text-center text-gray-600 text-sm">
              아직 문의가 없습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
