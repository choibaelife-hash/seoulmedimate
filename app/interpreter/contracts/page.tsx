import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MessageSquare, ArrowRight } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  pending:    '대기 중',
  processing: '진행 중',
  answered:   '답변 완료',
  completed:  '완료',
}

export default async function InterpreterContractsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/interpreter/login')

  const { data: interpreter } = await supabase
    .from('interpreters')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('id, status, created_at, language, raw_text, transcribed_text')
    .eq('interpreter_id', interpreter?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">계약 관리</h1>
        <p className="text-sm text-gray-500 mt-1">담당 계약(문의) 현황입니다.</p>
      </div>

      <div className="bg-gray-900 rounded-xl border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <h2 className="font-semibold text-gray-200">전체 계약 ({(inquiries ?? []).length}건)</h2>
        </div>

        {(inquiries ?? []).length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-600 text-sm">
            아직 담당한 계약이 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {(inquiries ?? []).map((inq: any) => (
              <Link
                key={inq.id}
                href={`/interpreter/inquiries/${inq.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 line-clamp-1">
                    {inq.transcribed_text ?? inq.raw_text ?? '음성 문의'}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {inq.language?.toUpperCase()} · {new Date(inq.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                    inq.status === 'completed'  ? 'bg-green-900/50 text-green-400' :
                    inq.status === 'processing' ? 'bg-blue-900/50 text-blue-400'   :
                    inq.status === 'answered'   ? 'bg-purple-900/50 text-purple-400':
                                                  'bg-yellow-900/50 text-yellow-400'
                  }`}>{STATUS_LABEL[inq.status] ?? inq.status}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600 flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
