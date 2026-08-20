import { createClient as createSupabaseClient } from '@/lib/supabase/server'

import { notFound, redirect } from 'next/navigation'
import InterpreterInquiryClient from './InquiryClient'

export default async function InterpreterInquiryPage({ params: { id } }: { params: { id: string } }) {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/en/auth/login')

  const { data: interpreter } = await supabase.from('interpreters').select('id').eq('user_id', user.id).single()
  if (!interpreter) notFound()

  const { data: inquiry } = await supabase
    .from('inquiries')
    .select('*, patients:users!patient_id(name, language)')
    .eq('id', id)
    .eq('interpreter_id', interpreter.id)
    .single()

  if (!inquiry) notFound()

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('inquiry_id', id)
    .order('created_at', { ascending: true })

  return (
    <InterpreterInquiryClient
      inquiry={inquiry}
      messages={messages ?? []}
      interpreterId={interpreter.id}
      userId={user.id}
    />
  )
}
