import { createClient as createSupabaseClient } from '@/lib/supabase/server'

import { redirect } from 'next/navigation'
import InterpreterProfileClient from './ProfileClient'

export default async function InterpreterProfilePage() {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/en/auth/login')

  const [{ data: profile }, { data: interpreter }] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).single(),
    supabase.from('interpreters').select('*').eq('user_id', user.id).single(),
  ])

  return <InterpreterProfileClient profile={profile} interpreter={interpreter} userId={user.id} />
}
