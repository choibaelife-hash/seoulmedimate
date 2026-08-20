import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const locales = ['en', 'de', 'fr', 'es', 'it', 'pl', 'pt'] as const
const defaultLocale = 'en'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
})

// 로그인 필요한 경로 (Supabase auth)
const protectedPatterns = [
  /^\/[a-z]{2}\/inquiry/,
  /^\/[a-z]{2}\/dashboard/,
  /^\/[a-z]{2}\/bookings/,
]

// Supabase auth 필요한 포털 (로그인/회원가입/온보딩 제외)
const portalPaths = ['/interpreter', '/hospital']
const portalLoginPaths = [
  '/interpreter/login', '/hospital/login',
  '/interpreter/signup', '/hospital/signup',
  '/interpreter/onboarding', '/hospital/onboarding',
]

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // API, 정적 파일 제외
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 어드민 경로 처리 (쿠키 기반 인증)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') return NextResponse.next()
    const session = request.cookies.get('admin_session')
    if (!session?.value) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    return NextResponse.next()
  }

  // 통역사/병원 포털 (로그인/회원가입/온보딩은 통과 — x-pathname 헤더 포함)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)
  const isPortalLogin = portalLoginPaths.some(p => pathname.startsWith(p))
  if (isPortalLogin) return NextResponse.next({ request: { headers: requestHeaders } })

  const isPortal = portalPaths.some(p => pathname.startsWith(p))
  if (isPortal) {
    return await checkSupabaseAuth(request)
  }

  // 일반 경로: intl 미들웨어 적용
  const response = intlMiddleware(request)

  // 보호된 경로 Auth 체크
  const isProtected = protectedPatterns.some(p => p.test(pathname))
  if (isProtected) {
    return await checkSupabaseAuth(request, response)
  }

  return response
}

async function checkSupabaseAuth(
  request: NextRequest,
  response?: NextResponse
): Promise<NextResponse> {
  const res = response ?? NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const pathname = request.nextUrl.pathname
    // 포털이면 해당 포털 로그인으로
    if (pathname.startsWith('/interpreter')) {
      return NextResponse.redirect(new URL('/interpreter/login', request.url))
    }
    if (pathname.startsWith('/hospital')) {
      return NextResponse.redirect(new URL('/hospital/login', request.url))
    }
    const locale = pathname.split('/')[1] || 'en'
    const loginUrl = new URL(`/${locale}/auth/login`, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
