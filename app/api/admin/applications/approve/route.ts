import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  // 어드민 인증 확인
  const cookieStore = cookies()
  if (!(await verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const id = formData.get('id') as string
  const type = formData.get('type') as string // 'interpreter' | 'hospital'

  if (!id || !type) {
    return NextResponse.json({ error: 'Missing id or type' }, { status: 400 })
  }

  const table = type === 'interpreter' ? 'interpreter_applications' : 'hospital_applications'

  const { error } = await supabase
    .from(table)
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    console.error('Approve error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 리디렉트 (탭 유지)
  const tab = type === 'interpreter' ? 'interpreter' : 'hospital'
  return NextResponse.redirect(new URL(`/admin/applications?tab=${tab}`, request.url))
}
