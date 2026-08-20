import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { id, password } = await req.json()

  if (
    id === (process.env.ADMIN_ID ?? 'admin') &&
    password === (process.env.ADMIN_PASSWORD ?? '1111')
  ) {
    const res = NextResponse.json({ ok: true })
    res.cookies.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8, // 8시간
      path: '/',
    })
    return res
  }

  return NextResponse.json({ ok: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
}
