import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Mic, MessageSquare, ArrowRight, Clock } from 'lucide-react'

export default async function InterpreterInquiriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/interpreter/login')

  const { data: interpreter } = await supabase
    .from('interpreters').select('id').eq('user_id', user.id).single()
  if (!interpreter) redirect('/interpreter/login')

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*, users!patient_id(name, email)')
    .eq('interpreter_id', interpreter.id)
    .order('created_at', { ascending: false })

  const pending = inquiries?.filter(i => ['assigned', 'processing'].includes(i.status)) ?? []
  const done    = inquiries?.filter(i => i.status === 'answered') ?? []

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[#1a3a5c] mb-1">문의 목록</h1>
      <p className="text-sm text-gray-500 mb-8">배정된 고객 문의를 확인하고 처리합니다.</p>

      {/* 대기 중 */}
      <section className="mb-10">
        <h2 className="text-base font-semibold text-[#1a3a5c] mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-yellow-500" />
          처리 대기 <span className="text-yellow-600 bg-yellow-50 text-xs px-2 py-0.5 rounded-full">{pending.length}</span>
        </h2>
        {pending.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
            대기 중인 문의가 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((inq) => (
              <Link key={inq.id} href={`/interpreter/inquiries/${inq.id}`}
                className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-[#2e86c1] hover:shadow-sm transition-all">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${inq.audio_url ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    {inq.audio_url ? <Mic className="w-4 h-4 text-purple-600" /> : <MessageSquare className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 uppercase">{inq.language}</span>
                      <span className="text-xs text-gray-400">{new Date(inq.created_at).toLocaleDateString('ko-KR')}</span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-2">
                      {inq.transcribed_text ?? inq.raw_text ?? '음성 문의 — 클릭하여 확인'}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 완료 */}
      <section>
        <h2 className="text-base font-semibold text-gray-500 mb-3">완료된 문의 ({done.length})</h2>
        {done.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-400 text-sm">
            완료된 문의가 없습니다.
          </div>
        ) : (
          <div className="space-y-2">
            {done.map((inq) => (
              <Link key={inq.id} href={`/interpreter/inquiries/${inq.id}`}
                className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors opacity-70 hover:opacity-100">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${inq.audio_url ? 'bg-purple-100' : 'bg-blue-100'}`}>
                    {inq.audio_url ? <Mic className="w-3.5 h-3.5 text-purple-500" /> : <MessageSquare className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700 line-clamp-1">
                      {inq.transcribed_text ?? inq.raw_text ?? '음성 문의'}
                    </p>
                    <p className="text-xs text-gray-400">{new Date(inq.created_at).toLocaleDateString('ko-KR')} · {inq.language?.toUpperCase()}</p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">완료</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
