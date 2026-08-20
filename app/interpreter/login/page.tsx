'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Languages, Loader2, AlertCircle, ShieldX } from 'lucide-react'
import Link from 'next/link'

export default function InterpreterLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  // Google OAuth 후 ?check=1 파라미터로 돌아왔을 때 승인 여부 확인
  useEffect(() => {
    const check = searchParams.get('check')
    if (!check) return
    setChecking(true)
    const verifyApproval = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setChecking(false); return }
      const { data: app } = await supabase
        .from('interpreter_applications')
        .select('status')
        .eq('email', user.email!)
        .maybeSingle()
      if (app?.status === 'approved') {
        router.push('/interpreter')
      } else {
        await supabase.auth.signOut()
        setError('승인되지 않았습니다. 관리자 승인 후 로그인이 가능합니다.')
        setChecking(false)
      }
    }
    verifyApproval()
  }, [])

  const checkApproval = async (userEmail: string): Promise<boolean> => {
    const { data: app } = await supabase
      .from('interpreter_applications')
      .select('status')
      .eq('email', userEmail)
      .maybeSingle()
    return app?.status === 'approved'
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('이메일 또는 비밀번호가 올바르지 않습니다.'); setLoading(false); return }

    const approved = await checkApproval(data.user.email!)
    if (!approved) {
      await supabase.auth.signOut()
      setError('승인되지 않았습니다. 관리자 승인 후 로그인이 가능합니다.')
      setLoading(false)
      return
    }
    router.push('/interpreter')
    router.refresh()
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/interpreter/login?check=1` },
    })
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a3a5c] mx-auto mb-3" />
          <p className="text-sm text-gray-500">승인 상태 확인 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1a3a5c] rounded-2xl mb-4">
            <Languages className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">통역사 로그인</h1>
          <p className="text-sm text-gray-500 mt-1">SeoulMediMate 통역사 포털</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-5 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <ShieldX className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">승인되지 않았습니다</p>
                <p className="text-red-500 text-xs mt-0.5">관리자 승인 후 로그인이 가능합니다.</p>
              </div>
            </div>
          )}

          <button onClick={handleGoogle} disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors font-medium mb-6 disabled:opacity-50">
            {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Google로 계속하기
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">또는</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">이메일</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="interpreter@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">비밀번호</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c] focus:border-transparent" />
            </div>
            <button type="submit" disabled={loading || googleLoading}
              className="w-full bg-[#1a3a5c] text-white py-3 rounded-lg font-semibold hover:bg-[#0f2540] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> 로그인 중...</> : '로그인'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            통역사 등록을 원하시나요?{' '}
            <Link href="/interpreter/signup" className="text-[#2e86c1] hover:underline font-medium">신청하기</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
