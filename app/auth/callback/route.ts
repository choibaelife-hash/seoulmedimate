import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PKCE(@supabase/ssr 기본값) OAuth 콜백.
// 구글 인증 후 ?code= 를 들고 여기로 돌아오며, 그 코드를 세션으로 교환해야
// 인증 쿠키가 만들어진다. 이 단계가 없으면 auth.users 에 계정은 생기지만
// 브라우저는 계속 로그아웃 상태로 보인다.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // next 는 외부 입력이므로 오픈 리다이렉트를 막기 위해 내부 경로만 허용한다.
  // '//evil.com' 은 프로토콜 상대 URL 이라 반드시 함께 걸러야 한다.
  const raw = searchParams.get('next') ?? '/'
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  // 실패 시 조용히 넘기지 않고 해당 로그인 화면으로 되돌린다.
  return NextResponse.redirect(`${origin}${loginPathFor(next)}?error=oauth`)
}

function loginPathFor(next: string) {
  if (next.startsWith('/interpreter')) return '/interpreter/login'
  if (next.startsWith('/hospital')) return '/hospital/login'
  return '/'
}
