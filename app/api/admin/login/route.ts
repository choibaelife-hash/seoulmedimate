import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, ADMIN_MAX_AGE, createAdminSession } from '@/lib/admin-session'

export async function POST(req: Request) {
  const { id, password } = await req.json()

  // 예비값(admin/1111)을 두면 환경변수가 빠졌을 때 누구나 들어올 수 있어 제거했다.
  const adminId = process.env.ADMIN_ID
  const adminPw = process.env.ADMIN_PASSWORD
  if (!adminId || !adminPw) {
    console.error('ADMIN_ID / ADMIN_PASSWORD 환경변수가 설정되지 않았습니다.')
    return NextResponse.json({ ok: false, message: '서버 설정 오류입니다.' }, { status: 500 })
  }

  if (id !== adminId || password !== adminPw) {
    return NextResponse.json(
      { ok: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' },
      { status: 401 }
    )
  }

  const token = await createAdminSession()
  if (!token) {
    console.error('ADMIN_SESSION_SECRET 환경변수가 설정되지 않았습니다.')
    return NextResponse.json({ ok: false, message: '서버 설정 오류입니다.' }, { status: 500 })
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_MAX_AGE,
    path: '/',
  })
  return res
}
