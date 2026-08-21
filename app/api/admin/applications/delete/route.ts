import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-session'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
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

  // 먼저 이메일 조회
  const { data: record, error: fetchError } = await supabase
    .from(table)
    .select('email')
    .eq('id', id)
    .single()

  if (fetchError || !record) {
    return NextResponse.json({ error: '신청 정보를 찾을 수 없습니다.' }, { status: 404 })
  }

  // 신청 레코드 삭제
  const { error: deleteError } = await supabase.from(table).delete().eq('id', id)
  if (deleteError) {
    console.error('Delete error:', deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 500 })
  }

  // Auth 유저 삭제 (이메일로 유저 찾아서 삭제)
  const { data: users } = await supabase.auth.admin.listUsers()
  const authUser = users?.users?.find(u => u.email === record.email)
  if (authUser) {
    await supabase.auth.admin.deleteUser(authUser.id)
  }

  return NextResponse.json({ ok: true })
}
