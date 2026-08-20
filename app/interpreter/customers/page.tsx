import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Users } from 'lucide-react'

export default async function InterpreterCustomersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/interpreter/login')

  const { data: interpreter } = await supabase
    .from('interpreters')
    .select('id')
    .eq('user_id', user.id)
    .single()

  // 해당 통역사가 담당한 예약에서 고객(환자) 목록 조회
  const { data: bookings } = await supabase
    .from('bookings')
    .select('id, status, visit_date, visit_time, patient_name, patient_nationality, hospitals(name)')
    .eq('interpreter_id', interpreter?.id)
    .order('visit_date', { ascending: false })

  // 중복 제거 - patient_name 기준
  const seen = new Set<string>()
  const customers = (bookings ?? []).filter((b: any) => {
    if (!b.patient_name || seen.has(b.patient_name)) return false
    seen.add(b.patient_name)
    return true
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">고객 관리</h1>
        <p className="text-sm text-gray-500 mt-1">담당한 고객(환자) 목록입니다.</p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold text-gray-200">전체 고객 ({customers.length}명)</h2>
        </div>

        {customers.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-600 text-sm">
            아직 담당한 고객이 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {customers.map((c: any) => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-200">{c.patient_name ?? '이름 미입력'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {c.patient_nationality ?? '-'} · {(c.hospitals as any)?.name ?? '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{c.visit_date}</p>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full mt-1 inline-block ${
                    c.status === 'confirmed' ? 'bg-green-900/50 text-green-400' :
                    c.status === 'completed' ? 'bg-blue-900/50 text-blue-400' :
                    'bg-yellow-900/50 text-yellow-400'
                  }`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
