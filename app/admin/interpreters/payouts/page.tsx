import { createClient } from '@/lib/supabase/server'
import { CreditCard, TrendingUp } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  pending: '정산 대기',
  paid:    '정산 완료',
  hold:    '보류',
}

export default async function AdminInterpreterPayoutsPage() {
  const supabase = await createClient()

  // 통역사 목록 + 완료 건수 조회
  const { data: interpreters } = await supabase
    .from('interpreters')
    .select('id, name, email, completed_count, level')
    .order('completed_count', { ascending: false })

  // 정산 내역
  const { data: payouts } = await supabase
    .from('payouts')
    .select('id, amount, status, created_at, interpreters(name, email)')
    .order('created_at', { ascending: false })
    .limit(50)

  const totalPaid    = (payouts ?? []).filter((p: any) => p.status === 'paid').reduce((s: number, p: any) => s + (p.amount ?? 0), 0)
  const totalPending = (payouts ?? []).filter((p: any) => p.status === 'pending').reduce((s: number, p: any) => s + (p.amount ?? 0), 0)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">통역사 정산</h1>
        <p className="text-sm text-gray-500 mt-1">통역사별 정산 내역을 관리합니다.</p>
      </div>

      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: '정산 완료 누적',  value: `₩${totalPaid.toLocaleString()}`,    color: 'text-green-400 bg-green-500/10',  icon: TrendingUp },
          { label: '정산 대기',       value: `₩${totalPending.toLocaleString()}`,  color: 'text-amber-400 bg-amber-500/10',  icon: CreditCard },
          { label: '등록 통역사',     value: `${(interpreters ?? []).length}명`,    color: 'text-blue-400 bg-blue-500/10',    icon: CreditCard },
        ].map((s) => (
          <div key={s.label} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 정산 내역 */}
      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold text-gray-200">정산 내역</h2>
        </div>
        {(payouts ?? []).length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-600 text-sm">정산 내역이 없습니다.</div>
        ) : (
          <div className="divide-y divide-gray-800">
            {(payouts ?? []).map((p: any) => (
              <div key={p.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-200">
                    {p.interpreters?.name ?? p.interpreters?.email ?? '통역사'}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {new Date(p.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold text-white">₩{(p.amount ?? 0).toLocaleString()}</p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    p.status === 'paid'    ? 'bg-green-900/50 text-green-400'  :
                    p.status === 'hold'    ? 'bg-red-900/50 text-red-400'      :
                                            'bg-amber-900/50 text-amber-400'
                  }`}>{STATUS_LABEL[p.status] ?? p.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
