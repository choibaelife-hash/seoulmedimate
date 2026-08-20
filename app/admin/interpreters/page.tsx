import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Languages, ArrowRight, Star } from 'lucide-react'

export default async function AdminInterpretersPage() {
  const supabase = await createClient()

  const { data: interpreters } = await supabase
    .from('interpreters')
    .select('id, name, email, level, rating, completed_count, available, languages, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">통역사 관리</h1>
        <p className="text-sm text-gray-500 mt-1">통역사를 선택하면 해당 통역사의 화면을 볼 수 있습니다.</p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
          <Languages className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold text-gray-200">전체 통역사 ({(interpreters ?? []).length}명)</h2>
        </div>

        {(interpreters ?? []).length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-600 text-sm">
            등록된 통역사가 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {(interpreters ?? []).map((interp: any) => (
              <div key={interp.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-blue-600/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-400">
                      {(interp.name ?? interp.email ?? '?')[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-200">{interp.name ?? '이름 없음'}</p>
                      <span className={`w-1.5 h-1.5 rounded-full ${interp.available ? 'bg-green-400' : 'bg-gray-600'}`} />
                      <span className="text-xs text-gray-500">{interp.available ? '활동 중' : '비활동'}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {interp.email} · {interp.level ?? '-'}
                      {interp.rating ? ` · ⭐ ${Number(interp.rating).toFixed(1)}` : ''}
                    </p>
                    {interp.languages?.length ? (
                      <p className="text-xs text-gray-600 mt-0.5">
                        {(interp.languages as string[]).join(', ')}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right mr-2">
                    <p className="text-xs text-gray-500">완료</p>
                    <p className="text-sm font-semibold text-white">{interp.completed_count ?? 0}건</p>
                  </div>
                  <Link
                    href={`/admin/interpreters/${interp.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium rounded-lg transition-colors"
                  >
                    화면 보기
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
