// 어드민 세션 토큰. 서버만 만들 수 있는 서명값이라 브라우저에서 위조할 수 없다.
//
// 이전에는 쿠키 값이 'authenticated' 라는 고정 문자열이라,
// 개발자도구에서 쿠키만 심으면 로그인 없이 /admin 전체가 열렸다.
//
// Edge 미들웨어와 Route Handler 양쪽에서 쓰이므로 Node 의 crypto 모듈이 아니라
// 두 런타임에 모두 있는 Web Crypto(crypto.subtle)를 사용한다.

export const ADMIN_COOKIE = 'admin_session'
export const ADMIN_MAX_AGE = 60 * 60 * 8 // 8시간

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null
}

async function hmacHex(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// 앞에서부터 비교하다 다르면 즉시 반환하는 방식은 응답 시간으로 정답을 추측당할 수 있다.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

/** 만료시각과 그 서명을 담은 토큰을 만든다. 시크릿이 없으면 발급하지 않는다. */
export async function createAdminSession(): Promise<string | null> {
  const secret = getSecret()
  if (!secret) return null
  const exp = Math.floor(Date.now() / 1000) + ADMIN_MAX_AGE
  return `${exp}.${await hmacHex(String(exp), secret)}`
}

/** 서명과 만료를 함께 검증한다. 시크릿이 없으면 통과시키지 않는다(fail closed). */
export async function verifyAdminSession(token: string | undefined | null): Promise<boolean> {
  const secret = getSecret()
  if (!secret || !token) return false

  const dot = token.indexOf('.')
  if (dot <= 0) return false
  const expStr = token.slice(0, dot)
  const sig = token.slice(dot + 1)

  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp * 1000 <= Date.now()) return false

  return timingSafeEqual(sig, await hmacHex(expStr, secret))
}
