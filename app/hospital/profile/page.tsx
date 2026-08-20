import { createClient as createSupabaseClient } from '@/lib/supabase/server'

import { redirect } from 'next/navigation'
import HospitalProfileClient from './ProfileClient'

export default async function HospitalProfilePage() {
  const supabase = await createSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/en/auth/login')

  const { data: hospital } = await supabase
    .from('hospitals')
    .select('*')
    .eq('email', user.email)
    .single()

  return <HospitalProfileClient hospital={hospital} />
}
