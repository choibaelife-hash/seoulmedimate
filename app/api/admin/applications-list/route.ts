import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-session'

export async function GET(request: NextRequest) {
  // 어드민 인증 확인
  const cookieStore = cookies()
  if (!(await verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [{ data: interpreters, error: e1 }, { data: hospitals, error: e2 }] = await Promise.all([
    supabase.from('interpreter_applications').select('*').order('created_at', { ascending: false }),
    supabase.from('hospital_applications').select('*').order('created_at', { ascending: false }),
  ])

  if (e1) console.error('[applications-list] interpreter_applications error:', e1.message)
  if (e2) console.error('[applications-list] hospital_applications error:', e2.message)

  return NextResponse.json({
    interpreters: interpreters ?? [],
    hospitals: hospitals ?? [],
    errors: {
      interpreters: e1?.message ?? null,
      hospitals: e2?.message ?? null,
    },
  })
}
