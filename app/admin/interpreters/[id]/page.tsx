import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, MessageSquare, Calendar, Users, Clock, CheckCircle, ArrowRight } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  pending:    '대기 중',
  processing: '진행 중',
  answered:   '답변 완료',
  completed:  '완료',
  confirmed:  '확정',
  cancelled:  '취소',
}

export default async function AdminInterpreterViewPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: interpreter } = await supabase
    .from('interpreters')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!interpreter) notFound()

  const [{ data: inquiries }, { data: bookings }] = await Promise.all([
    supabase.from('inquiries').select('id, status, created_at, language, raw_text, transcribed_text')
      .eq('interpreter_id', interpreter.id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase.from('bookings').select('id, status, visit_date, visit_time, patient_name, hospitals(name)')
      .eq('interpreter_id', interpreter.id)
      .order('visit_date', { ascending: false })
      .limit(10),
  ])

  // 고객 중복 제거
  const seen = new Set<string>()
  const customers = (bookings ?? []).filter((b: any) => {
    if (!b.patient_name || seen.has(b.patient_name)) return false
    seen.add(b.patient_name)
    return true
  })

  const stats = [
    { label: '진행 중 계약', value: (inquiries ?? []).filter((i: any) => i.status !== 'completed').length, icon: MessageSquare, color: 'text-blue-400 bg-blue-500/10' },
    { label: '완료 건수',    value: interpreter.completed_count ?? 0, icon: CheckCircle, color: 'text-green-400 bg-green-500/10' },
    { label: '예정 예약',    value: (bookings ?? []).filter((b: any) => b.status !== 'cancelled').length, icon: Calendar, color: 'text-purple-400 bg-purple-500/10' },
    { label: '담당 고객',    value: customers.length, icon: Users, color: 'text-amber-400 bg-amber-500/10' },
  ]

  return (
    <div className="p-8">
      {/* 상단 네비 */}
      <div className="mb-6">
        <Link href="/admin/interpreters" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 mb-4 transition-colors">
          <ChevronLeft className="w-4 h-4" />
          통역사 목록으로
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-blue-400">
              {(interpreter.name ?? interpreter.email ?? '?')[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{interpreter.name ?? '이름 없음'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {interpreter.email}
              {interpreter.level ? ` · ${interpreter.level}` : ''}
              {interpreter.rating ? ` · ⭐ ${Number(interpreter.rating).toFixed(1)}` : ''}
            </p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              interpreter.available ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'
            }`}>
              {interpreter.available ? '● 활동 중' : '● 비활동'}
            </span>
          </div>
        </div>
      </div>

      {/* 어드민 뷰 배너 */}
      <div className="mb-6 px-4 py-3 bg-amber-900/20 border border-amber-800/40 rounded-xl">
        <p className="text-xs text-amber-400 font-medium">👁 관리자 모드 — {interpreter.name ?? interpreter.email} 통역사의 화면을 보고 있습니다.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 계약 관리 */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            <h2 className="font-semibold text-gray-200">최근 계약</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {(inquiries ?? []).length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-600 text-sm">담당 계약이 없습니다.</div>
            ) : (inquiries ?? []).map((inq: any) => (
              <div key={inq.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 line-clamp-1">{inq.transcribed_text ?? inq.raw_text ?? '음성 문의'}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {inq.language?.toUpperCase()} · {new Date(inq.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <span className={`ml-4 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                  inq.status === 'completed'  ? 'bg-green-900/50 text-green-400' :
                  inq.status === 'processing' ? 'bg-blue-900/50 text-blue-400'  :
                                                'bg-yellow-900/50 text-yellow-400'
                }`}>{STATUS_LABEL[inq.status] ?? inq.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 예약 관리 */}
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <h2 className="font-semibold text-gray-200">예약 목록</h2>
          </div>
          <div className="divide-y divide-gray-800">
            {(bookings ?? []).length === 0 ? (
              <div className="px-6 py-10 text-center text-gray-600 text-sm">담당 예약이 없습니다.</div>
            ) : (bookings ?? []).map((bk: any) => (
              <div key={bk.id} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-gray-200">{bk.hospitals?.name ?? '-'}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{bk.visit_date} {bk.visit_time} · {bk.patient_name ?? '환자명 없음'}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  bk.status === 'confirmed' ? 'bg-green-900/50 text-green-400' :
                  bk.status === 'completed' ? 'bg-blue-900/50 text-blue-400'  :
                  bk.status === 'cancelled' ? 'bg-red-900/50 text-red-400'    :
                                              'bg-yellow-900/50 text-yellow-400'
                }`}>{STATUS_LABEL[bk.status] ?? bk.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
